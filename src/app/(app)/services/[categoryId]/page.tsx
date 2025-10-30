'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'

type Service = {
  id: string
  title: string
  description?: string
  basePrice?: string
  durationMin?: number
}

export default function ServicesByCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getServicesByCategory/${categoryId}?page=1&limit=50`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        const data = await res.json()
        setServices(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }
    if (categoryId) fetchServices()
  }, [categoryId])

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="p-6 bg-[var(--color-navy)] min-h-screen font-sans text-[var(--color-cream)] max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button plain onClick={() => router.back()} className="mb-2 text-[var(--color-cream)] hover:text-[var(--color-saffron)]">
              ← Back
            </Button>
            <Heading className="text-[var(--color-cream)]">Services</Heading>
          </div>
          <Button
            href={`/services/${categoryId}/new`}
            color="saffron"
            className="whitespace-nowrap font-semibold px-6 py-2.5"
          >
            Add Service
          </Button>
        </div>

        {loading && <p className="text-[var(--color-cream)]">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && services.length === 0 && (
          <div className="text-center py-16 bg-[var(--color-cream)] rounded-xl border border-[var(--color-earth)] shadow-sm text-[var(--color-maroon)]">
            <p className="mb-4">No services found.</p>
            <Button
  href="/services/123/new"
  color="saffron"
  className="px-6 py-2 font-semibold"
>
  Create First Service
</Button>

          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/service/${s.id}`}
              className="block p-5 rounded-lg border border-[var(--color-earth)] bg-[var(--color-cream)] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-lg font-semibold text-[var(--color-maroon)]">{s.title}</div>
              {s.description && (
                <p className="text-sm text-[var(--color-secondary)] mt-1">{s.description}</p>
              )}
              <div className="flex justify-between items-center mt-4 text-[var(--color-maroon)]">
                {s.basePrice && <div className="font-semibold">₹{s.basePrice}</div>}
                {s.durationMin && <div className="text-xs text-[var(--color-secondary)]">{s.durationMin} min</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ApplicationLayout>
  )
}

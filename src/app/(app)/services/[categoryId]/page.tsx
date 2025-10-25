'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'  // ⭐ Fixed path
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
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
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
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button plain onClick={() => router.back()} className="mb-2">← Back</Button>
            <Heading>Services</Heading>
          </div>
          <Button href={`/services/${categoryId}/new`} className="bg-[var(--color-primary)] text-white">Add Service</Button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <p className="mb-4">No services found.</p>
            <Button href={`/services/${categoryId}/new`} className="bg-[var(--color-primary)] text-white">Create First Service</Button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={`/services/service/${s.id}`} className="p-4 rounded-lg border hover:shadow-md transition">
              <div className="font-medium">{s.title}</div>
              {s.description && <div className="text-sm text-gray-600 mt-1">{s.description}</div>}
              <div className="flex justify-between items-center mt-3">
                {s.basePrice && <div className="text-sm font-semibold">₹{s.basePrice}</div>}
                {s.durationMin && <div className="text-xs text-gray-500">{s.durationMin} min</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ApplicationLayout>
  )
}

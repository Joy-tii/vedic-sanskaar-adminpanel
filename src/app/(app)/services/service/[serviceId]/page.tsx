'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'

type ServiceDetail = {
  id: string
  name?: string
  description?: string
  duration?: string
  price?: number
  active: boolean
  category?: {
    id: string
    name: string
  }
  panditExpertise?: Array<{
    panditName: string
    experienceLevel: string
  }>
  panditPricing?: any[]
}


export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string

  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getServiceById/${serviceId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Service not found')
        setService(data.service || data.data || null)
      } catch (err: any) {
        setError(err.message || 'Failed to load service')
      } finally {
        setLoading(false)
      }
    }
    if (serviceId) fetchService()
  }, [serviceId])

  if (loading) return <ApplicationLayout events={[]} contentWide><p className="p-6 text-center">Loading service details...</p></ApplicationLayout>
  if (error) return <ApplicationLayout events={[]} contentWide><p className="p-6 text-center text-red-600">{error}</p></ApplicationLayout>
  if (!service) return <ApplicationLayout events={[]} contentWide><p className="p-6 text-center">Service not found.</p></ApplicationLayout>

 return (
  <ApplicationLayout events={[]} contentWide>
    <div className="max-w-3xl mx-auto p-6 bg-[var(--color-cream)] rounded-lg border border-[var(--color-earth)] font-sans text-[var(--color-maroon)] shadow-lg">
      <Button plain onClick={() => router.back()} className="mb-6 text-[var(--color-maroon)] hover:text-[var(--color-saffron)]">
        ← Back
      </Button>

      {/* Service Name missing in API, so show ID or fallback */}
      <Heading className="mb-6">{service.name || service.id}</Heading>

      <p className="text-sm text-[var(--color-secondary)] mb-4 whitespace-pre-line">{service.description}</p>

      {service.category && (
        <div className="text-sm text-[var(--color-secondary)] mb-4">
          Category: <span className="font-medium">{service.category.name}</span>
        </div>
      )}

      <div className="mt-6">
        <p className="font-semibold">
          Status: {service.active ? 'Active' : 'Inactive'}
        </p>
      </div>

      {/* Show pandit info if any */}
      {service.panditExpertise && service.panditExpertise.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Available Pandits:</h3>
          <ul className="list-disc list-inside text-[var(--color-maroon)] text-sm space-y-1">
            {service.panditExpertise.map((pe, i) => (
              <li key={i}>{pe.panditName} <span className="text-[var(--color-secondary)]">({pe.experienceLevel})</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </ApplicationLayout>
)

}

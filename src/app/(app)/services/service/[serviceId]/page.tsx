'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '../../../application-layout'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/button'

type ServiceDetail = {
  id: string  // ⭐ Changed from _id
  name: string
  description?: string
  duration?: string
  price?: number
  category?: {
    id: string
    name: string
  }
  panditExpertise?: any[]
  panditPricing?: any[]
}

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.serviceId as string
  const router = useRouter()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchService() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getServiceById/${serviceId}`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        })
        const data = await res.json()
        console.log('📦 Service detail:', data)
        setService(data.service || null)
      } catch (err: any) {
        console.error('❌ Error:', err)
        setError('Failed to load service')
      } finally {
        setLoading(false)
      }
    }
    if (serviceId) fetchService()
  }, [serviceId])

  if (loading) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6">Loading...</p></ApplicationLayout>
  if (error) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6 text-red-500">{error}</p></ApplicationLayout>
  if (!service) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6">Service not found.</p></ApplicationLayout>

  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="p-6 max-w-3xl mx-auto">
        <Button plain onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold mb-2">{service.name}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-4">{service.description}</p>
        
        {service.category && (
          <div className="text-sm text-[var(--text-secondary)] mb-2">
            Category: <span className="font-medium">{service.category.name}</span>
          </div>
        )}
        
        <div className="flex gap-4 items-center mt-4">
          {service.price != null && (
            <div className="text-lg font-semibold">Price: ₹{service.price}</div>
          )}
          {service.duration && (
            <div className="text-sm text-[var(--text-secondary)]">Duration: {service.duration}</div>
          )}
        </div>

        {service.panditExpertise && service.panditExpertise.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Available Pandits:</h3>
            <ul className="list-disc list-inside">
              {service.panditExpertise.map((pe, idx) => (
                <li key={idx} className="text-sm">{pe.panditName} ({pe.experienceLevel})</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={() => router.push(`/bookings/new?serviceId=${service.id}`)}  // ⭐ Use id
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
          >
            Book this service
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  )
}

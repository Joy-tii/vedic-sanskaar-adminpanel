'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'

interface BookingDetail {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  pandit: {
    id: string
    name: string
    image?: string
  }
  service: {
    id: string
    title: string
    price: number
  }
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getBookingById/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load booking')
        setBooking(data.booking)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (bookingId) fetchBooking()
  }, [bookingId])

  if (loading) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6">Loading...</p></ApplicationLayout>
  if (error) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6 text-red-500">{error}</p></ApplicationLayout>
  if (!booking) return <ApplicationLayout events={[]} contentWide={true}><p className="p-6">Booking not found</p></ApplicationLayout>

  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="max-w-3xl mx-auto p-6">
        <Button plain onClick={() => router.back()} className="mb-4">← Back</Button>
        <Heading className="mb-6">Booking Details</Heading>

        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{booking.service.title}</h3>
            <p className="text-sm text-gray-600">Pandit: {booking.pandit.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <p className="font-medium">
                {new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                {booking.endTime && ` - ${new Date(booking.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <p className="font-semibold text-[var(--color-primary)]">₹{booking.service.price}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium">{booking.status}</p>
            </div>
          </div>

          {booking.notes && (
            <div>
              <span className="text-gray-600 text-sm">Notes:</span>
              <p className="text-sm mt-1">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
    </ApplicationLayout>
  )
}

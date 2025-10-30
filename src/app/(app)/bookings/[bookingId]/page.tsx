'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'

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
    price: string | number
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
    const fetchBooking = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No token found.')

        const res = await fetch(`${API_BASE_URL}/api/bookings/getBookingById/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load booking')
        setBooking(data.data)  // corrected here to data.data
      } catch (err: any) {
        setError(err.message || 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) fetchBooking()
  }, [bookingId])

  if (loading)
    return (
      <ApplicationLayout events={[]} contentWide>
        <p className="p-6 text-center text-[var(--color-cream)]">Loading booking details...</p>
      </ApplicationLayout>
    )

  if (error)
    return (
      <ApplicationLayout events={[]} contentWide>
        <p className="p-6 text-center text-red-600">{error}</p>
        <div className="p-6 text-center">
          <Button onClick={() => router.back()} color="saffron">
            Back
          </Button>
        </div>
      </ApplicationLayout>
    )

  if (!booking)
    return (
      <ApplicationLayout events={[]} contentWide>
        <p className="p-6 text-center text-[var(--color-cream)]">Booking not found.</p>
        <div className="p-6 text-center">
          <Button onClick={() => router.back()} color="saffron">
            Back
          </Button>
        </div>
      </ApplicationLayout>
    )

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="max-w-3xl mx-auto p-6 bg-[var(--color-cream)] rounded-lg shadow-lg border border-[var(--color-earth)] font-sans text-[var(--color-maroon)]">
        <Button plain onClick={() => router.back()} className="mb-6 text-[var(--color-maroon)] hover:text-[var(--color-saffron)]">
          ← Back
        </Button>
        <Heading className="mb-6">{booking.service.title}</Heading>

        <div className="space-y-6 text-[var(--color-maroon)]">
          <p><strong>Pandit:</strong> {booking.pandit.name}</p>
          <p>
            <strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-IN')}
          </p>
          <p>
            <strong>Time:</strong>{' '}
            {new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            {booking.endTime && ` - ${new Date(booking.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
          <p>
            <strong>Price:</strong> ₹{booking.service.price}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>
          {booking.notes && (
            <>
              <strong>Notes:</strong>
              <p>{booking.notes}</p>
            </>
          )}
        </div>
      </div>
    </ApplicationLayout>
  )
}

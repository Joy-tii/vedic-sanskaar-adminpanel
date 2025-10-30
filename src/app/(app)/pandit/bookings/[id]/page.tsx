'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPanditBookings } from '@/utils/api'
import BookingActions from '../../components/BookingActions'
import { Booking } from '../../components/BookingCard'

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params.id
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const data = await getPanditBookings()
      const b = (data.data || []).find((bk: Booking) => bk.id === bookingId)
      if (!b) throw new Error('Booking not found')
      setBooking(b)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!booking) return <p>Booking not found</p>

  return (
    <div className="p-6 bg-[var(--color-navy)] min-h-screen text-[var(--color-cream)]">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p><strong>Customer:</strong> {booking.customerName}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Status:</strong> {booking.status}</p>

      <BookingActions
        bookingId={booking.id}
        status={booking.status}
        onStatusChange={fetchBooking}
      />
    </div>
  )
}

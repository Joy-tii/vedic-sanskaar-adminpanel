'use client'
import React, { useEffect, useState } from 'react'
import { getPanditBookings } from '@/utils/api'
import BookingCard, { Booking } from '../components/BookingCard'
import BookingModal from '../components/BookingModal'

export default function PanditBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getPanditBookings()
      setBookings(data.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div className="p-6 bg-[var(--color-navy)] min-h-screen text-[var(--color-cream)]">
      <h1 className="text-2xl font-bold mb-4">Pandit Bookings</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            onClick={() => setSelectedBooking(b)}
          />
        ))}
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  )
}

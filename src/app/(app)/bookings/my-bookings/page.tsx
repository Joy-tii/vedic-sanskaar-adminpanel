'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  pandit: {
    id: string
    name: string
    image?: string | null
  }
  service: {
    id: string
    title: string
    price: string | number  // ⭐ Can be string or number
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        
        if (!token) {
          setError('Please log in to view bookings.')
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/bookings/getAllBookingsByUser`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        
        const data = await res.json()
        
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch bookings.')
        }
        
        // Support both response formats
        const bookingsData = data.bookings || data.data || []
        setBookings(bookingsData)
      } catch (err: any) {
        setError(err.message || 'Error loading bookings.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <ApplicationLayout events={[]} contentWide={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mb-4"></div>
            <p className="text-lg">Loading bookings...</p>
          </div>
        </div>
      </ApplicationLayout>
    )
  }

  if (error) {
    return (
      <ApplicationLayout events={[]} contentWide={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button href="/bookings/new" className="bg-[var(--color-primary)] text-white">
              Create New Booking
            </Button>
          </div>
        </div>
      </ApplicationLayout>
    )
  }

  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading className="text-3xl font-bold">My Bookings</Heading>
            <p className="text-[var(--text-secondary)] mt-1">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
          <Button 
            href="/bookings/new" 
            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-6 py-2.5"
          >
            + New Booking
          </Button>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--color-earth)]">
            <ClipboardDocumentCheckIcon className="h-16 w-16 text-[var(--text-secondary)] mb-4 opacity-50" />
            <p className="text-lg text-[var(--text-secondary)] mb-2">No bookings found.</p>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              You haven't created any bookings yet.
            </p>
            <Button href="/bookings/new" className="bg-[var(--color-primary)] text-white">
              Create Your First Booking
            </Button>
          </div>
        ) : (
          /* Bookings Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="cursor-pointer bg-[var(--bg-card)] border border-[var(--color-earth)] rounded-xl p-5 hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-200"
              >
                {/* Service Title */}
                <div className="flex items-start gap-3 mb-3">
                  <ClipboardDocumentCheckIcon className="h-6 w-6 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <h2 className="text-lg font-semibold text-[var(--text-main)] leading-tight">
                    {booking.service?.title || 'Unnamed Service'}
                  </h2>
                </div>

                {/* Pandit Info */}
                <div className="mb-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Pandit: <span className="font-medium text-[var(--text-main)]">
                      {booking.pandit?.name || 'N/A'}
                    </span>
                  </p>
                </div>

                {/* Date & Time */}
                <div className="text-sm text-[var(--text-secondary)] mb-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-[var(--color-primary)] font-medium">
                      {booking.date ? new Date(booking.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium text-[var(--text-main)]">
                      {booking.startTime ? new Date(booking.startTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not set'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                {booking.service?.price && (
                  <div className="text-sm mb-3">
                    <span className="text-[var(--text-secondary)]">Price: </span>
                    <span className="font-semibold text-[var(--color-primary)] text-base">
                      ₹{booking.service.price}
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status?.toUpperCase() === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : booking.status?.toUpperCase() === 'REQUESTED'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : booking.status?.toUpperCase() === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {booking.status || 'Unknown'}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    View details →
                  </span>
                </div>

                {/* Notes Preview */}
                {booking.notes && (
                  <p className="text-xs text-[var(--text-secondary)] mt-3 pt-3 border-t border-[var(--color-border)] line-clamp-2">
                    {booking.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ApplicationLayout>
  )
}

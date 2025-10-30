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
    price: string | number
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        if (!token) {
          setError('Please log in to view bookings.')
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/bookings/getAllBookingsByUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch bookings.')
        }

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
            <p className="text-lg text-[var(--color-cream)]">Loading bookings...</p>
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
            <Button href="/bookings/new" color="saffron" className="px-6 py-2 font-semibold">
              Create New Booking
            </Button>
          </div>
        </div>
      </ApplicationLayout>
    )
  }

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="min-h-screen bg-[var(--color-navy)] p-6 font-sans text-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Heading className="text-3xl font-bold text-white">My Bookings</Heading>
              <p className="text-white mt-1">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found</p>
            </div>
            <Button href="/bookings/new" color="saffron" className="px-6 py-2.5 font-semibold">
              + New Booking
            </Button>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-[var(--color-earth)] bg-[var(--color-cream)] shadow">
              <ClipboardDocumentCheckIcon className="h-16 w-16 text-[var(--color-secondary)] mb-4 opacity-60" />
              <p className="text-lg text-[var(--color-maroon)] mb-2">No bookings found.</p>
              <p className="text-sm text-[var(--color-secondary)] mb-4">You haven't created any bookings yet.</p>
              <Button href="/bookings/new" color="saffron" className="px-6 py-2 font-semibold">
                Create Your First Booking
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => router.push(`/bookings/${booking.id}`)}
                  className="cursor-pointer bg-[var(--color-cream)] border border-[var(--color-earth)] rounded-xl p-8 shadow-md hover:shadow-[0_8px_24px_rgba(251,176,61,0.4)] hover:border-[var(--color-saffron)] transition-all duration-300 ease-in-out transform hover:scale-[1.04]"
                  title={`View details of booking for ${booking.service?.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') router.push(`/bookings/${booking.id}`) }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <ClipboardDocumentCheckIcon className="h-8 w-8 text-[var(--color-saffron)] flex-shrink-0" />
                    <h2 className="text-2xl font-semibold text-[var(--color-maroon)] leading-tight">
                      {booking.service?.title || 'Unnamed Service'}
                    </h2>
                  </div>

                  <p className="text-base text-[var(--color-secondary)] mb-4">
                    Pandit: <span className="font-semibold text-[var(--color-maroon)]">{booking.pandit?.name || 'N/A'}</span>
                  </p>

                  <div className="mb-6 space-y-2 text-[var(--color-secondary)] text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-[var(--color-saffron)] font-semibold">
                        {booking.date
                          ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-semibold text-[var(--color-maroon)]">
                        {booking.startTime
                          ? new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : 'Not set'}
                      </span>
                    </div>
                  </div>

                  {booking.service?.price && (
                    <div className="text-sm mb-6">
                      <span className="text-[var(--color-secondary)] font-medium">Price: </span>
                      <span className="font-bold text-[var(--color-saffron)] text-lg">₹{booking.service.price}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                        booking.status?.toUpperCase() === 'CONFIRMED'
                          ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                          : booking.status?.toUpperCase() === 'REQUESTED'
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                          : booking.status?.toUpperCase() === 'COMPLETED'
                          ? 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                      }`}
                    >
                      {booking.status || 'Unknown'}
                    </span>
                    <span className="text-xs text-[var(--color-secondary)] font-medium cursor-pointer select-none">
                      View details →
                    </span>
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-[var(--color-secondary)] mt-6 pt-4 border-t border-[var(--color-earth)] line-clamp-2 font-light">
                      {booking.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ApplicationLayout>
  )
}

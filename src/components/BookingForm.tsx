'use client'

import React, { useState } from 'react'
import { API_BASE_URL } from '@/utils/api'

interface BookingFormProps {
  onSuccess?: () => void
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const [category, setCategory] = useState('')
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_BASE_URL}/api/bookings/createBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ categoryId: category, serviceId: service, date }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to create booking')
      }

      setSuccess(true)
      setCategory('')
      setService('')
      setDate('')
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-card)] dark:bg-[var(--color-maroon)] shadow-lg border border-[var(--color-earth)] p-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-[var(--color-maroon)] dark:text-[var(--color-cream)]">
          New Booking
        </h2>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-red-700 text-center">{error}</p>
        )}
        {success && (
          <p className="mb-4 rounded bg-green-100 p-2 text-green-700 text-center">
            Booking created successfully!
          </p>
        )}

        <div className="mb-4 flex flex-col">
          <label className="mb-1 text-sm font-medium text-[var(--text-main)] dark:text-[var(--color-cream)]">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter category ID"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] p-3 text-[var(--text-main)] dark:bg-[var(--color-earth)] dark:text-[var(--color-cream)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            required
          />
        </div>

        <div className="mb-4 flex flex-col">
          <label className="mb-1 text-sm font-medium text-[var(--text-main)] dark:text-[var(--color-cream)]">
            Service
          </label>
          <input
            type="text"
            placeholder="Enter service ID"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] p-3 text-[var(--text-main)] dark:bg-[var(--color-earth)] dark:text-[var(--color-cream)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            required
          />
        </div>

        <div className="mb-6 flex flex-col">
          <label className="mb-1 text-sm font-medium text-[var(--text-main)] dark:text-[var(--color-cream)]">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] p-3 text-[var(--text-main)] dark:bg-[var(--color-earth)] dark:text-[var(--color-cream)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-primary)] py-3 text-white font-semibold hover:bg-[var(--color-secondary)] dark:bg-[var(--color-gold)] dark:text-[var(--color-maroon)] transition-all duration-200 disabled:opacity-70"
        >
          {loading ? 'Booking...' : 'Create Booking'}
        </button>
      </form>
    </div>
  )
}

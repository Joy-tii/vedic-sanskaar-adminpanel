'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'

interface Category {
  id: string
  name: string
  services: Service[]
}

interface Service {
  id: string
  title: string
  description: string
  basePrice: string
  durationMin: number
  active: boolean
  panditExpertise?: Array<{
    panditId: string
    pandit: {
      id: string
      profile: {
        name: string
      }
    }
    experienceLevel?: string
  }>
}

export default function NewBookingPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState('')
  const [selectedPanditId, setSelectedPanditId] = useState('')
  const [availablePandits, setAvailablePandits] = useState<any[]>([])
  const [bookingDate, setBookingDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getAllServicesCategories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data)
        }
      } catch (err) {
        setError('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const found = categories.find(c => c.id === selectedCategory)
    setServices(found?.services || [])
    setSelectedService('')
    setSelectedPanditId('')
    setAvailablePandits([])
  }, [selectedCategory, categories])

  useEffect(() => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService)
      if (service?.panditExpertise && service.panditExpertise.length > 0) {
        setAvailablePandits(service.panditExpertise)
      } else {
        setAvailablePandits([])
      }
    }
  }, [selectedService, services])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!selectedCategory) return setError('Please select a category')
    if (!selectedService) return setError('Please select a service')
    if (!selectedPanditId) return setError('Please select a pandit')
    if (!bookingDate) return setError('Please select booking date')
    if (!startTime) return setError('Please select start time')

    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const payload = {
        panditId: selectedPanditId,
        serviceId: selectedService,
        bookingDate: new Date(bookingDate).toISOString(),
        startTime: new Date(`${bookingDate}T${startTime}`).toISOString(),
        endTime: endTime ? new Date(`${bookingDate}T${endTime}`).toISOString() : null,
        notes: notes || null,
      }

      const res = await fetch(`${API_BASE_URL}/api/bookings/createBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Unable to create booking')

      alert('Booking created successfully!')
      router.push('/bookings/my-bookings')
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-navy)] px-4 py-10">
        <div className="w-full max-w-2xl bg-[var(--color-cream)] rounded-2xl shadow-lg border border-[var(--color-earth)] p-8">
          <Heading className="text-center text-[var(--color-maroon)] mb-6 text-2xl font-bold">
            Create New Booking
          </Heading>

          <form onSubmit={handleSubmit} className="grid gap-5 text-[var(--color-maroon)]">
            {/* Category */}
            <div>
              <label className="block font-medium mb-2">Category * ({categories.length} available)</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                required
                className="w-full rounded-md border border-[var(--color-earth)] bg-[var(--color-cream)] px-3 py-2 text-[var(--color-maroon)]"
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.services.length} services)
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block font-medium mb-2">Service * ({services.length} available)</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                required
                disabled={!selectedCategory}
                className="w-full rounded-md border border-[var(--color-earth)] bg-[var(--color-cream)] px-3 py-2 text-[var(--color-maroon)] disabled:opacity-50"
              >
                <option value="">
                  {!selectedCategory
                    ? '-- Select category first --'
                    : services.length === 0
                    ? 'No services'
                    : '-- Select Service --'}
                </option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} (₹{s.basePrice} • {s.durationMin} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Pandit */}
            <div>
              <label className="block font-medium mb-2">Pandit * ({availablePandits.length} available)</label>
              <select
                value={selectedPanditId}
                onChange={e => setSelectedPanditId(e.target.value)}
                required
                disabled={!selectedService || availablePandits.length === 0}
                className="w-full rounded-md border border-[var(--color-earth)] bg-[var(--color-cream)] px-3 py-2 text-[var(--color-maroon)] disabled:opacity-50"
              >
                <option value="">
                  {!selectedService
                    ? '-- Select service first --'
                    : availablePandits.length === 0
                    ? 'No pandits available'
                    : '-- Select Pandit --'}
                </option>
                {availablePandits.map(pe => (
                  <option key={pe.panditId} value={pe.panditId}>
                    {pe.pandit.profile.name} ({pe.experienceLevel || 'Expert'})
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Date */}
            <div>
              <label className="block font-medium mb-2">Booking Date *</label>
              <Input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block font-medium mb-2">Start Time *</label>
              <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full" required />
            </div>

            {/* End Time */}
            <div>
              <label className="block font-medium mb-2">End Time (Optional)</label>
              <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full" />
            </div>

            {/* Notes */}
            <div>
              <label className="block font-medium mb-2">Notes (Optional)</label>
              <Input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full"
                placeholder="Special requirements"
                maxLength={500}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-3">
              <Button type="button" plain onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="saffron"
                className="px-8 disabled:opacity-50"
                disabled={loading || !selectedPanditId || !bookingDate || !startTime}
              >
                {loading ? 'Creating...' : 'Create Booking'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ApplicationLayout>
  )
}

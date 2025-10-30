'use client'

import React, { useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'

export default function NewServicePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    basePrice: '',
    durationMin: '',
    description: '',
    active: true
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!formData.title.trim()) return setError('Service title is required')
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) return setError('Valid base price is required')
    if (!formData.durationMin || parseInt(formData.durationMin) <= 0) return setError('Valid duration is required')

    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      alert(
        '⚠️ Backend API for individual service creation not available.\n\n' +
        'Please use "Create Category" with services, or ask backend team to add POST /api/services/create endpoint.'
      )

      // Uncomment below when backend is ready
      /*
      const payload = {
        title: formData.title,
        slug: formData.slug,
        categoryId: categoryId,
        basePrice: parseFloat(formData.basePrice),
        durationMin: parseInt(formData.durationMin),
        description: formData.description || '',
        active: formData.active
      }
      const res = await fetch(`${API_BASE_URL}/api/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create service')
      alert('Service created successfully!')
      router.push(`/services/${categoryId}`)
      */
    } catch (err: any) {
      setError(err.message || 'Failed to create service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="max-w-4xl mx-auto p-6 bg-[var(--color-cream)] rounded-lg border border-[var(--color-earth)] shadow-lg font-sans">
        <Button plain onClick={() => router.back()} className="mb-6 text-[var(--color-maroon)] hover:text-[var(--color-saffron)]">
          ← Back to Services
        </Button>

        <Heading className="mb-8 text-[var(--color-maroon)] font-semibold text-2xl">Create New Service</Heading>

        {/* Warning & Note */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-sm text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> Individual service creation API endpoint not available.
          Please use "Create Category" to add services, or request backend team to add POST /api/services/create.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Title */}
          <div>
            <label className="block mb-1 font-medium">Service Title *</label>
            <Input
              placeholder="e.g., Ganesh Puja"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-1 font-medium">Slug</label>
            <Input
              placeholder="Auto-generated from title"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
            />
            <small className="block mt-1 text-xs text-[var(--color-secondary)]">Leave empty to auto-generate</small>
          </div>

          {/* Base Price */}
          <div>
            <label className="block mb-1 font-medium">Base Price (₹) *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="500"
              value={formData.basePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
              className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1 font-medium">Duration (min) *</label>
            <Input
              type="number"
              min="1"
              placeholder="60"
              value={formData.durationMin}
              onChange={(e) => setFormData(prev => ({ ...prev, durationMin: e.target.value }))}
              className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              placeholder="Describe the service..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-[var(--color-maroon)] cursor-pointer select-none">
              Active (visible to users)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6 justify-center">
            <Button type="button" plain onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--color-primary)] text-white px-8" disabled={loading}>
              {loading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </ApplicationLayout>
  )
}

'use client'

import React, { useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'

export default function NewCategoryPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconUrl: '',
    isActive: true,
    services: [] as Array<{
      title: string
      slug: string
      basePrice: number
      durationMin: number
      description: string
      active: boolean
    }>
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add Service
  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          title: '',
          slug: '',
          basePrice: 0,
          durationMin: 60,
          description: '',
          active: true
        }
      ]
    }))
  }

  // Remove Service
  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  // Update Service field and auto-generate slug from title
  const updateService = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((s, i) => {
        if (i === index) {
          const updated = { ...s, [field]: value }
          if (field === 'title') {
            updated.slug = value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          }
          return updated
        }
        return s
      })
    }))
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      return setError('Category name is required')
    }

    for (let i = 0; i < formData.services.length; i++) {
      const service = formData.services[i]
      if (!service.title.trim()) {
        return setError(`Service ${i + 1}: Title is required`)
      }
      if (!service.basePrice || service.basePrice <= 0) {
        return setError(`Service ${i + 1}: Valid price is required`)
      }
      if (!service.durationMin || service.durationMin <= 0) {
        return setError(`Service ${i + 1}: Valid duration is required`)
      }
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        iconUrl: formData.iconUrl || undefined,
        isActive: formData.isActive,
        services: formData.services.length > 0 ? formData.services : undefined
      }

      const res = await fetch(`${API_BASE_URL}/api/services/serviceCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create category')
      }

      alert(`Category "${formData.name}" created successfully with ${formData.services.length} service(s)!`)
      router.push('/services')
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="max-w-4xl mx-auto p-6 bg-[var(--color-cream)] rounded-lg border border-[var(--color-earth)] shadow-lg font-sans">
        <Button
          plain
          onClick={() => router.back()}
          className="mb-6 text-[var(--color-maroon)] hover:text-[var(--color-saffron)]"
        >
          ← Back to Services
        </Button>

        <Heading className="mb-8 text-[var(--color-maroon)] font-semibold text-2xl">
          Create Service Category
        </Heading>

        <form onSubmit={handleSubmit} className="space-y-8 text-[var(--color-maroon)]">

          {/* Category Information */}
          <section className="space-y-6">
            <h3 className="font-semibold text-lg">Category Information</h3>

            <div>
              <label className="block mb-1 font-medium">Category Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Puja Services, Wedding Services"
                required
                className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category..."
                rows={3}
                className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Icon URL</label>
              <Input
                value={formData.iconUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
                placeholder="https://example.com/icon.png"
                className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
              />
              <small className="text-xs text-[var(--color-secondary)] mt-1 block">
                Optional: URL to category icon image
              </small>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-[var(--color-maroon)] select-none cursor-pointer">
                Active (visible to users)
              </label>
            </div>
          </section>

          {/* Services Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Services ({formData.services.length})</h3>
              <Button
                type="button"
                onClick={addService}
                color="saffron"
                className="font-semibold px-4 py-2"
              >
                + Add Service
              </Button>
            </div>

            {formData.services.length === 0 && (
              <div className="text-center py-6 text-[var(--color-secondary)]">
                <p className="mb-2">No services added yet.</p>
                <Button type="button" onClick={addService} plain>
                  + Add your first service
                </Button>
              </div>
            )}

            {formData.services.map((service, i) => (
              <div
                key={i}
                className="mb-6 p-5 bg-[var(--bg-primary)] rounded-lg border border-[var(--color-earth)] space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Service {i + 1}</h4>
                  <Button type="button" plain onClick={() => removeService(i)} className="text-red-600 hover:text-red-700">
                    Remove
                  </Button>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm">Title *</label>
                  <Input
                    placeholder="e.g., Ganesh Puja"
                    value={service.title}
                    onChange={(e) => updateService(i, 'title', e.target.value)}
                    className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm">Slug</label>
                  <Input
                    placeholder="Auto-generated from title"
                    value={service.slug}
                    onChange={(e) => updateService(i, 'slug', e.target.value)}
                    className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
                  />
                  <small className="text-xs text-[var(--color-secondary)] mt-1 block">
                    Leave empty to auto-generate
                  </small>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-sm">Price (₹) *</label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={service.basePrice || ''}
                      onChange={(e) => updateService(i, 'basePrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-sm">Duration (min) *</label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={service.durationMin || ''}
                      onChange={(e) => updateService(i, 'durationMin', parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm">Description</label>
                  <Textarea
                    placeholder="Describe this service..."
                    value={service.description}
                    onChange={(e) => updateService(i, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-[var(--color-cream)] text-[var(--color-maroon)] border border-[var(--color-earth)] rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`service-active-${i}`}
                    checked={service.active}
                    onChange={(e) => updateService(i, 'active', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`service-active-${i}`} className="text-[var(--color-maroon)] cursor-pointer select-none">
                    Active
                  </label>
                </div>
              </div>
            ))}
          </section>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-center gap-4 pt-6">
            <Button type="button" plain onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--color-saffron)] text-[var(--color-maroon)] px-10 disabled:opacity-50" disabled={loading}>
              {loading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </ApplicationLayout>
  )
}

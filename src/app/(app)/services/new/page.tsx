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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      return setError('Category name is required')
    }

    // Validate services if any
    if (formData.services.length > 0) {
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

      console.log('📤 Creating category:', payload)

      const res = await fetch(`${API_BASE_URL}/api/services/serviceCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      console.log('📦 Response:', data)

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create category')
      }

      alert(`Category "${formData.name}" created successfully with ${formData.services.length} service(s)!`)
      router.push('/services')
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

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

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const updateService = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((s, i) => {
        if (i === index) {
          const updated = { ...s, [field]: value }
          // Auto-generate slug from title
          if (field === 'title') {
            updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          }
          return updated
        }
        return s
      })
    }))
  }

  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="max-w-4xl mx-auto p-6">
        <Button plain onClick={() => router.back()} className="mb-4">
          ← Back to Services
        </Button>

        <Heading className="mb-6">Create Service Category</Heading>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Information */}
          <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--color-earth)] space-y-4">
            <h3 className="font-semibold text-lg text-[var(--text-main)]">Category Information</h3>

            <div>
              <label className="block text-[var(--text-main)] font-medium mb-2">
                Category Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Puja Services, Wedding Services"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-[var(--text-main)] font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category..."
                rows={3}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-[var(--text-main)] font-medium mb-2">
                Icon URL
              </label>
              <Input
                value={formData.iconUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
                placeholder="https://example.com/icon.png"
                className="w-full"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Optional: URL to category icon image
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-[var(--text-main)]">
                Active (visible to users)
              </label>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--color-earth)] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-[var(--text-main)]">
                  Services ({formData.services.length})
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Add services under this category
                </p>
              </div>
              <Button
                type="button"
                onClick={addService}
                className="bg-[var(--color-primary)] text-white"
              >
                + Add Service
              </Button>
            </div>

            {formData.services.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <p className="mb-3">No services added yet</p>
                <Button type="button" onClick={addService} plain>
                  + Add your first service
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 border border-[var(--color-border)] rounded-lg space-y-3 bg-[var(--bg-primary)]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-[var(--text-main)]">
                        Service {index + 1}
                      </span>
                      <Button
                        type="button"
                        plain
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Title *</label>
                      <Input
                        placeholder="e.g., Ganesh Puja"
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Slug</label>
                      <Input
                        placeholder="Auto-generated from title"
                        value={service.slug}
                        onChange={(e) => updateService(index, 'slug', e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Leave empty to auto-generate
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                        <Input
                          type="number"
                          placeholder="500"
                          value={service.basePrice || ''}
                          onChange={(e) => updateService(index, 'basePrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration (min) *</label>
                        <Input
                          type="number"
                          placeholder="60"
                          value={service.durationMin || ''}
                          onChange={(e) => updateService(index, 'durationMin', parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        placeholder="Describe this service..."
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`service-active-${index}`}
                        checked={service.active}
                        onChange={(e) => updateService(index, 'active', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`service-active-${index}`} className="text-sm">
                        Active
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              plain
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-primary)] text-white disabled:opacity-50 px-8"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </ApplicationLayout>
  )
}

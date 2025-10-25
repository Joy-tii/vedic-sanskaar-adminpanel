'use client'

import React, { useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'

export default function NewServicePage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

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
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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

      // ⭐ Since backend doesn't have individual service create endpoint,
      // we need to use the category endpoint or add services via different method
      
      // Option 1: If you want to create service, add backend endpoint first
      // Option 2: For now, show error message
      
      alert('⚠️ Backend API for individual service creation not available.\n\nPlease use "Create Category" with services, or add this backend endpoint:\n\nPOST /api/services/create')
      
      // Uncomment below when backend endpoint is ready:
      /*
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        categoryId: categoryId,
        basePrice: parseFloat(formData.basePrice),
        durationMin: parseInt(formData.durationMin),
        description: formData.description || '',
        active: formData.active
      }

      const res = await fetch(`${API_BASE_URL}/api/services/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="max-w-2xl mx-auto p-6">
        <Button plain onClick={() => router.back()} className="mb-4">← Back</Button>
        <Heading className="mb-6">Create New Service</Heading>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Individual service creation endpoint not available in backend. 
            Please use "Create Category" to add services, or ask backend team to add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">POST /api/services/create</code> endpoint.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border">
          <div>
            <label className="block font-medium mb-2">Service Title *</label>
            <Input value={formData.title} onChange={handleTitleChange} placeholder="e.g., Ganesh Puja" required className="w-full" />
          </div>

          <div>
            <label className="block font-medium mb-2">Slug</label>
            <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} placeholder="Auto-generated" className="w-full" />
          </div>

          <div>
            <label className="block font-medium mb-2">Base Price (₹) *</label>
            <Input type="number" value={formData.basePrice} onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))} placeholder="500" min="0" step="0.01" required className="w-full" />
          </div>

          <div>
            <label className="block font-medium mb-2">Duration (minutes) *</label>
            <Input type="number" value={formData.durationMin} onChange={(e) => setFormData(prev => ({ ...prev, durationMin: e.target.value }))} placeholder="60" min="1" required className="w-full" />
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the service..." rows={4} className="w-full" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="active">Active (visible to users)</label>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button type="button" plain onClick={() => router.back()} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-[var(--color-primary)] text-white" disabled={loading}>
              {loading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </ApplicationLayout>
  )
}

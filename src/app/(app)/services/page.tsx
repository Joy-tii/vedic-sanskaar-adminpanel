'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { FolderIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Select } from '@/components/select'
import { Button } from '@/components/button'

type Category = {
  id: string
  name: string
  description?: string
  services?: any[]
}

export default function ServicesIndexPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`${API_BASE_URL}/api/bookings/getAllServicesCategories`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })
        const data = await res.json()
        setCategories(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const filteredCategories = categories
    .filter(cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : 0))

  return (
    <ApplicationLayout events={[]} contentWide>
      <div className="p-6 bg-[var(--color-navy)] min-h-screen font-sans text-[var(--color-cream)]">
        {/* Header and Controls */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-6 max-w-7xl mx-auto">
          <div className="flex-1 min-w-[280px]">
            <Heading className="text-white">Service Categories</Heading>
            <div className="mt-4 flex flex-wrap gap-4 max-w-xl">
              <InputGroup>
                <Input
                  name="search"
                  placeholder="Search categories…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[var(--color-cream)] text-[var(--color-maroon)] placeholder-[var(--color-yellow)]"
                />
              </InputGroup>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[var(--color-cream)] text-[var(--color-maroon)] border-[var(--color-earth)]"
              >
                <option value="name">Sort by name</option>
              </Select>
            </div>
          </div>
          <Button
  href="/services/new"
  className="bg-[var(--color-saffron)] text-[var(--color-maroon)] whitespace-nowrap px-6 py-2.5 font-semibold"
>
  Create Category
</Button>

        </div>

        {/* Feedback */}
        {loading && <p className="text-[var(--color-cream)] text-center mt-10">Loading...</p>}
        {error && <p className="text-red-600 text-center mt-10">{error}</p>}
        {!loading && filteredCategories.length === 0 && (
          <p className="text-[var(--color-yellow)] text-center mt-10">No categories found.</p>
        )}

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mt-6">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.id}`}
              className="flex items-center gap-4 p-5 rounded-lg border border-[var(--color-earth)] bg-[var(--color-cream)] shadow-sm hover:shadow-md transition-shadow"
            >
              <FolderIcon className="h-8 w-8 text-[var(--color-saffron)] flex-shrink-0" />
              <div>
                <div className="font-semibold text-[var(--color-maroon)]">{cat.name}</div>
                {cat.description && (
                  <div className="text-sm text-[var(--color-secondary)]">{cat.description}</div>
                )}
                <div className="text-xs text-[var(--color-secondary)] mt-1">
                  {cat.services?.length || 0} {cat.services?.length === 1 ? 'service' : 'services'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ApplicationLayout>
  )
}

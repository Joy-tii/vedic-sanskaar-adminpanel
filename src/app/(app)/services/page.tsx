'use client'

import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/utils/api'
import { ApplicationLayout } from '@/app/(app)/application-layout'  // ⭐ Fixed path
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
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
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
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="p-4">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="sm:flex-1">
            <Heading>Service Categories</Heading>
            <div className="mt-4 flex max-w-xl gap-4">
              <InputGroup>
                <Input
                  name="search"
                  placeholder="Search categories…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Sort by name</option>
              </Select>
            </div>
          </div>
          <Button href="/services/new" className="bg-[var(--color-primary)] text-white">
            Create category
          </Button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredCategories.length === 0 && <p>No categories found.</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.id}`}
              className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition"
            >
              <FolderIcon className="h-6 w-6" />
              <div>
                <div className="font-medium">{cat.name}</div>
                {cat.description && <div className="text-sm text-gray-600">{cat.description}</div>}
                <div className="text-xs text-gray-500 mt-1">{cat.services?.length || 0} services</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ApplicationLayout>
  )
}

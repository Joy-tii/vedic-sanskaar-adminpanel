'use client'

import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Input, InputGroup } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { Heading } from '@/components/heading'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { API_BASE_URL } from '@/utils/api'

interface User {
  id: string
  email: string
  phone?: string
  status?: string
  createdAt?: string
  profile?: {
    name?: string
    avatar?: string
  }
  roles?: string[]
}

export default function EventsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('email')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('No token found. Please log in first.')

      const res = await fetch(
        `${API_BASE_URL}/api/users?page=${page}&limit=10&search=${search}&sort=${sort}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch users.')
      setUsers(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, sort, page])

  if (loading)
    return <p className="text-center mt-6 text-[var(--color-cream)]">Loading users...</p>
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>

  return (
    <div className="p-6 bg-[var(--color-navy)] min-h-screen font-sans text-[var(--color-cream)]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
        <div className="flex-1 max-sm:w-full">
          <Heading className="text-[var(--color-cream)]">Users</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <InputGroup>
              <MagnifyingGlassIcon className="text-[var(--color-saffron)]" />
              <Input
                name="search"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[var(--color-cream)] text-[var(--color-maroon)] placeholder-[var(--color-yellow)]"
              />
            </InputGroup>
            <Select
              name="sort_by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[var(--color-cream)] text-[var(--color-maroon)] border-[var(--color-earth)]"
            >
              <option value="email">Sort by email</option>
              <option value="createdAt">Sort by join date</option>
              <option value="status">Sort by status</option>
            </Select>
          </div>
        </div>
       <Button color="saffron">Create user</Button>

      </div>

      <table
  className="w-[95%] mx-auto border-collapse text-sm rounded-lg overflow-hidden shadow-lg bg-[var(--color-cream)]"
  style={{ borderColor: 'var(--color-earth)' }}
>
  <thead
    style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-maroon)', fontWeight: 'bold' }}
  >
    <tr>
      <th className="text-left px-6 py-3">Name</th>
      <th className="text-left px-6 py-3">Email</th>
      <th className="text-left px-6 py-3">Phone</th>
      <th className="text-left px-6 py-3">Role</th>
      <th className="text-left px-6 py-3">Created</th>
      <th className="text-right px-6 py-3">Status & Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.length > 0 ? (
      users.map((user) => (
        <tr
          key={user.id}
          className="hover:bg-[var(--color-primary)/20] transition-colors cursor-pointer"
          style={{ borderBottom: '1px solid var(--color-earth)' }}
        >
          <td className="flex items-center gap-4 px-6 py-4 text-[var(--color-maroon)] text-sm">
            <Link href={`/events/${user.id}`}>
              <img
                src={user.profile?.avatar || '/default-avatar.png'}
                alt={user.profile?.name || 'User'}
                className="h-10 w-10 rounded-full border shadow-md border-[var(--color-earth)]"
              />
            </Link>
            <Link href={`/events/${user.id}`} className="font-semibold hover:underline">
              {user.profile?.name || 'N/A'}
            </Link>
          </td>
          <td className="px-6 py-4 text-[var(--color-yellow)] text-sm">{user.email || '-'}</td>
          <td className="px-6 py-4 text-[var(--color-maroon)] text-sm">{user.phone || '-'}</td>
          <td className="px-6 py-4 text-[var(--color-maroon)] text-sm">{user.roles?.join(', ') || '-'}</td>
          <td className="px-6 py-4 text-[var(--color-maroon)] text-sm">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
          </td>
          <td className="px-6 py-4 flex justify-end gap-3 text-sm">
            <Badge color={user.status === 'ACTIVE' ? 'lime' : 'zinc'}>
              {user.status || 'ACTIVE'}
            </Badge>
            <Dropdown>
              <DropdownButton plain>
                <EllipsisVerticalIcon className="h-5 w-5 text-[var(--color-primary)]" />
              </DropdownButton>
              <DropdownMenu anchor="bottom end">
                <DropdownItem href={`/events/${user.id}`}>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6} className="text-center py-6 text-[var(--color-yellow)] text-sm">
          No users found
        </td>
      </tr>
    )}
  </tbody>
</table>


      <div className="mt-6 flex justify-end gap-2">
        <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} color="maroon">
          Previous
        </Button>
        <span className="px-4 py-2 bg-[var(--color-cream)] text-[var(--color-maroon)] rounded">{page}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} color="maroon">
          Next
        </Button>
      </div>
    </div>
  )
}

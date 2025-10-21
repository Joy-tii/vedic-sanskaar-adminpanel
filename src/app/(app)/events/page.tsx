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
  id: string | number
  name: string
  email: string
  role?: string
  status?: string
  avatarUrl?: string
  createdAt?: string
}

export default function EventsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
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

      setUsers(data.data)
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

  if (loading) return <p className="text-center mt-6 text-[var(--text-main)]">Loading users...</p>
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>

  return (
    <div className="p-4" style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Users (Events)</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <InputGroup>
              <MagnifyingGlassIcon className="text-[var(--color-primary)]" />
              <Input
                name="search"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[var(--bg-card)] text-[var(--text-main)] placeholder-[var(--color-yellow)]"
              />
            </InputGroup>
            <Select
              name="sort_by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--color-earth)]"
            >
              <option value="name">Sort by name</option>
              <option value="createdAt">Sort by join date</option>
              <option value="status">Sort by status</option>
            </Select>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
          Create user
        </Button>
      </div>

      <table className="w-full border-collapse" style={{ borderColor: 'var(--color-earth)' }}>
        <thead
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontWeight: 'bold',
          }}
        >
          <tr>
            <th className="text-left px-6 py-3">Name</th>
            <th className="text-left px-6 py-3">Email</th>
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
                className="hover:bg-[var(--color-primary)/10] transition-colors"
                style={{ borderBottom: '1px solid var(--color-earth)' }}
              >
                <td className="flex items-center gap-4 px-6 py-4 text-[var(--text-main)]">
                  <Link href={`/events/${user.id}`}>
                    <img
                      src={user.avatarUrl || '/default-avatar.png'}
                      alt={user.name}
                      className="h-12 w-12 rounded-full border shadow-md border-[var(--color-earth)]"
                    />
                  </Link>
                  <Link href={`/events/${user.id}`} className="font-semibold hover:underline">
                    {user.name || 'N/A'}
                  </Link>
                </td>
                <td className="px-6 py-4 text-[var(--text-yellow)]">{user.email || '-'}</td>
                <td className="px-6 py-4 text-[var(--text-main)]">{user.role || '-'}</td>
                <td className="px-6 py-4 text-[var(--text-main)]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <Badge color={user.status === 'Active' ? 'lime' : 'zinc'}>{user.status || 'Active'}</Badge>
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
              <td colSpan={5} className="text-center py-6 text-[var(--color-yellow)]">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end gap-2">
        <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="px-4 py-2 bg-[var(--bg-card)] rounded">{page}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

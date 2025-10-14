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
  id: number
  name: string
  email: string
  role: string
  status: string
  avatarUrl?: string
  createdAt?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ✅ Corrected key name here
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setError('No token found. Please log in first.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (res.ok && data.success) {
          setUsers(data.data || data.users || [])
        } else {
          setError(data.message || 'Failed to fetch users')
        }
      } catch (err: any) {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <p className="text-center mt-6">Loading users...</p>
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Users</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search users…" />
              </InputGroup>
            </div>
            <Select name="sort_by">
              <option value="name">Sort by name</option>
              <option value="joined">Sort by join date</option>
              <option value="status">Sort by status</option>
            </Select>
          </div>
        </div>
        <Button>Create user</Button>
      </div>

      <table
        className="w-full border-collapse mt-6"
        style={{
          fontFamily: 'var(--font-sans)',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <thead
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'black',
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
                className="hover:bg-[var(--color-yellow)]"
                style={{
                  borderBottom: '1px solid var(--color-earth)',
                }}
              >
                <td className="flex items-center gap-4 px-6 py-4">
                  <Link href={`/users/${user.id}`}>
                    <img
                      src={user.avatarUrl || '/default-avatar.png'}
                      alt={user.name}
                      className="h-12 w-12 rounded-full border shadow-md"
                    />
                  </Link>
                  <Link
                    href={`/users/${user.id}`}
                    className="font-semibold hover:underline"
                  >
                    {user.name || 'N/A'}
                  </Link>
                </td>
                <td className="px-6 py-4">{user.email || '-'}</td>
                <td className="px-6 py-4">{user.role || '-'}</td>
                <td className="px-6 py-4">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <Badge color={user.status === 'Active' ? 'lime' : 'zinc'}>
                    {user.status || 'Active'}
                  </Badge>
                  <Dropdown>
                    <DropdownButton plain>
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem href={`/users/${user.id}`}>View</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

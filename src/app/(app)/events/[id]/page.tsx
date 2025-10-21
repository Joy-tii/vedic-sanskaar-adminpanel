'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { API_BASE_URL } from '@/utils/api'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'

interface User {
  id: string
  fullName: string
  email: string
  city?: string
  avatarUrl?: string
  status?: string
  sanskaarCount: number
  yearsMember: number
  familyCount: number
}

interface Activity {
  id: string
  name: string
  date: string
  desc: string
  remarks: string
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id

  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No token found.')

        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch user.')
        setUser(data.data)

        const actRes = await fetch(`${API_BASE_URL}/api/users/${userId}/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const actData = await actRes.json()
        setActivities(actData.data || [])
      } catch (err: any) {
        setError(err.message || 'Error fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <p className="text-center mt-6 text-[var(--text-main)]">Loading...</p>
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>
  if (!user) return <p className="text-center mt-6 text-[var(--text-main)]">User not found</p>

  return (
    <div className="p-4">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-zinc-500">
        <ChevronLeftIcon className="h-4 w-4" /> Back to Events
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <img
            className="w-32 rounded-lg shadow-sm"
            src={user.avatarUrl || '/default-avatar.png'}
            alt={user.fullName}
          />
          <div>
            <div className="flex items-center gap-4">
              <Heading level={2} className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
                {user.fullName}
              </Heading>
              <Badge color={user.status === 'Active' ? 'lime' : 'zinc'}>
                {user.status || 'Inactive'}
              </Badge>
            </div>
            <p className="mt-2 text-sm sm:text-base text-zinc-500">
              {user.email} {user.city ? `· ${user.city}` : ''}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button outline>Edit</Button>
          <Button color="saffron">View</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm">
          <Heading level={3} className="text-sm font-semibold text-zinc-500">
            Sanskaars Attended
          </Heading>
          <p className="mt-2 text-lg font-bold">{user.sanskaarCount}</p>
        </div>
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm">
          <Heading level={3} className="text-sm font-semibold text-zinc-500">
            Years Member
          </Heading>
          <p className="mt-2 text-lg font-bold">{user.yearsMember}</p>
        </div>
        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm">
          <Heading level={3} className="text-sm font-semibold text-zinc-500">
            Family Members
          </Heading>
          <p className="mt-2 text-lg font-bold">{user.familyCount}</p>
        </div>
      </div>

      <Subheading className="mt-12">Recent Activities</Subheading>
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableHeader>Activity</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader className="text-right">Remarks</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.length > 0 ? (
            activities.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell className="text-zinc-500">{a.date}</TableCell>
                <TableCell>{a.desc}</TableCell>
                <TableCell className="text-right">{a.remarks}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-500 py-4">
                No recent activities found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

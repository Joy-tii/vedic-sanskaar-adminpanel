'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { API_BASE_URL } from '@/utils/api'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'

interface Profile {
  name: string
  bio?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
}

interface User {
  id: string
  email: string
  phone: string
  language: string
  status: string
  profile?: Profile
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

        // Fetch User
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch user.')
        setUser(data.data)

        // Try to fetch activities (graceful fallback)
        const actRes = await fetch(`${API_BASE_URL}/api/users/${userId}/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (actRes.ok) {
          const actData = await actRes.json()
          setActivities(actData.data || [])
        } else {
          setActivities([])
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading)
    return <p className="text-center mt-6 text-[var(--color-cream)]">Loading...</p>
  if (error)
    return <p className="text-center mt-6 text-red-500 font-medium">{error}</p>
  if (!user)
    return <p className="text-center mt-6 text-[var(--color-cream)]">User not found</p>

  const profile: Profile = user.profile ?? {
    name: 'Unknown',
    bio: null,
    city: null,
    state: null,
    country: null,
  }

  return (
    <div className="p-6 bg-[var(--color-navy)] min-h-screen text-[var(--color-cream)] font-sans">
      {/* Back Link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-saffron)] hover:underline"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Back to Users
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          <img
            className="w-28 h-28 rounded-lg shadow-md border border-[var(--color-cream)]/40 object-cover"
            src={'/default-avatar.png'}
            alt={profile.name || 'User'}
          />
          <div>
            <div className="flex items-center gap-4">
              <Heading
                level={2}
                className="text-3xl font-bold text-[var(--color-cream)]"
              >
                {profile.name || 'Unnamed User'}
              </Heading>
              <Badge color={user.status === 'ACTIVE' ? 'lime' : 'zinc'}>
                {user.status || 'Inactive'}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-[var(--color-yellow)]">
              {user.email} {profile.city ? `· ${profile.city}` : ''}
            </p>
          </div>
        </div>

        {/* <div className="flex gap-3">
          <Button outline>Edit</Button>
          <Button color="saffron">View</Button>
        </div> */}
      </div>

      {/* Info Cards */}
      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {[
          { label: 'City', value: profile.city },
          { label: 'State', value: profile.state },
          { label: 'Country', value: profile.country },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[var(--color-cream)] text-[var(--color-maroon)] p-5 rounded-xl shadow-md border border-[var(--color-earth)]/60 transition-transform hover:scale-[1.02]"
          >
            <Heading
              level={3}
              className="text-base font-semibold text-[var(--color-primary)]"
            >
              {item.label}
            </Heading>
            <p className="mt-2 text-lg font-bold">
              {item.value || 'Not Available'}
            </p>
          </div>
        ))}
      </div>

      {/* Activities Table */}
      <Subheading className="mt-12 text-[var(--color-cream)]">
        Recent Activities
      </Subheading>
      <Table className="mt-4 rounded-lg shadow-md border border-[var(--color-earth)]/50 bg-[var(--color-cream)] text-[var(--color-maroon)]">
        <TableHead>
          <TableRow className="bg-[var(--color-saffron)]/30 text-[var(--color-maroon)] font-semibold">
            <TableHeader>Activity</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader className="text-right">Remarks</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.length > 0 ? (
            activities.map((a) => (
              <TableRow
                key={a.id}
                className="odd:bg-[var(--color-cream)] even:bg-[var(--color-cream)]/90 hover:bg-[var(--color-saffron)]/20 transition-colors"
              >
                <TableCell>{a.name}</TableCell>
                <TableCell className="text-[var(--color-primary)]">
                  {a.date}
                </TableCell>
                <TableCell>{a.desc}</TableCell>
                <TableCell className="text-right">{a.remarks}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-[var(--color-maroon)]/80 py-4"
              >
                No recent activities found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

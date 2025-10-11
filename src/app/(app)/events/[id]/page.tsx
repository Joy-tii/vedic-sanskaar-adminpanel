import { Stat } from '@/app/stat'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getUser, getUserActivities } from '@/data'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface User {
  id: string
  fullName: string
  avatarUrl: string
  status: string
  email: string
  city: string
  sanskaarCount: number
  yearsMember: number
  familyCount: number
  sanskaarChange: string
  memberChange: string
  familyChange: string
}

interface Activity {
  id: string
  name: string
  date: string
  desc: string
  remarks: string
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const { id } = resolvedParams
  const user: User | null = await getUser(id)

  if (!user) {
    return { title: 'User Not Found' }
  }

  return {
    title: user.fullName,
  }
}

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const user: User | null = await getUser(id)
  const activities: Activity[] = await getUserActivities(id)

  if (!user) {
    notFound()
  }

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Users
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-32 shrink-0">
            <img className="aspect-3/2 rounded-lg shadow-sm" src={user.avatarUrl} alt={user.fullName} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>{user.fullName}</Heading>
              <Badge color={user.status === 'Active' ? 'lime' : 'zinc'}>{user.status}</Badge>
            </div>
            <div className="mt-2 text-sm/6 text-zinc-500">
              {user.email} <span aria-hidden="true">·</span> {user.city}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button outline>Edit</Button>
          <Button>View</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <Stat title="Sanskaars Attended" value={user.sanskaarCount.toString()} change={user.sanskaarChange} />
        <Stat title="Years Member" value={user.yearsMember.toString()} change={user.memberChange} />
        <Stat title="Family Members" value={user.familyCount.toString()} change={user.familyChange} />
      </div>
      <Subheading className="mt-12">Recent Activities</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Activity</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader className="text-right">Remarks</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity: Activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.name}</TableCell>
              <TableCell className="text-zinc-500">{activity.date}</TableCell>
              <TableCell>{activity.desc}</TableCell>
              <TableCell className="text-right">{activity.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

// app/users/[id]/page.tsx
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const user = await getUser(params.id)
  return { title: user ? user.fullName : 'User Not Found' }
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  if (!user) notFound()
  const activities = await getUserActivities(params.id)

  return (
    <>
      <Link href="/users" className="inline-flex items-center gap-2 text-sm text-zinc-500">
        <ChevronLeftIcon className="size-4" /> Users
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <img className="w-32 rounded-lg shadow-sm" src={user.avatarUrl} alt={user.fullName} />
          <div>
            <div className="flex items-center gap-4">
              <Heading>{user.fullName}</Heading>
              <Badge color={user.status === 'Active' ? 'lime' : 'zinc'}>{user.status}</Badge>
            </div>
            <div className="mt-2 text-sm text-zinc-500">
              {user.email} · {user.city}
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
          {activities.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.name}</TableCell>
              <TableCell className="text-zinc-500">{a.date}</TableCell>
              <TableCell>{a.desc}</TableCell>
              <TableCell className="text-right">{a.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

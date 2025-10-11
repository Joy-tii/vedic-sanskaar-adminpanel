import { Avatar } from '@/components/avatar'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getRecentOrders } from '@/data'
import { Stat } from '@/components/Stat'

// ✅ Updated Stat component to accept className
// export function Stat({
//   title,
//   value,
//   change,
//   className,
// }: {
//   title: string
//   value: string
//   change: string
//   className?: string
// }) {
//   return (
//     <div className={`p-4 rounded-lg bg-[var(--color-cream)] ${className || ''}`}>
//       <p className="text-sm text-[var(--text-main)]">{title}</p>
//       <p className="text-xl font-bold text-[var(--color-saffron)]">{value}</p>
//       <p className="text-sm text-[var(--text-main)]">{change}</p>
//     </div>
//   )
// }

export default async function Home() {
  let orders = await getRecentOrders()

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen text-[var(--text-main)]">
      <Heading>Good afternoon, Priya</Heading>

      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview of temple activities</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>

      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Donations" value="₹2.6M" change="+4.5%" className="text-[var(--color-saffron)]" />
        <Stat title="Avg Donation per Visitor" value="₹455" change="-0.5%" className="text-[var(--color-saffron)]" />
        <Stat title="Events Conducted" value="58" change="+4.5%" className="text-[var(--color-saffron)]" />
        <Stat title="Devotees Registered" value="823" change="+21.2%" className="text-[var(--color-saffron)]" />
      </div>

      <Subheading className="mt-14">Recent Donations & Event Registrations</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader className="bg-[var(--color-saffron)] text-[var(--color-cream)]">Donation ID</TableHeader>
            <TableHeader className="bg-[var(--color-saffron)] text-[var(--color-cream)]">Date</TableHeader>
            <TableHeader className="bg-[var(--color-saffron)] text-[var(--color-cream)]">Donor</TableHeader>
            <TableHeader className="bg-[var(--color-saffron)] text-[var(--color-cream)]">Event / Ritual</TableHeader>
            <TableHeader className="bg-[var(--color-saffron)] text-[var(--color-cream)] text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              href={order.url}
              title={`Donation #${order.id}`}
              className="hover:bg-[var(--color-earth)] hover:text-[var(--color-cream)]"
            >
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-[var(--text-main)]">{order.date}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={order.event.thumbUrl} className="size-6 border-[var(--color-saffron)]" />
                  <span>{order.event.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">₹{order.amount.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

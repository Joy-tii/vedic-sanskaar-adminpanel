'use client'
import React from 'react'

export interface Booking {
  id: string
  customerName: string
  date: string
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED' | string
  [key: string]: any
}

interface Props {
  booking: Booking
  onClick?: () => void
}

export default function BookingCard({ booking, onClick }: Props) {
  const statusBadge = () => {
    switch (booking.status) {
      case 'CONFIRMED': return 'bg-green-200 text-green-800'
      case 'REQUESTED': return 'bg-yellow-200 text-yellow-800'
      case 'COMPLETED': return 'bg-blue-200 text-blue-800'
      case 'REJECTED': return 'bg-red-200 text-red-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div
      className="bg-[var(--color-cream)] text-[var(--color-navy)] p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <p className="font-semibold">{booking.customerName}</p>
      <p className="text-sm">{booking.date}</p>
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-2 ${statusBadge()}`}>
        {booking.status}
      </span>
    </div>
  )
}

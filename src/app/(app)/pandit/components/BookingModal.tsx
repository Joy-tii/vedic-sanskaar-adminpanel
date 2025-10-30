'use client'
import React from 'react'
import { Booking } from './BookingCard'
import BookingActions from './BookingActions'

interface Props {
  booking: Booking
  onClose: () => void
  onUpdate: () => void
}

export default function BookingModal({ booking, onClose, onUpdate }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-cream)] text-[var(--color-navy)] p-6 rounded shadow w-96 relative">
        <button className="absolute top-2 right-2 font-bold" onClick={onClose}>X</button>
        <h2 className="text-xl font-bold mb-2">Booking Details</h2>
        <p><strong>Customer:</strong> {booking.customerName}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        <BookingActions
          bookingId={booking.id}
          status={booking.status}
          onStatusChange={onUpdate}
        />
      </div>
    </div>
  )
}

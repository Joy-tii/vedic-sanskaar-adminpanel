'use client'
import React from 'react'
import { acceptBooking, rejectBooking } from '@/utils/api'
import { Button } from '@/components/button'
interface Props {
  bookingId: string
  status: string
  onStatusChange: () => void
}

export default function BookingActions({ bookingId, status, onStatusChange }: Props) {
  const handleAccept = async () => {
    await acceptBooking(bookingId)
    onStatusChange()
  }

  const handleReject = async () => {
    await rejectBooking(bookingId)
    onStatusChange()
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {status === 'REQUESTED' && (
        <div className="flex gap-2">
          <Button color="saffron" onClick={handleAccept}>Accept</Button>
          <Button color="saffron" onClick={handleReject}>Reject</Button>
        </div>
      )}
    </div>
  )
}

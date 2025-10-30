'use client'

import React from 'react'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { ClipboardDocumentCheckIcon, PlusIcon } from '@heroicons/react/20/solid'

export default function BookingsPage() {
  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="min-h-screen  p-6 font-sans text-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Heading className="text-4xl font-bold text-white mb-4">
              Bookings Management
            </Heading>
            <p className="text-lg text-white">
              Manage your service bookings efficiently
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* My Bookings Card */}
            <div className="bg-[var(--color-cream)] border border-[var(--color-earth)] rounded-lg p-8 shadow-md hover:shadow-lg transform hover:scale-[1.025] transition duration-300 ease-in-out cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-[var(--color-saffron)]" />
                <h2 className="text-3xl font-semibold text-black">My Bookings</h2>
              </div>
              <p className="mb-8 text-gray-900 leading-relaxed">
                View and manage all your existing service bookings with a click. Check details, status updates, and manage rescheduling easily.
              </p>
              <Button
                href="/bookings/my-bookings"
                className="w-full bg-[var(--color-secondary)] text-white font-semibold py-3 rounded-lg hover:brightness-110 transition"
              >
                View My Bookings
              </Button>
            </div>

            {/* New Booking Card */}
            <div className="bg-[var(--color-cream)] border border-[var(--color-earth)] rounded-lg p-8 shadow-md hover:shadow-lg transform hover:scale-[1.025] transition duration-300 ease-in-out cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <PlusIcon className="h-12 w-12 text-[var(--color-saffron)]" />
                <h2 className="text-3xl font-semibold text-black">New Booking</h2>
              </div>
              <p className="mb-8 text-gray-900 leading-relaxed">
                Quickly create a new service booking through our streamlined process. Fill out your preferences and confirm.
              </p>
              <Button
                href="/bookings/new"
                className="w-full bg-[var(--color-secondary)] text-white font-semibold py-3 rounded-lg hover:brightness-110 transition"
              >
                Create New Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

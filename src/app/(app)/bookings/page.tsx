'use client'

import React from 'react'
import { ApplicationLayout } from '@/app/(app)/application-layout'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { ClipboardDocumentCheckIcon, PlusIcon } from '@heroicons/react/20/solid'

export default function BookingsPage() {
  return (
    <ApplicationLayout events={[]} contentWide={true}>
      <div className="min-h-screen bg-[var(--bg-primary)] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading className="text-4xl font-bold text-[var(--text-main)] mb-4">
              Bookings Management
            </Heading>
            <p className="text-lg text-[var(--text-secondary)]">
              Manage your service bookings efficiently
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[var(--bg-card)] border border-[var(--color-earth)] rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <ClipboardDocumentCheckIcon className="h-10 w-10 text-[var(--color-primary)]" />
                <h2 className="text-2xl font-semibold text-[var(--text-main)]">My Bookings</h2>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                View and manage all your existing service bookings
              </p>
              <Button 
                href="/bookings/my-bookings"
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white font-semibold py-3"
              >
                View My Bookings
              </Button>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--color-earth)] rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <PlusIcon className="h-10 w-10 text-green-600" />
                <h2 className="text-2xl font-semibold text-[var(--text-main)]">New Booking</h2>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                Create a new service booking
              </p>
              <Button 
                href="/bookings/new"
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3"
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

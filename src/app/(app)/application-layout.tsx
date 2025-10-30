'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
  SidebarItem,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { getEvents } from '@/data'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/login">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  events,
  children,
  contentWide = false,
}: {
  events: Awaited<ReturnType<typeof getEvents>>
  children: React.ReactNode
  contentWide?: boolean
}) {
  let pathname = usePathname()
  const [bookingsOpen, setBookingsOpen] = useState(() => pathname.startsWith('/bookings'))
  const [panditBookingsOpen, setPanditBookingsOpen] = useState(() => pathname.startsWith('/pandit/bookings'))
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith('/services'))

  useEffect(() => {
    setBookingsOpen(pathname.startsWith('/bookings'))
    setPanditBookingsOpen(pathname.startsWith('/pandit/bookings'))
    setServicesOpen(pathname.startsWith('/services'))
  }, [pathname])

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/users/erica.jpg" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="bg-[var(--color-cream)] text-[var(--color-maroon)]">
          {/* Sidebar Header */}
          <SidebarHeader className="bg-[var(--color-cream)] border-[var(--color-earth)] text-[var(--color-maroon)]">
            <Dropdown>
              <DropdownButton as={SidebarItem} className="text-[var(--color-maroon)]">
                <img src="/vedic_logo-removebg.png" alt="Vedic Sanskaar" className="h-10 w-30 object-contain rounded-none" />
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings" className="text-[var(--color-maroon)]">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          {/* Sidebar Body */}
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/events" current={pathname.startsWith('/events')} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <Square2StackIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>

              {/* User Bookings Section */}
              <SidebarItem href="/bookings" current={pathname.startsWith('/bookings')} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <CalendarDaysIcon />
                <SidebarLabel>Bookings</SidebarLabel>
                <ChevronDownIcon className={bookingsOpen ? 'ml-auto rotate-180 transition-transform' : 'ml-auto transition-transform'} />
              </SidebarItem>
              {bookingsOpen && (
                <>
                  <SidebarItem
                    href="/bookings/my-bookings"
                    current={pathname === '/bookings/my-bookings'}
                    className="pl-8 text-sm text-[var(--color-maroon)] hover:text-[var(--color-primary)]"
                  >
                    <ClipboardDocumentCheckIcon className="size-4" />
                    <SidebarLabel>My Bookings</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    href="/bookings/new"
                    current={pathname === '/bookings/new'}
                    className="pl-8 text-sm text-[var(--color-maroon)] hover:text-[var(--color-primary)]"
                  >
                    <PlusIcon className="size-4" />
                    <SidebarLabel>New Booking</SidebarLabel>
                  </SidebarItem>
                </>
              )}

              {/* Pandit Bookings Section */}
              <SidebarItem href="/pandit/bookings" current={pathname.startsWith('/pandit/bookings')} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <ClipboardDocumentCheckIcon />
                <SidebarLabel>Pandit Bookings</SidebarLabel>
                <ChevronDownIcon className={panditBookingsOpen ? 'ml-auto rotate-180 transition-transform' : 'ml-auto transition-transform'} />
              </SidebarItem>
              {panditBookingsOpen && (
                <>
                  <SidebarItem
                    href="/pandit/bookings/my-bookings"
                    current={pathname === '/pandit/bookings/my-bookings'}
                    className="pl-8 text-sm text-[var(--color-maroon)] hover:text-[var(--color-primary)]"
                  >
                    <ClipboardDocumentCheckIcon className="size-4" />
                    <SidebarLabel>My Bookings</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem
                    href="/pandit/bookings/new"
                    current={pathname === '/pandit/bookings/new'}
                    className="pl-8 text-sm text-[var(--color-maroon)] hover:text-[var(--color-primary)]"
                  >
                    <PlusIcon className="size-4" />
                    <SidebarLabel>New Booking</SidebarLabel>
                  </SidebarItem>
                </>
              )}

              {/* Services Section */}
              <SidebarItem href="/services" current={pathname.startsWith('/services')} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <Square2StackIcon />
                <SidebarLabel>Services</SidebarLabel>
                <ChevronDownIcon className={servicesOpen ? 'ml-auto rotate-180 transition-transform' : 'ml-auto transition-transform'} />
              </SidebarItem>
              {servicesOpen && (
                <>
                  <SidebarItem href="/services" current={pathname === '/services'} className="pl-8 text-sm hover:text-[var(--color-primary)]">
                    <ClipboardDocumentCheckIcon className="size-4" />
                    <SidebarLabel>All Categories</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/services/new" current={pathname === '/services/new'} className="pl-8 text-sm hover:text-[var(--color-primary)]">
                    <PlusIcon className="size-4" />
                    <SidebarLabel>New Service</SidebarLabel>
                  </SidebarItem>
                </>
              )}

              {/* Settings */}
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')} className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#" className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#" className="text-[var(--color-maroon)] hover:text-[var(--color-primary)]">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          {/* Footer */}
          <SidebarFooter className="max-lg:hidden bg-[var(--color-cream)] border-t border-[var(--color-earth)] text-[var(--color-maroon)]">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/users/erica.jpg" className="size-10" square />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium">Erica</span>
                    <span className="block truncate text-xs/5 font-normal text-[var(--color-yellow)]">erica@example.com</span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
      contentWide={contentWide}
    >
      {children}
    </SidebarLayout>
  )
}

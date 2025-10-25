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
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
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
  /** Allow pages to request full-bleed content (no centered max-width) */
  contentWide?: boolean
}) {
  let pathname = usePathname()
  const [bookingsOpen, setBookingsOpen] = useState(() => pathname.startsWith('/bookings'))
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith('/services'))

  // keep sections in sync with navigation (open when visiting a child route)
  React.useEffect(() => {
    setBookingsOpen(pathname.startsWith('/bookings'))
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
        <Sidebar>
          {/* ---------- Sidebar Header ---------- */}
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                {/* show only the Vedic Sanskaar logo image (no text); keep height, increase width, not rounded */}
                <img src="/vedic_logo-removebg.png" alt="Vedic Sanskaar" className="h-10 w-30 object-contain rounded-none" />
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  {/* only the logo image, not rounded; a bit wider while keeping height */}
                  <img slot="icon" src="/vedic_logo-removebg.png" alt="Vedic Sanskaar" className="h-8 w-12 object-contain rounded-none" />
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          {/* ---------- Sidebar Body ---------- */}
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events" current={pathname.startsWith('/events')}>
                <Square2StackIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>

              {/* Bookings — navigates to list; sub-links auto-open when on a bookings route */}
              <SidebarItem href="/bookings" current={pathname.startsWith('/bookings')}> 
                <CalendarDaysIcon />
                <SidebarLabel>Bookings</SidebarLabel>
                <ChevronDownIcon className={bookingsOpen ? 'ml-auto rotate-180 transition-transform' : 'ml-auto transition-transform'} />
              </SidebarItem>

              {bookingsOpen && (
                <>
                  <SidebarItem
                    href="/bookings/my-bookings"
                    current={pathname === '/bookings/my-bookings'}
                    className="pl-8 text-sm"
                  >
                    <ClipboardDocumentCheckIcon className="size-4" />
                    <SidebarLabel>My Bookings</SidebarLabel>
                  </SidebarItem>

                  <SidebarItem
                    href="/bookings/new"
                    current={pathname === '/bookings/new'}
                    className="pl-8 text-sm"
                  >
                    <PlusIcon className="size-4" />
                    <SidebarLabel>New Booking</SidebarLabel>
                  </SidebarItem>
                </>
              )}

              {/* Services — click to expand/collapse */}
              {/* Services — navigates to services index; sub-links auto-open on child routes */}
              <SidebarItem href="/services" current={pathname.startsWith('/services')}>
                <Square2StackIcon />
                <SidebarLabel>Services</SidebarLabel>
                <ChevronDownIcon className={servicesOpen ? 'ml-auto rotate-180 transition-transform' : 'ml-auto transition-transform'} />
              </SidebarItem>

              {servicesOpen && (
                <>
                  <SidebarItem
                    href="/services"
                    current={pathname === '/services'}
                    className="pl-8 text-sm"
                  >
                    <ClipboardDocumentCheckIcon className="size-4" />
                    <SidebarLabel>All Categories</SidebarLabel>
                  </SidebarItem>

                  <SidebarItem
                    href="/services/new"
                    current={pathname === '/services/new'}
                    className="pl-8 text-sm"
                  >
                    <PlusIcon className="size-4" />
                    <SidebarLabel>New Service</SidebarLabel>
                  </SidebarItem>
                </>
              )}

              {/* (booking sub-links moved up to be grouped under Bookings) */}

              {/* Settings */}
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {/* ---------- Events Section ---------- */}
            {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href={event.url}>
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection> */}

            <SidebarSpacer />

            {/* ---------- Support & Footer ---------- */}
            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          {/* ---------- Sidebar Footer ---------- */}
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/users/erica.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Erica
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
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

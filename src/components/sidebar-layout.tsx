'use client'

import * as Headless from '@headlessui/react'
import React, { useState } from 'react'
import { NavbarItem } from './navbar'

/* ---------- ICONS ---------- */
function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--color-primary)]">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--color-text-primary)]">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

/* ---------- MOBILE SIDEBAR ---------- */
function MobileSidebar({ open, close, children }: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop className="fixed inset-0 bg-black/30 transition-opacity data-[closed]:opacity-0" />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 left-0 w-72 p-2 bg-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-border)] transition-transform duration-300 data-[closed]:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg">
          <div className="mb-3 px-4 pt-3 flex justify-end">
            <Headless.CloseButton aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  )
}

/* ---------- MAIN LAYOUT ---------- */
export function SidebarLayout({
  navbar,
  sidebar,
  children,
  contentWide = false,
}: React.PropsWithChildren<{
  navbar: React.ReactNode
  sidebar: React.ReactNode
  contentWide?: boolean
}>) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--bg-primary)] lg:flex-row">

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-[var(--color-primary)] dark:bg-[var(--color-gold)] text-white dark:text-[var(--color-cream)] shadow-lg ring-1 ring-[var(--color-border)]">
        {sidebar}
      </aside>

      {/* Sidebar for mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Top navbar (mobile only) */}
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--color-primary)] dark:bg-[var(--color-primary)] lg:hidden">
        <NavbarItem
          onClick={() => setShowSidebar(true)}
          aria-label="Open navigation"
          className="text-[var(--color-text-primary)] dark:text-[var(--color-cream)]"
        >
          <OpenMenuIcon />
        </NavbarItem>
        <div className="flex-1 text-center text-[var(--color-text-primary)] dark:text-[var(--color-cream)]">
          {navbar}
        </div>
      </header>

      {/* Main content */}
      <main
        className={`flex flex-1 flex-col bg-[var(--bg-card)] dark:bg-[var(--color-maroon)] 
        ${contentWide ? 'pl-0' : 'lg:pl-64'} transition-all`}
      >
        <div
          className={`p-6 lg:p-10 w-full ${
            contentWide
              ? 'max-w-6xl mx-auto'
              : 'max-w-6xl ml-0 text-left'
          } text-[var(--color-text-primary)] dark:text-[var(--color-cream)]`}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

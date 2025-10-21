'use client'

import * as Headless from '@headlessui/react'
import React, { useState } from 'react'
import { NavbarItem } from './navbar'

function OpenMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="w-6 h-6 text-[var(--color-maroon)]"
    >
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="w-6 h-6 text-[var(--color-maroon)]"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog
      open={open}
      onClose={close}
      className="lg:hidden fixed inset-0 z-50 flex"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true" />

      <Headless.Dialog.Panel className="relative flex w-80 max-w-full flex-col overflow-y-auto bg-[var(--color-cream)] shadow-lg transition-transform duration-300 ease-in-out transform data-[headlessui-state=open]:translate-x-0 -translate-x-full">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-[var(--color-earth)]">
          <button
            onClick={close}
            className="p-2 rounded-md hover:bg-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron)]"
            aria-label="Close sidebar"
          >
            <CloseMenuIcon />
          </button>
        </div>
        <div className="flex-1 px-4 py-2">{children}</div>
      </Headless.Dialog.Panel>
    </Headless.Dialog>
  )
}


export function StackedLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{ navbar: React.ReactNode; sidebar: React.ReactNode }>) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[var(--color-cream)] dark:bg-[var(--color-maroon)]">
      {/* Mobile Sidebar */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-earth)]">
        <div className="lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="flex-1">{navbar}</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="mx-auto max-w-6xl rounded-lg bg-[var(--color-surface)] p-6 shadow-md dark:bg-[var(--color-background)]">
          {children}
        </div>
      </main>
    </div>
  )
}

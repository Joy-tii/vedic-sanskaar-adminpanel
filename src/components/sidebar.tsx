'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'motion/react'
import React, { forwardRef, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

/* ---------- STRUCTURE ---------- */

export function Sidebar({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex h-full min-h-0 flex-col')} />
}



export function SidebarHeader({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col p-4 border-b border-[var(--color-earth)] dark:border-[var(--color-cream)]',
        'bg-[var(--bg-primary)] dark:bg-[var(--color-maroon)]',
        '[&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}


export function SidebarBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'flex flex-1 flex-col overflow-y-auto p-4', '[&>[data-slot=section]+[data-slot=section]]:mt-8')}
    />
  )
}

export function SidebarFooter({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col border-t border-[var(--color-earth)] p-4 dark:border-[var(--color-cream)]',
        '[&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}

export function SidebarSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <div {...props} data-slot="section" className={clsx(className, 'flex flex-col gap-0.5')} />
    </LayoutGroup>
  )
}

export function SidebarDivider({ className, ...props }: React.ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      {...props}
      className={clsx(
        className,
        'my-4 border-t border-[var(--color-earth)] lg:-mx-4 dark:border-[var(--color-cream)]'
      )}
    />
  )
}

export function SidebarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'mt-8 flex-1')} />
}

export function SidebarHeading({ className, ...props }: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      {...props}
      className={clsx(
        className,
        'mb-1 px-2 text-xs/6 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-cream)]'
      )}
    />
  )
}

/* ---------- SIDEBAR ITEM ---------- */

export const SidebarItem = forwardRef(function SidebarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | ({ href?: never } & Omit<Headless.ButtonProps, 'as' | 'className'>)
    | ({ href: string } & Omit<Headless.ButtonProps<typeof Link>, 'as' | 'className'>)
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  const classes = clsx(
    // Base
    'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium sm:py-2 sm:text-sm/5',
    'text-[var(--color-text-primary)]',
    // Icon default (yellow/gold)
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-[var(--color-gold)] sm:*:data-[slot=icon]:size-5',
    '*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4',

  // Hover & Active — stronger visible background so icons remain readable on hover
  // Add standard :hover variants so Tailwind applies background color without any JS attribute helpers
  'hover:bg-[var(--color-orange)]/30 hover:*:data-[slot=icon]:fill-[var(--color-orange)]',
  'active:bg-[var(--color-orange)]/30 active:*:data-[slot=icon]:fill-[var(--color-orange)]',
  // keep data-* variants for any JS-driven states (backwards compatible)
  'data-hover:bg-[var(--color-orange)]/30 data-hover:*:data-[slot=icon]:fill-[var(--color-orange)]',
  'data-active:bg-[var(--color-orange)]/30 data-active:*:data-[slot=icon]:fill-[var(--color-orange)]',

    // Current
    current && 'data-current:*:data-[slot=icon]:fill-[var(--color-orange)]',

  // Dark Mode — warm glow, make hover slightly stronger in dark too
  'dark:text-[var(--color-cream)] dark:*:data-[slot=icon]:fill-[var(--color-gold)]',
  'dark:hover:bg-[var(--color-gold)]/25 dark:hover:*:data-[slot=icon]:fill-[var(--color-orange)]',
  'dark:active:bg-[var(--color-gold)]/30 dark:active:*:data-[slot=icon]:fill-[var(--color-orange)]',
  // keep data-* dark variants as well
  'dark:data-hover:bg-[var(--color-gold)]/25 dark:data-hover:*:data-[slot=icon]:fill-[var(--color-orange)]',
  'dark:data-active:bg-[var(--color-gold)]/30 dark:data-active:*:data-[slot=icon]:fill-[var(--color-orange)]',
    current && 'dark:data-current:*:data-[slot=icon]:fill-[var(--color-gold)]',

    className
  )

  return (
    <span className={clsx('relative')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-[var(--color-orange)] dark:bg-[var(--color-gold)]"
        />
      )}
      {typeof props.href === 'string' ? (
        <Headless.CloseButton
          as={Link}
          {...props}
          className={classes}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.CloseButton>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})


/* ---------- LABEL ---------- */

export function SidebarLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(className, 'truncate text-white dark:text-[var(--color-cream)]')}
    />
  )
}

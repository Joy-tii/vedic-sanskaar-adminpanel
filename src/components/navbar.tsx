'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'motion/react'
import React, { forwardRef, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Navbar({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex flex-1 items-center gap-4 py-2.5')} />
}

export function NavbarDivider({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={clsx(className, 'h-6 w-px bg-[var(--color-earth)/10] dark:bg-[var(--color-cream)/10]')}
    />
  )
}

export function NavbarSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  let id = useId()
  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, 'flex items-center gap-3')} />
    </LayoutGroup>
  )
}

export function NavbarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, '-ml-4 flex-1')} />
}

export const NavbarItem = forwardRef(function NavbarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | ({ href?: never } & Omit<Headless.ButtonProps, 'as' | 'className'>)
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>)
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let classes = clsx(
    'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-[var(--color-maroon)] sm:text-sm/5',
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-[var(--color-earth)] sm:*:data-[slot=icon]:size-5',
    '*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4',
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6',
    'data-hover:bg-[var(--color-earth)/5] data-hover:*:data-[slot=icon]:fill-[var(--color-maroon)]',
    'data-active:bg-[var(--color-earth)/5] data-active:*:data-[slot=icon]:fill-[var(--color-maroon)]',
    'dark:text-[var(--color-cream)] dark:*:data-[slot=icon]:fill-[var(--color-cream)]',
    'dark:data-hover:bg-[var(--color-cream)/5] dark:data-hover:*:data-[slot=icon]:fill-[var(--color-gold)]',
    'dark:data-active:bg-[var(--color-cream)/5] dark:data-active:*:data-[slot=icon]:fill-[var(--color-gold)]',
    current && 'data-current:*:data-[slot=icon]:fill-[var(--color-gold)]',
    className,
  )

  return (
    <span className={clsx(className, 'relative')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-[var(--color-maroon)] dark:bg-[var(--color-gold)]"
        />
      )}
      {typeof props.href === 'string' ? (
        <Link {...props} className={classes} data-current={current ? 'true' : undefined} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button {...props} className={clsx('cursor-default', classes)} data-current={current ? 'true' : undefined} ref={ref}>
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function NavbarLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate text-[var(--color-maroon)] dark:text-[var(--color-cream)]')} />
}

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link } from './link'

const styles = {
  base: [
    'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border font-semibold',
    'px-4 py-2 sm:px-4 sm:py-2.5 sm:text-sm transition-colors duration-200',
    'focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-saffron)] focus:outline-not-data-focus:outline-hidden',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-[var(--btn-icon)]',
  ],

  // ✅ Solid buttons (filled)
  solid: [
    'border-transparent',
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-[var(--btn-bg)] before:shadow-sm',
    'dark:before:hidden dark:border-white/5',
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
    'after:shadow-[inset_0_1px_rgba(255,255,255,0.15)]',
    'hover:brightness-95 active:brightness-90',
  ],

  // ✅ Outline buttons
  outline: [
    'border-[var(--color-maroon)] text-[var(--color-maroon)]',
    'hover:bg-[var(--color-maroon)] hover:text-white',
    'active:bg-[var(--color-maroon)]/90',
    '[--btn-icon:var(--color-maroon)] hover:[--btn-icon:white]',
  ],

  // ✅ Plain buttons (text only)
  plain: [
    'border-transparent text-[var(--color-maroon)] bg-transparent',
    'hover:bg-[var(--color-cream)] active:bg-[var(--color-background)]',
    '[--btn-icon:var(--color-maroon)] hover:[--btn-icon:var(--color-saffron)]',
  ],

  // ✅ Color variants
  colors: {
    maroon: [
      'text-white bg-[var(--color-maroon)] border-transparent',
      'hover:bg-[color-mix(in_srgb,var(--color-maroon)_90%,black)]',
      '[--btn-bg:var(--color-maroon)] [--btn-icon:var(--color-gold)]',
    ],
    gold: [
      'text-[var(--color-maroon)] bg-[var(--color-gold)] border-transparent',
      'hover:bg-[color-mix(in_srgb,var(--color-gold)_90%,black)]',
      '[--btn-bg:var(--color-gold)] [--btn-icon:var(--color-saffron)]',
    ],
    saffron: [
      'text-[var(--color-maroon)] bg-[var(--color-saffron)] border-transparent',
      'hover:bg-[color-mix(in_srgb,var(--color-saffron)_90%,black)]',
      '[--btn-bg:var(--color-saffron)] [--btn-icon:var(--color-gold)]',
    ],
    yellow: [
      'text-[var(--color-maroon)] bg-[var(--color-secondary)] border-transparent',
      'hover:bg-[color-mix(in_srgb,var(--color-secondary)_90%,black)]',
      '[--btn-bg:var(--color-secondary)] [--btn-icon:var(--color-saffron)]',
    ],
  },
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
  | ({ href?: never } & Omit<Headless.ButtonProps, 'as' | 'className'>)
  | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>)
)

export const Button = forwardRef(function Button(
  { color = 'saffron', outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const variantClass = outline ? styles.outline : plain ? styles.plain : styles.solid
  const colorClass = color ? styles.colors[color] : []
  const classes = clsx(className, styles.base, variantClass, colorClass)

  return typeof props.href === 'string' ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}

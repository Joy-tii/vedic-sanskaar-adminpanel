import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link } from './link'

const styles = {
  base: [
    'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border font-semibold',
    'px-4 py-2 sm:px-4 sm:py-2.5 sm:text-sm transition-colors duration-200',
    'focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-saffron)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0',
  ],
  solid: [
    'border-transparent rounded-lg shadow-sm hover:brightness-95 active:brightness-90',
  ],
  outline: [
    'border-[var(--color-maroon)] text-[var(--color-maroon)] bg-transparent',
    'hover:bg-[var(--color-maroon)] hover:text-white',
    'active:bg-[var(--color-maroon)]/90',
  ],
  plain: [
    'border-transparent text-[var(--color-maroon)] bg-transparent',
    'hover:bg-[var(--color-cream)] active:bg-[var(--color-background)]',
  ],
  colors: {
    maroon: [
      'bg-[var(--color-maroon)]',
      'text-white',
      'hover:bg-[color-mix(in_srgb,var(--color-maroon)_90%,black)]',
    ],
    saffron: [
      'bg-[var(--color-saffron)]',
      'text-[var(--color-maroon)]',
      'hover:bg-[color-mix(in_srgb,var(--color-saffron)_90%,black)]',
    ],
    gold: [
      'bg-[var(--color-gold)]',
      'text-[var(--color-maroon)]',
      'hover:bg-[color-mix(in_srgb,var(--color-gold)_90%,black)]',
    ],
    yellow: [
      'bg-[var(--color-secondary)]',
      'text-[var(--color-maroon)]',
      'hover:bg-[color-mix(in_srgb,var(--color-secondary)_90%,black)]',
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

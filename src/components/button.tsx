import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link } from './link'

const styles = {
  base: [
    // Base styles
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    // Sizing
    'px-[calc(var(--spacing,1rem)*0.875-1px)] py-[calc(var(--spacing,1rem)*0.625-1px)] sm:px-[calc(var(--spacing,1rem)*0.75-1px)] sm:py-[calc(var(--spacing,1rem)*0.375-1px)] sm:text-sm/6',
    // Focus styles using saffron color variable
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-[var(--color-saffron)]',
    // Disabled styles
    'data-disabled:opacity-50',
    // Icon slot styling
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center',
    '*:data-[slot=icon]:text-[var(--btn-icon)] sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4',
  ],
  solid: [
    'border-transparent bg-[var(--btn-border)]',
    'dark:bg-[var(--btn-bg)]',
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-[var(--btn-bg)]',
    'before:shadow-sm',
    'dark:before:hidden',
    'dark:border-white/5',
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
    'after:shadow-[inset_0_1px_rgba(255,255,255,0.15)]',
    'data-active:after:bg-[var(--btn-hover-overlay)] data-hover:after:bg-[var(--btn-hover-overlay)]',
    'dark:after:-inset-px dark:after:rounded-lg',
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    'border-[var(--color-maroon)] text-[var(--color-maroon)] data-active:bg-[var(--color-maroon)/0.1] data-hover:bg-[var(--color-maroon)/0.1]',
    'dark:border-[var(--color-gold)] dark:text-[var(--color-gold)] dark:data-active:bg-[var(--color-gold)/0.1] dark:data-hover:bg-[var(--color-gold)/0.1]',
    '[--btn-icon:var(--color-maroon)] data-active:[--btn-icon:var(--color-gold)] data-hover:[--btn-icon:var(--color-gold)]',
  ],
  plain: [
    'border-transparent text-[var(--color-maroon)] data-active:bg-[var(--color-maroon)/0.1] data-hover:bg-[var(--color-maroon)/0.1]',
    'dark:text-[var(--color-gold)] dark:data-active:bg-[var(--color-gold)/0.1] dark:data-hover:bg-[var(--color-gold)/0.1]',
    '[--btn-icon:var(--color-maroon)] data-active:[--btn-icon:var(--color-gold)] data-hover:[--btn-icon:var(--color-gold)]',
  ],
  colors: {
  maroon: [
    'text-white bg-[var(--color-maroon)] border-transparent',
    'dark:bg-[var(--color-maroon)]',
    '[--btn-icon:var(--color-gold)] data-active:[--btn-icon:var(--color-yellow)] data-hover:[--btn-icon:var(--color-yellow)]',
  ],
  gold: [
    'text-[var(--color-maroon)] bg-[var(--color-gold)] border-transparent',
    'dark:bg-[var(--color-gold)]',
    '[--btn-icon:var(--color-maroon)] data-active:[--btn-icon:var(--color-saffron)] data-hover:[--btn-icon:var(--color-saffron)]',
  ],
  saffron: [
    'text-[var(--text-main)] bg-[var(--color-saffron)] border-transparent',
    'dark:bg-[var(--color-saffron)]',
    '[--btn-icon:var(--text-main)] data-active:[--btn-icon:var(--color-yellow)] data-hover:[--btn-icon:var(--color-yellow)]',
  ],
  // no orange here for buttons on login page
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
  let variantClass = outline ? styles.outline : plain ? styles.plain : styles.solid
  let colorClass = color ? styles.colors[color] : []
  let classes = clsx(className, styles.base, variantClass, colorClass)

  return typeof props.href === 'string' ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
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

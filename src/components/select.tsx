import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const Select = forwardRef(function Select(
  { className, multiple, ...props }: { className?: string } & Omit<Headless.SelectProps, 'as' | 'className'>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        'group relative block w-full',
        // Background shadow frame
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-[var(--color-surface)] before:shadow-sm',
        'dark:before:hidden',
        // Focus ring — now uses your primary
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-focus:after:ring-2 has-data-focus:after:ring-[var(--color-primary)]',
        // Disabled
        'has-data-disabled:opacity-50 has-data-disabled:before:bg-[var(--color-border)]/10 has-data-disabled:before:shadow-none',
      ])}
    >
      <Headless.Select
        ref={ref}
        multiple={multiple}
        {...props}
        className={clsx([
          'relative block w-full appearance-none rounded-lg py-2.5 sm:py-1.5',
          multiple
            ? 'px-3.5 sm:px-3'
            : 'pr-10 pl-3.5 sm:pr-9 sm:pl-3',
          // Typography
          'text-base/6 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] sm:text-sm/6',
          // Border
          'border border-[var(--color-border)] data-hover:border-[var(--color-primary)]',
          // Background + hover
          'bg-[var(--color-surface)] hover:bg-[var(--color-background)] transition-colors duration-200',
          // Focus
          'focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]',
          // Invalid
          'data-invalid:border-red-500 data-hover:data-invalid:border-red-500',
          // Disabled
          'data-disabled:border-[var(--color-border)] data-disabled:opacity-60 data-disabled:cursor-not-allowed',
        ])}
      />
      {!multiple && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="size-5 stroke-[var(--color-text-secondary)] group-has-data-disabled:stroke-[var(--color-border)] sm:size-4"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  )
})

'use client'

import clsx from 'clsx'
import React, { createContext, useContext } from 'react'
import { Link } from './link'

interface TableContextType {
  bleed: boolean
  dense: boolean
  grid: boolean
  striped: boolean
}

const TableContext = createContext<TableContextType>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
})

interface TableRowContextType {
  href?: string
  target?: string
  title?: string
} 

const TableRowContext = createContext<TableRowContextType>({})

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: {
  bleed?: boolean
  dense?: boolean
  grid?: boolean
  striped?: boolean
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <TableContext.Provider value={{ bleed, dense, grid, striped }}>
      <div className="overflow-x-auto">
        <div
          {...props}
          className={clsx(
            className,
            'inline-block min-w-full align-middle',
            !bleed && 'px-2'
          )}
        >
          <table 
            className="min-w-full border-collapse text-left text-sm text-[var(--color-maroon)] bg-[var(--color-cream)] rounded-lg shadow" // added bg and rounding
          >
            {children}
          </table>
        </div>
      </div>
    </TableContext.Provider>
  )
}


export function TableHead({ className, ...props }: React.ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead
      {...props}
      className={clsx(
        className,
        'text-[var(--color-maroon)] bg-[var(--color-gold)] font-semibold'
      )}
    />
  )
}

export function TableBody(props: React.ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} />
}

export function TableRow({
  href,
  target,
  title,
  className,
  ...props
}: { href?: string; target?: string; title?: string } & React.ComponentPropsWithoutRef<'tr'>) {
  const { striped } = useContext(TableContext)

  return (
    <TableRowContext.Provider value={{ href, target, title }}>
      <tr
        {...props}
        className={clsx(
          'group transition-colors duration-200',
          className,
          striped && 'even:bg-[var(--color-cream)] dark:even:bg-[var(--color-background)]',
          'hover:bg-[var(--color-cream)] dark:hover:bg-[var(--color-cream)]'
        )}
      />
    </TableRowContext.Provider>
  )
}

export function TableHeader({ className, ...props }: React.ComponentPropsWithoutRef<'th'>) {
  const { bleed, grid } = useContext(TableContext)

  return (
    <th
      {...props}
      className={clsx(
        'border-b border-[var(--color-earth)] px-4 py-2 font-medium text-left first:pl-2 last:pr-2',
        grid && 'border-l border-l-[var(--color-earth)] first:border-l-0',
        !bleed && 'sm:first:pl-2 sm:last:pr-2',
        'group-hover:bg-[var(--color-saffron)]',
        className
      )}
    />
  )
}

export function TableCell({ className, children, ...props }: React.ComponentPropsWithoutRef<'td'>) {
  const { bleed, dense, grid } = useContext(TableContext)
  const context = useContext(TableRowContext)

  return (
    <td
      {...props}
      className={clsx(
        'relative border-b border-[var(--color-earth)] px-4',
        dense ? 'py-2' : 'py-4',
        grid && 'border-l border-l-[var(--color-earth)] first:border-l-0',
        !bleed && 'sm:first:pl-2 sm:last:pr-2',
        className
      )}
    >
      {context.href ? (
        <Link
          data-row-link
          href={context.href}
          target={context.target}
          aria-label={context.title}
          className="absolute inset-0 focus:outline-none"
        />
      ) : null}
      {children}
    </td>
  )
}

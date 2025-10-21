import type React from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col p-2 bg-[var( --color-cream)]">
      <div className="flex grow items-center justify-center p-6 rounded-2xl bg-[var(--bg-card)] shadow-lg ring-1 ring-[var(--color-earth)]">
        {children}
      </div>
    </main>
  )
}

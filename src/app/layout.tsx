import '@/styles/tailwind.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - Catalyst',
    default: 'Catalyst',
  },
  description: '',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   <html
  lang="en"
  className="antialiased"
  style={{
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-main)',
  }}
>

      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}

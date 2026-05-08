import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BD Passport Photo',
  description: 'Free BD passport photo converter — runs entirely in your browser',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

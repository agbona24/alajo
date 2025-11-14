import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hajo - Digital Savings Platform',
  description: 'Save smarter with digital ajo. Traditional savings meet modern technology.',
  manifest: '/manifest.json',
  themeColor: '#667eea',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hajo',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

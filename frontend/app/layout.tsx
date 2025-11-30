import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppSettingsProvider } from '@/contexts/AppSettingsContext'
import DynamicFavicon from '@/components/DynamicFavicon'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#667eea',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://alajo.ng'),
  title: {
    default: 'Alajo - Digital Savings Platform | Save Money with Traditional Ajo System',
    template: '%s | Alajo',
  },
  description: 'Save smarter with Alajo - Nigeria\'s leading digital savings platform. Join thousands saving with our modern ajo system. Secure, flexible, and easy daily/weekly/monthly contributions.',
  keywords: [
    'alajo',
    'ajo savings',
    'digital savings',
    'Nigeria savings',
    'ajo contribution',
    'save money Nigeria',
    'daily savings',
    'weekly savings',
    'monthly savings',
    'thrift savings',
    'cooperative savings',
    'esusu',
    'adashe',
    'online savings platform',
    'mobile savings app',
    'Lagos savings',
    'Nigerian fintech',
    'savings group',
    'contribution platform',
    'digital ajo',
  ],
  authors: [{ name: 'Alajo' }],
  creator: 'Alajo',
  publisher: 'Alajo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Alajo',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://alajo.ng',
    siteName: 'Alajo',
    title: 'Alajo - Digital Savings Platform | Save Money Online in Nigeria',
    description: 'Join thousands of Nigerians saving smarter with Alajo. Modern digital ajo system with secure daily, weekly, and monthly contributions. Start saving today!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alajo - Digital Savings Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alajo - Digital Savings Platform | Save Money Online',
    description: 'Save smarter with Alajo. Nigeria\'s modern digital ajo system with secure contributions and flexible savings plans.',
    images: ['/og-image.png'],
    creator: '@alajong',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://alajo.ng',
  },
  category: 'Finance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppSettingsProvider>
          <DynamicFavicon />
          {children}
        </AppSettingsProvider>
      </body>
    </html>
  )
}

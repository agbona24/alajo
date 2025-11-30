import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login to Your Account',
  description: 'Access your Alajo savings account. Login to view your savings plans, make contributions, track progress, and withdraw funds. Secure digital ajo platform.',
  openGraph: {
    title: 'Login to Alajo - Digital Savings Platform',
    description: 'Access your savings account and manage your ajo contributions online.',
    url: 'https://alajo.ng/login',
  },
  alternates: {
    canonical: 'https://alajo.ng/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

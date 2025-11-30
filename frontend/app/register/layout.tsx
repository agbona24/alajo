import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account - Start Saving Today',
  description: 'Join thousands of Nigerians saving smarter with Alajo. Create your free account and start your digital ajo journey. Easy registration, secure savings, flexible contributions.',
  keywords: [
    'alajo registration',
    'create savings account',
    'sign up ajo',
    'join alajo',
    'register savings Nigeria',
    'open savings account',
    'digital ajo signup',
  ],
  openGraph: {
    title: 'Create Your Alajo Account - Start Saving Today',
    description: 'Join thousands saving smarter with Alajo. Free registration, secure platform, flexible savings plans.',
    url: 'https://alajo.ng/register',
  },
  alternates: {
    canonical: 'https://alajo.ng/register',
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

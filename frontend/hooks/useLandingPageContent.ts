import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface LandingPageContent {
  hero: Record<string, string>
  stats: Record<string, string>
  features: Record<string, string>
  how_it_works: Record<string, string>
  testimonials: Record<string, string>
  cta: Record<string, string>
  footer: Record<string, string>
}

export function useLandingPageContent() {
  const [content, setContent] = useState<LandingPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await api.get('/landing-page')

        if (response.data.success) {
          setContent(response.data.data)
        } else {
          throw new Error('Failed to fetch landing page content')
        }
      } catch (err) {
        console.error('Error fetching landing page content:', err)
        setError('Failed to load content')
        // Set default content as fallback
        setContent(getDefaultContent())
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { content, loading, error }
}

// Fallback content in case API fails
function getDefaultContent(): LandingPageContent {
  return {
    hero: {
      badge_text: 'Join 10,000+ Happy Savers',
      title_line1: 'Your Money, Your Future',
      title_line2: 'Na Digital Ajo!',
      subtitle1: 'Small small, e go plenty! Save with your people, track every kobo, and achieve your dreams.',
      subtitle2: 'Whether na new phone, school fees, rent, or owambe money - Alajo get you covered. Traditional ajo meet modern tech. No wahala, just results! 💪',
      cta_primary: 'Start Saving Now',
      cta_secondary: 'See How It Works',
      trust_1: '100% Secure',
      trust_2: 'Bank-Level Encryption',
      trust_3: 'Instant Withdrawals',
    },
    stats: {
      stat1_number: '500+',
      stat1_label: 'Active Savers',
      stat2_number: '₦5M+',
      stat2_label: 'Total Ajo Saved',
      stat3_number: '10+',
      stat3_label: 'Active Groups',
      stat4_number: '99.9%',
      stat4_label: 'Success Rate',
    },
    features: {
      section_title: 'Everything Wey You Need',
      section_subtitle: 'All the tools to make your savings journey sweet',
      feature1_icon: '👥',
      feature1_title: 'Group Savings (Ajo)',
      feature1_desc: 'Join or create ajo groups with your people. Rotate contributions and collect big when na your turn!',
      feature2_icon: '💰',
      feature2_title: 'Personal Savings',
      feature2_desc: 'Create multiple savings plans for different goals. Daily, weekly, or monthly - you choose!',
      feature3_icon: '📱',
      feature3_title: 'Daily Collections',
      feature3_desc: 'Get reminders. Pay from anywhere. Your collector tracks everything for you. E simple die!',
      feature4_icon: '📊',
      feature4_title: 'Smart Tracking',
      feature4_desc: 'See where every kobo dey go. Beautiful charts, instant updates, full transparency.',
      feature5_icon: '🔒',
      feature5_title: 'Secure Wallet',
      feature5_desc: 'Bank-level security. Your money dey safe. Withdraw anytime you need am.',
      feature6_icon: '🎯',
      feature6_title: 'Goal Setting',
      feature6_desc: 'Set targets, track progress, celebrate wins! Every milestone na achievement.',
    },
    how_it_works: {
      section_title: 'How E Dey Work',
      section_subtitle: 'Start saving in just 3 simple steps',
      step1_number: '1',
      step1_title: 'Create Account',
      step1_desc: 'Sign up with your phone number. E dey take less than 2 minutes. No long thing!',
      step2_number: '2',
      step2_title: 'Choose Your Plan',
      step2_desc: 'Join existing ajo group or create personal savings plan. You fit do both sef!',
      step3_number: '3',
      step3_title: 'Start Saving',
      step3_desc: 'Make contributions, track your progress, and watch your money grow. E dey sweet!',
    },
    testimonials: {
      section_title: 'Wetin People Dey Talk',
      section_subtitle: 'Hear from our happy savers',
      testimonial1_avatar: '👩‍💼',
      testimonial1_name: 'Chioma Okafor',
      testimonial1_role: 'Small Business Owner',
      testimonial1_text: 'This app don change my life! I save ₦500 everyday with my market women group. Last month, I collect ₦75,000 when na my turn. I use am expand my business. God bless Alajo!',
      testimonial2_avatar: '👨‍🎓',
      testimonial2_name: 'Ibrahim Musa',
      testimonial2_role: 'University Student',
      testimonial2_text: 'My guy, this thing too dey work! Me and my roommates save ₦1000 daily. In 3 months, I get money buy new laptop for school. The tracking system na correct something.',
      testimonial3_avatar: '👩‍⚕️',
      testimonial3_name: 'Blessing Adewale',
      testimonial3_role: 'Nurse',
      testimonial3_text: 'Security na number one for me. With this app, I fit track every kobo. The daily reminders dey help me stay consistent. I don already save ₦200,000 in 6 months!',
    },
    cta: {
      title: 'Ready to Start Your Journey?',
      subtitle: 'Join thousands of Nigerians building wealth, one naira at a time',
      button_text: 'Create Free Account',
      subtext: 'No credit card required • Start with ₦500',
    },
    footer: {
      tagline: 'Save Small Small, Prosper Big Big',
      description: 'The modern way to save with your people. Built for Nigerians, by Nigerians.',
      copyright: '© 2025 Alajo. All rights reserved. Built with ❤️ in Nigeria By Harzotech.',
    },
  }
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'
import { authAPI, savingsAPI } from '@/lib/api'
import {
  isBiometricAvailable,
  isBiometricEnabled,
  enrollBiometric,
  disableBiometric,
} from '@/lib/biometricAuth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ totalPlans: 0, totalSaved: 0, contributions: 0 })
  const [loading, setLoading] = useState(true)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    contributions: true,
    withdrawals: true,
    milestones: true,
    groupActivity: false,
    marketing: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }

        const [userData, plansData] = await Promise.all([
          authAPI.getUser(),
          savingsAPI.getPlans()
        ])

        setUser(userData)

        // Calculate stats
        const plans = plansData || []
        const totalSaved = plans.reduce((sum: number, p: any) => sum + Number(p.current_amount || 0), 0)
        const totalContributions = plans.reduce((sum: number, p: any) => sum + (p.contributions?.length || 0), 0)

        setStats({
          totalPlans: plans.length,
          totalSaved,
          contributions: totalContributions,
        })

        // Check biometric availability
        const bioAvailable = await isBiometricAvailable()
        setBiometricAvailable(bioAvailable)
        setBiometricEnabled(isBiometricEnabled())
      } catch (error: any) {
        console.error('Profile error:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleBiometricToggle = async () => {
    if (!user) return

    setBiometricLoading(true)
    try {
      if (biometricEnabled) {
        // Disable biometric
        disableBiometric()
        setBiometricEnabled(false)
        alert('Biometric login disabled')
      } else {
        // Enroll biometric
        await enrollBiometric({
          id: user.id,
          phone: user.phone,
          name: user.name,
        })
        setBiometricEnabled(true)
        alert('Biometric login enabled successfully! You can now use fingerprint or Face ID to login.')
      }
    } catch (error: any) {
      console.error('Biometric toggle error:', error)
      alert(error.message || 'Failed to update biometric settings')
    } finally {
      setBiometricLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Profile"
        subtitle="Manage your account"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden animate-fade-in-up">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30">
                👤
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-white/80 text-sm mb-1">{user?.email}</p>
                <p className="text-white/70 text-xs">
                  {user?.phone || '-'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">{stats.totalPlans}</div>
                <div className="text-xs text-white/80">Active Plans</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">{formatCurrency(stats.totalSaved)}</div>
                <div className="text-xs text-white/80">Total Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">{stats.contributions}</div>
                <div className="text-xs text-white/80">Contributions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Account</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="👤"
              label="Personal Information"
              description="Name, email, phone number"
              onClick={() => router.push('/profile/personal-info')}
            />
            <SettingItem
              icon="💳"
              label="Payment Methods"
              description="Cards and bank accounts"
              onClick={() => router.push('/profile/bank-accounts')}
            />
            <SettingItem
              icon="📍"
              label="Address"
              description="Manage your addresses"
              onClick={() => router.push('/profile/address')}
              showBorder={false}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Security</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="🔐"
              label="Change Password"
              description="Update your password"
              onClick={() => router.push('/profile/change-password')}
            />
            <SettingItem
              icon="🛡️"
              label="Two-Factor Authentication"
              description="Add extra security"
              onClick={() => {}}
              badge="Recommended"
            />
            {biometricAvailable ? (
              <SettingItem
                icon="👆"
                label="Biometric Login"
                description={biometricLoading ? 'Setting up...' : (biometricEnabled ? 'Enabled - Tap to disable' : 'Use fingerprint or Face ID')}
                onClick={() => {}}
                showBorder={false}
                hasToggle
                toggleValue={biometricEnabled}
                onToggle={handleBiometricToggle}
              />
            ) : (
              <SettingItem
                icon="👆"
                label="Biometric Login"
                description="Not available on this device"
                onClick={() => {}}
                showBorder={false}
                hasToggle
                toggleValue={false}
              />
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Notifications</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="💰"
              label="Contribution Reminders"
              description="Get notified when it's time to save"
              hasToggle
              toggleValue={notifications.contributions}
              onToggle={() => setNotifications({...notifications, contributions: !notifications.contributions})}
            />
            <SettingItem
              icon="💸"
              label="Withdrawal Updates"
              description="Status of your withdrawal requests"
              hasToggle
              toggleValue={notifications.withdrawals}
              onToggle={() => setNotifications({...notifications, withdrawals: !notifications.withdrawals})}
            />
            <SettingItem
              icon="🏆"
              label="Milestone Achievements"
              description="Celebrate when you hit goals"
              hasToggle
              toggleValue={notifications.milestones}
              onToggle={() => setNotifications({...notifications, milestones: !notifications.milestones})}
              showBorder={false}
            />
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Help & Support</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="❓"
              label="Help Center"
              description="FAQs and guides"
              onClick={() => router.push('/profile/help-center')}
            />
            <SettingItem
              icon="💬"
              label="Contact Support"
              description="Chat with our team"
              onClick={() => window.open('https://wa.me/2349071142022?text=Hello, I need help with my Alajo account', '_blank')}
            />
            <SettingItem
              icon="⭐"
              label="Rate Alajo"
              description="Share your feedback"
              onClick={() => router.push('/profile/rate-app')}
              showBorder={false}
            />
          </div>
        </div>

        {/* Legal Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Legal</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="📄"
              label="Terms of Service"
              description="Read our terms"
              onClick={() => router.push('/profile/terms')}
            />
            <SettingItem
              icon="🔒"
              label="Privacy Policy"
              description="How we protect your data"
              onClick={() => router.push('/profile/privacy')}
            />
            <SettingItem
              icon="ℹ️"
              label="About Alajo"
              description="Version 1.0.0"
              onClick={() => router.push('/profile/about')}
              showBorder={false}
            />
          </div>
        </div>

        {/* Logout Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Alajo v1.0.0 - Savings Saves Life
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

function SettingItem({
  icon,
  label,
  description,
  onClick,
  showBorder = true,
  badge,
  value,
  hasToggle = false,
  toggleValue = false,
  onToggle,
}: {
  icon: string
  label: string
  description: string
  onClick?: () => void
  showBorder?: boolean
  badge?: string
  value?: string
  hasToggle?: boolean
  toggleValue?: boolean
  onToggle?: () => void
}) {
  return (
    <button
      onClick={hasToggle ? onToggle : onClick}
      className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition active:bg-gray-100 text-left ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-gray-900">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>

      {/* Right Element */}
      {hasToggle ? (
        <div
          className={`w-12 h-7 rounded-full transition-colors ${
            toggleValue ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${
              toggleValue ? 'translate-x-6 ml-1' : 'translate-x-1'
            }`}
          />
        </div>
      ) : value ? (
        <span className="text-sm font-medium text-gray-500">{value}</span>
      ) : (
        <span className="text-gray-400 text-xl">›</span>
      )}
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'

const mockUser = {
  name: 'Chioma Adeyemi',
  email: 'chioma.adeyemi@example.com',
  phone: '+234 803 456 7890',
  avatar: '👩🏾',
  memberSince: '2024-01-15',
}

export default function ProfilePage() {
  const router = useRouter()
  const [user] = useState(mockUser)
  const [notifications, setNotifications] = useState({
    contributions: true,
    withdrawals: true,
    milestones: true,
    groupActivity: false,
    marketing: false,
  })

  const handleLogout = () => {
    router.push('/login')
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
                {user.avatar}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-white/80 text-sm mb-1">{user.email}</p>
                <p className="text-white/70 text-xs">
                  Member since {new Date(user.memberSince).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={() => router.push('/profile/edit')}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition active:scale-95"
              >
                <span className="text-lg">✏️</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">5</div>
                <div className="text-xs text-white/80">Active Plans</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">₦2.4M</div>
                <div className="text-xs text-white/80">Total Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold mb-1">48</div>
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
              onClick={() => router.push('/profile/edit')}
            />
            <SettingItem
              icon="💳"
              label="Payment Methods"
              description="Cards and bank accounts"
              onClick={() => router.push('/profile/payment-methods')}
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
              onClick={() => router.push('/profile/2fa')}
              badge="Recommended"
            />
            <SettingItem
              icon="👆"
              label="Biometric Login"
              description="Use fingerprint or Face ID"
              onClick={() => {}}
              showBorder={false}
              hasToggle
              toggleValue={false}
            />
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
            />
            <SettingItem
              icon="👥"
              label="Group Activity"
              description="Updates from your ajo groups"
              hasToggle
              toggleValue={notifications.groupActivity}
              onToggle={() => setNotifications({...notifications, groupActivity: !notifications.groupActivity})}
            />
            <SettingItem
              icon="📢"
              label="Marketing & Promotions"
              description="Special offers and updates"
              hasToggle
              toggleValue={notifications.marketing}
              onToggle={() => setNotifications({...notifications, marketing: !notifications.marketing})}
              showBorder={false}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Preferences</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="🌍"
              label="Language"
              description="English (Nigeria)"
              onClick={() => {}}
              value="English"
            />
            <SettingItem
              icon="💱"
              label="Currency"
              description="Nigerian Naira (₦)"
              onClick={() => {}}
              value="NGN"
              showBorder={false}
            />
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Help & Support</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="❓"
              label="Help Center"
              description="FAQs and guides"
              onClick={() => {}}
            />
            <SettingItem
              icon="💬"
              label="Contact Support"
              description="Chat with our team"
              onClick={() => {}}
            />
            <SettingItem
              icon="⭐"
              label="Rate Hajo"
              description="Share your feedback"
              onClick={() => {}}
              showBorder={false}
            />
          </div>
        </div>

        {/* Legal Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">Legal</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingItem
              icon="📄"
              label="Terms of Service"
              description="Read our terms"
              onClick={() => {}}
            />
            <SettingItem
              icon="🔒"
              label="Privacy Policy"
              description="How we protect your data"
              onClick={() => {}}
            />
            <SettingItem
              icon="ℹ️"
              label="About Hajo"
              description="Version 1.0.0"
              onClick={() => {}}
              showBorder={false}
            />
          </div>
        </div>

        {/* Logout Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
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
          Hajo v1.0.0 • Savings Saves Life 💚
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

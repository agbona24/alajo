'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'

// Mock data - will be replaced with API call
const mockPlan = {
  id: 1,
  name: 'iPhone 15 Fund',
  emoji: '📱',
  target_amount: 500000,
  current_amount: 245000,
  frequency: 'weekly',
  duration: 12,
  plan_type: 'personal',
  description: 'Saving for my new iPhone 15 Pro Max. No more old phone wahala!',
  created_at: '2024-01-15',
  contributions: [
    { id: 1, amount: 25000, date: '2024-11-14', status: 'completed', method: 'Bank Transfer' },
    { id: 2, amount: 20000, date: '2024-11-07', status: 'completed', method: 'Card' },
    { id: 3, amount: 25000, date: '2024-10-31', status: 'completed', method: 'Bank Transfer' },
    { id: 4, amount: 30000, date: '2024-10-24', status: 'completed', method: 'Bank Transfer' },
    { id: 5, amount: 25000, date: '2024-10-17', status: 'completed', method: 'Card' },
    { id: 6, amount: 20000, date: '2024-10-10', status: 'completed', method: 'Bank Transfer' },
    { id: 7, amount: 25000, date: '2024-10-03', status: 'completed', method: 'Bank Transfer' },
    { id: 8, amount: 25000, date: '2024-09-26', status: 'completed', method: 'Card' },
    { id: 9, amount: 25000, date: '2024-09-19', status: 'completed', method: 'Bank Transfer' },
    { id: 10, amount: 25000, date: '2024-09-12', status: 'completed', method: 'Bank Transfer' },
  ],
  milestones: [
    { percentage: 25, reached: true, date: '2024-09-20' },
    { percentage: 50, reached: false, date: null },
    { percentage: 75, reached: false, date: null },
    { percentage: 100, reached: false, date: null },
  ]
}

export default function SavingsPlanDetails() {
  const router = useRouter()
  const params = useParams()
  const [plan] = useState(mockPlan)
  const [showActions, setShowActions] = useState(false)

  const progress = Math.min(Math.round((plan.current_amount / plan.target_amount) * 100), 100)
  const remaining = plan.target_amount - plan.current_amount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const getWeeksRemaining = () => {
    const startDate = new Date(plan.created_at)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + plan.duration)
    const now = new Date()
    const weeksLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7))
    return Math.max(0, weeksLeft)
  }

  const calculateProjectedDate = () => {
    const avgContribution = plan.current_amount / plan.contributions.length
    const contributionsNeeded = Math.ceil(remaining / avgContribution)
    const weeksNeeded = contributionsNeeded
    const projectedDate = new Date()
    projectedDate.setDate(projectedDate.getDate() + (weeksNeeded * 7))
    return projectedDate.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
  }

  const quickActions = [
    { id: 'contribute', icon: '💰', label: 'Add Money', color: 'from-green-500 to-green-600', route: `/savings/${plan.id}/contribute` },
    { id: 'withdraw', icon: '💸', label: 'Withdraw', color: 'from-orange-500 to-orange-600', route: `/savings/${plan.id}/withdraw` },
    { id: 'edit', icon: '✏️', label: 'Edit Plan', color: 'from-blue-500 to-blue-600', route: `/savings/${plan.id}/edit` },
    { id: 'share', icon: '📤', label: 'Share', color: 'from-purple-500 to-purple-600', onClick: () => handleShare() },
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${plan.name} on Hajo`,
        text: `I'm ${progress}% towards my goal of ${formatCurrency(plan.target_amount)}! 💪`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title={plan.name}
        subtitle={`${progress}% complete`}
        showBack
        action={{
          icon: '⋮',
          onClick: () => setShowActions(!showActions)
        }}
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden animate-fade-in-up">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full animate-ping-slow"></div>
          </div>

          <div className="relative z-10">
            {/* Emoji & Title */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-6xl mb-3 drop-shadow-lg">{plan.emoji}</div>
                <h1 className="text-2xl font-bold mb-1">{plan.name}</h1>
                <p className="text-white/80 text-sm capitalize">
                  {plan.plan_type} • {plan.frequency} savings
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80 mb-1">Progress</div>
                <div className="text-4xl font-bold">{progress}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold">{formatCurrency(plan.current_amount)}</span>
                <span className="text-sm text-white/80">of {formatCurrency(plan.target_amount)}</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-white/80 text-xs mb-1">Remaining</div>
                <div className="text-lg font-bold">{formatCurrency(remaining)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-white/80 text-xs mb-1">Projected Date</div>
                <div className="text-lg font-bold">{calculateProjectedDate()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => action.route ? router.push(action.route) : action.onClick?.()}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {action.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            icon="📊"
            label="Total Paid"
            value={plan.contributions.length.toString()}
            suffix="times"
          />
          <StatCard
            icon="📅"
            label="Weeks Left"
            value={getWeeksRemaining().toString()}
            suffix="weeks"
          />
          <StatCard
            icon="⚡"
            label="Streak"
            value="8"
            suffix="weeks"
          />
        </div>

        {/* Motivation */}
        {plan.description && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 mb-6 border-2 border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💭</span>
              <div>
                <div className="font-bold text-gray-900 mb-1">Your Motivation</div>
                <p className="text-sm text-gray-700 italic">"{plan.description}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>Milestones</span>
          </h2>
          <div className="space-y-3">
            {plan.milestones.map((milestone) => (
              <div key={milestone.percentage} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.reached
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                    : progress >= milestone.percentage
                    ? 'bg-gradient-to-br from-primary to-secondary text-white animate-bounce-in'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {milestone.reached || progress >= milestone.percentage ? '✓' : milestone.percentage + '%'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{milestone.percentage}% Complete</div>
                  {milestone.reached && milestone.date && (
                    <div className="text-xs text-gray-500">Reached on {formatDate(milestone.date)}</div>
                  )}
                </div>
                {milestone.reached && <span className="text-2xl">🎉</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Contribution History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📝</span>
              <span>Contribution History</span>
            </h2>
            <button className="text-sm font-semibold text-primary">View All</button>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {plan.contributions.slice(0, 5).map((contribution, index) => (
              <div key={contribution.id} className="flex items-start gap-4 relative">
                {/* Timeline Line */}
                {index < plan.contributions.slice(0, 5).length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                )}

                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10 shadow-md">
                  ✓
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{formatCurrency(contribution.amount)}</span>
                    <span className="text-xs text-gray-500">{formatDate(contribution.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                      {contribution.status}
                    </span>
                    <span className="text-xs text-gray-500">{contribution.method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {plan.contributions.length > 5 && (
            <button
              onClick={() => router.push(`/savings/${plan.id}/history`)}
              className="w-full mt-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-primary hover:bg-primary/5 transition active:scale-95"
            >
              View All {plan.contributions.length} Contributions
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold text-gray-900 mb-1">Keep It Up!</div>
              <p className="text-sm text-gray-700">
                You dey do well! Just {getWeeksRemaining()} weeks to go. Small small, you go reach your target! 💪
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* FAB - Primary Action */}
      <button
        onClick={() => router.push(`/savings/${plan.id}/contribute`)}
        className="md:hidden fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl flex items-center justify-center text-white text-2xl active:scale-90 transition-transform z-40"
        style={{ boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)' }}
      >
        💰
      </button>
    </div>
  )
}

function StatCard({ icon, label, value, suffix }: {
  icon: string
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {suffix && <div className="text-xs text-gray-400">{suffix}</div>}
    </div>
  )
}

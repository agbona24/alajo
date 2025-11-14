'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MobileNav from '@/components/MobileNav'
import AppHeader from '@/components/AppHeader'

interface SavingsPlan {
  id: number
  name: string
  target_amount: number
  current_amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  status: 'active' | 'completed' | 'paused'
  created_at: string
}

export default function SavingsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<SavingsPlan[]>([
    {
      id: 1,
      name: 'Emergency Fund',
      target_amount: 500000,
      current_amount: 125000,
      frequency: 'monthly',
      status: 'active',
      created_at: '2024-10-01',
    },
    {
      id: 2,
      name: 'New Laptop',
      target_amount: 300000,
      current_amount: 280000,
      frequency: 'weekly',
      status: 'active',
      created_at: '2024-09-15',
    },
  ])
  // Removed modal state - now using dedicated create page

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalSaved = plans.reduce((sum, plan) => sum + plan.current_amount, 0)
  const totalTarget = plans.reduce((sum, plan) => sum + plan.target_amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden">
        <AppHeader
          title="My Savings"
          subtitle={`${plans.length} active plans`}
          showBack
          action={{
            icon: '➕',
            onClick: () => router.push('/savings/create')
          }}
        />
      </div>

      {/* Desktop Header */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Savings Plans</h1>
            <button
              onClick={() => router.push('/savings/create')}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              + New Plan
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
        {/* Summary Cards - Mobile Horizontal Scroll */}
        <div className="md:hidden mb-6 -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <MobileSummaryCard
              icon="💰"
              label="Total Saved"
              value={formatCurrency(totalSaved)}
              gradient="from-green-500 to-green-600"
            />
            <MobileSummaryCard
              icon="🎯"
              label="Total Target"
              value={formatCurrency(totalTarget)}
              gradient="from-blue-500 to-blue-600"
            />
            <MobileSummaryCard
              icon="📊"
              label="Active Plans"
              value={plans.filter(p => p.status === 'active').length.toString()}
              gradient="from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* Desktop Summary Cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon="💰"
            title="Total Saved"
            value={formatCurrency(totalSaved)}
            subtitle="Across all plans"
          />
          <SummaryCard
            icon="🎯"
            title="Target Amount"
            value={formatCurrency(totalTarget)}
            subtitle="Total goals"
          />
          <SummaryCard
            icon="📊"
            title="Active Plans"
            value={plans.filter(p => p.status === 'active').length.toString()}
            subtitle="Currently saving"
          />
        </div>

        {/* Section Title - Mobile */}
        <div className="md:hidden mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Plans</h2>
        </div>

        {/* Savings Plans List - Mobile Cards */}
        <div className="md:hidden space-y-3 mb-6">
          {plans.map((plan, index) => (
            <MobilePlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onViewDetails={() => router.push(`/savings/${plan.id}`)}
              onContribute={() => router.push(`/savings/${plan.id}/contribute`)}
              formatCurrency={formatCurrency}
              calculateProgress={calculateProgress}
            />
          ))}
        </div>

        {/* Desktop Savings Plans Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onViewDetails={() => router.push(`/savings/${plan.id}`)}
              onContribute={() => router.push(`/savings/${plan.id}/contribute`)}
              formatCurrency={formatCurrency}
              calculateProgress={calculateProgress}
            />
          ))}

          {/* Add New Plan Card */}
          <button
            onClick={() => router.push('/savings/create')}
            className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:bg-purple-50 transition flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-primary"
          >
            <div className="text-5xl">➕</div>
            <div className="text-lg font-semibold">Create New Plan</div>
          </button>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Floating Action Button - Mobile */}
      <button
        onClick={() => router.push('/savings/create')}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-white text-2xl active:scale-90 transition-transform z-40"
        style={{ boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)' }}
      >
        ➕
      </button>
    </div>
  )
}

// Mobile Summary Card
function MobileSummaryCard({
  icon,
  label,
  value,
  gradient
}: {
  icon: string
  label: string
  value: string
  gradient: string
}) {
  return (
    <div className="min-w-[140px] bg-white rounded-2xl p-4 shadow-sm">
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-xl mb-3 shadow-sm`}>
        {icon}
      </div>
      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

// Mobile Plan Card
function MobilePlanCard({
  plan,
  index,
  onViewDetails,
  onContribute,
  formatCurrency,
  calculateProgress,
}: {
  plan: SavingsPlan
  index: number
  onViewDetails: () => void
  onContribute: () => void
  formatCurrency: (amount: number) => string
  calculateProgress: (current: number, target: number) => number
}) {
  const progress = calculateProgress(plan.current_amount, plan.target_amount)

  const gradients = [
    'from-purple-500 to-purple-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-pink-500 to-pink-600',
  ]
  const gradient = gradients[index % gradients.length]

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in-up active:scale-98 transition-transform"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-br ${gradient} p-4 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-20 text-6xl">💰</div>
        <h3 className="text-lg font-bold mb-1 relative z-10">{plan.name}</h3>
        <p className="text-sm opacity-90 relative z-10 capitalize">{plan.frequency} savings</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Amount */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(plan.current_amount)}</span>
            <span className="text-sm text-gray-500">of {formatCurrency(plan.target_amount)}</span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 text-right mt-1">{progress}% complete</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onContribute}
            className={`flex-1 py-3 bg-gradient-to-r ${gradient} text-white rounded-xl font-semibold active:scale-95 transition-transform shadow-sm`}
          >
            Add Money
          </button>
          <button
            onClick={onViewDetails}
            className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold active:scale-95 transition-transform"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}

// Desktop Components (unchanged from before)
function SummaryCard({ icon, title, value, subtitle }: { icon: string; title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

function PlanCard({
  plan,
  onViewDetails,
  onContribute,
  formatCurrency,
  calculateProgress,
}: {
  plan: SavingsPlan
  onViewDetails: () => void
  onContribute: () => void
  formatCurrency: (amount: number) => string
  calculateProgress: (current: number, target: number) => number
}) {
  const progress = calculateProgress(plan.current_amount, plan.target_amount)

  const frequencyEmoji = {
    daily: '📅',
    weekly: '🗓️',
    monthly: '📆',
  }

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[plan.status]}`}>
            {plan.status}
          </span>
        </div>
        <div className="text-3xl font-bold">{formatCurrency(plan.current_amount)}</div>
        <div className="text-sm opacity-90">of {formatCurrency(plan.target_amount)}</div>
      </div>

      <div className="px-6 pt-4">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-center font-semibold">{progress}% Complete</div>
      </div>

      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <span>{frequencyEmoji[plan.frequency]}</span>
          <span className="text-sm capitalize">{plan.frequency} contributions</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>📌</span>
          <span className="text-sm">Started {new Date(plan.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onContribute}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition font-semibold"
        >
          Contribute
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-purple-50 transition font-semibold"
        >
          Details
        </button>
      </div>
    </div>
  )
}

// CreatePlanModal removed - now using dedicated /savings/create page

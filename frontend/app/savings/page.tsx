'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    // Mock data for UI development
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
  const [showCreateModal, setShowCreateModal] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              + New Plan
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon="💰"
            title="Total Saved"
            value={formatCurrency(plans.reduce((sum, plan) => sum + plan.current_amount, 0))}
            subtitle="Across all plans"
          />
          <SummaryCard
            icon="🎯"
            title="Target Amount"
            value={formatCurrency(plans.reduce((sum, plan) => sum + plan.target_amount, 0))}
            subtitle="Total goals"
          />
          <SummaryCard
            icon="📊"
            title="Active Plans"
            value={plans.filter(p => p.status === 'active').length.toString()}
            subtitle="Currently saving"
          />
        </div>

        {/* Savings Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onClick={() => setShowCreateModal(true)}
            className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:bg-purple-50 transition flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-primary"
          >
            <div className="text-5xl">➕</div>
            <div className="text-lg font-semibold">Create New Plan</div>
          </button>
        </div>
      </main>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newPlan) => {
            setPlans([...plans, newPlan])
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}

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
      {/* Header */}
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

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-center font-semibold">{progress}% Complete</div>
      </div>

      {/* Details */}
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

      {/* Actions */}
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

function CreatePlanModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (plan: SavingsPlan) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    frequency: 'monthly',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create mock plan (will be replaced with API call)
    const newPlan: SavingsPlan = {
      id: Date.now(),
      name: formData.name,
      target_amount: Number(formData.target_amount),
      current_amount: 0,
      frequency: formData.frequency as any,
      status: 'active',
      created_at: new Date().toISOString(),
    }

    onSuccess(newPlan)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Savings Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Emergency Fund, New Car"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Amount (₦)
            </label>
            <input
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              required
              min="1000"
              placeholder="500000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contribution Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  )
}

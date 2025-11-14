'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Transaction {
  id: number
  type: 'contribution' | 'withdrawal'
  amount: number
  date: string
  status: 'completed' | 'pending'
}

export default function PlanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id

  // Mock data
  const [plan] = useState({
    id: planId,
    name: 'Emergency Fund',
    target_amount: 500000,
    current_amount: 125000,
    frequency: 'monthly',
    status: 'active',
    created_at: '2024-10-01',
    description: 'Building a 6-month emergency fund for unexpected expenses',
  })

  const [transactions] = useState<Transaction[]>([
    { id: 1, type: 'contribution', amount: 50000, date: '2024-11-10', status: 'completed' },
    { id: 2, type: 'contribution', amount: 25000, date: '2024-11-05', status: 'completed' },
    { id: 3, type: 'contribution', amount: 50000, date: '2024-10-28', status: 'completed' },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const progress = Math.min(Math.round((plan.current_amount / plan.target_amount) * 100), 100)
  const remaining = plan.target_amount - plan.current_amount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/savings')}
            className="flex items-center gap-2 mb-4 opacity-90 hover:opacity-100 transition"
          >
            <span>←</span>
            <span>Back to Plans</span>
          </button>

          <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
          <p className="opacity-90">{plan.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-fade-in-up">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Current Amount</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(plan.current_amount)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Target Amount</div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(plan.target_amount)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Remaining</div>
              <div className="text-3xl font-bold text-secondary">{formatCurrency(remaining)}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && <span className="text-xs text-white font-semibold">{progress}%</span>}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <button
              onClick={() => router.push(`/savings/${planId}/contribute`)}
              className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition font-semibold"
            >
              💵 Make Contribution
            </button>
            <button
              onClick={() => alert('Withdrawal feature coming soon!')}
              className="px-6 py-4 border-2 border-primary text-primary rounded-xl hover:bg-purple-50 transition font-semibold"
            >
              💳 Request Withdrawal
            </button>
            <button
              onClick={() => alert('Edit feature coming soon!')}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              ⚙️ Edit Plan
            </button>
          </div>
        </div>

        {/* Plan Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Details</h2>
            <div className="space-y-3">
              <DetailRow icon="📅" label="Frequency" value={plan.frequency} />
              <DetailRow icon="📊" label="Status" value={plan.status} />
              <DetailRow icon="📌" label="Created" value={new Date(plan.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <DetailRow icon="🎯" label="Progress" value={`${progress}% completed`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <DetailRow icon="💰" label="Total Contributed" value={formatCurrency(plan.current_amount)} />
              <DetailRow icon="📈" label="Contributions" value={`${transactions.length} times`} />
              <DetailRow icon="⏱️" label="Days Active" value={`${Math.floor((Date.now() - new Date(plan.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`} />
              <DetailRow icon="🔥" label="Streak" value="Active" />
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600">No transactions yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-gray-600">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900 capitalize">{value}</span>
    </div>
  )
}

function TransactionItem({
  transaction,
  formatCurrency,
}: {
  transaction: Transaction
  formatCurrency: (amount: number) => string
}) {
  const typeConfig = {
    contribution: {
      icon: '💵',
      color: 'text-green-600',
      prefix: '+',
    },
    withdrawal: {
      icon: '💳',
      color: 'text-red-600',
      prefix: '-',
    },
  }

  const config = typeConfig[transaction.type]

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{config.icon}</div>
        <div>
          <div className="font-semibold text-gray-900 capitalize">{transaction.type}</div>
          <div className="text-sm text-gray-500">
            {new Date(transaction.date).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold text-lg ${config.color}`}>
          {config.prefix}
          {formatCurrency(transaction.amount)}
        </div>
        <div className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
          {transaction.status}
        </div>
      </div>
    </div>
  )
}

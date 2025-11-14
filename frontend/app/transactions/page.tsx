'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: number
  type: 'contribution' | 'withdrawal'
  plan_name: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  reference: string
}

export default function TransactionsPage() {
  const router = useRouter()

  // Mock data
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'contribution',
      plan_name: 'Emergency Fund',
      amount: 50000,
      status: 'completed',
      date: '2024-11-14T10:30:00',
      reference: 'TXN-001-2024',
    },
    {
      id: 2,
      type: 'contribution',
      plan_name: 'New Laptop',
      amount: 25000,
      status: 'completed',
      date: '2024-11-12T14:20:00',
      reference: 'TXN-002-2024',
    },
    {
      id: 3,
      type: 'withdrawal',
      plan_name: 'Vacation Fund',
      amount: 100000,
      status: 'pending',
      date: '2024-11-10T09:15:00',
      reference: 'TXN-003-2024',
    },
    {
      id: 4,
      type: 'contribution',
      plan_name: 'Emergency Fund',
      amount: 30000,
      status: 'completed',
      date: '2024-11-08T16:45:00',
      reference: 'TXN-004-2024',
    },
  ])

  const [filter, setFilter] = useState<'all' | 'contribution' | 'withdrawal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filter === 'all' || tx.type === filter
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    return matchesType && matchesStatus
  })

  const totalContributions = transactions
    .filter((tx) => tx.type === 'contribution' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0)

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
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💵</span>
              <h3 className="text-sm font-semibold text-gray-600">Total Contributions</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(totalContributions)}</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💳</span>
              <h3 className="text-sm font-semibold text-gray-600">Total Withdrawals</h3>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">{formatCurrency(totalWithdrawals)}</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-sm font-semibold text-gray-600">Total Transactions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{transactions.length}</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition"
              >
                <option value="all">All Types</option>
                <option value="contribution">Contributions</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Transaction History ({filteredTransactions.length})
          </h2>

          {filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600">No transactions found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function TransactionItem({
  transaction,
  formatCurrency,
  formatDate,
}: {
  transaction: Transaction
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string) => { date: string; time: string }
}) {
  const typeConfig = {
    contribution: {
      icon: '💵',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      prefix: '+',
    },
    withdrawal: {
      icon: '💳',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      prefix: '-',
    },
  }

  const statusConfig = {
    completed: {
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      label: 'Completed',
    },
    pending: {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      label: 'Pending',
    },
    failed: {
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      label: 'Failed',
    },
  }

  const config = typeConfig[transaction.type]
  const statusStyle = statusConfig[transaction.status]
  const { date, time } = formatDate(transaction.date)

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center text-2xl`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 capitalize">{transaction.type}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bgColor} ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
          </div>
          <div className="text-sm text-gray-600">{transaction.plan_name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {date} • {time}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={`font-bold text-lg ${config.color}`}>
          {config.prefix}
          {formatCurrency(transaction.amount)}
        </div>
        <div className="text-xs text-gray-500 mt-1">{transaction.reference}</div>
      </div>
    </div>
  )
}

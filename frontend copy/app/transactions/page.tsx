'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'

// Mock transaction data
const mockTransactions = [
  { id: 1, type: 'contribution', amount: 25000, plan: 'iPhone 15 Fund', planEmoji: '📱', date: '2024-11-14', time: '14:30', status: 'completed', method: 'Bank Transfer', reference: 'TRX-2024111401' },
  { id: 2, type: 'contribution', amount: 50000, plan: 'Wedding Dreams', planEmoji: '💍', date: '2024-11-13', time: '09:15', status: 'completed', method: 'Card', reference: 'TRX-2024111302' },
  { id: 3, type: 'withdrawal', amount: -30000, plan: 'Emergency Fund', planEmoji: '🏥', date: '2024-11-12', time: '16:45', status: 'completed', method: 'Bank Transfer', reference: 'TRX-2024111203' },
  { id: 4, type: 'contribution', amount: 20000, plan: 'New Laptop', planEmoji: '💻', date: '2024-11-10', time: '11:20', status: 'completed', method: 'Card', reference: 'TRX-2024111004' },
  { id: 5, type: 'contribution', amount: 15000, plan: 'Vacation Fund', planEmoji: '✈️', date: '2024-11-08', time: '13:10', status: 'pending', method: 'Bank Transfer', reference: 'TRX-2024110805' },
  { id: 6, type: 'contribution', amount: 25000, plan: 'iPhone 15 Fund', planEmoji: '📱', date: '2024-11-07', time: '10:30', status: 'completed', method: 'Bank Transfer', reference: 'TRX-2024110706' },
  { id: 7, type: 'contribution', amount: 40000, plan: 'Wedding Dreams', planEmoji: '💍', date: '2024-11-05', time: '15:20', status: 'completed', method: 'Card', reference: 'TRX-2024110507' },
  { id: 8, type: 'contribution', amount: 25000, plan: 'iPhone 15 Fund', planEmoji: '📱', date: '2024-10-31', time: '09:45', status: 'completed', method: 'Bank Transfer', reference: 'TRX-2024103108' },
  { id: 9, type: 'withdrawal', amount: -20000, plan: 'Emergency Fund', planEmoji: '🏥', date: '2024-10-28', time: '14:15', status: 'completed', method: 'Bank Transfer', reference: 'TRX-2024102809' },
  { id: 10, type: 'contribution', amount: 30000, plan: 'New Laptop', planEmoji: '💻', date: '2024-10-25', time: '11:50', status: 'completed', method: 'Card', reference: 'TRX-2024102510' },
]

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions] = useState(mockTransactions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'contribution' | 'withdrawal'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const formatDateFull = (dateString: string, timeString: string) => {
    return `${formatDate(dateString)} • ${timeString}`
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Group by month
  const groupedTransactions = filteredTransactions.reduce((groups: any, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(transaction)
    return groups
  }, {})

  // Calculate stats
  const totalContributions = transactions
    .filter(t => t.type === 'contribution' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = Math.abs(transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0))

  const netSavings = totalContributions - totalWithdrawals

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Transactions"
        subtitle={`${transactions.length} total`}
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up">
          <StatCard
            icon="💰"
            label="Contributions"
            value={formatCurrency(totalContributions)}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon="💸"
            label="Withdrawals"
            value={formatCurrency(totalWithdrawals)}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon="📊"
            label="Net Savings"
            value={formatCurrency(netSavings)}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none transition text-base"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-700 active:scale-95 transition"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <span>Filters</span>
              {(filterType !== 'all' || filterStatus !== 'all') && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">Active</span>
              )}
            </span>
            <span className={`text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-scale-in">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transaction Type</label>
                <div className="flex gap-2">
                  <FilterButton
                    active={filterType === 'all'}
                    onClick={() => setFilterType('all')}
                    label="All"
                  />
                  <FilterButton
                    active={filterType === 'contribution'}
                    onClick={() => setFilterType('contribution')}
                    label="Contributions"
                    icon="💰"
                  />
                  <FilterButton
                    active={filterType === 'withdrawal'}
                    onClick={() => setFilterType('withdrawal')}
                    label="Withdrawals"
                    icon="💸"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                <div className="flex gap-2">
                  <FilterButton
                    active={filterStatus === 'all'}
                    onClick={() => setFilterStatus('all')}
                    label="All"
                  />
                  <FilterButton
                    active={filterStatus === 'completed'}
                    onClick={() => setFilterStatus('completed')}
                    label="Completed"
                    icon="✓"
                  />
                  <FilterButton
                    active={filterStatus === 'pending'}
                    onClick={() => setFilterStatus('pending')}
                    label="Pending"
                    icon="⏳"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              {(filterType !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setFilterType('all')
                    setFilterStatus('all')
                  }}
                  className="w-full py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredTransactions.length !== transactions.length && (
          <div className="mb-4 text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        )}

        {/* Transactions List (Grouped by Month) */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No transactions found</p>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([month, monthTransactions]: [string, any], monthIndex) => (
              <div key={month} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + monthIndex * 0.1}s` }}>
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{month}</h2>
                  <div className="text-sm text-gray-500">
                    {monthTransactions.length} {monthTransactions.length === 1 ? 'transaction' : 'transactions'}
                  </div>
                </div>

                {/* Month Transactions */}
                <div className="space-y-3">
                  {monthTransactions.map((transaction: any) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      formatCurrency={formatCurrency}
                      formatDateFull={formatDateFull}
                      onClick={() => {
                        // Future: Open receipt modal
                        console.log('View receipt:', transaction.reference)
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

function StatCard({ icon, label, value, color, bgColor }: {
  icon: string
  label: string
  value: string
  color: string
  bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-xl p-3 border border-gray-200`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-base font-bold ${color} mb-0.5 truncate`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}

function FilterButton({ active, onClick, label, icon }: {
  active: boolean
  onClick: () => void
  label: string
  icon?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition active:scale-95 ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  )
}

function TransactionCard({ transaction, formatCurrency, formatDateFull, onClick }: {
  transaction: any
  formatCurrency: (amount: number) => string
  formatDateFull: (date: string, time: string) => string
  onClick: () => void
}) {
  const isContribution = transaction.type === 'contribution'
  const isPending = transaction.status === 'pending'

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition active:scale-98 text-left border border-gray-100"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
          isPending
            ? 'bg-orange-100'
            : isContribution
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        }`}>
          {isPending ? '⏳' : transaction.planEmoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Plan Name */}
          <div className="font-bold text-gray-900 mb-1 truncate">{transaction.plan}</div>

          {/* Date & Time */}
          <div className="text-xs text-gray-500 mb-2">
            {formatDateFull(transaction.date, transaction.time)}
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              transaction.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {transaction.status}
            </span>

            {/* Method */}
            <span className="text-xs text-gray-500">{transaction.method}</span>

            {/* Reference */}
            <span className="text-xs text-gray-400 font-mono">{transaction.reference}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <div className={`text-lg font-bold ${
            isContribution ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isContribution ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isContribution ? 'Added' : 'Withdrawn'}
          </div>
        </div>
      </div>
    </button>
  )
}

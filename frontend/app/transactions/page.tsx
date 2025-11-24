'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'
import { transactionsAPI, withdrawalsAPI, authAPI } from '@/lib/api'
import { generateTransactionHistory } from '@/lib/pdfGenerator'

interface Transaction {
  id: number
  type: string
  amount: number
  reference: string
  status: string
  payment_method: string
  description: string
  completed_at: string
  created_at: string
  savings_plan?: {
    id: number
    name: string
    emoji: string
  }
  // For withdrawal-specific info
  bank_account?: {
    bank_name: string
    account_number: string
  }
  reason?: string
  isWithdrawalRequest?: boolean
}

interface UserInfo {
  name: string
  phone: string
  email?: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'contribution' | 'withdrawal'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions, withdrawal requests, and user data
        const [transactionsData, withdrawalsData, userData] = await Promise.all([
          transactionsAPI.getAll(),
          withdrawalsAPI.getAll(),
          authAPI.getUser()
        ])
        setUser(userData)

        // Handle paginated response (Laravel returns { data: [...] })
        const txns = transactionsData?.data || transactionsData || []
        const withdrawals = withdrawalsData || []

        // Convert pending/approved withdrawals to transaction-like format
        // (completed withdrawals already appear as transactions)
        const pendingWithdrawals = withdrawals
          .filter((w: any) => w.status === 'pending' || w.status === 'approved')
          .map((w: any) => ({
            id: `wd-${w.id}`,
            type: 'withdrawal',
            amount: w.amount,
            reference: w.reference,
            status: w.status,
            payment_method: 'bank_transfer',
            description: w.reason || `Withdrawal from ${w.savings_plan?.name || 'Savings'}`,
            completed_at: w.completed_at,
            created_at: w.created_at,
            savings_plan: w.savings_plan,
            bank_account: w.bank_account,
            reason: w.reason,
            isWithdrawalRequest: true
          }))

        // Merge and sort by date (newest first)
        const allTransactions = [...txns, ...pendingWithdrawals].sort((a, b) => {
          const dateA = new Date(a.completed_at || a.created_at).getTime()
          const dateB = new Date(b.completed_at || b.created_at).getTime()
          return dateB - dateA
        })

        setTransactions(allTransactions)
      } catch (error: any) {
        console.error('Error fetching transactions:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Math.abs(numAmount))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const planName = transaction.savings_plan?.name || transaction.description || ''
    const matchesSearch = planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Group by month
  const groupedTransactions = filteredTransactions.reduce((groups: any, transaction) => {
    const dateStr = transaction.completed_at || transaction.created_at
    if (!dateStr) return groups
    const month = new Date(dateStr).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(transaction)
    return groups
  }, {})

  // Calculate stats
  const totalContributions = transactions
    .filter(t => t.type === 'contribution' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const completedWithdrawals = Math.abs(transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0))

  const pendingWithdrawals = Math.abs(transactions
    .filter(t => t.type === 'withdrawal' && (t.status === 'pending' || t.status === 'approved'))
    .reduce((sum, t) => sum + Number(t.amount), 0))

  const totalWithdrawals = completedWithdrawals + pendingWithdrawals
  const netSavings = totalContributions - completedWithdrawals

  const handleExportPDF = () => {
    if (!user) return
    setExportingPdf(true)
    try {
      generateTransactionHistory(
        transactions.map(t => ({
          id: typeof t.id === 'number' ? t.id : parseInt(String(t.id).replace('wd-', '')),
          type: t.type,
          amount: Number(t.amount),
          status: t.status,
          reference: t.reference,
          description: t.description,
          created_at: t.created_at
        })),
        user
      )
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

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
          <div className="bg-orange-50 rounded-xl p-3 border border-gray-200">
            <div className="text-2xl mb-1">💸</div>
            <div className="text-base font-bold text-orange-600 mb-0.5 truncate">
              {formatCurrency(totalWithdrawals)}
            </div>
            <div className="text-xs text-gray-600">Withdrawals</div>
            {pendingWithdrawals > 0 && (
              <div className="text-xs text-orange-500 mt-1">
                ({formatCurrency(pendingWithdrawals)} pending)
              </div>
            )}
          </div>
          <StatCard
            icon="📊"
            label="Net Savings"
            value={formatCurrency(netSavings)}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportPDF}
          disabled={exportingPdf || transactions.length === 0}
          className="w-full mb-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 animate-fade-in-up"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="text-lg">📄</span>
          <span>{exportingPdf ? 'Generating PDF...' : 'Export Transaction History (PDF)'}</span>
        </button>

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
                  <FilterButton active={filterType === 'all'} onClick={() => setFilterType('all')} label="All" />
                  <FilterButton active={filterType === 'contribution'} onClick={() => setFilterType('contribution')} label="Contributions" icon="💰" />
                  <FilterButton active={filterType === 'withdrawal'} onClick={() => setFilterType('withdrawal')} label="Withdrawals" icon="💸" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                <div className="flex gap-2">
                  <FilterButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} label="All" />
                  <FilterButton active={filterStatus === 'completed'} onClick={() => setFilterStatus('completed')} label="Completed" icon="✓" />
                  <FilterButton active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')} label="Pending" icon="⏳" />
                </div>
              </div>

              {/* Reset Filters */}
              {(filterType !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => { setFilterType('all'); setFilterStatus('all') }}
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

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-6xl mb-4 opacity-50">{transactions.length === 0 ? '📭' : '🔍'}</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions found'}
            </p>
            <p className="text-gray-600">
              {transactions.length === 0 ? 'Start saving to see your transactions' : 'Try adjusting your filters or search query'}
            </p>
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
                  {monthTransactions.map((transaction: Transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      formatTime={formatTime}
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

function TransactionCard({ transaction, formatCurrency, formatDate, formatTime }: {
  transaction: Transaction
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  formatTime: (date: string) => string
}) {
  const isContribution = transaction.type === 'contribution'
  const isPending = transaction.status === 'pending'
  const isApproved = transaction.status === 'approved'
  const planEmoji = transaction.savings_plan?.emoji || '💰'
  const planName = transaction.savings_plan?.name || transaction.description || 'Savings Plan'
  const dateStr = transaction.completed_at || transaction.created_at

  const getStatusStyle = () => {
    switch (transaction.status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'approved':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-orange-100 text-orange-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
          isPending
            ? 'bg-orange-100'
            : isApproved
            ? 'bg-blue-100'
            : isContribution
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        }`}>
          {isPending ? '⏳' : isApproved ? '✓' : planEmoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 mb-1 truncate">{planName}</div>
          <div className="text-xs text-gray-500 mb-2">
            {formatDate(dateStr)} {formatTime(dateStr) && `• ${formatTime(dateStr)}`}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}>
              {transaction.status}
            </span>
            {transaction.isWithdrawalRequest && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Request
              </span>
            )}
            <span className="text-xs text-gray-500 capitalize">{transaction.payment_method?.replace('_', ' ')}</span>
          </div>

          {/* Bank account info for withdrawals */}
          {transaction.bank_account && (
            <div className="text-xs text-gray-500 mt-2">
              To: {transaction.bank_account.bank_name} •••{transaction.bank_account.account_number.slice(-4)}
            </div>
          )}

          {/* Reason for withdrawals */}
          {transaction.reason && (
            <div className="text-xs text-gray-500 mt-1 italic">"{transaction.reason}"</div>
          )}
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <div className={`text-lg font-bold ${isContribution ? 'text-green-600' : 'text-orange-600'}`}>
            {isContribution ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isContribution ? 'Added' : transaction.isWithdrawalRequest ? 'Requested' : 'Withdrawn'}
          </div>
        </div>
      </div>
    </div>
  )
}

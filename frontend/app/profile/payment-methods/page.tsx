'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { profileAPI } from '@/lib/api'
import AppHeader from '@/components/AppHeader'
import LoadingScreen from '@/components/LoadingScreen'

interface BankAccount {
  id: number
  bank: string
  account_number: string
  account_name: string
  is_default?: boolean
}

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bank: '',
    account_number: '',
    account_name: '',
  })

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const data = await profileAPI.getBankAccounts()
        setAccounts(data)
      } catch (error) {
        console.error('Failed to fetch bank accounts:', error)
        setError('Failed to load payment methods. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBankAccounts()
  }, [])

  const handleRemove = async (id: number) => {
    if (!confirm('Are you sure you want to remove this bank account?')) return

    try {
      await profileAPI.deleteBankAccount(id)
      setAccounts(accounts.filter(a => a.id !== id))
    } catch (error: any) {
      console.error('Failed to delete bank account:', error)
      setError(error.response?.data?.message || 'Failed to remove bank account. Please try again.')
    }
  }

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const newAccount = await profileAPI.addBankAccount(formData)
      setAccounts([...accounts, newAccount])
      setShowAddForm(false)
      setFormData({ bank: '', account_number: '', account_name: '' })
    } catch (error: any) {
      console.error('Failed to add bank account:', error)
      setError(error.response?.data?.message || 'Failed to add bank account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Payment Methods"
        subtitle="Manage your cards and accounts"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 text-sm flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🏦
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{account.bank}</h3>
                    {account.is_default && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{account.account_name}</p>
                  <p className="text-sm text-gray-500">{account.account_number}</p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleRemove(account.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && !showAddForm && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Bank Accounts</h3>
            <p className="text-gray-500 mb-6">Add a bank account to receive withdrawals</p>
          </div>
        )}

        {/* Add Bank Account Form */}
        {showAddForm ? (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Bank Account</h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  placeholder="e.g., GTBank, Access Bank"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  placeholder="0123456789"
                  maxLength={10}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData({ bank: '', account_number: '', account_name: '' })
                    setError(null)
                  }}
                  disabled={submitting}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 active:scale-95 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>Add Account</>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🏦</span>
              <span>Add Bank Account</span>
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="text-sm text-gray-700">
              <div className="font-bold text-gray-900 mb-1">Your payment info is secure</div>
              <p>We use bank-level encryption to protect your payment information. We never store your full card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

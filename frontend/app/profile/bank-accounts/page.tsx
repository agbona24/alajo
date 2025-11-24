'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { profileAPI } from '@/lib/api'
import { toast } from '@/lib/utils/toast'

interface BankAccount {
  id: number
  bank_name: string
  account_number: string
  account_name: string
  is_primary: boolean
}

const BANKS = [
  'Access Bank',
  'Citibank',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Opay',
  'Palmpay',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
]

export default function BankAccountsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    bank: '',
    account_number: '',
    account_name: '',
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }
      const data = await profileAPI.getBankAccounts()
      setAccounts(data.accounts || data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.bank || !formData.account_number || !formData.account_name) {
      toast.error('Please fill all fields')
      return
    }

    setSaving(true)
    try {
      await profileAPI.addBankAccount(formData)
      toast.success('Bank account added successfully!')
      setShowAddForm(false)
      setFormData({ bank: '', account_number: '', account_name: '' })
      fetchAccounts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add bank account')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm('Are you sure you want to remove this bank account?')) return

    try {
      await profileAPI.deleteBankAccount(accountId)
      toast.success('Bank account removed')
      fetchAccounts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove bank account')
    }
  }

  const handleSetPrimary = async (accountId: number) => {
    try {
      await profileAPI.setBankAccountPrimary(accountId)
      toast.success('Primary bank account updated')
      fetchAccounts()
    } catch (error: any) {
      toast.error('Failed to update primary account')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Payment Methods" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Bank Accounts List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Bank Accounts</h3>
            <span className="text-sm text-gray-500">{accounts.length} account(s)</span>
          </div>

          {accounts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm animate-fade-in-up">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No Bank Accounts</h3>
              <p className="text-gray-500 mb-4">Add a bank account to receive withdrawals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account, index) => (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl p-4 shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {account.bank_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{account.bank_name}</h4>
                        {account.is_primary && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{account.account_name}</p>
                      <p className="text-sm text-gray-500 font-mono">{account.account_number}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!account.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(account.id)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-xs text-red-500 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Account Form */}
        {showAddForm ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Bank Account</h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              {/* Bank Select */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bank</label>
                <select
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
                  required
                >
                  <option value="">Select your bank</option>
                  {BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="0123456789"
                  maxLength={10}
                  required
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData({ bank: '', account_number: '', account_name: '' })
                  }}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-full font-bold transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2 animate-fade-in-up"
          >
            <span className="text-xl">+</span>
            <span>Add Bank Account</span>
          </button>
        )}
      </div>
    </div>
  )
}

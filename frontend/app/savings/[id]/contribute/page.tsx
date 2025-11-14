'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ContributePage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id

  // Mock plan data
  const [plan] = useState({
    id: planId,
    name: 'Emergency Fund',
    current_amount: 125000,
    target_amount: 500000,
  })

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const quickAmounts = [5000, 10000, 20000, 50000, 100000]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/savings/${planId}`)
      }, 2000)
    }, 1500)
  }

  const progress = Math.min(Math.round((plan.current_amount / plan.target_amount) * 100), 100)
  const newProgress = amount
    ? Math.min(Math.round(((plan.current_amount + Number(amount)) / plan.target_amount) * 100), 100)
    : progress

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push(`/savings/${planId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
          >
            <span>←</span>
            <span>Back to Plan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success ? (
          // Success Message
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-fade-in-up">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contribution Successful!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've contributed {formatCurrency(Number(amount))} to {plan.name}
            </p>
            <div className="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold">
              ✓ Payment Confirmed
            </div>
            <p className="text-sm text-gray-500 mt-6">Redirecting to plan details...</p>
          </div>
        ) : (
          // Contribution Form
          <div className="space-y-6">
            {/* Plan Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(plan.current_amount)} of {formatCurrency(plan.target_amount)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{progress}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Amount Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Make a Contribution</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="100"
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`py-3 px-4 border-2 rounded-lg font-semibold transition ${
                          amount === quickAmount.toString()
                            ? 'border-primary bg-purple-50 text-primary'
                            : 'border-gray-200 text-gray-700 hover:border-primary hover:bg-purple-50'
                        }`}
                      >
                        {formatCurrency(quickAmount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* New Progress Preview */}
                {amount && Number(amount) > 0 && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">After this contribution:</span>
                      <span className="text-lg font-bold text-primary">{newProgress}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${newProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      New balance: {formatCurrency(plan.current_amount + Number(amount))}
                    </p>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <PaymentOption
                      icon="💳"
                      title="Card Payment"
                      description="Pay with debit/credit card"
                      selected={true}
                    />
                    <PaymentOption
                      icon="🏦"
                      title="Bank Transfer"
                      description="Transfer from your bank"
                      selected={false}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !amount || Number(amount) < 100}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Contribute ${amount ? formatCurrency(Number(amount)) : ''}`}
                </button>
              </form>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div className="text-sm text-gray-700">
                <div className="font-semibold mb-1">Secure Payment</div>
                <div className="text-gray-600">
                  Your payment is encrypted and secure. We never store your card details.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function PaymentOption({
  icon,
  title,
  description,
  selected,
}: {
  icon: string
  title: string
  description: string
  selected: boolean
}) {
  return (
    <div
      className={`p-4 border-2 rounded-xl cursor-pointer transition ${
        selected
          ? 'border-primary bg-purple-50'
          : 'border-gray-200 hover:border-primary hover:bg-purple-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
    </div>
  )
}

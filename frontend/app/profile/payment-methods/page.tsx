'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

const mockPaymentMethods = [
  {
    id: 1,
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
  },
  {
    id: 2,
    type: 'bank',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    accountName: 'Chioma Adeyemi',
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [methods, setMethods] = useState(mockPaymentMethods)
  const [showAddCard, setShowAddCard] = useState(false)

  const handleSetDefault = (id: number) => {
    setMethods(methods.map(m => ({
      ...m,
      isDefault: m.id === id
    })))
  }

  const handleRemove = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setMethods(methods.filter(m => m.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Payment Methods"
        subtitle="Manage your cards and accounts"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Payment Methods List */}
        <div className="space-y-4">
          {methods.map((method, index) => (
            <div
              key={method.id}
              className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {method.type === 'card' ? '💳' : '🏦'}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {method.type === 'card' ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{method.brand} •••• {method.last4}</h3>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{method.bankName}</h3>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.accountName}</p>
                      <p className="text-sm text-gray-500">{method.accountNumber}</p>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-3">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-sm font-semibold text-primary hover:text-secondary transition"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(method.id)}
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
        {methods.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Payment Methods</h3>
            <p className="text-gray-500 mb-6">Add a card or bank account to get started</p>
          </div>
        )}

        {/* Add Payment Method Buttons */}
        <div className="mt-6 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>💳</span>
            <span>Add Card</span>
          </button>

          <button
            onClick={() => alert('Add bank account coming soon!')}
            className="w-full py-4 bg-white border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🏦</span>
            <span>Add Bank Account</span>
          </button>
        </div>

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

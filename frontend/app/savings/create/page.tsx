'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

const planEmojis = ['🎯', '💰', '🏠', '🚗', '📱', '💍', '🎓', '✈️', '🏥', '👶', '🎉', '💼', '🏍️', '⚽', '🎸', '📚']

const frequencies = [
  { value: 'daily', label: 'Daily', description: 'Save small small every day', icon: '📅' },
  { value: 'weekly', label: 'Weekly', description: 'Save every week', icon: '📆' },
  { value: 'monthly', label: 'Monthly', description: 'Save every month', icon: '🗓️' },
]

const planTypes = [
  {
    value: 'personal',
    label: 'Personal Goal',
    description: 'Na only you dey save for this goal',
    icon: '👤',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    value: 'group',
    label: 'Group Ajo',
    description: 'Save with your people together',
    icon: '👥',
    gradient: 'from-blue-500 to-blue-600'
  },
]

export default function CreateSavingsPlan() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    targetAmount: '',
    frequency: 'monthly',
    duration: '',
    planType: 'personal',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API call to create savings plan
    console.log('Creating plan:', formData)

    // Show success and redirect
    router.push('/savings')
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Create Savings Plan" />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm font-medium text-primary">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Plan Type & Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Plan Type Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Wetin you wan save for?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {planTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateFormData('planType', type.value)}
                      className={`p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${
                        formData.planType === type.value
                          ? `border-primary bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                          : 'border-gray-200 bg-white hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          formData.planType === type.value
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                        }`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{type.label}</div>
                          <div className={`text-sm ${
                            formData.planType === type.value
                              ? 'text-white/90'
                              : 'text-gray-600'
                          }`}>
                            {type.description}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.planType === type.value
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`}>
                          {formData.planType === type.value && (
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${type.gradient}`} />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="e.g., iPhone 15 Fund, School Fees, Wedding Savings"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Give your savings plan a catchy name</p>
              </div>

              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {planEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => updateFormData('emoji', emoji)}
                      className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all active:scale-95 ${
                        formData.emoji === emoji
                          ? 'bg-gradient-to-br from-primary to-secondary shadow-lg scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Target Amount
              </button>
            </div>
          )}

          {/* Step 2: Target & Frequency */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Target Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₦</span>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => updateFormData('targetAmount', e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-lg font-bold"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">How much you wan save in total?</p>

                {/* Quick Amount Suggestions */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['50000', '100000', '200000', '500000'].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => updateFormData('targetAmount', amount)}
                      className="py-2 px-3 bg-gray-100 hover:bg-primary/10 rounded-lg text-xs font-semibold transition active:scale-95"
                    >
                      ₦{parseInt(amount).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  How often you go contribute?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => updateFormData('frequency', freq.value)}
                      className={`p-4 rounded-xl border-2 transition-all active:scale-95 text-left ${
                        formData.frequency === freq.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 bg-white hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                          formData.frequency === freq.value
                            ? 'bg-gradient-to-br from-primary to-secondary'
                            : 'bg-gray-100'
                        }`}>
                          {freq.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">{freq.label}</div>
                          <div className="text-sm text-gray-600">{freq.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.frequency === freq.value
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {formData.frequency === freq.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', e.target.value)}
                  placeholder="e.g., 6, 12, 24"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base"
                  min="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">How many months to reach your goal?</p>
              </div>

              {/* Calculated Contribution */}
              {formData.targetAmount && formData.duration && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💡</span>
                    <span className="font-bold text-gray-900">Your Contribution</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ₦{Math.ceil(parseInt(formData.targetAmount) / (parseInt(formData.duration) * (formData.frequency === 'daily' ? 30 : formData.frequency === 'weekly' ? 4 : 1))).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    per {formData.frequency === 'daily' ? 'day' : formData.frequency === 'weekly' ? 'week' : 'month'} for {formData.duration} months
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition active:scale-95"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.targetAmount || !formData.duration}
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description & Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Plan Summary Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-6xl mb-2">{formData.emoji}</div>
                    <h3 className="text-2xl font-bold mb-1">{formData.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{planTypes.find(t => t.value === formData.planType)?.icon}</span>
                      <span>{planTypes.find(t => t.value === formData.planType)?.label}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Target Amount</span>
                    <span className="font-bold text-xl">₦{parseInt(formData.targetAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Frequency</span>
                    <span className="font-bold capitalize">{formData.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Duration</span>
                    <span className="font-bold">{formData.duration} months</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="text-white/80">Per {formData.frequency === 'daily' ? 'Day' : formData.frequency === 'weekly' ? 'Week' : 'Month'}</span>
                    <span className="font-bold text-xl">
                      ₦{Math.ceil(parseInt(formData.targetAmount) / (parseInt(formData.duration) * (formData.frequency === 'daily' ? 30 : formData.frequency === 'weekly' ? 4 : 1))).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Add Motivation (Optional) ✨
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Why this goal matter to you? E go help you stay motivated!"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base resize-none"
                  rows={4}
                />
              </div>

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Pro Tip!</div>
                    <div className="text-sm text-gray-600">
                      Small small contributions dey work pass big big amounts wey you no fit maintain.
                      Be consistent, you go reach your goal! 🎯
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Create Plan</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

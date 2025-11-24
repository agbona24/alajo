'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { ajoGroupsAPI } from '@/lib/api'

const rotationTypes = [
  { value: 'weekly', label: 'Weekly', description: 'Collect every week', icon: '📆' },
  { value: 'biweekly', label: 'Bi-Weekly', description: 'Collect every 2 weeks', icon: '🗓️' },
  { value: 'monthly', label: 'Monthly', description: 'Collect every month', icon: '📅' },
]

const selectionMethods = [
  { value: 'random', label: 'Random Selection', description: 'System picks randomly', icon: '🎲' },
  { value: 'sequential', label: 'Sequential Order', description: 'Follow joining order', icon: '📋' },
  { value: 'bidding', label: 'Bidding System', description: 'Members bid for turn', icon: '🎯' },
]

export default function CreateAjoGroupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    groupSize: '',
    rotationType: 'monthly',
    selectionMethod: 'sequential',
    startDate: '',
    autoReminders: true,
    requireApproval: true,
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await ajoGroupsAPI.create({
        name: formData.name,
        description: formData.description || undefined,
        contribution_amount: parseInt(formData.contributionAmount),
        group_size: parseInt(formData.groupSize),
        rotation_type: formData.rotationType,
        selection_method: formData.selectionMethod,
        start_date: formData.startDate,
        auto_reminders: formData.autoReminders,
        require_approval: formData.requireApproval,
      })

      router.push(`/ajo/${response.id}`)
    } catch (error: any) {
      console.error('Error creating group:', error)
      alert(error.response?.data?.message || 'Failed to create group. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceedStep1 = () => {
    return formData.name && formData.contributionAmount && formData.groupSize
  }

  const canProceedStep2 = () => {
    return formData.startDate
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-safe">
      <AppHeader title="Create Ajo Group" showBack />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Step {step} of 3</span>
            <span className="text-sm font-semibold text-blue-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <div className="text-sm text-gray-700">
                  <div className="font-bold text-gray-900 mb-1">What is Ajo?</div>
                  <p>Ajo na group savings where everybody contribute the same amount, and each person collect in turn. E dey help people save together!</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., Family Ajo, Office Squad, Friends Circle"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base"
              />
              <p className="text-xs text-gray-500 mt-1">Give your Ajo group a name</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Tell people wetin this Ajo be about..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Contribution Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₦</span>
                <input
                  type="number"
                  value={formData.contributionAmount}
                  onChange={(e) => updateFormData('contributionAmount', e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-lg font-bold"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">How much each person go contribute?</p>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {['5000', '10000', '20000', '50000'].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => updateFormData('contributionAmount', amount)}
                    className="py-2 px-3 bg-gray-100 hover:bg-blue-50 rounded-lg text-xs font-semibold transition active:scale-95"
                  >
                    ₦{parseInt(amount).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Group Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.groupSize}
                onChange={(e) => updateFormData('groupSize', e.target.value)}
                placeholder="e.g., 5, 10, 20"
                min="3"
                max="50"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base"
              />
              <p className="text-xs text-gray-500 mt-1">How many people fit join? (Min: 3, Max: 50)</p>

              {formData.groupSize && formData.contributionAmount && (
                <div className="mt-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-bold">Total Payout:</span> Each member go collect{' '}
                    <span className="font-bold text-green-700">
                      ₦{(parseInt(formData.contributionAmount) * parseInt(formData.groupSize)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Rotation & Schedule */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Rotation Frequency
              </label>
              <div className="grid grid-cols-1 gap-3">
                {rotationTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData('rotationType', type.value)}
                    className={`p-4 rounded-xl border-2 transition-all active:scale-95 text-left ${
                      formData.rotationType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        formData.rotationType === type.value ? 'bg-blue-500 text-white' : 'bg-gray-100'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        formData.rotationType === type.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.rotationType === type.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Selection Method
              </label>
              <div className="grid grid-cols-1 gap-3">
                {selectionMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => updateFormData('selectionMethod', method.value)}
                    className={`p-4 rounded-xl border-2 transition-all active:scale-95 text-left ${
                      formData.selectionMethod === method.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        formData.selectionMethod === method.value ? 'bg-purple-500 text-white' : 'bg-gray-100'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        formData.selectionMethod === method.value
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.selectionMethod === method.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base"
              />
              <p className="text-xs text-gray-500 mt-1">When should the Ajo start?</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2()}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Settings & Review */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Group Summary</h3>

              <div className="space-y-3">
                <DetailRow label="Group Name" value={formData.name} />
                <DetailRow label="Contribution Amount" value={`₦${parseInt(formData.contributionAmount).toLocaleString()}`} />
                <DetailRow label="Group Size" value={`${formData.groupSize} members`} />
                <DetailRow label="Total Payout" value={`₦${(parseInt(formData.contributionAmount) * parseInt(formData.groupSize)).toLocaleString()}`} highlight />
                <DetailRow label="Rotation" value={rotationTypes.find(r => r.value === formData.rotationType)?.label || ''} />
                <DetailRow label="Selection Method" value={selectionMethods.find(s => s.value === formData.selectionMethod)?.label || ''} />
                <DetailRow label="Start Date" value={new Date(formData.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Group Settings
              </label>
              <div className="space-y-3">
                <ToggleSetting
                  label="Auto Reminders"
                  description="Send WhatsApp/SMS reminders before contribution deadline"
                  checked={formData.autoReminders}
                  onChange={(val) => updateFormData('autoReminders', val)}
                />
                <ToggleSetting
                  label="Require Approval"
                  description="Members must be approved before joining"
                  checked={formData.requireApproval}
                  onChange={(val) => updateFormData('requireApproval', val)}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="text-sm text-gray-700">
                  <div className="font-bold text-gray-900 mb-1">Important</div>
                  <p>As the creator, you will be the Ajo Collector. You will manage contributions, approve members, and coordinate payouts.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Group ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-green-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-green-700 text-lg' : 'text-gray-900'}`}>{value}</span>
    </div>
  )
}

function ToggleSetting({ label, description, checked, onChange }: {
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-xl border-2 border-gray-200">
      <div className="flex-1 pr-4">
        <div className="font-bold text-gray-900 mb-1">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${
          checked ? 'translate-x-6 ml-1' : 'translate-x-1'
        }`} />
      </button>
    </div>
  )
}

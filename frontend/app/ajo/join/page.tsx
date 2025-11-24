'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { ajoGroupsAPI } from '@/lib/api'

interface AjoGroup {
  id: number
  code: string
  name: string
  description: string
  contribution_amount: number
  group_size: number
  current_members: number
  rotation_type: string
  start_date: string
  collector: {
    name: string
    avatar: string
  }
  require_approval: boolean
}

export default function JoinAjoGroupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams?.get('code') || ''

  const [groupCode, setGroupCode] = useState(codeFromUrl)
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [group, setGroup] = useState<AjoGroup | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!groupCode) return
    setLoading(true)
    setError('')

    try {
      const data = await ajoGroupsAPI.searchByCode(groupCode)
      setGroup(data)
    } catch (err: any) {
      console.error('Error searching group:', err)
      if (err.response?.status === 404) {
        setError('Group code not found. Check and try again.')
      } else {
        setError(err.response?.data?.message || 'Failed to search group. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRequest = async () => {
    if (!group) return
    setJoining(true)
    try {
      await ajoGroupsAPI.join(group.id)
      router.push(`/ajo/${group.id}?joined=true`)
    } catch (err: any) {
      console.error('Error joining group:', err)
      alert(err.response?.data?.message || 'Failed to join group. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Join Ajo Group" showBack />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {!group ? (
          <div className="space-y-6 animate-fade-in-up">
            {/* Info Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">👥</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Join an Existing Ajo Group</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Enter the group code wey your friend or colleague give you to join their Ajo savings group.
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Group code dey look like: AJO-ABC123</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>You fit get am via WhatsApp, SMS, or email</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Enter Group Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                  placeholder="AJO-ABC123"
                  maxLength={11}
                  className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-lg font-mono text-center uppercase"
                />
                <button
                  onClick={handleSearch}
                  disabled={!groupCode || loading}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '...' : 'Search'}
                </button>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Alternative Options */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">You never get group code?</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/ajo/browse')}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                      🔍
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Browse Public Groups</div>
                      <div className="text-sm text-gray-600">Find open groups to join</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/ajo/create')}
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-left hover:shadow-lg transition active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      ➕
                    </div>
                    <div>
                      <div className="font-bold">Create Your Own Group</div>
                      <div className="text-sm text-white/90">Start a new Ajo with your people</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {/* Group Found Banner */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <div className="text-sm text-white/80">Group Found!</div>
                  <div className="text-2xl font-bold">{group.name}</div>
                </div>
              </div>
            </div>

            {/* Group Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
              <div className="p-6 space-y-4">
                {group.description && (
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase mb-1">Description</div>
                    <div className="text-gray-700">{group.description}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <InfoCard
                    icon="💰"
                    label="Contribution"
                    value={formatCurrency(group.contribution_amount)}
                  />
                  <InfoCard
                    icon="👥"
                    label="Members"
                    value={`${group.current_members}/${group.group_size}`}
                  />
                  <InfoCard
                    icon="🔄"
                    label="Rotation"
                    value={group.rotation_type}
                  />
                  <InfoCard
                    icon="📅"
                    label="Start Date"
                    value={new Date(group.start_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm font-bold text-gray-500 uppercase mb-2">Collector</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                      {group.collector.avatar}
                    </div>
                    <div className="font-semibold text-gray-900">{group.collector.name}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="font-bold text-gray-900 mb-2">Total Payout Per Member</div>
                    <div className="text-3xl font-bold text-purple-700">
                      {formatCurrency(group.contribution_amount * group.group_size)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      You go collect this amount when na your turn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Notice */}
            {group.require_approval && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏳</span>
                  <div className="text-sm text-gray-700">
                    <div className="font-bold text-gray-900 mb-1">Approval Required</div>
                    <p>The group collector go review your request before you fit join. You go receive notification when approved.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleJoinRequest}
                disabled={joining}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? 'Joining...' : (group.require_approval ? 'Request to Join' : 'Join Group')} {!joining && '✓'}
              </button>
              <button
                onClick={() => setGroup(null)}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                Search Another Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="font-bold text-gray-900">{value}</div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { ajoGroupsAPI } from '@/lib/api'

interface Member {
  id: number
  name: string
  avatar: string
  position: number
  has_paid: boolean
  collected_at: string | null
  role: string
}

interface PayoutSchedule {
  position: number
  name: string
  date: string
  status: string
  amount: number
}

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
  status: string
  total_pool: number
  next_payout_date: string
  members: Member[]
  payout_schedule: PayoutSchedule[]
}

export default function AjoGroupDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [group, setGroup] = useState<AjoGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'members' | 'schedule'>('members')

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }
        const data = await ajoGroupsAPI.getById(Number(params.id))
        setGroup(data)
      } catch (error: any) {
        console.error('Error fetching group:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGroup()
    }
  }, [params.id, router])

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-gray-600 mb-4">Group not found</p>
          <button
            onClick={() => router.push('/ajo')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Back to Groups
          </button>
        </div>
      </div>
    )
  }

  const members = group.members || []
  const payoutSchedule = group.payout_schedule || []
  const paidMembers = members.filter(m => m.has_paid).length
  const paymentProgress = group.current_members > 0 ? (paidMembers / group.current_members) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title={group.name}
        subtitle={group.code}
        showBack
        action={{
          icon: '⚙️',
          onClick: () => alert('Group settings coming soon!')
        }}
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl mb-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-white/80 mb-1">Total Pool</div>
              <div className="text-4xl font-bold mb-2">{formatCurrency(group.total_pool || 0)}</div>
              <div className="text-sm text-white/90">Per member: {formatCurrency(group.contribution_amount || 0)}</div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {group.status}
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
              <span>This Month Payment</span>
              <span>{paidMembers}/{group.current_members || 0} paid</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard icon="👥" label="Members" value={`${group.current_members || 0}/${group.group_size || 0}`} />
          <StatCard icon="🔄" label="Rotation" value={group.rotation_type || '-'} />
          <StatCard icon="📅" label="Next Payout" value={formatDate(group.next_payout_date)} />
        </div>

        {/* Description */}
        {group.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-sm font-bold text-gray-500 uppercase mb-2">About Group</div>
            <div className="text-gray-700">{group.description}</div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <TabButton
            active={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
            icon="👥"
            label="Members"
          />
          <TabButton
            active={activeTab === 'schedule'}
            onClick={() => setActiveTab('schedule')}
            icon="📅"
            label="Schedule"
          />
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-3 animate-fade-in-up">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {member.avatar || '👤'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900">{member.name}</div>
                        {member.role === 'collector' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                            Collector
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Position #{member.position}</div>
                      {member.collected_at && (
                        <div className="text-xs text-green-600 mt-1">
                          Collected on {formatDate(member.collected_at)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {member.has_paid ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-xl">✓</span>
                        <span className="text-sm font-semibold">Paid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <span className="text-xl">⏳</span>
                        <span className="text-sm font-semibold">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(group.current_members || 0) < (group.group_size || 0) && (
              <button
                onClick={() => alert('Invite members feature coming soon!')}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition active:scale-95"
              >
                + Invite More Members ({(group.group_size || 0) - (group.current_members || 0)} slots left)
              </button>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-3 animate-fade-in-up">
            {payoutSchedule.map((payout, index) => (
              <div
                key={payout.position}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      payout.status === 'completed' ? 'bg-green-500 text-white' :
                      payout.status === 'upcoming' ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {payout.position}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-1">{payout.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{formatDate(payout.date)}</div>
                      <div className="text-lg font-bold text-green-700">{formatCurrency(payout.amount)}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                      payout.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {payout.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => alert('Make contribution feature coming soon!')}
            className="py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
          >
            💰 Contribute
          </button>
          <button
            onClick={() => alert('Share group feature coming soon!')}
            className="py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition"
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-200">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-600 mb-0.5">{label}</div>
      <div className="font-bold text-gray-900 text-sm">{value}</div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean
  onClick: () => void
  icon: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition active:scale-95 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

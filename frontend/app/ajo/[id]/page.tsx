'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

const mockGroupDetails = {
  id: 1,
  code: 'AJO-ABC123',
  name: 'Office Squad Savings',
  description: 'Monthly savings for office colleagues',
  contributionAmount: 20000,
  groupSize: 10,
  currentMembers: 8,
  rotationType: 'monthly',
  startDate: '2024-11-01',
  status: 'active',
  totalPool: 200000,
  nextPayoutDate: '2024-12-15',
  members: [
    { id: 1, name: 'Chioma Adeyemi', avatar: '👩🏾', position: 1, hasPaid: true, collectedAt: '2024-11-01', role: 'collector' },
    { id: 2, name: 'Ade Bakare', avatar: '👨🏾', position: 2, hasPaid: true, collectedAt: null, role: 'member' },
    { id: 3, name: 'Ngozi Okafor', avatar: '👩🏾', position: 3, hasPaid: true, collectedAt: null, role: 'member' },
    { id: 4, name: 'Emeka Eze', avatar: '👨🏾', position: 4, hasPaid: false, collectedAt: null, role: 'member' },
    { id: 5, name: 'Funmi Adebayo', avatar: '👩🏾', position: 5, hasPaid: true, collectedAt: null, role: 'member' },
    { id: 6, name: 'Chidi Nwosu', avatar: '👨🏾', position: 6, hasPaid: true, collectedAt: null, role: 'member' },
    { id: 7, name: 'Blessing Okeke', avatar: '👩🏾', position: 7, hasPaid: true, collectedAt: null, role: 'member' },
    { id: 8, name: 'Tunde Ibrahim', avatar: '👨🏾', position: 8, hasPaid: false, collectedAt: null, role: 'member' },
  ],
  payoutSchedule: [
    { position: 1, name: 'Chioma Adeyemi', date: '2024-11-01', status: 'completed', amount: 200000 },
    { position: 2, name: 'Ade Bakare', date: '2024-12-01', status: 'upcoming', amount: 200000 },
    { position: 3, name: 'Ngozi Okafor', date: '2025-01-01', status: 'scheduled', amount: 200000 },
    { position: 4, name: 'Emeka Eze', date: '2025-02-01', status: 'scheduled', amount: 200000 },
  ],
}

export default function AjoGroupDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [group] = useState(mockGroupDetails)
  const [activeTab, setActiveTab] = useState<'members' | 'schedule'>('members')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const paidMembers = group.members.filter(m => m.hasPaid).length
  const paymentProgress = (paidMembers / group.currentMembers) * 100

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
              <div className="text-4xl font-bold mb-2">{formatCurrency(group.totalPool)}</div>
              <div className="text-sm text-white/90">Per member: {formatCurrency(group.contributionAmount)}</div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {group.status}
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
              <span>This Month Payment</span>
              <span>{paidMembers}/{group.currentMembers} paid</span>
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
          <StatCard icon="👥" label="Members" value={`${group.currentMembers}/${group.groupSize}`} />
          <StatCard icon="🔄" label="Rotation" value={group.rotationType} />
          <StatCard icon="📅" label="Next Payout" value={formatDate(group.nextPayoutDate)} />
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
            {group.members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {member.avatar}
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
                      {member.collectedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Collected on {formatDate(member.collectedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {member.hasPaid ? (
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

            {group.currentMembers < group.groupSize && (
              <button
                onClick={() => alert('Invite members feature coming soon!')}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition active:scale-95"
              >
                + Invite More Members ({group.groupSize - group.currentMembers} slots left)
              </button>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-3 animate-fade-in-up">
            {group.payoutSchedule.map((payout, index) => (
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

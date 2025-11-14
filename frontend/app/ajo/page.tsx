'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'

const mockGroups = [
  {
    id: 1,
    code: 'AJO-ABC123',
    name: 'Office Squad Savings',
    contributionAmount: 20000,
    groupSize: 10,
    currentMembers: 8,
    rotationType: 'monthly',
    myPosition: 3,
    nextPayout: '2024-12-15',
    totalContributed: 60000,
    status: 'active',
    role: 'member',
  },
  {
    id: 2,
    code: 'AJO-XYZ789',
    name: 'Family Ajo Circle',
    contributionAmount: 50000,
    groupSize: 6,
    currentMembers: 6,
    rotationType: 'weekly',
    myPosition: 1,
    nextPayout: '2024-11-20',
    totalContributed: 200000,
    status: 'active',
    role: 'collector',
  },
  {
    id: 3,
    code: 'AJO-LMN456',
    name: 'Friends Investment',
    contributionAmount: 15000,
    groupSize: 8,
    currentMembers: 5,
    rotationType: 'biweekly',
    myPosition: 2,
    nextPayout: '2025-01-05',
    totalContributed: 30000,
    status: 'pending',
    role: 'member',
  },
]

export default function AjoGroupsPage() {
  const router = useRouter()
  const [groups] = useState(mockGroups)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all')

  const filteredGroups = groups.filter(g =>
    filterStatus === 'all' ? true : g.status === filterStatus
  )

  const activeGroups = groups.filter(g => g.status === 'active').length
  const totalContributed = groups.reduce((sum, g) => sum + g.totalContributed, 0)
  const collectingGroups = groups.filter(g => g.role === 'collector').length

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="My Ajo Groups" subtitle={`${groups.length} groups`} />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up">
          <StatCard
            icon="👥"
            label="Active"
            value={activeGroups.toString()}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon="💰"
            label="Contributed"
            value={formatCurrency(totalContributed)}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon="⭐"
            label="Collecting"
            value={collectingGroups.toString()}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <FilterTab
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
            label="All"
            count={groups.length}
          />
          <FilterTab
            active={filterStatus === 'active'}
            onClick={() => setFilterStatus('active')}
            label="Active"
            count={activeGroups}
          />
          <FilterTab
            active={filterStatus === 'pending'}
            onClick={() => setFilterStatus('pending')}
            label="Pending"
            count={groups.filter(g => g.status === 'pending').length}
          />
        </div>

        {/* Groups List */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-4 opacity-50">👥</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No groups yet</p>
            <p className="text-gray-600 mb-6">Start saving with your people!</p>
            <button
              onClick={() => router.push('/ajo/create')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
            >
              Create First Group
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => router.push(`/ajo/${group.id}`)}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => router.push('/ajo/create')}
            className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-left hover:shadow-lg transition active:scale-98"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-bold">Create Group</div>
            <div className="text-sm text-white/80">Start new Ajo</div>
          </button>
          <button
            onClick={() => router.push('/ajo/join')}
            className="p-4 bg-white border-2 border-gray-200 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition active:scale-98"
          >
            <div className="text-3xl mb-2">🔗</div>
            <div className="font-bold text-gray-900">Join Group</div>
            <div className="text-sm text-gray-600">Use invite code</div>
          </button>
        </div>
      </div>

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

function FilterTab({ active, onClick, label, count }: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition active:scale-95 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
      }`}
    >
      {label} ({count})
    </button>
  )
}

function GroupCard({ group, onClick, formatCurrency, formatDate, index }: {
  group: typeof mockGroups[0]
  onClick: () => void
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  index: number
}) {
  const progress = (group.currentMembers / group.groupSize) * 100
  const isCollector = group.role === 'collector'

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition active:scale-98 text-left border border-gray-100 animate-fade-in-up"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{group.name}</h3>
            {isCollector && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                Collector
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 font-mono">{group.code}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          group.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}>
          {group.status}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-0.5">Contribution</div>
          <div className="font-bold text-blue-700 text-sm">{formatCurrency(group.contributionAmount)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-0.5">Members</div>
          <div className="font-bold text-purple-700 text-sm">{group.currentMembers}/{group.groupSize}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-0.5">My Position</div>
          <div className="font-bold text-green-700 text-sm">#{group.myPosition}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Group Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          Next payout: <span className="font-semibold text-gray-900">{formatDate(group.nextPayout)}</span>
        </div>
        <div className="text-xs font-semibold text-blue-600">
          View Details →
        </div>
      </div>
    </button>
  )
}

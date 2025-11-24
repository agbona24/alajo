@extends('layouts.collector')

@section('title', 'Collector Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold mb-2">Hello, {{ Auth::user()->name }}!</h1>
                <p class="text-purple-200">Here's your collection summary for today.</p>
            </div>
            <div class="hidden md:block text-right">
                <div class="text-4xl font-bold">{{ now()->format('d') }}</div>
                <div class="text-purple-200">{{ now()->format('l, M Y') }}</div>
            </div>
        </div>
    </div>

    <!-- Today's Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Expected Today</p>
                    <p class="text-3xl font-bold text-gray-900 mt-1">{{ $todayStats['expected_payments'] }}</p>
                    <p class="text-sm text-gray-500 mt-1">payments</p>
                </div>
                <div class="p-4 bg-blue-100 rounded-xl">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Received Today</p>
                    <p class="text-3xl font-bold text-green-600 mt-1">{{ $todayStats['received_payments'] }}</p>
                    <p class="text-sm text-gray-500 mt-1">payments</p>
                </div>
                <div class="p-4 bg-green-100 rounded-xl">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Pending Today</p>
                    <p class="text-3xl font-bold text-orange-600 mt-1">{{ $todayStats['pending_payments'] }}</p>
                    <p class="text-sm text-gray-500 mt-1">payments</p>
                </div>
                <div class="p-4 bg-orange-100 rounded-xl">
                    <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Collected Today</p>
                    <p class="text-3xl font-bold text-purple-600 mt-1">₦{{ number_format($todayStats['amount_collected']) }}</p>
                </div>
                <div class="p-4 bg-purple-100 rounded-xl">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- My Members Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">My Registered Members</h3>
            <a href="{{ route('collector.members.index') }}" class="text-sm text-purple-600 hover:text-purple-700">View all</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
            <div class="text-center p-4 bg-blue-50 rounded-xl">
                <p class="text-3xl font-bold text-blue-600">{{ $memberStats['total_members'] }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Members</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-xl">
                <p class="text-3xl font-bold text-green-600">{{ $memberStats['active_members'] }}</p>
                <p class="text-xs text-gray-500 mt-1">Active Members</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
                <p class="text-3xl font-bold text-purple-600">₦{{ number_format($memberStats['total_savings']) }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Savings</p>
            </div>
            <div class="text-center p-4 bg-emerald-50 rounded-xl">
                <p class="text-3xl font-bold text-emerald-600">₦{{ number_format($memberStats['total_contributions']) }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Contributions</p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-xl">
                <p class="text-3xl font-bold text-orange-600">₦{{ number_format($memberStats['total_withdrawals']) }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Withdrawals</p>
            </div>
            <div class="text-center p-4 bg-indigo-50 rounded-xl">
                <p class="text-3xl font-bold text-indigo-600">₦{{ number_format($memberStats['this_month_contributions']) }}</p>
                <p class="text-xs text-gray-500 mt-1">This Month</p>
            </div>
        </div>
    </div>

    <!-- Period Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold opacity-90">This Week</h3>
                <svg class="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <p class="text-4xl font-bold">₦{{ number_format($weekStats['total_collected']) }}</p>
            <p class="text-sm opacity-75 mt-2">{{ $weekStats['total_payments'] }} payments collected</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold opacity-90">This Month</h3>
                <svg class="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
            </div>
            <p class="text-4xl font-bold">₦{{ number_format($monthStats['total_collected']) }}</p>
            <div class="flex items-center justify-between mt-2">
                <p class="text-sm opacity-75">{{ $monthStats['total_payments'] }} payments</p>
                <p class="text-sm font-medium bg-white/20 px-2 py-1 rounded">{{ $monthStats['collection_rate'] }}% rate</p>
            </div>
        </div>
    </div>

    <!-- My Groups -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">My Groups</h3>
            <a href="{{ route('collector.groups.index') }}" class="text-sm text-purple-600 hover:text-purple-700">View all</a>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($managedGroups as $group)
                <div class="p-6 hover:bg-gray-50 transition">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900">{{ $group->name }}</h4>
                            <p class="text-sm text-gray-500">{{ $group->code }} - {{ $group->members->count() }} members</p>
                        </div>
                        <span class="px-3 py-1 text-xs font-semibold rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                            {{ ucfirst($group->status) }}
                        </span>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center p-3 bg-gray-50 rounded-lg">
                            <p class="text-2xl font-bold text-gray-900">₦{{ number_format($group->contribution_amount) }}</p>
                            <p class="text-xs text-gray-500">Daily Amount</p>
                        </div>
                        <div class="text-center p-3 bg-green-50 rounded-lg">
                            <p class="text-2xl font-bold text-green-600">{{ $group->members->where('status', 'active')->count() }}</p>
                            <p class="text-xs text-gray-500">Active Members</p>
                        </div>
                        <div class="text-center p-3 bg-purple-50 rounded-lg">
                            <p class="text-2xl font-bold text-purple-600">₦{{ number_format($group->members->sum('total_contributed')) }}</p>
                            <p class="text-xs text-gray-500">Total Collected</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <a href="{{ route('collector.groups.cashbook', $group) }}" class="flex-1 text-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                            Open Cashbook
                        </a>
                        <a href="{{ route('collector.payments.today', $group) }}" class="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                            Today's Payments
                        </a>
                    </div>
                </div>
            @empty
                <div class="p-12 text-center">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">No Groups Yet</h3>
                    <p class="text-gray-500">You're not managing any groups at the moment.</p>
                </div>
            @endforelse
        </div>
    </div>

    <!-- Recent Member Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Member Contributions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Member Contributions</h3>
            </div>
            <div class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                @forelse($recentMemberContributions as $contribution)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold mr-3">
                                    {{ strtoupper(substr($contribution->user->name ?? 'U', 0, 1)) }}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ $contribution->user->name ?? 'Unknown' }}</p>
                                    <p class="text-xs text-gray-500">{{ $contribution->savingsPlan->name ?? 'Savings' }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-emerald-600">+₦{{ number_format($contribution->amount) }}</p>
                                <p class="text-xs text-gray-500">{{ $contribution->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No recent contributions</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Member Withdrawals -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Member Withdrawals</h3>
            </div>
            <div class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                @forelse($recentMemberWithdrawals as $withdrawal)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold mr-3">
                                    {{ strtoupper(substr($withdrawal->user->name ?? 'U', 0, 1)) }}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ $withdrawal->user->name ?? 'Unknown' }}</p>
                                    <p class="text-xs text-gray-500">{{ $withdrawal->savingsPlan->name ?? 'Savings' }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-orange-600">-₦{{ number_format($withdrawal->amount) }}</p>
                                <p class="text-xs text-gray-500">{{ $withdrawal->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No recent withdrawals</div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Payments -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Ajo Payments</h3>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($recentPayments as $payment)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between mb-1">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold mr-3">
                                    {{ strtoupper(substr($payment->user->name ?? 'U', 0, 1)) }}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ $payment->user->name ?? 'Unknown' }}</p>
                                    <p class="text-xs text-gray-500">{{ $payment->ajoGroup->name ?? 'Unknown Group' }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-green-600">₦{{ number_format($payment->amount) }}</p>
                                <p class="text-xs text-gray-500">{{ $payment->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No recent payments</div>
                @endforelse
            </div>
        </div>

        <!-- Pending Today -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Pending Today</h3>
                <span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">{{ $pendingToday->count() }} pending</span>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($pendingToday as $payment)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold mr-3">
                                    {{ strtoupper(substr($payment->user->name ?? 'U', 0, 1)) }}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ $payment->user->name ?? 'Unknown' }}</p>
                                    <p class="text-xs text-gray-500">{{ $payment->ajoGroup->name ?? 'Unknown Group' }}</p>
                                </div>
                            </div>
                            <span class="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                ₦{{ number_format($payment->amount) }}
                            </span>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p class="text-gray-500">All caught up! No pending payments.</p>
                    </div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection

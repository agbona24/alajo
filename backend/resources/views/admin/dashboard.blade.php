@extends('layouts.admin')

@section('title', 'Admin Dashboard')
@section('page-title', 'Dashboard Overview')

@section('content')
<div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold mb-2">Welcome back, {{ Auth::user()->name }}!</h1>
                <p class="text-purple-200">Here's what's happening with your platform today.</p>
            </div>
            <div class="hidden md:block">
                <div class="text-right">
                    <div class="text-4xl font-bold">{{ now()->format('d') }}</div>
                    <div class="text-purple-200">{{ now()->format('M Y') }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Users -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Total Users</p>
                    <p class="text-3xl font-bold text-gray-900 mt-1">{{ number_format($stats['total_users']) }}</p>
                    <p class="text-sm text-green-600 mt-2">
                        <span class="font-medium">+{{ $stats['today_new_users'] }}</span> today
                    </p>
                </div>
                <div class="p-4 bg-blue-100 rounded-xl">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Collectors -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Active Collectors</p>
                    <p class="text-3xl font-bold text-gray-900 mt-1">{{ number_format($stats['total_collectors']) }}</p>
                    <p class="text-sm text-gray-500 mt-2">{{ $stats['total_admins'] }} admins</p>
                </div>
                <div class="p-4 bg-purple-100 rounded-xl">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Groups -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Active Groups</p>
                    <p class="text-3xl font-bold text-gray-900 mt-1">{{ number_format($stats['active_groups']) }}</p>
                    <p class="text-sm text-gray-500 mt-2">{{ $stats['total_groups'] }} total</p>
                </div>
                <div class="p-4 bg-green-100 rounded-xl">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Today's Collection -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">Today's Collection</p>
                    <p class="text-3xl font-bold text-gray-900 mt-1">{{ currency($stats['today_payments_amount']) }}</p>
                    <p class="text-sm text-gray-500 mt-2">{{ $stats['today_payments'] }} payments</p>
                </div>
                <div class="p-4 bg-yellow-100 rounded-xl">
                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Second Row Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Volume -->
        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold opacity-90">Total Transaction Volume</h3>
                <svg class="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
            </div>
            <p class="text-4xl font-bold">{{ currency($stats['total_volume']) }}</p>
            <p class="text-sm opacity-75 mt-2">{{ number_format($stats['total_transactions']) }} total transactions</p>
        </div>

        <!-- Pending Transactions -->
        <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold opacity-90">Pending Approval</h3>
                <svg class="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <p class="text-4xl font-bold">{{ number_format($stats['pending_transactions']) }}</p>
            <p class="text-sm opacity-75 mt-2">Awaiting confirmation</p>
        </div>

        <!-- Suspended Users -->
        <div class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold opacity-90">Suspended Users</h3>
                <svg class="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
            </div>
            <p class="text-4xl font-bold">{{ number_format($stats['suspended_users']) }}</p>
            <p class="text-sm opacity-75 mt-2">Need attention</p>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Users -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Recent Users</h3>
                <a href="{{ route('admin.users.index') }}" class="text-sm text-purple-600 hover:text-purple-700">View all</a>
            </div>
            <div class="divide-y divide-gray-100">
                @forelse($recentUsers as $user)
                    <div class="px-6 py-4 flex items-center hover:bg-gray-50">
                        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mr-4">
                            {{ strtoupper(substr($user->name, 0, 1)) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ $user->name }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ $user->email }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $user->role === 'admin' ? 'bg-purple-100 text-purple-700' : ($user->role === 'collector' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst($user->role ?? 'user') }}
                        </span>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No users yet</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Groups -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Recent Groups</h3>
                <a href="{{ route('admin.groups.index') }}" class="text-sm text-purple-600 hover:text-purple-700">View all</a>
            </div>
            <div class="divide-y divide-gray-100">
                @forelse($recentGroups as $group)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm font-medium text-gray-900">{{ $group->name }}</p>
                            <span class="px-2 py-1 text-xs font-medium rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : ($group->status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700') }}">
                                {{ ucfirst($group->status) }}
                            </span>
                        </div>
                        <div class="flex items-center text-xs text-gray-500">
                            <span>{{ $group->group_size }} members</span>
                            <span class="mx-2">•</span>
                            <span>{{ currency($group->contribution_amount) }}/day</span>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No groups yet</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Recent Transactions</h3>
                <a href="{{ route('admin.transactions.index') }}" class="text-sm text-purple-600 hover:text-purple-700">View all</a>
            </div>
            <div class="divide-y divide-gray-100">
                @forelse($recentTransactions as $transaction)
                    <div class="px-6 py-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-sm font-medium text-gray-900">{{ currency($transaction->amount) }}</p>
                            <span class="px-2 py-1 text-xs font-medium rounded-full {{ $transaction->status === 'completed' ? 'bg-green-100 text-green-700' : ($transaction->status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700') }}">
                                {{ ucfirst($transaction->status) }}
                            </span>
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ $transaction->user->name ?? 'N/A' }} • {{ $transaction->created_at->diffForHumans() }}
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No transactions yet</div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="{{ route('admin.users.create') }}" class="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition group">
                <div class="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                </div>
                <span class="text-sm font-medium">Add User</span>
            </a>
            <a href="{{ route('admin.collectors.create') }}" class="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition group">
                <div class="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <span class="text-sm font-medium">Add Collector</span>
            </a>
            <a href="{{ route('admin.transactions.daily-payments') }}" class="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition group">
                <div class="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                </div>
                <span class="text-sm font-medium">Daily Payments</span>
            </a>
            <a href="{{ route('admin.reports.index') }}" class="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:text-orange-700 transition group">
                <div class="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition mb-3">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
                <span class="text-sm font-medium">View Reports</span>
            </a>
        </div>
    </div>
</div>
@endsection

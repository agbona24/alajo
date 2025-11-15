@extends('layouts.app')

@section('title', 'Admin Dashboard')
@section('nav-title', 'Admin')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-1">Overview of the Hajo Savings Platform</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-2">
                <div class="text-4xl">👥</div>
                <div class="text-3xl font-bold">{{ $stats['total_users'] }}</div>
            </div>
            <div class="text-sm text-blue-100">Total Users</div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-2">
                <div class="text-4xl">👫</div>
                <div class="text-3xl font-bold">{{ $stats['total_groups'] }}</div>
            </div>
            <div class="text-sm text-purple-100">Total Ajo Groups</div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-2">
                <div class="text-4xl">💰</div>
                <div class="text-3xl font-bold">₦{{ number_format($stats['total_savings_amount'], 0) }}</div>
            </div>
            <div class="text-sm text-green-100">Total Savings</div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-2">
                <div class="text-4xl">📊</div>
                <div class="text-3xl font-bold">{{ $stats['total_transactions'] }}</div>
            </div>
            <div class="text-sm text-orange-100">Total Transactions</div>
        </div>
    </div>

    <!-- Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a href="{{ route('admin.users') }}" class="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition text-center">
            <div class="text-4xl mb-2">👤</div>
            <div class="font-bold text-gray-900">Manage Users</div>
            <div class="text-sm text-gray-600 mt-1">View all users</div>
        </a>

        <a href="{{ route('admin.groups') }}" class="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition text-center">
            <div class="text-4xl mb-2">👥</div>
            <div class="font-bold text-gray-900">Ajo Groups</div>
            <div class="text-sm text-gray-600 mt-1">Manage groups</div>
        </a>

        <a href="{{ route('admin.collectors') }}" class="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition text-center">
            <div class="text-4xl mb-2">📋</div>
            <div class="font-bold text-gray-900">Collectors</div>
            <div class="text-sm text-gray-600 mt-1">View collectors</div>
        </a>

        <a href="{{ route('admin.transactions') }}" class="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition text-center">
            <div class="text-4xl mb-2">💳</div>
            <div class="font-bold text-gray-900">Transactions</div>
            <div class="text-sm text-gray-600 mt-1">View all transactions</div>
        </a>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Users -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-900">Recent Users</h2>
            </div>
            <div class="divide-y divide-gray-200">
                @forelse($recentUsers as $user)
                    <div class="p-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-semibold text-gray-900">{{ $user->name }}</div>
                                <div class="text-sm text-gray-600">{{ $user->email }}</div>
                            </div>
                            <div class="text-sm text-gray-500">
                                {{ $user->created_at->diffForHumans() }}
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="p-8 text-center text-gray-500">No users yet</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Groups -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-900">Recent Ajo Groups</h2>
            </div>
            <div class="divide-y divide-gray-200">
                @forelse($recentGroups as $group)
                    <div class="p-4 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-semibold text-gray-900">{{ $group->name }}</div>
                                <div class="text-sm text-gray-600">{{ $group->group_code }}</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    Created by {{ $group->creator->name }}
                                </div>
                            </div>
                            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                {{ $group->status }}
                            </span>
                        </div>
                    </div>
                @empty
                    <div class="p-8 text-center text-gray-500">No groups yet</div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Top Collectors -->
    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">Top Collectors</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups Managed</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($topCollectors as $collector)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="font-semibold text-gray-900">{{ $collector->name }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ $collector->email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                                    {{ $collector->groups_count }} groups
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ $collector->created_at->format('M d, Y') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                No collectors yet
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

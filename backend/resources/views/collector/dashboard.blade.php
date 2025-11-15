@extends('layouts.app')

@section('title', 'Collector Dashboard')
@section('nav-title', 'Collector')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
        <p class="text-gray-600 mt-1">Hello, {{ $collector->name }}</p>
    </div>

    <!-- Today's Summary Card -->
    <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
                <div class="text-sm text-white/80 mb-1">Today's Collections</div>
                <div class="text-3xl font-bold">₦{{ number_format($todayStats['total_collected'], 0) }}</div>
                <div class="text-sm text-white/90 mt-1">
                    of ₦{{ number_format($todayStats['total_expected'], 0) }} expected
                </div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Active Groups</div>
                <div class="text-3xl font-bold">{{ $groups->count() }}</div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Total Members</div>
                <div class="text-3xl font-bold">{{ $todayStats['total_members'] }}</div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Paid Today</div>
                <div class="text-3xl font-bold">{{ $todayStats['paid_members'] }}</div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button onclick="alert('Record payment feature coming soon!')" class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition text-center">
            <div class="text-4xl mb-2">💰</div>
            <div class="text-lg">Record Payment</div>
        </button>
        <button onclick="alert('Send reminders feature coming soon!')" class="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition text-center">
            <div class="text-4xl mb-2">📢</div>
            <div class="text-lg">Send Reminders</div>
        </button>
    </div>

    <!-- Groups List -->
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">My Groups</h2>
        <div class="space-y-4">
            @forelse($groups as $group)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-6">
                        <!-- Header -->
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h3 class="text-xl font-bold text-gray-900">{{ $group->name }}</h3>
                                    <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                        {{ $group->status }}
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600">{{ $group->group_code }}</div>
                            </div>
                            <a href="{{ route('collector.cashbook', $group->id) }}" class="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                                📖 Open Cashbook
                            </a>
                        </div>

                        <!-- Stats Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div class="text-center p-3 bg-gray-50 rounded-lg">
                                <div class="text-2xl font-bold text-gray-900">{{ $group->members->count() }}</div>
                                <div class="text-sm text-gray-600">Members</div>
                            </div>
                            <div class="text-center p-3 bg-gray-50 rounded-lg">
                                <div class="text-2xl font-bold text-gray-900">₦{{ number_format($group->contribution_amount, 0) }}</div>
                                <div class="text-sm text-gray-600">Daily Amount</div>
                            </div>
                            <div class="text-center p-3 bg-green-50 rounded-lg">
                                <div class="text-2xl font-bold text-green-600">₦0</div>
                                <div class="text-sm text-gray-600">Collected</div>
                            </div>
                            <div class="text-center p-3 bg-orange-50 rounded-lg">
                                <div class="text-2xl font-bold text-orange-600">₦0</div>
                                <div class="text-sm text-gray-600">Pending</div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600">Created: {{ $group->created_at->format('M d, Y') }}</span>
                            <a href="{{ route('ajo.show', $group->id) }}" class="text-blue-600 font-semibold hover:text-blue-700">
                                View Details →
                            </a>
                        </div>
                    </div>
                </div>
            @empty
                <div class="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div class="text-6xl mb-4">📋</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No Groups Yet</h3>
                    <p class="text-gray-600">You're not a collector for any groups yet.</p>
                </div>
            @endforelse
        </div>
    </div>
</div>
@endsection

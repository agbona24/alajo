@extends('layouts.collector')

@section('title', $group->name)
@section('page-title', $group->name)

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('collector.groups.index') }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ $group->name }}</h2>
                <p class="text-gray-500">{{ $group->description ?? 'No description' }}</p>
            </div>
        </div>
        <span class="px-3 py-1 text-sm font-medium rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
            {{ ucfirst($group->status ?? 'pending') }}
        </span>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Members</p>
            <p class="text-2xl font-bold text-gray-900">{{ $stats['total_members'] ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Today's Payments</p>
            <p class="text-2xl font-bold text-green-600">{{ $stats['today_payments'] ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Pending Today</p>
            <p class="text-2xl font-bold text-orange-600">{{ $stats['pending_today'] ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Total Collected</p>
            <p class="text-2xl font-bold text-purple-600">{{ number_format($stats['total_collected'] ?? 0) }}</p>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="{{ route('collector.payments.index', $group) }}" class="bg-purple-600 text-white rounded-xl p-4 flex items-center justify-center space-x-2 hover:bg-purple-700 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">Record Payment</span>
        </a>
        <a href="{{ route('collector.groups.members', $group) }}" class="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center justify-center space-x-2 hover:bg-gray-50 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span class="font-medium">Members</span>
        </a>
        <a href="{{ route('collector.groups.cashbook', $group) }}" class="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center justify-center space-x-2 hover:bg-gray-50 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="font-medium">Cashbook</span>
        </a>
        <a href="{{ route('collector.payments.today', $group) }}" class="bg-white border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center justify-center space-x-2 hover:bg-gray-50 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="font-medium">Today's Summary</span>
        </a>
    </div>

    <!-- Group Details -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Group Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Group Details</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Contribution</dt>
                    <dd class="font-medium text-gray-900">{{ number_format($group->contribution_amount) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Frequency</dt>
                    <dd class="font-medium text-gray-900">{{ ucfirst($group->frequency ?? 'daily') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Current Cycle</dt>
                    <dd class="font-medium text-gray-900">{{ $group->current_cycle ?? 1 }} / {{ $group->duration ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Start Date</dt>
                    <dd class="font-medium text-gray-900">{{ $group->start_date ? $group->start_date->format('M d, Y') : 'Not set' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Max Members</dt>
                    <dd class="font-medium text-gray-900">{{ $group->max_members ?? 'Unlimited' }}</dd>
                </div>
            </dl>
        </div>

        <!-- Today's Payments -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Today's Payments</h3>
                <a href="{{ route('collector.payments.today', $group) }}" class="text-sm text-purple-600 hover:text-purple-700">View All</a>
            </div>
            <div class="p-4">
                @if($todayPayments && $todayPayments->count() > 0)
                    <div class="space-y-3">
                        @foreach($todayPayments->take(5) as $payment)
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                                        {{ strtoupper(substr($payment->user->name ?? 'U', 0, 1)) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ $payment->user->name ?? 'Unknown' }}</p>
                                        <p class="text-sm text-gray-500">{{ $payment->created_at->format('h:i A') }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold text-green-600">+{{ number_format($payment->amount) }}</p>
                                    <span class="text-xs px-2 py-1 rounded-full {{ $payment->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                                        {{ ucfirst($payment->status) }}
                                    </span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-8">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-gray-500">No payments recorded today</p>
                        <a href="{{ route('collector.payments.index', $group) }}" class="mt-2 inline-block text-purple-600 hover:text-purple-700 font-medium">Record Payment</a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection

@extends('layouts.collector')

@section('title', 'Today\'s Summary - ' . $group->name)
@section('page-title', 'Today\'s Collection Summary')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('collector.groups.show', $group) }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ $group->name }}</h2>
                <p class="text-gray-500">Collection summary for {{ now()->format('l, F d, Y') }}</p>
            </div>
        </div>
        <a href="{{ route('collector.payments.index', $group) }}" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Record Payments
        </a>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Total Members</span>
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ $totalMembers ?? 0 }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Paid Today</span>
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-green-600">{{ $paidCount ?? 0 }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Pending</span>
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-orange-600">{{ $pendingCount ?? 0 }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Today's Collection</span>
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-blue-600">{{ number_format($todayTotal ?? 0) }}</p>
        </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">Collection Progress</h3>
            <span class="text-sm text-gray-500">{{ $paidCount ?? 0 }} of {{ $totalMembers ?? 0 }} members</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
            @php $percentage = $totalMembers > 0 ? ($paidCount / $totalMembers) * 100 : 0; @endphp
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500" style="width: {{ $percentage }}%"></div>
        </div>
        <p class="text-sm text-gray-500 mt-2">{{ number_format($percentage, 1) }}% complete</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Paid Members -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 flex items-center">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Paid Today
                </h3>
                <span class="text-sm text-gray-500">{{ $paidMembers->count() ?? 0 }} members</span>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($paidMembers ?? [] as $member)
                    <div class="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                {{ strtoupper(substr($member->user->name ?? 'U', 0, 1)) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ $member->user->name ?? 'Unknown' }}</p>
                                <p class="text-sm text-gray-500">{{ $member->payment_time ?? '' }}</p>
                            </div>
                        </div>
                        <span class="font-semibold text-green-600">+{{ number_format($group->contribution_amount) }}</span>
                    </div>
                @empty
                    <div class="p-8 text-center text-gray-500">
                        No payments recorded yet today
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Pending Members -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 flex items-center">
                    <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Pending Payment
                </h3>
                <span class="text-sm text-gray-500">{{ $pendingMembers->count() ?? 0 }} members</span>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($pendingMembers ?? [] as $member)
                    <div class="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                                {{ strtoupper(substr($member->user->name ?? 'U', 0, 1)) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ $member->user->name ?? 'Unknown' }}</p>
                                <p class="text-sm text-gray-500">{{ $member->user->phone ?? '' }}</p>
                            </div>
                        </div>
                        <form method="POST" action="{{ route('collector.payments.mark-paid', $group) }}">
                            @csrf
                            <input type="hidden" name="member_id" value="{{ $member->id }}">
                            <input type="hidden" name="amount" value="{{ $group->contribution_amount }}">
                            <button type="submit" class="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                Mark Paid
                            </button>
                        </form>
                    </div>
                @empty
                    <div class="p-8 text-center text-gray-500">
                        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-green-600 font-medium">All members have paid!</p>
                    </div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection

@extends('layouts.collector')

@section('title', 'Earnings - ' . $group->name)
@section('page-title', 'Group Earnings')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('collector.earnings.index') }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ $group->name }}</h2>
                <p class="text-gray-500">Earnings breakdown for this group</p>
            </div>
        </div>
    </div>

    <!-- Earnings Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p class="text-sm text-gray-500 mb-1">Total Collection</p>
            <p class="text-2xl font-bold text-gray-900">{{ number_format($collection ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p class="text-sm text-gray-500 mb-1">Your Commission</p>
            <p class="text-2xl font-bold text-green-600">{{ number_format($earnings ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p class="text-sm text-gray-500 mb-1">Pending Payouts</p>
            <p class="text-2xl font-bold text-orange-600">{{ number_format($payouts->where('status', 'pending')->sum('amount') ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p class="text-sm text-gray-500 mb-1">Paid Out</p>
            <p class="text-2xl font-bold text-purple-600">{{ number_format($payouts->where('status', 'completed')->sum('amount') ?? 0) }}</p>
        </div>
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
                    <dt class="text-gray-500">Members</dt>
                    <dd class="font-medium text-gray-900">{{ $group->members_count ?? 0 }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Commission Rate</dt>
                    <dd class="font-medium text-gray-900">{{ $group->commission_rate ?? 5 }}%</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Current Cycle</dt>
                    <dd class="font-medium text-gray-900">{{ $group->current_cycle ?? 1 }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Status</dt>
                    <dd>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                            {{ ucfirst($group->status ?? 'pending') }}
                        </span>
                    </dd>
                </div>
            </dl>
        </div>

        <!-- Payout History -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Payout History</h3>
                <span class="text-sm text-gray-500">{{ $payouts->count() }} payouts</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @forelse($payouts as $payout)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm text-gray-900">
                                    {{ $payout->created_at->format('M d, Y') }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-medium">
                                            {{ strtoupper(substr($payout->member->user->name ?? 'U', 0, 1)) }}
                                        </div>
                                        <span class="text-sm text-gray-900">{{ $payout->member->user->name ?? 'Unknown' }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                                    {{ number_format($payout->amount) }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $payout->status === 'completed' ? 'bg-green-100 text-green-700' : ($payout->status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700') }}">
                                        {{ ucfirst($payout->status) }}
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                                    No payouts yet
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

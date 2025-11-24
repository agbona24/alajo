@extends('layouts.collector')

@section('title', 'Member Details - ' . $user->name)
@section('page-title', 'Member Details')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
        <a href="{{ route('collector.members.index') }}" class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        </a>
        <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ $user->name }}</h2>
            <p class="text-gray-500">Member since {{ $user->created_at->format('M d, Y') }}</p>
        </div>
    </div>

    <!-- Member Info Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold">
                {{ strtoupper(substr($user->name, 0, 1)) }}
            </div>
            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="text-sm text-gray-500">Phone Number</label>
                    <p class="font-medium text-gray-900">{{ $user->phone }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Email Address</label>
                    <p class="font-medium text-gray-900">{{ $user->email ?? 'Not provided' }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Status</label>
                    <p>
                        @if($user->status === 'active')
                            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Active</span>
                        @elseif($user->status === 'inactive')
                            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Inactive</span>
                        @else
                            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Suspended</span>
                        @endif
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div class="text-2xl font-bold">{{ number_format($stats['total_savings']) }}</div>
            <div class="text-sm text-purple-100">Total Savings</div>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div class="text-2xl font-bold">{{ number_format($stats['total_contributed']) }}</div>
            <div class="text-sm text-green-100">Total Contributed</div>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div class="text-2xl font-bold">{{ number_format($stats['total_withdrawn']) }}</div>
            <div class="text-sm text-orange-100">Total Withdrawn</div>
        </div>
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div class="text-2xl font-bold">{{ $stats['active_plans'] }}</div>
            <div class="text-sm text-blue-100">Active Plans</div>
        </div>
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div class="text-2xl font-bold">{{ number_format($stats['this_month_contributions']) }}</div>
            <div class="text-sm text-indigo-100">This Month</div>
        </div>
    </div>

    <!-- Savings Plans -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Savings Plans</h3>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($savingsPlans as $plan)
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-medium text-gray-900">{{ $plan->name }}</h4>
                            <p class="text-sm text-gray-500">{{ ucfirst($plan->frequency) }} - Target: {{ number_format($plan->target_amount) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-purple-600">{{ number_format($plan->current_balance) }}</p>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $plan->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                                {{ ucfirst($plan->status) }}
                            </span>
                        </div>
                    </div>
                    @if($plan->target_amount > 0)
                        <div class="mt-3">
                            <div class="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{{ round(($plan->current_balance / $plan->target_amount) * 100, 1) }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: {{ min(100, ($plan->current_balance / $plan->target_amount) * 100) }}%"></div>
                            </div>
                        </div>
                    @endif
                </div>
            @empty
                <div class="px-6 py-12 text-center text-gray-500">
                    <p>No savings plans found for this member.</p>
                </div>
            @endforelse
        </div>
    </div>

    <!-- Two Column Layout for Contributions & Withdrawals -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Contributions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Contributions</h3>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($contributions as $contribution)
                    <div class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-gray-900">{{ $contribution->savingsPlan->name ?? 'Unknown Plan' }}</p>
                                <p class="text-sm text-gray-500">{{ $contribution->created_at->format('M d, Y H:i') }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-green-600">+{{ number_format($contribution->amount) }}</p>
                                <span class="text-xs text-gray-500">{{ ucfirst($contribution->status) }}</span>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No contributions yet</div>
                @endforelse
            </div>
            @if($contributions->hasPages())
                <div class="px-6 py-4 border-t border-gray-200">
                    {{ $contributions->appends(['withdrawals_page' => request('withdrawals_page')])->links() }}
                </div>
            @endif
        </div>

        <!-- Recent Withdrawals -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Withdrawals</h3>
            </div>
            <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                @forelse($withdrawals as $withdrawal)
                    <div class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-gray-900">{{ $withdrawal->savingsPlan->name ?? 'Unknown Plan' }}</p>
                                <p class="text-sm text-gray-500">{{ $withdrawal->created_at->format('M d, Y H:i') }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-orange-600">-{{ number_format($withdrawal->amount) }}</p>
                                @if($withdrawal->status === 'completed')
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Completed</span>
                                @elseif($withdrawal->status === 'pending')
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                                @elseif($withdrawal->status === 'approved')
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Approved</span>
                                @else
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">{{ ucfirst($withdrawal->status) }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No withdrawals yet</div>
                @endforelse
            </div>
            @if($withdrawals->hasPages())
                <div class="px-6 py-4 border-t border-gray-200">
                    {{ $withdrawals->appends(['contributions_page' => request('contributions_page')])->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

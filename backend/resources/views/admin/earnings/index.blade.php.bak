@extends('layouts.admin')

@section('title', 'Earnings Dashboard')
@section('page-title', 'Earnings Dashboard')

@section('content')
<div x-data="{ showBulkActions: false, selectedIds: [] }">
    <!-- Month/Year Filter -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form method="GET" class="flex flex-wrap items-center gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select name="month" class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                    @for($m = 1; $m <= 12; $m++)
                        <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }}>
                            {{ Carbon\Carbon::create(null, $m)->format('F') }}
                        </option>
                    @endfor
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select name="year" class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                    @for($y = now()->year; $y >= now()->year - 5; $y--)
                        <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }}>{{ $y }}</option>
                    @endfor
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                    <option value="all" {{ $type == 'all' ? 'selected' : '' }}>All Types</option>
                    <option value="company_fee" {{ $type == 'company_fee' ? 'selected' : '' }}>Company Fees</option>
                    <option value="collector_commission" {{ $type == 'collector_commission' ? 'selected' : '' }}>Collector Commissions</option>
                    <option value="platform_fee" {{ $type == 'platform_fee' ? 'selected' : '' }}>Platform Fees</option>
                </select>
            </div>
            <div class="flex items-end">
                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Filter
                </button>
            </div>
            <div class="flex items-end ml-auto">
                <a href="{{ route('admin.earnings.export', ['month' => $month, 'year' => $year, 'type' => $type]) }}"
                   class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Export CSV
                </a>
            </div>
        </form>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Earnings -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Total Earnings</p>
                    <p class="text-2xl font-bold text-gray-900">N{{ number_format($summary['total_earnings'], 2) }}</p>
                    <p class="text-xs text-gray-400">{{ Carbon\Carbon::create($year, $month)->format('F Y') }}</p>
                </div>
            </div>
        </div>

        <!-- Company Fees -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Company Fees</p>
                    <p class="text-2xl font-bold text-gray-900">N{{ number_format($summary['company_fees'], 2) }}</p>
                    <p class="text-xs text-gray-400">First day contributions</p>
                </div>
            </div>
        </div>

        <!-- Collector Commissions -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Collector Commissions</p>
                    <p class="text-2xl font-bold text-gray-900">N{{ number_format($summary['collector_commissions'], 2) }}</p>
                    <p class="text-xs text-gray-400">Owed to collectors</p>
                </div>
            </div>
        </div>

        <!-- Pending Payouts -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Status Breakdown</p>
                    <p class="text-sm text-gray-700">
                        <span class="text-yellow-600">{{ $summary['pending_count'] }}</span> pending,
                        <span class="text-blue-600">{{ $summary['processed_count'] }}</span> processed,
                        <span class="text-green-600">{{ $summary['paid_out_count'] }}</span> paid
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- All-Time Stats -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h3 class="text-lg font-semibold mb-4">All-Time Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <p class="text-purple-200 text-sm">Total All-Time Earnings</p>
                <p class="text-3xl font-bold">N{{ number_format($allTimeStats['total'], 2) }}</p>
            </div>
            <div>
                <p class="text-purple-200 text-sm">This Year ({{ $year }})</p>
                <p class="text-3xl font-bold">N{{ number_format($allTimeStats['this_year'], 2) }}</p>
            </div>
            <div>
                <p class="text-purple-200 text-sm">Pending Payout</p>
                <p class="text-3xl font-bold">N{{ number_format($allTimeStats['pending_payout'], 2) }}</p>
            </div>
        </div>
    </div>

    <!-- Quick Links -->
    <div class="flex gap-4 mb-6">
        <a href="{{ route('admin.earnings.by-collector') }}" class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
            View by Collector
        </a>
    </div>

    <!-- Earnings Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Earnings Records</h3>
            <div x-show="selectedIds.length > 0" class="flex gap-2">
                <form method="POST" action="{{ route('admin.earnings.mark-processed') }}" class="inline">
                    @csrf
                    <template x-for="id in selectedIds">
                        <input type="hidden" name="earning_ids[]" :value="id">
                    </template>
                    <button type="submit" class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Mark Processed
                    </button>
                </form>
                <form method="POST" action="{{ route('admin.earnings.mark-paid-out') }}" class="inline">
                    @csrf
                    <template x-for="id in selectedIds">
                        <input type="hidden" name="earning_ids[]" :value="id">
                    </template>
                    <button type="submit" class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Mark Paid Out
                    </button>
                </form>
            </div>
        </div>

        @if($earnings->isEmpty())
            <div class="p-12 text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>No earnings recorded for this period.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left">
                                <input type="checkbox"
                                       @change="selectedIds = $event.target.checked ? {{ $earnings->pluck('id')->toJson() }} : []"
                                       class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings Plan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($earnings as $earning)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-4">
                                    <input type="checkbox"
                                           value="{{ $earning->id }}"
                                           :checked="selectedIds.includes({{ $earning->id }})"
                                           @change="$event.target.checked ? selectedIds.push({{ $earning->id }}) : selectedIds = selectedIds.filter(id => id !== {{ $earning->id }})"
                                           class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ $earning->earning_date->format('M d, Y') }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-mono text-gray-600">{{ $earning->reference }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ $earning->user->name ?? 'N/A' }}</div>
                                    <div class="text-xs text-gray-500">{{ $earning->user->phone ?? '' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ $earning->savingsPlan->name ?? 'N/A' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @php
                                        $typeColors = [
                                            'company_fee' => 'bg-blue-100 text-blue-800',
                                            'collector_commission' => 'bg-green-100 text-green-800',
                                            'platform_fee' => 'bg-purple-100 text-purple-800',
                                        ];
                                        $typeLabels = [
                                            'company_fee' => 'Company Fee',
                                            'collector_commission' => 'Collector Commission',
                                            'platform_fee' => 'Platform Fee',
                                        ];
                                    @endphp
                                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $typeColors[$earning->type] ?? 'bg-gray-100 text-gray-800' }}">
                                        {{ $typeLabels[$earning->type] ?? $earning->type }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-gray-900">N{{ number_format($earning->amount, 2) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @php
                                        $statusColors = [
                                            'pending' => 'bg-yellow-100 text-yellow-800',
                                            'processed' => 'bg-blue-100 text-blue-800',
                                            'paid_out' => 'bg-green-100 text-green-800',
                                        ];
                                    @endphp
                                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $statusColors[$earning->status] ?? 'bg-gray-100 text-gray-800' }}">
                                        {{ ucfirst(str_replace('_', ' ', $earning->status)) }}
                                    </span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $earnings->appends(request()->query())->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

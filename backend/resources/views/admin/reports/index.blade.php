@extends('layouts.admin')

@section('title', 'Reports')
@section('page-title', 'Reports & Analytics')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
            <p class="text-gray-500">View comprehensive platform analytics and generate reports</p>
        </div>
        <div class="flex items-center gap-2">
            <form method="GET" class="flex items-center gap-2">
                <select name="period" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option value="today" {{ request('period') === 'today' ? 'selected' : '' }}>Today</option>
                    <option value="week" {{ request('period', 'week') === 'week' ? 'selected' : '' }}>This Week</option>
                    <option value="month" {{ request('period') === 'month' ? 'selected' : '' }}>This Month</option>
                    <option value="year" {{ request('period') === 'year' ? 'selected' : '' }}>This Year</option>
                </select>
                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Apply</button>
            </form>
        </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-purple-100 text-sm">Total Revenue</p>
                    <p class="text-3xl font-bold mt-1">{{ number_format($totalRevenue ?? 0) }}</p>
                    <p class="text-purple-200 text-sm mt-2">
                        @if(($revenueGrowth ?? 0) >= 0)
                            <span class="text-green-300">+{{ number_format($revenueGrowth ?? 0, 1) }}%</span>
                        @else
                            <span class="text-red-300">{{ number_format($revenueGrowth ?? 0, 1) }}%</span>
                        @endif
                        vs previous period
                    </p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-green-100 text-sm">Total Collections</p>
                    <p class="text-3xl font-bold mt-1">{{ number_format($totalCollections ?? 0) }}</p>
                    <p class="text-green-200 text-sm mt-2">{{ $collectionCount ?? 0 }} transactions</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-blue-100 text-sm">Total Payouts</p>
                    <p class="text-3xl font-bold mt-1">{{ number_format($totalPayouts ?? 0) }}</p>
                    <p class="text-blue-200 text-sm mt-2">{{ $payoutCount ?? 0 }} payouts made</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-orange-100 text-sm">New Users</p>
                    <p class="text-3xl font-bold mt-1">{{ number_format($newUsers ?? 0) }}</p>
                    <p class="text-orange-200 text-sm mt-2">{{ $activeUsers ?? 0 }} active users</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Collections Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Collections Trend</h3>
            <div class="h-64 flex items-end justify-between gap-2">
                @foreach($dailyCollections ?? [] as $day)
                    <div class="flex-1 flex flex-col items-center">
                        <div class="w-full bg-purple-200 rounded-t" style="height: {{ max(($day['amount'] / ($maxCollection ?? 1)) * 200, 4) }}px;">
                            <div class="w-full h-full bg-purple-500 rounded-t hover:bg-purple-600 transition"></div>
                        </div>
                        <span class="text-xs text-gray-500 mt-2">{{ $day['label'] ?? '' }}</span>
                    </div>
                @endforeach
                @if(empty($dailyCollections ?? []))
                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                        No data available
                    </div>
                @endif
            </div>
        </div>

        <!-- Groups by Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Groups by Status</h3>
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-gray-600">Active</span>
                        <span class="text-sm font-medium text-gray-900">{{ $groupStats['active'] ?? 0 }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-green-500 h-3 rounded-full" style="width: {{ ($groupStats['active'] ?? 0) / max(($groupStats['total'] ?? 1), 1) * 100 }}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-gray-600">Pending</span>
                        <span class="text-sm font-medium text-gray-900">{{ $groupStats['pending'] ?? 0 }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-yellow-500 h-3 rounded-full" style="width: {{ ($groupStats['pending'] ?? 0) / max(($groupStats['total'] ?? 1), 1) * 100 }}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-gray-600">Completed</span>
                        <span class="text-sm font-medium text-gray-900">{{ $groupStats['completed'] ?? 0 }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-blue-500 h-3 rounded-full" style="width: {{ ($groupStats['completed'] ?? 0) / max(($groupStats['total'] ?? 1), 1) * 100 }}%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Top Collectors -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Top Collectors</h3>
            </div>
            <div class="divide-y divide-gray-100">
                @forelse($topCollectors ?? [] as $index => $collector)
                    <div class="px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mr-3">{{ $index + 1 }}</span>
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                                {{ strtoupper(substr($collector['name'] ?? 'C', 0, 1)) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ $collector['name'] ?? 'Unknown' }}</p>
                                <p class="text-sm text-gray-500">{{ $collector['groups_count'] ?? 0 }} groups</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-gray-900">{{ number_format($collector['total_collected'] ?? 0) }}</p>
                            <p class="text-sm text-gray-500">{{ $collector['members_count'] ?? 0 }} members</p>
                        </div>
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No collector data available</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div class="divide-y divide-gray-100">
                @forelse($recentActivity ?? [] as $activity)
                    <div class="px-6 py-4 flex items-center">
                        <div class="w-10 h-10 rounded-full {{ $activity['type'] === 'contribution' ? 'bg-green-100' : ($activity['type'] === 'payout' ? 'bg-blue-100' : 'bg-gray-100') }} flex items-center justify-center mr-3">
                            @if($activity['type'] === 'contribution')
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            @elseif($activity['type'] === 'payout')
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            @else
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            @endif
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-gray-900">{{ $activity['description'] ?? 'Activity' }}</p>
                            <p class="text-xs text-gray-500">{{ $activity['time'] ?? '' }}</p>
                        </div>
                        @if(isset($activity['amount']))
                            <span class="font-semibold {{ $activity['type'] === 'contribution' ? 'text-green-600' : 'text-gray-900' }}">
                                {{ $activity['type'] === 'contribution' ? '+' : '' }}{{ number_format($activity['amount']) }}
                            </span>
                        @endif
                    </div>
                @empty
                    <div class="px-6 py-8 text-center text-gray-500">No recent activity</div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Export Options -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="{{ route('admin.reports.export', ['type' => 'transactions']) }}" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-900">Transactions</p>
                    <p class="text-sm text-gray-500">Export to CSV</p>
                </div>
            </a>
            <a href="{{ route('admin.reports.export', ['type' => 'users']) }}" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-900">Users</p>
                    <p class="text-sm text-gray-500">Export to CSV</p>
                </div>
            </a>
            <a href="{{ route('admin.reports.export', ['type' => 'groups']) }}" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-900">Groups</p>
                    <p class="text-sm text-gray-500">Export to CSV</p>
                </div>
            </a>
            <a href="{{ route('admin.reports.export', ['type' => 'collectors']) }}" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-900">Collectors</p>
                    <p class="text-sm text-gray-500">Export to CSV</p>
                </div>
            </a>
        </div>
    </div>
</div>
@endsection

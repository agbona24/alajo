@extends('layouts.admin')

@section('title', 'View Collector')
@section('page-title', 'Collector Details')

@section('content')
<div class="space-y-6">
    <!-- Collector Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
            <div class="flex items-center">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                    {{ strtoupper(substr($collector->name, 0, 1)) }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ $collector->name }}</h2>
                    <p class="text-gray-500">{{ $collector->email }}</p>
                    <div class="mt-2 flex items-center gap-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Collector</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $collector->status === 'active' ? 'bg-green-100 text-green-700' : ($collector->status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst($collector->status ?? 'active') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <a href="{{ route('admin.collectors.edit', $collector) }}" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Edit</a>
                @if($collector->status === 'active')
                    <form method="POST" action="{{ route('admin.collectors.suspend', $collector) }}" class="inline">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition" onclick="return confirm('Are you sure?')">Suspend</button>
                    </form>
                @else
                    <form method="POST" action="{{ route('admin.collectors.activate', $collector) }}" class="inline">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Activate</button>
                    </form>
                @endif
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Groups Managed</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $collector->createdAjoGroups->count() ?? 0 }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Members</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalMembers ?? 0 }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Collections Today</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $collectionsToday ?? 0 }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Collected</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($totalCollected ?? 0) }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Collector Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Phone</dt>
                    <dd class="font-medium text-gray-900">{{ $collector->phone ?? 'Not provided' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Address</dt>
                    <dd class="font-medium text-gray-900">{{ $collector->address ?? 'Not provided' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Joined</dt>
                    <dd class="font-medium text-gray-900">{{ $collector->created_at->format('M d, Y') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Last Login</dt>
                    <dd class="font-medium text-gray-900">{{ $collector->last_login_at?->diffForHumans() ?? 'Never' }}</dd>
                </div>
            </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">This Week</dt>
                    <dd class="font-medium text-gray-900">{{ number_format($weeklyCollections ?? 0) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">This Month</dt>
                    <dd class="font-medium text-gray-900">{{ number_format($monthlyCollections ?? 0) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Pending Approvals</dt>
                    <dd class="font-medium text-gray-900">{{ $pendingApprovals ?? 0 }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Earnings</dt>
                    <dd class="font-medium text-green-600">{{ number_format($totalEarnings ?? 0) }}</dd>
                </div>
            </dl>
        </div>
    </div>

    <!-- Groups Managed -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Groups Managed</h3>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($collector->createdAjoGroups ?? [] as $group)
                <div class="px-6 py-4 flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-900">{{ $group->name }}</p>
                        <p class="text-sm text-gray-500">{{ $group->members_count ?? 0 }} members</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-gray-900">{{ number_format($group->contribution_amount ?? 0) }}/{{ $group->frequency ?? 'daily' }}</p>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                            {{ ucfirst($group->status ?? 'active') }}
                        </span>
                    </div>
                </div>
            @empty
                <div class="px-6 py-8 text-center text-gray-500">No groups managed yet</div>
            @endforelse
        </div>
    </div>

    <div class="flex">
        <a href="{{ route('admin.collectors.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Back to Collectors</a>
    </div>
</div>
@endsection

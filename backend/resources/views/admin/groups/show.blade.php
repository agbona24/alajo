@extends('layouts.admin')

@section('title', 'View Group')
@section('page-title', 'Group Details')

@section('content')
<div class="space-y-6">
    <!-- Group Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
            <div class="flex items-center">
                <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold mr-4">
                    {{ strtoupper(substr($group->name, 0, 1)) }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ $group->name }}</h2>
                    <p class="text-gray-500">Created by {{ $group->creator->name ?? 'Unknown' }}</p>
                    <div class="mt-2 flex items-center gap-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {{ ucfirst($group->frequency ?? 'daily') }}
                        </span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $group->status === 'active' ? 'bg-green-100 text-green-700' : ($group->status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700') }}">
                            {{ ucfirst($group->status ?? 'pending') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                @if($group->status === 'active')
                    <form method="POST" action="{{ route('admin.groups.pause', $group) }}" class="inline">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition">Pause Group</button>
                    </form>
                @endif
                @if($group->status === 'pending' || $group->status === 'paused')
                    <form method="POST" action="{{ route('admin.groups.activate', $group) }}" class="inline">
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Members</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $group->members->count() }}/{{ $group->max_members ?? '∞' }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Contribution</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($group->contribution_amount) }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Collected</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($totalCollected ?? 0) }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Current Cycle</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $currentCycle ?? 1 }}/{{ $group->duration ?? 'N/A' }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Group Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Group Information</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Contribution Amount</dt>
                    <dd class="font-medium text-gray-900">{{ number_format($group->contribution_amount) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Frequency</dt>
                    <dd class="font-medium text-gray-900">{{ ucfirst($group->frequency ?? 'daily') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Duration</dt>
                    <dd class="font-medium text-gray-900">{{ $group->duration ?? 'N/A' }} cycles</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Start Date</dt>
                    <dd class="font-medium text-gray-900">{{ $group->start_date ? \Carbon\Carbon::parse($group->start_date)->format('M d, Y') : 'Not set' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Created</dt>
                    <dd class="font-medium text-gray-900">{{ $group->created_at->format('M d, Y') }}</dd>
                </div>
            </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Collector Information</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Name</dt>
                    <dd class="font-medium text-gray-900">{{ $group->creator->name ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Email</dt>
                    <dd class="font-medium text-gray-900">{{ $group->creator->email ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Phone</dt>
                    <dd class="font-medium text-gray-900">{{ $group->creator->phone ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Commission Rate</dt>
                    <dd class="font-medium text-gray-900">{{ $group->commission_rate ?? 0 }}%</dd>
                </div>
            </dl>
        </div>
    </div>

    <!-- Payout Schedule -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Payout Schedule</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Position</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Member</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payout Date</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($group->members ?? [] as $index => $member)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $index + 1 }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mr-3">
                                        {{ strtoupper(substr($member->user->name ?? 'U', 0, 1)) }}
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{ $member->user->name ?? 'Unknown' }}</div>
                                        <div class="text-xs text-gray-500">{{ $member->user->phone ?? '' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ $member->payout_date ?? 'TBD' }}</td>
                            <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ number_format($group->contribution_amount * ($group->members->count() ?? 1)) }}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full {{ ($member->pivot->payout_status ?? 'pending') === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                                    {{ ucfirst($member->pivot->payout_status ?? 'pending') }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">No members in this group yet</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Recent Contributions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Recent Contributions</h3>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($recentContributions ?? [] as $contribution)
                <div class="px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">{{ $contribution->user->name ?? 'Unknown' }}</p>
                            <p class="text-sm text-gray-500">{{ $contribution->created_at->format('M d, Y H:i') }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-green-600">+{{ number_format($contribution->amount) }}</p>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $contribution->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                            {{ ucfirst($contribution->status) }}
                        </span>
                    </div>
                </div>
            @empty
                <div class="px-6 py-8 text-center text-gray-500">No contributions yet</div>
            @endforelse
        </div>
    </div>

    <div class="flex">
        <a href="{{ route('admin.groups.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Back to Groups</a>
    </div>
</div>
@endsection

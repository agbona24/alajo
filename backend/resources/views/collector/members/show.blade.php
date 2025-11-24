@extends('layouts.collector')

@section('title', ($member->user->name ?? 'Member') . ' - ' . $group->name)
@section('page-title', 'Member Details')

@section('content')
<div x-data="{ showUpdatePosition: false, showConfirmRemove: false }" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('collector.groups.members', $group) }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                    {{ strtoupper(substr($member->user->name ?? 'U', 0, 2)) }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ $member->user->name ?? 'Unknown' }}</h2>
                    <p class="text-gray-500">Position #{{ $member->position ?? 'N/A' }} in {{ $group->name }}</p>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2">
            @if($member->is_admin)
                <form method="POST" action="{{ route('collector.members.remove-admin', ['group' => $group->id, 'member' => $member->id]) }}">
                    @csrf
                    <button type="submit" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                        Remove Admin
                    </button>
                </form>
            @else
                <form method="POST" action="{{ route('collector.members.make-admin', ['group' => $group->id, 'member' => $member->id]) }}">
                    @csrf
                    <button type="submit" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">
                        Make Admin
                    </button>
                </form>
            @endif
            <button @click="showUpdatePosition = true" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                Update Position
            </button>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Total Paid</p>
            <p class="text-2xl font-bold text-green-600">{{ number_format($stats['total_paid'] ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Payment Count</p>
            <p class="text-2xl font-bold text-gray-900">{{ $stats['payment_count'] ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Missed Payments</p>
            <p class="text-2xl font-bold text-red-600">{{ $stats['missed_count'] ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Status</p>
            <span class="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full {{ $member->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                {{ ucfirst($member->status ?? 'pending') }}
            </span>
        </div>
    </div>

    <!-- Member Info & Payment History -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Member Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Member Information</h3>
            </div>
            <div class="p-4 space-y-4">
                <div>
                    <label class="text-sm text-gray-500">Phone Number</label>
                    <p class="font-medium text-gray-900">{{ $member->user->phone ?? 'N/A' }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Email</label>
                    <p class="font-medium text-gray-900">{{ $member->user->email ?? 'N/A' }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Joined Group</label>
                    <p class="font-medium text-gray-900">{{ $member->created_at ? $member->created_at->format('M d, Y') : 'N/A' }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Position</label>
                    <p class="font-medium text-gray-900">#{{ $member->position ?? 'Not assigned' }}</p>
                </div>
                <div>
                    <label class="text-sm text-gray-500">Role</label>
                    <p class="font-medium text-gray-900">{{ $member->is_admin ? 'Group Admin' : 'Member' }}</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="p-4 border-t border-gray-200 space-y-2">
                @if($member->status === 'pending')
                    <div class="flex space-x-2">
                        <form method="POST" action="{{ route('collector.members.approve', ['group' => $group->id, 'member' => $member->id]) }}" class="flex-1">
                            @csrf
                            <button type="submit" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                                Approve
                            </button>
                        </form>
                        <form method="POST" action="{{ route('collector.members.reject', ['group' => $group->id, 'member' => $member->id]) }}" class="flex-1">
                            @csrf
                            <button type="submit" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                                Reject
                            </button>
                        </form>
                    </div>
                @elseif($member->status === 'active')
                    <form method="POST" action="{{ route('collector.members.update-status', ['group' => $group->id, 'member' => $member->id]) }}">
                        @csrf
                        <input type="hidden" name="status" value="suspended">
                        <button type="submit" class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                            Suspend Member
                        </button>
                    </form>
                @else
                    <form method="POST" action="{{ route('collector.members.update-status', ['group' => $group->id, 'member' => $member->id]) }}">
                        @csrf
                        <input type="hidden" name="status" value="active">
                        <button type="submit" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                            Reactivate Member
                        </button>
                    </form>
                @endif
            </div>
        </div>

        <!-- Payment History -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Payment History</h3>
                <span class="text-sm text-gray-500">{{ $payments->count() }} payments</span>
            </div>
            <div class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                @forelse($payments as $payment)
                    <div class="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                            <p class="font-medium text-gray-900">{{ $payment->created_at->format('M d, Y') }}</p>
                            <p class="text-sm text-gray-500">{{ $payment->created_at->format('h:i A') }}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-green-600">+{{ number_format($payment->amount) }}</p>
                            <span class="text-xs px-2 py-1 rounded-full {{ $payment->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                                {{ ucfirst($payment->status) }}
                            </span>
                        </div>
                    </div>
                @empty
                    <div class="p-8 text-center text-gray-500">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p>No payment history</p>
                    </div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Update Position Modal -->
    <div x-show="showUpdatePosition" x-cloak class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div x-show="showUpdatePosition" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-black/50" @click="showUpdatePosition = false"></div>
            <div x-show="showUpdatePosition" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 scale-100" x-transition:leave-end="opacity-0 scale-95" class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Position</h3>
                <form method="POST" action="{{ route('collector.members.update-position', ['group' => $group->id, 'member' => $member->id]) }}">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Position</label>
                        <input type="number" name="position" min="1" value="{{ $member->position }}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <p class="mt-1 text-sm text-gray-500">Enter the new position number for this member</p>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                            Update Position
                        </button>
                        <button type="button" @click="showUpdatePosition = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

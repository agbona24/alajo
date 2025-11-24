@extends('layouts.admin')

@section('title', 'Withdrawal Details')
@section('page-title', 'Withdrawal Details')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="{{ route('admin.withdrawals.index') }}" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Withdrawal #{{ $withdrawal->reference }}</h2>
                <p class="text-gray-500">Requested {{ $withdrawal->created_at->format('F d, Y \a\t H:i') }}</p>
            </div>
        </div>
        <span class="px-3 py-1 text-sm font-medium rounded-full
            @if($withdrawal->status === 'completed') bg-green-100 text-green-700
            @elseif($withdrawal->status === 'rejected') bg-red-100 text-red-700
            @elseif($withdrawal->status === 'processing') bg-purple-100 text-purple-700
            @elseif($withdrawal->status === 'approved') bg-blue-100 text-blue-700
            @else bg-yellow-100 text-yellow-700
            @endif">
            {{ $withdrawal->status === 'processing' ? 'Sent' : ucfirst($withdrawal->status) }}
        </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Withdrawal Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Withdrawal Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Amount</p>
                        <p class="text-2xl font-bold text-gray-900">{{ number_format($withdrawal->amount) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Reference</p>
                        <p class="font-mono text-gray-900">{{ $withdrawal->reference }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Requested At</p>
                        <p class="text-gray-900">{{ $withdrawal->created_at->format('M d, Y H:i') }}</p>
                    </div>
                    @if($withdrawal->approved_at)
                    <div>
                        <p class="text-sm text-gray-500">Approved At</p>
                        <p class="text-gray-900">{{ $withdrawal->approved_at->format('M d, Y H:i') }}</p>
                    </div>
                    @endif
                    @if($withdrawal->completed_at)
                    <div>
                        <p class="text-sm text-gray-500">Completed At</p>
                        <p class="text-gray-900">{{ $withdrawal->completed_at->format('M d, Y H:i') }}</p>
                    </div>
                    @endif
                    @if($withdrawal->reason)
                    <div class="col-span-2">
                        <p class="text-sm text-gray-500">Member's Reason</p>
                        <p class="text-gray-900">{{ $withdrawal->reason }}</p>
                    </div>
                    @endif
                    @if($withdrawal->rejection_reason)
                    <div class="col-span-2">
                        <p class="text-sm text-gray-500">Rejection Reason</p>
                        <p class="text-red-600">{{ $withdrawal->rejection_reason }}</p>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Bank Details -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Bank Account Details</h3>
                @if($withdrawal->bankAccount)
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Bank Name</p>
                        <p class="text-lg font-semibold text-gray-900">{{ $withdrawal->bankAccount->bank_name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Account Number</p>
                        <p class="text-lg font-mono text-gray-900">{{ $withdrawal->bankAccount->account_number }}</p>
                    </div>
                    <div class="col-span-2">
                        <p class="text-sm text-gray-500">Account Name</p>
                        <p class="text-gray-900">{{ $withdrawal->bankAccount->account_name ?? $withdrawal->user->name }}</p>
                    </div>
                </div>
                @else
                <p class="text-gray-500">No bank account information available</p>
                @endif
            </div>

            <!-- Member Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Member Information</h3>
                <div class="flex items-start gap-4">
                    <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                        {{ strtoupper(substr($withdrawal->user->name ?? 'U', 0, 1)) }}
                    </div>
                    <div class="flex-1">
                        <p class="text-lg font-semibold text-gray-900">{{ $withdrawal->user->name ?? 'Unknown' }}</p>
                        <p class="text-gray-600">{{ $withdrawal->user->phone ?? '' }}</p>
                        @if($withdrawal->user->email)
                        <p class="text-gray-600">{{ $withdrawal->user->email }}</p>
                        @endif
                        <a href="{{ route('admin.users.show', $withdrawal->user) }}" class="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800">View Member Profile</a>
                    </div>
                </div>
            </div>

            <!-- Savings Plan Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Savings Plan</h3>
                @if($withdrawal->savingsPlan)
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ $withdrawal->savingsPlan->emoji ?? '' }}</span>
                        <div>
                            <p class="text-lg font-semibold text-gray-900">{{ $withdrawal->savingsPlan->name }}</p>
                            <p class="text-sm text-gray-500">{{ ucfirst($withdrawal->savingsPlan->frequency) }} Savings</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Current Balance</p>
                            <p class="font-semibold text-gray-900">{{ number_format($withdrawal->savingsPlan->current_amount) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Target Amount</p>
                            <p class="font-semibold text-gray-900">{{ number_format($withdrawal->savingsPlan->target_amount) }}</p>
                        </div>
                    </div>
                </div>
                @else
                <p class="text-gray-500">No savings plan associated</p>
                @endif
            </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
            <!-- Actions -->
            @if(in_array($withdrawal->status, ['pending', 'approved', 'processing']))
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div class="space-y-3">
                    @if($withdrawal->status === 'pending')
                        <form method="POST" action="{{ route('admin.withdrawals.mark-sent', $withdrawal) }}">
                            @csrf
                            <button type="submit" class="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2" onclick="return confirm('Mark as sent/processing?')">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Mark as Sent
                            </button>
                        </form>

                        <form method="POST" action="{{ route('admin.withdrawals.reject', $withdrawal) }}">
                            @csrf
                            <div class="mb-3">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                                <textarea name="reason" rows="2" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter reason for rejection..."></textarea>
                            </div>
                            <button type="submit" class="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Reject Withdrawal
                            </button>
                        </form>
                    @elseif($withdrawal->status === 'approved')
                        <form method="POST" action="{{ route('admin.withdrawals.mark-sent', $withdrawal) }}">
                            @csrf
                            <button type="submit" class="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Mark as Sent
                            </button>
                        </form>
                    @elseif($withdrawal->status === 'processing')
                        <form method="POST" action="{{ route('admin.withdrawals.mark-completed', $withdrawal) }}">
                            @csrf
                            <button type="submit" class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2" onclick="return confirm('Confirm member has received payment?')">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Mark as Completed
                            </button>
                        </form>
                    @endif
                </div>
            </div>
            @endif

            <!-- Status Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Status Timeline</h3>
                <div class="space-y-4">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Request Created</p>
                            <p class="text-sm text-gray-500">{{ $withdrawal->created_at->format('M d, Y H:i') }}</p>
                        </div>
                    </div>
                    @if($withdrawal->approved_at)
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path></svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Approved</p>
                            <p class="text-sm text-gray-500">{{ $withdrawal->approved_at->format('M d, Y H:i') }}</p>
                            @if($withdrawal->approvedBy)
                            <p class="text-xs text-gray-400">by {{ $withdrawal->approvedBy->name }}</p>
                            @endif
                        </div>
                    </div>
                    @endif
                    @if($withdrawal->status === 'processing' || $withdrawal->status === 'completed')
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Payment Sent</p>
                            <p class="text-sm text-gray-500">Transfer initiated to bank</p>
                        </div>
                    </div>
                    @endif
                    @if($withdrawal->completed_at)
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Completed</p>
                            <p class="text-sm text-gray-500">{{ $withdrawal->completed_at->format('M d, Y H:i') }}</p>
                        </div>
                    </div>
                    @endif
                    @if($withdrawal->status === 'rejected')
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Rejected</p>
                            <p class="text-sm text-red-600">{{ $withdrawal->rejection_reason }}</p>
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

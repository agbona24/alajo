@extends('layouts.admin')

@section('title', 'Contribution Details')
@section('page-title', 'Contribution Details')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="{{ route('admin.approvals.index') }}" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Contribution #{{ $contribution->reference }}</h2>
                <p class="text-gray-500">Submitted {{ $contribution->created_at->format('F d, Y \a\t H:i') }}</p>
            </div>
        </div>
        <span class="px-3 py-1 text-sm font-medium rounded-full
            @if($contribution->status === 'completed') bg-green-100 text-green-700
            @elseif($contribution->status === 'failed') bg-red-100 text-red-700
            @else bg-yellow-100 text-yellow-700
            @endif">
            {{ $contribution->status === 'completed' ? 'Approved' : ($contribution->status === 'failed' ? 'Rejected' : 'Pending') }}
        </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Contribution Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Contribution Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Amount</p>
                        <p class="text-2xl font-bold text-gray-900">{{ number_format($contribution->amount) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Payment Method</p>
                        <p class="text-lg font-semibold text-gray-900">{{ ucfirst(str_replace('_', ' ', $contribution->payment_method)) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Reference</p>
                        <p class="font-mono text-gray-900">{{ $contribution->reference }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Submitted At</p>
                        <p class="text-gray-900">{{ $contribution->created_at->format('M d, Y H:i') }}</p>
                    </div>
                    @if($contribution->completed_at)
                    <div>
                        <p class="text-sm text-gray-500">Approved At</p>
                        <p class="text-gray-900">{{ $contribution->completed_at->format('M d, Y H:i') }}</p>
                    </div>
                    @endif
                    @if($contribution->notes)
                    <div class="col-span-2">
                        <p class="text-sm text-gray-500">Notes</p>
                        <p class="text-gray-900">{{ $contribution->notes }}</p>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Receipt Image -->
            @if($contribution->receipt_path)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Payment Receipt
                </h3>
                <div class="relative group">
                    <a href="{{ asset('storage/' . $contribution->receipt_path) }}" target="_blank" class="block">
                        <img
                            src="{{ asset('storage/' . $contribution->receipt_path) }}"
                            alt="Payment Receipt"
                            class="w-full max-h-96 object-contain rounded-lg border border-gray-200 hover:border-purple-400 transition cursor-pointer"
                        >
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition rounded-lg flex items-center justify-center">
                            <span class="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transition">
                                Click to view full size
                            </span>
                        </div>
                    </a>
                </div>
                <p class="text-xs text-gray-500 mt-2 text-center">Uploaded by member as proof of payment</p>
            </div>
            @else
            <div class="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <h4 class="font-semibold text-yellow-800">No Receipt Attached</h4>
                        <p class="text-sm text-yellow-700 mt-1">The member did not upload a payment receipt. Please verify the payment manually through your bank account.</p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Member Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Member Information</h3>
                <div class="flex items-start gap-4">
                    <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                        {{ strtoupper(substr($contribution->user->name ?? 'U', 0, 1)) }}
                    </div>
                    <div class="flex-1">
                        <p class="text-lg font-semibold text-gray-900">{{ $contribution->user->name ?? 'Unknown' }}</p>
                        <p class="text-gray-600">{{ $contribution->user->phone ?? '' }}</p>
                        @if($contribution->user->email)
                        <p class="text-gray-600">{{ $contribution->user->email }}</p>
                        @endif
                        <a href="{{ route('admin.users.show', $contribution->user) }}" class="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800">View Member Profile</a>
                    </div>
                </div>
            </div>

            <!-- Savings Plan Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Savings Plan</h3>
                @if($contribution->savingsPlan)
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ $contribution->savingsPlan->emoji ?? '' }}</span>
                        <div>
                            <p class="text-lg font-semibold text-gray-900">{{ $contribution->savingsPlan->name }}</p>
                            <p class="text-sm text-gray-500">{{ ucfirst($contribution->savingsPlan->frequency) }} Savings</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Daily Amount</p>
                            <p class="font-semibold text-gray-900">{{ number_format($contribution->savingsPlan->daily_contribution) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Target Amount</p>
                            <p class="font-semibold text-gray-900">{{ number_format($contribution->savingsPlan->target_amount) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Current Balance</p>
                            <p class="font-semibold text-gray-900">{{ number_format($contribution->savingsPlan->current_amount) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <span class="px-2 py-1 text-xs font-medium rounded-full
                                @if($contribution->savingsPlan->status === 'active') bg-green-100 text-green-700
                                @elseif($contribution->savingsPlan->status === 'paused') bg-yellow-100 text-yellow-700
                                @else bg-gray-100 text-gray-700
                                @endif">
                                {{ ucfirst($contribution->savingsPlan->status) }}
                            </span>
                        </div>
                    </div>
                </div>
                @else
                <p class="text-gray-500">No savings plan associated</p>
                @endif
            </div>

            <!-- Passbook Records -->
            @if($passbookRecords && $passbookRecords->count() > 0)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Passbook Records ({{ $passbookRecords->count() }} days)</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($passbookRecords as $record)
                            <tr>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ \Carbon\Carbon::parse($record->contribution_date)->format('M d, Y') }}</td>
                                <td class="px-4 py-2 text-sm text-gray-900">{{ number_format($record->amount) }}</td>
                                <td class="px-4 py-2">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full
                                        @if($record->status === 'paid') bg-green-100 text-green-700
                                        @elseif($record->status === 'missed') bg-red-100 text-red-700
                                        @else bg-yellow-100 text-yellow-700
                                        @endif">
                                        {{ ucfirst($record->status) }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            @endif
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
            <!-- Actions -->
            @if($contribution->status === 'pending')
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div class="space-y-3">
                    <form method="POST" action="{{ route('admin.approvals.approve', $contribution) }}">
                        @csrf
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea name="notes" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Add any notes..."></textarea>
                        </div>
                        <button type="submit" class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2" onclick="return confirm('Confirm this payment has been received?')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Approve Payment
                        </button>
                    </form>

                    <form method="POST" action="{{ route('admin.approvals.reject', $contribution) }}">
                        @csrf
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                            <textarea name="reason" rows="2" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter reason for rejection..."></textarea>
                        </div>
                        <button type="submit" class="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Reject Payment
                        </button>
                    </form>
                </div>
            </div>
            @endif

            <!-- Transaction Info -->
            @if($transaction)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Transaction Record</h3>
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-gray-500">Reference</p>
                        <p class="font-mono text-sm text-gray-900">{{ $transaction->reference }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Type</p>
                        <p class="text-gray-900">{{ ucfirst($transaction->type) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Status</p>
                        <span class="px-2 py-1 text-xs font-medium rounded-full
                            @if($transaction->status === 'completed') bg-green-100 text-green-700
                            @elseif($transaction->status === 'failed') bg-red-100 text-red-700
                            @else bg-yellow-100 text-yellow-700
                            @endif">
                            {{ ucfirst($transaction->status) }}
                        </span>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Balance Before</p>
                        <p class="text-gray-900">{{ number_format($transaction->balance_before) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Balance After</p>
                        <p class="text-gray-900">{{ number_format($transaction->balance_after) }}</p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Help -->
            <div class="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <h4 class="font-medium text-blue-900 mb-2">Approval Guidelines</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                    <li>- Verify payment has been received in bank account</li>
                    <li>- Check the amount matches what was transferred</li>
                    <li>- Confirm member name/reference matches</li>
                    <li>- Member will be notified upon approval</li>
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection

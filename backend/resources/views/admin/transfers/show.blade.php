@extends('layouts.admin')

@section('title', 'Transfer Details')
@section('page-title', 'Transfer Details')

@section('content')
<div class="space-y-6 max-w-4xl">
    <!-- Transfer Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
            <div>
                <div class="flex items-center gap-3 mb-2">
                    <h2 class="text-2xl font-bold text-gray-900">Transfer Request</h2>
                    <span class="px-3 py-1 text-sm font-medium rounded-full {{ $transfer->status === 'approved' ? 'bg-green-100 text-green-700' : ($transfer->status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700') }}">
                        {{ ucfirst($transfer->status) }}
                    </span>
                </div>
                <p class="font-mono text-gray-500">{{ $transfer->reference }}</p>
            </div>
            <div class="text-right">
                <p class="text-3xl font-bold text-gray-900">{{ number_format($transfer->amount) }}</p>
                <p class="text-sm text-gray-500">{{ $transfer->created_at->format('M d, Y H:i:s') }}</p>
            </div>
        </div>
    </div>

    <!-- Transfer Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- User Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">User Information</h3>
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-4">
                    {{ strtoupper(substr($transfer->user->name ?? 'U', 0, 1)) }}
                </div>
                <div>
                    <p class="font-medium text-gray-900">{{ $transfer->user->name ?? 'Unknown' }}</p>
                    <p class="text-sm text-gray-500">{{ $transfer->user->email ?? '' }}</p>
                </div>
            </div>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Phone</dt>
                    <dd class="font-medium text-gray-900">{{ $transfer->user->phone ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">User ID</dt>
                    <dd class="font-mono text-sm text-gray-900">{{ $transfer->user_id }}</dd>
                </div>
            </dl>
            <div class="mt-4">
                <a href="{{ route('admin.users.show', $transfer->user_id) }}" class="text-purple-600 hover:text-purple-700 text-sm font-medium">View User Profile →</a>
            </div>
        </div>

        <!-- Bank Account Details -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Receiving Bank Account</h3>
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <p class="text-sm text-gray-500 mb-1">Bank</p>
                <p class="font-semibold text-gray-900">{{ $transfer->bankAccount->bank_name ?? 'N/A' }}</p>
            </div>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Account Name</dt>
                    <dd class="font-medium text-gray-900">{{ $transfer->bankAccount->account_name ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Account Number</dt>
                    <dd class="font-mono font-medium text-gray-900">{{ $transfer->bankAccount->account_number ?? 'N/A' }}</dd>
                </div>
            </dl>
        </div>
    </div>

    <!-- Transfer Proof -->
    @if($transfer->transfer_proof)
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Transfer Proof</h3>
        <div class="border border-gray-200 rounded-lg overflow-hidden">
            <img src="{{ asset('storage/' . $transfer->transfer_proof) }}" alt="Transfer Proof" class="max-w-full h-auto">
        </div>
        <p class="text-sm text-gray-500 mt-2">Uploaded by user as proof of transfer</p>
    </div>
    @endif

    <!-- Additional Details -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Transfer Details</h3>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <dt class="text-sm text-gray-500">Reference Number</dt>
                <dd class="font-mono font-medium text-gray-900">{{ $transfer->reference }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-500">Amount</dt>
                <dd class="font-semibold text-gray-900">{{ number_format($transfer->amount) }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-500">Purpose</dt>
                <dd class="font-medium text-gray-900">{{ $transfer->purpose ?? 'Contribution' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-500">Status</dt>
                <dd>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $transfer->status === 'approved' ? 'bg-green-100 text-green-700' : ($transfer->status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700') }}">
                        {{ ucfirst($transfer->status) }}
                    </span>
                </dd>
            </div>
            <div>
                <dt class="text-sm text-gray-500">Submitted</dt>
                <dd class="font-medium text-gray-900">{{ $transfer->created_at->format('M d, Y H:i') }}</dd>
            </div>
            @if($transfer->approved_at)
            <div>
                <dt class="text-sm text-gray-500">Processed</dt>
                <dd class="font-medium text-gray-900">{{ \Carbon\Carbon::parse($transfer->approved_at)->format('M d, Y H:i') }}</dd>
            </div>
            @endif
            @if($transfer->approvedBy)
            <div>
                <dt class="text-sm text-gray-500">Processed By</dt>
                <dd class="font-medium text-gray-900">{{ $transfer->approvedBy->name ?? 'N/A' }}</dd>
            </div>
            @endif
        </dl>

        @if($transfer->notes)
        <div class="mt-4 pt-4 border-t border-gray-200">
            <dt class="text-sm text-gray-500 mb-1">Notes</dt>
            <dd class="text-gray-700">{{ $transfer->notes }}</dd>
        </div>
        @endif

        @if($transfer->rejection_reason)
        <div class="mt-4 pt-4 border-t border-gray-200">
            <dt class="text-sm text-gray-500 mb-1">Rejection Reason</dt>
            <dd class="text-red-600">{{ $transfer->rejection_reason }}</dd>
        </div>
        @endif
    </div>

    <!-- Related Group (if applicable) -->
    @if($transfer->ajo_group_id ?? false)
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Related Group</h3>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-4">
                    {{ strtoupper(substr($transfer->ajoGroup->name ?? 'G', 0, 1)) }}
                </div>
                <div>
                    <p class="font-medium text-gray-900">{{ $transfer->ajoGroup->name ?? 'Unknown Group' }}</p>
                    <p class="text-sm text-gray-500">{{ ucfirst($transfer->ajoGroup->frequency ?? 'daily') }} contribution</p>
                </div>
            </div>
            <a href="{{ route('admin.groups.show', $transfer->ajo_group_id) }}" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">View Group</a>
        </div>
    </div>
    @endif

    <!-- Actions -->
    <div class="flex items-center gap-4">
        <a href="{{ route('admin.transfers.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Back to Transfers</a>

        @if($transfer->status === 'pending')
            <form method="POST" action="{{ route('admin.transfers.approve', $transfer) }}" class="inline">
                @csrf
                <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Approve Transfer</button>
            </form>

            <button type="button" onclick="document.getElementById('rejectModal').classList.remove('hidden')" class="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">Reject Transfer</button>
        @endif
    </div>
</div>

<!-- Reject Modal -->
@if($transfer->status === 'pending')
<div id="rejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reject Transfer</h3>
        <form method="POST" action="{{ route('admin.transfers.reject', $transfer) }}">
            @csrf
            <div class="mb-4">
                <label for="rejection_reason" class="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                <textarea name="rejection_reason" id="rejection_reason" rows="3" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter reason for rejecting this transfer..."></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" onclick="document.getElementById('rejectModal').classList.add('hidden')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">Reject Transfer</button>
            </div>
        </form>
    </div>
</div>
@endif
@endsection

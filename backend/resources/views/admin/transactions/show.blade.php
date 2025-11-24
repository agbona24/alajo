@extends('layouts.admin')

@section('title', 'Transaction Details')
@section('page-title', 'Transaction Details')

@section('content')
<div class="space-y-6 max-w-4xl">
    <!-- Transaction Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
            <div>
                <div class="flex items-center gap-3 mb-2">
                    <h2 class="text-2xl font-bold text-gray-900">Transaction</h2>
                    <span class="px-3 py-1 text-sm font-medium rounded-full {{ $transaction->status === 'completed' ? 'bg-green-100 text-green-700' : ($transaction->status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700') }}">
                        {{ ucfirst($transaction->status ?? 'pending') }}
                    </span>
                </div>
                <p class="font-mono text-gray-500">{{ $transaction->reference ?? 'TXN-' . $transaction->id }}</p>
            </div>
            <div class="text-right">
                <p class="text-3xl font-bold {{ in_array($transaction->type, ['contribution', 'deposit', 'credit']) ? 'text-green-600' : 'text-gray-900' }}">
                    {{ in_array($transaction->type, ['contribution', 'deposit', 'credit']) ? '+' : '-' }}{{ number_format($transaction->amount) }}
                </p>
                <p class="text-sm text-gray-500">{{ $transaction->created_at->format('M d, Y H:i:s') }}</p>
            </div>
        </div>
    </div>

    <!-- Transaction Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Transaction Information</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Type</dt>
                    <dd>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $transaction->type === 'contribution' ? 'bg-green-100 text-green-700' : ($transaction->type === 'payout' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst($transaction->type ?? 'unknown') }}
                        </span>
                    </dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Amount</dt>
                    <dd class="font-medium text-gray-900">{{ number_format($transaction->amount) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Reference</dt>
                    <dd class="font-mono text-sm text-gray-900">{{ $transaction->reference ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Payment Method</dt>
                    <dd class="font-medium text-gray-900">{{ ucfirst($transaction->payment_method ?? 'N/A') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Created</dt>
                    <dd class="font-medium text-gray-900">{{ $transaction->created_at->format('M d, Y H:i') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Updated</dt>
                    <dd class="font-medium text-gray-900">{{ $transaction->updated_at->format('M d, Y H:i') }}</dd>
                </div>
            </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">User Information</h3>
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-4">
                    {{ strtoupper(substr($transaction->user->name ?? 'U', 0, 1)) }}
                </div>
                <div>
                    <p class="font-medium text-gray-900">{{ $transaction->user->name ?? 'Unknown' }}</p>
                    <p class="text-sm text-gray-500">{{ $transaction->user->email ?? '' }}</p>
                </div>
            </div>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Phone</dt>
                    <dd class="font-medium text-gray-900">{{ $transaction->user->phone ?? 'N/A' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Role</dt>
                    <dd>
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {{ ucfirst($transaction->user->role ?? 'user') }}
                        </span>
                    </dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">User ID</dt>
                    <dd class="font-mono text-sm text-gray-900">{{ $transaction->user_id }}</dd>
                </div>
            </dl>
            <div class="mt-4">
                <a href="{{ route('admin.users.show', $transaction->user_id) }}" class="text-purple-600 hover:text-purple-700 text-sm font-medium">View User Profile →</a>
            </div>
        </div>
    </div>

    <!-- Related Group (if applicable) -->
    @if($transaction->ajo_group_id ?? false)
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Related Group</h3>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-4">
                    {{ strtoupper(substr($transaction->ajoGroup->name ?? 'G', 0, 1)) }}
                </div>
                <div>
                    <p class="font-medium text-gray-900">{{ $transaction->ajoGroup->name ?? 'Unknown Group' }}</p>
                    <p class="text-sm text-gray-500">{{ ucfirst($transaction->ajoGroup->frequency ?? 'daily') }} contribution</p>
                </div>
            </div>
            <a href="{{ route('admin.groups.show', $transaction->ajo_group_id) }}" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">View Group</a>
        </div>
    </div>
    @endif

    <!-- Description/Notes -->
    @if($transaction->description ?? $transaction->notes ?? false)
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Notes</h3>
        <p class="text-gray-700">{{ $transaction->description ?? $transaction->notes }}</p>
    </div>
    @endif

    <!-- Actions -->
    <div class="flex items-center gap-4">
        <a href="{{ route('admin.transactions.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Back to Transactions</a>
        @if($transaction->status === 'pending')
            <form method="POST" action="{{ route('admin.transactions.approve', $transaction) }}" class="inline">
                @csrf
                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Approve</button>
            </form>
            <form method="POST" action="{{ route('admin.transactions.reject', $transaction) }}" class="inline">
                @csrf
                <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition" onclick="return confirm('Are you sure you want to reject this transaction?')">Reject</button>
            </form>
        @endif
    </div>
</div>
@endsection

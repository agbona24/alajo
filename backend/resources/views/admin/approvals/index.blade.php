@extends('layouts.admin')

@section('title', 'Pending Approvals')
@section('page-title', 'Pending Approvals')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Pending Approvals</h2>
            <p class="text-gray-500">Review and approve member payment contributions</p>
        </div>
        <a href="{{ route('admin.approvals.export') }}?status={{ $status }}" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export CSV
        </a>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Pending</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ $stats['pending'] ?? 0 }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Approved Today</p>
                    <p class="text-2xl font-bold text-green-600">{{ $stats['approved_today'] ?? 0 }}</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Rejected Today</p>
                    <p class="text-2xl font-bold text-red-600">{{ $stats['rejected_today'] ?? 0 }}</p>
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
                    <p class="text-sm text-gray-500">Pending Value</p>
                    <p class="text-2xl font-bold text-blue-600">{{ number_format($stats['total_pending_amount'] ?? 0) }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form method="GET" class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by reference, user name or phone..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            </div>
            <div>
                <select name="status" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option value="pending" {{ $status === 'pending' ? 'selected' : '' }}>Pending</option>
                    <option value="completed" {{ $status === 'completed' ? 'selected' : '' }}>Approved</option>
                    <option value="failed" {{ $status === 'failed' ? 'selected' : '' }}>Rejected</option>
                    <option value="all" {{ $status === 'all' ? 'selected' : '' }}>All Status</option>
                </select>
            </div>
            <div>
                <select name="payment_method" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option value="">All Payment Methods</option>
                    <option value="bank_transfer" {{ request('payment_method') === 'bank_transfer' ? 'selected' : '' }}>Bank Transfer</option>
                    <option value="card" {{ request('payment_method') === 'card' ? 'selected' : '' }}>Card</option>
                    <option value="cash" {{ request('payment_method') === 'cash' ? 'selected' : '' }}>Cash</option>
                    <option value="wallet" {{ request('payment_method') === 'wallet' ? 'selected' : '' }}>Wallet</option>
                </select>
            </div>
            <div>
                <input type="date" name="date" value="{{ request('date') }}" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            </div>
            <button type="submit" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">Filter</button>
            <a href="{{ route('admin.approvals.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Reset</a>
        </form>
    </div>

    <!-- Pending Alert -->
    @if(($stats['pending'] ?? 0) > 0)
    <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Pending Approvals</h3>
                <p class="text-sm text-yellow-700 mt-1">You have {{ $stats['pending'] }} payment(s) waiting for approval. Please review and confirm once payment is received.</p>
            </div>
        </div>
    </div>
    @endif

    <!-- Bulk Actions -->
    @if($status === 'pending' && $contributions->count() > 0)
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form method="POST" action="{{ route('admin.approvals.bulk-approve') }}" id="bulkApproveForm">
            @csrf
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <label class="flex items-center">
                        <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-700">Select All</span>
                    </label>
                    <span id="selectedCount" class="text-sm text-gray-500">0 selected</span>
                </div>
                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50" id="bulkApproveBtn" disabled>
                    Approve Selected
                </button>
            </div>
        </form>
    </div>
    @endif

    <!-- Contributions Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        @if($status === 'pending')
                        <th class="px-4 py-3 text-left">
                            <span class="sr-only">Select</span>
                        </th>
                        @endif
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Savings Plan</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                        <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($contributions as $contribution)
                        <tr class="hover:bg-gray-50 {{ $contribution->status === 'pending' ? 'bg-yellow-50' : '' }}">
                            @if($status === 'pending')
                            <td class="px-4 py-4">
                                <input type="checkbox" name="contribution_ids[]" value="{{ $contribution->id }}" form="bulkApproveForm" class="contribution-checkbox rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                            </td>
                            @endif
                            <td class="px-6 py-4">
                                <span class="font-mono text-sm text-gray-900">{{ $contribution->reference }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mr-3">
                                        {{ strtoupper(substr($contribution->user->name ?? 'U', 0, 1)) }}
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{ $contribution->user->name ?? 'Unknown' }}</div>
                                        <div class="text-xs text-gray-500">{{ $contribution->user->phone ?? '' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900">
                                    {{ $contribution->savingsPlan->emoji ?? '' }} {{ $contribution->savingsPlan->name ?? 'N/A' }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    Daily: {{ number_format($contribution->savingsPlan->daily_contribution ?? 0) }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-semibold text-gray-900">{{ number_format($contribution->amount) }}</span>
                                @if($contribution->notes)
                                    <div class="text-xs text-gray-500">{{ $contribution->notes }}</div>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full
                                    @if($contribution->payment_method === 'bank_transfer') bg-blue-100 text-blue-700
                                    @elseif($contribution->payment_method === 'card') bg-purple-100 text-purple-700
                                    @elseif($contribution->payment_method === 'cash') bg-green-100 text-green-700
                                    @else bg-gray-100 text-gray-700
                                    @endif">
                                    {{ ucfirst(str_replace('_', ' ', $contribution->payment_method)) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                @if($contribution->receipt_path)
                                    <a href="{{ asset('storage/' . $contribution->receipt_path) }}" target="_blank" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition" title="View Receipt">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        View
                                    </a>
                                @else
                                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        None
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full
                                    @if($contribution->status === 'completed') bg-green-100 text-green-700
                                    @elseif($contribution->status === 'failed') bg-red-100 text-red-700
                                    @else bg-yellow-100 text-yellow-700
                                    @endif">
                                    {{ $contribution->status === 'completed' ? 'Approved' : ($contribution->status === 'failed' ? 'Rejected' : 'Pending') }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                {{ $contribution->created_at->format('M d, Y H:i') }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <a href="{{ route('admin.approvals.show', $contribution) }}" class="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="View Details">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    </a>
                                    @if($contribution->status === 'pending')
                                        <form method="POST" action="{{ route('admin.approvals.approve', $contribution) }}" class="inline">
                                            @csrf
                                            <button type="submit" class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve Payment" onclick="return confirm('Confirm this payment has been received?')">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </button>
                                        </form>
                                        <button type="button" onclick="showRejectModal({{ $contribution->id }})" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject Payment">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ $status === 'pending' ? 10 : 9 }}" class="px-6 py-12 text-center text-gray-500">
                                <div class="flex flex-col items-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                    <p class="text-lg font-medium">No contributions found</p>
                                    <p class="text-sm">
                                        @if($status === 'pending')
                                            No pending payments to approve
                                        @else
                                            Contributions will appear here when members submit them
                                        @endif
                                    </p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($contributions->hasPages())
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $contributions->links() }}
            </div>
        @endif
    </div>
</div>

<!-- Reject Modal -->
<div id="rejectModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Reject Payment</h3>
        <form method="POST" id="rejectForm">
            @csrf
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                <textarea name="reason" rows="3" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter reason for rejecting this payment..."></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" onclick="hideRejectModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Reject Payment</button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    // Reject Modal
    function showRejectModal(contributionId) {
        document.getElementById('rejectForm').action = '/admin/approvals/' + contributionId + '/reject';
        document.getElementById('rejectModal').classList.remove('hidden');
    }

    function hideRejectModal() {
        document.getElementById('rejectModal').classList.add('hidden');
    }

    // Close modal on outside click
    document.getElementById('rejectModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideRejectModal();
        }
    });

    // Bulk selection
    const selectAllCheckbox = document.getElementById('selectAll');
    const contributionCheckboxes = document.querySelectorAll('.contribution-checkbox');
    const selectedCount = document.getElementById('selectedCount');
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            contributionCheckboxes.forEach(cb => cb.checked = this.checked);
            updateSelectedCount();
        });

        contributionCheckboxes.forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });
    }

    function updateSelectedCount() {
        const count = document.querySelectorAll('.contribution-checkbox:checked').length;
        if (selectedCount) selectedCount.textContent = count + ' selected';
        if (bulkApproveBtn) bulkApproveBtn.disabled = count === 0;

        // Update select all checkbox state
        if (selectAllCheckbox && contributionCheckboxes.length > 0) {
            selectAllCheckbox.checked = count === contributionCheckboxes.length;
            selectAllCheckbox.indeterminate = count > 0 && count < contributionCheckboxes.length;
        }
    }
</script>
@endpush
@endsection

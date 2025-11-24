@extends('layouts.collector')

@section('title', 'Payments - ' . $group->name)
@section('page-title', 'Record Payments')

@section('content')
<div x-data="{
    selectedMembers: [],
    selectAll: false,
    toggleSelectAll() {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.selectedMembers = [...document.querySelectorAll('input[name=member_ids]')].map(el => el.value);
        } else {
            this.selectedMembers = [];
        }
    }
}" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('collector.groups.show', $group) }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ $group->name }} - Payments</h2>
                <p class="text-gray-500">Record member contributions</p>
            </div>
        </div>
        <div class="flex items-center space-x-2">
            <a href="{{ route('collector.payments.today', $group) }}" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                Today's Summary
            </a>
        </div>
    </div>

    <!-- Bulk Actions -->
    <div x-show="selectedMembers.length > 0" x-cloak class="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
        <p class="text-purple-700 font-medium">
            <span x-text="selectedMembers.length"></span> members selected
        </p>
        <div class="flex items-center space-x-2">
            <form method="POST" action="{{ route('collector.payments.bulk-mark-paid', $group) }}" class="inline">
                @csrf
                <template x-for="id in selectedMembers">
                    <input type="hidden" name="member_ids[]" :value="id">
                </template>
                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                    Mark All Paid
                </button>
            </form>
            <form method="POST" action="{{ route('collector.payments.send-reminders', $group) }}" class="inline">
                @csrf
                <template x-for="id in selectedMembers">
                    <input type="hidden" name="member_ids[]" :value="id">
                </template>
                <button type="submit" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                    Send Reminders
                </button>
            </form>
        </div>
    </div>

    <!-- Payment Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Members List</h3>
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">Amount per payment:</span>
                    <span class="font-bold text-purple-600">{{ number_format($group->contribution_amount) }}</span>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-left">
                            <input type="checkbox" @click="toggleSelectAll()" :checked="selectAll" class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Status</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse($payments as $payment)
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-4">
                                <input type="checkbox" name="member_ids" value="{{ $payment['member_id'] }}" x-model="selectedMembers" class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                            </td>
                            <td class="px-4 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                                        {{ strtoupper(substr($payment['member_name'] ?? 'U', 0, 1)) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ $payment['member_name'] ?? 'Unknown' }}</p>
                                        <p class="text-sm text-gray-500">{{ $payment['phone'] ?? '' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-sm text-gray-900">
                                #{{ $payment['position'] ?? 'N/A' }}
                            </td>
                            <td class="px-4 py-4">
                                @if($payment['paid_today'] ?? false)
                                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        Paid
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                                        </svg>
                                        Pending
                                    </span>
                                @endif
                            </td>
                            <td class="px-4 py-4 text-sm font-medium text-gray-900">
                                {{ number_format($payment['total_paid'] ?? 0) }}
                            </td>
                            <td class="px-4 py-4 text-right">
                                @if(!($payment['paid_today'] ?? false))
                                    <form method="POST" action="{{ route('collector.payments.mark-paid', $group) }}" class="inline">
                                        @csrf
                                        <input type="hidden" name="member_id" value="{{ $payment['member_id'] }}">
                                        <input type="hidden" name="amount" value="{{ $group->contribution_amount }}">
                                        <button type="submit" class="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                            Mark Paid
                                        </button>
                                    </form>
                                @else
                                    <form method="POST" action="{{ route('collector.payments.mark-pending', $group) }}" class="inline">
                                        @csrf
                                        <input type="hidden" name="member_id" value="{{ $payment['member_id'] }}">
                                        <button type="submit" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition">
                                            Undo
                                        </button>
                                    </form>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-4 py-12 text-center text-gray-500">
                                No members in this group yet
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

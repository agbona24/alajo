@extends('layouts.admin')

@section('title', 'Digital Cashbook')
@section('page-title', 'Digital Cashbook')

@section('content')
<div class="space-y-6">
    <!-- Header with Month Selector -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Digital Cashbook</h2>
            <p class="text-gray-500">Track all member contributions at a glance</p>
        </div>
        <form method="GET" class="flex items-center gap-3">
            <select name="month" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                @foreach(range(1, 12) as $m)
                    <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }}>
                        {{ \Carbon\Carbon::create()->month($m)->format('F') }}
                    </option>
                @endforeach
            </select>
            <select name="year" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                @foreach(range(now()->year - 2, now()->year + 1) as $y)
                    <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }}>{{ $y }}</option>
                @endforeach
            </select>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                View
            </button>
        </form>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Total Collected</span>
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-green-600">{{ number_format($totalCollected) }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ \Carbon\Carbon::create($year, $month)->format('F Y') }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Active Members</span>
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ $totalMembers }}</p>
            <p class="text-sm text-gray-500 mt-1">With active daily plans</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-500">Avg. Payment Rate</span>
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-bold text-blue-600">{{ number_format($avgPaymentRate, 1) }}%</p>
            <p class="text-sm text-gray-500 mt-1">Consistency rate</p>
        </div>
    </div>

    <!-- Cashbook Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">{{ \Carbon\Carbon::create($year, $month)->format('F Y') }} Cashbook</h3>
            <span class="text-sm text-gray-500">{{ $daysInMonth }} days</span>
        </div>

        @if(count($cashbookData) > 0)
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="sticky left-0 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 border-r">Member</th>
                            <th class="px-4 py-3 text-left font-semibold text-gray-700 border-r">Plan</th>
                            @for($day = 1; $day <= $daysInMonth; $day++)
                                <th class="px-2 py-3 text-center font-semibold text-gray-700 min-w-[40px]">
                                    {{ $day }}
                                </th>
                            @endfor
                            <th class="px-4 py-3 text-right font-semibold text-gray-700 border-l">Total</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-700">Days</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($cashbookData as $row)
                            <tr class="hover:bg-gray-50">
                                <td class="sticky left-0 bg-white px-4 py-3 border-r">
                                    <a href="{{ route('admin.cashbook.show', $row['user']) }}" class="flex items-center gap-3 hover:text-purple-600">
                                        <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                                            {{ strtoupper(substr($row['user']->name, 0, 1)) }}
                                        </div>
                                        <span class="font-medium text-gray-900">{{ $row['user']->name }}</span>
                                    </a>
                                </td>
                                <td class="px-4 py-3 border-r">
                                    <span class="text-gray-600">{{ Str::limit($row['plan']->name, 15) }}</span>
                                </td>
                                @for($day = 1; $day <= $daysInMonth; $day++)
                                    @php $status = $row['daily_status'][$day]['status']; @endphp
                                    <td class="px-1 py-2 text-center">
                                        @if($status === 'paid')
                                            <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-green-100 text-green-600" title="Paid">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                </svg>
                                            </span>
                                        @elseif($status === 'missed')
                                            <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-600" title="Missed">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                                </svg>
                                            </span>
                                        @else
                                            <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-gray-100 text-gray-400" title="Pending">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </span>
                                        @endif
                                    </td>
                                @endfor
                                <td class="px-4 py-3 text-right font-semibold text-green-600 border-l">
                                    {{ number_format($row['total_paid']) }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full {{ $row['days_paid'] >= ($daysInMonth * 0.7) ? 'bg-green-100 text-green-700' : ($row['days_paid'] >= ($daysInMonth * 0.4) ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700') }}">
                                        {{ $row['days_paid'] }}/{{ $daysInMonth }}
                                    </span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="p-12 text-center">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Cashbook Records</h3>
                <p class="text-gray-500">No members with active daily savings plans found for this month.</p>
            </div>
        @endif
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 class="font-medium text-gray-900 mb-3">Legend</h4>
        <div class="flex items-center gap-6 flex-wrap">
            <div class="flex items-center gap-2">
                <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                </span>
                <span class="text-sm text-gray-600">Paid</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </span>
                <span class="text-sm text-gray-600">Missed</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="inline-flex w-6 h-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </span>
                <span class="text-sm text-gray-600">Pending/No Record</span>
            </div>
        </div>
    </div>
</div>
@endsection

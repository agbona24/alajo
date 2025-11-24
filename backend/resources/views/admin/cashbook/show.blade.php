@extends('layouts.admin')

@section('title', $user->name . ' - Cashbook')
@section('page-title', 'Member Cashbook')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="{{ route('admin.cashbook.index', ['month' => $month, 'year' => $year]) }}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                    {{ strtoupper(substr($user->name, 0, 2)) }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ $user->name }}</h2>
                    <p class="text-gray-500">{{ $user->phone ?? $user->email }}</p>
                </div>
            </div>
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

    @forelse($planData as $data)
        @php $plan = $data['plan']; @endphp
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Plan Header -->
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                            {{ $plan->emoji ?? '💰' }}
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">{{ $plan->name }}</h3>
                            <p class="text-gray-500">Daily Contribution: {{ number_format($plan->daily_contribution) }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Completion Rate</p>
                        <p class="text-2xl font-bold {{ $data['completion_rate'] >= 70 ? 'text-green-600' : ($data['completion_rate'] >= 40 ? 'text-yellow-600' : 'text-red-600') }}">
                            {{ number_format($data['completion_rate'], 1) }}%
                        </p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-4 gap-4 mt-6">
                    <div class="bg-white rounded-lg p-3 text-center">
                        <p class="text-sm text-gray-500">Days Paid</p>
                        <p class="text-xl font-bold text-green-600">{{ $data['days_paid'] }}</p>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <p class="text-sm text-gray-500">Days Remaining</p>
                        <p class="text-xl font-bold text-gray-900">{{ $daysInMonth - $data['days_paid'] }}</p>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <p class="text-sm text-gray-500">Total Paid</p>
                        <p class="text-xl font-bold text-green-600">{{ number_format($data['total_paid']) }}</p>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                        <p class="text-sm text-gray-500">Expected</p>
                        <p class="text-xl font-bold text-gray-600">{{ number_format($data['expected_total']) }}</p>
                    </div>
                </div>
            </div>

            <!-- Cashbook Grid -->
            <div class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4">{{ \Carbon\Carbon::create($year, $month)->format('F Y') }} Cashbook</h4>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b">Day</th>
                                <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b">Date</th>
                                <th class="px-3 py-2 text-right font-semibold text-gray-700 border-b">Amount</th>
                                <th class="px-3 py-2 text-center font-semibold text-gray-700 border-b">Status</th>
                                <th class="px-3 py-2 text-center font-semibold text-gray-700 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for($day = 1; $day <= $daysInMonth; $day++)
                                @php
                                    $dayData = $data['daily_status'][$day];
                                    $isPaid = $dayData['status'] === 'paid';
                                    $isFuture = $dayData['date']->isFuture();
                                @endphp
                                <tr class="border-b border-gray-100 {{ $isPaid ? 'bg-green-50' : ($isFuture ? 'bg-gray-50' : 'hover:bg-gray-50') }}">
                                    <td class="px-3 py-3 font-semibold text-gray-900">{{ $day }}</td>
                                    <td class="px-3 py-3 text-gray-600">
                                        {{ $dayData['date']->format('D, M d') }}
                                    </td>
                                    <td class="px-3 py-3 text-right {{ $isPaid ? 'text-green-600 font-bold' : 'text-gray-400' }}">
                                        {{ $isPaid ? number_format($dayData['amount']) : '-' }}
                                    </td>
                                    <td class="px-3 py-3 text-center">
                                        @if($isPaid)
                                            <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                </svg>
                                                Paid
                                            </span>
                                        @elseif($isFuture)
                                            <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                                Upcoming
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                                </svg>
                                                Missed
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-3 py-3 text-center">
                                        @if($isPaid && $dayData['record'])
                                            <form method="POST" action="{{ route('admin.cashbook.mark-unpaid', $user) }}" class="inline">
                                                @csrf
                                                <input type="hidden" name="record_id" value="{{ $dayData['record']->id }}">
                                                <button type="submit" class="text-red-600 hover:text-red-700 text-xs font-medium" onclick="return confirm('Mark this day as unpaid?')">
                                                    Undo
                                                </button>
                                            </form>
                                        @elseif(!$isFuture)
                                            <form method="POST" action="{{ route('admin.cashbook.mark-paid', $user) }}" class="inline">
                                                @csrf
                                                <input type="hidden" name="plan_id" value="{{ $plan->id }}">
                                                <input type="hidden" name="day" value="{{ $day }}">
                                                <input type="hidden" name="month" value="{{ $month }}">
                                                <input type="hidden" name="year" value="{{ $year }}">
                                                <input type="hidden" name="amount" value="{{ $plan->daily_contribution }}">
                                                <button type="submit" class="text-green-600 hover:text-green-700 text-xs font-medium">
                                                    Mark Paid
                                                </button>
                                            </form>
                                        @endif
                                    </td>
                                </tr>
                            @endfor
                        </tbody>
                        <tfoot>
                            <tr class="bg-purple-50 font-bold">
                                <td colspan="2" class="px-3 py-3 text-gray-900">TOTAL</td>
                                <td class="px-3 py-3 text-right text-green-600 text-lg">{{ number_format($data['total_paid']) }}</td>
                                <td colspan="2" class="px-3 py-3 text-center text-gray-600">
                                    {{ $data['days_paid'] }} days paid
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    @empty
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Daily Plans</h3>
            <p class="text-gray-500">This member doesn't have any active daily savings plans.</p>
        </div>
    @endforelse
</div>
@endsection

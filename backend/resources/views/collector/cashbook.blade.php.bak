@extends('layouts.app')

@section('title', 'Daily Cashbook')
@section('nav-title', 'Cashbook')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" x-data="cashbook()">
    <!-- Header -->
    <div class="mb-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Daily Cashbook</h1>
                <p class="text-gray-600 mt-1">{{ $group->name }} - {{ $currentMonth }}</p>
            </div>
            <a href="{{ route('collector.dashboard') }}" class="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition">
                ← Back to Dashboard
            </a>
        </div>
    </div>

    <!-- Summary Card -->
    <div class="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
                <div class="text-sm text-white/80 mb-1">Daily Amount</div>
                <div class="text-3xl font-bold">₦{{ number_format($group->contribution_amount, 0) }}</div>
                <div class="text-sm text-white/90 mt-1">per member per day</div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Total Members</div>
                <div class="text-3xl font-bold">{{ $members->count() }}</div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Daily Target</div>
                <div class="text-3xl font-bold">₦{{ number_format($group->contribution_amount * $members->count(), 0) }}</div>
            </div>
            <div>
                <div class="text-sm text-white/80 mb-1">Month Target</div>
                <div class="text-3xl font-bold">₦{{ number_format($group->contribution_amount * $members->count() * $daysInMonth, 0) }}</div>
            </div>
        </div>
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div class="flex flex-wrap items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-green-500 rounded"></div>
                <span class="text-gray-700 font-medium">Paid</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                <span class="text-gray-700 font-medium">Unpaid</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-blue-500 rounded ring-2 ring-blue-600 ring-offset-2"></div>
                <span class="text-gray-700 font-medium">Today</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gray-200 rounded"></div>
                <span class="text-gray-700 font-medium">Future</span>
            </div>
        </div>
    </div>

    <!-- Members Cashbook -->
    <div class="space-y-6">
        @foreach($members as $member)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Member Header -->
                <div class="p-6 cursor-pointer hover:bg-gray-50 transition" @click="toggleMember({{ $member['id'] }})">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
                                {{ substr($member['name'], 0, 1) }}
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ $member['name'] }}</h3>
                                <div class="text-sm text-gray-600">
                                    <span class="font-semibold" x-text="getPaidDays({{ $member['id'] }})">0</span>/{{ $daysInMonth }} days •
                                    <span class="font-semibold">₦<span x-text="getTotalPaid({{ $member['id'] }})">0</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <div class="text-3xl font-bold text-green-600" x-text="getPercentage({{ $member['id'] }})">0%</div>
                                <div class="text-xs text-gray-500">paid</div>
                            </div>
                            <div class="text-xl text-gray-400" x-text="expandedMember === {{ $member['id'] }} ? '▼' : '▶'"></div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all" :style="'width: ' + getPercentage({{ $member['id'] }})"></div>
                    </div>
                </div>

                <!-- Payment Grid -->
                <div x-show="expandedMember === {{ $member['id'] }}" x-cloak class="p-6 bg-gray-50 border-t border-gray-200">
                    <!-- Day Grid -->
                    <div class="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2 mb-4">
                        @foreach($member['payments'] as $payment)
                            @php
                                $isToday = $payment['day'] == now()->day;
                                $isFuture = $payment['day'] > now()->day;
                            @endphp
                            <button
                                @if(!$isFuture)
                                    @click="togglePayment({{ $member['id'] }}, {{ $payment['day'] }})"
                                @endif
                                :class="{
                                    'bg-green-500 text-white shadow-sm': payments[{{ $member['id'] }}]?.[{{ $payment['day'] }}],
                                    'bg-gray-200 text-gray-400 cursor-not-allowed': {{ $isFuture ? 'true' : 'false' }},
                                    'bg-blue-500 text-white ring-2 ring-blue-600 ring-offset-2': {{ $isToday ? 'true' : 'false' }} && !payments[{{ $member['id'] }}]?.[{{ $payment['day'] }}],
                                    'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50': !{{ $isFuture ? 'true' : 'false' }} && !{{ $isToday ? 'true' : 'false' }} && !payments[{{ $member['id'] }}]?.[{{ $payment['day'] }}]
                                }"
                                class="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition active:scale-95"
                                {{ $isFuture ? 'disabled' : '' }}
                            >
                                <div>{{ $payment['day'] }}</div>
                                <div x-show="payments[{{ $member['id'] }}]?.[{{ $payment['day'] }}]" class="text-lg mt-1">✓</div>
                            </button>
                        @endforeach
                    </div>

                    <!-- Quick Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            @click="markAllUpToToday({{ $member['id'] }})"
                            class="py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                        >
                            ✓ Mark All Up to Today
                        </button>
                        <button
                            @click="markCurrentWeek({{ $member['id'] }})"
                            class="py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                        >
                            📅 Mark This Week
                        </button>
                        <button
                            @click="sendSummary({{ $member['id'] }})"
                            class="py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
                        >
                            📤 Send Summary
                        </button>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <!-- Overall Summary -->
    <div class="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Overall Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
                <div class="text-3xl mb-2">👥</div>
                <div class="text-sm text-gray-600 mb-1">Total Members</div>
                <div class="text-2xl font-bold text-gray-900">{{ $members->count() }}</div>
            </div>
            <div class="text-center">
                <div class="text-3xl mb-2">💰</div>
                <div class="text-sm text-gray-600 mb-1">Expected/Day</div>
                <div class="text-2xl font-bold text-gray-900">₦{{ number_format($group->contribution_amount * $members->count(), 0) }}</div>
            </div>
            <div class="text-center">
                <div class="text-3xl mb-2">📅</div>
                <div class="text-sm text-gray-600 mb-1">Total Days</div>
                <div class="text-2xl font-bold text-gray-900">{{ $daysInMonth }}</div>
            </div>
            <div class="text-center">
                <div class="text-3xl mb-2">💵</div>
                <div class="text-sm text-gray-600 mb-1">Month Target</div>
                <div class="text-2xl font-bold text-gray-900">₦{{ number_format($group->contribution_amount * $members->count() * $daysInMonth, 0) }}</div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function cashbook() {
        return {
            expandedMember: null,
            payments: {},
            groupId: {{ $group->id }},
            dailyAmount: {{ $group->contribution_amount }},
            totalDays: {{ $daysInMonth }},

            init() {
                // Initialize payments object for all members
                @foreach($members as $member)
                    this.payments[{{ $member['id'] }}] = {};
                @endforeach
            },

            toggleMember(memberId) {
                this.expandedMember = this.expandedMember === memberId ? null : memberId;
            },

            togglePayment(memberId, day) {
                if (!this.payments[memberId]) {
                    this.payments[memberId] = {};
                }
                this.payments[memberId][day] = !this.payments[memberId][day];

                // Save to server
                this.savePayment(memberId, day, this.payments[memberId][day]);
            },

            markAllUpToToday(memberId) {
                const today = new Date().getDate();
                if (!this.payments[memberId]) {
                    this.payments[memberId] = {};
                }
                for (let day = 1; day <= today; day++) {
                    this.payments[memberId][day] = true;
                    this.savePayment(memberId, day, true);
                }
            },

            markCurrentWeek(memberId) {
                const today = new Date();
                const dayOfWeek = today.getDay(); // 0 = Sunday
                const startOfWeek = today.getDate() - dayOfWeek;
                const endOfWeek = startOfWeek + 6;

                if (!this.payments[memberId]) {
                    this.payments[memberId] = {};
                }
                for (let day = Math.max(1, startOfWeek); day <= Math.min(this.totalDays, endOfWeek); day++) {
                    this.payments[memberId][day] = true;
                    this.savePayment(memberId, day, true);
                }
            },

            getPaidDays(memberId) {
                if (!this.payments[memberId]) return 0;
                return Object.values(this.payments[memberId]).filter(Boolean).length;
            },

            getTotalPaid(memberId) {
                return this.getPaidDays(memberId) * this.dailyAmount;
            },

            getPercentage(memberId) {
                const percentage = (this.getPaidDays(memberId) / this.totalDays) * 100;
                return Math.round(percentage) + '%';
            },

            savePayment(memberId, day, isPaid) {
                fetch('{{ route("collector.mark-payment", $group->id) }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        member_id: memberId,
                        day: day,
                        is_paid: isPaid
                    })
                }).catch(err => console.error('Error saving payment:', err));
            },

            sendSummary(memberId) {
                alert('Payment summary will be sent via SMS/WhatsApp');
            }
        }
    }
</script>
@endpush

@extends('layouts.admin')

@section('title', 'Commission Settings')
@section('page-title', 'Commission Settings')

@section('content')
<div class="max-w-4xl">
    <!-- Settings Navigation Tabs -->
    <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
            <a href="{{ route('admin.settings.general') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                General
            </a>
            <a href="{{ route('admin.settings.smtp') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                SMTP / Email
            </a>
            <a href="{{ route('admin.settings.currency') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Currency
            </a>
            <a href="{{ route('admin.settings.notifications') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Notifications
            </a>
            <a href="{{ route('admin.settings.commissions') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Commissions
            </a>
        </nav>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Commission & Fee Settings</h3>
            <p class="text-sm text-gray-500 mt-1">Configure commission rates and platform fees.</p>
        </div>

        <form action="{{ route('admin.settings.commissions.update') }}" method="POST" class="p-6 space-y-6">
            @csrf

            <!-- Commission Rates -->
            <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Commission Rates</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="default_commission_rate" class="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
                        <div class="relative">
                            <input type="number" name="default_commission_rate" id="default_commission_rate"
                                value="{{ $settings['default_commission_rate'] ?? '10' }}"
                                step="0.01" min="0" max="100"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">Applied to completed savings cycles</p>
                    </div>

                    <div>
                        <label for="collector_commission_rate" class="block text-sm font-medium text-gray-700 mb-2">Collector Commission Rate (%)</label>
                        <div class="relative">
                            <input type="number" name="collector_commission_rate" id="collector_commission_rate"
                                value="{{ $settings['collector_commission_rate'] ?? '5' }}"
                                step="0.01" min="0" max="100"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">Earnings rate for collectors</p>
                    </div>
                </div>
            </div>

            <!-- Platform Fees -->
            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Platform Fees</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="platform_fee_rate" class="block text-sm font-medium text-gray-700 mb-2">Platform Fee Rate (%)</label>
                        <div class="relative">
                            <input type="number" name="platform_fee_rate" id="platform_fee_rate"
                                value="{{ $settings['platform_fee_rate'] ?? '2' }}"
                                step="0.01" min="0" max="100"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">Fee charged on each transaction</p>
                    </div>

                    <div>
                        <label for="withdrawal_fee" class="block text-sm font-medium text-gray-700 mb-2">Withdrawal Fee (Fixed)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                            <input type="number" name="withdrawal_fee" id="withdrawal_fee"
                                value="{{ $settings['withdrawal_fee'] ?? '50' }}"
                                step="0.01" min="0"
                                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        </div>
                        <p class="mt-1 text-sm text-gray-500">Fixed fee for each withdrawal</p>
                    </div>
                </div>
            </div>

            <!-- Withdrawal Limits -->
            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Withdrawal Limits</h4>

                <div>
                    <label for="minimum_withdrawal" class="block text-sm font-medium text-gray-700 mb-2">Minimum Withdrawal Amount</label>
                    <div class="relative max-w-xs">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                        <input type="number" name="minimum_withdrawal" id="minimum_withdrawal"
                            value="{{ $settings['minimum_withdrawal'] ?? '1000' }}"
                            step="0.01" min="0"
                            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Minimum amount users can withdraw</p>
                </div>
            </div>

            <!-- Summary Box -->
            <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h5 class="font-medium text-purple-900 mb-2">Fee Structure Summary</h5>
                <div class="text-sm text-purple-700 space-y-1">
                    <p>For a ₦10,000 payout:</p>
                    <ul class="list-disc list-inside ml-2 space-y-1">
                        <li>Platform Fee (<span id="summary-platform">2</span>%): ₦<span id="summary-platform-amount">200</span></li>
                        <li>Collector Commission (<span id="summary-collector">5</span>%): ₦<span id="summary-collector-amount">500</span></li>
                        <li>Withdrawal Fee: ₦<span id="summary-withdrawal">50</span></li>
                        <li class="font-semibold">Net to User: ₦<span id="summary-net">9,250</span></li>
                    </ul>
                </div>
            </div>

            <div class="flex items-center justify-end pt-4 border-t border-gray-200">
                <button type="submit" class="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
                    Save Settings
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function updateSummary() {
    const base = 10000;
    const platformRate = parseFloat(document.getElementById('platform_fee_rate').value) || 0;
    const collectorRate = parseFloat(document.getElementById('collector_commission_rate').value) || 0;
    const withdrawalFee = parseFloat(document.getElementById('withdrawal_fee').value) || 0;

    const platformAmount = (base * platformRate / 100);
    const collectorAmount = (base * collectorRate / 100);
    const net = base - platformAmount - collectorAmount - withdrawalFee;

    document.getElementById('summary-platform').textContent = platformRate;
    document.getElementById('summary-collector').textContent = collectorRate;
    document.getElementById('summary-withdrawal').textContent = withdrawalFee.toLocaleString();
    document.getElementById('summary-platform-amount').textContent = platformAmount.toLocaleString();
    document.getElementById('summary-collector-amount').textContent = collectorAmount.toLocaleString();
    document.getElementById('summary-net').textContent = net.toLocaleString();
}

document.getElementById('platform_fee_rate').addEventListener('input', updateSummary);
document.getElementById('collector_commission_rate').addEventListener('input', updateSummary);
document.getElementById('withdrawal_fee').addEventListener('input', updateSummary);

// Initial update
updateSummary();
</script>
@endpush
@endsection

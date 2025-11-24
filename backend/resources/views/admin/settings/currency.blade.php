@extends('layouts.admin')

@section('title', 'Currency Settings')
@section('page-title', 'Currency Settings')

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
            <a href="{{ route('admin.settings.currency') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Currency
            </a>
            <a href="{{ route('admin.settings.notifications') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Notifications
            </a>
            <a href="{{ route('admin.settings.commissions') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Commissions
            </a>
        </nav>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Currency Configuration</h3>
            <p class="text-sm text-gray-500 mt-1">Configure how currency values are displayed throughout the platform.</p>
        </div>

        <form action="{{ route('admin.settings.currency.update') }}" method="POST" class="p-6 space-y-6">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="default_currency" class="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                    <select name="default_currency" id="default_currency"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        onchange="updateCurrencySymbol(this)">
                        @foreach($currencies as $currency)
                            <option value="{{ $currency['code'] }}"
                                data-symbol="{{ $currency['symbol'] }}"
                                {{ ($settings['default_currency'] ?? 'NGN') == $currency['code'] ? 'selected' : '' }}>
                                {{ $currency['name'] }} ({{ $currency['code'] }})
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label for="currency_symbol" class="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                    <input type="text" name="currency_symbol" id="currency_symbol" value="{{ $settings['currency_symbol'] ?? '₦' }}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>
            </div>

            <div>
                <label for="currency_position" class="block text-sm font-medium text-gray-700 mb-2">Symbol Position</label>
                <div class="flex items-center space-x-6">
                    <label class="flex items-center">
                        <input type="radio" name="currency_position" value="before"
                            {{ ($settings['currency_position'] ?? 'before') == 'before' ? 'checked' : '' }}
                            class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-700">Before amount (e.g., $100.00)</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="currency_position" value="after"
                            {{ ($settings['currency_position'] ?? '') == 'after' ? 'checked' : '' }}
                            class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-700">After amount (e.g., 100.00$)</span>
                    </label>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Number Formatting</h4>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label for="thousand_separator" class="block text-sm font-medium text-gray-700 mb-2">Thousand Separator</label>
                        <select name="thousand_separator" id="thousand_separator"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="," {{ ($settings['thousand_separator'] ?? ',') == ',' ? 'selected' : '' }}>Comma (,)</option>
                            <option value="." {{ ($settings['thousand_separator'] ?? '') == '.' ? 'selected' : '' }}>Period (.)</option>
                            <option value=" " {{ ($settings['thousand_separator'] ?? '') == ' ' ? 'selected' : '' }}>Space ( )</option>
                        </select>
                    </div>

                    <div>
                        <label for="decimal_separator" class="block text-sm font-medium text-gray-700 mb-2">Decimal Separator</label>
                        <select name="decimal_separator" id="decimal_separator"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="." {{ ($settings['decimal_separator'] ?? '.') == '.' ? 'selected' : '' }}>Period (.)</option>
                            <option value="," {{ ($settings['decimal_separator'] ?? '') == ',' ? 'selected' : '' }}>Comma (,)</option>
                        </select>
                    </div>

                    <div>
                        <label for="decimal_places" class="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
                        <select name="decimal_places" id="decimal_places"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="0" {{ ($settings['decimal_places'] ?? '') == '0' ? 'selected' : '' }}>0</option>
                            <option value="2" {{ ($settings['decimal_places'] ?? '2') == '2' ? 'selected' : '' }}>2</option>
                            <option value="3" {{ ($settings['decimal_places'] ?? '') == '3' ? 'selected' : '' }}>3</option>
                            <option value="4" {{ ($settings['decimal_places'] ?? '') == '4' ? 'selected' : '' }}>4</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Preview -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <p class="text-2xl font-bold text-gray-900" id="currency-preview">₦1,234,567.00</p>
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
function updateCurrencySymbol(select) {
    const selectedOption = select.options[select.selectedIndex];
    const symbol = selectedOption.getAttribute('data-symbol');
    document.getElementById('currency_symbol').value = symbol;
    updatePreview();
}

function updatePreview() {
    const symbol = document.getElementById('currency_symbol').value;
    const position = document.querySelector('input[name="currency_position"]:checked').value;
    const thousandSep = document.getElementById('thousand_separator').value;
    const decimalSep = document.getElementById('decimal_separator').value;
    const decimalPlaces = parseInt(document.getElementById('decimal_places').value);

    let amount = '1234567';
    let formatted = amount.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
    if (decimalPlaces > 0) {
        formatted += decimalSep + '0'.repeat(decimalPlaces);
    }

    const preview = position === 'before' ? symbol + formatted : formatted + symbol;
    document.getElementById('currency-preview').textContent = preview;
}

// Add event listeners
document.getElementById('currency_symbol').addEventListener('input', updatePreview);
document.getElementById('thousand_separator').addEventListener('change', updatePreview);
document.getElementById('decimal_separator').addEventListener('change', updatePreview);
document.getElementById('decimal_places').addEventListener('change', updatePreview);
document.querySelectorAll('input[name="currency_position"]').forEach(el => {
    el.addEventListener('change', updatePreview);
});
</script>
@endpush
@endsection

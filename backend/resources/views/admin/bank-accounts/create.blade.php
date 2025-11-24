@extends('layouts.admin')

@section('title', 'Add Bank Account')
@section('page-title', 'Add Bank Account')

@section('content')
<div class="max-w-2xl">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form method="POST" action="{{ route('admin.bank-accounts.store') }}">
            @csrf

            <div class="space-y-6">
                <div>
                    <label for="bank_name" class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <select name="bank_name" id="bank_name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Select Bank</option>
                        <option value="Access Bank" {{ old('bank_name') === 'Access Bank' ? 'selected' : '' }}>Access Bank</option>
                        <option value="Citibank" {{ old('bank_name') === 'Citibank' ? 'selected' : '' }}>Citibank</option>
                        <option value="Ecobank" {{ old('bank_name') === 'Ecobank' ? 'selected' : '' }}>Ecobank</option>
                        <option value="Fidelity Bank" {{ old('bank_name') === 'Fidelity Bank' ? 'selected' : '' }}>Fidelity Bank</option>
                        <option value="First Bank of Nigeria" {{ old('bank_name') === 'First Bank of Nigeria' ? 'selected' : '' }}>First Bank of Nigeria</option>
                        <option value="First City Monument Bank" {{ old('bank_name') === 'First City Monument Bank' ? 'selected' : '' }}>First City Monument Bank (FCMB)</option>
                        <option value="Guaranty Trust Bank" {{ old('bank_name') === 'Guaranty Trust Bank' ? 'selected' : '' }}>Guaranty Trust Bank (GTBank)</option>
                        <option value="Heritage Bank" {{ old('bank_name') === 'Heritage Bank' ? 'selected' : '' }}>Heritage Bank</option>
                        <option value="Keystone Bank" {{ old('bank_name') === 'Keystone Bank' ? 'selected' : '' }}>Keystone Bank</option>
                        <option value="Polaris Bank" {{ old('bank_name') === 'Polaris Bank' ? 'selected' : '' }}>Polaris Bank</option>
                        <option value="Stanbic IBTC Bank" {{ old('bank_name') === 'Stanbic IBTC Bank' ? 'selected' : '' }}>Stanbic IBTC Bank</option>
                        <option value="Standard Chartered Bank" {{ old('bank_name') === 'Standard Chartered Bank' ? 'selected' : '' }}>Standard Chartered Bank</option>
                        <option value="Sterling Bank" {{ old('bank_name') === 'Sterling Bank' ? 'selected' : '' }}>Sterling Bank</option>
                        <option value="Union Bank" {{ old('bank_name') === 'Union Bank' ? 'selected' : '' }}>Union Bank</option>
                        <option value="United Bank for Africa" {{ old('bank_name') === 'United Bank for Africa' ? 'selected' : '' }}>United Bank for Africa (UBA)</option>
                        <option value="Unity Bank" {{ old('bank_name') === 'Unity Bank' ? 'selected' : '' }}>Unity Bank</option>
                        <option value="Wema Bank" {{ old('bank_name') === 'Wema Bank' ? 'selected' : '' }}>Wema Bank</option>
                        <option value="Zenith Bank" {{ old('bank_name') === 'Zenith Bank' ? 'selected' : '' }}>Zenith Bank</option>
                        <option value="Kuda Bank" {{ old('bank_name') === 'Kuda Bank' ? 'selected' : '' }}>Kuda Bank</option>
                        <option value="Opay" {{ old('bank_name') === 'Opay' ? 'selected' : '' }}>Opay</option>
                        <option value="PalmPay" {{ old('bank_name') === 'PalmPay' ? 'selected' : '' }}>PalmPay</option>
                        <option value="Moniepoint" {{ old('bank_name') === 'Moniepoint' ? 'selected' : '' }}>Moniepoint</option>
                    </select>
                    @error('bank_name')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label for="bank_code" class="block text-sm font-medium text-gray-700 mb-1">Bank Code</label>
                    <input type="text" name="bank_code" id="bank_code" value="{{ old('bank_code') }}" placeholder="e.g., 058" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <p class="mt-1 text-xs text-gray-500">Optional: Bank code for integration purposes</p>
                    @error('bank_code')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label for="account_name" class="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input type="text" name="account_name" id="account_name" value="{{ old('account_name') }}" required placeholder="e.g., Alajo Savings Limited" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    @error('account_name')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label for="account_number" class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input type="text" name="account_number" id="account_number" value="{{ old('account_number') }}" required placeholder="e.g., 0123456789" pattern="[0-9]{10}" maxlength="10" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <p class="mt-1 text-xs text-gray-500">10-digit account number</p>
                    @error('account_number')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea name="description" id="description" rows="2" placeholder="e.g., Primary collection account" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">{{ old('description') }}</textarea>
                    @error('description')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                </div>

                <div class="flex items-center gap-6">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }} class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" name="is_primary" value="1" {{ old('is_primary') ? 'checked' : '' }} class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-700">Set as Primary Account</span>
                    </label>
                </div>
            </div>

            <div class="mt-8 flex items-center gap-4">
                <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Add Bank Account</button>
                <a href="{{ route('admin.bank-accounts.index') }}" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection

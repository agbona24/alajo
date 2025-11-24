@extends('layouts.admin')

@section('title', 'Bank Accounts')
@section('page-title', 'Platform Bank Accounts')

@section('content')
<div x-data="{ showCreate: false }" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Bank Accounts</h2>
            <p class="text-gray-500">Manage platform bank accounts for receiving payments</p>
        </div>
        <button @click="showCreate = true" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Bank Account
        </button>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Bank Account Information</h3>
                <p class="text-sm text-blue-700 mt-1">These bank accounts will be displayed to users when they choose to make contributions via bank transfer. Make sure account details are accurate.</p>
            </div>
        </div>
    </div>

    <!-- Bank Accounts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($accounts as $account)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden {{ $account->is_primary ? 'ring-2 ring-purple-500' : '' }}">
                @if($account->is_primary)
                    <div class="bg-purple-600 text-white text-center py-1 text-sm font-medium">Primary Account</div>
                @endif
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $account->is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                            {{ $account->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <h3 class="font-semibold text-gray-900 text-lg mb-1">{{ $account->bank_name }}</h3>
                    <p class="text-gray-600 mb-4">{{ $account->account_name }}</p>

                    <div class="bg-gray-50 rounded-lg p-3 mb-4">
                        <p class="text-sm text-gray-500">Account Number</p>
                        <p class="font-mono text-lg font-semibold text-gray-900">{{ $account->account_number }}</p>
                    </div>

                    @if($account->description)
                        <p class="text-sm text-gray-500 mb-4">{{ $account->description }}</p>
                    @endif

                    <div class="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <a href="{{ route('admin.bank-accounts.edit', $account) }}" class="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-200 transition">Edit</a>
                        @if(!$account->is_primary)
                            <form method="POST" action="{{ route('admin.bank-accounts.set-primary', $account) }}" class="flex-1">
                                @csrf
                                <button type="submit" class="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">Set Primary</button>
                            </form>
                        @endif
                        @if($account->is_active)
                            <form method="POST" action="{{ route('admin.bank-accounts.toggle', $account) }}" class="inline">
                                @csrf
                                <button type="submit" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Deactivate">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                    </svg>
                                </button>
                            </form>
                        @else
                            <form method="POST" action="{{ route('admin.bank-accounts.toggle', $account) }}" class="inline">
                                @csrf
                                <button type="submit" class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Activate">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </button>
                            </form>
                        @endif
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No Bank Accounts</h3>
                    <p class="text-gray-500 mb-4">Get started by adding your first platform bank account.</p>
                    <button @click="showCreate = true" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Bank Account
                    </button>
                </div>
            </div>
        @endforelse
    </div>

    <!-- Create Bank Account Slideout -->
    <div x-show="showCreate" x-cloak class="fixed inset-0 z-50 overflow-hidden">
        <div x-show="showCreate" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="absolute inset-0 bg-black/50" @click="showCreate = false"></div>
        <div x-show="showCreate" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full" class="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Add Bank Account</h3>
                <button @click="showCreate = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
                <form method="POST" action="{{ route('admin.bank-accounts.store') }}" class="space-y-6">
                    @csrf

                    <div>
                        <label for="bank_name" class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <select name="bank_name" id="bank_name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="">Select Bank</option>
                            <option value="Access Bank">Access Bank</option>
                            <option value="Citibank">Citibank</option>
                            <option value="Ecobank">Ecobank</option>
                            <option value="Fidelity Bank">Fidelity Bank</option>
                            <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                            <option value="First City Monument Bank">First City Monument Bank (FCMB)</option>
                            <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTBank)</option>
                            <option value="Heritage Bank">Heritage Bank</option>
                            <option value="Keystone Bank">Keystone Bank</option>
                            <option value="Polaris Bank">Polaris Bank</option>
                            <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                            <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                            <option value="Sterling Bank">Sterling Bank</option>
                            <option value="Union Bank">Union Bank</option>
                            <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
                            <option value="Unity Bank">Unity Bank</option>
                            <option value="Wema Bank">Wema Bank</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                            <option value="Kuda Bank">Kuda Bank</option>
                            <option value="Opay">Opay</option>
                            <option value="PalmPay">PalmPay</option>
                            <option value="Moniepoint">Moniepoint</option>
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
                            <input type="checkbox" name="is_active" value="1" checked class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <span class="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_primary" value="1" class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <span class="ml-2 text-sm text-gray-700">Set as Primary Account</span>
                        </label>
                    </div>

                    <div class="flex items-center gap-4 pt-4">
                        <button type="submit" class="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Add Bank Account</button>
                        <button type="button" @click="showCreate = false" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@extends('layouts.admin')

@section('title', 'General Settings')
@section('page-title', 'General Settings')

@section('content')
<div class="max-w-4xl">
    <!-- Settings Navigation Tabs -->
    <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 overflow-x-auto">
            <a href="{{ route('admin.settings.general') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
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
            <a href="{{ route('admin.settings.commissions') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Commissions
            </a>
            <a href="{{ route('admin.settings.apk') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                APK Management
            </a>
        </nav>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Application Settings</h3>
            <p class="text-sm text-gray-500 mt-1">Configure your platform's basic information.</p>
        </div>

        <form action="{{ route('admin.settings.general.update') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-6">
            @csrf

            <!-- Branding Section -->
            <div class="pb-6 border-b border-gray-200">
                <h4 class="text-md font-semibold text-gray-900 mb-4">Branding</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- App Logo -->
                    <div>
                        <label for="app_logo" class="block text-sm font-medium text-gray-700 mb-2">Application Logo</label>
                        @if(isset($settings['app_logo']) && $settings['app_logo'])
                            <div class="mb-3">
                                <img src="{{ asset('storage/' . $settings['app_logo']) }}" alt="Current Logo" class="h-20 w-auto border border-gray-200 rounded-lg p-2 bg-white">
                                <p class="text-xs text-gray-500 mt-1">Current logo</p>
                            </div>
                        @endif
                        <input type="file" name="app_logo" id="app_logo" accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <p class="mt-1 text-sm text-gray-500">Upload a logo (JPG, PNG, SVG - Max 2MB). Recommended: 512x512px</p>
                    </div>

                    <!-- App Favicon -->
                    <div>
                        <label for="app_favicon" class="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        @if(isset($settings['app_favicon']) && $settings['app_favicon'])
                            <div class="mb-3">
                                <img src="{{ asset('storage/' . $settings['app_favicon']) }}" alt="Current Favicon" class="h-12 w-auto border border-gray-200 rounded-lg p-2 bg-white">
                                <p class="text-xs text-gray-500 mt-1">Current favicon</p>
                            </div>
                        @endif
                        <input type="file" name="app_favicon" id="app_favicon" accept="image/jpeg,image/png,image/jpg,image/x-icon,image/svg+xml"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <p class="mt-1 text-sm text-gray-500">Upload a favicon (ICO, PNG, SVG - Max 512KB). Recommended: 32x32px</p>
                    </div>
                </div>
            </div>

            <!-- General Information -->
            <div>
                <label for="app_name" class="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
                <input type="text" name="app_name" id="app_name" value="{{ $settings['app_name'] ?? 'Alajo' }}"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <p class="mt-1 text-sm text-gray-500">This name will be displayed throughout the application.</p>
            </div>

            <div>
                <label for="app_description" class="block text-sm font-medium text-gray-700 mb-2">Application Description</label>
                <textarea name="app_description" id="app_description" rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">{{ $settings['app_description'] ?? '' }}</textarea>
                <p class="mt-1 text-sm text-gray-500">A brief description of your platform.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="support_email" class="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input type="email" name="support_email" id="support_email" value="{{ $settings['support_email'] ?? '' }}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>

                <div>
                    <label for="support_phone" class="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                    <input type="text" name="support_phone" id="support_phone" value="{{ $settings['support_phone'] ?? '' }}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>
            </div>

            <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                <textarea name="address" id="address" rows="2"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">{{ $settings['address'] ?? '' }}</textarea>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <form action="{{ route('admin.settings.clear-cache') }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        Clear Cache
                    </button>
                </form>

                <button type="submit" class="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
                    Save Settings
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

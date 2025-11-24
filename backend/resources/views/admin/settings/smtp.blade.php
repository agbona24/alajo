@extends('layouts.admin')

@section('title', 'SMTP Settings')
@section('page-title', 'SMTP / Email Settings')

@section('content')
<div class="max-w-4xl">
    <!-- Settings Navigation Tabs -->
    <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
            <a href="{{ route('admin.settings.general') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                General
            </a>
            <a href="{{ route('admin.settings.smtp') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
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
        </nav>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Email Configuration</h3>
            <p class="text-sm text-gray-500 mt-1">Configure your SMTP settings for sending emails.</p>
        </div>

        <form action="{{ route('admin.settings.smtp.update') }}" method="POST" class="p-6 space-y-6">
            @csrf

            <div>
                <label for="mail_mailer" class="block text-sm font-medium text-gray-700 mb-2">Mail Driver</label>
                <select name="mail_mailer" id="mail_mailer"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="smtp" {{ ($settings['mail_mailer'] ?? 'smtp') == 'smtp' ? 'selected' : '' }}>SMTP</option>
                    <option value="sendmail" {{ ($settings['mail_mailer'] ?? '') == 'sendmail' ? 'selected' : '' }}>Sendmail</option>
                    <option value="mailgun" {{ ($settings['mail_mailer'] ?? '') == 'mailgun' ? 'selected' : '' }}>Mailgun</option>
                    <option value="ses" {{ ($settings['mail_mailer'] ?? '') == 'ses' ? 'selected' : '' }}>Amazon SES</option>
                    <option value="postmark" {{ ($settings['mail_mailer'] ?? '') == 'postmark' ? 'selected' : '' }}>Postmark</option>
                </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="mail_host" class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input type="text" name="mail_host" id="mail_host" value="{{ $settings['mail_host'] ?? '' }}"
                        placeholder="smtp.example.com"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>

                <div>
                    <label for="mail_port" class="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input type="number" name="mail_port" id="mail_port" value="{{ $settings['mail_port'] ?? '587' }}"
                        placeholder="587"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="mail_username" class="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                    <input type="text" name="mail_username" id="mail_username" value="{{ $settings['mail_username'] ?? '' }}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>

                <div>
                    <label for="mail_password" class="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                    <input type="password" name="mail_password" id="mail_password" value="{{ $settings['mail_password'] ?? '' }}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>
            </div>

            <div>
                <label for="mail_encryption" class="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                <select name="mail_encryption" id="mail_encryption"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="tls" {{ ($settings['mail_encryption'] ?? 'tls') == 'tls' ? 'selected' : '' }}>TLS</option>
                    <option value="ssl" {{ ($settings['mail_encryption'] ?? '') == 'ssl' ? 'selected' : '' }}>SSL</option>
                    <option value="null" {{ ($settings['mail_encryption'] ?? '') == 'null' ? 'selected' : '' }}>None</option>
                </select>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Sender Information</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="mail_from_address" class="block text-sm font-medium text-gray-700 mb-2">From Email Address</label>
                        <input type="email" name="mail_from_address" id="mail_from_address" value="{{ $settings['mail_from_address'] ?? '' }}"
                            placeholder="noreply@example.com"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>

                    <div>
                        <label for="mail_from_name" class="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                        <input type="text" name="mail_from_name" id="mail_from_name" value="{{ $settings['mail_from_name'] ?? '' }}"
                            placeholder="Alajo Platform"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <button type="submit" class="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
                    Save Settings
                </button>
            </div>
        </form>
    </div>

    <!-- Test Email Section -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Test Email Configuration</h3>
            <p class="text-sm text-gray-500 mt-1">Send a test email to verify your SMTP settings are working.</p>
        </div>

        <form action="{{ route('admin.settings.smtp.test') }}" method="POST" class="p-6">
            @csrf
            <div class="flex items-end gap-4">
                <div class="flex-1">
                    <label for="test_email" class="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
                    <input type="email" name="test_email" id="test_email" required
                        placeholder="test@example.com"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>
                <button type="submit" class="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">
                    Send Test Email
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

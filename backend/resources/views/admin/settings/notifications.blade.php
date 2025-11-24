@extends('layouts.admin')

@section('title', 'Notification Settings')
@section('page-title', 'Notification Settings')

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
            <a href="{{ route('admin.settings.notifications') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Notifications
            </a>
            <a href="{{ route('admin.settings.commissions') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Commissions
            </a>
        </nav>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p class="text-sm text-gray-500 mt-1">Configure how and when notifications are sent to users.</p>
        </div>

        <form action="{{ route('admin.settings.notifications.update') }}" method="POST" class="p-6 space-y-6">
            @csrf

            <!-- Notification Channels -->
            <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
                <div class="space-y-4">
                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">Email Notifications</p>
                            <p class="text-sm text-gray-500">Send notifications via email</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="email_notifications" value="0">
                            <input type="checkbox" name="email_notifications" value="1"
                                {{ ($settings['email_notifications'] ?? false) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">SMS Notifications</p>
                            <p class="text-sm text-gray-500">Send notifications via SMS (requires SMS provider)</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="sms_notifications" value="0">
                            <input type="checkbox" name="sms_notifications" value="1"
                                {{ ($settings['sms_notifications'] ?? false) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">Push Notifications</p>
                            <p class="text-sm text-gray-500">Send push notifications to mobile devices</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="push_notifications" value="0">
                            <input type="checkbox" name="push_notifications" value="1"
                                {{ ($settings['push_notifications'] ?? false) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Notification Events -->
            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Notification Events</h4>
                <p class="text-sm text-gray-500 mb-4">Choose which events should trigger notifications.</p>

                <div class="space-y-4">
                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">Payment Received</p>
                            <p class="text-sm text-gray-500">Notify when a payment is made to a group</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="notify_on_payment" value="0">
                            <input type="checkbox" name="notify_on_payment" value="1"
                                {{ ($settings['notify_on_payment'] ?? true) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">Payout Processed</p>
                            <p class="text-sm text-gray-500">Notify when a payout is made to a member</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="notify_on_payout" value="0">
                            <input type="checkbox" name="notify_on_payout" value="1"
                                {{ ($settings['notify_on_payout'] ?? true) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">New Member Joined</p>
                            <p class="text-sm text-gray-500">Notify group admins when a new member joins</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="notify_on_new_member" value="0">
                            <input type="checkbox" name="notify_on_new_member" value="1"
                                {{ ($settings['notify_on_new_member'] ?? true) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">Transfer Submitted</p>
                            <p class="text-sm text-gray-500">Notify admins when a transfer needs approval</p>
                        </div>
                        <div class="relative">
                            <input type="hidden" name="notify_on_transfer" value="0">
                            <input type="checkbox" name="notify_on_transfer" value="1"
                                {{ ($settings['notify_on_transfer'] ?? true) ? 'checked' : '' }}
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 cursor-pointer" onclick="this.previousElementSibling.click()"></div>
                        </div>
                    </label>
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
@endsection

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SettingsController extends Controller
{
    /**
     * Display settings index - redirects to general settings.
     */
    public function index()
    {
        return redirect()->route('admin.settings.general');
    }

    /**
     * General settings page.
     */
    public function general()
    {
        $settings = Setting::getByGroup('general');

        return view('admin.settings.general', compact('settings'));
    }

    /**
     * Update general settings.
     */
    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_description' => 'nullable|string',
            'support_email' => 'nullable|email',
            'support_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'app_favicon' => 'nullable|image|mimes:jpeg,png,jpg,ico,svg|max:512',
        ]);

        // Handle logo upload
        if ($request->hasFile('app_logo')) {
            $logoPath = $request->file('app_logo')->store('branding', 'public');
            Setting::set('app_logo', $logoPath, 'general');
        }

        // Handle favicon upload
        if ($request->hasFile('app_favicon')) {
            $faviconPath = $request->file('app_favicon')->store('branding', 'public');
            Setting::set('app_favicon', $faviconPath, 'general');
        }

        // Update other settings
        foreach (['app_name', 'app_description', 'support_email', 'support_phone', 'address'] as $key) {
            if (isset($validated[$key])) {
                Setting::set($key, $validated[$key], 'general');
            }
        }

        return back()->with('success', 'General settings updated successfully.');
    }

    /**
     * SMTP settings page.
     */
    public function smtp()
    {
        $settings = Setting::getByGroup('smtp');

        return view('admin.settings.smtp', compact('settings'));
    }

    /**
     * Update SMTP settings.
     */
    public function updateSmtp(Request $request)
    {
        $validated = $request->validate([
            'mail_mailer' => 'required|string|in:smtp,sendmail,mailgun,ses,postmark',
            'mail_host' => 'required_if:mail_mailer,smtp|nullable|string',
            'mail_port' => 'required_if:mail_mailer,smtp|nullable|integer',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'nullable|string|in:tls,ssl,null',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'smtp');
        }

        return back()->with('success', 'SMTP settings updated successfully.');
    }

    /**
     * Test SMTP connection.
     */
    public function testSmtp(Request $request)
    {
        $request->validate([
            'test_email' => 'required|email',
        ]);

        try {
            \Mail::raw('This is a test email from Alajo Platform.', function ($message) use ($request) {
                $message->to($request->test_email)
                    ->subject('SMTP Test Email');
            });

            return back()->with('success', 'Test email sent successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }

    /**
     * Currency settings page.
     */
    public function currency()
    {
        $settings = Setting::getByGroup('currency');

        // Available currencies
        $currencies = [
            ['code' => 'NGN', 'name' => 'Nigerian Naira', 'symbol' => '₦'],
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£'],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€'],
            ['code' => 'GHS', 'name' => 'Ghanaian Cedi', 'symbol' => '₵'],
            ['code' => 'KES', 'name' => 'Kenyan Shilling', 'symbol' => 'KSh'],
            ['code' => 'ZAR', 'name' => 'South African Rand', 'symbol' => 'R'],
        ];

        return view('admin.settings.currency', compact('settings', 'currencies'));
    }

    /**
     * Update currency settings.
     */
    public function updateCurrency(Request $request)
    {
        $validated = $request->validate([
            'default_currency' => 'required|string|size:3',
            'currency_symbol' => 'required|string|max:5',
            'currency_position' => 'required|in:before,after',
            'thousand_separator' => 'required|string|max:1',
            'decimal_separator' => 'required|string|max:1',
            'decimal_places' => 'required|integer|min:0|max:4',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'currency');
        }

        return back()->with('success', 'Currency settings updated successfully.');
    }

    /**
     * Notification settings page.
     */
    public function notifications()
    {
        $settings = Setting::getByGroup('notification');

        return view('admin.settings.notifications', compact('settings'));
    }

    /**
     * Update notification settings.
     */
    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'notify_on_payment' => 'boolean',
            'notify_on_payout' => 'boolean',
            'notify_on_new_member' => 'boolean',
            'notify_on_transfer' => 'boolean',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value ? '1' : '0', 'notification', 'boolean');
        }

        return back()->with('success', 'Notification settings updated successfully.');
    }

    /**
     * Commission settings page.
     */
    public function commissions()
    {
        $settings = Setting::getByGroup('commission');

        return view('admin.settings.commissions', compact('settings'));
    }

    /**
     * Update commission settings.
     */
    public function updateCommissions(Request $request)
    {
        $validated = $request->validate([
            'default_commission_rate' => 'required|numeric|min:0|max:100',
            'collector_commission_rate' => 'required|numeric|min:0|max:100',
            'platform_fee_rate' => 'required|numeric|min:0|max:100',
            'withdrawal_fee' => 'required|numeric|min:0',
            'minimum_withdrawal' => 'required|numeric|min:0',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'commission');
        }

        return back()->with('success', 'Commission settings updated successfully.');
    }

    /**
     * Clear application cache.
     */
    public function clearCache()
    {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('view:clear');

        return back()->with('success', 'Application cache cleared successfully.');
    }
}

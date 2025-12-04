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
            'official_whatsapp' => 'nullable|string|max:20',
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
        foreach (['app_name', 'app_description', 'support_email', 'support_phone', 'official_whatsapp', 'address'] as $key) {
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
     * APK management page.
     */
    public function apk()
    {
        $settings = Setting::getByGroup('apk');

        // Add general settings for download type
        $settings['app_download_type'] = Setting::get('app_download_type', 'file');
        $settings['playstore_link'] = Setting::get('playstore_link');
        $settings['android_apk_version'] = Setting::get('android_apk_version');

        // Get APK file info if exists
        $apkPath = Setting::get('android_apk_path');
        $apkInfo = null;

        if ($apkPath && \Storage::disk('public')->exists($apkPath)) {
            $fullPath = storage_path('app/public/' . $apkPath);
            $apkInfo = [
                'path' => $apkPath,
                'url' => asset('storage/' . $apkPath),
                'size' => \Storage::disk('public')->size($apkPath),
                'size_formatted' => $this->formatBytes(\Storage::disk('public')->size($apkPath)),
                'last_modified' => \Storage::disk('public')->lastModified($apkPath),
                'version' => Setting::get('android_apk_version'),
            ];
        }

        return view('admin.settings.apk', compact('settings', 'apkInfo'));
    }

    /**
     * Update APK file or Play Store link.
     */
    public function updateApk(Request $request)
    {
        $request->validate([
            'download_type' => 'required|in:file,playstore',
            'android_apk' => 'required_if:download_type,file|file|max:102400', // Max 100MB
            'playstore_link' => 'required_if:download_type,playstore|nullable|url',
            'version' => 'nullable|string|max:50',
        ], [
            'android_apk.required_if' => 'Please upload an APK file.',
            'playstore_link.required_if' => 'Please provide a Play Store link.',
            'playstore_link.url' => 'Please enter a valid URL.',
        ]);

        try {
            $downloadType = $request->input('download_type');

            // Save download type
            Setting::set('app_download_type', $downloadType, 'apk');
            Setting::set('android_apk_version', $request->input('version') ?? 'v1.0.0', 'apk');

            if ($downloadType === 'file') {
                $file = $request->file('android_apk');

                // Check if file extension is .apk
                if (strtolower($file->getClientOriginalExtension()) !== 'apk') {
                    return back()->with('error', 'Only APK files are allowed.');
                }

                // Delete old APK if exists
                $oldApkPath = Setting::get('android_apk_path');
                if ($oldApkPath && \Storage::disk('public')->exists($oldApkPath)) {
                    \Storage::disk('public')->delete($oldApkPath);
                }

                // Store new APK with a fixed name to maintain consistent URL
                $fileName = 'alajo-app.apk';
                $path = $file->storeAs('downloads', $fileName, 'public');

                // Update settings
                Setting::set('android_apk_path', $path, 'apk');
                Setting::set('android_apk_size', \Storage::disk('public')->size($path), 'apk');
                Setting::set('android_apk_updated_at', now()->toDateTimeString(), 'apk');

                // Clear playstore link
                Setting::where('key', 'playstore_link')->delete();

                $message = 'Android APK uploaded successfully. The app is now available for download.';
            } else {
                // Play Store link
                Setting::set('playstore_link', $request->input('playstore_link'), 'apk');

                // Clear APK file settings
                $oldApkPath = Setting::get('android_apk_path');
                if ($oldApkPath && \Storage::disk('public')->exists($oldApkPath)) {
                    \Storage::disk('public')->delete($oldApkPath);
                }
                Setting::where('key', 'android_apk_path')->delete();
                Setting::where('key', 'android_apk_size')->delete();

                $message = 'Play Store link saved successfully. Users will be redirected to the Play Store.';
            }

            // Clear all caches to ensure settings are refreshed
            \Cache::flush();

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to save settings: ' . $e->getMessage());
        }
    }

    /**
     * Delete APK file.
     */
    public function deleteApk()
    {
        try {
            $apkPath = Setting::get('android_apk_path');

            if ($apkPath && \Storage::disk('public')->exists($apkPath)) {
                \Storage::disk('public')->delete($apkPath);
            }

            // Remove settings
            Setting::where('key', 'android_apk_path')->delete();
            Setting::where('key', 'android_apk_version')->delete();
            Setting::where('key', 'android_apk_size')->delete();
            Setting::where('key', 'android_apk_updated_at')->delete();

            return back()->with('success', 'Android APK deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete APK: ' . $e->getMessage());
        }
    }

    /**
     * Format bytes to human readable format.
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
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

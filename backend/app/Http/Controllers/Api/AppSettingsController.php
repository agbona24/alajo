<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

/**
 * @group App Settings
 *
 * API endpoints for fetching public app settings like logo, favicon, app name, etc.
 */
class AppSettingsController extends Controller
{
    /**
     * Get app settings
     *
     * Retrieve public app settings including branding (logo, favicon) and general information.
     * This endpoint is public and doesn't require authentication.
     *
     * @response 200 {
     *   "success": true,
     *   "data": {
     *     "app_name": "Alajo",
     *     "app_description": "Digital Savings Platform",
     *     "app_logo": "https://app.alajo.ng/storage/branding/logo.png",
     *     "app_favicon": "https://app.alajo.ng/storage/branding/favicon.ico",
     *     "support_email": "support@alajo.ng",
     *     "support_phone": "+234 xxx xxxx xxx",
     *     "currency_symbol": "₦",
     *     "currency_code": "NGN"
     *   }
     * }
     */
    public function index()
    {
        // Get download type and URL
        $downloadType = Setting::get('app_download_type', 'file');
        $androidApkUrl = null;

        if ($downloadType === 'playstore') {
            // Use Play Store link
            $androidApkUrl = Setting::get('playstore_link');
        } else {
            // Use uploaded APK file
            $apkPath = Setting::get('android_apk_path');
            $androidApkUrl = $apkPath ? $this->getAssetUrl($apkPath) : null;
        }

        $settings = [
            'app_name' => Setting::get('app_name', 'Alajo'),
            'app_description' => Setting::get('app_description', 'Digital Savings Platform'),
            'app_logo' => $this->getAssetUrl(Setting::get('app_logo')),
            'app_favicon' => $this->getAssetUrl(Setting::get('app_favicon')),
            'support_email' => Setting::get('support_email'),
            'support_phone' => Setting::get('support_phone'),
            'currency' => [
                'symbol' => Setting::get('currency_symbol', '₦'),
                'code' => Setting::get('default_currency', 'NGN'),
                'position' => Setting::get('currency_position', 'before'),
                'thousand_separator' => Setting::get('thousand_separator', ','),
                'decimal_separator' => Setting::get('decimal_separator', '.'),
                'decimal_places' => (int) Setting::get('decimal_places', 2),
            ],
            // Legacy support - keeping these for backwards compatibility
            'currency_symbol' => Setting::get('currency_symbol', '₦'),
            'currency_code' => Setting::get('default_currency', 'NGN'),
            'android_download_url' => $androidApkUrl,
            'download_type' => $downloadType,
            'app_version' => Setting::get('android_apk_version', 'v1.0.0'),
        ];

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Get app logo
     *
     * Retrieve just the app logo URL.
     *
     * @response 200 {
     *   "success": true,
     *   "data": {
     *     "logo_url": "https://app.alajo.ng/storage/branding/logo.png"
     *   }
     * }
     */
    public function getLogo()
    {
        $logoPath = Setting::get('app_logo');

        return response()->json([
            'success' => true,
            'data' => [
                'logo_url' => $this->getAssetUrl($logoPath),
            ],
        ]);
    }

    /**
     * Get app favicon
     *
     * Retrieve just the app favicon URL.
     *
     * @response 200 {
     *   "success": true,
     *   "data": {
     *     "favicon_url": "https://app.alajo.ng/storage/branding/favicon.ico"
     *   }
     * }
     */
    public function getFavicon()
    {
        $faviconPath = Setting::get('app_favicon');

        return response()->json([
            'success' => true,
            'data' => [
                'favicon_url' => $this->getAssetUrl($faviconPath),
            ],
        ]);
    }

    /**
     * Helper method to convert storage path to full URL
     */
    private function getAssetUrl($path)
    {
        if (!$path) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // Convert storage path to URL
        return url('storage/' . $path);
    }
}

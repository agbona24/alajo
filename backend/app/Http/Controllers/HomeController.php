<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $appName = Setting::get('app_name', 'Alajo');
        $appDescription = Setting::get('app_description', 'Your trusted savings and contribution platform');
        $logo = Setting::get('app_logo');

        // Get download type and URL
        $downloadType = Setting::get('app_download_type', 'file');
        $androidApkUrl = null;

        if ($downloadType === 'playstore') {
            // Use Play Store link
            $androidApkUrl = Setting::get('playstore_link');
        } else {
            // Use uploaded APK file
            $apkPath = Setting::get('android_apk_path');
            $androidApkUrl = $apkPath ? asset('storage/' . $apkPath) : null;
        }

        return view('home', compact('appName', 'appDescription', 'logo', 'androidApkUrl', 'downloadType'));
    }
}

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

        // Get APK URL from settings (uploaded via admin panel)
        $apkPath = Setting::get('android_apk_path');
        $androidApkUrl = $apkPath ? asset('storage/' . $apkPath) : null;

        return view('home', compact('appName', 'appDescription', 'logo', 'androidApkUrl'));
    }
}

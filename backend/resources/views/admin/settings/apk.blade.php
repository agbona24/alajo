    @extends('layouts.admin')

    @section('title', 'APK Management')
    @section('page-title', 'APK Management')

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
                <a href="{{ route('admin.settings.notifications') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    Notifications
                </a>
                <a href="{{ route('admin.settings.commissions') }}" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    Commissions
                </a>
                <a href="{{ route('admin.settings.apk') }}" class="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    APK Management
                </a>
            </nav>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Android App Management</h3>
                <p class="text-sm text-gray-500 mt-1">Upload APK file directly or provide a Play Store link for users to download your app.</p>
            </div>

            <!-- Current APK Info -->
            @if($apkInfo)
            <div class="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-200">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-lg font-bold text-gray-900 mb-1">Android App Available</h4>
                            <div class="space-y-2">
                                <div class="flex items-center text-sm text-gray-600">
                                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span class="font-medium">Version:</span>
                                    <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{{ $apkInfo['version'] ?? 'N/A' }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <span class="font-medium">File Size:</span>
                                    <span class="ml-2">{{ $apkInfo['size_formatted'] }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span class="font-medium">Last Updated:</span>
                                    <span class="ml-2">{{ \Carbon\Carbon::createFromTimestamp($apkInfo['last_modified'])->format('M d, Y - h:i A') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <a href="{{ $apkInfo['url'] }}" download class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download
                        </a>
                        <form action="{{ route('admin.settings.apk.delete') }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this APK? Users will not be able to download the app.');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="w-full inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                            </button>
                        </form>
                    </div>
                </div>

                <div class="mt-4 p-3 bg-white rounded-lg border border-green-200">
                    <p class="text-xs text-gray-600 mb-1 font-medium">Public Download URL:</p>
                    <div class="flex items-center space-x-2">
                        <input type="text" value="{{ $apkInfo['url'] }}" readonly class="flex-1 text-sm px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 font-mono">
                        <button onclick="copyToClipboard('{{ $apkInfo['url'] }}')" class="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
            @else
            <div class="p-6 bg-yellow-50 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <h4 class="text-md font-semibold text-gray-900">No APK Available</h4>
                        <p class="text-sm text-gray-600 mt-1">Upload your Android application APK file to make it available for download.</p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Upload Form -->
            <form action="{{ route('admin.settings.apk.update') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-6">
                @csrf

                @if ($errors->any())
                <div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <div class="flex items-center mb-2">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="font-semibold">Upload Failed</span>
                    </div>
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Download Type Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Download Option</label>
                    <div class="grid grid-cols-2 gap-4">
                        <label class="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition" onclick="showUploadOption('file')">
                            <input type="radio" name="download_type" value="file" class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" {{ (!isset($settings['app_download_type']) || $settings['app_download_type'] === 'file') ? 'checked' : '' }}>
                            <div class="ml-3">
                                <div class="text-sm font-medium text-gray-900">Upload APK File</div>
                                <div class="text-xs text-gray-500">Host the APK on your server</div>
                            </div>
                        </label>
                        <label class="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition" onclick="showUploadOption('playstore')">
                            <input type="radio" name="download_type" value="playstore" class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" {{ (isset($settings['app_download_type']) && $settings['app_download_type'] === 'playstore') ? 'checked' : '' }}>
                            <div class="ml-3">
                                <div class="text-sm font-medium text-gray-900">Play Store Link</div>
                                <div class="text-xs text-gray-500">Link to Google Play Store</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label for="version" class="block text-sm font-medium text-gray-700 mb-2">App Version (Optional)</label>
                    <input type="text" name="version" id="version" value="{{ $apkInfo['version'] ?? $settings['android_apk_version'] ?? '' }}" placeholder="e.g., v1.0.0, 2.3.1"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <p class="mt-1 text-sm text-gray-500">Specify the version number of your app for reference.</p>
                </div>

                <!-- APK File Upload Section -->
                <div id="file-upload-section" style="display: {{ (!isset($settings['app_download_type']) || $settings['app_download_type'] === 'file') ? 'block' : 'none' }};">
                    <div>
                        <label for="android_apk" class="block text-sm font-medium text-gray-700 mb-2">
                            APK File
                            @if($apkInfo)
                            <span class="text-orange-600 font-semibold">(Upload to Replace Current APK)</span>
                            @endif
                        </label>
                        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition">
                            <div class="space-y-1 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div class="flex text-sm text-gray-600">
                                    <label for="android_apk" class="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                        <span>Upload an APK file</span>
                                        <input id="android_apk" name="android_apk" type="file" accept=".apk" class="sr-only" onchange="displayFileName(this)">
                                    </label>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs text-gray-500">APK file up to 100MB</p>
                                <p id="file-name" class="text-sm font-medium text-purple-600 mt-2"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Play Store Link Section -->
                <div id="playstore-link-section" style="display: {{ (isset($settings['app_download_type']) && $settings['app_download_type'] === 'playstore') ? 'block' : 'none' }};">
                    <div>
                        <label for="playstore_link" class="block text-sm font-medium text-gray-700 mb-2">
                            Google Play Store URL
                        </label>
                        <input type="url" name="playstore_link" id="playstore_link" value="{{ $settings['playstore_link'] ?? '' }}"
                            placeholder="https://play.google.com/store/apps/details?id=com.your.app"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <p class="mt-1 text-sm text-gray-500">Enter the full URL to your app on Google Play Store.</p>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex">
                        <svg class="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-blue-800">Important Information</h3>
                            <div class="mt-2 text-sm text-blue-700">
                                <ul class="list-disc list-inside space-y-1">
                                    <li>The APK will be stored at: <code class="bg-blue-100 px-1 rounded font-mono text-xs">storage/app/public/downloads/alajo-app.apk</code></li>
                                    <li>URL will remain consistent for easy distribution</li>
                                    <li>Uploading a new APK will automatically replace the old one</li>
                                    <li>Make sure your APK is properly signed before uploading</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end pt-4 border-t border-gray-200">
                    <button type="submit" class="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        <span id="submit-btn-text">Save Settings</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
    function displayFileName(input) {
        const fileName = input.files[0]?.name;
        const fileNameDisplay = document.getElementById('file-name');
        if (fileName) {
            fileNameDisplay.textContent = 'Selected: ' + fileName;
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            alert('URL copied to clipboard!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    function showUploadOption(type) {
        const fileSection = document.getElementById('file-upload-section');
        const playstoreSection = document.getElementById('playstore-link-section');
        const apkInput = document.getElementById('android_apk');

        if (type === 'file') {
            fileSection.style.display = 'block';
            playstoreSection.style.display = 'none';
            // APK is not required anymore since user can choose playstore
            // apkInput.required = true;
        } else {
            fileSection.style.display = 'none';
            playstoreSection.style.display = 'block';
            apkInput.required = false;
        }
    }
    </script>
    @endsection

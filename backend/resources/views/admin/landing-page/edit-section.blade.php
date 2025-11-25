@extends('layouts.admin')

@section('title', 'Edit ' . $sectionLabel)
@section('page-title', 'Edit ' . $sectionLabel)

@section('content')
<div class="space-y-6">
    <!-- Header with Breadcrumb -->
    <div class="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div class="flex items-center justify-between">
            <div>
                <div class="flex items-center space-x-2 text-purple-200 text-sm mb-2">
                    <a href="{{ route('admin.landing-page.index') }}" class="hover:text-white transition">
                        Landing Page
                    </a>
                    <span>/</span>
                    <span>{{ $sectionLabel }}</span>
                </div>
                <h1 class="text-3xl font-bold mb-2">Edit {{ $sectionLabel }}</h1>
                <p class="text-purple-200">Update content for the {{ strtolower($sectionLabel) }} section</p>
            </div>
            <div class="hidden md:block">
                <a href="{{ route('admin.landing-page.index') }}"
                   class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition flex items-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span>Back</span>
                </a>
            </div>
        </div>
    </div>

    @if(session('success'))
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-green-700 font-medium">{{ session('success') }}</p>
            </div>
        </div>
    @endif

    @if($errors->any())
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start">
                <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <div>
                    <p class="text-red-700 font-medium mb-2">Please fix the following errors:</p>
                    <ul class="list-disc list-inside text-red-600 space-y-1">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    @endif

    <!-- Content Form -->
    <form action="{{ route('admin.landing-page.update-section', $section) }}" method="POST" class="space-y-6">
        @csrf
        @method('PUT')

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold text-gray-900">Content Items</h2>
                    <span class="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                        {{ $contents->count() }} items
                    </span>
                </div>
            </div>

            <div class="p-6 space-y-4">
                @foreach($contents as $index => $content)
                    <div class="border @if(!$content->is_active) border-yellow-300 bg-yellow-50 @else border-gray-200 @endif rounded-lg p-4 hover:shadow-md transition">
                        <div class="space-y-3">
                            <!-- Header -->
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900">
                                        {{ str_replace('_', ' ', ucwords($content->key)) }}
                                    </h3>
                                    <p class="text-xs text-gray-500 mt-1">
                                        <span class="inline-flex items-center">
                                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                                            </svg>
                                            Key: <code class="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">{{ $content->key }}</code>
                                        </span>
                                        <span class="ml-3">Type: {{ ucfirst($content->type) }}</span>
                                        <span class="ml-3">Order: {{ $content->order }}</span>
                                    </p>
                                </div>

                                <!-- Active Toggle -->
                                <div class="flex items-center space-x-2">
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox"
                                               name="contents[{{ $index }}][is_active]"
                                               value="1"
                                               class="sr-only peer"
                                               {{ $content->is_active ? 'checked' : '' }}>
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        <span class="ml-2 text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Hidden ID -->
                            <input type="hidden" name="contents[{{ $index }}][id]" value="{{ $content->id }}">

                            <!-- Content Input -->
                            @if($content->type === 'text' && strlen($content->value) > 100)
                                <textarea
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    name="contents[{{ $index }}][value]"
                                    rows="4"
                                    required>{{ old('contents.' . $index . '.value', $content->value) }}</textarea>
                            @else
                                <input
                                    type="text"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    name="contents[{{ $index }}][value]"
                                    value="{{ old('contents.' . $index . '.value', $content->value) }}"
                                    required>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between">
            <a href="{{ route('admin.landing-page.index') }}"
               class="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition active:scale-95">
                Cancel
            </a>
            <button type="submit"
                    class="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95 shadow-lg">
                <span class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                </span>
            </button>
        </div>
    </form>

    <!-- Tips Card -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-semibold text-blue-900 mb-2">Tips for Managing Content</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Changes will be reflected on the landing page immediately after saving</li>
                    <li>• Use the toggle to temporarily disable content items without deleting them</li>
                    <li>• Items with yellow background are currently inactive</li>
                    <li>• Keep consistent tone and messaging across all sections</li>
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection

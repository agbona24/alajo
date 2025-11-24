@props([
    'id' => 'confirm-modal',
    'title' => 'Confirm Action',
    'message' => 'Are you sure you want to proceed?',
    'confirmText' => 'Confirm',
    'cancelText' => 'Cancel',
    'type' => 'danger' // danger, warning, info
])

@php
$colors = [
    'danger' => ['bg' => 'bg-red-100', 'text' => 'text-red-600', 'btn' => 'bg-red-600 hover:bg-red-700'],
    'warning' => ['bg' => 'bg-yellow-100', 'text' => 'text-yellow-600', 'btn' => 'bg-yellow-600 hover:bg-yellow-700'],
    'info' => ['bg' => 'bg-blue-100', 'text' => 'text-blue-600', 'btn' => 'bg-blue-600 hover:bg-blue-700'],
];
$color = $colors[$type] ?? $colors['danger'];
@endphp

<div
    x-data="{ open: false, formAction: '', formMethod: 'POST' }"
    x-on:open-{{ $id }}.window="open = true; formAction = $event.detail.action || ''; formMethod = $event.detail.method || 'POST'"
    x-on:close-{{ $id }}.window="open = false"
    x-on:keydown.escape.window="open = false"
>
    <!-- Backdrop -->
    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="fixed inset-0 bg-black/50 z-50"
        style="display: none;"
    ></div>

    <!-- Modal -->
    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="display: none;"
    >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6" @click.away="open = false">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full {{ $color['bg'] }} flex items-center justify-center mr-4">
                    @if($type === 'danger')
                        <svg class="w-6 h-6 {{ $color['text'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    @elseif($type === 'warning')
                        <svg class="w-6 h-6 {{ $color['text'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    @else
                        <svg class="w-6 h-6 {{ $color['text'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    @endif
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ $title }}</h3>
                    <p class="text-sm text-gray-500">{{ $message }}</p>
                </div>
            </div>

            {{ $slot }}

            <div class="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    @click="open = false"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                    {{ $cancelText }}
                </button>
                <form :action="formAction" method="POST" class="inline">
                    @csrf
                    <template x-if="formMethod === 'DELETE'">
                        @method('DELETE')
                    </template>
                    <button
                        type="submit"
                        class="px-4 py-2 {{ $color['btn'] }} text-white rounded-lg font-medium transition"
                    >
                        {{ $confirmText }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

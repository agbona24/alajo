@props(['id' => 'slideout', 'title' => '', 'maxWidth' => 'max-w-lg'])

<div
    x-data="{ open: false }"
    x-on:open-{{ $id }}.window="open = true"
    x-on:close-{{ $id }}.window="open = false"
    x-on:keydown.escape.window="open = false"
    @class(['relative z-50'])
>
    <!-- Backdrop -->
    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="fixed inset-0 bg-black/50"
        @click="open = false"
        style="display: none;"
    ></div>

    <!-- Panel -->
    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed inset-y-0 right-0 {{ $maxWidth }} w-full bg-white shadow-2xl overflow-hidden flex flex-col"
        style="display: none;"
        @click.away="open = false"
    >
        <!-- Header -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ $title }}</h3>
            <button @click="open = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
            {{ $slot }}
        </div>
    </div>
</div>

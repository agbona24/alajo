@extends('layouts.admin')

@section('title', 'View User')
@section('page-title', 'User Details')

@section('content')
<div class="space-y-6">
    <!-- User Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between">
            <div class="flex items-center">
                <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold mr-4">
                    {{ strtoupper(substr($user->name, 0, 1)) }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ $user->name }}</h2>
                    <p class="text-gray-500">{{ $user->email }}</p>
                    <div class="mt-2 flex items-center gap-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $user->role === 'admin' ? 'bg-purple-100 text-purple-700' : ($user->role === 'collector' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst($user->role ?? 'user') }}
                        </span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $user->status === 'active' ? 'bg-green-100 text-green-700' : ($user->status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst($user->status ?? 'active') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <a href="{{ route('admin.users.edit', $user) }}" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Edit User</a>
                @if($user->status === 'active')
                    <form method="POST" action="{{ route('admin.users.suspend', $user) }}" class="inline">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition" onclick="return confirm('Are you sure?')">Suspend</button>
                    </form>
                @else
                    <form method="POST" action="{{ route('admin.users.activate', $user) }}" class="inline">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Activate</button>
                    </form>
                @endif
            </div>
        </div>
    </div>

    <!-- User Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Phone</dt>
                    <dd class="font-medium text-gray-900">{{ $user->phone ?? 'Not provided' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Address</dt>
                    <dd class="font-medium text-gray-900">{{ $user->address ?? 'Not provided' }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Joined</dt>
                    <dd class="font-medium text-gray-900">{{ $user->created_at->format('M d, Y') }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Last Login</dt>
                    <dd class="font-medium text-gray-900">{{ $user->last_login_at?->diffForHumans() ?? 'Never' }}</dd>
                </div>
            </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Activity Summary</h3>
            <dl class="space-y-3">
                <div class="flex justify-between">
                    <dt class="text-gray-500">Ajo Groups</dt>
                    <dd class="font-medium text-gray-900">{{ $user->ajoGroups->count() }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Groups Created</dt>
                    <dd class="font-medium text-gray-900">{{ $user->createdAjoGroups->count() }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-gray-500">Total Transactions</dt>
                    <dd class="font-medium text-gray-900">{{ $user->transactions->count() }}</dd>
                </div>
            </dl>
        </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div class="divide-y divide-gray-100">
            @forelse($user->transactions as $transaction)
                <div class="px-6 py-4 flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-900">{{ $transaction->description ?? $transaction->type }}</p>
                        <p class="text-sm text-gray-500">{{ $transaction->created_at->format('M d, Y H:i') }}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold {{ $transaction->type === 'credit' ? 'text-green-600' : 'text-gray-900' }}">₦{{ number_format($transaction->amount) }}</p>
                        <span class="px-2 py-1 text-xs font-medium rounded-full {{ $transaction->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">{{ ucfirst($transaction->status) }}</span>
                    </div>
                </div>
            @empty
                <div class="px-6 py-8 text-center text-gray-500">No transactions found</div>
            @endforelse
        </div>
    </div>

    <div class="flex">
        <a href="{{ route('admin.users.index') }}" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Back to Users</a>
    </div>
</div>
@endsection

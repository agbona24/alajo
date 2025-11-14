<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Filter by account tier
            if ($request->has('account_tier')) {
                $query->where('account_tier', $request->account_tier);
            }

            // Filter by status
            if ($request->has('is_active')) {
                $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginate
            $users = $query->withCount(['savingsPlans', 'transactions', 'contributions'])
                          ->paginate(20);

            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $users,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        try {
            $user->loadCount(['savingsPlans', 'transactions', 'contributions', 'withdrawals']);
            $user->load([
                'savingsPlans' => fn($q) => $q->latest()->limit(5),
                'transactions' => fn($q) => $q->latest()->limit(10),
            ]);

            // Additional statistics
            $stats = [
                'total_saved' => $user->savingsPlans()->sum('current_balance'),
                'total_target' => $user->savingsPlans()->where('status', 'active')->sum('target_amount'),
                'total_deposited' => $user->transactions()->where('type', 'deposit')->sum('amount'),
                'total_withdrawn' => $user->transactions()->where('type', 'withdrawal')->sum('amount'),
                'pending_withdrawals' => $user->withdrawals()->where('status', 'pending')->count(),
            ];

            return response()->json([
                'message' => 'User retrieved successfully',
                'data' => [
                    'user' => $user,
                    'statistics' => $stats,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255'],
                'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
                'phone' => ['nullable', 'string', 'max:20'],
                'address' => ['nullable', 'string'],
                'role' => ['sometimes', Rule::in(['user', 'admin'])],
                'account_tier' => ['sometimes', Rule::in(['basic', 'silver', 'gold'])],
                'is_active' => ['sometimes', 'boolean'],
                'is_verified' => ['sometimes', 'boolean'],
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user->fresh(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Suspend or activate a user.
     */
    public function toggleStatus(User $user)
    {
        try {
            $user->update([
                'is_active' => !$user->is_active,
            ]);

            $status = $user->is_active ? 'activated' : 'suspended';

            return response()->json([
                'message' => "User {$status} successfully",
                'data' => $user->fresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify a user.
     */
    public function verify(User $user)
    {
        try {
            $user->update([
                'is_verified' => true,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);

            return response()->json([
                'message' => 'User verified successfully',
                'data' => $user->fresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to verify user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upgrade user account tier.
     */
    public function upgradeTier(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'account_tier' => ['required', Rule::in(['basic', 'silver', 'gold'])],
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'User tier upgraded successfully',
                'data' => $user->fresh(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upgrade user tier',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

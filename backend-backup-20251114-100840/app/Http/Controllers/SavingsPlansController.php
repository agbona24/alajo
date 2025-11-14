<?php

namespace App\Http\Controllers;

use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SavingsPlansController extends Controller
{
    /**
     * Display a listing of the user's savings plans.
     */
    public function index(Request $request)
    {
        try {
            $plans = $request->user()
                ->savingsPlans()
                ->withCount('transactions', 'contributions', 'withdrawals')
                ->latest()
                ->get();

            return response()->json([
                'message' => 'Savings plans retrieved successfully',
                'data' => $plans,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve savings plans',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created savings plan.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'target_amount' => ['required', 'numeric', 'min:300'],
                'frequency' => ['required', Rule::in(['daily', 'weekly', 'monthly'])],
                'start_date' => ['required', 'date', 'after_or_equal:today'],
                'end_date' => ['nullable', 'date', 'after:start_date'],
                'description' => ['nullable', 'string'],
                'auto_debit' => ['boolean'],
            ]);

            $plan = $request->user()->savingsPlans()->create([
                'name' => $validated['name'],
                'target_amount' => $validated['target_amount'],
                'current_balance' => 0,
                'frequency' => $validated['frequency'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'description' => $validated['description'] ?? null,
                'auto_debit' => $validated['auto_debit'] ?? false,
                'status' => 'active',
            ]);

            return response()->json([
                'message' => 'Savings plan created successfully',
                'data' => $plan,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create savings plan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified savings plan.
     */
    public function show(Request $request, SavingsPlan $savingsPlan)
    {
        try {
            // Check if the plan belongs to the authenticated user
            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            $savingsPlan->loadCount('transactions', 'contributions', 'withdrawals');
            $savingsPlan->load([
                'transactions' => fn($q) => $q->latest()->limit(10),
                'contributions' => fn($q) => $q->latest()->limit(10),
            ]);

            return response()->json([
                'message' => 'Savings plan retrieved successfully',
                'data' => $savingsPlan,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve savings plan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified savings plan.
     */
    public function update(Request $request, SavingsPlan $savingsPlan)
    {
        try {
            // Check if the plan belongs to the authenticated user
            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255'],
                'target_amount' => ['sometimes', 'numeric', 'min:300'],
                'frequency' => ['sometimes', Rule::in(['daily', 'weekly', 'monthly'])],
                'end_date' => ['nullable', 'date', 'after:start_date'],
                'description' => ['nullable', 'string'],
                'auto_debit' => ['boolean'],
                'status' => ['sometimes', Rule::in(['active', 'paused', 'completed'])],
            ]);

            $savingsPlan->update($validated);

            return response()->json([
                'message' => 'Savings plan updated successfully',
                'data' => $savingsPlan->fresh(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update savings plan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Soft delete the specified savings plan.
     */
    public function destroy(Request $request, SavingsPlan $savingsPlan)
    {
        try {
            // Check if the plan belongs to the authenticated user
            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            // Don't allow deletion if there's a balance
            if ($savingsPlan->current_balance > 0) {
                return response()->json([
                    'message' => 'Cannot delete a savings plan with an active balance. Please withdraw all funds first.',
                ], 422);
            }

            $savingsPlan->delete();

            return response()->json([
                'message' => 'Savings plan deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete savings plan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics for user's savings plans.
     */
    public function statistics(Request $request)
    {
        try {
            $user = $request->user();

            $stats = [
                'total_plans' => $user->savingsPlans()->count(),
                'active_plans' => $user->savingsPlans()->where('status', 'active')->count(),
                'completed_plans' => $user->savingsPlans()->where('status', 'completed')->count(),
                'total_saved' => $user->savingsPlans()->sum('current_balance'),
                'total_target' => $user->savingsPlans()->where('status', 'active')->sum('target_amount'),
                'total_transactions' => $user->transactions()->count(),
                'total_contributions' => $user->contributions()->where('status', 'paid')->count(),
            ];

            return response()->json([
                'message' => 'Statistics retrieved successfully',
                'data' => $stats,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

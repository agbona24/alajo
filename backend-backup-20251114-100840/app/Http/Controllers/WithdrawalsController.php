<?php

namespace App\Http\Controllers;

use App\Models\Withdrawal;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WithdrawalsController extends Controller
{
    /**
     * Display a listing of the user's withdrawals.
     */
    public function index(Request $request)
    {
        try {
            $query = $request->user()->withdrawals()->with('savingsPlan');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by savings plan if provided
            if ($request->has('savings_plan_id')) {
                $query->where('savings_plan_id', $request->savings_plan_id);
            }

            $withdrawals = $query->latest()->paginate(20);

            return response()->json([
                'message' => 'Withdrawals retrieved successfully',
                'data' => $withdrawals,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve withdrawals',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new withdrawal request.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'savings_plan_id' => ['required', 'exists:savings_plans,id'],
                'amount' => ['required', 'numeric', 'min:300'],
                'type' => ['required', Rule::in(['instant', 'scheduled'])],
                'bank_name' => ['required', 'string'],
                'account_number' => ['required', 'string', 'regex:/^[0-9]{10}$/'],
                'account_name' => ['required', 'string'],
                'reason' => ['nullable', 'string'],
            ]);

            // Verify the savings plan belongs to the user
            $savingsPlan = SavingsPlan::findOrFail($validated['savings_plan_id']);

            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            // Check if plan has sufficient balance
            if ($savingsPlan->current_balance < $validated['amount']) {
                return response()->json([
                    'message' => 'Insufficient balance in savings plan',
                ], 422);
            }

            // Calculate withdrawal fee (e.g., 1% fee)
            $fee = $validated['amount'] * 0.01;
            $netAmount = $validated['amount'] - $fee;

            // Create withdrawal request
            $withdrawal = Withdrawal::create([
                'user_id' => $request->user()->id,
                'savings_plan_id' => $savingsPlan->id,
                'amount' => $validated['amount'],
                'fee' => $fee,
                'net_amount' => $netAmount,
                'type' => $validated['type'],
                'bank_name' => $validated['bank_name'],
                'account_number' => $validated['account_number'],
                'account_name' => $validated['account_name'],
                'reason' => $validated['reason'] ?? null,
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Withdrawal request submitted successfully',
                'data' => $withdrawal->fresh(['savingsPlan']),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create withdrawal request',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified withdrawal.
     */
    public function show(Request $request, Withdrawal $withdrawal)
    {
        try {
            // Check if the withdrawal belongs to the authenticated user
            if ($withdrawal->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized access to this withdrawal',
                ], 403);
            }

            $withdrawal->load('savingsPlan', 'transaction', 'approver');

            return response()->json([
                'message' => 'Withdrawal retrieved successfully',
                'data' => $withdrawal,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve withdrawal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel a pending withdrawal request.
     */
    public function cancel(Request $request, Withdrawal $withdrawal)
    {
        try {
            // Check if the withdrawal belongs to the authenticated user
            if ($withdrawal->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this withdrawal',
                ], 403);
            }

            // Check if withdrawal is pending
            if (!$withdrawal->isPending()) {
                return response()->json([
                    'message' => 'Only pending withdrawals can be cancelled',
                ], 422);
            }

            $withdrawal->update([
                'status' => 'cancelled',
                'admin_notes' => 'Cancelled by user',
            ]);

            return response()->json([
                'message' => 'Withdrawal cancelled successfully',
                'data' => $withdrawal->fresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel withdrawal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve a withdrawal request (Admin only).
     */
    public function approve(Request $request, Withdrawal $withdrawal)
    {
        try {
            // Check if user is admin
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            // Check if withdrawal is pending
            if (!$withdrawal->isPending()) {
                return response()->json([
                    'message' => 'Only pending withdrawals can be approved',
                ], 422);
            }

            $validated = $request->validate([
                'admin_notes' => ['nullable', 'string'],
            ]);

            DB::beginTransaction();

            try {
                // Create withdrawal transaction
                $transaction = Transaction::create([
                    'user_id' => $withdrawal->user_id,
                    'savings_plan_id' => $withdrawal->savings_plan_id,
                    'type' => 'withdrawal',
                    'amount' => $withdrawal->amount,
                    'fee' => $withdrawal->fee,
                    'net_amount' => $withdrawal->net_amount,
                    'payment_method' => 'bank_transfer',
                    'payment_reference' => $withdrawal->reference,
                    'status' => 'completed',
                    'notes' => 'Withdrawal approved',
                    'processed_at' => now(),
                ]);

                // Update withdrawal status
                $withdrawal->update([
                    'status' => 'approved',
                    'transaction_id' => $transaction->id,
                    'approved_by' => $request->user()->id,
                    'approved_at' => now(),
                    'admin_notes' => $validated['admin_notes'] ?? null,
                ]);

                // Deduct amount from savings plan
                $savingsPlan = $withdrawal->savingsPlan;
                $savingsPlan->decrement('current_balance', $withdrawal->amount);

                DB::commit();

                return response()->json([
                    'message' => 'Withdrawal approved successfully',
                    'data' => $withdrawal->fresh(['savingsPlan', 'transaction', 'approver']),
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to approve withdrawal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a withdrawal request (Admin only).
     */
    public function reject(Request $request, Withdrawal $withdrawal)
    {
        try {
            // Check if user is admin
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            // Check if withdrawal is pending
            if (!$withdrawal->isPending()) {
                return response()->json([
                    'message' => 'Only pending withdrawals can be rejected',
                ], 422);
            }

            $validated = $request->validate([
                'admin_notes' => ['required', 'string'],
            ]);

            $withdrawal->update([
                'status' => 'rejected',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'admin_notes' => $validated['admin_notes'],
            ]);

            return response()->json([
                'message' => 'Withdrawal rejected successfully',
                'data' => $withdrawal->fresh(['approver']),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reject withdrawal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all pending withdrawals (Admin only).
     */
    public function pending(Request $request)
    {
        try {
            // Check if user is admin
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $withdrawals = Withdrawal::with('savingsPlan', 'user')
                ->where('status', 'pending')
                ->latest()
                ->paginate(20);

            return response()->json([
                'message' => 'Pending withdrawals retrieved successfully',
                'data' => $withdrawals,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve pending withdrawals',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

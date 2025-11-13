<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\SavingsPlan;
use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TransactionsController extends Controller
{
    /**
     * Display a listing of the user's transactions.
     */
    public function index(Request $request)
    {
        try {
            $query = $request->user()->transactions()->with('savingsPlan');

            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by savings plan if provided
            if ($request->has('savings_plan_id')) {
                $query->where('savings_plan_id', $request->savings_plan_id);
            }

            // Filter by date range if provided
            if ($request->has('from_date')) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }

            if ($request->has('to_date')) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }

            $transactions = $query->latest()->paginate(20);

            return response()->json([
                'message' => 'Transactions retrieved successfully',
                'data' => $transactions,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new deposit transaction (contribution).
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'savings_plan_id' => ['required', 'exists:savings_plans,id'],
                'amount' => ['required', 'numeric', 'min:300'],
                'payment_method' => ['required', 'string'],
                'payment_reference' => ['nullable', 'string'],
                'notes' => ['nullable', 'string'],
            ]);

            // Verify the savings plan belongs to the user
            $savingsPlan = SavingsPlan::findOrFail($validated['savings_plan_id']);

            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            // Check if plan is active
            if ($savingsPlan->status !== 'active') {
                return response()->json([
                    'message' => 'Cannot make deposits to inactive savings plan',
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Create transaction
                $transaction = Transaction::create([
                    'user_id' => $request->user()->id,
                    'savings_plan_id' => $savingsPlan->id,
                    'type' => 'deposit',
                    'amount' => $validated['amount'],
                    'fee' => 0,
                    'net_amount' => $validated['amount'],
                    'payment_method' => $validated['payment_method'],
                    'payment_reference' => $validated['payment_reference'] ?? null,
                    'status' => 'completed',
                    'notes' => $validated['notes'] ?? null,
                    'processed_at' => now(),
                ]);

                // Update savings plan balance
                $savingsPlan->increment('current_balance', $validated['amount']);

                // Create contribution record for passbook
                $contribution = Contribution::create([
                    'user_id' => $request->user()->id,
                    'savings_plan_id' => $savingsPlan->id,
                    'transaction_id' => $transaction->id,
                    'serial_number' => $this->getNextSerialNumber($savingsPlan),
                    'contribution_date' => now()->toDateString(),
                    'amount' => $validated['amount'],
                    'status' => 'paid',
                    'payment_method' => $validated['payment_method'],
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Check if target is reached
                if ($savingsPlan->current_balance >= $savingsPlan->target_amount) {
                    $savingsPlan->update(['status' => 'completed']);
                }

                DB::commit();

                return response()->json([
                    'message' => 'Deposit successful',
                    'data' => [
                        'transaction' => $transaction->fresh(['savingsPlan']),
                        'contribution' => $contribution,
                        'savings_plan' => $savingsPlan->fresh(),
                    ],
                ], 201);

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
                'message' => 'Failed to process deposit',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified transaction.
     */
    public function show(Request $request, Transaction $transaction)
    {
        try {
            // Check if the transaction belongs to the authenticated user
            if ($transaction->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this transaction',
                ], 403);
            }

            $transaction->load('savingsPlan');

            return response()->json([
                'message' => 'Transaction retrieved successfully',
                'data' => $transaction,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve transaction',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get transaction statistics.
     */
    public function statistics(Request $request)
    {
        try {
            $user = $request->user();

            $stats = [
                'total_transactions' => $user->transactions()->count(),
                'total_deposits' => $user->transactions()->where('type', 'deposit')->sum('amount'),
                'total_withdrawals' => $user->transactions()->where('type', 'withdrawal')->sum('amount'),
                'total_fees' => $user->transactions()->sum('fee'),
                'this_month_deposits' => $user->transactions()
                    ->where('type', 'deposit')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('amount'),
                'this_month_withdrawals' => $user->transactions()
                    ->where('type', 'withdrawal')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('amount'),
                'pending_transactions' => $user->transactions()->where('status', 'pending')->count(),
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

    /**
     * Get next serial number for contribution passbook.
     */
    private function getNextSerialNumber(SavingsPlan $savingsPlan): int
    {
        $lastContribution = $savingsPlan->contributions()
            ->whereMonth('contribution_date', now()->month)
            ->whereYear('contribution_date', now()->year)
            ->orderBy('serial_number', 'desc')
            ->first();

        if (!$lastContribution) {
            return 1; // Start from 1 for new month
        }

        // For daily frequency, serial numbers go from 1-31
        return $lastContribution->serial_number < 31
            ? $lastContribution->serial_number + 1
            : 1;
    }
}

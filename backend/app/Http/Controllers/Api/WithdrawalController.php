<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    public function index()
    {
        $withdrawals = Auth::user()->withdrawals()
            ->with('savingsPlan', 'bankAccount')
            ->latest()
            ->get();

        return response()->json($withdrawals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'savings_plan_id' => 'required|exists:savings_plans,id',
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
        ]);

        // Verify user owns the savings plan
        $plan = Auth::user()->savingsPlans()->findOrFail($validated['savings_plan_id']);

        // Check sufficient balance
        if ($plan->current_amount < $validated['amount']) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        $validated['user_id'] = Auth::id();
        $validated['reference'] = 'WD-' . time() . '-' . rand(1000, 9999);
        $validated['status'] = 'pending';

        $withdrawal = Withdrawal::create($validated);
        $withdrawal->load('savingsPlan', 'bankAccount', 'user');

        // Send email notifications
        try {
            $notificationService = app(NotificationService::class);
            $notificationService->sendWithdrawalRequest($withdrawal);
            $notificationService->notifyAdminNewWithdrawal($withdrawal);
        } catch (\Exception $e) {
            \Log::warning('Failed to send withdrawal notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Withdrawal request submitted successfully',
            'withdrawal' => $withdrawal,
        ], 201);
    }

    public function show($id)
    {
        $withdrawal = Auth::user()->withdrawals()
            ->with('savingsPlan', 'bankAccount', 'approvedBy')
            ->findOrFail($id);

        return response()->json($withdrawal);
    }

    public function approve($id)
    {
        $withdrawal = Withdrawal::findOrFail($id);

        // For now, any authenticated user can approve (in production, restrict to admins)
        $withdrawal->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Withdrawal approved',
            'withdrawal' => $withdrawal,
        ]);
    }

    public function complete($id)
    {
        $withdrawal = Withdrawal::findOrFail($id);

        if ($withdrawal->status !== 'approved') {
            return response()->json(['message' => 'Withdrawal must be approved first'], 400);
        }

        DB::beginTransaction();
        try {
            $plan = $withdrawal->savingsPlan;

            // Deduct from savings plan
            $balanceBefore = $plan->current_amount;
            $plan->current_amount -= $withdrawal->amount;
            $plan->save();

            // Create transaction record
            $plan->transactions()->create([
                'user_id' => $withdrawal->user_id,
                'reference' => $withdrawal->reference,
                'type' => 'withdrawal',
                'amount' => $withdrawal->amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $plan->current_amount,
                'status' => 'completed',
                'description' => "Withdrawal from {$plan->name}",
                'completed_at' => now(),
            ]);

            $withdrawal->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            DB::commit();

            // Send withdrawal completed email
            try {
                $withdrawal->load('savingsPlan', 'bankAccount', 'user');
                $notificationService = app(NotificationService::class);
                $notificationService->sendWithdrawalCompleted($withdrawal);
            } catch (\Exception $e) {
                \Log::warning('Failed to send withdrawal completed notification: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Withdrawal completed successfully',
                'withdrawal' => $withdrawal,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Withdrawal failed', 'error' => $e->getMessage()], 500);
        }
    }
}

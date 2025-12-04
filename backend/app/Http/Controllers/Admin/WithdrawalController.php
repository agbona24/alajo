<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WithdrawalController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of withdrawals.
     */
    public function index(Request $request)
    {
        $query = Withdrawal::with(['user', 'savingsPlan', 'bankAccount', 'approvedBy']);

        // Status filter (default to pending)
        $status = $request->get('status', 'pending');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $withdrawals = $query->latest()->paginate(30);

        // Statistics
        $stats = [
            'pending' => Withdrawal::where('status', 'pending')->count(),
            'approved' => Withdrawal::where('status', 'approved')->count(),
            'processing' => Withdrawal::where('status', 'processing')->count(),
            'completed_today' => Withdrawal::where('status', 'completed')
                ->whereDate('completed_at', Carbon::today())
                ->count(),
            'total_pending_amount' => Withdrawal::where('status', 'pending')->sum('amount'),
            'total_processing_amount' => Withdrawal::whereIn('status', ['approved', 'processing'])->sum('amount'),
        ];

        return view('admin.withdrawals.index', compact('withdrawals', 'stats', 'status'));
    }

    /**
     * Display the specified withdrawal.
     */
    public function show(Withdrawal $withdrawal)
    {
        $withdrawal->load(['user', 'savingsPlan', 'bankAccount', 'approvedBy']);

        return view('admin.withdrawals.show', compact('withdrawal'));
    }

    /**
     * Approve a withdrawal request.
     */
    public function approve(Request $request, Withdrawal $withdrawal)
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'This withdrawal is not pending.');
        }

        DB::beginTransaction();
        try {
            $withdrawal->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            DB::commit();

            return back()->with('success', 'Withdrawal approved. Ready for processing.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve: ' . $e->getMessage());
        }
    }

    /**
     * Mark withdrawal as sent/processing.
     */
    public function markSent(Request $request, Withdrawal $withdrawal)
    {
        if (!in_array($withdrawal->status, ['pending', 'approved'])) {
            return back()->with('error', 'This withdrawal cannot be marked as sent.');
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $updateData = [
                'status' => 'processing',
            ];

            // If not already approved, approve now
            if ($withdrawal->status === 'pending') {
                $updateData['approved_at'] = now();
                $updateData['approved_by'] = Auth::id();
            }

            $withdrawal->update($updateData);

            DB::commit();

            // Send email notification to user
            try {
                $withdrawal->load(['user', 'savingsPlan', 'bankAccount']);
                $this->notificationService->sendWithdrawalProcessing($withdrawal);
            } catch (\Exception $e) {
                \Log::warning('Failed to send withdrawal processing notification: ' . $e->getMessage());
            }

            return back()->with('success', 'Withdrawal marked as sent. Member has been notified.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update: ' . $e->getMessage());
        }
    }

    /**
     * Mark withdrawal as completed (payment received by member).
     */
    public function markCompleted(Request $request, Withdrawal $withdrawal)
    {
        if (!in_array($withdrawal->status, ['approved', 'processing'])) {
            return back()->with('error', 'This withdrawal cannot be marked as completed.');
        }

        DB::beginTransaction();
        try {
            $plan = $withdrawal->savingsPlan;

            // Check if transaction already exists (to avoid duplicate deduction)
            $existingTransaction = Transaction::where('reference', $withdrawal->reference)->first();

            if (!$existingTransaction) {
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
            } else {
                // Transaction exists, just update its status
                $existingTransaction->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            }

            $withdrawal->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            DB::commit();

            // Send notification to user
            try {
                $withdrawal->load(['user', 'savingsPlan', 'bankAccount']);
                $this->notificationService->sendWithdrawalCompleted($withdrawal);
            } catch (\Exception $e) {
                \Log::warning('Failed to send withdrawal completed notification: ' . $e->getMessage());
            }

            return back()->with('success', 'Withdrawal completed. Balance deducted and member notified.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to complete: ' . $e->getMessage());
        }
    }

    /**
     * Reject a withdrawal request.
     */
    public function reject(Request $request, Withdrawal $withdrawal)
    {
        if (!in_array($withdrawal->status, ['pending', 'approved'])) {
            return back()->with('error', 'This withdrawal cannot be rejected.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $plan = $withdrawal->savingsPlan;

            // Refund the amount back to the plan
            if ($plan) {
                $plan->current_amount += $withdrawal->amount;
                $plan->save();
            }

            $withdrawal->update([
                'status' => 'rejected',
                'rejection_reason' => $request->reason,
            ]);

            // Update transaction
            Transaction::where('reference', $withdrawal->reference)
                ->update([
                    'status' => 'failed',
                    'description' => 'Withdrawal rejected: ' . $request->reason,
                ]);

            DB::commit();

            return back()->with('success', 'Withdrawal rejected. Amount has been refunded to member\'s savings.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject: ' . $e->getMessage());
        }
    }

    /**
     * Export withdrawals to CSV.
     */
    public function export(Request $request)
    {
        $query = Withdrawal::with(['user', 'savingsPlan', 'bankAccount']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $withdrawals = $query->get();

        $filename = 'withdrawals_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($withdrawals) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Reference',
                'Member Name',
                'Phone',
                'Savings Plan',
                'Amount',
                'Bank Name',
                'Account Number',
                'Status',
                'Reason',
                'Created At',
                'Completed At'
            ]);

            // Data rows
            foreach ($withdrawals as $withdrawal) {
                fputcsv($file, [
                    $withdrawal->reference,
                    $withdrawal->user->name ?? 'N/A',
                    $withdrawal->user->phone ?? 'N/A',
                    $withdrawal->savingsPlan->name ?? 'N/A',
                    $withdrawal->amount,
                    $withdrawal->bankAccount->bank_name ?? 'N/A',
                    $withdrawal->bankAccount->account_number ?? 'N/A',
                    ucfirst($withdrawal->status),
                    $withdrawal->reason ?? 'N/A',
                    $withdrawal->created_at->format('Y-m-d H:i:s'),
                    $withdrawal->completed_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

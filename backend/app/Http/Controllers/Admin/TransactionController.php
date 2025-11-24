<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\DailyPayment;
use App\Models\Contribution;
use App\Models\PassbookRecord;
use App\Models\SavingsPlan;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of all transactions.
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['user']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->latest()->paginate(30);

        // Statistics
        $stats = [
            'total_transactions' => Transaction::count(),
            'total_volume' => Transaction::where('status', 'completed')->sum('amount'),
            'pending_count' => Transaction::where('status', 'pending')->count(),
            'pending_volume' => Transaction::where('status', 'pending')->sum('amount'),
            'today_count' => Transaction::whereDate('created_at', Carbon::today())->count(),
            'today_volume' => Transaction::whereDate('created_at', Carbon::today())
                ->where('status', 'completed')
                ->sum('amount'),
        ];

        return view('admin.transactions.index', compact('transactions', 'stats'));
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user']);

        return view('admin.transactions.show', compact('transaction'));
    }

    /**
     * Display daily payments listing.
     */
    public function dailyPayments(Request $request)
    {
        $query = DailyPayment::with(['user', 'ajoGroup', 'recorder']);

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('payment_date', $request->date);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Group filter
        if ($request->filled('group_id')) {
            $query->where('ajo_group_id', $request->group_id);
        }

        $payments = $query->latest()->paginate(50);

        // Statistics
        $stats = [
            'today_total' => DailyPayment::whereDate('payment_date', Carbon::today())->count(),
            'today_paid' => DailyPayment::whereDate('payment_date', Carbon::today())
                ->where('status', 'paid')->count(),
            'today_pending' => DailyPayment::whereDate('payment_date', Carbon::today())
                ->where('status', 'pending')->count(),
            'today_amount' => DailyPayment::whereDate('payment_date', Carbon::today())
                ->where('status', 'paid')->sum('amount'),
        ];

        return view('admin.transactions.daily-payments', compact('payments', 'stats'));
    }

    /**
     * Approve a transaction (confirm payment).
     */
    public function approve(Transaction $transaction)
    {
        DB::beginTransaction();
        try {
            // Update transaction
            $transaction->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // If this is a contribution transaction, update related records
            if ($transaction->type === 'contribution' && $transaction->savings_plan_id) {
                $plan = SavingsPlan::find($transaction->savings_plan_id);

                if ($plan) {
                    // Find and update the related contribution
                    $contribution = Contribution::where('reference', $transaction->reference)
                        ->where('savings_plan_id', $plan->id)
                        ->first();

                    if ($contribution) {
                        $contribution->update([
                            'status' => 'completed',
                            'completed_at' => now(),
                        ]);

                        // Update passbook records linked to this contribution
                        PassbookRecord::where('contribution_id', $contribution->id)
                            ->update(['status' => 'paid']);

                        // Calculate member amount (total minus company fee if applicable)
                        $dailyAmount = $plan->daily_contribution ?: 300;
                        $companyFeeAmount = 0;

                        // Check if company fee was applied on this contribution
                        if ($plan->first_contribution_date &&
                            $contribution->created_at->isSameDay($plan->first_contribution_date)) {
                            $companyFeeAmount = $dailyAmount;
                        }

                        $memberAmount = $contribution->amount - $companyFeeAmount;

                        // Update plan current amount
                        $plan->current_amount += $memberAmount;

                        // Check if target reached
                        if ($plan->current_amount >= $plan->target_amount) {
                            $plan->status = 'completed';
                            $plan->completed_at = now();
                        }

                        $plan->save();

                        // Update transaction balance_after
                        $transaction->update([
                            'balance_after' => $plan->current_amount,
                        ]);
                    }
                }
            }

            DB::commit();

            // Send payment confirmation email
            if (isset($contribution)) {
                try {
                    $contribution->load('user', 'savingsPlan');
                    $notificationService = app(NotificationService::class);
                    $notificationService->sendPaymentConfirmation($contribution);
                } catch (\Exception $e) {
                    \Log::warning('Failed to send payment confirmation email: ' . $e->getMessage());
                }
            }

            return back()->with('success', 'Payment approved and confirmed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve payment: ' . $e->getMessage());
        }
    }

    /**
     * Reject a transaction.
     */
    public function reject(Transaction $transaction)
    {
        DB::beginTransaction();
        try {
            $transaction->update(['status' => 'failed']);

            // If this is a contribution transaction, update related records
            if ($transaction->type === 'contribution' && $transaction->savings_plan_id) {
                // Find and update the related contribution
                $contribution = Contribution::where('reference', $transaction->reference)
                    ->where('savings_plan_id', $transaction->savings_plan_id)
                    ->first();

                if ($contribution) {
                    $contribution->update(['status' => 'failed']);

                    // Delete or mark passbook records as failed
                    PassbookRecord::where('contribution_id', $contribution->id)->delete();
                }
            }

            DB::commit();
            return back()->with('success', 'Payment rejected.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject payment: ' . $e->getMessage());
        }
    }

    /**
     * Export transactions to CSV.
     */
    public function export(Request $request)
    {
        $query = Transaction::with(['user']);

        // Apply filters
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->get();

        $filename = 'transactions_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, ['ID', 'User', 'Email', 'Type', 'Amount', 'Status', 'Date']);

            // Data rows
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->id,
                    $transaction->user->name ?? 'N/A',
                    $transaction->user->email ?? 'N/A',
                    $transaction->type,
                    $transaction->amount,
                    $transaction->status,
                    $transaction->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

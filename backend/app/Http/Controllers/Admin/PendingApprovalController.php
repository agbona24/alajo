<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Transaction;
use App\Models\PassbookRecord;
use App\Models\Earning;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PendingApprovalController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of pending contributions.
     */
    public function index(Request $request)
    {
        $query = Contribution::with(['user', 'savingsPlan', 'ajoGroup']);

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

        // Payment method filter
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        $contributions = $query->latest()->paginate(30);

        // Statistics
        $stats = [
            'pending' => Contribution::where('status', 'pending')->count(),
            'approved_today' => Contribution::where('status', 'completed')
                ->whereDate('completed_at', Carbon::today())
                ->count(),
            'rejected_today' => Contribution::where('status', 'failed')
                ->whereDate('updated_at', Carbon::today())
                ->count(),
            'total_pending_amount' => Contribution::where('status', 'pending')->sum('amount'),
        ];

        return view('admin.approvals.index', compact('contributions', 'stats', 'status'));
    }

    /**
     * Display the specified contribution.
     */
    public function show(Contribution $contribution)
    {
        $contribution->load(['user', 'savingsPlan', 'ajoGroup', 'earnings']);

        // Get related passbook records for this contribution
        $passbookRecords = PassbookRecord::where('contribution_id', $contribution->id)->get();

        // Get related transaction
        $transaction = Transaction::where('reference', $contribution->reference)->first();

        return view('admin.approvals.show', compact('contribution', 'passbookRecords', 'transaction'));
    }

    /**
     * Approve a contribution.
     */
    public function approve(Request $request, Contribution $contribution)
    {
        if ($contribution->status !== 'pending') {
            return back()->with('error', 'This contribution is not pending approval.');
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Update contribution status
            $contribution->update([
                'status' => 'completed',
                'completed_at' => now(),
                'notes' => $request->notes ?? $contribution->notes,
            ]);

            // Update related passbook records
            PassbookRecord::where('contribution_id', $contribution->id)
                ->update(['status' => 'paid']);

            // Update savings plan balance
            $savingsPlan = $contribution->savingsPlan;
            $newBalance = 0;
            if ($savingsPlan) {
                // Calculate member amount (excluding company fees if applicable)
                $memberAmount = (float) $contribution->amount;

                // Get ALL company fees for this contribution (could be multiple if payment covers multiple months)
                $companyFees = Earning::where('contribution_id', $contribution->id)
                    ->where('type', Earning::TYPE_COMPANY_FEE)
                    ->get();

                if ($companyFees->count() > 0) {
                    // Calculate total company fees
                    $totalCompanyFees = $companyFees->sum('amount');
                    $memberAmount = (float) $contribution->amount - (float) $totalCompanyFees;

                    // Mark all earnings as processed
                    Earning::where('contribution_id', $contribution->id)
                        ->where('type', Earning::TYPE_COMPANY_FEE)
                        ->update([
                            'status' => Earning::STATUS_PROCESSED,
                        ]);

                    \Log::info("Deducted {$companyFees->count()} company fees totaling {$totalCompanyFees} from contribution {$contribution->id}");
                }

                // Update plan balance using increment for reliability with decimal fields
                if ($memberAmount > 0) {
                    $savingsPlan->increment('current_amount', $memberAmount);
                    $savingsPlan->refresh(); // Refresh to get updated value
                    \Log::info("Balance updated for plan {$savingsPlan->id}: +{$memberAmount}, new balance: {$savingsPlan->current_amount}");
                }
                $newBalance = $savingsPlan->current_amount;
            } else {
                \Log::warning("No savings plan found for contribution {$contribution->id}");
            }

            // Update related transaction
            $transaction = Transaction::where('reference', $contribution->reference)->first();
            if ($transaction) {
                $transaction->update([
                    'status' => 'completed',
                    'balance_after' => $newBalance,
                    'completed_at' => now(),
                ]);
            }

            DB::commit();

            // Send notification to user - load relationships first
            try {
                $contribution->load(['user', 'savingsPlan']);
                $this->notificationService->sendPaymentConfirmation($contribution);
                \Log::info('Payment confirmation email sent for contribution: ' . $contribution->reference);
            } catch (\Exception $emailError) {
                \Log::error('Failed to send payment confirmation email: ' . $emailError->getMessage());
            }

            return back()->with('success', 'Payment approved successfully. Member has been notified.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve payment: ' . $e->getMessage());
        }
    }

    /**
     * Reject a contribution.
     */
    public function reject(Request $request, Contribution $contribution)
    {
        if ($contribution->status !== 'pending') {
            return back()->with('error', 'This contribution is not pending approval.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Update contribution status
            $contribution->update([
                'status' => 'failed',
                'notes' => 'Rejected: ' . $request->reason,
            ]);

            // Update related passbook records to missed
            PassbookRecord::where('contribution_id', $contribution->id)
                ->update(['status' => 'missed']);

            // Update related transaction
            Transaction::where('reference', $contribution->reference)
                ->update([
                    'status' => 'failed',
                    'description' => 'Payment rejected: ' . $request->reason,
                ]);

            // Cancel any company fee earnings associated with this contribution
            Earning::where('contribution_id', $contribution->id)
                ->update(['status' => Earning::STATUS_CANCELLED]);

            DB::commit();

            return back()->with('success', 'Payment rejected.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject payment: ' . $e->getMessage());
        }
    }

    /**
     * Bulk approve contributions.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'contribution_ids' => 'required|array',
            'contribution_ids.*' => 'exists:contributions,id',
        ]);

        $count = 0;
        $errors = [];

        foreach ($request->contribution_ids as $id) {
            $contribution = Contribution::find($id);
            if ($contribution && $contribution->status === 'pending') {
                DB::beginTransaction();
                try {
                    // Update contribution status
                    $contribution->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                    ]);

                    // Update passbook records
                    PassbookRecord::where('contribution_id', $contribution->id)
                        ->update(['status' => 'paid']);

                    // Update savings plan balance
                    $savingsPlan = $contribution->savingsPlan;
                    $newBalance = 0;
                    if ($savingsPlan) {
                        $memberAmount = (float) $contribution->amount;

                        // Get ALL company fees for this contribution
                        $companyFees = Earning::where('contribution_id', $contribution->id)
                            ->where('type', Earning::TYPE_COMPANY_FEE)
                            ->get();

                        if ($companyFees->count() > 0) {
                            $totalCompanyFees = $companyFees->sum('amount');
                            $memberAmount = (float) $contribution->amount - (float) $totalCompanyFees;

                            // Mark all earnings as processed
                            Earning::where('contribution_id', $contribution->id)
                                ->where('type', Earning::TYPE_COMPANY_FEE)
                                ->update(['status' => Earning::STATUS_PROCESSED]);
                        }

                        if ($memberAmount > 0) {
                            $savingsPlan->increment('current_amount', $memberAmount);
                            $savingsPlan->refresh();
                        }
                        $newBalance = $savingsPlan->current_amount;
                    }

                    // Update transaction
                    $transaction = Transaction::where('reference', $contribution->reference)->first();
                    if ($transaction) {
                        $transaction->update([
                            'status' => 'completed',
                            'balance_after' => $newBalance,
                            'completed_at' => now(),
                        ]);
                    }

                    DB::commit();

                    // Send notification
                    $this->notificationService->sendPaymentConfirmation($contribution);

                    $count++;

                } catch (\Exception $e) {
                    DB::rollBack();
                    $errors[] = "Failed to approve contribution #{$id}: " . $e->getMessage();
                }
            }
        }

        $message = "{$count} payment(s) approved successfully.";
        if (count($errors) > 0) {
            $message .= ' Some errors occurred: ' . implode(', ', $errors);
        }

        return back()->with('success', $message);
    }

    /**
     * Export contributions to CSV.
     */
    public function export(Request $request)
    {
        $query = Contribution::with(['user', 'savingsPlan']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $contributions = $query->get();

        $filename = 'contributions_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($contributions) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Reference',
                'User',
                'Phone',
                'Savings Plan',
                'Amount',
                'Payment Method',
                'Status',
                'Created At',
                'Approved At'
            ]);

            // Data rows
            foreach ($contributions as $contribution) {
                fputcsv($file, [
                    $contribution->reference,
                    $contribution->user->name ?? 'N/A',
                    $contribution->user->phone ?? 'N/A',
                    $contribution->savingsPlan->name ?? 'N/A',
                    $contribution->amount,
                    ucfirst($contribution->payment_method),
                    ucfirst($contribution->status),
                    $contribution->created_at->format('Y-m-d H:i:s'),
                    $contribution->completed_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

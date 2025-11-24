<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PendingTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TransferApprovalController extends Controller
{
    /**
     * Display a listing of pending transfers.
     */
    public function index(Request $request)
    {
        $query = PendingTransfer::with(['user', 'ajoGroup', 'platformBankAccount', 'approver', 'rejector']);

        // Status filter (default to awaiting_approval)
        $status = $request->get('status', 'awaiting_approval');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Group filter
        if ($request->filled('group_id')) {
            $query->where('ajo_group_id', $request->group_id);
        }

        $transfers = $query->latest()->paginate(30);

        // Statistics
        $stats = [
            'awaiting' => PendingTransfer::awaitingApproval()->count(),
            'pending' => PendingTransfer::pending()->count(),
            'approved_today' => PendingTransfer::approved()
                ->whereDate('approved_at', Carbon::today())
                ->count(),
            'rejected_today' => PendingTransfer::rejected()
                ->whereDate('rejected_at', Carbon::today())
                ->count(),
            'total_awaiting_amount' => PendingTransfer::awaitingApproval()->sum('amount'),
        ];

        return view('admin.transfers.index', compact('transfers', 'stats', 'status'));
    }

    /**
     * Display the specified transfer.
     */
    public function show(PendingTransfer $transfer)
    {
        $transfer->load(['user', 'ajoGroup', 'platformBankAccount', 'approver', 'rejector']);

        return view('admin.transfers.show', compact('transfer'));
    }

    /**
     * Approve a transfer.
     */
    public function approve(Request $request, PendingTransfer $transfer)
    {
        if (!$transfer->isAwaitingApproval()) {
            return back()->with('error', 'This transfer is not awaiting approval.');
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $transfer->approve(Auth::id(), $request->notes);

        return back()->with('success', 'Transfer approved successfully. Payment has been recorded.');
    }

    /**
     * Reject a transfer.
     */
    public function reject(Request $request, PendingTransfer $transfer)
    {
        if (!$transfer->isAwaitingApproval()) {
            return back()->with('error', 'This transfer is not awaiting approval.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $transfer->reject(Auth::id(), $request->reason);

        return back()->with('success', 'Transfer rejected.');
    }

    /**
     * Bulk approve transfers.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'transfer_ids' => 'required|array',
            'transfer_ids.*' => 'exists:pending_transfers,id',
        ]);

        $count = 0;
        foreach ($request->transfer_ids as $id) {
            $transfer = PendingTransfer::find($id);
            if ($transfer && $transfer->isAwaitingApproval()) {
                $transfer->approve(Auth::id());
                $count++;
            }
        }

        return back()->with('success', "{$count} transfers approved successfully.");
    }

    /**
     * Export transfers to CSV.
     */
    public function export(Request $request)
    {
        $query = PendingTransfer::with(['user', 'ajoGroup', 'platformBankAccount']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transfers = $query->get();

        $filename = 'transfers_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($transfers) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Reference',
                'User',
                'Group',
                'Amount',
                'Bank Account',
                'Status',
                'Claimed At',
                'Approved At',
                'Created At'
            ]);

            // Data rows
            foreach ($transfers as $transfer) {
                fputcsv($file, [
                    $transfer->reference,
                    $transfer->user->name ?? 'N/A',
                    $transfer->ajoGroup->name ?? 'N/A',
                    $transfer->amount,
                    $transfer->platformBankAccount->bank_name ?? 'N/A',
                    $transfer->status,
                    $transfer->transfer_claimed_at?->format('Y-m-d H:i:s'),
                    $transfer->approved_at?->format('Y-m-d H:i:s'),
                    $transfer->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

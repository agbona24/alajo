<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Earning;
use App\Models\User;
use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EarningsController extends Controller
{
    /**
     * Display earnings dashboard
     */
    public function index(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);
        $type = $request->get('type', 'all');

        // Build query
        $query = Earning::with(['user', 'savingsPlan', 'collector'])
            ->whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $earnings = $query->latest('earning_date')->paginate(20);

        // Summary statistics
        $summaryQuery = Earning::whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year);

        $summary = [
            'total_earnings' => (clone $summaryQuery)->sum('amount'),
            'company_fees' => (clone $summaryQuery)->where('type', Earning::TYPE_COMPANY_FEE)->sum('amount'),
            'collector_commissions' => (clone $summaryQuery)->where('type', Earning::TYPE_COLLECTOR_COMMISSION)->sum('amount'),
            'platform_fees' => (clone $summaryQuery)->where('type', Earning::TYPE_PLATFORM_FEE)->sum('amount'),
            'pending_count' => (clone $summaryQuery)->where('status', Earning::STATUS_PENDING)->count(),
            'processed_count' => (clone $summaryQuery)->where('status', Earning::STATUS_PROCESSED)->count(),
            'paid_out_count' => (clone $summaryQuery)->where('status', Earning::STATUS_PAID_OUT)->count(),
        ];

        // Daily breakdown for chart
        $dailyEarnings = Earning::whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year)
            ->selectRaw('earning_date, SUM(amount) as total')
            ->groupBy('earning_date')
            ->orderBy('earning_date')
            ->get()
            ->keyBy('earning_date');

        // All-time statistics
        $allTimeStats = [
            'total' => Earning::sum('amount'),
            'this_year' => Earning::whereYear('earning_date', $year)->sum('amount'),
            'pending_payout' => Earning::where('status', '!=', Earning::STATUS_PAID_OUT)->sum('amount'),
        ];

        return view('admin.earnings.index', compact(
            'earnings',
            'summary',
            'dailyEarnings',
            'allTimeStats',
            'month',
            'year',
            'type'
        ));
    }

    /**
     * Show earnings by collector
     */
    public function byCollector(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $collectors = User::where('role', 'collector')
            ->withCount(['collectorEarnings as earnings_count' => function($q) use ($month, $year) {
                $q->whereMonth('earning_date', $month)
                    ->whereYear('earning_date', $year);
            }])
            ->withSum(['collectorEarnings as earnings_sum' => function($q) use ($month, $year) {
                $q->whereMonth('earning_date', $month)
                    ->whereYear('earning_date', $year);
            }], 'amount')
            ->having('earnings_count', '>', 0)
            ->orWhere('role', 'collector')
            ->orderByDesc('earnings_sum')
            ->get();

        return view('admin.earnings.by-collector', compact('collectors', 'month', 'year'));
    }

    /**
     * Show detailed earnings for a specific collector
     */
    public function collectorDetail(Request $request, $collectorId)
    {
        $collector = User::where('role', 'collector')->findOrFail($collectorId);

        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $earnings = Earning::where('collector_id', $collectorId)
            ->whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year)
            ->with(['user', 'savingsPlan'])
            ->latest('earning_date')
            ->paginate(20);

        $summary = [
            'total' => Earning::where('collector_id', $collectorId)
                ->whereMonth('earning_date', $month)
                ->whereYear('earning_date', $year)
                ->sum('amount'),
            'pending' => Earning::where('collector_id', $collectorId)
                ->whereMonth('earning_date', $month)
                ->whereYear('earning_date', $year)
                ->where('status', Earning::STATUS_PENDING)
                ->sum('amount'),
            'paid_out' => Earning::where('collector_id', $collectorId)
                ->whereMonth('earning_date', $month)
                ->whereYear('earning_date', $year)
                ->where('status', Earning::STATUS_PAID_OUT)
                ->sum('amount'),
        ];

        return view('admin.earnings.collector-detail', compact('collector', 'earnings', 'summary', 'month', 'year'));
    }

    /**
     * Mark earnings as processed
     */
    public function markProcessed(Request $request)
    {
        $validated = $request->validate([
            'earning_ids' => 'required|array',
            'earning_ids.*' => 'exists:earnings,id',
        ]);

        Earning::whereIn('id', $validated['earning_ids'])
            ->where('status', Earning::STATUS_PENDING)
            ->update(['status' => Earning::STATUS_PROCESSED]);

        return back()->with('success', 'Selected earnings marked as processed.');
    }

    /**
     * Mark earnings as paid out
     */
    public function markPaidOut(Request $request)
    {
        $validated = $request->validate([
            'earning_ids' => 'required|array',
            'earning_ids.*' => 'exists:earnings,id',
        ]);

        Earning::whereIn('id', $validated['earning_ids'])
            ->whereIn('status', [Earning::STATUS_PENDING, Earning::STATUS_PROCESSED])
            ->update([
                'status' => Earning::STATUS_PAID_OUT,
                'paid_out_at' => now(),
            ]);

        return back()->with('success', 'Selected earnings marked as paid out.');
    }

    /**
     * Export earnings report
     */
    public function export(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);
        $type = $request->get('type', 'all');

        $query = Earning::with(['user', 'savingsPlan', 'collector'])
            ->whereMonth('earning_date', $month)
            ->whereYear('earning_date', $year);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $earnings = $query->orderBy('earning_date')->get();

        $filename = "earnings_report_{$year}_{$month}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($earnings) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Date',
                'Reference',
                'Member',
                'Savings Plan',
                'Type',
                'Amount',
                'Status',
                'Collector',
                'Description'
            ]);

            foreach ($earnings as $earning) {
                fputcsv($file, [
                    $earning->earning_date->format('Y-m-d'),
                    $earning->reference,
                    $earning->user->name ?? 'N/A',
                    $earning->savingsPlan->name ?? 'N/A',
                    ucfirst(str_replace('_', ' ', $earning->type)),
                    number_format($earning->amount, 2),
                    ucfirst(str_replace('_', ' ', $earning->status)),
                    $earning->collector->name ?? 'N/A',
                    $earning->description ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

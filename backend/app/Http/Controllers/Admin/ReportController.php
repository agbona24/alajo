<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AjoGroup;
use App\Models\Transaction;
use App\Models\DailyPayment;
use App\Models\AjoPayout;
use App\Models\SavingsPlan;
use App\Models\Contribution;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display reports dashboard.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'week');

        // Calculate date range based on period
        $now = Carbon::now();
        switch ($period) {
            case 'today':
                $startDate = $now->copy()->startOfDay();
                $prevStartDate = $now->copy()->subDay()->startOfDay();
                $prevEndDate = $now->copy()->subDay()->endOfDay();
                break;
            case 'month':
                $startDate = $now->copy()->startOfMonth();
                $prevStartDate = $now->copy()->subMonth()->startOfMonth();
                $prevEndDate = $now->copy()->subMonth()->endOfMonth();
                break;
            case 'year':
                $startDate = $now->copy()->startOfYear();
                $prevStartDate = $now->copy()->subYear()->startOfYear();
                $prevEndDate = $now->copy()->subYear()->endOfYear();
                break;
            default: // week
                $startDate = $now->copy()->startOfWeek();
                $prevStartDate = $now->copy()->subWeek()->startOfWeek();
                $prevEndDate = $now->copy()->subWeek()->endOfWeek();
        }
        $endDate = $now;

        // Total Revenue (completed transactions + contributions)
        $totalRevenue = Transaction::where('status', 'completed')
            ->where('type', 'contribution')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        $prevRevenue = Transaction::where('status', 'completed')
            ->where('type', 'contribution')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('amount');

        $revenueGrowth = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;

        // Total Collections
        $totalCollections = Contribution::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        $collectionCount = Contribution::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Total Payouts (Withdrawals)
        $totalPayouts = Withdrawal::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        $payoutCount = Withdrawal::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // New Users
        $newUsers = User::whereBetween('created_at', [$startDate, $endDate])->count();
        $activeUsers = User::where('status', 'active')->count();

        // Daily Collections for chart
        $dailyCollections = [];
        $maxCollection = 0;

        if ($period === 'today') {
            // Hourly breakdown for today
            for ($i = 0; $i < 24; $i++) {
                $hourStart = $now->copy()->startOfDay()->addHours($i);
                $hourEnd = $hourStart->copy()->addHour();
                $amount = Contribution::where('status', 'completed')
                    ->whereBetween('created_at', [$hourStart, $hourEnd])
                    ->sum('amount');
                $dailyCollections[] = [
                    'label' => $hourStart->format('H:00'),
                    'amount' => $amount,
                ];
                $maxCollection = max($maxCollection, $amount);
            }
        } else {
            // Daily breakdown
            $days = $period === 'year' ? 12 : ($period === 'month' ? 30 : 7);
            for ($i = $days - 1; $i >= 0; $i--) {
                if ($period === 'year') {
                    $date = $now->copy()->subMonths($i);
                    $dayStart = $date->copy()->startOfMonth();
                    $dayEnd = $date->copy()->endOfMonth();
                    $label = $date->format('M');
                } else {
                    $date = $now->copy()->subDays($i);
                    $dayStart = $date->copy()->startOfDay();
                    $dayEnd = $date->copy()->endOfDay();
                    $label = $date->format('D');
                }
                $amount = Contribution::where('status', 'completed')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->sum('amount');
                $dailyCollections[] = [
                    'label' => $label,
                    'amount' => $amount,
                ];
                $maxCollection = max($maxCollection, $amount);
            }
        }

        // Ensure maxCollection is at least 1 to prevent division by zero
        $maxCollection = max($maxCollection, 1);

        // Group Stats
        $groupStats = [
            'total' => AjoGroup::count() ?: SavingsPlan::count(),
            'active' => AjoGroup::where('status', 'active')->count() ?: SavingsPlan::where('status', 'active')->count(),
            'pending' => AjoGroup::where('status', 'pending')->count() ?: SavingsPlan::where('status', 'paused')->count(),
            'completed' => AjoGroup::where('status', 'completed')->count() ?: SavingsPlan::where('status', 'completed')->count(),
        ];

        // Top Collectors - simplified query
        $topCollectors = User::where('role', 'collector')
            ->get()
            ->map(function ($collector) use ($startDate, $endDate) {
                // Count members assigned to this collector
                $membersCount = User::where('collector_id', $collector->id)->count();

                // Get total collected from members' contributions
                $memberIds = User::where('collector_id', $collector->id)->pluck('id');
                $totalCollected = Contribution::whereIn('user_id', $memberIds)
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('amount');

                // Count groups created by collector
                $groupsCount = AjoGroup::where('creator_id', $collector->id)->count();

                return [
                    'name' => $collector->name,
                    'groups_count' => $groupsCount,
                    'members_count' => $membersCount,
                    'total_collected' => $totalCollected,
                ];
            })
            ->sortByDesc('total_collected')
            ->take(5)
            ->values();

        // Recent Activity
        $recentActivity = Transaction::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'type' => $transaction->type,
                    'description' => ($transaction->user->name ?? 'User') . ' - ' . ucfirst($transaction->type),
                    'amount' => $transaction->amount,
                    'time' => $transaction->created_at->diffForHumans(),
                ];
            });

        return view('admin.reports.index', compact(
            'totalRevenue',
            'revenueGrowth',
            'totalCollections',
            'collectionCount',
            'totalPayouts',
            'payoutCount',
            'newUsers',
            'activeUsers',
            'dailyCollections',
            'maxCollection',
            'groupStats',
            'topCollectors',
            'recentActivity'
        ));
    }

    /**
     * Export report to CSV.
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'transactions');
        $filename = $type . '_report_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($type) {
            $file = fopen('php://output', 'w');

            switch ($type) {
                case 'users':
                    fputcsv($file, ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined']);
                    foreach (User::all() as $user) {
                        fputcsv($file, [
                            $user->id,
                            $user->name,
                            $user->email,
                            $user->phone,
                            $user->role,
                            $user->status,
                            $user->created_at->format('Y-m-d'),
                        ]);
                    }
                    break;

                case 'groups':
                    fputcsv($file, ['ID', 'Name', 'Contribution', 'Frequency', 'Members', 'Status', 'Created']);
                    foreach (AjoGroup::withCount('members')->get() as $group) {
                        fputcsv($file, [
                            $group->id,
                            $group->name,
                            $group->contribution_amount,
                            $group->frequency,
                            $group->members_count,
                            $group->status,
                            $group->created_at->format('Y-m-d'),
                        ]);
                    }
                    break;

                case 'collectors':
                    fputcsv($file, ['ID', 'Name', 'Email', 'Phone', 'Status', 'Groups', 'Joined']);
                    foreach (User::collectors()->withCount('createdAjoGroups')->get() as $collector) {
                        fputcsv($file, [
                            $collector->id,
                            $collector->name,
                            $collector->email,
                            $collector->phone,
                            $collector->status,
                            $collector->created_ajo_groups_count,
                            $collector->created_at->format('Y-m-d'),
                        ]);
                    }
                    break;

                default: // transactions
                    fputcsv($file, ['ID', 'User', 'Type', 'Amount', 'Status', 'Date']);
                    foreach (Transaction::with('user')->get() as $transaction) {
                        fputcsv($file, [
                            $transaction->id,
                            $transaction->user->name ?? 'N/A',
                            $transaction->type,
                            $transaction->amount,
                            $transaction->status,
                            $transaction->created_at->format('Y-m-d H:i:s'),
                        ]);
                    }
                    break;
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * User growth report.
     */
    public function userGrowth(Request $request)
    {
        $period = $request->get('period', 'monthly');
        $fromDate = $request->get('from_date', Carbon::now()->subMonths(6)->format('Y-m-d'));
        $toDate = $request->get('to_date', Carbon::now()->format('Y-m-d'));

        $query = User::whereBetween('created_at', [$fromDate, $toDate]);

        if ($period === 'daily') {
            $data = $query->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN role = "collector" THEN 1 ELSE 0 END) as collectors'),
                DB::raw('SUM(CASE WHEN role = "user" THEN 1 ELSE 0 END) as users')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        } else {
            $data = $query->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN role = "collector" THEN 1 ELSE 0 END) as collectors'),
                DB::raw('SUM(CASE WHEN role = "user" THEN 1 ELSE 0 END) as users')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
        }

        return view('admin.reports.user-growth', compact('data', 'period', 'fromDate', 'toDate'));
    }

    /**
     * Collection performance report.
     */
    public function collectionPerformance(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $toDate = $request->get('to_date', Carbon::now()->format('Y-m-d'));

        // Overall collection stats
        $totalExpected = DailyPayment::whereBetween('payment_date', [$fromDate, $toDate])->count();
        $totalPaid = DailyPayment::whereBetween('payment_date', [$fromDate, $toDate])
            ->where('status', 'paid')->count();
        $totalMissed = DailyPayment::whereBetween('payment_date', [$fromDate, $toDate])
            ->where('status', 'missed')->count();

        $collectionRate = $totalExpected > 0 ? round(($totalPaid / $totalExpected) * 100, 1) : 0;

        // Collection by group
        $byGroup = DailyPayment::select(
            'ajo_group_id',
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid'),
            DB::raw('SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as amount_collected')
        )
        ->whereBetween('payment_date', [$fromDate, $toDate])
        ->groupBy('ajo_group_id')
        ->with('ajoGroup:id,name')
        ->get();

        // Collection by collector
        $byCollector = DailyPayment::select(
            'recorded_by',
            DB::raw('COUNT(*) as total_recorded'),
            DB::raw('SUM(amount) as total_amount')
        )
        ->whereBetween('payment_date', [$fromDate, $toDate])
        ->where('status', 'paid')
        ->whereNotNull('recorded_by')
        ->groupBy('recorded_by')
        ->with('recorder:id,name')
        ->get();

        // Daily trend
        $dailyTrend = DailyPayment::select(
            'payment_date',
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid'),
            DB::raw('SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as amount')
        )
        ->whereBetween('payment_date', [$fromDate, $toDate])
        ->groupBy('payment_date')
        ->orderBy('payment_date')
        ->get();

        return view('admin.reports.collection-performance', compact(
            'totalExpected',
            'totalPaid',
            'totalMissed',
            'collectionRate',
            'byGroup',
            'byCollector',
            'dailyTrend',
            'fromDate',
            'toDate'
        ));
    }

    /**
     * Financial summary report.
     */
    public function financialSummary(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $toDate = $request->get('to_date', Carbon::now()->format('Y-m-d'));

        // Transaction summary
        $transactionSummary = Transaction::select(
            'type',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(amount) as total_amount'),
            DB::raw('SUM(CASE WHEN status = "completed" THEN amount ELSE 0 END) as completed_amount'),
            DB::raw('SUM(CASE WHEN status = "pending" THEN amount ELSE 0 END) as pending_amount')
        )
        ->whereBetween('created_at', [$fromDate, $toDate])
        ->groupBy('type')
        ->get();

        // Payout summary
        $payoutSummary = [
            'total_payouts' => AjoPayout::whereBetween('created_at', [$fromDate, $toDate])->count(),
            'completed_payouts' => AjoPayout::whereBetween('created_at', [$fromDate, $toDate])
                ->where('status', 'completed')->count(),
            'total_payout_amount' => AjoPayout::whereBetween('created_at', [$fromDate, $toDate])
                ->where('status', 'completed')->sum('payout_amount'),
            'total_fees' => AjoPayout::whereBetween('created_at', [$fromDate, $toDate])
                ->where('status', 'completed')->sum('organizer_fee'),
        ];

        // Daily collection summary
        $dailyCollectionSummary = [
            'total_collected' => DailyPayment::whereBetween('payment_date', [$fromDate, $toDate])
                ->where('status', 'paid')->sum('amount'),
            'total_payments' => DailyPayment::whereBetween('payment_date', [$fromDate, $toDate])
                ->where('status', 'paid')->count(),
        ];

        return view('admin.reports.financial-summary', compact(
            'transactionSummary',
            'payoutSummary',
            'dailyCollectionSummary',
            'fromDate',
            'toDate'
        ));
    }

    /**
     * Group performance report.
     */
    public function groupPerformance(Request $request)
    {
        $groups = AjoGroup::withCount(['members', 'dailyPayments', 'payouts'])
            ->with(['creator:id,name'])
            ->get()
            ->map(function ($group) {
                $paidPayments = $group->dailyPayments()->where('status', 'paid')->count();
                $totalPayments = $group->daily_payments_count;

                $group->collection_rate = $totalPayments > 0
                    ? round(($paidPayments / $totalPayments) * 100, 1)
                    : 0;
                $group->total_collected = $group->dailyPayments()
                    ->where('status', 'paid')
                    ->sum('amount');

                return $group;
            })
            ->sortByDesc('collection_rate');

        return view('admin.reports.group-performance', compact('groups'));
    }
}

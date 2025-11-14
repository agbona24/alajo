<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics.
     */
    public function statistics(Request $request)
    {
        try {
            $stats = [
                // User statistics
                'users' => [
                    'total' => User::count(),
                    'active' => User::where('is_active', true)->count(),
                    'verified' => User::where('is_verified', true)->count(),
                    'admins' => User::where('role', 'admin')->count(),
                    'new_this_month' => User::whereMonth('created_at', now()->month)
                                             ->whereYear('created_at', now()->year)
                                             ->count(),
                    'by_tier' => [
                        'basic' => User::where('account_tier', 'basic')->count(),
                        'silver' => User::where('account_tier', 'silver')->count(),
                        'gold' => User::where('account_tier', 'gold')->count(),
                    ],
                ],

                // Savings statistics
                'savings' => [
                    'total_plans' => SavingsPlan::count(),
                    'active_plans' => SavingsPlan::where('status', 'active')->count(),
                    'completed_plans' => SavingsPlan::where('status', 'completed')->count(),
                    'paused_plans' => SavingsPlan::where('status', 'paused')->count(),
                    'total_value_locked' => SavingsPlan::sum('current_balance'),
                    'total_target' => SavingsPlan::where('status', 'active')->sum('target_amount'),
                    'average_balance' => SavingsPlan::avg('current_balance'),
                    'by_frequency' => [
                        'daily' => SavingsPlan::where('frequency', 'daily')->count(),
                        'weekly' => SavingsPlan::where('frequency', 'weekly')->count(),
                        'monthly' => SavingsPlan::where('frequency', 'monthly')->count(),
                    ],
                ],

                // Transaction statistics
                'transactions' => [
                    'total' => Transaction::count(),
                    'total_volume' => Transaction::where('status', 'completed')->sum('amount'),
                    'total_fees' => Transaction::sum('fee'),
                    'deposits' => [
                        'count' => Transaction::where('type', 'deposit')->count(),
                        'volume' => Transaction::where('type', 'deposit')->sum('amount'),
                    ],
                    'withdrawals' => [
                        'count' => Transaction::where('type', 'withdrawal')->count(),
                        'volume' => Transaction::where('type', 'withdrawal')->sum('amount'),
                    ],
                    'this_month' => [
                        'count' => Transaction::whereMonth('created_at', now()->month)
                                              ->whereYear('created_at', now()->year)
                                              ->count(),
                        'volume' => Transaction::whereMonth('created_at', now()->month)
                                               ->whereYear('created_at', now()->year)
                                               ->sum('amount'),
                    ],
                ],

                // Withdrawal requests
                'withdrawal_requests' => [
                    'pending' => Withdrawal::where('status', 'pending')->count(),
                    'approved' => Withdrawal::where('status', 'approved')->count(),
                    'rejected' => Withdrawal::where('status', 'rejected')->count(),
                    'completed' => Withdrawal::where('status', 'completed')->count(),
                    'pending_amount' => Withdrawal::where('status', 'pending')->sum('amount'),
                ],

                // Contributions statistics
                'contributions' => [
                    'total' => Contribution::count(),
                    'paid' => Contribution::where('status', 'paid')->count(),
                    'missed' => Contribution::where('status', 'missed')->count(),
                    'pending' => Contribution::where('status', 'pending')->count(),
                    'total_contributed' => Contribution::where('status', 'paid')->sum('amount'),
                    'this_month' => Contribution::whereMonth('contribution_date', now()->month)
                                                 ->whereYear('contribution_date', now()->year)
                                                 ->where('status', 'paid')
                                                 ->count(),
                ],

                // Growth metrics
                'growth' => [
                    'user_growth_rate' => $this->calculateGrowthRate('users'),
                    'savings_growth_rate' => $this->calculateGrowthRate('savings_plans'),
                    'transaction_growth_rate' => $this->calculateGrowthRate('transactions'),
                ],
            ];

            return response()->json([
                'message' => 'Dashboard statistics retrieved successfully',
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
     * Get recent activity.
     */
    public function recentActivity(Request $request)
    {
        try {
            $limit = $request->input('limit', 20);

            $activity = [
                'recent_users' => User::latest()->limit($limit)->get(),
                'recent_transactions' => Transaction::with('user', 'savingsPlan')
                                                   ->latest()
                                                   ->limit($limit)
                                                   ->get(),
                'pending_withdrawals' => Withdrawal::with('user', 'savingsPlan')
                                                   ->where('status', 'pending')
                                                   ->latest()
                                                   ->limit($limit)
                                                   ->get(),
            ];

            return response()->json([
                'message' => 'Recent activity retrieved successfully',
                'data' => $activity,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve recent activity',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get transaction trends.
     */
    public function trends(Request $request)
    {
        try {
            $days = $request->input('days', 30);

            $trends = DB::table('transactions')
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(amount) as volume'),
                    DB::raw('SUM(CASE WHEN type = "deposit" THEN amount ELSE 0 END) as deposits'),
                    DB::raw('SUM(CASE WHEN type = "withdrawal" THEN amount ELSE 0 END) as withdrawals')
                )
                ->where('created_at', '>=', now()->subDays($days))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'message' => 'Transaction trends retrieved successfully',
                'data' => $trends,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve trends',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calculate growth rate (this month vs last month).
     */
    private function calculateGrowthRate(string $table): float
    {
        $thisMonth = DB::table($table)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $lastMonth = DB::table($table)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        if ($lastMonth == 0) {
            return $thisMonth > 0 ? 100 : 0;
        }

        return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 2);
    }
}

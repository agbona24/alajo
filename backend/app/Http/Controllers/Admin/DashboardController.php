<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AjoGroup;
use App\Models\Transaction;
use App\Models\DailyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with platform statistics.
     */
    public function index()
    {
        // Overall platform statistics
        $stats = [
            'total_users' => User::count(),
            'total_collectors' => User::collectors()->count(),
            'total_admins' => User::admins()->count(),
            'active_users' => User::activeUsers()->count(),
            'suspended_users' => User::where('status', User::STATUS_SUSPENDED)->count(),

            // Group statistics
            'total_groups' => AjoGroup::count(),
            'active_groups' => AjoGroup::where('status', 'active')->count(),
            'pending_groups' => AjoGroup::where('status', 'pending')->count(),
            'completed_groups' => AjoGroup::where('status', 'completed')->count(),

            // Financial statistics
            'total_transactions' => Transaction::count(),
            'total_volume' => Transaction::where('status', 'completed')->sum('amount'),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),

            // Today's statistics
            'today_payments' => DailyPayment::whereDate('payment_date', Carbon::today())->count(),
            'today_payments_amount' => DailyPayment::whereDate('payment_date', Carbon::today())
                ->where('status', 'paid')
                ->sum('amount'),
            'today_new_users' => User::whereDate('created_at', Carbon::today())->count(),
        ];

        // Recent activities
        $recentUsers = User::latest()->take(5)->get();
        $recentGroups = AjoGroup::with('creator')->latest()->take(5)->get();
        $recentTransactions = Transaction::with('user')->latest()->take(10)->get();

        // Monthly trends (last 6 months)
        $monthlyTrends = $this->getMonthlyTrends();

        return view('admin.dashboard', compact(
            'stats',
            'recentUsers',
            'recentGroups',
            'recentTransactions',
            'monthlyTrends'
        ));
    }

    /**
     * Get monthly trends for charts.
     */
    private function getMonthlyTrends(): array
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push([
                'month' => $date->format('M Y'),
                'users' => User::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'groups' => AjoGroup::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'transactions' => Transaction::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('amount'),
            ]);
        }

        return $months->toArray();
    }
}

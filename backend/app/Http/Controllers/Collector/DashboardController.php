<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\DailyPayment;
use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\Contribution;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the collector dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get groups where this collector is an admin
        $managedGroups = AjoGroup::whereHas('members', function ($q) use ($user) {
            $q->where('user_id', $user->id)->where('is_admin', true);
        })->with(['members.user'])->get();

        // Get all members registered under this collector
        $myMembers = User::where('collector_id', $user->id)
            ->with(['savingsPlans', 'contributions', 'withdrawals'])
            ->get();

        // Member statistics
        $memberStats = [
            'total_members' => $myMembers->count(),
            'active_members' => $myMembers->where('status', 'active')->count(),
            'total_savings' => SavingsPlan::whereIn('user_id', $myMembers->pluck('id'))
                ->sum('current_balance'),
            'total_contributions' => Contribution::whereIn('user_id', $myMembers->pluck('id'))
                ->where('status', 'completed')
                ->sum('amount'),
            'total_withdrawals' => Withdrawal::whereIn('user_id', $myMembers->pluck('id'))
                ->where('status', 'completed')
                ->sum('amount'),
            'this_month_contributions' => Contribution::whereIn('user_id', $myMembers->pluck('id'))
                ->where('status', 'completed')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('amount'),
        ];

        // Recent member activities
        $recentMemberContributions = Contribution::whereIn('user_id', $myMembers->pluck('id'))
            ->with(['user', 'savingsPlan'])
            ->latest()
            ->take(5)
            ->get();

        $recentMemberWithdrawals = Withdrawal::whereIn('user_id', $myMembers->pluck('id'))
            ->with(['user', 'savingsPlan'])
            ->latest()
            ->take(5)
            ->get();

        // Today's statistics
        $today = Carbon::today();
        $groupIds = $managedGroups->pluck('id');

        $todayStats = [
            'expected_payments' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->whereDate('payment_date', $today)
                ->count(),
            'received_payments' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->whereDate('payment_date', $today)
                ->where('status', 'paid')
                ->count(),
            'pending_payments' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->whereDate('payment_date', $today)
                ->where('status', 'pending')
                ->count(),
            'amount_collected' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->whereDate('payment_date', $today)
                ->where('status', 'paid')
                ->sum('amount'),
        ];

        // This week's statistics
        $weekStart = Carbon::now()->startOfWeek();
        $weekStats = [
            'total_collected' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->where('payment_date', '>=', $weekStart)
                ->where('status', 'paid')
                ->sum('amount'),
            'total_payments' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->where('payment_date', '>=', $weekStart)
                ->where('status', 'paid')
                ->count(),
        ];

        // This month's statistics
        $monthStart = Carbon::now()->startOfMonth();
        $monthStats = [
            'total_collected' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->where('payment_date', '>=', $monthStart)
                ->where('status', 'paid')
                ->sum('amount'),
            'total_payments' => DailyPayment::whereIn('ajo_group_id', $groupIds)
                ->where('payment_date', '>=', $monthStart)
                ->where('status', 'paid')
                ->count(),
            'collection_rate' => $this->calculateCollectionRate($groupIds, $monthStart),
        ];

        // Recent payments
        $recentPayments = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->with(['user', 'ajoGroup'])
            ->latest()
            ->take(10)
            ->get();

        // Members with pending payments today
        $pendingToday = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->whereDate('payment_date', $today)
            ->where('status', 'pending')
            ->with(['user', 'ajoGroup'])
            ->get();

        return view('collector.dashboard', compact(
            'managedGroups',
            'todayStats',
            'weekStats',
            'monthStats',
            'recentPayments',
            'pendingToday',
            'myMembers',
            'memberStats',
            'recentMemberContributions',
            'recentMemberWithdrawals'
        ));
    }

    /**
     * Calculate collection rate for a period.
     */
    private function calculateCollectionRate($groupIds, $fromDate): float
    {
        $expected = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->where('payment_date', '>=', $fromDate)
            ->count();

        $paid = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->where('payment_date', '>=', $fromDate)
            ->where('status', 'paid')
            ->count();

        return $expected > 0 ? round(($paid / $expected) * 100, 1) : 0;
    }
}

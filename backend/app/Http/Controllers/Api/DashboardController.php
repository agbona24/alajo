<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary()
    {
        $user = Auth::user();

        // Get savings summary
        $savingsSummary = $user->savingsPlans()
            ->selectRaw("
                COUNT(*) as total_plans,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_plans,
                SUM(current_amount) as total_savings,
                SUM(target_amount) as total_target
            ")
            ->first();

        // Get total withdrawn
        $totalWithdrawn = $user->withdrawals()
            ->where('status', 'completed')
            ->sum('amount');

        // Get recent activity (last 10 transactions)
        $recentActivity = $user->transactions()
            ->with('savingsPlan')
            ->latest()
            ->take(10)
            ->get();

        // Get active savings plans with progress
        $activePlans = $user->savingsPlans()
            ->where('status', 'active')
            ->with('contributions')
            ->latest()
            ->take(5)
            ->get();

        // Get Ajo groups summary
        $ajoSummary = DB::table('ajo_members')
            ->join('ajo_groups', 'ajo_members.ajo_group_id', '=', 'ajo_groups.id')
            ->where('ajo_members.user_id', $user->id)
            ->selectRaw("
                COUNT(*) as total_groups,
                SUM(CASE WHEN ajo_groups.status = 'active' THEN 1 ELSE 0 END) as active_groups,
                SUM(ajo_members.total_contributed) as total_contributed
            ")
            ->first();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
            'savings' => [
                'total_savings' => $savingsSummary->total_savings ?? 0,
                'total_target' => $savingsSummary->total_target ?? 0,
                'total_plans' => $savingsSummary->total_plans ?? 0,
                'active_plans' => $savingsSummary->active_plans ?? 0,
                'total_withdrawn' => $totalWithdrawn,
            ],
            'ajo' => [
                'total_groups' => $ajoSummary->total_groups ?? 0,
                'active_groups' => $ajoSummary->active_groups ?? 0,
                'total_contributed' => $ajoSummary->total_contributed ?? 0,
            ],
            'recent_activity' => $recentActivity,
            'active_savings_plans' => $activePlans,
        ]);
    }

    public function stats()
    {
        $user = Auth::user();

        // Monthly contribution trends (last 6 months)
        $monthlyTrends = $user->contributions()
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw("
                EXTRACT(MONTH FROM created_at) as month,
                EXTRACT(YEAR FROM created_at) as year,
                SUM(amount) as total_amount,
                COUNT(*) as count
            ")
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        // Breakdown by plan type
        $planTypeBreakdown = $user->savingsPlans()
            ->selectRaw('
                plan_type,
                COUNT(*) as count,
                SUM(current_amount) as total_amount
            ')
            ->groupBy('plan_type')
            ->get();

        return response()->json([
            'monthly_trends' => $monthlyTrends,
            'plan_type_breakdown' => $planTypeBreakdown,
        ]);
    }
}

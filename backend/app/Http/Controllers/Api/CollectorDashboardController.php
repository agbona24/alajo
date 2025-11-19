<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CollectorDashboardController extends Controller
{
    /**
     * Get collector dashboard stats
     */
    public function stats()
    {
        $collector = Auth::user();

        // Get groups where user is a collector (admin)
        $groupIds = AjoMember::where('user_id', $collector->id)
            ->where('is_admin', true)
            ->pluck('ajo_group_id');

        $groups = AjoGroup::whereIn('id', $groupIds)
            ->with(['ajoMembers' => function ($query) {
                $query->where('status', 'active');
            }])
            ->get();

        // Calculate today's stats
        $today = now()->format('Y-m-d');
        $todayStats = [
            'total_collected' => 0,
            'total_expected' => 0,
            'total_members' => 0,
            'paid_members' => 0,
        ];

        $groupsData = [];

        foreach ($groups as $group) {
            $membersCount = $group->ajoMembers->count();
            $todayExpected = $group->contribution_amount * $membersCount;

            $todayStats['total_expected'] += $todayExpected;
            $todayStats['total_members'] += $membersCount;

            // Get actual payment tracking for today
            $todayPayments = DailyPayment::forGroup($group->id)
                ->forDate($today)
                ->get();

            $paidToday = $todayPayments->where('status', 'paid')->count();
            $collectedToday = $todayPayments->where('status', 'paid')->sum('amount');

            $todayStats['paid_members'] += $paidToday;
            $todayStats['total_collected'] += $collectedToday;

            // Get month stats
            $monthStart = now()->startOfMonth()->format('Y-m-d');
            $monthEnd = now()->endOfMonth()->format('Y-m-d');

            $monthPayments = DailyPayment::forGroup($group->id)
                ->forDateRange($monthStart, $monthEnd)
                ->where('status', 'paid')
                ->sum('amount');

            $monthlyTarget = $group->contribution_amount * $membersCount * now()->daysInMonth;

            $groupsData[] = [
                'id' => $group->id,
                'name' => $group->name,
                'code' => $group->group_code,
                'members' => $membersCount,
                'daily_amount' => $group->contribution_amount,
                'monthly_target' => $monthlyTarget,
                'collected' => $monthPayments,
                'pending' => $monthlyTarget - $monthPayments,
                'status' => $group->status,
                'last_collection' => $group->updated_at,
                'today_paid' => $paidToday,
                'today_total' => $membersCount,
            ];
        }

        return response()->json([
            'collector_name' => $collector->name,
            'total_groups' => $groups->count(),
            'today_stats' => $todayStats,
            'groups' => $groupsData,
        ]);
    }
}

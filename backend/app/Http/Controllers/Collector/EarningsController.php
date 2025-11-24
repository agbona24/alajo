<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\DailyPayment;
use App\Models\AjoPayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EarningsController extends Controller
{
    /**
     * Display the collector's earnings overview.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->get('period', 'week');

        // Get groups managed by this collector
        $managedGroups = AjoGroup::whereHas('members', function ($q) use ($user) {
            $q->where('user_id', $user->id)->where('is_admin', true);
        })->get();

        $groupIds = $managedGroups->pluck('id');

        // Get organizer fees from completed payouts
        $organizerFees = AjoPayout::whereIn('ajo_group_id', $groupIds)
            ->where('status', 'completed')
            ->with('ajoGroup')
            ->get();

        // Calculate total earnings
        $totalEarnings = $organizerFees->sum('organizer_fee');

        // Period earnings based on filter
        $periodStart = match ($period) {
            'today' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfWeek(),
        };

        $periodEarnings = $organizerFees
            ->where('created_at', '>=', $periodStart)
            ->sum('organizer_fee');

        // Collection stats
        $collectionsCount = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->where('status', 'paid')
            ->where('created_at', '>=', $periodStart)
            ->count();

        // Average commission (if applicable)
        $avgCommission = $managedGroups->avg('organizer_fee_percentage') ?? 5;

        // Create earnings collection from payouts for display
        $earnings = $organizerFees->sortByDesc('created_at')->values()->map(function ($payout) {
            return (object) [
                'description' => 'Payout Commission',
                'ajoGroup' => $payout->ajoGroup,
                'created_at' => $payout->created_at,
                'amount' => $payout->organizer_fee,
                'commission_rate' => $payout->ajoGroup->organizer_fee_percentage ?? 5,
            ];
        });

        return view('collector.earnings.index', compact(
            'totalEarnings',
            'periodEarnings',
            'collectionsCount',
            'avgCommission',
            'earnings'
        ));
    }

    /**
     * Display detailed earnings for a specific group.
     */
    public function show(AjoGroup $group)
    {
        $this->authorizeCollector($group);

        // Get payouts with organizer fees
        $payouts = AjoPayout::where('ajo_group_id', $group->id)
            ->where('status', 'completed')
            ->with(['user', 'member'])
            ->orderByDesc('created_at')
            ->paginate(20);

        // Calculate group-specific earnings
        $earnings = [
            'total_fees' => AjoPayout::where('ajo_group_id', $group->id)
                ->where('status', 'completed')
                ->sum('organizer_fee'),
            'this_month_fees' => AjoPayout::where('ajo_group_id', $group->id)
                ->where('status', 'completed')
                ->where('created_at', '>=', Carbon::now()->startOfMonth())
                ->sum('organizer_fee'),
            'total_payouts' => AjoPayout::where('ajo_group_id', $group->id)
                ->where('status', 'completed')
                ->count(),
            'pending_payouts' => AjoPayout::where('ajo_group_id', $group->id)
                ->where('status', 'pending')
                ->count(),
        ];

        // Collection summary
        $collection = [
            'total_collected' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('status', 'paid')
                ->sum('amount'),
            'total_payments' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('status', 'paid')
                ->count(),
            'this_month_collected' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('status', 'paid')
                ->where('created_at', '>=', Carbon::now()->startOfMonth())
                ->sum('amount'),
        ];

        return view('collector.earnings.show', compact('group', 'payouts', 'earnings', 'collection'));
    }

    /**
     * Authorize that the current user is a collector/admin for this group.
     */
    private function authorizeCollector(AjoGroup $group): void
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return;
        }

        $member = $group->members()->where('user_id', $user->id)->first();

        if (!$member || !$member->is_admin) {
            abort(403, 'You are not authorized to view this group.');
        }
    }
}

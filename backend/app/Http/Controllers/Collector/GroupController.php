<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class GroupController extends Controller
{
    /**
     * Display a listing of groups managed by this collector.
     */
    public function index()
    {
        $user = Auth::user();

        $groups = AjoGroup::whereHas('members', function ($q) use ($user) {
            $q->where('user_id', $user->id)->where('is_admin', true);
        })
        ->withCount(['members'])
        ->with(['members' => fn($q) => $q->where('status', 'active')])
        ->get()
        ->map(function ($group) {
            // Calculate today's collection stats
            $today = Carbon::today();
            $group->today_expected = DailyPayment::where('ajo_group_id', $group->id)
                ->whereDate('payment_date', $today)
                ->count();
            $group->today_collected = DailyPayment::where('ajo_group_id', $group->id)
                ->whereDate('payment_date', $today)
                ->where('status', 'paid')
                ->count();

            return $group;
        });

        return view('collector.groups.index', compact('groups'));
    }

    /**
     * Store a newly created group.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'contribution_amount' => 'required|numeric|min:100',
            'frequency' => 'required|in:daily,weekly,monthly',
            'max_members' => 'nullable|integer|min:2|max:100',
            'duration' => 'nullable|integer|min:1',
        ]);

        // Generate unique group code
        $groupCode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

        $group = AjoGroup::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'contribution_amount' => $validated['contribution_amount'],
            'frequency' => $validated['frequency'],
            'group_size' => $validated['max_members'] ?? 10,
            'duration_cycles' => $validated['duration'] ?? 12,
            'group_code' => $groupCode,
            'creator_id' => $user->id,
            'status' => 'active',
        ]);

        // Add creator as admin member
        $group->members()->create([
            'user_id' => $user->id,
            'position' => 1,
            'status' => 'active',
            'is_admin' => true,
            'joined_at' => now(),
        ]);

        return redirect()->route('collector.groups.show', $group)
            ->with('success', 'Group created successfully! Share code: ' . $groupCode);
    }

    /**
     * Display the specified group.
     */
    public function show(AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $group->load(['members.user', 'activities' => fn($q) => $q->latest()->take(20)]);

        // Group statistics
        $stats = [
            'total_members' => $group->members->count(),
            'active_members' => $group->members->where('status', 'active')->count(),
            'total_contributed' => $group->members->sum('total_contributed'),
            'expected_total' => $group->contribution_amount * $group->group_size * 31, // Ajo policy: 1 month = 31 days
        ];

        // Today's status
        $today = Carbon::today();
        $todayPayments = DailyPayment::where('ajo_group_id', $group->id)
            ->whereDate('payment_date', $today)
            ->with(['user'])
            ->get();

        return view('collector.groups.show', compact('group', 'stats', 'todayPayments'));
    }

    /**
     * Display the cashbook for a group (30-day payment grid).
     */
    public function cashbook(AjoGroup $group, Request $request)
    {
        $this->authorizeCollector($group);

        // Get the month to display (default to current month)
        $month = $request->get('month', Carbon::now()->format('Y-m'));
        $startDate = Carbon::parse($month)->startOfMonth();
        // Always use 31 days per month (Ajo policy: 1 month = 31 days)
        $daysInMonth = 31;
        $endDate = $startDate->copy()->addDays(30); // 31 days starting from day 1

        // Get all active members
        $members = $group->members()
            ->where('status', 'active')
            ->with(['user'])
            ->get();

        // Get all payments for this month
        $payments = DailyPayment::where('ajo_group_id', $group->id)
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($payment) {
                return $payment->user_id . '_' . $payment->payment_date->format('Y-m-d');
            });

        // Build the cashbook grid
        $cashbook = [];
        foreach ($members as $member) {
            $memberPayments = [];
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $startDate->copy()->addDays($day - 1);
                $key = $member->user_id . '_' . $date->format('Y-m-d');

                $payment = $payments->get($key)?->first();

                $memberPayments[$day] = [
                    'date' => $date->format('Y-m-d'),
                    'status' => $payment?->status ?? 'none',
                    'amount' => $payment?->amount ?? 0,
                    'payment_id' => $payment?->id,
                ];
            }

            $cashbook[] = [
                'member' => $member,
                'user' => $member->user,
                'payments' => $memberPayments,
                'total_paid' => collect($memberPayments)->where('status', 'paid')->sum('amount'),
                'days_paid' => collect($memberPayments)->where('status', 'paid')->count(),
            ];
        }

        return view('collector.groups.cashbook', compact(
            'group',
            'cashbook',
            'month',
            'startDate',
            'endDate',
            'daysInMonth'
        ));
    }

    /**
     * Display group members.
     */
    public function members(AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $members = $group->members()
            ->with(['user'])
            ->get()
            ->map(function ($member) use ($group) {
                // Calculate member stats
                $member->total_payments = DailyPayment::where('ajo_group_id', $group->id)
                    ->where('user_id', $member->user_id)
                    ->where('status', 'paid')
                    ->count();
                $member->total_amount = DailyPayment::where('ajo_group_id', $group->id)
                    ->where('user_id', $member->user_id)
                    ->where('status', 'paid')
                    ->sum('amount');

                return $member;
            });

        return view('collector.groups.members', compact('group', 'members'));
    }

    /**
     * Authorize that the current user is a collector/admin for this group.
     */
    private function authorizeCollector(AjoGroup $group): void
    {
        $user = Auth::user();

        // Admins can access all groups
        if ($user->isAdmin()) {
            return;
        }

        $member = $group->members()->where('user_id', $user->id)->first();

        if (!$member || !$member->is_admin) {
            abort(403, 'You are not authorized to manage this group.');
        }
    }
}

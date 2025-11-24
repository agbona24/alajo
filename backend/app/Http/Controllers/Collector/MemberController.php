<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
use App\Models\AjoActivity;
use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\Contribution;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MemberController extends Controller
{
    /**
     * Display all members registered under this collector.
     */
    public function index(Request $request)
    {
        $collector = Auth::user();

        // Get all members registered under this collector
        $query = User::where('collector_id', $collector->id)
            ->with(['savingsPlans', 'contributions', 'withdrawals']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $members = $query->latest()->paginate(20);

        // Calculate totals for each member
        foreach ($members as $member) {
            $member->total_savings = $member->savingsPlans->sum('current_balance');
            $member->total_contributions = $member->contributions->where('status', 'completed')->sum('amount');
            $member->total_withdrawals = $member->withdrawals->where('status', 'completed')->sum('amount');
        }

        // Summary stats
        $memberIds = User::where('collector_id', $collector->id)->pluck('id');
        $stats = [
            'total_members' => $memberIds->count(),
            'active_members' => User::where('collector_id', $collector->id)->where('status', 'active')->count(),
            'total_savings' => SavingsPlan::whereIn('user_id', $memberIds)->sum('current_balance'),
            'total_contributions' => Contribution::whereIn('user_id', $memberIds)->where('status', 'completed')->sum('amount'),
            'total_withdrawals' => Withdrawal::whereIn('user_id', $memberIds)->where('status', 'completed')->sum('amount'),
        ];

        return view('collector.members.index', compact('members', 'stats'));
    }

    /**
     * Display a registered member's full details (savings, contributions, withdrawals).
     */
    public function showRegisteredMember(User $user)
    {
        $collector = Auth::user();

        // Ensure this member belongs to this collector
        if ($user->collector_id !== $collector->id) {
            abort(403, 'This member is not registered under you.');
        }

        // Load relationships
        $user->load(['savingsPlans.contributions', 'contributions.savingsPlan', 'withdrawals.savingsPlan']);

        // Get savings plans with details
        $savingsPlans = $user->savingsPlans()->withSum(['contributions' => function ($q) {
            $q->where('status', 'completed');
        }], 'amount')->get();

        // Get contributions with pagination
        $contributions = Contribution::where('user_id', $user->id)
            ->with('savingsPlan')
            ->latest()
            ->paginate(20, ['*'], 'contributions_page');

        // Get withdrawals with pagination
        $withdrawals = Withdrawal::where('user_id', $user->id)
            ->with('savingsPlan')
            ->latest()
            ->paginate(20, ['*'], 'withdrawals_page');

        // Summary stats
        $stats = [
            'total_savings' => $user->savingsPlans->sum('current_balance'),
            'total_contributed' => Contribution::where('user_id', $user->id)->where('status', 'completed')->sum('amount'),
            'total_withdrawn' => Withdrawal::where('user_id', $user->id)->where('status', 'completed')->sum('amount'),
            'active_plans' => $user->savingsPlans->where('status', 'active')->count(),
            'this_month_contributions' => Contribution::where('user_id', $user->id)
                ->where('status', 'completed')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('amount'),
        ];

        return view('collector.members.show-registered', compact('user', 'savingsPlans', 'contributions', 'withdrawals', 'stats'));
    }

    /**
     * Display a member's details within a group.
     */
    public function show(AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        $member->load(['user']);

        // Get payment history for this member
        $payments = DailyPayment::where('ajo_group_id', $group->id)
            ->where('user_id', $member->user_id)
            ->orderByDesc('payment_date')
            ->paginate(30);

        // Calculate statistics
        $stats = [
            'total_payments' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('user_id', $member->user_id)
                ->where('status', 'paid')
                ->count(),
            'total_amount' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('user_id', $member->user_id)
                ->where('status', 'paid')
                ->sum('amount'),
            'missed_payments' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('user_id', $member->user_id)
                ->where('status', 'missed')
                ->count(),
            'this_month_paid' => DailyPayment::where('ajo_group_id', $group->id)
                ->where('user_id', $member->user_id)
                ->where('status', 'paid')
                ->whereMonth('payment_date', Carbon::now()->month)
                ->count(),
        ];

        return view('collector.members.show', compact('group', 'member', 'payments', 'stats'));
    }

    /**
     * Update member status.
     */
    public function updateStatus(Request $request, AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,removed',
        ]);

        $oldStatus = $member->status;
        $member->update(['status' => $validated['status']]);

        // Log activity
        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'member_status_changed',
            'description' => "Member status changed from {$oldStatus} to {$validated['status']}",
            'metadata' => [
                'member_id' => $member->id,
                'user_id' => $member->user_id,
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
            ],
        ]);

        return back()->with('success', 'Member status updated successfully.');
    }

    /**
     * Update member position in payout order.
     */
    public function updatePosition(Request $request, AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        $validated = $request->validate([
            'position' => 'required|integer|min:1|max:' . $group->group_size,
        ]);

        // Check if position is already taken
        $existingMember = $group->members()
            ->where('position', $validated['position'])
            ->where('id', '!=', $member->id)
            ->first();

        if ($existingMember) {
            // Swap positions
            $oldPosition = $member->position;
            $existingMember->update(['position' => $oldPosition]);
            $member->update(['position' => $validated['position']]);

            AjoActivity::create([
                'ajo_group_id' => $group->id,
                'user_id' => Auth::id(),
                'action' => 'positions_swapped',
                'description' => "Position swapped between members",
                'metadata' => [
                    'member_1' => $member->id,
                    'member_2' => $existingMember->id,
                ],
            ]);

            return back()->with('success', 'Positions swapped successfully.');
        }

        $member->update(['position' => $validated['position']]);

        return back()->with('success', 'Member position updated successfully.');
    }

    /**
     * Make a member an admin of the group.
     */
    public function makeAdmin(AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        $member->update(['is_admin' => true]);

        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'admin_added',
            'description' => "Member made group admin",
            'metadata' => ['member_id' => $member->id, 'user_id' => $member->user_id],
        ]);

        return back()->with('success', 'Member is now a group admin.');
    }

    /**
     * Remove admin privileges from a member.
     */
    public function removeAdmin(AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        // Ensure there's at least one admin remaining
        $adminCount = $group->members()->where('is_admin', true)->count();
        if ($adminCount <= 1) {
            return back()->with('error', 'Cannot remove the last admin from the group.');
        }

        $member->update(['is_admin' => false]);

        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'admin_removed',
            'description' => "Admin privileges removed from member",
            'metadata' => ['member_id' => $member->id, 'user_id' => $member->user_id],
        ]);

        return back()->with('success', 'Admin privileges removed.');
    }

    /**
     * Approve a pending member.
     */
    public function approve(AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        if ($member->status !== 'pending') {
            return back()->with('error', 'Member is not pending approval.');
        }

        $member->update([
            'status' => 'active',
            'joined_at' => now(),
        ]);

        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'member_approved',
            'description' => "Member approved to join the group",
            'metadata' => ['member_id' => $member->id, 'user_id' => $member->user_id],
        ]);

        return back()->with('success', 'Member approved successfully.');
    }

    /**
     * Reject a pending member.
     */
    public function reject(AjoGroup $group, AjoMember $member)
    {
        $this->authorizeCollector($group);

        if ($member->ajo_group_id !== $group->id) {
            abort(404);
        }

        if ($member->status !== 'pending') {
            return back()->with('error', 'Member is not pending approval.');
        }

        $member->update(['status' => 'removed']);

        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'member_rejected',
            'description' => "Member request rejected",
            'metadata' => ['member_id' => $member->id, 'user_id' => $member->user_id],
        ]);

        return back()->with('success', 'Member request rejected.');
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
            abort(403, 'You are not authorized to manage this group.');
        }
    }
}

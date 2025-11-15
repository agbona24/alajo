<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\AjoContribution;
use App\Models\AjoActivity;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AjoContributionController extends Controller
{
    /**
     * Get all contributions for a group
     */
    public function index(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        $query = AjoContribution::where('ajo_group_id', $groupId)
            ->with(['user', 'ajoMember.user', 'transaction']);

        // Filter by cycle
        if ($request->has('cycle_number')) {
            $query->where('cycle_number', $request->cycle_number);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by month
        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('due_date', $request->month)
                  ->whereYear('due_date', $request->year);
        }

        $contributions = $query->orderBy('cycle_number', 'desc')
                              ->orderBy('due_date', 'desc')
                              ->paginate(20);

        return response()->json($contributions);
    }

    /**
     * Make a contribution to a group
     */
    public function store(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if group is active
        if (!$group->isActive()) {
            return response()->json(['message' => 'Group is not active'], 400);
        }

        // Check if user is an active member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member || !$member->isActive()) {
            return response()->json(['message' => 'You are not an active member of this group'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:card,bank_transfer,wallet,cash,paystack,flutterwave',
            'payment_reference' => 'nullable|string',
        ]);

        // Verify amount matches group contribution amount
        if ($validated['amount'] != $group->contribution_amount) {
            return response()->json([
                'message' => 'Amount must match group contribution amount',
                'required_amount' => $group->contribution_amount,
            ], 400);
        }

        $currentCycle = $group->current_cycle ?: 1;

        // Check if already contributed for this cycle
        $existingContribution = AjoContribution::where('ajo_group_id', $groupId)
            ->where('ajo_member_id', $member->id)
            ->where('cycle_number', $currentCycle)
            ->first();

        if ($existingContribution && $existingContribution->isPaid()) {
            return response()->json(['message' => 'You have already contributed for this cycle'], 400);
        }

        DB::beginTransaction();
        try {
            // Calculate due date based on rotation type
            $dueDate = $this->calculateDueDate($group, $currentCycle);

            // Check if contribution is late
            $isLate = Carbon::now()->greaterThan($dueDate);
            $lateFee = $isLate ? ($validated['amount'] * 0.05) : 0; // 5% late fee

            // Create or update contribution
            if ($existingContribution) {
                $existingContribution->update([
                    'amount' => $validated['amount'],
                    'status' => 'paid',
                    'paid_date' => now(),
                    'payment_method' => $validated['payment_method'],
                    'is_late' => $isLate,
                    'late_fee' => $lateFee,
                ]);
                $contribution = $existingContribution;
            } else {
                $contribution = AjoContribution::create([
                    'ajo_group_id' => $groupId,
                    'ajo_member_id' => $member->id,
                    'user_id' => Auth::id(),
                    'cycle_number' => $currentCycle,
                    'amount' => $validated['amount'],
                    'status' => 'paid',
                    'due_date' => $dueDate,
                    'paid_date' => now(),
                    'payment_method' => $validated['payment_method'],
                    'is_late' => $isLate,
                    'late_fee' => $lateFee,
                ]);
            }

            // Create transaction record
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'type' => 'deposit',
                'amount' => $validated['amount'] + $lateFee,
                'description' => "Ajo contribution to {$group->name} (Cycle {$currentCycle})",
                'payment_method' => $validated['payment_method'],
                'reference' => $validated['payment_reference'] ?? 'AC-' . strtoupper(uniqid()),
                'status' => 'completed',
                'metadata' => json_encode([
                    'ajo_group_id' => $groupId,
                    'cycle_number' => $currentCycle,
                    'late_fee' => $lateFee,
                ]),
            ]);

            // Link transaction to contribution
            $contribution->update(['transaction_id' => $transaction->id]);

            // Update member's total contributed
            $member->increment('total_contributed', $validated['amount']);
            $member->update(['current_cycle_paid' => true]);

            // Log activity
            AjoActivity::log(
                $groupId,
                Auth::id(),
                'contribution_made',
                Auth::user()->name . " contributed ₦" . number_format($validated['amount'], 2) . " for cycle {$currentCycle}",
                [
                    'amount' => $validated['amount'],
                    'cycle_number' => $currentCycle,
                    'is_late' => $isLate,
                    'late_fee' => $lateFee,
                ]
            );

            // Check if all members have contributed for this cycle
            $this->checkCycleCompletion($group, $currentCycle);

            DB::commit();

            return response()->json([
                'message' => 'Contribution recorded successfully' . ($isLate ? ' (Late fee applied)' : ''),
                'contribution' => $contribution->load(['user', 'transaction']),
                'late_fee' => $lateFee,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to record contribution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get my contributions for a group
     */
    public function myContributions($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        $contributions = AjoContribution::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->with(['transaction'])
            ->orderBy('cycle_number', 'desc')
            ->get();

        $summary = [
            'total_contributed' => $contributions->where('status', 'paid')->sum('amount'),
            'total_cycles' => $contributions->count(),
            'paid_cycles' => $contributions->where('status', 'paid')->count(),
            'pending_cycles' => $contributions->where('status', 'pending')->count(),
            'missed_cycles' => $contributions->where('status', 'missed')->count(),
            'total_late_fees' => $contributions->sum('late_fee'),
        ];

        return response()->json([
            'contributions' => $contributions,
            'summary' => $summary,
        ]);
    }

    /**
     * Get contribution statistics for a group
     */
    public function statistics($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        $currentCycle = $group->current_cycle ?: 1;

        $stats = [
            'current_cycle' => $currentCycle,
            'total_collected' => AjoContribution::where('ajo_group_id', $groupId)
                ->where('status', 'paid')
                ->sum('amount'),
            'current_cycle_contributions' => AjoContribution::where('ajo_group_id', $groupId)
                ->where('cycle_number', $currentCycle)
                ->where('status', 'paid')
                ->count(),
            'current_cycle_total' => AjoContribution::where('ajo_group_id', $groupId)
                ->where('cycle_number', $currentCycle)
                ->where('status', 'paid')
                ->sum('amount'),
            'pending_contributions' => AjoContribution::where('ajo_group_id', $groupId)
                ->where('cycle_number', $currentCycle)
                ->where('status', 'pending')
                ->count(),
            'completion_percentage' => $this->calculateCycleCompletion($group, $currentCycle),
        ];

        return response()->json($stats);
    }

    /**
     * Calculate due date based on group rotation type
     */
    private function calculateDueDate($group, $cycleNumber)
    {
        $startDate = Carbon::parse($group->start_date ?: now());

        switch ($group->rotation_type) {
            case 'daily':
                return $startDate->addDays($cycleNumber - 1);
            case 'weekly':
                return $startDate->addWeeks($cycleNumber - 1);
            case 'monthly':
                return $startDate->addMonths($cycleNumber - 1);
            default:
                return $startDate->addMonths($cycleNumber - 1);
        }
    }

    /**
     * Check if all members have contributed for the cycle
     */
    private function checkCycleCompletion($group, $cycleNumber)
    {
        $activeMembersCount = $group->ajoMembers()->where('status', 'active')->count();
        $paidContributionsCount = AjoContribution::where('ajo_group_id', $group->id)
            ->where('cycle_number', $cycleNumber)
            ->where('status', 'paid')
            ->count();

        if ($paidContributionsCount >= $activeMembersCount) {
            // All members have contributed, trigger payout processing
            AjoActivity::log(
                $group->id,
                null,
                'cycle_completed',
                "Cycle {$cycleNumber} completed - All members have contributed",
                ['cycle_number' => $cycleNumber]
            );

            // Reset current_cycle_paid for all members
            $group->ajoMembers()->update(['current_cycle_paid' => false]);
        }
    }

    /**
     * Calculate cycle completion percentage
     */
    private function calculateCycleCompletion($group, $cycleNumber)
    {
        $activeMembersCount = $group->ajoMembers()->where('status', 'active')->count();
        if ($activeMembersCount == 0) {
            return 0;
        }

        $paidContributionsCount = AjoContribution::where('ajo_group_id', $group->id)
            ->where('cycle_number', $cycleNumber)
            ->where('status', 'paid')
            ->count();

        return round(($paidContributionsCount / $activeMembersCount) * 100, 2);
    }
}

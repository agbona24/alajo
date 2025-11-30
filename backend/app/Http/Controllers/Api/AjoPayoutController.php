<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\AjoPayout;
use App\Models\AjoContribution;
use App\Models\AjoActivity;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AjoPayoutController extends Controller
{
    /**
     * Get all payouts for a group
     */
    public function index($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        $payouts = AjoPayout::where('ajo_group_id', $groupId)
            ->with(['ajoMember.user', 'user', 'transaction'])
            ->orderBy('cycle_number', 'desc')
            ->paginate(20);

        return response()->json($payouts);
    }

    /**
     * Process a payout for a cycle (Organizer only)
     */
    public function store(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is organizer
        $organizer = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$organizer || !$organizer->isOrganizer()) {
            return response()->json(['message' => 'Only organizers can process payouts'], 403);
        }

        $validated = $request->validate([
            'cycle_number' => 'required|integer|min:1',
            'recipient_member_id' => 'required|exists:ajo_members,id',
            'organizer_fee_percentage' => 'nullable|numeric|min:0|max:10', // Max 10%
            'notes' => 'nullable|string',
        ]);

        $cycleNumber = $validated['cycle_number'];

        // Check if payout already exists for this cycle
        $existingPayout = AjoPayout::where('ajo_group_id', $groupId)
            ->where('cycle_number', $cycleNumber)
            ->first();

        if ($existingPayout) {
            return response()->json(['message' => 'Payout already processed for this cycle'], 400);
        }

        // Verify recipient is a member of this group
        $recipient = AjoMember::where('id', $validated['recipient_member_id'])
            ->where('ajo_group_id', $groupId)
            ->first();

        if (!$recipient) {
            return response()->json(['message' => 'Invalid recipient'], 400);
        }

        // Check if recipient has already received payout
        if ($recipient->hasReceivedPayout()) {
            return response()->json(['message' => 'This member has already received their payout'], 400);
        }

        // Verify all members have contributed for this cycle
        $activeMembersCount = $group->ajoMembers()->where('status', 'active')->count();
        $paidContributionsCount = AjoContribution::where('ajo_group_id', $groupId)
            ->where('cycle_number', $cycleNumber)
            ->where('status', 'paid')
            ->count();

        if ($paidContributionsCount < $activeMembersCount) {
            return response()->json([
                'message' => 'Cannot process payout. Not all members have contributed',
                'paid' => $paidContributionsCount,
                'required' => $activeMembersCount,
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Calculate payout amount
            $totalContributions = AjoContribution::where('ajo_group_id', $groupId)
                ->where('cycle_number', $cycleNumber)
                ->where('status', 'paid')
                ->sum('amount');

            // Add late fees to pot
            $totalLateFees = AjoContribution::where('ajo_group_id', $groupId)
                ->where('cycle_number', $cycleNumber)
                ->where('status', 'paid')
                ->sum('late_fee');

            $payoutAmount = $totalContributions + $totalLateFees;

            // Calculate organizer fee (default 2% or custom)
            $feePercentage = $validated['organizer_fee_percentage'] ?? ($group->settings['organizer_fee_percentage'] ?? 2);
            $organizerFee = ($payoutAmount * $feePercentage) / 100;
            $netAmount = $payoutAmount - $organizerFee;

            // Calculate scheduled date
            $scheduledDate = $this->calculatePayoutDate($group, $cycleNumber);

            // Create payout record
            $payout = AjoPayout::create([
                'ajo_group_id' => $groupId,
                'ajo_member_id' => $recipient->id,
                'user_id' => $recipient->user_id,
                'cycle_number' => $cycleNumber,
                'payout_amount' => $payoutAmount,
                'organizer_fee' => $organizerFee,
                'net_amount' => $netAmount,
                'status' => 'pending',
                'scheduled_date' => $scheduledDate,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update member record
            $recipient->update([
                'has_received_payout' => true,
                'payout_date' => now(),
            ]);

            // Log activity
            AjoActivity::log(
                $groupId,
                Auth::id(),
                'payout_created',
                "Payout of " . currency($netAmount) . " scheduled for " . $recipient->user->name . " (Cycle {$cycleNumber})",
                [
                    'cycle_number' => $cycleNumber,
                    'recipient_id' => $recipient->user_id,
                    'payout_amount' => $payoutAmount,
                    'organizer_fee' => $organizerFee,
                    'net_amount' => $netAmount,
                ]
            );

            // Increment group cycle if all cycles not complete
            if ($cycleNumber >= $group->current_cycle) {
                $group->increment('current_cycle');
            }

            // Check if group is completed
            $totalCycles = $group->group_size;
            if ($group->current_cycle > $totalCycles) {
                $group->update(['status' => 'completed']);

                AjoActivity::log(
                    $groupId,
                    null,
                    'group_completed',
                    "Group completed! All {$totalCycles} cycles finished",
                    ['total_cycles' => $totalCycles]
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'Payout created successfully',
                'payout' => $payout->load(['ajoMember.user', 'user']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create payout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete/disburse a payout (Organizer only)
     */
    public function complete(Request $request, $groupId, $payoutId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is organizer
        $organizer = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$organizer || !$organizer->isOrganizer()) {
            return response()->json(['message' => 'Only organizers can complete payouts'], 403);
        }

        $payout = AjoPayout::where('id', $payoutId)
            ->where('ajo_group_id', $groupId)
            ->firstOrFail();

        if (!$payout->isPending() && !$payout->isProcessing()) {
            return response()->json(['message' => 'Payout cannot be completed in current status'], 400);
        }

        $validated = $request->validate([
            'payment_reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Create transaction for the payout
            $transaction = Transaction::create([
                'user_id' => $payout->user_id,
                'type' => 'withdrawal',
                'amount' => $payout->net_amount,
                'description' => "Ajo payout from {$group->name} (Cycle {$payout->cycle_number})",
                'payment_method' => 'bank_transfer',
                'reference' => $validated['payment_reference'] ?? $payout->reference,
                'status' => 'completed',
                'metadata' => json_encode([
                    'ajo_group_id' => $groupId,
                    'ajo_payout_id' => $payout->id,
                    'cycle_number' => $payout->cycle_number,
                    'organizer_fee' => $payout->organizer_fee,
                ]),
            ]);

            // Update payout
            $payout->update([
                'status' => 'completed',
                'completed_date' => now(),
                'transaction_id' => $transaction->id,
                'notes' => $validated['notes'] ?? $payout->notes,
            ]);

            // Log activity
            AjoActivity::log(
                $groupId,
                Auth::id(),
                'payout_completed',
                $payout->user->name . " received payout of " . currency($payout->net_amount),
                [
                    'cycle_number' => $payout->cycle_number,
                    'amount' => $payout->net_amount,
                    'transaction_id' => $transaction->id,
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Payout completed successfully',
                'payout' => $payout->load(['ajoMember.user', 'transaction']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to complete payout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payout schedule for a group
     */
    public function schedule($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        // Get members ordered by position (rotation order)
        $members = $group->ajoMembers()
            ->where('status', 'active')
            ->with('user')
            ->orderBy('position')
            ->get();

        $schedule = $members->map(function ($member, $index) use ($group) {
            $cycleNumber = $index + 1;
            $payout = AjoPayout::where('ajo_group_id', $group->id)
                ->where('cycle_number', $cycleNumber)
                ->first();

            return [
                'cycle' => $cycleNumber,
                'member' => [
                    'id' => $member->user_id,
                    'name' => $member->user->name,
                    'position' => $member->position,
                ],
                'scheduled_date' => $this->calculatePayoutDate($group, $cycleNumber)->format('Y-m-d'),
                'status' => $payout ? $payout->status : 'pending',
                'has_received' => $member->has_received_payout,
                'payout_amount' => $payout ? $payout->net_amount : null,
                'is_current_cycle' => $group->current_cycle === $cycleNumber,
            ];
        });

        return response()->json([
            'schedule' => $schedule,
            'current_cycle' => $group->current_cycle,
            'total_cycles' => $group->group_size,
        ]);
    }

    /**
     * Get my payout details
     */
    public function myPayout($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        $payout = AjoPayout::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->with(['transaction'])
            ->first();

        $myPosition = $member->position;
        $currentCycle = $group->current_cycle ?: 1;
        $estimatedDate = $this->calculatePayoutDate($group, $myPosition);

        return response()->json([
            'payout' => $payout,
            'my_position' => $myPosition,
            'my_cycle' => $myPosition,
            'estimated_payout_date' => $estimatedDate->format('Y-m-d'),
            'current_cycle' => $currentCycle,
            'cycles_until_payout' => max(0, $myPosition - $currentCycle),
            'has_received' => $member->has_received_payout,
        ]);
    }

    /**
     * Calculate payout date based on rotation type
     */
    private function calculatePayoutDate($group, $cycleNumber)
    {
        $startDate = Carbon::parse($group->start_date ?: now());

        switch ($group->rotation_type) {
            case 'daily':
                return $startDate->copy()->addDays($cycleNumber);
            case 'weekly':
                return $startDate->copy()->addWeeks($cycleNumber);
            case 'monthly':
                return $startDate->copy()->addMonths($cycleNumber);
            default:
                return $startDate->copy()->addMonths($cycleNumber);
        }
    }
}

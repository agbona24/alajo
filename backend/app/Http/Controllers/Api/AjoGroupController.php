<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AjoGroupController extends Controller
{
    public function index()
    {
        $groups = Auth::user()->ajoGroups()
            ->withPivot(['position', 'status', 'is_admin', 'total_contributed'])
            ->with('creator', 'ajoMembers.user')
            ->latest()
            ->get();

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contribution_amount' => 'required|numeric|min:0',
            'group_size' => 'required|integer|min:2|max:50',
            'rotation_type' => 'required|in:daily,weekly,monthly',
            'selection_method' => 'required|in:sequential,random,bid',
            'start_date' => 'nullable|date',
            'auto_reminders' => 'boolean',
            'require_approval' => 'boolean',
        ]);

        $validated['creator_id'] = Auth::id();
        $validated['code'] = strtoupper(Str::random(6)); // Generate unique group code
        $validated['current_members'] = 1; // Creator is the first member
        $validated['status'] = 'pending';

        DB::beginTransaction();
        try {
            $group = AjoGroup::create($validated);

            // Add creator as first member and admin
            $group->members()->attach(Auth::id(), [
                'position' => 1,
                'status' => 'active',
                'is_admin' => true,
                'joined_at' => now(),
            ]);

            DB::commit();

            return response()->json($group->load('creator', 'ajoMembers'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create group', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $group = AjoGroup::with(['creator', 'ajoMembers.user', 'contributions'])
            ->findOrFail($id);

        // Check if user is a member
        $isMember = $group->members->contains(Auth::id());
        if (!$isMember) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($group);
    }

    public function update(Request $request, $id)
    {
        $group = AjoGroup::findOrFail($id);

        // Check if user is admin
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member || !$member->is_admin) {
            return response()->json(['message' => 'Only admins can update group'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'auto_reminders' => 'boolean',
            'status' => 'sometimes|in:pending,active,completed,cancelled',
        ]);

        $group->update($validated);

        return response()->json($group);
    }

    public function searchByCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $group = AjoGroup::where('code', strtoupper($validated['code']))
            ->with('creator', 'ajoMembers.user')
            ->first();

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        return response()->json($group);
    }

    public function join($id)
    {
        $group = AjoGroup::findOrFail($id);

        // Check if group is full
        if ($group->current_members >= $group->group_size) {
            return response()->json(['message' => 'Group is full'], 400);
        }

        // Check if already a member
        if ($group->members->contains(Auth::id())) {
            return response()->json(['message' => 'Already a member'], 400);
        }

        DB::beginTransaction();
        try {
            $status = $group->require_approval ? 'pending' : 'active';
            $position = $group->require_approval ? null : ($group->current_members + 1);

            $group->members()->attach(Auth::id(), [
                'position' => $position,
                'status' => $status,
                'is_admin' => false,
                'joined_at' => $status === 'active' ? now() : null,
            ]);

            if ($status === 'active') {
                $group->increment('current_members');
            }

            DB::commit();

            return response()->json([
                'message' => $group->require_approval
                    ? 'Join request sent. Waiting for approval.'
                    : 'Successfully joined group',
                'group' => $group->fresh(['creator', 'ajoMembers.user']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to join group', 'error' => $e->getMessage()], 500);
        }
    }

    public function approveMember(Request $request, $groupId, $memberId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is admin
        $admin = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$admin || !$admin->is_admin) {
            return response()->json(['message' => 'Only admins can approve members'], 403);
        }

        $member = $group->ajoMembers()->where('id', $memberId)->first();
        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        DB::beginTransaction();
        try {
            $member->update([
                'status' => 'active',
                'position' => $group->current_members + 1,
                'joined_at' => now(),
            ]);

            $group->increment('current_members');

            // Activate group if it reaches minimum size
            if ($group->current_members >= 2 && $group->status === 'pending') {
                $group->update(['status' => 'active']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Member approved successfully',
                'group' => $group->fresh(['creator', 'ajoMembers.user']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to approve member', 'error' => $e->getMessage()], 500);
        }
    }

    public function getMembers($id)
    {
        $group = AjoGroup::findOrFail($id);

        // Check if user is a member
        if (!$group->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $members = $group->ajoMembers()
            ->with('user')
            ->orderBy('position')
            ->get();

        return response()->json($members);
    }

    public function getSchedule($id)
    {
        $group = AjoGroup::findOrFail($id);

        // Check if user is a member
        if (!$group->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $schedule = $group->ajoMembers()
            ->where('status', 'active')
            ->with('user')
            ->orderBy('position')
            ->get()
            ->map(function ($member, $index) use ($group) {
                return [
                    'cycle' => $index + 1,
                    'member' => $member->user,
                    'payout_date' => $member->payout_date,
                    'has_received_payout' => $member->has_received_payout,
                    'is_current' => $group->current_cycle === ($index + 1),
                ];
            });

        return response()->json($schedule);
    }

    public function contribute(Request $request, $id)
    {
        $group = AjoGroup::findOrFail($id);
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();

        if (!$member || $member->status !== 'active') {
            return response()->json(['message' => 'Not an active member'], 403);
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:card,bank_transfer,wallet,cash',
        ]);

        DB::beginTransaction();
        try {
            // Create contribution
            $contribution = $group->contributions()->create([
                'user_id' => Auth::id(),
                'ajo_group_id' => $group->id,
                'amount' => $group->contribution_amount,
                'payment_method' => $validated['payment_method'],
                'reference' => 'AJO-' . time() . '-' . rand(1000, 9999),
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Update member's total contributed
            $member->increment('total_contributed', $group->contribution_amount);
            $member->update(['current_cycle_paid' => true]);

            // Create transaction
            Auth::user()->transactions()->create([
                'ajo_group_id' => $group->id,
                'reference' => $contribution->reference,
                'type' => 'contribution',
                'amount' => $group->contribution_amount,
                'balance_before' => 0,
                'balance_after' => 0,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'description' => "Ajo contribution to {$group->name}",
                'completed_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Contribution successful',
                'contribution' => $contribution,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Contribution failed', 'error' => $e->getMessage()], 500);
        }
    }
}

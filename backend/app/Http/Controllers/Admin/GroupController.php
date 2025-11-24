<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Display a listing of all ajo groups.
     */
    public function index(Request $request)
    {
        $query = AjoGroup::with(['creator', 'members']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $groups = $query->latest()->paginate(20);

        // Statistics
        $stats = [
            'total' => AjoGroup::count(),
            'active' => AjoGroup::where('status', 'active')->count(),
            'pending' => AjoGroup::where('status', 'pending')->count(),
            'completed' => AjoGroup::where('status', 'completed')->count(),
            'cancelled' => AjoGroup::where('status', 'cancelled')->count(),
        ];

        return view('admin.groups.index', compact('groups', 'stats'));
    }

    /**
     * Display the specified group.
     */
    public function show(AjoGroup $group)
    {
        $group->load([
            'creator',
            'members.user',
            'dailyPayments' => fn($q) => $q->latest()->take(50),
            'contributions' => fn($q) => $q->latest()->take(20),
            'payouts' => fn($q) => $q->latest()->take(10),
            'activities' => fn($q) => $q->latest()->take(20),
        ]);

        // Calculate group statistics
        $stats = [
            'total_members' => $group->members->count(),
            'active_members' => $group->members->where('status', 'active')->count(),
            'total_contributed' => $group->members->sum('total_contributed'),
            'expected_contribution' => $group->contribution_amount * $group->group_size,
        ];

        return view('admin.groups.show', compact('group', 'stats'));
    }

    /**
     * Update group status.
     */
    public function updateStatus(Request $request, AjoGroup $group)
    {
        $request->validate([
            'status' => 'required|in:pending,active,completed,cancelled',
        ]);

        $group->update(['status' => $request->status]);

        return back()->with('success', 'Group status updated successfully.');
    }

    /**
     * Pause a group.
     */
    public function pause(AjoGroup $group)
    {
        $group->update(['status' => 'paused']);

        return back()->with('success', 'Group has been paused.');
    }

    /**
     * Suspend a group.
     */
    public function suspend(AjoGroup $group)
    {
        $group->update(['status' => 'cancelled']);

        return back()->with('success', 'Group has been suspended.');
    }

    /**
     * Activate a group.
     */
    public function activate(AjoGroup $group)
    {
        $group->update(['status' => 'active']);

        return back()->with('success', 'Group has been activated.');
    }

    /**
     * Remove a member from a group.
     */
    public function removeMember(AjoGroup $group, AjoMember $member)
    {
        if ($member->ajo_group_id !== $group->id) {
            return back()->with('error', 'Member does not belong to this group.');
        }

        $member->update(['status' => 'removed']);

        return back()->with('success', 'Member has been removed from the group.');
    }

    /**
     * Delete a group (soft delete).
     */
    public function destroy(AjoGroup $group)
    {
        $group->delete();

        return redirect()
            ->route('admin.groups.index')
            ->with('success', 'Group deleted successfully.');
    }
}

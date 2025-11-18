<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoActivity;
use App\Models\AjoGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AjoActivityController extends Controller
{
    /**
     * Get activities for a specific Ajo group
     */
    public function index($groupId)
    {
        // Verify user is a member of this group
        $group = AjoGroup::findOrFail($groupId);

        $isMember = $group->members()
            ->where('user_id', Auth::id())
            ->exists();

        if (!$isMember && $group->creator_id !== Auth::id()) {
            return response()->json([
                'message' => 'You are not a member of this group'
            ], 403);
        }

        $activities = AjoActivity::where('ajo_group_id', $groupId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(30);

        return response()->json($activities);
    }

    /**
     * Get recent activities across all user's Ajo groups (for dashboard)
     */
    public function recentActivities(Request $request)
    {
        $userId = Auth::id();

        // Get all groups where user is member or creator
        $groupIds = AjoGroup::where('creator_id', $userId)
            ->orWhereHas('members', function($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('status', 'active');
            })
            ->pluck('id');

        $activities = AjoActivity::whereIn('ajo_group_id', $groupIds)
            ->with(['user', 'ajoGroup'])
            ->orderBy('created_at', 'desc')
            ->limit($request->input('limit', 20))
            ->get();

        return response()->json($activities);
    }
}

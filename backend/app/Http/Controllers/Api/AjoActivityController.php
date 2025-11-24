<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use Illuminate\Http\Request;

class AjoActivityController extends Controller
{
    /**
     * Get activities for an Ajo group.
     */
    public function index(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        if (!$group->members()->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'You are not a member of this group'], 403);
        }

        // Get contributions and payouts as activities
        $contributions = $group->contributions()
            ->with('user:id,name')
            ->latest()
            ->take(50)
            ->get()
            ->map(function ($contribution) {
                return [
                    'id' => 'c-' . $contribution->id,
                    'type' => 'contribution',
                    'user' => $contribution->user->name ?? 'Unknown',
                    'amount' => $contribution->amount,
                    'status' => $contribution->status,
                    'created_at' => $contribution->created_at,
                    'description' => 'Made a contribution',
                ];
            });

        $payouts = $group->payouts()
            ->with('user:id,name')
            ->latest()
            ->take(50)
            ->get()
            ->map(function ($payout) {
                return [
                    'id' => 'p-' . $payout->id,
                    'type' => 'payout',
                    'user' => $payout->user->name ?? 'Unknown',
                    'amount' => $payout->amount,
                    'status' => $payout->status,
                    'created_at' => $payout->created_at,
                    'description' => 'Received payout',
                ];
            });

        // Merge and sort by date
        $activities = $contributions->concat($payouts)
            ->sortByDesc('created_at')
            ->values()
            ->take(50);

        return response()->json([
            'activities' => $activities,
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
            ],
        ]);
    }
}

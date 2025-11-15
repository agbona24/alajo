<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CollectorController extends Controller
{
    public function dashboard()
    {
        // Get the authenticated collector
        $collector = Auth::user();

        // Get groups where user is a collector (admin)
        $groups = AjoMember::where('user_id', $collector->id)
            ->where('is_admin', true)
            ->with(['ajoGroup', 'ajoGroup.members'])
            ->get()
            ->pluck('ajoGroup');

        // Calculate stats
        $todayStats = [
            'total_collected' => 0,
            'total_expected' => 0,
            'total_members' => 0,
            'paid_members' => 0,
        ];

        foreach ($groups as $group) {
            $todayStats['total_expected'] += $group->contribution_amount * $group->members->count();
            $todayStats['total_members'] += $group->members->count();
            // TODO: Add actual payment tracking
        }

        return view('collector.dashboard', compact('collector', 'groups', 'todayStats'));
    }

    public function cashbook($groupId)
    {
        $group = AjoGroup::with('members.user')->findOrFail($groupId);

        // Verify collector has access to this group
        $membership = AjoMember::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->firstOrFail();

        // Generate 30-day payment tracking
        $daysInMonth = 30;
        $currentMonth = now()->format('F Y');

        // Get members with their payment status
        $members = $group->members->map(function($member) use ($daysInMonth, $group) {
            $payments = [];
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $payments[] = [
                    'day' => $day,
                    'date' => now()->startOfMonth()->addDays($day - 1)->format('Y-m-d'),
                    'is_paid' => false, // TODO: Get from actual payment records
                    'amount' => $group->contribution_amount,
                ];
            }

            return [
                'id' => $member->user_id,
                'name' => $member->user->name,
                'payments' => $payments,
                'total_paid' => 0, // TODO: Calculate from actual payments
                'total_amount' => $group->contribution_amount * $daysInMonth,
            ];
        });

        return view('collector.cashbook', compact('group', 'members', 'currentMonth', 'daysInMonth'));
    }

    public function markPayment(Request $request, $groupId)
    {
        $request->validate([
            'member_id' => 'required|exists:users,id',
            'day' => 'required|integer|min:1|max:31',
            'is_paid' => 'required|boolean',
        ]);

        // TODO: Implement actual payment tracking in database
        // For now, we'll return success

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully'
        ]);
    }

    public function sendReminders($groupId)
    {
        $group = AjoGroup::with('members.user')->findOrFail($groupId);

        // Verify collector has access
        $membership = AjoMember::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->firstOrFail();

        // TODO: Send SMS/Email reminders to unpaid members

        return redirect()->back()->with('success', 'Reminders sent successfully!');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DailyPaymentController extends Controller
{
    /**
     * Get payment records for a group
     */
    public function index(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $query = DailyPayment::forGroup($groupId)
            ->with(['user', 'recordedBy']);

        if (isset($validated['start_date']) && isset($validated['end_date'])) {
            $query->forDateRange($validated['start_date'], $validated['end_date']);
        }

        if (isset($validated['user_id'])) {
            // Allow only admins to view other users' payments
            if ($member->is_admin || $validated['user_id'] == Auth::id()) {
                $query->forUser($validated['user_id']);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $payments = $query->orderBy('payment_date', 'desc')->paginate(50);

        return response()->json($payments);
    }

    /**
     * Mark a payment as paid/unpaid
     */
    public function markPayment(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is admin
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member || !$member->is_admin) {
            return response()->json(['message' => 'Only admins can mark payments'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_date' => 'required|date',
            'status' => 'required|in:paid,pending,missed',
            'payment_method' => 'nullable|in:cash,bank_transfer,card,wallet',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $payment = DailyPayment::updateOrCreate(
                [
                    'ajo_group_id' => $groupId,
                    'user_id' => $validated['user_id'],
                    'payment_date' => $validated['payment_date'],
                ],
                [
                    'amount' => $group->contribution_amount,
                    'status' => $validated['status'],
                    'payment_method' => $validated['payment_method'] ?? null,
                    'recorded_by' => Auth::id(),
                    'notes' => $validated['notes'] ?? null,
                    'paid_at' => $validated['status'] === 'paid' ? now() : null,
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Payment marked successfully',
                'payment' => $payment->fresh(['user', 'recordedBy']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to mark payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk mark payments
     */
    public function bulkMark(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is admin
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member || !$member->is_admin) {
            return response()->json(['message' => 'Only admins can mark payments'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:paid,pending,missed',
            'payment_method' => 'nullable|in:cash,bank_transfer,card,wallet',
        ]);

        DB::beginTransaction();
        try {
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $endDate = \Carbon\Carbon::parse($validated['end_date']);
            $markedCount = 0;

            while ($startDate->lte($endDate)) {
                $payment = DailyPayment::updateOrCreate(
                    [
                        'ajo_group_id' => $groupId,
                        'user_id' => $validated['user_id'],
                        'payment_date' => $startDate->format('Y-m-d'),
                    ],
                    [
                        'amount' => $group->contribution_amount,
                        'status' => $validated['status'],
                        'payment_method' => $validated['payment_method'] ?? null,
                        'recorded_by' => Auth::id(),
                        'paid_at' => $validated['status'] === 'paid' ? now() : null,
                    ]
                );

                $markedCount++;
                $startDate->addDay();
            }

            DB::commit();

            return response()->json([
                'message' => "Successfully marked {$markedCount} payment(s)",
                'count' => $markedCount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to bulk mark payments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment summary for a group
     */
    public function summary($groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = now()->format('Y-m-d');
        $thisMonth = now()->format('Y-m');

        // Today's stats
        $todayStats = DailyPayment::forGroup($groupId)
            ->forDate($today)
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid_count,
                SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as total_collected
            ')
            ->first();

        // This month's stats
        $monthStats = DailyPayment::forGroup($groupId)
            ->whereYear('payment_date', now()->year)
            ->whereMonth('payment_date', now()->month)
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid_count,
                SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as total_collected
            ')
            ->first();

        // Member-wise stats for this month
        $memberStats = DailyPayment::forGroup($groupId)
            ->whereYear('payment_date', now()->year)
            ->whereMonth('payment_date', now()->month)
            ->with('user')
            ->selectRaw('
                user_id,
                COUNT(*) as total_days,
                SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid_days,
                SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as total_paid
            ')
            ->groupBy('user_id')
            ->get();

        return response()->json([
            'today' => [
                'total_records' => $todayStats->total_records ?? 0,
                'paid_count' => $todayStats->paid_count ?? 0,
                'total_collected' => $todayStats->total_collected ?? 0,
            ],
            'this_month' => [
                'total_records' => $monthStats->total_records ?? 0,
                'paid_count' => $monthStats->paid_count ?? 0,
                'total_collected' => $monthStats->total_collected ?? 0,
            ],
            'member_stats' => $memberStats,
        ]);
    }

    /**
     * Get payment calendar for a month
     */
    public function calendar(Request $request, $groupId)
    {
        $group = AjoGroup::findOrFail($groupId);

        // Check if user is a member
        $member = $group->ajoMembers()->where('user_id', Auth::id())->first();
        if (!$member) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'month' => 'nullable|date_format:Y-m',
        ]);

        $month = $validated['month'] ?? now()->format('Y-m');
        $startDate = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Get all payments for the month
        $payments = DailyPayment::forGroup($groupId)
            ->forDateRange($startDate, $endDate)
            ->with('user')
            ->get()
            ->groupBy('payment_date');

        // Get all members
        $members = $group->ajoMembers()
            ->where('status', 'active')
            ->with('user')
            ->get();

        // Build calendar data
        $calendar = [];
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayPayments = $payments->get($dateStr, collect());

            $calendar[] = [
                'date' => $dateStr,
                'day' => $currentDate->day,
                'day_name' => $currentDate->format('l'),
                'total_expected' => $members->count() * $group->contribution_amount,
                'total_paid' => $dayPayments->where('status', 'paid')->sum('amount'),
                'paid_count' => $dayPayments->where('status', 'paid')->count(),
                'pending_count' => $members->count() - $dayPayments->where('status', 'paid')->count(),
                'payments' => $dayPayments,
            ];

            $currentDate->addDay();
        }

        return response()->json([
            'group' => $group->only(['id', 'name', 'contribution_amount']),
            'month' => $month,
            'members' => $members,
            'calendar' => $calendar,
        ]);
    }
}

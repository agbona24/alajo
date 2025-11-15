<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
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

        // Calculate today's stats
        $today = now()->format('Y-m-d');
        $todayStats = [
            'total_collected' => 0,
            'total_expected' => 0,
            'total_members' => 0,
            'paid_members' => 0,
        ];

        foreach ($groups as $group) {
            $membersCount = $group->members->count();
            $todayStats['total_expected'] += $group->contribution_amount * $membersCount;
            $todayStats['total_members'] += $membersCount;

            // Get actual payment tracking for today
            $paidToday = DailyPayment::forGroup($group->id)
                ->forDate($today)
                ->paid()
                ->count();

            $todayStats['paid_members'] += $paidToday;

            $collectedToday = DailyPayment::forGroup($group->id)
                ->forDate($today)
                ->paid()
                ->sum('amount');

            $todayStats['total_collected'] += $collectedToday;
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
        $startDate = now()->startOfMonth();

        // Get members with their payment status
        $members = $group->members->map(function($member) use ($daysInMonth, $group, $startDate) {
            $payments = [];
            $totalPaid = 0;

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $startDate->copy()->addDays($day - 1)->format('Y-m-d');

                // Get actual payment record from database
                $payment = DailyPayment::forGroup($group->id)
                    ->forUser($member->user_id)
                    ->forDate($date)
                    ->first();

                $isPaid = $payment && $payment->status === 'paid';

                if ($isPaid) {
                    $totalPaid += $payment->amount;
                }

                $payments[] = [
                    'day' => $day,
                    'date' => $date,
                    'is_paid' => $isPaid,
                    'amount' => $group->contribution_amount,
                    'payment_method' => $payment->payment_method ?? null,
                    'paid_at' => $payment->paid_at ?? null,
                ];
            }

            return [
                'id' => $member->user_id,
                'name' => $member->user->name,
                'payments' => $payments,
                'total_paid' => $totalPaid,
                'total_amount' => $group->contribution_amount * $daysInMonth,
            ];
        });

        return view('collector.cashbook', compact('group', 'members', 'currentMonth', 'daysInMonth'));
    }

    public function markPayment(Request $request, $groupId)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:users,id',
            'day' => 'required|integer|min:1|max:31',
            'is_paid' => 'required|boolean',
            'payment_method' => 'nullable|in:cash,bank_transfer,card,wallet',
            'notes' => 'nullable|string|max:500',
        ]);

        $group = AjoGroup::findOrFail($groupId);

        // Verify collector has access
        $membership = AjoMember::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->firstOrFail();

        // Calculate the payment date
        $paymentDate = now()->startOfMonth()->addDays($validated['day'] - 1)->format('Y-m-d');

        DB::beginTransaction();
        try {
            // Find or create payment record
            $payment = DailyPayment::firstOrCreate(
                [
                    'ajo_group_id' => $groupId,
                    'user_id' => $validated['member_id'],
                    'payment_date' => $paymentDate,
                ],
                [
                    'amount' => $group->contribution_amount,
                    'status' => 'pending',
                ]
            );

            if ($validated['is_paid']) {
                // Mark as paid
                $payment->markAsPaid(
                    $validated['payment_method'] ?? 'cash',
                    Auth::id(),
                    $validated['notes'] ?? null
                );
            } else {
                // Mark as pending
                $payment->update([
                    'status' => 'pending',
                    'payment_method' => null,
                    'paid_at' => null,
                    'notes' => $validated['notes'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'payment' => $payment->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendReminders($groupId)
    {
        $group = AjoGroup::with('members.user')->findOrFail($groupId);

        // Verify collector has access
        $membership = AjoMember::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->firstOrFail();

        // Get unpaid members for today
        $today = now()->format('Y-m-d');
        $unpaidMembers = [];

        foreach ($group->members as $member) {
            $payment = DailyPayment::forGroup($groupId)
                ->forUser($member->id)
                ->forDate($today)
                ->first();

            if (!$payment || $payment->status !== 'paid') {
                $unpaidMembers[] = $member;
            }
        }

        // TODO: Integrate with SMS/Email service
        // For now, we'll log the reminder action
        foreach ($unpaidMembers as $member) {
            // Log reminder (in production, send actual SMS/Email)
            \Log::info("Reminder sent to {$member->name} for group {$group->name}");

            // You can integrate with services like:
            // - Twilio for SMS
            // - SendGrid/Mailgun for Email
            // - Push notifications
        }

        return redirect()->back()->with('success',
            count($unpaidMembers) > 0
                ? 'Reminders sent to ' . count($unpaidMembers) . ' member(s)!'
                : 'All members have paid for today!'
        );
    }

    /**
     * Bulk mark payments up to a specific day
     */
    public function bulkMarkPayments(Request $request, $groupId)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:users,id',
            'up_to_day' => 'required|integer|min:1|max:31',
            'payment_method' => 'nullable|in:cash,bank_transfer,card,wallet',
        ]);

        $group = AjoGroup::findOrFail($groupId);

        // Verify collector has access
        $membership = AjoMember::where('ajo_group_id', $groupId)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->firstOrFail();

        DB::beginTransaction();
        try {
            $startDate = now()->startOfMonth();
            $markedCount = 0;

            for ($day = 1; $day <= $validated['up_to_day']; $day++) {
                $paymentDate = $startDate->copy()->addDays($day - 1)->format('Y-m-d');

                // Skip if payment already exists and is paid
                $existingPayment = DailyPayment::forGroup($groupId)
                    ->forUser($validated['member_id'])
                    ->forDate($paymentDate)
                    ->first();

                if ($existingPayment && $existingPayment->status === 'paid') {
                    continue;
                }

                // Create or update payment
                $payment = DailyPayment::updateOrCreate(
                    [
                        'ajo_group_id' => $groupId,
                        'user_id' => $validated['member_id'],
                        'payment_date' => $paymentDate,
                    ],
                    [
                        'amount' => $group->contribution_amount,
                        'status' => 'paid',
                        'payment_method' => $validated['payment_method'] ?? 'cash',
                        'recorded_by' => Auth::id(),
                        'paid_at' => now(),
                    ]
                );

                $markedCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Marked {$markedCount} payment(s) as paid",
                'count' => $markedCount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to bulk mark payments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

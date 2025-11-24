<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use App\Models\AjoGroup;
use App\Models\DailyPayment;
use App\Models\AjoActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display payment history for a group.
     */
    public function index(AjoGroup $group, Request $request)
    {
        $this->authorizeCollector($group);

        $query = DailyPayment::where('ajo_group_id', $group->id)
            ->with(['user', 'recorder']);

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('payment_date', $request->date);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // User filter
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $payments = $query->latest('payment_date')->paginate(50);

        return view('collector.payments.index', compact('group', 'payments'));
    }

    /**
     * Mark a single payment as paid.
     */
    public function markPaid(Request $request, AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_date' => 'required|date',
            'amount' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|in:cash,transfer,card',
        ]);

        $amount = $validated['amount'] ?? $group->contribution_amount;

        $payment = DailyPayment::updateOrCreate(
            [
                'ajo_group_id' => $group->id,
                'user_id' => $validated['user_id'],
                'payment_date' => $validated['payment_date'],
            ],
            [
                'amount' => $amount,
                'status' => 'paid',
                'payment_method' => $validated['payment_method'] ?? 'cash',
                'recorded_by' => Auth::id(),
                'paid_at' => now(),
            ]
        );

        // Log activity
        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'payment_recorded',
            'description' => "Payment of {$amount} recorded for user {$validated['user_id']}",
            'metadata' => [
                'payment_id' => $payment->id,
                'member_id' => $validated['user_id'],
                'amount' => $amount,
                'date' => $validated['payment_date'],
            ],
        ]);

        return back()->with('success', 'Payment marked as paid successfully.');
    }

    /**
     * Mark a payment as pending/unpaid.
     */
    public function markPending(Request $request, AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_date' => 'required|date',
        ]);

        $payment = DailyPayment::where([
            'ajo_group_id' => $group->id,
            'user_id' => $validated['user_id'],
            'payment_date' => $validated['payment_date'],
        ])->first();

        if ($payment) {
            $payment->update([
                'status' => 'pending',
                'paid_at' => null,
            ]);
        }

        return back()->with('success', 'Payment marked as pending.');
    }

    /**
     * Bulk mark payments for a member up to a specific date.
     */
    public function bulkMarkPaid(Request $request, AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'payment_method' => 'nullable|string|in:cash,transfer,card',
        ]);

        $fromDate = Carbon::parse($validated['from_date']);
        $toDate = Carbon::parse($validated['to_date']);
        $paymentMethod = $validated['payment_method'] ?? 'cash';

        $paymentsCreated = 0;

        DB::transaction(function () use ($group, $validated, $fromDate, $toDate, $paymentMethod, &$paymentsCreated) {
            $currentDate = $fromDate->copy();

            while ($currentDate <= $toDate) {
                DailyPayment::updateOrCreate(
                    [
                        'ajo_group_id' => $group->id,
                        'user_id' => $validated['user_id'],
                        'payment_date' => $currentDate->format('Y-m-d'),
                    ],
                    [
                        'amount' => $group->contribution_amount,
                        'status' => 'paid',
                        'payment_method' => $paymentMethod,
                        'recorded_by' => Auth::id(),
                        'paid_at' => now(),
                    ]
                );

                $paymentsCreated++;
                $currentDate->addDay();
            }

            // Log activity
            AjoActivity::create([
                'ajo_group_id' => $group->id,
                'user_id' => Auth::id(),
                'action' => 'bulk_payment_recorded',
                'description' => "Bulk payment recorded for user {$validated['user_id']} from {$fromDate->format('Y-m-d')} to {$toDate->format('Y-m-d')}",
                'metadata' => [
                    'member_id' => $validated['user_id'],
                    'from_date' => $fromDate->format('Y-m-d'),
                    'to_date' => $toDate->format('Y-m-d'),
                    'payments_count' => $paymentsCreated,
                ],
            ]);
        });

        return back()->with('success', "{$paymentsCreated} payments marked as paid successfully.");
    }

    /**
     * Display today's payment summary.
     */
    public function todaySummary(AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $today = Carbon::today();

        $payments = DailyPayment::where('ajo_group_id', $group->id)
            ->whereDate('payment_date', $today)
            ->with(['user'])
            ->get();

        $summary = [
            'total_expected' => $group->members()->where('status', 'active')->count(),
            'total_paid' => $payments->where('status', 'paid')->count(),
            'total_pending' => $payments->where('status', 'pending')->count(),
            'amount_collected' => $payments->where('status', 'paid')->sum('amount'),
            'expected_amount' => $group->members()->where('status', 'active')->count() * $group->contribution_amount,
        ];

        $paidMembers = $payments->where('status', 'paid');
        $pendingMembers = $payments->where('status', 'pending');

        // Members who haven't paid yet (no record for today)
        $membersWithPayments = $payments->pluck('user_id')->toArray();
        $unpaidMembers = $group->members()
            ->where('status', 'active')
            ->whereNotIn('user_id', $membersWithPayments)
            ->with(['user'])
            ->get();

        return view('collector.payments.today', compact(
            'group',
            'summary',
            'paidMembers',
            'pendingMembers',
            'unpaidMembers'
        ));
    }

    /**
     * Send payment reminders.
     */
    public function sendReminders(Request $request, AjoGroup $group)
    {
        $this->authorizeCollector($group);

        $today = Carbon::today();

        // Get members who haven't paid today
        $paidUserIds = DailyPayment::where('ajo_group_id', $group->id)
            ->whereDate('payment_date', $today)
            ->where('status', 'paid')
            ->pluck('user_id')
            ->toArray();

        $unpaidMembers = $group->members()
            ->where('status', 'active')
            ->whereNotIn('user_id', $paidUserIds)
            ->with(['user'])
            ->get();

        // TODO: Implement actual notification sending (SMS, Email, Push)
        // For now, just log the activity
        AjoActivity::create([
            'ajo_group_id' => $group->id,
            'user_id' => Auth::id(),
            'action' => 'reminders_sent',
            'description' => 'Payment reminders sent to ' . $unpaidMembers->count() . ' members',
            'metadata' => [
                'member_ids' => $unpaidMembers->pluck('user_id')->toArray(),
                'date' => $today->format('Y-m-d'),
            ],
        ]);

        return back()->with('success', "Reminders sent to {$unpaidMembers->count()} members.");
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

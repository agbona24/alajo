<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\PassbookRecord;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CashbookController extends Controller
{
    /**
     * Display the main cashbook with all members and their daily status
     */
    public function index(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        // Get all active users with their savings plans and passbook records
        $users = User::where('role', 'user')
            ->where('status', 'active')
            ->with(['savingsPlans' => function ($query) {
                $query->where('status', 'active')
                    ->where('frequency', 'daily');
            }])
            ->get();

        // Always use 31 days per month (Ajo policy: 1 month = 31 days)
        $daysInMonth = 31;
        $startDate = Carbon::create($year, $month, 1);
        $endDate = Carbon::create($year, $month, 1)->addDays(30); // 31 days starting from day 1

        // Build cashbook data
        $cashbookData = [];

        foreach ($users as $user) {
            foreach ($user->savingsPlans as $plan) {
                // Get passbook records for this plan in the selected month
                $records = PassbookRecord::where('savings_plan_id', $plan->id)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->get()
                    ->keyBy('day_of_month');

                $dailyStatus = [];
                $totalPaid = 0;
                $daysPaid = 0;

                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $record = $records->get($day);
                    $status = 'pending';
                    $amount = 0;

                    if ($record) {
                        $status = $record->status;
                        $amount = $record->amount;
                        if ($status === 'paid') {
                            $totalPaid += $amount;
                            $daysPaid++;
                        }
                    }

                    $dailyStatus[$day] = [
                        'status' => $status,
                        'amount' => $amount,
                        'record_id' => $record?->id,
                    ];
                }

                $cashbookData[] = [
                    'user' => $user,
                    'plan' => $plan,
                    'daily_status' => $dailyStatus,
                    'total_paid' => $totalPaid,
                    'days_paid' => $daysPaid,
                    'daily_amount' => $plan->daily_contribution,
                ];
            }
        }

        // Calculate summary stats
        $totalCollected = collect($cashbookData)->sum('total_paid');
        $totalMembers = count($cashbookData);
        $avgPaymentRate = $totalMembers > 0
            ? collect($cashbookData)->avg(function ($item) use ($daysInMonth) {
                return ($item['days_paid'] / $daysInMonth) * 100;
            })
            : 0;

        return view('admin.cashbook.index', compact(
            'cashbookData',
            'month',
            'year',
            'daysInMonth',
            'totalCollected',
            'totalMembers',
            'avgPaymentRate'
        ));
    }

    /**
     * Show cashbook for a specific member
     */
    public function show(Request $request, User $user)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $plans = $user->savingsPlans()
            ->where('frequency', 'daily')
            ->with(['passbookRecords' => function ($query) use ($month, $year) {
                $query->where('month', $month)
                    ->where('year', $year)
                    ->orderBy('day_of_month');
            }])
            ->get();

        // Always use 31 days per month (Ajo policy: 1 month = 31 days)
        $daysInMonth = 31;

        // Build detailed view for each plan
        $planData = [];
        foreach ($plans as $plan) {
            $records = $plan->passbookRecords->keyBy('day_of_month');
            $dailyStatus = [];
            $totalPaid = 0;
            $daysPaid = 0;

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $record = $records->get($day);
                $status = 'pending';
                $amount = 0;
                $paidAt = null;

                if ($record) {
                    $status = $record->status;
                    $amount = $record->amount;
                    $paidAt = $record->created_at;
                    if ($status === 'paid') {
                        $totalPaid += $amount;
                        $daysPaid++;
                    }
                }

                $date = Carbon::create($year, $month, $day);

                $dailyStatus[$day] = [
                    'date' => $date,
                    'day_name' => $date->format('D'),
                    'status' => $status,
                    'amount' => $amount,
                    'paid_at' => $paidAt,
                    'record' => $record,
                ];
            }

            $planData[] = [
                'plan' => $plan,
                'daily_status' => $dailyStatus,
                'total_paid' => $totalPaid,
                'days_paid' => $daysPaid,
                'expected_total' => $plan->daily_contribution * $daysInMonth,
                'completion_rate' => ($daysPaid / $daysInMonth) * 100,
            ];
        }

        return view('admin.cashbook.show', compact(
            'user',
            'planData',
            'month',
            'year',
            'daysInMonth'
        ));
    }

    /**
     * Mark a day as paid (admin override)
     */
    public function markPaid(Request $request, User $user)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:savings_plans,id',
            'day' => 'required|integer|min:1|max:31',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'amount' => 'required|numeric|min:0',
        ]);

        $plan = SavingsPlan::findOrFail($validated['plan_id']);
        $date = Carbon::create($validated['year'], $validated['month'], $validated['day']);

        // Check if record already exists
        $record = PassbookRecord::where('savings_plan_id', $plan->id)
            ->where('user_id', $user->id)
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->where('day_of_month', $validated['day'])
            ->first();

        if ($record) {
            $record->update([
                'status' => 'paid',
                'amount' => $validated['amount'],
                'notes' => 'Marked as paid by admin',
            ]);
        } else {
            PassbookRecord::create([
                'user_id' => $user->id,
                'savings_plan_id' => $plan->id,
                'month' => $validated['month'],
                'year' => $validated['year'],
                'day_of_month' => $validated['day'],
                'contribution_date' => $date,
                'amount' => $validated['amount'],
                'status' => 'paid',
                'notes' => 'Marked as paid by admin',
            ]);

            // Update plan current amount
            $plan->current_amount += $validated['amount'];
            $plan->save();
        }

        return redirect()->back()->with('success', 'Day marked as paid successfully');
    }

    /**
     * Mark a day as unpaid/pending (admin override)
     */
    public function markUnpaid(Request $request, User $user)
    {
        $validated = $request->validate([
            'record_id' => 'required|exists:passbook_records,id',
        ]);

        $record = PassbookRecord::findOrFail($validated['record_id']);

        // Reduce plan current amount
        if ($record->status === 'paid') {
            $record->savingsPlan->current_amount -= $record->amount;
            $record->savingsPlan->save();
        }

        $record->update([
            'status' => 'pending',
            'notes' => 'Marked as unpaid by admin',
        ]);

        return redirect()->back()->with('success', 'Day marked as unpaid successfully');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavingsPlan;
use App\Models\Earning;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SavingsPlanController extends Controller
{
    public function index()
    {
        $plans = Auth::user()->savingsPlans()
            ->with('contributions')
            ->latest()
            ->get();

        return response()->json($plans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'emoji' => 'nullable|string|max:10',
            'daily_amount' => 'required|numeric|min:' . SavingsPlan::MINIMUM_DAILY_CONTRIBUTION,
            'target_amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:daily', // Weekly and Monthly coming soon
            'duration' => 'required|integer|min:1',
            'plan_type' => 'required|in:personal,group',
            'description' => 'nullable|string',
        ], [
            'frequency.in' => 'Only daily savings is currently available. Weekly and monthly plans are coming soon!',
            'daily_amount.min' => 'Minimum daily contribution is ' . currency_symbol() . SavingsPlan::MINIMUM_DAILY_CONTRIBUTION,
        ]);

        $validated['user_id'] = Auth::id();
        $validated['emoji'] = $validated['emoji'] ?? '💰';
        $validated['status'] = 'active';

        // Start date is always the 1st of the current month (Ajo policy)
        $validated['start_date'] = now()->startOfMonth();

        // Calculate target date based on duration (in months, Ajo policy: 31 days = 1 month)
        $totalDays = $validated['duration'] * 31;
        $validated['target_date'] = $validated['start_date']->copy()->addDays($totalDays);

        $plan = SavingsPlan::create($validated);

        // Send notification email
        try {
            $notificationService = app(NotificationService::class);
            $plan->load('user');
            $notificationService->sendSavingsPlanCreated($plan);
        } catch (\Exception $e) {
            \Log::warning('Failed to send savings plan created email: ' . $e->getMessage());
        }

        return response()->json($plan, 201);
    }

    public function show($id)
    {
        $plan = Auth::user()->savingsPlans()
            ->with(['contributions' => function($query) {
                $query->latest()->take(10);
            }, 'transactions', 'passbookRecords', 'withdrawals' => function($query) {
                $query->with('bankAccount')->latest()->take(10);
            }])
            ->findOrFail($id);

        return response()->json($plan);
    }

    public function update(Request $request, $id)
    {
        $plan = Auth::user()->savingsPlans()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'emoji' => 'sometimes|string|max:10',
            'target_amount' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,paused,completed,cancelled',
        ]);

        $plan->update($validated);

        return response()->json($plan);
    }

    public function destroy($id)
    {
        $plan = Auth::user()->savingsPlans()->findOrFail($id);
        $plan->delete();

        return response()->json(['message' => 'Savings plan deleted successfully']);
    }

    public function contribute(Request $request, $id)
    {
        $plan = Auth::user()->savingsPlans()->findOrFail($id);

        // Minimum contribution is 300 naira for daily savings
        $minAmount = $plan->frequency === 'daily' ? SavingsPlan::MINIMUM_DAILY_CONTRIBUTION : 0;

        $validated = $request->validate([
            'amount' => "required|numeric|min:{$minAmount}",
            'payment_method' => 'required|in:card,bank_transfer,wallet,cash',
            'reference' => 'nullable|string',
            'receipt' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max - REQUIRED
        ], [
            'amount.min' => "Minimum contribution for daily savings is " . currency_symbol() . "{$minAmount}",
            'receipt.required' => 'Payment receipt is required. Please attach a valid payment receipt.',
            'receipt.image' => 'Receipt must be an image file',
            'receipt.max' => 'Receipt image cannot exceed 5MB',
        ]);

        // Handle receipt upload
        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        DB::beginTransaction();
        try {
            $totalAmount = $validated['amount'];
            $dailyAmount = $plan->daily_contribution ?: SavingsPlan::MINIMUM_DAILY_CONTRIBUTION;
            $reference = $validated['reference'] ?? 'TRX-' . time() . '-' . rand(1000, 9999);

            // Calculate how many days this payment covers
            $daysCovered = floor($totalAmount / $dailyAmount);
            $remainder = $totalAmount % $dailyAmount;

            // If there's a remainder, add it to an extra day if it's at least half
            if ($remainder >= ($dailyAmount * 0.5)) {
                $daysCovered++;
            }

            // Ensure at least 1 day is covered
            $daysCovered = max(1, (int) $daysCovered);

            // Create the main contribution record (pending until admin confirms)
            $contribution = $plan->contributions()->create([
                'user_id' => Auth::id(),
                'amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'reference' => $reference,
                'receipt_path' => $receiptPath,
                'status' => 'pending', // Pending until admin confirms
                'completed_at' => null,
                'notes' => $daysCovered > 1 ? "Covers {$daysCovered} days" : null,
            ]);

            // Create passbook records for each day covered
            $startDate = $plan->getNextUnpaidDate();
            $passbookRecords = [];
            $actualDaysCovered = 0;
            $maxAttempts = $daysCovered * 3; // Safety limit to prevent infinite loops
            $attempts = 0;

            // Check if plan can still accept passbook records
            $canCreatePassbookRecords = true;
            if ($plan->target_date && $startDate->gt($plan->target_date)) {
                // Plan has exceeded target date - extend it or continue without passbook records
                $canCreatePassbookRecords = false;
            }

            if ($canCreatePassbookRecords) {
                $currentDate = $startDate->copy();
                $companyEarningsThisPayment = []; // Track company earnings for this payment

                while ($actualDaysCovered < $daysCovered && $attempts < $maxAttempts) {
                    $attempts++;

                    // Skip if the date is beyond target_date + 31 days
                    if ($plan->target_date && $currentDate->gt($plan->target_date->copy()->addDays(31))) {
                        break;
                    }

                    $dateString = $currentDate->format('Y-m-d');
                    $isFirstDayOfMonth = $currentDate->day === 1;

                    // Day 1 of every month is company earning - skip it for user contribution
                    if ($isFirstDayOfMonth) {
                        // Create company earning record for day 1
                        $companyEarningsThisPayment[] = [
                            'month' => $currentDate->month,
                            'year' => $currentDate->year,
                            'date' => $dateString,
                            'amount' => $dailyAmount,
                        ];

                        // Move to next day without counting this as user contribution
                        $currentDate->addDay();
                        continue;
                    }

                    // Use updateOrCreate to avoid race conditions with unique constraint
                    try {
                        $record = $plan->passbookRecords()->updateOrCreate(
                            [
                                'contribution_date' => $dateString,
                            ],
                            [
                                'user_id' => Auth::id(),
                                'month' => $currentDate->month,
                                'year' => $currentDate->year,
                                'day_of_month' => $currentDate->day,
                                'amount' => $dailyAmount,
                                'contribution_id' => $contribution->id,
                                'status' => 'pending',
                                'notes' => $daysCovered > 1 ? "Day " . ($actualDaysCovered + 1) . " of {$daysCovered}" : null,
                            ]
                        );

                        // Only count if we actually created or updated a record for this contribution
                        if ($record->contribution_id === $contribution->id) {
                            $passbookRecords[] = $record;
                            $actualDaysCovered++;
                        }
                    } catch (\Exception $recordError) {
                        // Log and continue - don't fail the whole contribution
                        \Log::warning("Failed to create passbook record for {$dateString}: " . $recordError->getMessage());
                    }

                    $currentDate->addDay();
                }

                // Create company earning records for all day 1s encountered
                foreach ($companyEarningsThisPayment as $earning) {
                    Earning::create([
                        'user_id' => Auth::id(),
                        'savings_plan_id' => $plan->id,
                        'contribution_id' => $contribution->id,
                        'amount' => $earning['amount'],
                        'type' => Earning::TYPE_COMPANY_FEE,
                        'status' => Earning::STATUS_PENDING,
                        'reference' => Earning::generateReference(),
                        'description' => "Company fee for {$plan->name} - Day 1 of " . date('F Y', strtotime($earning['date'])),
                        'earning_date' => $earning['date'],
                    ]);
                }
            }

            // Update days covered to actual count (minimum 1 for the contribution record)
            $effectiveDaysCovered = $actualDaysCovered > 0 ? $actualDaysCovered : $daysCovered;

            // Calculate total company fees from day 1s encountered
            $companyFeeAmount = count($companyEarningsThisPayment) * $dailyAmount;
            $memberAmount = $totalAmount - $companyFeeAmount;

            // Update first contribution date if not set
            if (!$plan->first_contribution_date) {
                $plan->first_contribution_date = now();
            }

            // Balance will be updated when admin confirms the payment
            $balanceBefore = $plan->current_amount;
            // Don't update current_amount yet - wait for admin confirmation
            // $plan->current_amount += $memberAmount;

            $plan->save();

            // Create transaction record
            $description = $effectiveDaysCovered > 1
                ? "Contribution to {$plan->name} ({$effectiveDaysCovered} days)"
                : "Contribution to {$plan->name}";

            if ($companyFeeAmount > 0) {
                $description .= " - Company fee of NGN" . number_format($companyFeeAmount) . " applied";
            }

            if (!$canCreatePassbookRecords) {
                $description .= " (extended contribution)";
            }

            $plan->transactions()->create([
                'user_id' => Auth::id(),
                'reference' => $reference,
                'type' => 'contribution',
                'amount' => $totalAmount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceBefore, // Same as before until confirmed
                'payment_method' => $validated['payment_method'],
                'status' => 'pending', // Pending until admin confirms
                'description' => $description,
                'completed_at' => null,
            ]);

            DB::commit();

            // Send email notification to user about contribution received
            try {
                $contribution->load(['user', 'savingsPlan']);
                $notificationService = app(NotificationService::class);
                $notificationService->sendContributionReceived($contribution);
            } catch (\Exception $emailError) {
                \Log::error('Failed to send contribution received email: ' . $emailError->getMessage());
            }

            $message = $effectiveDaysCovered > 1
                ? "Payment submitted! Your payment covers {$effectiveDaysCovered} days. Awaiting confirmation."
                : 'Payment submitted! Awaiting confirmation.';

            if ($companyFeeAmount > 0) {
                $companyDaysCount = count($companyEarningsThisPayment);
                if ($companyDaysCount > 1) {
                    $message .= " Note: Day 1 of each month ({$companyDaysCount} days totaling NGN" . number_format($companyFeeAmount) . ") is company service fee.";
                } else {
                    $message .= " Note: Day 1 of month (NGN" . number_format($companyFeeAmount) . ") is company service fee.";
                }
            }

            if (!$canCreatePassbookRecords && $actualDaysCovered === 0) {
                $message = "Payment submitted! This is an extended contribution. Awaiting confirmation.";
            }

            return response()->json([
                'message' => $message,
                'contribution' => $contribution,
                'days_covered' => $effectiveDaysCovered,
                'daily_amount' => $dailyAmount,
                'company_fee' => $companyFeeAmount,
                'member_savings' => $memberAmount,
                'passbook_records' => count($passbookRecords),
                'plan' => $plan->fresh(),
                'payment_instructions' => [
                    'notice' => 'IMPORTANT: This is the ONLY official Alajo account for contributions.',
                    'whatsapp_notice' => 'Please also send your payment receipt to our official WhatsApp for faster verification.',
                    'whatsapp_number' => \App\Models\Setting::get('official_whatsapp', '+234 XXX XXX XXXX'),
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Contribution failed for plan {$id}: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Contribution failed. Please try again.',
                'error' => $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    /**
     * Get passbook data for a savings plan
     */
    public function passbook(Request $request, $id)
    {
        $plan = Auth::user()->savingsPlans()->findOrFail($id);

        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        // Alajo policy: Every month has 31 days for consistency
        $daysInMonth = 31;

        // Get passbook records for this month
        $records = $plan->passbookRecords()
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day_of_month')
            ->get()
            ->keyBy('day_of_month');

        // Build daily status array
        $dailyStatus = [];
        $totalPaid = 0;
        $daysPaid = 0;

        // Get actual calendar days in the selected month
        $calendarDaysInMonth = \Carbon\Carbon::create($year, $month)->daysInMonth;
        $startDate = \Carbon\Carbon::create($year, $month, 1);
        $monthName = $startDate->format('M');

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $record = $records->get($day);

            // For days within the calendar month, use real dates
            // For days beyond (e.g., day 31 in Nov), keep the month context
            if ($day <= $calendarDaysInMonth) {
                $date = $startDate->copy()->addDays($day - 1);
                $dateStr = $date->format('Y-m-d');
                $dayName = $date->format('D');
                $isFuture = $date->isFuture();
            } else {
                // Virtual date for days beyond calendar month
                // Keep the same month for display consistency
                $dateStr = sprintf('%04d-%02d-%02d', $year, $month, $day);
                $dayName = 'Extra';
                $isFuture = false; // Extra days are always considered current month cycle
            }

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

            $dailyStatus[] = [
                'day' => $day,
                'date' => $dateStr,
                'day_name' => $dayName,
                'amount' => $amount,
                'status' => $status,
                'is_future' => $isFuture,
            ];
        }

        return response()->json([
            'plan' => $plan,
            'month' => $month,
            'year' => $year,
            'month_name' => \Carbon\Carbon::create($year, $month)->format('F Y'),
            'days_in_month' => $daysInMonth,
            'daily_status' => $dailyStatus,
            'summary' => [
                'total_paid' => $totalPaid,
                'days_paid' => $daysPaid,
                'days_remaining' => $daysInMonth - $daysPaid,
                'expected_total' => $plan->daily_contribution * $daysInMonth,
                'completion_rate' => round(($daysPaid / $daysInMonth) * 100, 1),
            ],
            'user' => [
                'name' => Auth::user()->name,
                'phone' => Auth::user()->phone,
                'email' => Auth::user()->email,
            ],
        ]);
    }
}

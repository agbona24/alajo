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
            'daily_amount.min' => 'Minimum daily contribution is ₦' . SavingsPlan::MINIMUM_DAILY_CONTRIBUTION,
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
            'receipt' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ], [
            'amount.min' => "Minimum contribution for daily savings is ₦{$minAmount}",
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

                while ($actualDaysCovered < $daysCovered && $attempts < $maxAttempts) {
                    $attempts++;

                    // Skip if the date is beyond target_date + 31 days
                    if ($plan->target_date && $currentDate->gt($plan->target_date->copy()->addDays(31))) {
                        break;
                    }

                    $dateString = $currentDate->format('Y-m-d');

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
            }

            // Update days covered to actual count (minimum 1 for the contribution record)
            $effectiveDaysCovered = $actualDaysCovered > 0 ? $actualDaysCovered : $daysCovered;

            // Handle company fee - first day's contribution goes to company
            $companyFeeAmount = 0;
            $memberAmount = $totalAmount;

            if (!$plan->company_fee_collected) {
                // First contribution - one day's amount goes to company
                $companyFeeAmount = $dailyAmount;
                $memberAmount = $totalAmount - $dailyAmount;

                // Create company fee earning record
                Earning::create([
                    'user_id' => Auth::id(),
                    'savings_plan_id' => $plan->id,
                    'contribution_id' => $contribution->id,
                    'amount' => $companyFeeAmount,
                    'type' => Earning::TYPE_COMPANY_FEE,
                    'status' => Earning::STATUS_PENDING,
                    'reference' => Earning::generateReference(),
                    'description' => "Company fee from {$plan->name} - First day contribution",
                    'earning_date' => now()->toDateString(),
                ]);

                // Mark company fee as collected
                $plan->company_fee_collected = true;
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

            $message = $effectiveDaysCovered > 1
                ? "Payment submitted! Your payment covers {$effectiveDaysCovered} days. Awaiting confirmation."
                : 'Payment submitted! Awaiting confirmation.';

            if ($companyFeeAmount > 0) {
                $message .= " Note: First day (NGN" . number_format($companyFeeAmount) . ") is company service fee.";
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

        $daysInMonth = \Carbon\Carbon::create($year, $month)->daysInMonth;

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

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $record = $records->get($day);
            $date = \Carbon\Carbon::create($year, $month, $day);

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
                'date' => $date->format('Y-m-d'),
                'day_name' => $date->format('D'),
                'amount' => $amount,
                'status' => $status,
                'is_future' => $date->isFuture(),
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

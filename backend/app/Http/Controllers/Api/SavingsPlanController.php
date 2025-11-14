<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavingsPlan;
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
            'target_amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:daily,weekly,monthly',
            'duration' => 'required|integer|min:1',
            'plan_type' => 'required|in:personal,group',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['emoji'] = $validated['emoji'] ?? '💰';
        $validated['status'] = 'active';
        $validated['start_date'] = now();

        // Calculate target date based on frequency and duration
        $targetDate = now();
        switch ($validated['frequency']) {
            case 'daily':
                $targetDate->addDays($validated['duration']);
                break;
            case 'weekly':
                $targetDate->addWeeks($validated['duration']);
                break;
            case 'monthly':
                $targetDate->addMonths($validated['duration']);
                break;
        }
        $validated['target_date'] = $targetDate;

        $plan = SavingsPlan::create($validated);

        return response()->json($plan, 201);
    }

    public function show($id)
    {
        $plan = Auth::user()->savingsPlans()
            ->with(['contributions' => function($query) {
                $query->latest()->take(10);
            }, 'transactions', 'passbookRecords'])
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

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:card,bank_transfer,wallet,cash',
            'reference' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Create contribution
            $contribution = $plan->contributions()->create([
                'user_id' => Auth::id(),
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference' => $validated['reference'] ?? 'TRX-' . time() . '-' . rand(1000, 9999),
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Update plan current amount
            $balanceBefore = $plan->current_amount;
            $plan->current_amount += $validated['amount'];

            // Check if target reached
            if ($plan->current_amount >= $plan->target_amount) {
                $plan->status = 'completed';
                $plan->completed_at = now();
            }

            $plan->save();

            // Create transaction record
            $plan->transactions()->create([
                'user_id' => Auth::id(),
                'reference' => $contribution->reference,
                'type' => 'contribution',
                'amount' => $validated['amount'],
                'balance_before' => $balanceBefore,
                'balance_after' => $plan->current_amount,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'description' => "Contribution to {$plan->name}",
                'completed_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Contribution successful',
                'contribution' => $contribution,
                'plan' => $plan->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Contribution failed', 'error' => $e->getMessage()], 500);
        }
    }
}

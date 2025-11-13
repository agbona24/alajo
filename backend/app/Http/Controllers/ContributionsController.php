<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContributionsController extends Controller
{
    /**
     * Display a listing of contributions (digital passbook).
     */
    public function index(Request $request)
    {
        try {
            $query = $request->user()->contributions()->with('savingsPlan', 'transaction');

            // Filter by savings plan
            if ($request->has('savings_plan_id')) {
                $query->where('savings_plan_id', $request->savings_plan_id);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by month/year
            if ($request->has('year') && $request->has('month')) {
                $query->whereYear('contribution_date', $request->year)
                      ->whereMonth('contribution_date', $request->month);
            }

            // Sort by date (newest first by default)
            $contributions = $query->latest('contribution_date')->paginate(31);

            return response()->json([
                'message' => 'Contributions retrieved successfully',
                'data' => $contributions,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve contributions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get passbook for a specific savings plan.
     */
    public function passbook(Request $request, SavingsPlan $savingsPlan)
    {
        try {
            // Check authorization
            if ($savingsPlan->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized access to this savings plan',
                ], 403);
            }

            // Get month/year from request or use current
            $year = $request->input('year', now()->year);
            $month = $request->input('month', now()->month);

            // Get all contributions for the specified month
            $contributions = $savingsPlan->contributions()
                ->whereYear('contribution_date', $year)
                ->whereMonth('contribution_date', $month)
                ->orderBy('serial_number')
                ->get();

            // Get monthly statistics
            $stats = [
                'total_contributions' => $contributions->count(),
                'paid_contributions' => $contributions->where('status', 'paid')->count(),
                'missed_contributions' => $contributions->where('status', 'missed')->count(),
                'pending_contributions' => $contributions->where('status', 'pending')->count(),
                'total_amount' => $contributions->where('status', 'paid')->sum('amount'),
                'average_amount' => $contributions->where('status', 'paid')->avg('amount') ?? 0,
            ];

            return response()->json([
                'message' => 'Passbook retrieved successfully',
                'data' => [
                    'savings_plan' => $savingsPlan,
                    'contributions' => $contributions,
                    'statistics' => $stats,
                    'month' => $month,
                    'year' => $year,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve passbook',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get contribution statistics for user.
     */
    public function statistics(Request $request)
    {
        try {
            $user = $request->user();

            // Overall statistics
            $stats = [
                'total_contributions' => $user->contributions()->count(),
                'paid_contributions' => $user->contributions()->where('status', 'paid')->count(),
                'missed_contributions' => $user->contributions()->where('status', 'missed')->count(),
                'pending_contributions' => $user->contributions()->where('status', 'pending')->count(),
                'total_contributed' => $user->contributions()->where('status', 'paid')->sum('amount'),

                // Current month
                'this_month_contributions' => $user->contributions()
                    ->whereMonth('contribution_date', now()->month)
                    ->whereYear('contribution_date', now()->year)
                    ->where('status', 'paid')
                    ->count(),
                'this_month_amount' => $user->contributions()
                    ->whereMonth('contribution_date', now()->month)
                    ->whereYear('contribution_date', now()->year)
                    ->where('status', 'paid')
                    ->sum('amount'),

                // Streaks
                'current_streak' => $this->calculateCurrentStreak($user),
                'longest_streak' => $this->calculateLongestStreak($user),
            ];

            return response()->json([
                'message' => 'Statistics retrieved successfully',
                'data' => $stats,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark a pending contribution as missed (Admin only).
     */
    public function markAsMissed(Request $request, Contribution $contribution)
    {
        try {
            // Check if user is admin
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            if (!$contribution->isPending()) {
                return response()->json([
                    'message' => 'Only pending contributions can be marked as missed',
                ], 422);
            }

            $contribution->update([
                'status' => 'missed',
                'notes' => $request->input('notes', 'Marked as missed by admin'),
            ]);

            return response()->json([
                'message' => 'Contribution marked as missed',
                'data' => $contribution->fresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update contribution',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calculate current contribution streak.
     */
    private function calculateCurrentStreak($user): int
    {
        $contributions = $user->contributions()
            ->where('status', 'paid')
            ->orderBy('contribution_date', 'desc')
            ->get();

        $streak = 0;
        $lastDate = now();

        foreach ($contributions as $contribution) {
            $contributionDate = $contribution->contribution_date;

            // Check if contribution is within 1 day of expected
            if ($lastDate->diffInDays($contributionDate) <= 1) {
                $streak++;
                $lastDate = $contributionDate;
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Calculate longest contribution streak.
     */
    private function calculateLongestStreak($user): int
    {
        $contributions = $user->contributions()
            ->where('status', 'paid')
            ->orderBy('contribution_date')
            ->get();

        $maxStreak = 0;
        $currentStreak = 0;
        $lastDate = null;

        foreach ($contributions as $contribution) {
            $contributionDate = $contribution->contribution_date;

            if ($lastDate === null || $lastDate->addDay()->isSameDay($contributionDate)) {
                $currentStreak++;
                $maxStreak = max($maxStreak, $currentStreak);
            } else {
                $currentStreak = 1;
            }

            $lastDate = $contributionDate;
        }

        return $maxStreak;
    }
}

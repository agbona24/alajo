<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassbookRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PassbookController extends Controller
{
    /**
     * Get all passbook records for the authenticated user
     */
    public function index(Request $request)
    {
        $query = PassbookRecord::where('user_id', Auth::id())
            ->with(['savingsPlan', 'contribution'])
            ->latest('contribution_date');

        // Filter by savings plan
        if ($request->has('savings_plan_id') && $request->savings_plan_id) {
            $query->where('savings_plan_id', $request->savings_plan_id);
        }

        // Filter by year
        if ($request->has('year') && $request->year) {
            $query->where('year', $request->year);
        }

        // Filter by month
        if ($request->has('month') && $request->month) {
            $query->where('month', $request->month);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $records = $query->paginate(50);

        return response()->json($records);
    }

    /**
     * Get passbook records for a specific savings plan
     */
    public function byPlan($planId)
    {
        $records = PassbookRecord::where('user_id', Auth::id())
            ->where('savings_plan_id', $planId)
            ->with(['contribution', 'savingsPlan'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->orderBy('day_of_month', 'asc')
            ->get();

        // Group by year and month
        $grouped = $records->groupBy(function($record) {
            return $record->year . '-' . str_pad($record->month, 2, '0', STR_PAD_LEFT);
        });

        return response()->json([
            'records' => $records,
            'grouped' => $grouped,
            'summary' => [
                'total_contributions' => $records->where('status', 'paid')->count(),
                'missed_contributions' => $records->where('status', 'missed')->count(),
                'total_amount' => $records->where('status', 'paid')->sum('amount'),
            ]
        ]);
    }

    /**
     * Get passbook summary statistics
     */
    public function summary()
    {
        $userId = Auth::id();

        $currentYear = now()->year;
        $currentMonth = now()->month;

        $stats = [
            'this_month' => [
                'total' => PassbookRecord::where('user_id', $userId)
                    ->where('year', $currentYear)
                    ->where('month', $currentMonth)
                    ->where('status', 'paid')
                    ->sum('amount'),
                'count' => PassbookRecord::where('user_id', $userId)
                    ->where('year', $currentYear)
                    ->where('month', $currentMonth)
                    ->where('status', 'paid')
                    ->count(),
            ],
            'this_year' => [
                'total' => PassbookRecord::where('user_id', $userId)
                    ->where('year', $currentYear)
                    ->where('status', 'paid')
                    ->sum('amount'),
                'count' => PassbookRecord::where('user_id', $userId)
                    ->where('year', $currentYear)
                    ->where('status', 'paid')
                    ->count(),
            ],
            'all_time' => [
                'total' => PassbookRecord::where('user_id', $userId)
                    ->where('status', 'paid')
                    ->sum('amount'),
                'count' => PassbookRecord::where('user_id', $userId)
                    ->where('status', 'paid')
                    ->count(),
            ],
            'streak' => $this->calculateStreak($userId),
        ];

        return response()->json($stats);
    }

    /**
     * Calculate the user's contribution streak
     */
    private function calculateStreak($userId)
    {
        $records = PassbookRecord::where('user_id', $userId)
            ->orderBy('contribution_date', 'desc')
            ->get();

        $streak = 0;
        $lastDate = null;

        foreach ($records as $record) {
            if ($record->status !== 'paid') {
                break;
            }

            if ($lastDate === null) {
                $streak++;
                $lastDate = $record->contribution_date;
            } else {
                // Check if it's consecutive (within expected frequency)
                $daysDiff = $lastDate->diffInDays($record->contribution_date);

                if ($daysDiff <= 7) { // Allow up to 7 days gap
                    $streak++;
                    $lastDate = $record->contribution_date;
                } else {
                    break;
                }
            }
        }

        return $streak;
    }
}

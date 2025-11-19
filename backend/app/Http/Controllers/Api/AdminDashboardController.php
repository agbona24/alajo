<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AjoGroup;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\AjoMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function stats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_groups' => AjoGroup::count(),
            'active_groups' => AjoGroup::where('status', 'active')->count(),
            'total_savings_plans' => SavingsPlan::count(),
            'total_savings_amount' => SavingsPlan::sum('current_amount'),
            'total_transactions' => Transaction::count(),
            'total_transaction_amount' => Transaction::where('status', 'completed')->sum('amount'),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent users
     */
    public function recentUsers()
    {
        $users = User::latest()
            ->take(10)
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json($users);
    }

    /**
     * Get recent groups
     */
    public function recentGroups()
    {
        $groups = AjoGroup::with('creator:id,name,email')
            ->latest()
            ->take(10)
            ->get();

        return response()->json($groups);
    }

    /**
     * Get top collectors
     */
    public function topCollectors()
    {
        $collectors = User::select('users.*')
            ->join('ajo_members', 'users.id', '=', 'ajo_members.user_id')
            ->where('ajo_members.is_admin', true)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->selectRaw('COUNT(DISTINCT ajo_members.ajo_group_id) as groups_count')
            ->selectRaw('COALESCE(SUM(ajo_members.total_contributed), 0) as total_collected')
            ->orderByDesc('groups_count')
            ->take(10)
            ->get();

        return response()->json($collectors);
    }

    /**
     * Get monthly user growth
     */
    public function monthlyGrowth()
    {
        $growth = User::selectRaw("DATE_TRUNC('month', created_at)::date as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($growth);
    }

    /**
     * Get all users with pagination
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $users = $query->withCount(['savingsPlans', 'ajoMemberships'])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    /**
     * Get all groups with pagination
     */
    public function groups(Request $request)
    {
        $query = AjoGroup::with('creator:id,name,email');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('group_code', 'ilike', "%{$search}%");
            });
        }

        $groups = $query->withCount('ajoMembers')
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($groups);
    }

    /**
     * Get collectors list
     */
    public function collectors(Request $request)
    {
        $collectors = User::select('users.*')
            ->join('ajo_members', 'users.id', '=', 'ajo_members.user_id')
            ->where('ajo_members.is_admin', true)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->selectRaw('COUNT(DISTINCT ajo_members.ajo_group_id) as groups_count')
            ->selectRaw('COALESCE(SUM(ajo_members.total_contributed), 0) as total_collected')
            ->orderByDesc('groups_count')
            ->paginate($request->get('per_page', 20));

        return response()->json($collectors);
    }

    /**
     * Get transactions with pagination
     */
    public function transactions(Request $request)
    {
        $query = Transaction::with('user:id,name,email');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($transactions);
    }
}

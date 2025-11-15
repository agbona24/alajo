<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AjoGroup;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\AjoMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Overall statistics
        $stats = [
            'total_users' => User::count(),
            'total_groups' => AjoGroup::count(),
            'active_groups' => AjoGroup::where('status', 'active')->count(),
            'total_savings_plans' => SavingsPlan::count(),
            'total_savings_amount' => SavingsPlan::sum('current_amount'),
            'total_transactions' => Transaction::count(),
            'total_transaction_amount' => Transaction::where('status', 'completed')->sum('amount'),
        ];

        // Recent users
        $recentUsers = User::latest()->take(5)->get();

        // Recent groups
        $recentGroups = AjoGroup::with('creator')->latest()->take(5)->get();

        // Top collectors (users who are admins in multiple groups)
        $topCollectors = User::select('users.*')
            ->join('ajo_members', 'users.id', '=', 'ajo_members.user_id')
            ->where('ajo_members.is_admin', true)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->selectRaw('COUNT(ajo_members.id) as groups_count')
            ->orderByDesc('groups_count')
            ->take(5)
            ->get();

        // Monthly growth
        $monthlyUsers = User::selectRaw("DATE_TRUNC('month', created_at) as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return view('admin.dashboard', compact('stats', 'recentUsers', 'recentGroups', 'topCollectors', 'monthlyUsers'));
    }

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
            ->paginate(20);

        return view('admin.users', compact('users'));
    }

    public function groups(Request $request)
    {
        $query = AjoGroup::with('creator');

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

        $groups = $query->withCount('members')
            ->latest()
            ->paginate(20);

        return view('admin.groups', compact('groups'));
    }

    public function collectors()
    {
        // Get users who are admins in at least one group
        $collectors = User::select('users.*')
            ->join('ajo_members', 'users.id', '=', 'ajo_members.user_id')
            ->where('ajo_members.is_admin', true)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->selectRaw('COUNT(DISTINCT ajo_members.ajo_group_id) as groups_count')
            ->selectRaw('SUM(ajo_members.total_contributed) as total_collected')
            ->orderByDesc('groups_count')
            ->paginate(20);

        return view('admin.collectors', compact('collectors'));
    }

    public function transactions(Request $request)
    {
        $query = Transaction::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->latest()
            ->paginate(20);

        return view('admin.transactions', compact('transactions'));
    }
}

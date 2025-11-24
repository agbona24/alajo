<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AjoGroup;
use App\Models\DailyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CollectorController extends Controller
{
    /**
     * Display a listing of all collectors.
     */
    public function index(Request $request)
    {
        $query = User::collectors()->with(['createdAjoGroups']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $collectors = $query->latest()->paginate(20);

        // Statistics
        $stats = [
            'total_collectors' => User::collectors()->count(),
            'active_collectors' => User::collectors()->activeUsers()->count(),
            'suspended_collectors' => User::collectors()->where('status', User::STATUS_SUSPENDED)->count(),
        ];

        return view('admin.collectors.index', compact('collectors', 'stats'));
    }

    /**
     * Show the form for creating a new collector.
     */
    public function create()
    {
        return view('admin.collectors.create');
    }

    /**
     * Store a newly created collector.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = User::ROLE_COLLECTOR;
        $validated['status'] = User::STATUS_ACTIVE;

        $collector = User::create($validated);

        return redirect()
            ->route('admin.collectors.show', $collector)
            ->with('success', 'Collector created successfully.');
    }

    /**
     * Display the specified collector with their performance metrics.
     */
    public function show(User $collector)
    {
        if (!$collector->isCollector()) {
            abort(404, 'Collector not found.');
        }

        // Get groups managed by this collector
        $managedGroups = AjoGroup::whereHas('members', function ($q) use ($collector) {
            $q->where('user_id', $collector->id)->where('is_admin', true);
        })->with(['members'])->get();

        // Performance metrics
        $metrics = $this->calculateCollectorMetrics($collector, $managedGroups);

        // Recent payments recorded by this collector
        $recentPayments = DailyPayment::where('recorded_by', $collector->id)
            ->with(['user', 'ajoGroup'])
            ->latest()
            ->take(20)
            ->get();

        return view('admin.collectors.show', compact('collector', 'managedGroups', 'metrics', 'recentPayments'));
    }

    /**
     * Calculate performance metrics for a collector.
     */
    private function calculateCollectorMetrics(User $collector, $managedGroups): array
    {
        $groupIds = $managedGroups->pluck('id');

        // This month's stats
        $thisMonth = Carbon::now()->startOfMonth();

        $totalPaymentsRecorded = DailyPayment::where('recorded_by', $collector->id)->count();
        $thisMonthPayments = DailyPayment::where('recorded_by', $collector->id)
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $totalAmountCollected = DailyPayment::where('recorded_by', $collector->id)
            ->where('status', 'paid')
            ->sum('amount');

        $thisMonthAmount = DailyPayment::where('recorded_by', $collector->id)
            ->where('status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount');

        // Collection rate
        $expectedPayments = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $actualPayments = DailyPayment::whereIn('ajo_group_id', $groupIds)
            ->where('status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $collectionRate = $expectedPayments > 0
            ? round(($actualPayments / $expectedPayments) * 100, 1)
            : 0;

        return [
            'total_groups' => $managedGroups->count(),
            'active_groups' => $managedGroups->where('status', 'active')->count(),
            'total_members' => $managedGroups->sum(fn($g) => $g->members->count()),
            'total_payments_recorded' => $totalPaymentsRecorded,
            'this_month_payments' => $thisMonthPayments,
            'total_amount_collected' => $totalAmountCollected,
            'this_month_amount' => $thisMonthAmount,
            'collection_rate' => $collectionRate,
        ];
    }

    /**
     * Show the form for editing the specified collector.
     */
    public function edit(User $collector)
    {
        if (!$collector->isCollector()) {
            abort(404, 'Collector not found.');
        }

        return view('admin.collectors.edit', compact('collector'));
    }

    /**
     * Update the specified collector.
     */
    public function update(Request $request, User $collector)
    {
        if (!$collector->isCollector()) {
            abort(404, 'Collector not found.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $collector->id,
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $collector->update($validated);

        return redirect()
            ->route('admin.collectors.show', $collector)
            ->with('success', 'Collector updated successfully.');
    }

    /**
     * Update collector password.
     */
    public function updatePassword(Request $request, User $collector)
    {
        if (!$collector->isCollector()) {
            abort(404, 'Collector not found.');
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $collector->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Activate a collector.
     */
    public function activate(User $collector)
    {
        $collector->update(['status' => User::STATUS_ACTIVE]);

        return back()->with('success', 'Collector activated successfully.');
    }

    /**
     * Suspend a collector.
     */
    public function suspend(User $collector)
    {
        $collector->update(['status' => User::STATUS_SUSPENDED]);

        return back()->with('success', 'Collector suspended successfully.');
    }

    /**
     * Delete a collector.
     */
    public function destroy(User $collector)
    {
        if (!$collector->isCollector()) {
            abort(404, 'Collector not found.');
        }

        $collector->delete();

        return redirect()
            ->route('admin.collectors.index')
            ->with('success', 'Collector deleted successfully.');
    }
}

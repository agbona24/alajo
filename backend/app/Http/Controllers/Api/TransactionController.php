<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Auth::user()->transactions()
            ->with('savingsPlan', 'ajoGroup')
            ->latest();

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by reference or description
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('reference', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }

    public function show($id)
    {
        $transaction = Auth::user()->transactions()
            ->with('savingsPlan', 'ajoGroup')
            ->findOrFail($id);

        return response()->json($transaction);
    }
}

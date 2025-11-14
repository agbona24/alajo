<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankAccountController extends Controller
{
    public function index()
    {
        $accounts = Auth::user()->bankAccounts()->latest()->get();
        return response()->json($accounts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_code' => 'required|string|max:10',
            'account_number' => 'required|string|max:20',
            'account_name' => 'required|string|max:255',
            'is_primary' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['is_verified'] = false;

        // If this is set as primary, unset other primary accounts
        if ($validated['is_primary'] ?? false) {
            Auth::user()->bankAccounts()->update(['is_primary' => false]);
        }

        $account = Auth::user()->bankAccounts()->create($validated);

        return response()->json($account, 201);
    }

    public function show($id)
    {
        $account = Auth::user()->bankAccounts()->findOrFail($id);
        return response()->json($account);
    }

    public function update(Request $request, $id)
    {
        $account = Auth::user()->bankAccounts()->findOrFail($id);

        $validated = $request->validate([
            'is_primary' => 'boolean',
        ]);

        if ($validated['is_primary'] ?? false) {
            Auth::user()->bankAccounts()->update(['is_primary' => false]);
        }

        $account->update($validated);

        return response()->json($account);
    }

    public function destroy($id)
    {
        $account = Auth::user()->bankAccounts()->findOrFail($id);
        $account->delete();

        return response()->json(['message' => 'Bank account deleted successfully']);
    }
}

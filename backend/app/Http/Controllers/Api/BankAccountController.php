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
            'bank' => 'required_without:bank_name|string|max:255',
            'bank_name' => 'required_without:bank|string|max:255',
            'bank_code' => 'nullable|string|max:10',
            'account_number' => 'required|string|max:20',
            'account_name' => 'required|string|max:255',
            'is_primary' => 'boolean',
        ]);

        // Normalize bank_name field (accept both 'bank' and 'bank_name')
        if (isset($validated['bank']) && !isset($validated['bank_name'])) {
            $validated['bank_name'] = $validated['bank'];
            unset($validated['bank']);
        }

        // Set default bank_code if not provided (required by database)
        if (empty($validated['bank_code'])) {
            $validated['bank_code'] = '000';
        }

        $validated['user_id'] = Auth::id();
        $validated['is_verified'] = false;

        // If this is set as primary, unset other primary accounts
        if ($validated['is_primary'] ?? false) {
            Auth::user()->bankAccounts()->update(['is_primary' => false]);
        }

        // If this is the first bank account, make it primary
        if (Auth::user()->bankAccounts()->count() === 0) {
            $validated['is_primary'] = true;
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

    public function setPrimary($id)
    {
        $account = Auth::user()->bankAccounts()->findOrFail($id);

        // Unset all other primary accounts
        Auth::user()->bankAccounts()->update(['is_primary' => false]);

        // Set this one as primary
        $account->update(['is_primary' => true]);

        return response()->json([
            'message' => 'Bank account set as primary',
            'account' => $account,
        ]);
    }

    public function destroy($id)
    {
        $account = Auth::user()->bankAccounts()->findOrFail($id);
        $account->delete();

        return response()->json(['message' => 'Bank account deleted successfully']);
    }
}

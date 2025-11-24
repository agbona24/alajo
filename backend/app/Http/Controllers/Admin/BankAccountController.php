<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankAccountController extends Controller
{
    /**
     * Display a listing of platform bank accounts.
     */
    public function index()
    {
        $accounts = PlatformBankAccount::with('creator')
            ->orderByDesc('is_primary')
            ->orderByDesc('is_active')
            ->get();

        return view('admin.bank-accounts.index', compact('accounts'));
    }

    /**
     * Show the form for creating a new bank account.
     */
    public function create()
    {
        return view('admin.bank-accounts.create');
    }

    /**
     * Store a newly created bank account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:20',
            'bank_code' => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_primary' => 'boolean',
        ]);

        $validated['created_by'] = Auth::id();

        $account = PlatformBankAccount::create($validated);

        // If set as primary, update others
        if ($request->boolean('is_primary')) {
            $account->setAsPrimary();
        }

        return redirect()
            ->route('admin.bank-accounts.index')
            ->with('success', 'Bank account added successfully.');
    }

    /**
     * Show the form for editing the specified bank account.
     */
    public function edit(PlatformBankAccount $account)
    {
        return view('admin.bank-accounts.edit', compact('account'));
    }

    /**
     * Update the specified bank account.
     */
    public function update(Request $request, PlatformBankAccount $account)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:20',
            'bank_code' => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_primary' => 'boolean',
        ]);

        $account->update($validated);

        // If set as primary, update others
        if ($request->boolean('is_primary')) {
            $account->setAsPrimary();
        }

        return redirect()
            ->route('admin.bank-accounts.index')
            ->with('success', 'Bank account updated successfully.');
    }

    /**
     * Set a bank account as primary.
     */
    public function setPrimary(PlatformBankAccount $account)
    {
        $account->setAsPrimary();

        return back()->with('success', 'Bank account set as primary.');
    }

    /**
     * Toggle bank account active status.
     */
    public function toggle(PlatformBankAccount $account)
    {
        $account->update(['is_active' => !$account->is_active]);

        $status = $account->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Bank account {$status} successfully.");
    }

    /**
     * Remove the specified bank account.
     */
    public function destroy(PlatformBankAccount $account)
    {
        // Check if there are pending transfers
        if ($account->pendingTransfers()->whereIn('status', ['pending', 'awaiting_approval'])->exists()) {
            return back()->with('error', 'Cannot delete account with pending transfers.');
        }

        $account->delete();

        return redirect()
            ->route('admin.bank-accounts.index')
            ->with('success', 'Bank account deleted successfully.');
    }
}

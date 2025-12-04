<?php

namespace App\Services;

use App\Mail\PaymentConfirmation;
use App\Mail\WithdrawalRequest;
use App\Mail\WithdrawalCompleted;
use App\Mail\WelcomeEmail;
use App\Mail\SavingsPlanCreated;
use App\Models\Contribution;
use App\Models\SavingsPlan;
use App\Models\Setting;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Check if email notifications are enabled.
     */
    protected function emailNotificationsEnabled(): bool
    {
        return Setting::get('email_notifications', true);
    }

    /**
     * Check if SMTP is configured.
     */
    protected function isSmtpConfigured(): bool
    {
        $smtpSettings = Setting::getSmtpSettings();
        return !empty($smtpSettings['mail_host']) && !empty($smtpSettings['mail_from_address']);
    }

    /**
     * Send savings plan created notification.
     */
    public function sendSavingsPlanCreated(SavingsPlan $plan): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        $user = $plan->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping plan created email');
            return false;
        }

        try {
            Mail::to($user->email)->send(new SavingsPlanCreated($plan));
            Log::info('Savings plan created email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send savings plan created email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send welcome email to new user.
     */
    public function sendWelcomeEmail(User $user): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping welcome email');
            return false;
        }

        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
            Log::info('Welcome email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send contribution received email (when user makes a contribution).
     */
    public function sendContributionReceived(Contribution $contribution): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        $user = $contribution->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping contribution received email');
            return false;
        }

        // Check user's email notification preference for contributions
        if (!$user->email_notifications_contributions) {
            Log::info('User ' . $user->id . ' has disabled contribution emails');
            return false;
        }

        try {
            $plan = $contribution->savingsPlan;
            Mail::raw(
                "Hello {$user->name},\n\n" .
                "Your contribution has been received and is awaiting approval.\n\n" .
                "Contribution Details:\n" .
                "Plan: {$plan->name}\n" .
                "Amount: " . currency_symbol() . number_format($contribution->amount, 0) . "\n" .
                "Payment Method: " . ucfirst($contribution->payment_method) . "\n" .
                "Reference: {$contribution->reference}\n" .
                "Status: Pending Approval\n\n" .
                "You will receive another email once your contribution is approved.\n\n" .
                "Thank you for saving with Alajo!\n" .
                "- Alajo Team",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Contribution Received - Awaiting Approval');
                }
            );
            Log::info('Contribution received email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send contribution received email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send payment confirmation email (when admin approves contribution).
     */
    public function sendPaymentConfirmation(Contribution $contribution): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        if (!Setting::get('notify_on_payment', true)) {
            return false;
        }

        $user = $contribution->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping payment confirmation');
            return false;
        }

        // Check user's email notification preference for contributions
        if (!$user->email_notifications_contributions) {
            Log::info('User ' . $user->id . ' has disabled contribution emails');
            return false;
        }

        try {
            Mail::to($user->email)->send(new PaymentConfirmation($contribution));
            Log::info('Payment confirmation email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment confirmation: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send withdrawal request email.
     */
    public function sendWithdrawalRequest(Withdrawal $withdrawal): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        $user = $withdrawal->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping withdrawal request email');
            return false;
        }

        // Check user's email notification preference for withdrawals
        if (!$user->email_notifications_withdrawals) {
            Log::info('User ' . $user->id . ' has disabled withdrawal emails');
            return false;
        }

        try {
            Mail::to($user->email)->send(new WithdrawalRequest($withdrawal));
            Log::info('Withdrawal request email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send withdrawal request email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send withdrawal processing email (when admin marks as sent).
     */
    public function sendWithdrawalProcessing(Withdrawal $withdrawal): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        $user = $withdrawal->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping withdrawal processing email');
            return false;
        }

        // Check user's email notification preference for withdrawals
        if (!$user->email_notifications_withdrawals) {
            Log::info('User ' . $user->id . ' has disabled withdrawal emails');
            return false;
        }

        try {
            $plan = $withdrawal->savingsPlan;
            $bankAccount = $withdrawal->bankAccount;

            Mail::raw(
                "Hello {$user->name},\n\n" .
                "Your withdrawal request has been processed and payment has been sent!\n\n" .
                "Withdrawal Details:\n" .
                "Amount: " . currency_symbol() . number_format($withdrawal->amount, 0) . "\n" .
                "From: {$plan->name}\n" .
                "Reference: {$withdrawal->reference}\n\n" .
                "Bank Details:\n" .
                "Bank: {$bankAccount->bank_name}\n" .
                "Account: {$bankAccount->account_number}\n" .
                "Account Name: {$bankAccount->account_name}\n\n" .
                "The payment should reflect in your account within the next few hours. " .
                "If you don't receive the payment, please contact us.\n\n" .
                "Thank you for trusting Alajo with your savings!\n" .
                "- Alajo Team",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Withdrawal Payment Sent');
                }
            );
            Log::info('Withdrawal processing email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send withdrawal processing email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send withdrawal completed email.
     */
    public function sendWithdrawalCompleted(Withdrawal $withdrawal): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        if (!Setting::get('notify_on_payout', true)) {
            return false;
        }

        $user = $withdrawal->user;
        if (empty($user->email)) {
            Log::info('No email address for user ' . $user->id . ', skipping withdrawal completed email');
            return false;
        }

        // Check user's email notification preference for withdrawals
        if (!$user->email_notifications_withdrawals) {
            Log::info('User ' . $user->id . ' has disabled withdrawal emails');
            return false;
        }

        try {
            Mail::to($user->email)->send(new WithdrawalCompleted($withdrawal));
            Log::info('Withdrawal completed email sent to ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send withdrawal completed email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send notification to admin about new withdrawal request.
     */
    public function notifyAdminNewWithdrawal(Withdrawal $withdrawal): bool
    {
        if (!$this->emailNotificationsEnabled() || !$this->isSmtpConfigured()) {
            return false;
        }

        $adminEmail = Setting::get('support_email');
        if (empty($adminEmail)) {
            return false;
        }

        try {
            $user = $withdrawal->user;
            $plan = $withdrawal->savingsPlan;

            Mail::raw(
                "New withdrawal request received:\n\n" .
                "User: {$user->name} ({$user->phone})\n" .
                "Amount: ₦" . number_format($withdrawal->amount, 0) . "\n" .
                "Plan: {$plan->name}\n" .
                "Reference: {$withdrawal->reference}\n\n" .
                "Please review and process this request.",
                function ($message) use ($adminEmail) {
                    $message->to($adminEmail)
                        ->subject('New Withdrawal Request - Action Required');
                }
            );

            Log::info('Admin notified about new withdrawal request');
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to notify admin: ' . $e->getMessage());
            return false;
        }
    }
}

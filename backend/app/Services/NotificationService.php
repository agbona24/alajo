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
     * Send payment confirmation email.
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

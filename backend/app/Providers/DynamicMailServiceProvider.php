<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

class DynamicMailServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Only run if the settings table exists (prevents errors during migrations)
        if (!$this->app->runningInConsole() || $this->canAccessDatabase()) {
            $this->configureMailFromDatabase();
        }
    }

    /**
     * Check if we can access the database.
     */
    protected function canAccessDatabase(): bool
    {
        try {
            return Schema::hasTable('settings');
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Configure mail settings from database.
     */
    protected function configureMailFromDatabase(): void
    {
        try {
            $smtpSettings = Setting::getSmtpSettings();

            // Only override if we have valid database settings
            if (!empty($smtpSettings['mail_host']) && !empty($smtpSettings['mail_from_address'])) {
                // Set the mail driver
                Config::set('mail.default', $smtpSettings['mail_mailer'] ?? 'smtp');

                // Configure SMTP settings
                Config::set('mail.mailers.smtp.host', $smtpSettings['mail_host']);
                Config::set('mail.mailers.smtp.port', $smtpSettings['mail_port'] ?? 587);
                Config::set('mail.mailers.smtp.username', $smtpSettings['mail_username'] ?? null);
                Config::set('mail.mailers.smtp.password', $smtpSettings['mail_password'] ?? null);
                Config::set('mail.mailers.smtp.encryption', $smtpSettings['mail_encryption'] === 'null' ? null : ($smtpSettings['mail_encryption'] ?? 'tls'));

                // Configure sender information
                Config::set('mail.from.address', $smtpSettings['mail_from_address']);
                Config::set('mail.from.name', $smtpSettings['mail_from_name'] ?? config('app.name'));
            }
        } catch (\Exception $e) {
            // Log the error but don't break the application
            \Log::warning('Failed to configure mail from database: ' . $e->getMessage());
        }
    }
}

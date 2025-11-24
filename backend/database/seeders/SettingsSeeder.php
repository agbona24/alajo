<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'group' => 'general',
                'key' => 'app_name',
                'value' => 'Alajo',
                'type' => 'string',
                'label' => 'Application Name',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'app_description',
                'value' => 'Your trusted savings and contribution platform',
                'type' => 'string',
                'label' => 'Application Description',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'support_email',
                'value' => 'support@alajo.com',
                'type' => 'string',
                'label' => 'Support Email',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'support_phone',
                'value' => '+2349071142022',
                'type' => 'string',
                'label' => 'Support Phone',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'whatsapp_number',
                'value' => '2349071142022',
                'type' => 'string',
                'label' => 'WhatsApp Number',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'address',
                'value' => 'Lagos, Nigeria',
                'type' => 'string',
                'label' => 'Business Address',
                'is_public' => true,
            ],

            // Currency Settings
            [
                'group' => 'currency',
                'key' => 'currency_code',
                'value' => 'NGN',
                'type' => 'string',
                'label' => 'Currency Code',
                'is_public' => true,
            ],
            [
                'group' => 'currency',
                'key' => 'currency_symbol',
                'value' => '₦',
                'type' => 'string',
                'label' => 'Currency Symbol',
                'is_public' => true,
            ],
            [
                'group' => 'currency',
                'key' => 'currency_position',
                'value' => 'before',
                'type' => 'string',
                'label' => 'Currency Position',
                'is_public' => true,
            ],
            [
                'group' => 'currency',
                'key' => 'thousand_separator',
                'value' => ',',
                'type' => 'string',
                'label' => 'Thousand Separator',
                'is_public' => true,
            ],
            [
                'group' => 'currency',
                'key' => 'decimal_separator',
                'value' => '.',
                'type' => 'string',
                'label' => 'Decimal Separator',
                'is_public' => true,
            ],
            [
                'group' => 'currency',
                'key' => 'decimal_places',
                'value' => '0',
                'type' => 'integer',
                'label' => 'Decimal Places',
                'is_public' => true,
            ],

            // Commission Settings
            [
                'group' => 'commission',
                'key' => 'collector_commission_rate',
                'value' => '5',
                'type' => 'integer',
                'label' => 'Collector Commission Rate (%)',
                'is_public' => false,
            ],
            [
                'group' => 'commission',
                'key' => 'platform_fee_rate',
                'value' => '2',
                'type' => 'integer',
                'label' => 'Platform Fee Rate (%)',
                'is_public' => false,
            ],
            [
                'group' => 'commission',
                'key' => 'withdrawal_fee',
                'value' => '50',
                'type' => 'integer',
                'label' => 'Withdrawal Fee (Fixed)',
                'is_public' => true,
            ],

            // Notification Settings
            [
                'group' => 'notification',
                'key' => 'email_notifications',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Email Notifications',
                'is_public' => false,
            ],
            [
                'group' => 'notification',
                'key' => 'sms_notifications',
                'value' => '0',
                'type' => 'boolean',
                'label' => 'Enable SMS Notifications',
                'is_public' => false,
            ],
            [
                'group' => 'notification',
                'key' => 'push_notifications',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Push Notifications',
                'is_public' => false,
            ],
            [
                'group' => 'notification',
                'key' => 'notify_on_payment',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Notify on Payment Confirmation',
                'is_public' => false,
            ],
            [
                'group' => 'notification',
                'key' => 'notify_on_payout',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Notify on Withdrawal Payout',
                'is_public' => false,
            ],

            // SMTP Settings (defaults - admin should configure)
            [
                'group' => 'smtp',
                'key' => 'mail_mailer',
                'value' => 'smtp',
                'type' => 'string',
                'label' => 'Mail Driver',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_host',
                'value' => '',
                'type' => 'string',
                'label' => 'SMTP Host',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_port',
                'value' => '587',
                'type' => 'string',
                'label' => 'SMTP Port',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_username',
                'value' => '',
                'type' => 'string',
                'label' => 'SMTP Username',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_password',
                'value' => '',
                'type' => 'string',
                'label' => 'SMTP Password',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_encryption',
                'value' => 'tls',
                'type' => 'string',
                'label' => 'SMTP Encryption',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_from_address',
                'value' => '',
                'type' => 'string',
                'label' => 'From Email Address',
                'is_public' => false,
            ],
            [
                'group' => 'smtp',
                'key' => 'mail_from_name',
                'value' => 'Alajo',
                'type' => 'string',
                'label' => 'From Name',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        $this->command->info('Settings seeded successfully!');
    }
}

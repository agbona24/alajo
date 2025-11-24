<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PlatformBankAccount;
use Illuminate\Support\Facades\Hash;

class AdminCollectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@alajo.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'phone' => '08012345678',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Admin created: admin@alajo.com / password123");

        // Create Sample Collectors
        $collectors = [
            [
                'name' => 'John Collector',
                'email' => 'collector1@alajo.com',
                'phone' => '08023456789',
            ],
            [
                'name' => 'Mary Collector',
                'email' => 'collector2@alajo.com',
                'phone' => '08034567890',
            ],
            [
                'name' => 'Peter Collector',
                'email' => 'collector3@alajo.com',
                'phone' => '08045678901',
            ],
        ];

        foreach ($collectors as $collectorData) {
            User::updateOrCreate(
                ['email' => $collectorData['email']],
                [
                    'name' => $collectorData['name'],
                    'password' => Hash::make('password123'),
                    'role' => User::ROLE_COLLECTOR,
                    'status' => User::STATUS_ACTIVE,
                    'phone' => $collectorData['phone'],
                    'email_verified_at' => now(),
                ]
            );

            $this->command->info("Collector created: {$collectorData['email']} / password123");
        }

        // Clear existing platform bank accounts and create primary account
        PlatformBankAccount::query()->delete();

        PlatformBankAccount::create([
            'bank_name' => 'PalmPay',
            'account_name' => 'OLUYEMI OLA DADA',
            'account_number' => '9071142022',
            'bank_code' => '',
            'is_active' => true,
            'is_primary' => true,
            'description' => 'Primary collection account',
            'created_by' => $admin->id,
        ]);

        $this->command->info("Bank account created: PalmPay - 9071142022 (Primary)");

        $this->command->info('');
        $this->command->info('===========================================');
        $this->command->info('Admin & Collector seeding completed!');
        $this->command->info('===========================================');
        $this->command->info('');
        $this->command->info('Login credentials:');
        $this->command->info('Admin: admin@alajo.com / password123');
        $this->command->info('Collectors: collector1@alajo.com, collector2@alajo.com, collector3@alajo.com / password123');
        $this->command->info('');
    }
}

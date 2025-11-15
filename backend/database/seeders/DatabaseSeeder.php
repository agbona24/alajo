<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\BankAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Chioma Adeyemi',
            'email' => 'test@hajo.com',
            'password' => Hash::make('password'),
        ]);

        // Create bank account
        BankAccount::create([
            'user_id' => $user->id,
            'bank_name' => 'GTBank',
            'bank_code' => '058',
            'account_number' => '0123456789',
            'account_name' => 'Chioma Adeyemi',
            'is_primary' => true,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        // Create sample savings plans
        $plan1 = SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'New Laptop Fund',
            'emoji' => '💻',
            'target_amount' => 500000,
            'current_amount' => 150000,
            'frequency' => 'monthly',
            'duration' => 6,
            'plan_type' => 'personal',
            'description' => 'Saving for MacBook Pro',
            'status' => 'active',
            'start_date' => now()->subMonths(2),
            'target_date' => now()->addMonths(4),
        ]);

        $plan2 = SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'Vacation to Dubai',
            'emoji' => '✈️',
            'target_amount' => 1000000,
            'current_amount' => 320000,
            'frequency' => 'weekly',
            'duration' => 20,
            'plan_type' => 'personal',
            'description' => 'Dream vacation with family',
            'status' => 'active',
            'start_date' => now()->subWeeks(8),
            'target_date' => now()->addWeeks(12),
        ]);

        $plan3 = SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'Emergency Fund',
            'emoji' => '🏥',
            'target_amount' => 2000000,
            'current_amount' => 850000,
            'frequency' => 'monthly',
            'duration' => 12,
            'plan_type' => 'personal',
            'description' => 'Building 6 months emergency savings',
            'status' => 'active',
            'start_date' => now()->subMonths(5),
            'target_date' => now()->addMonths(7),
        ]);

        // Add contributions to plans
        for ($i = 0; $i < 3; $i++) {
            $plan1->contributions()->create([
                'user_id' => $user->id,
                'amount' => 50000,
                'payment_method' => 'card',
                'reference' => 'TRX-' . time() . '-' . rand(1000, 9999),
                'status' => 'completed',
                'completed_at' => now()->subDays($i * 10),
                'created_at' => now()->subDays($i * 10),
            ]);

            // Create transaction record
            $plan1->transactions()->create([
                'user_id' => $user->id,
                'reference' => 'TRX-' . time() . '-' . rand(1000, 9999),
                'type' => 'contribution',
                'amount' => 50000,
                'balance_before' => $i * 50000,
                'balance_after' => ($i + 1) * 50000,
                'payment_method' => 'card',
                'status' => 'completed',
                'description' => "Contribution to {$plan1->name}",
                'completed_at' => now()->subDays($i * 10),
                'created_at' => now()->subDays($i * 10),
            ]);
        }

        echo "✅ Database seeded successfully!\n";
        echo "📧 Test user: test@hajo.com\n";
        echo "🔑 Password: password\n";
    }
}

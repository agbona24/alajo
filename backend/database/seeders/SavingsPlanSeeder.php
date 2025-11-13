<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SavingsPlan;
use Illuminate\Database\Seeder;

class SavingsPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the test user
        $user = User::where('email', 'user@alajo.com')->first();

        if (!$user) {
            $this->command->error('Test user not found. Run UserSeeder first.');
            return;
        }

        // Create sample savings plans
        SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'Emergency Fund',
            'target_amount' => 50000,
            'current_balance' => 15000,
            'frequency' => 'daily',
            'start_date' => now()->subDays(30),
            'end_date' => now()->addDays(60),
            'description' => 'Building an emergency fund for unexpected expenses',
            'auto_debit' => true,
            'status' => 'active',
        ]);

        SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'New Phone',
            'target_amount' => 100000,
            'current_balance' => 45000,
            'frequency' => 'weekly',
            'start_date' => now()->subDays(45),
            'end_date' => now()->addDays(75),
            'description' => 'Saving for iPhone 15 Pro',
            'auto_debit' => false,
            'status' => 'active',
        ]);

        SavingsPlan::create([
            'user_id' => $user->id,
            'name' => 'Vacation Fund',
            'target_amount' => 200000,
            'current_balance' => 200000,
            'frequency' => 'monthly',
            'start_date' => now()->subMonths(6),
            'end_date' => now()->subDays(10),
            'description' => 'Dubai vacation trip',
            'auto_debit' => true,
            'status' => 'completed',
        ]);

        $this->command->info('✓ Created 3 sample savings plans for test user');
    }
}

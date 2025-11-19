<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\BankAccount;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\DailyPayment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        echo "🌱 Seeding database...\n\n";

        // Create regular test user
        echo "👤 Creating regular user...\n";
        $user = User::create([
            'name' => 'Chioma Adeyemi',
            'email' => 'user@hajo.com',
            'password' => Hash::make('password'),
        ]);

        // Create collector user
        echo "👨‍💼 Creating collector user...\n";
        $collector = User::create([
            'name' => 'Adeola Bakare',
            'email' => 'collector@hajo.com',
            'password' => Hash::make('password'),
        ]);

        // Create admin user
        echo "👑 Creating admin user...\n";
        $admin = User::create([
            'name' => 'Ngozi Okafor',
            'email' => 'admin@hajo.com',
            'password' => Hash::make('password'),
        ]);

        // Create additional users for Ajo groups
        echo "👥 Creating additional users...\n";
        $users = [];
        for ($i = 1; $i <= 10; $i++) {
            $users[] = User::create([
                'name' => "User {$i}",
                'email' => "user{$i}@hajo.com",
                'password' => Hash::make('password'),
            ]);
        }

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
        echo "💰 Creating contributions...\n";
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

        // Create Ajo Groups for collector
        echo "🏦 Creating Ajo groups...\n";
        $group1 = AjoGroup::create([
            'creator_id' => $collector->id,
            'name' => 'Office Squad Savings',
            'group_code' => 'AJO-' . strtoupper(Str::random(6)),
            'description' => 'Monthly office savings group',
            'contribution_amount' => 1000,
            'group_size' => 8,
            'rotation_type' => 'sequential',
            'selection_method' => 'admin',
            'status' => 'active',
            'start_date' => now()->subDays(15),
        ]);

        $group2 = AjoGroup::create([
            'creator_id' => $collector->id,
            'name' => 'Market Women Ajo',
            'group_code' => 'AJO-' . strtoupper(Str::random(6)),
            'description' => 'Daily market savings',
            'contribution_amount' => 500,
            'group_size' => 12,
            'rotation_type' => 'sequential',
            'selection_method' => 'admin',
            'status' => 'active',
            'start_date' => now()->subDays(20),
        ]);

        $group3 = AjoGroup::create([
            'creator_id' => $collector->id,
            'name' => 'Family Circle',
            'group_code' => 'AJO-' . strtoupper(Str::random(6)),
            'description' => 'Family savings group',
            'contribution_amount' => 2000,
            'group_size' => 5,
            'rotation_type' => 'sequential',
            'selection_method' => 'admin',
            'status' => 'active',
            'start_date' => now()->subDays(10),
        ]);

        // Add collector as admin member to all groups
        echo "👥 Adding group members...\n";
        AjoMember::create([
            'ajo_group_id' => $group1->id,
            'user_id' => $collector->id,
            'is_admin' => true,
            'status' => 'active',
            'joined_at' => $group1->start_date,
        ]);

        AjoMember::create([
            'ajo_group_id' => $group2->id,
            'user_id' => $collector->id,
            'is_admin' => true,
            'status' => 'active',
            'joined_at' => $group2->start_date,
        ]);

        AjoMember::create([
            'ajo_group_id' => $group3->id,
            'user_id' => $collector->id,
            'is_admin' => true,
            'status' => 'active',
            'joined_at' => $group3->start_date,
        ]);

        // Add regular user to groups
        AjoMember::create([
            'ajo_group_id' => $group1->id,
            'user_id' => $user->id,
            'is_admin' => false,
            'status' => 'active',
            'joined_at' => $group1->start_date,
        ]);

        // Add other users to groups
        foreach (array_slice($users, 0, 6) as $index => $member) {
            AjoMember::create([
                'ajo_group_id' => $group1->id,
                'user_id' => $member->id,
                'is_admin' => false,
                'status' => 'active',
                'joined_at' => $group1->start_date,
            ]);
        }

        foreach (array_slice($users, 0, 10) as $index => $member) {
            AjoMember::create([
                'ajo_group_id' => $group2->id,
                'user_id' => $member->id,
                'is_admin' => false,
                'status' => 'active',
                'joined_at' => $group2->start_date,
            ]);
        }

        foreach (array_slice($users, 0, 4) as $index => $member) {
            AjoMember::create([
                'ajo_group_id' => $group3->id,
                'user_id' => $member->id,
                'is_admin' => false,
                'status' => 'active',
                'joined_at' => $group3->start_date,
            ]);
        }

        // Create daily payment records for groups
        echo "📅 Creating daily payment records...\n";
        $allMembers1 = $group1->ajoMembers;
        $allMembers2 = $group2->ajoMembers;
        $allMembers3 = $group3->ajoMembers;

        // Create payments for the last 15 days for group 1
        for ($day = 15; $day >= 0; $day--) {
            foreach ($allMembers1 as $member) {
                // 80% chance of payment
                if (rand(1, 100) <= 80) {
                    DailyPayment::create([
                        'ajo_group_id' => $group1->id,
                        'user_id' => $member->user_id,
                        'amount' => $group1->contribution_amount,
                        'payment_date' => now()->subDays($day)->format('Y-m-d'),
                        'status' => 'paid',
                        'payment_method' => 'cash',
                        'recorded_by' => $collector->id,
                        'paid_at' => now()->subDays($day),
                    ]);
                }
            }
        }

        // Create payments for the last 15 days for group 2
        for ($day = 15; $day >= 0; $day--) {
            foreach ($allMembers2 as $member) {
                // 70% chance of payment
                if (rand(1, 100) <= 70) {
                    DailyPayment::create([
                        'ajo_group_id' => $group2->id,
                        'user_id' => $member->user_id,
                        'amount' => $group2->contribution_amount,
                        'payment_date' => now()->subDays($day)->format('Y-m-d'),
                        'status' => 'paid',
                        'payment_method' => 'cash',
                        'recorded_by' => $collector->id,
                        'paid_at' => now()->subDays($day),
                    ]);
                }
            }
        }

        // Create payments for the last 10 days for group 3
        for ($day = 10; $day >= 0; $day--) {
            foreach ($allMembers3 as $member) {
                // 90% chance of payment
                if (rand(1, 100) <= 90) {
                    DailyPayment::create([
                        'ajo_group_id' => $group3->id,
                        'user_id' => $member->user_id,
                        'amount' => $group3->contribution_amount,
                        'payment_date' => now()->subDays($day)->format('Y-m-d'),
                        'status' => 'paid',
                        'payment_method' => 'cash',
                        'recorded_by' => $collector->id,
                        'paid_at' => now()->subDays($day),
                    ]);
                }
            }
        }

        echo "\n✅ Database seeded successfully!\n\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "           LOGIN CREDENTIALS            \n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        echo "👤 REGULAR USER:\n";
        echo "   Email: user@hajo.com\n";
        echo "   Password: password\n\n";
        echo "👨‍💼 COLLECTOR USER:\n";
        echo "   Email: collector@hajo.com\n";
        echo "   Password: password\n";
        echo "   (Manages 3 Ajo groups)\n\n";
        echo "👑 ADMIN USER:\n";
        echo "   Email: admin@hajo.com\n";
        echo "   Password: password\n";
        echo "   (Access to admin dashboard)\n\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        echo "📊 DATA CREATED:\n";
        echo "   - " . User::count() . " users\n";
        echo "   - " . AjoGroup::count() . " Ajo groups\n";
        echo "   - " . AjoMember::count() . " group memberships\n";
        echo "   - " . SavingsPlan::count() . " savings plans\n";
        echo "   - " . DailyPayment::count() . " daily payment records\n\n";
    }
}

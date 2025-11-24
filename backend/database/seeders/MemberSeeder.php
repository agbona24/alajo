<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SavingsPlan;
use App\Models\Contribution;
use App\Models\Transaction;
use App\Models\PassbookRecord;
use App\Models\Earning;
use App\Models\BankAccount;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Member 1 - Chioma Adeyemi
        $member1 = User::updateOrCreate(
            ['email' => 'chioma@example.com'],
            [
                'name' => 'Chioma Adeyemi',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'phone' => '08091234567',
                'email_verified_at' => now(),
            ]
        );

        // Create Member 2 - Emeka Okafor
        $member2 = User::updateOrCreate(
            ['email' => 'emeka@example.com'],
            [
                'name' => 'Emeka Okafor',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'phone' => '08098765432',
                'email_verified_at' => now(),
            ]
        );

        // Create bank accounts for members
        BankAccount::updateOrCreate(
            ['user_id' => $member1->id, 'account_number' => '0123456789'],
            [
                'bank_name' => 'GTBank',
                'account_name' => 'Chioma Adeyemi',
                'bank_code' => '058',
                'is_primary' => true,
            ]
        );

        BankAccount::updateOrCreate(
            ['user_id' => $member2->id, 'account_number' => '9876543210'],
            [
                'bank_name' => 'Access Bank',
                'account_name' => 'Emeka Okafor',
                'bank_code' => '044',
                'is_primary' => true,
            ]
        );

        // Create savings plans for Member 1
        $plan1 = $this->createSavingsPlanWithContributions($member1, [
            'name' => 'iPhone 15 Fund',
            'emoji' => '📱',
            'target_amount' => 500000,
            'frequency' => 'daily',
            'duration' => 30,
            'description' => 'Saving for my new iPhone 15 Pro Max',
        ], 15); // 15 days of contributions

        $plan2 = $this->createSavingsPlanWithContributions($member1, [
            'name' => 'House Rent',
            'emoji' => '🏠',
            'target_amount' => 300000,
            'frequency' => 'daily',
            'duration' => 30,
            'description' => 'Saving for next year house rent',
        ], 10); // 10 days of contributions

        // Create savings plans for Member 2
        $plan3 = $this->createSavingsPlanWithContributions($member2, [
            'name' => 'Wedding Fund',
            'emoji' => '💍',
            'target_amount' => 1000000,
            'frequency' => 'daily',
            'duration' => 60,
            'description' => 'Saving for my wedding next year',
        ], 20); // 20 days of contributions

        $plan4 = $this->createSavingsPlanWithContributions($member2, [
            'name' => 'New Laptop',
            'emoji' => '💻',
            'target_amount' => 400000,
            'frequency' => 'daily',
            'duration' => 30,
            'description' => 'MacBook Pro for work',
        ], 8); // 8 days of contributions

        $this->command->info('');
        $this->command->info('===========================================');
        $this->command->info('Member seeding completed!');
        $this->command->info('===========================================');
        $this->command->info('');
        $this->command->info('Member Login Credentials:');
        $this->command->info('-------------------------------------------');
        $this->command->info('Member 1: chioma@example.com / password123');
        $this->command->info('Member 2: emeka@example.com / password123');
        $this->command->info('-------------------------------------------');
        $this->command->info('');
    }

    /**
     * Create a savings plan with contributions
     */
    private function createSavingsPlanWithContributions(User $user, array $planData, int $daysOfContributions): SavingsPlan
    {
        $startDate = Carbon::now()->subDays($daysOfContributions);

        // Calculate daily contribution - Ajo policy: 31 days = 1 month
        $totalDays = $planData['duration'] * 31;
        $dailyAmount = max(ceil($planData['target_amount'] / $totalDays), SavingsPlan::MINIMUM_DAILY_CONTRIBUTION);

        // Current amount will be calculated based on contributions
        $currentAmount = 0;
        $companyFeeCollected = false;

        // Create the plan first
        $plan = SavingsPlan::updateOrCreate(
            ['user_id' => $user->id, 'name' => $planData['name']],
            [
                'emoji' => $planData['emoji'],
                'target_amount' => $planData['target_amount'],
                'current_amount' => 0, // Will update after contributions
                'daily_amount' => $dailyAmount, // Store the calculated daily amount
                'frequency' => $planData['frequency'],
                'duration' => $planData['duration'],
                'plan_type' => 'personal',
                'description' => $planData['description'],
                'status' => 'active',
                'start_date' => $startDate,
                'target_date' => $startDate->copy()->addDays($totalDays), // Use totalDays (duration * 31)
                'company_fee_collected' => false,
            ]
        );

        // Clear existing contributions and records for this plan
        $plan->contributions()->delete();
        $plan->passbookRecords()->delete();
        $plan->transactions()->delete();
        Earning::where('savings_plan_id', $plan->id)->delete();

        // Create contributions for each day
        for ($day = 0; $day < $daysOfContributions; $day++) {
            $contributionDate = $startDate->copy()->addDays($day);
            $amount = $dailyAmount;

            // First day's contribution goes to company
            $memberAmount = $amount;
            if (!$companyFeeCollected) {
                $companyFeeCollected = true;

                // Create earning record for company
                Earning::create([
                    'user_id' => $user->id,
                    'savings_plan_id' => $plan->id,
                    'amount' => $dailyAmount,
                    'type' => Earning::TYPE_COMPANY_FEE,
                    'status' => Earning::STATUS_PENDING,
                    'reference' => Earning::generateReference(),
                    'description' => "Company fee from {$plan->name} - First day contribution",
                    'earning_date' => $contributionDate->toDateString(),
                ]);

                $memberAmount = 0; // First day doesn't count towards member savings
            } else {
                $currentAmount += $memberAmount;
            }

            $reference = 'TRX-' . $contributionDate->format('Ymd') . '-' . rand(1000, 9999);

            // Create contribution
            $contribution = Contribution::create([
                'user_id' => $user->id,
                'savings_plan_id' => $plan->id,
                'amount' => $amount,
                'payment_method' => ['card', 'bank_transfer', 'cash'][array_rand(['card', 'bank_transfer', 'cash'])],
                'reference' => $reference,
                'status' => 'completed',
                'completed_at' => $contributionDate,
            ]);

            // Create passbook record
            PassbookRecord::create([
                'user_id' => $user->id,
                'savings_plan_id' => $plan->id,
                'contribution_id' => $contribution->id,
                'month' => $contributionDate->month,
                'year' => $contributionDate->year,
                'day_of_month' => $contributionDate->day,
                'contribution_date' => $contributionDate,
                'amount' => $amount,
                'status' => 'paid',
            ]);

            // Create transaction record
            Transaction::create([
                'user_id' => $user->id,
                'savings_plan_id' => $plan->id,
                'reference' => $reference,
                'type' => 'contribution',
                'amount' => $amount,
                'balance_before' => $currentAmount - $memberAmount,
                'balance_after' => $currentAmount,
                'payment_method' => $contribution->payment_method,
                'status' => 'completed',
                'description' => "Contribution to {$plan->name}",
                'completed_at' => $contributionDate,
            ]);
        }

        // Update plan with final amounts
        $plan->update([
            'current_amount' => $currentAmount,
            'company_fee_collected' => true,
            'first_contribution_date' => $startDate,
        ]);

        $this->command->info("Created plan: {$plan->name} for {$user->name} with {$daysOfContributions} days of contributions");

        return $plan;
    }
}

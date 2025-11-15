<?php

namespace Database\Factories;

use App\Models\AjoContribution;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AjoContribution>
 */
class AjoContributionFactory extends Factory
{
    protected $model = AjoContribution::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 1000, 50000);
        $isLate = fake()->boolean(20);
        $lateFee = $isLate ? $amount * 0.05 : 0;

        return [
            'ajo_group_id' => AjoGroup::factory(),
            'ajo_member_id' => AjoMember::factory(),
            'user_id' => User::factory(),
            'cycle_number' => fake()->numberBetween(1, 12),
            'amount' => $amount,
            'status' => 'pending',
            'due_date' => fake()->dateTimeBetween('now', '+1 month'),
            'paid_date' => null,
            'payment_method' => null,
            'transaction_id' => null,
            'is_late' => false,
            'late_fee' => 0.00,
        ];
    }

    /**
     * Indicate that the contribution has been paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_date' => now(),
            'payment_method' => fake()->randomElement(['wallet', 'card', 'bank_transfer']),
            'transaction_id' => Transaction::factory(),
        ]);
    }

    /**
     * Indicate that the contribution is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'is_late' => true,
            'late_fee' => $attributes['amount'] * 0.05,
            'due_date' => fake()->dateTimeBetween('-2 weeks', '-1 day'),
        ]);
    }

    /**
     * Indicate that the contribution was missed.
     */
    public function missed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'missed',
            'due_date' => fake()->dateTimeBetween('-1 month', '-1 week'),
        ]);
    }
}

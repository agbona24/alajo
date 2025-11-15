<?php

namespace Database\Factories;

use App\Models\AjoPayout;
use App\Models\AjoGroup;
use App\Models\AjoMember;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AjoPayout>
 */
class AjoPayoutFactory extends Factory
{
    protected $model = AjoPayout::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $payoutAmount = fake()->randomFloat(2, 50000, 500000);
        $organizerFee = $payoutAmount * 0.02; // 2% organizer fee
        $netAmount = $payoutAmount - $organizerFee;

        return [
            'ajo_group_id' => AjoGroup::factory(),
            'ajo_member_id' => AjoMember::factory(),
            'user_id' => User::factory(),
            'cycle_number' => fake()->numberBetween(1, 12),
            'payout_amount' => $payoutAmount,
            'organizer_fee' => $organizerFee,
            'net_amount' => $netAmount,
            'status' => 'pending',
            'scheduled_date' => fake()->dateTimeBetween('now', '+1 month'),
            'completed_date' => null,
            'transaction_id' => null,
            'notes' => fake()->optional()->sentence(),
            'reference' => 'PO-' . strtoupper(Str::random(10)),
        ];
    }

    /**
     * Indicate that the payout is processing.
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
        ]);
    }

    /**
     * Indicate that the payout has been completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_date' => now(),
            'transaction_id' => Transaction::factory(),
        ]);
    }

    /**
     * Indicate that the payout has failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'notes' => 'Payout failed: ' . fake()->sentence(),
        ]);
    }
}

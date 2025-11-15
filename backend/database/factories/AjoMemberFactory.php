<?php

namespace Database\Factories;

use App\Models\AjoMember;
use App\Models\AjoGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AjoMember>
 */
class AjoMemberFactory extends Factory
{
    protected $model = AjoMember::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ajo_group_id' => AjoGroup::factory(),
            'user_id' => User::factory(),
            'position' => fake()->numberBetween(1, 20),
            'status' => 'active',
            'is_admin' => false,
            'joined_at' => now(),
            'payout_date' => fake()->dateTimeBetween('now', '+6 months'),
            'has_received_payout' => false,
            'total_contributed' => 0.00,
            'current_cycle_paid' => false,
        ];
    }

    /**
     * Indicate that the member is the organizer/admin.
     */
    public function organizer(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
            'position' => 1,
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the member is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the member has been removed.
     */
    public function removed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'removed',
        ]);
    }

    /**
     * Indicate that the member has received their payout.
     */
    public function paidOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_received_payout' => true,
            'total_contributed' => fake()->randomFloat(2, 10000, 100000),
        ]);
    }
}

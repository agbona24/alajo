<?php

namespace Database\Factories;

use App\Models\AjoGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AjoGroup>
 */
class AjoGroupFactory extends Factory
{
    protected $model = AjoGroup::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $groupSize = fake()->numberBetween(5, 20);
        $currentMembers = fake()->numberBetween(0, $groupSize);
        $startDate = fake()->dateTimeBetween('now', '+1 month');

        return [
            'creator_id' => User::factory(),
            'name' => fake()->catchPhrase() . ' Savings Group',
            'code' => strtoupper(fake()->bothify('???###')),
            'description' => fake()->sentence(15),
            'contribution_amount' => fake()->randomFloat(2, 5000, 50000),
            'group_size' => $groupSize,
            'current_members' => $currentMembers,
            'rotation_type' => fake()->randomElement(['weekly', 'monthly', 'daily']),
            'selection_method' => fake()->randomElement(['sequential', 'random', 'bid']),
            'status' => 'pending',
            'start_date' => $startDate,
            'end_date' => null,
            'current_cycle' => 0,
            'auto_reminders' => fake()->boolean(70),
            'require_approval' => fake()->boolean(60),
            'settings' => [
                'allow_early_withdrawal' => fake()->boolean(30),
                'late_fee_enabled' => fake()->boolean(70),
                'organizer_fee_percentage' => 2,
            ],
        ];
    }

    /**
     * Indicate that the group is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'current_cycle' => fake()->numberBetween(1, 5),
            'current_members' => $attributes['group_size'],
        ]);
    }

    /**
     * Indicate that the group is full and recruiting.
     */
    public function full(): static
    {
        return $this->state(fn (array $attributes) => [
            'current_members' => $attributes['group_size'],
        ]);
    }

    /**
     * Indicate that the group is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'end_date' => now(),
        ]);
    }

    /**
     * Indicate that the group is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}

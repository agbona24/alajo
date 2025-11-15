<?php

namespace Database\Factories;

use App\Models\AjoActivity;
use App\Models\AjoGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AjoActivity>
 */
class AjoActivityFactory extends Factory
{
    protected $model = AjoActivity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'group_created',
            'member_joined',
            'member_approved',
            'member_removed',
            'contribution_made',
            'contribution_late',
            'payout_created',
            'payout_completed',
            'cycle_started',
            'group_started',
            'group_completed',
        ];

        $action = fake()->randomElement($actions);

        return [
            'ajo_group_id' => AjoGroup::factory(),
            'user_id' => User::factory(),
            'action' => $action,
            'description' => $this->getDescriptionForAction($action),
            'metadata' => [
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
            ],
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    /**
     * Get a sample description for the given action.
     */
    private function getDescriptionForAction(string $action): string
    {
        return match ($action) {
            'group_created' => 'New savings group created',
            'member_joined' => 'New member joined the group',
            'member_approved' => 'Member approved by organizer',
            'member_removed' => 'Member removed from group',
            'contribution_made' => 'Contribution payment made',
            'contribution_late' => 'Late contribution recorded',
            'payout_created' => 'Payout scheduled',
            'payout_completed' => 'Payout completed successfully',
            'cycle_started' => 'New cycle started',
            'group_started' => 'Group started with all members',
            'group_completed' => 'Group completed all cycles',
            default => 'Activity recorded',
        };
    }

    /**
     * Create an activity for group creation.
     */
    public function groupCreated(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'group_created',
            'description' => 'New savings group created',
        ]);
    }

    /**
     * Create an activity for member joining.
     */
    public function memberJoined(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'member_joined',
            'description' => 'New member joined the group',
        ]);
    }

    /**
     * Create an activity for contribution made.
     */
    public function contributionMade(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'contribution_made',
            'description' => 'Contribution payment made',
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'amount' => fake()->randomFloat(2, 1000, 50000),
            ]),
        ]);
    }

    /**
     * Create an activity for payout completed.
     */
    public function payoutCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'payout_completed',
            'description' => 'Payout completed successfully',
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'amount' => fake()->randomFloat(2, 50000, 500000),
            ]),
        ]);
    }
}

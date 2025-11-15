<?php

namespace Tests\Unit\Ajo;

use Tests\TestCase;
use App\Models\AjoGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AjoGroupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_can_create_ajo_group(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Test Savings Group',
            'code' => 'TEST123',
            'description' => 'A test savings group',
            'contribution_amount' => 5000,
            'group_size' => 10,
            'current_members' => 1,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(AjoGroup::class, $group);
        $this->assertEquals('Test Savings Group', $group->name);
        $this->assertEquals(5000, $group->contribution_amount);
        $this->assertEquals(10, $group->group_size);
    }

    public function test_ajo_group_belongs_to_creator(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Test Group',
            'code' => 'TEST456',
            'contribution_amount' => 10000,
            'group_size' => 5,
            'rotation_type' => 'weekly',
            'selection_method' => 'sequential',
        ]);

        $this->assertInstanceOf(User::class, $group->creator);
        $this->assertEquals($user->id, $group->creator->id);
    }

    public function test_is_recruiting_returns_true_for_pending_status(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Test Group',
            'code' => 'PEND01',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
            'status' => 'pending',
        ]);

        $this->assertTrue($group->isRecruiting());
    }

    public function test_is_active_returns_true_for_active_status(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Active Group',
            'code' => 'ACTV01',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
            'status' => 'active',
        ]);

        $this->assertTrue($group->isActive());
    }

    public function test_is_full_returns_true_when_current_members_equals_group_size(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Full Group',
            'code' => 'FULL01',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'current_members' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertTrue($group->isFull());
    }

    public function test_is_full_returns_false_when_current_members_less_than_group_size(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Not Full Group',
            'code' => 'NOTFUL',
            'contribution_amount' => 5000,
            'group_size' => 10,
            'current_members' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertFalse($group->isFull());
    }

    public function test_can_start_returns_true_when_minimum_members_met(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Ready Group',
            'code' => 'READY1',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'current_members' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertTrue($group->canStart());
    }

    public function test_can_start_returns_false_when_minimum_members_not_met(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Not Ready Group',
            'code' => 'NOTRED',
            'contribution_amount' => 5000,
            'group_size' => 10,
            'current_members' => 2,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertFalse($group->canStart());
    }

    public function test_generate_join_code_creates_unique_code(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Code Test Group',
            'code' => '',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $code = $group->generateJoinCode();

        $this->assertNotEmpty($code);
        $this->assertEquals(6, strlen($code));
        $this->assertEquals(strtoupper($code), $code); // Should be uppercase
    }

    public function test_ajo_group_has_members_relationship(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Relationship Test',
            'code' => 'RELTEST',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $group->ajoMembers());
    }

    public function test_ajo_group_has_contributions_relationship(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Contributions Test',
            'code' => 'CONTR1',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $group->ajoContributions());
    }

    public function test_ajo_group_has_payouts_relationship(): void
    {
        $user = User::factory()->create();

        $group = AjoGroup::create([
            'creator_id' => $user->id,
            'name' => 'Payouts Test',
            'code' => 'PAYOUT',
            'contribution_amount' => 5000,
            'group_size' => 5,
            'rotation_type' => 'monthly',
            'selection_method' => 'sequential',
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $group->payouts());
    }
}

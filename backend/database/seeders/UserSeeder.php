<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@alajo.com',
            'password' => Hash::make('password'),
            'phone' => '08035816788',
            'address' => 'Y-DEE VENTURES, Nigeria',
            'role' => 'admin',
            'account_tier' => 'gold',
            'is_active' => true,
            'is_verified' => true,
            'agreed_to_terms' => true,
            'terms_agreed_at' => now(),
            'email_verified_at' => now(),
        ]);

        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'user@alajo.com',
            'password' => Hash::make('password'),
            'phone' => '09088435750',
            'address' => 'Lagos, Nigeria',
            'role' => 'user',
            'account_tier' => 'basic',
            'is_active' => true,
            'is_verified' => true,
            'agreed_to_terms' => true,
            'terms_agreed_at' => now(),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✓ Created admin user: admin@alajo.com / password');
        $this->command->info('✓ Created test user: user@alajo.com / password');
    }
}

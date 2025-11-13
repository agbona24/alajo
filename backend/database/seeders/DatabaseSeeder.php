<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SavingsPlanSeeder::class,
        ]);

        $this->command->info('');
        $this->command->info('🎉 Database seeded successfully!');
        $this->command->info('');
        $this->command->info('You can now login with:');
        $this->command->info('  Admin: admin@alajo.com / password');
        $this->command->info('  User:  user@alajo.com / password');
        $this->command->info('');
        $this->command->info('The test user has 3 sample savings plans.');
        $this->command->info('');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed admin, collectors, and platform bank account
        $this->call(AdminCollectorSeeder::class);

        // Seed default settings
        $this->call(SettingsSeeder::class);

        // Seed test members with savings plans
        $this->call(MemberSeeder::class);

        echo "\n";
        echo "✅ Database seeded successfully!\n";
        echo "\n";
        echo "===========================================\n";
        echo "LOGIN CREDENTIALS (Phone + Password)\n";
        echo "===========================================\n";
        echo "\n";
        echo "📧 Admin: 08012345678 / password123\n";
        echo "👷 Collector 1: 08023456789 / password123\n";
        echo "👷 Collector 2: 08034567890 / password123\n";
        echo "👷 Collector 3: 08045678901 / password123\n";
        echo "\n";
        echo "👤 Member 1 (Chioma): 08091234567 / password123\n";
        echo "👤 Member 2 (Emeka): 08098765432 / password123\n";
        echo "\n";
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            // For MySQL, we need to use raw SQL to modify ENUM
            DB::statement("ALTER TABLE earnings MODIFY COLUMN status ENUM('pending', 'processed', 'paid_out', 'cancelled') NOT NULL DEFAULT 'pending'");
        } else {
            // For SQLite, the status column is already a string, so just ensure the model validates the values
            // SQLite doesn't have ENUM, so this migration is a no-op for SQLite
            // The Earning model will handle validation
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            // Remove 'cancelled' from ENUM values
            DB::statement("ALTER TABLE earnings MODIFY COLUMN status ENUM('pending', 'processed', 'paid_out') NOT NULL DEFAULT 'pending'");
        }
        // For SQLite, no action needed
    }
};

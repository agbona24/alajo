<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For MySQL, we need to use raw SQL to modify ENUM
        DB::statement("ALTER TABLE earnings MODIFY COLUMN status ENUM('pending', 'processed', 'paid_out', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'cancelled' from ENUM values
        DB::statement("ALTER TABLE earnings MODIFY COLUMN status ENUM('pending', 'processed', 'paid_out') NOT NULL DEFAULT 'pending'");
    }
};

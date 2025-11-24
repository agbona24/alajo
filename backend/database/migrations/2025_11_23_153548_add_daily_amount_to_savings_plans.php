<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('savings_plans', function (Blueprint $table) {
            // Only add daily_amount - other columns added by earnings migration
            $table->decimal('daily_amount', 15, 2)->nullable()->after('current_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('savings_plans', function (Blueprint $table) {
            $table->dropColumn('daily_amount');
        });
    }
};

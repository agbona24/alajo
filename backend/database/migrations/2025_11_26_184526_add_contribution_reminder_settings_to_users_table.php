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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('contribution_reminder_enabled')->default(false)->after('two_factor_enabled');
            $table->integer('contribution_reminder_days')->default(3)->after('contribution_reminder_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'contribution_reminder_enabled',
                'contribution_reminder_days',
            ]);
        });
    }
};

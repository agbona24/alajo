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
        Schema::create('savings_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['daily', 'weekly', 'monthly', 'goal_based']);
            $table->enum('frequency', ['daily', 'weekly', 'monthly']);
            $table->decimal('amount_per_cycle', 10, 2); // Amount to save per cycle
            $table->decimal('target_amount', 10, 2)->nullable(); // For goal-based plans
            $table->decimal('current_balance', 10, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('auto_debit')->default(false);
            $table->enum('status', ['active', 'paused', 'completed', 'cancelled'])->default('active');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_plans');
    }
};

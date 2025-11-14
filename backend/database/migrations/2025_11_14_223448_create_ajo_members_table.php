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
        Schema::create('ajo_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajo_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('position')->nullable(); // position in rotation
            $table->enum('status', ['pending', 'active', 'inactive', 'removed'])->default('pending');
            $table->boolean('is_admin')->default(false);
            $table->date('joined_at')->nullable();
            $table->date('payout_date')->nullable(); // when they receive payout
            $table->boolean('has_received_payout')->default(false);
            $table->decimal('total_contributed', 15, 2)->default(0);
            $table->boolean('current_cycle_paid')->default(false);
            $table->timestamps();

            // Unique constraint - user can only join group once
            $table->unique(['ajo_group_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajo_members');
    }
};

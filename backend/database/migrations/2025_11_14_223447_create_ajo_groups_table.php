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
        Schema::create('ajo_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('contribution_amount', 15, 2);
            $table->integer('group_size');
            $table->integer('current_members')->default(0);
            $table->enum('rotation_type', ['daily', 'weekly', 'monthly'])->default('monthly');
            $table->enum('selection_method', ['sequential', 'random', 'bid'])->default('sequential');
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('current_cycle')->default(0);
            $table->boolean('auto_reminders')->default(true);
            $table->boolean('require_approval')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajo_groups');
    }
};

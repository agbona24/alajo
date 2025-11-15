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
        Schema::create('daily_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajo_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('payment_date');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'paid', 'missed', 'late'])->default('pending');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'card', 'wallet'])->nullable();
            $table->string('reference')->nullable(); // Transaction reference if paid electronically
            $table->foreignId('recorded_by')->nullable()->constrained('users')->onDelete('set null'); // Collector who recorded the payment
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // Indexes for better query performance
            $table->index(['ajo_group_id', 'payment_date']);
            $table->index(['user_id', 'payment_date']);

            // Unique constraint - one payment record per user per day per group
            $table->unique(['ajo_group_id', 'user_id', 'payment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_payments');
    }
};

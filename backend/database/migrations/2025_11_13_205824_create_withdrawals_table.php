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
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique(); // e.g., WD001, WTH-1234567890
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('savings_plan_id')->constrained()->onDelete('cascade');
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('amount', 10, 2); // Requested amount
            $table->decimal('fee', 10, 2)->default(0); // Withdrawal fee
            $table->decimal('net_amount', 10, 2); // Amount user receives
            $table->enum('type', ['instant', 'scheduled'])->default('instant');
            $table->enum('status', ['pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'])->default('pending');

            // Bank details
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_name');

            $table->text('reason')->nullable(); // User's reason for withdrawal
            $table->text('rejection_reason')->nullable(); // Admin's reason if rejected
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('reference');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
    }
};

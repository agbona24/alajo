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
        Schema::create('pending_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('ajo_group_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('platform_bank_account_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->string('reference')->unique(); // Unique transfer reference
            $table->enum('status', ['pending', 'awaiting_approval', 'approved', 'rejected', 'expired'])->default('pending');
            $table->text('transfer_proof')->nullable(); // Image/screenshot of transfer
            $table->text('sender_account_details')->nullable(); // JSON: bank, account number, name
            $table->timestamp('transfer_claimed_at')->nullable(); // When user clicked "I have sent"
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('rejected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->date('payment_date')->nullable(); // For which date this payment is for
            $table->timestamps();

            $table->index('status');
            $table->index('reference');
            $table->index(['user_id', 'status']);
            $table->index(['ajo_group_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_transfers');
    }
};

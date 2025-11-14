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
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('savings_plan_id')->constrained()->onDelete('cascade');
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('serial_number'); // Day number (1-31 for daily)
            $table->date('contribution_date'); // Actual date of contribution
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'missed', 'skipped'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->text('notes')->nullable();
            $table->string('collector_signature')->nullable(); // For manual/POS collections
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['savings_plan_id', 'contribution_date']);
            $table->index(['user_id', 'status']);
            $table->unique(['savings_plan_id', 'serial_number', 'contribution_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contributions');
    }
};

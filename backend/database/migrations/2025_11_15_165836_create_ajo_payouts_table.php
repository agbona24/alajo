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
        Schema::create('ajo_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajo_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('ajo_member_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('cycle_number');
            $table->decimal('payout_amount', 15, 2); // Total pot
            $table->decimal('organizer_fee', 10, 2)->default(0);
            $table->decimal('net_amount', 15, 2); // Amount after fees
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->date('scheduled_date');
            $table->timestamp('completed_date')->nullable();
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->text('notes')->nullable();
            $table->string('reference')->unique()->nullable();
            $table->timestamps();

            // Unique constraint - one payout per cycle
            $table->unique(['ajo_group_id', 'cycle_number'], 'ajo_payout_cycle_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajo_payouts');
    }
};

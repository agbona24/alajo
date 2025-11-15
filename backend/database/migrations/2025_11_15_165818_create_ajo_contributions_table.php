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
        Schema::create('ajo_contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajo_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('ajo_member_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('cycle_number');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'paid', 'missed', 'late'])->default('pending');
            $table->date('due_date');
            $table->timestamp('paid_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_late')->default(false);
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->timestamps();

            // Unique constraint - one contribution per member per cycle
            $table->unique(['ajo_group_id', 'ajo_member_id', 'cycle_number'], 'ajo_contrib_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajo_contributions');
    }
};

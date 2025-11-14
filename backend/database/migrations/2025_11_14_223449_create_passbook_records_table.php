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
        Schema::create('passbook_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('savings_plan_id')->constrained()->onDelete('cascade');
            $table->integer('month'); // 1-12
            $table->integer('year');
            $table->integer('day_of_month'); // 1-31
            $table->date('contribution_date');
            $table->decimal('amount', 15, 2);
            $table->foreignId('contribution_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['pending', 'paid', 'missed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Unique constraint - one record per day per plan
            $table->unique(['savings_plan_id', 'contribution_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passbook_records');
    }
};

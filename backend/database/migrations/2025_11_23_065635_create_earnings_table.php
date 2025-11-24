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
        Schema::create('earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The member who made the contribution
            $table->foreignId('savings_plan_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('contribution_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('collector_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->enum('type', ['company_fee', 'collector_commission', 'platform_fee']);
            $table->enum('status', ['pending', 'processed', 'paid_out'])->default('pending');
            $table->string('reference')->unique();
            $table->text('description')->nullable();
            $table->date('earning_date');
            $table->timestamp('paid_out_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index(['earning_date']);
            $table->index(['collector_id', 'status']);
        });

        // Add first_payment_date to savings_plans to track when first contribution was made
        Schema::table('savings_plans', function (Blueprint $table) {
            $table->date('first_contribution_date')->nullable()->after('start_date');
            $table->boolean('company_fee_collected')->default(false)->after('first_contribution_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('savings_plans', function (Blueprint $table) {
            $table->dropColumn(['first_contribution_date', 'company_fee_collected']);
        });

        Schema::dropIfExists('earnings');
    }
};

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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->date('date_of_birth')->nullable()->after('address');
            $table->enum('role', ['user', 'admin'])->default('user')->after('password');
            $table->enum('account_tier', ['basic', 'silver', 'gold'])->default('basic')->after('role');
            $table->boolean('is_active')->default(true)->after('account_tier');
            $table->boolean('is_verified')->default(false)->after('is_active');
            $table->boolean('agreed_to_terms')->default(false)->after('is_verified');
            $table->timestamp('terms_agreed_at')->nullable()->after('agreed_to_terms');
            $table->timestamp('last_login_at')->nullable()->after('terms_agreed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'address',
                'date_of_birth',
                'role',
                'account_tier',
                'is_active',
                'is_verified',
                'agreed_to_terms',
                'terms_agreed_at',
                'last_login_at',
            ]);
        });
    }
};

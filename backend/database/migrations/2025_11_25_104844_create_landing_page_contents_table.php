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
        Schema::create('landing_page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section')->index(); // e.g., 'hero', 'features', 'testimonials'
            $table->string('key')->index(); // e.g., 'hero_title', 'feature_1_title'
            $table->text('value')->nullable(); // The actual content
            $table->string('type')->default('text'); // text, image, json
            $table->integer('order')->default(0); // For ordering items
            $table->boolean('is_active')->default(true);
            $table->json('meta')->nullable(); // For additional metadata
            $table->timestamps();

            $table->unique(['section', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_page_contents');
    }
};

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
        Schema::create('collection_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('somiti_id')->constrained()->onDelete('cascade');
            $table->date('collection_date');
            $table->decimal('amount', 10, 2);
            $table->integer('active_members');
            $table->decimal('total_expected', 10, 2);
            $table->timestamp('processed_at');
            $table->timestamps();

            // Make sure we don't process the same date twice
            $table->unique(['somiti_id', 'collection_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_logs');
    }
};

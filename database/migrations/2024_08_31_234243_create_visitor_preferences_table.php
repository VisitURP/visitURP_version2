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
        Schema::create('visitor_preferences', function (Blueprint $table) {
            $table->id('id_visitorPreference');
            $table->unsignedBigInteger('fk_id_visitor');
            $table->unsignedBigInteger('fk_id_academicInterested');
            $table->enum('visitor_type', ['V', 'P']);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_preferences');
    }
};

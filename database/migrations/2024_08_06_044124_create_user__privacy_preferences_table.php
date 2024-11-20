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
        Schema::create('user_privacy_preferences', function (Blueprint $table) {
            $table->id('id_privacy_preferences');
            $table->unsignedBigInteger('fk_id_visitorV');
            $table->unsignedBigInteger('fk_id_visitV');
            $table->boolean('user_personal_data')->nullable();
            $table->string('receive_communications')->nullable();
            $table->boolean('user_cooking_tracking')->nullable();
            $table->timestamp('consent_date')->nullable();
            $table->boolean('withdraw_consent')->default(false);
            $table->timestamp('withdraw_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreign('fk_id_visitorV')->references('id_visitorV')->on('visitor_v_s');
            $table->foreign('fk_id_visitV')->references('id_visitV')->on('visit_v_s');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user__privacy_preferences');
    }
};

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
        Schema::create('chatbot_inquiries', function (Blueprint $table) {
            $table->id('id_inquiry');
            $table->unsignedBigInteger('fk_visitorV_id');
            $table->string('detail');
            $table->string('state');
            $table->timestamps();
            $table->softDeletes();

            // Claves foráneas
            $table->foreign('fk_visitorV_id')->references('id_visitorV')->on('visitor_v_s');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_q_a_s');
    }
};

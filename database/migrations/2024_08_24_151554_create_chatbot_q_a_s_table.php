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
        Schema::create('chatbot_q_a_s', function (Blueprint $table) {
            $table->id('id_QA');
            $table->unsignedBigInteger('fk_category_id');
            $table->string('question');
            $table->string('answer');
            $table->timestamps();
            $table->softDeletes();

            // Claves foráneas
            $table->foreign('fk_category_id')->references('id_category')->on('chatbot_categories');
        
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

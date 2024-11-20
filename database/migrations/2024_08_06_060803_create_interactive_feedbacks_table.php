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
        Schema::create('interactive_feedbacks', function (Blueprint $table) {
            $table->id('id_interactiveFeedbacks');
            $table->unsignedBigInteger('fk_id_visitorV');
            $table->unsignedBigInteger('rating');
            $table->string('comment');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fk_id_visitorV')->references('id_visitorV')->on('visitor_v_s');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interactive_feedbacks');
    }
};

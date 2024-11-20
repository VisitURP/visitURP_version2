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
        Schema::create('uservisit_u_r_p_s', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('name', 500);
            $table->string('lastName', 500);
            $table->string('email', 500);
            $table->string('rol', 500);
            $table->string('username', 500);
            $table->string('password', 500);
            $table->unsignedBigInteger('fk_docType_id');
            $table->foreign('fk_docType_id')->references('id_docType')->on('doc_types');
            $table->string('docNumber', 500);
            $table->string('phone', 500);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uservisit_u_r_p_s');
    }
};

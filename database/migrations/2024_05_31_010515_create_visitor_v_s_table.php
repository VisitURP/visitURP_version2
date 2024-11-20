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
        Schema::create('visitor_v_s', function (Blueprint $table) {
            $table->id('id_visitorV');
            $table->string('name', 500);
            $table->string('email', 500);
            $table->string('lastName', 500)->nullable();
            $table->unsignedBigInteger('fk_docType_id')->nullable();
            $table->string('documentNumber', 500)->nullable();
            $table->string('phone', 500)->nullable();
            $table->string('cod_Ubigeo')->nullable();
            $table->string('educationalInstitution', 500)->nullable();
            $table->dateTime('birthDate')->nullable();
            $table->enum('gender', ['F', 'M', 'NA'])->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fk_docType_id')->references('id_docType')->on('doc_types');

            //falta forgein de Ubigeo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_v_s');
    }
};

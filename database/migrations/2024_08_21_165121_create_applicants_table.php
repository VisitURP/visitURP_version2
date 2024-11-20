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
        Schema::create('applicants', function (Blueprint $table) {
            $table->id('id_applicant'); // Identificador primario
            $table->string('applicantCod');
            $table->string('name');
            $table->string('lastName');
            $table->unsignedBigInteger('fk_docType_id')->nullable();
            $table->string('documentNumber')->unique();
            $table->string('meritOrder');
            $table->string('studentCode');
            $table->boolean('admitted');
            $table->softDeletes(); 
            $table->timestamps();

            // Claves foráneas
            $table->foreign('fk_docType_id')->references('id_docType')->on('doc_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};

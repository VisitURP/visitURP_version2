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
        Schema::create('visitor_info_x_applicants', function (Blueprint $table) {
            $table->id('id_visitorInfoxApplicant');
            $table->unsignedBigInteger('fk_id_applicant')->nullable();
            $table->string('fk_id_visitor')->nullable(); // Permite almacenar IDs simples o combinados
            $table->enum('visitor_type', ['V', 'P', 'B', 'NV'])->nullable(); // V para Virtual, P para Physical, B para Both
            $table->boolean('admitted')->default(false); 
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fk_id_applicant')->references('id_applicant')->on('applicants');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_info_x_applicants');
    }
};

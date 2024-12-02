<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visit_groups', function (Blueprint $table) {
            $table->id('id_visitgroup');
            $table->string('nameGroup');
            $table->string('guide');
            $table->dateTime('dayOfVisit');
            $table->unsignedBigInteger('quantity');
            $table->string('educationalInstitution');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('built_area_visit_group', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fk_id_visitgroup');
            $table->unsignedBigInteger('fk_id_builtArea');
            $table->timestamps();
        
            // Claves foráneas
            $table->foreign('fk_id_visitgroup')->references('id_visitgroup')->on('visit_groups')->onDelete('cascade');
            $table->foreign('fk_id_builtArea')->references('id_builtArea')->on('built_areas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visit_groups');
    }
};

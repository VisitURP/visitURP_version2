<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitP extends Model
{
    use HasFactory;

    protected $table = 'visitor_p_s';

    public $timestamps = false;

    protected $primaryKey = 'id_visitorP';
    public $incrementing = true;

    protected $fillable = [
        'name',
        'lastName',
        'email',
        'fk_docType_id',
        'docNumber',
        'phone',
        'cod_Ubigeo',
        'educationalInstitution',
        'birthDate',
        'gender',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}

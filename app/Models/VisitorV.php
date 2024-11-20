<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisitorV extends Model
{
    use SoftDeletes;
    const TYPE1 = 'F';
    const TYPE2 = 'M';
    const TYPE3 = 'NA';

    protected $table = 'visitor_v_s';
    protected $primaryKey = 'id_visitorV';
    
    protected $fillable = [
        'name', 
        'email', 
        'lastName', 
        'fk_docType_id', 
        'documentNumber', 
        'phone',
        'cod_Ubigeo',
        'educationalInstitution',
        'birthDate',
        'gender'
    ];

    public function setBirthDateAttribute($value)
    {
        // Verificamos si el valor no es nulo ni vacío
        if (!empty($value)) {
            // Si hay un valor, intentamos formatearlo
            $this->attributes['birthDate'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
        } else {
            // Si es nulo o vacío, lo dejamos como null
            $this->attributes['birthDate'] = null;
        }
    }


    public function docType()
    {
        return $this->hasMany(docType::class, 'fk_docType_id');
    }

    public function visitV()
    {
        return $this->hasMany(visitV::class, 'fk_id_visitor','id_visitorV');
    }

    public function visitorPreferences()
    {
        return $this->hasMany(VisitorPreference::class, 'fk_id_visitor');
    }

    public function ubigeo()
    {
        return $this->hasOne(Ubigeo::class, 'cod_Ubigeo', 'cod_Ubigeo');
    }
}

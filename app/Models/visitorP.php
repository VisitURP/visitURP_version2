<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class visitorP extends Model
{
    use SoftDeletes;
    const TYPE1 = 'F';
    const TYPE2 = 'M';
    const TYPE3 = 'NA';
    
    protected $table = 'visitor_p_s';
    protected $primaryKey = 'id_visitorP';
    protected $fillable = ['name', 'lastName', 'email','fk_docType_id', 'docNumber', 'phone', 'cod_Ubigeo', 
    'educationalInstitution', 'birthDate', 'gender'];

    public function setVisitDateAttribute($value)
    {
        $this->attributes['visitDate'] = Carbon::createFromFormat('d/m/y', $value)->format('Y-m-d H:i:s');
    }

    public function setBirthDateAttribute($value)
    {
        $this->attributes['birthDate'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    }

    public function docType()
    {
        return $this->hasMany(docType::class, 'fk_docType_id');
    }

    public function visitorPreferences()
    {
        return $this->hasMany(VisitorPreference::class, 'fk_id_visitor');
    }

    public function ubigeo()
    {
        return $this->hasOne(Ubigeo::class, 'cod_Ubigeo', 'cod_Ubigeo');
    }

    public function visitV()
    {
        return $this->hasMany(visitV::class, 'fk_id_visitor','id_visitorP');
    }

    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class BuiltArea extends Model
{
    use SoftDeletes;

    protected $table = 'built_areas';
    protected $primaryKey = 'id_builtArea';
    protected $fillable = ['fk_id_academicInterest', 'builtAreaName', 'builtAreaImageURL', 'builtAreaAudioURL','builtAreaCod', 'builtAreaDescription'];

    public function academicInterest()
    {
        return $this->belongsTo(AcademicInterest::class, 'fk_id_academicInterest', 'id_academicInterest');
    }

    public function visitVDetail()
    {
        return $this->hasMany(VisitVDetail::class, 'fk_id_builtArea','id_builtArea');
    }
}



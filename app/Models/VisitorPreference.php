<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class VisitorPreference extends Model
{
    use SoftDeletes;
    
    protected $table = 'visitor_preferences';
    
    const TYPE1 = 'V';
    const TYPE2 = 'P';

    protected $primaryKey = 'id_visitorPreference';

    protected $fillable = [
        'fk_id_visitor', 
        'fk_id_academicInterested', 
        'visitor_type',
    ];

    public function academicInterest()
    {
        return $this->belongsTo(AcademicInterest::class, 'fk_id_academicInterested', 'id_academicInterest');
    }

    public function visitor()
    {
        if ($this->visitor_type == 'V') {
            return $this->belongsTo(VisitorV::class, 'fk_id_visitor');
        } elseif ($this->visitor_type == 'P') {
            return $this->belongsTo(visitorP::class, 'fk_id_visitor');
        }
    }
}

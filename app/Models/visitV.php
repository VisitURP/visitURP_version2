<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class visitV extends Model
{
    use SoftDeletes;
    protected $table = 'visit_v_s';

    const TYPE1 = 'V';
    const TYPE2 = 'P';
    
    protected $primaryKey = 'id_visitV';
    protected $fillable = ['fk_id_visitor','visitor_type', 'fk_id_semester'];

    public function visitVDetail()
    {
        return $this->hasMany(VisitVDetail::class, 'fk_id_visitV', 'id_visitV');
    }
    public function semester()
    {
        return $this->belongsTo(Semester::class, 'fk_id_semester');
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

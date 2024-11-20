<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class VisitVDetail extends Model
{
    use SoftDeletes;
    
    protected $table = 'visit_v_details';

    protected $primaryKey = 'id_visitVDetail';

    protected $fillable = ['fk_id_visitorV','fk_id_visitV','fk_id_builtArea','kindOfEvent','get','DateTime'];


    public function visitV()
    {
        return $this->belongsTo(VisitV::class, 'fk_id_visitV');
    }

    public function visitorV()
    {
        return $this->belongsTo(VisitorV::class, 'fk_id_visitorV');
    }

    public function builtArea()
    {
        return $this->belongsTo(BuiltArea::class, 'fk_id_builtArea');
    }
    
    public static function findComposite($id_visitor, $id_visit)
    {
        return self::where('id_visitorV', $id_visitor)->where('id_visitV', $id_visit)->first();
    }
}

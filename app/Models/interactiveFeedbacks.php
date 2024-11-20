<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class interactiveFeedbacks extends Model
{
    use SoftDeletes;
    protected $table = 'interactive_feedbacks';
    protected $primaryKey = 'id_interactiveFeedbacks';
    protected $fillable = ['fk_id_visitorV','rating','comment'];


    public function visitorV()
    {
        return $this->belongsTo(VisitorV::class, 'fk_id_visitorV');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class VisitorInfoXApplicant extends Model
{
    use SoftDeletes;

    protected $table = 'visitor_info_x_applicants'; 
    const TYPE1 = 'V';
    const TYPE2 = 'P';
    const TYPE3 = 'B';
    const TYPE4 = 'NV';

    protected $primaryKey = 'id_visitorInfoxApplicant';
    // Specify the fillable attributes
    protected $fillable = [
        'fk_id_applicant', 
        'fk_id_visitor', 
        'visitor_type', 
        'admitted',
    ];

    public function applicant()
    {
        return $this->belongsTo(applicant::class, 'fk_id_applicant');
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

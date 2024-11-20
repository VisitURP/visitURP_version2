<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    use SoftDeletes;
    protected $table = 'applicants'; 
    protected $primaryKey = 'id_applicant';
    // Specify the fillable attributes
    protected $fillable = [
        'applicantCod', 
        'name', 
        'lastName', 
        'fk_docType_id',
        'documentNumber', 
        'meritOrder', 
        'studentCode', 
        'admitted', 
    ];

    public function docType()
    {
        return $this->belongsTo(docType::class, 'fk_docType_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class examplE extends Model
{
    protected $connection = 'urp_db'; 
    protected $table = 'applicant'; 
    protected $primaryKey = 'id_applicant';
    // Specify the fillable attributes
    protected $fillable = [
        'applicantCod', 
        'name', 
        'lastName', 
        'documentNumber', 
        'meritOrder', 
        'studentCode', 
        'admitted', 
    ];

    // Disable timestamps
    public $timestamps = false;
}

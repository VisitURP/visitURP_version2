<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use SoftDeletes;

    protected $table = 'semesters';
    protected $primaryKey = 'semesterName';
    public $incrementing = false; 
    protected $keyType = 'string'; 

    protected $fillable = ['semesterName', 'semesterFrom', 'semesterTo'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Publicity extends Model
{
    use SoftDeletes;
    protected $table = 'publicities';
    protected $primaryKey = 'id';
    protected $fillable = ['title', 'url'];
}

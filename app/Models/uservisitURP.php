<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class uservisitURP extends Model
{
    use SoftDeletes;
    protected $table = 'uservisit_u_r_p_s';
    protected $primaryKey = 'id_user';
    protected $fillable = ['name', 'lastName', 'email','rol', 'username', 'password', 'fk_docType_id','docNumber','phone'];
}

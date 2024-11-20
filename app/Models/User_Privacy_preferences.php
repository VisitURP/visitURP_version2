<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class User_Privacy_preferences extends Model
{
    use SoftDeletes;
    
    protected $table = 'user_privacy_preferences';

    protected $primaryKey = 'id_privacy_preferences';

    protected $fillable = ['fk_id_visitorV', 'fk_id_visitV', 'user_personal_data', 'receive_communications', 'user_cooking_tracking','consent_date', 'withdraw_consent','withdraw_date'];

    public function visitor()
    {
        return $this->belongsTo(VisitorV::class, 'fk_id_visitorV');
    }

    public function visit()
    {
        return $this->belongsTo(VisitV::class, 'fk_id_visitV');
    }

}

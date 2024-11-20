<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class ChatbotInquiry extends Model
{
    use SoftDeletes;
    protected $table = 'chatbot_inquiries'; // Specify the table name
    protected $primaryKey = 'id_inquiry';
    // Specify the fillable attributes
    protected $fillable = [ 
        'fk_visitorV_id',
        'detail',
        'state',         
    ];

    public function visitorV()
    {
        return $this->belongsTo(visitorV::class, 'fk_visitorV_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class chatbotQA extends Model
{
    use SoftDeletes;
    
    protected $table = 'chatbot_q_a_s'; 
    protected $primaryKey = 'id_QA';
    // Specify the fillable attributes
    protected $fillable = [ 
        'fk_category_id',
        'question',
        'answer', 
    ];

    public function category()
    {
        return $this->belongsTo(ChatbotCategorie::class, 'fk_category_id');
    }
}

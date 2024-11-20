<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class ChatbotCategorie extends Model
{
     use SoftDeletes;
    protected $table = 'chatbot_categories';
    protected $primaryKey = 'id_category';
    protected $fillable = ['categoryName', 'categoryCode'];
}

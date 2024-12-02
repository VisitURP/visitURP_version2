<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisitGroup extends Model
{
    use SoftDeletes;

    protected $table = 'visit_groups';

    protected $primaryKey = 'id_visitgroup';

    // Definir los atributos que pueden ser asignados masivamente
    protected $fillable = [
        'nameGroup',
        'guide',
        'dayOfVisit',
        'quantity',
        'educationalInstitution',
    ];

    public function setdayOfVisitAttribute($value)
    {
        if (!empty($value)) {
            // Verificar que el valor no esté vacío y convertir al formato Y-m-d
            $this->attributes['dayOfVisit'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
        }
    }

    public function builtAreas()
    {
        return $this->belongsToMany(
            BuiltArea::class,         // Modelo relacionado
            'built_area_visit_group',  // Nombre de la tabla intermedia
            'fk_id_visitgroup',          // Llave foránea del modelo actual en la tabla intermedia
            'fk_id_builtArea'            // Llave foránea del modelo relacionado en la tabla intermedia
        );
    }

    public function visitorsP()
    {
        return $this->hasMany(VisitorP::class, 'fk_id_visitGroup', 'id_visitGroup');
    }

}

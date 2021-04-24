<?php

namespace App\Models;

use App\Helpers\CalHelper;
use App\Models\User;
use App\Traits\ModelOption;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use Spatie\Activitylog\Traits\LogsActivity;

class Entity extends Model
{
    use ModelOption, LogsActivity;

    protected $guarded = [];
    protected $casts   = [
        'meta' => 'array',
    ];
    protected $table                        = 'entities';
    protected static $logName               = 'entity';
    protected static $logFillable           = ['*'];
    protected static $logOnlyDirty          = true;
    protected static $logAttributesToIgnore = ['updated_at'];
    protected static $sortOptions           = ['created_at', 'name'];
    protected static $defaultSortBy         = 'name';

    public const TYPE_NEW      = 1;
    public const TYPE_TRANSFER = 2;

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Meta
    public function getMeta(string $option)
    {
        return Arr::get($this->meta, $option);
    }

    // Booted
    public static function booted()
    {
        static::creating(function (Entity $entity) {
            if ($entity->status === null) {
                $entity->status = 0;
            }
        });
    }

    // Concerns
    public static function isNew(): bool
    {
        return $this->type === self::TYPE_NEW ? true : false;
    }

    protected static function ensureUpdatable(): void
    {
        // if ($this->completed_at) {
        //  throw CouldNotUpdate::isCompleted($this);
        // }
    }

    // Filters
    public function scopeFilterById(Builder $query, $id): void
    {
        $query->when($id, function ($q, $id) {
            return $q->where('id', '=', $id);
        });
    }

    public function scopeFilterByUuid(Builder $query, $uuid): void
    {
        $query->when($uuid, function ($q, $uuid) {
            return $q->where('uuid', '=', $uuid);
        });
    }

    public function scopeFilterByKeyword(Builder $query, $keyword = null): void
    {
        $query->when($keyword, function ($q, $keyword) {
            return $q->where(function ($q1) use ($keyword) {
                $q1->where('name', 'like', '%' . $keyword . '%')->orWhere('description', 'like', '%' . $keyword . '%');
            });
        });
    }

    public function scopeFilterActive(Builder $query, $status = null): void
    {
        $query->when($status, function ($q, $status) {
            return $q->whereStatus(1);
        });
    }

    public function scopeFilterByIncorporationDate(Builder $query, $incorporation_date = null): void
    {
        $query->when($incorporation_date, function ($q, $incorporation_date) {
            $incorporation_date = $incorporation_date ? CalHelper::toDate($incorporation_date) : CalHelper::today();
            return $q->whereIncorporationDate($incorporation_date);
        });
    }

    public function scopeFilterByUserId(Builder $query, $user_id = null): void
    {
        $query->when($user_id, function ($q, $user_id) {
            return $q->whereUserId($user_id);
        });
    }
}

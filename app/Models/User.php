<?php

namespace App\Models;

use App\Enums\Auth\UserStatus;
use App\Events\UserLogin;
use App\Traits\HasMeta;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasMeta, HasUuid, HasApiTokens, HasRoles, Notifiable;

    protected $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'username', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'preference' => 'array'
    ];

    public function getPreference(string $option)
    {
        return Arr::get($this->preference, $option);
    }

    public function getTimezoneAttribute()
    {
        return $this->getPreference('timezone') ?? config('config.system.timezone');
    }
    
    // Constrains

    public function validateStatus($auth_event = true) : void
    {
        if (! $this->can('enable-login')) {
            $this->logout();
            throw ValidationException::withMessages(['message' => __('auth.login.login_permission_disabled')]);
        }

        if ($this->status != UserStatus::ACTIVATED) {
            $this->logout();
            throw ValidationException::withMessages(['message' => __('auth.login.status.' . $this->status)]);
        }

        if (config('config.system.maintenance_mode') && ! \Auth::user()->hasRole('admin')) {
            $this->logout();
            throw ValidationException::withMessages(['message' => config('config.system.maintenance_mode_message')]);
        }

        if ($auth_event) {
            event(new UserLogin($this));
        }
    }

    public function logout() : void
    {
        \Auth::guard('web')->logout();
    }

    // Filters

    public function scopeFilterByKeyword(Builder $query, $keyword = null) : void
    {
        $query->when($keyword, function ($q, $keyword) {
            return $q->where(function ($q1) use ($keyword) {
                $q1->where('name', 'like', '%'.$keyword.'%')->orWhere('email', 'like', '%'.$keyword.'%')->orWhere('username', 'like', '%'.$keyword.'%');
            });
        });
    }

    public function scopeFilterByEmail($q, $email = null, $s = 0)
    {
        if (! $email) {
            return $q;
        }

        return ($s) ? $q->where('email', '=', $email) : $q->where('email', 'like', '%'.$email.'%');
    }

    public function scopeFilterByUsername($q, $username = null, $s = 0)
    {
        if (! $username) {
            return $q;
        }
        
        return ($s) ? $q->where('username', '=', $username) : $q->where('username', 'like', '%'.$username.'%');
    }

    public function scopeFilterByName($q, $name = null, $s = 0)
    {
        if (! $name) {
            return $q;
        }
        
        return ($s) ? $q->where('name', '=', $name) : $q->where('name', 'like', '%'.$name.'%');
    }

    public function scopeDateBetween(Builder $query, $dates) : void
    {
        $start_date = Arr::get($dates, 'start_date');
        $end_date = Arr::get($dates, 'end_date') ? : $start_date;

        if ($start_date && $end_date && $start_date <= $end_date) {
            $query->where('created_at', '>=', $start_date)->where('created_at', '<=', $end_date);
        }
    }
}

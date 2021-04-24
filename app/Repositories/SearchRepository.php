<?php

namespace App\Repositories;

use App\Http\Resources\UserCollection;
use App\Models\Contact;
use App\Models\Meeting;
use App\Models\User;

class SearchRepository
{
    protected $user;

    /**
     * Instantiate a new instance
     * @return void
     */
    public function __construct(
        User $user
    ) {
        $this->user = $user;
    }

    /**
     * Search term
     */
    public function search() : array
    {
        if (strlen(request()->query('q')) < 3) {
            return [];
        }

        $term = request()->query('q');

        $per_page = request('per_page', config('config.system.per_page'));

        $users = new UserCollection($this->user->filterByKeyword($term)->orderBy('created_at', 'desc')->orderBy('name', 'asc')->take($per_page)->get());

        return compact('users');
    }
}

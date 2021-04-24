<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Entity;
use Illuminate\Auth\Access\HandlesAuthorization;

class EntityPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability) : bool
    {
        return $user->can('access-entity');
    }

    /**
     * Determine whether the user can view all the entity
     * @param User $user
     * @param Entity $entity
     */
    public function view(User $user) : bool
    {
        return true;
    }

    /**
     * Determine whether the user can create Entities
     * @param User $user
     */
    public function create(User $user) : bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the entity
     * @param User $user
     * @param Entity $entity
     */
    public function show(User $user, Entity $entity) : bool
    {
        return $entity->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the entity
     * @param User $user
     * @param Entity $entity
     */
    public function update(User $user, Entity $entity) : bool
    {
        return $entity->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the entity
     * @param User $user
     * @param Entity $entity
     */
    public function delete(User $user, Entity $entity) : bool
    {
        return $entity->user_id === $user->id;
    }
}

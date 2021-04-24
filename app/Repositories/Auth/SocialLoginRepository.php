<?php

namespace App\Repositories\Auth;

use App\Enums\Auth\UserStatus;
use App\Models\User;

class SocialLoginRepository
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
     * Handle social login
     *
     * @param String $provider
     * @param Object $provider_user
     */
    public function handle($provider, $provider_user) : void
    {
        $name = $provider_user->getName();
        $email = $provider_user->getEmail();

        $user = $this->user->whereEmail($email)->first();

        if (! $user) {
            $user = $this->user->forceCreate([
                'name' => $name,
                'email' => $email
            ]);

            $user->status = UserStatus::ACTIVATED;
            $user->meta = ['social_login_provider' => $provider];
            $user->save();

            $user->assignRole('user');
        }

        $user->validateStatus();

        \Auth::login($user);
    }
}

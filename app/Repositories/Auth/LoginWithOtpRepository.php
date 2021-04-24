<?php

namespace App\Repositories\Auth;

use App\Models\User;
use App\Traits\EmailOtp;
use App\Http\Resources\AuthUser;
use Illuminate\Validation\ValidationException;

class LoginWithOtpRepository
{
    use EmailOtp;

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
     * Login with otp
     *
     * @return bool|array
     */
    public function login()
    {
        if (request()->has('email') && ! request()->has('otp')) {
            return $this->generateEmailOtp();
        } else if (request()->has('email') && request()->has('otp')) {
            return $this->validateEmailOtp();
        }
    }

    /**
     * Generate email otp
     */
    private function generateEmailOtp() : bool
    {
        $user = $this->user->whereEmail(request('email'))->first();

        if ($user) {
            $user->validateStatus(false); 
            $this->sendOtp($user);
            return true;
        }

        throw ValidationException::withMessages(['email' => __('auth.password.user')]);
    }

    /**
     * Validate email otp
     */
    private function validateEmailOtp() : array
    {
        $user = $this->user->whereEmail(request('email'))->first();

        if ($user) {
            $this->validateCache($user);

            $user->validateStatus();

            if (request('device_name')) {
                $token = $user->createToken(request('device_name'))->plainTextToken;
            } else {
                \Auth::login($user);
            }
            
            return [
                'message' => __('auth.login.logged_in'),
                'user'    => new AuthUser($user),
                'token'   => $token ?? null
            ];
        }

        throw ValidationException::withMessages(['email' => __('auth.password.user')]);
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use App\Repositories\Config\ConfigRepository;

class Init
{
    protected $config;

    public function __construct(
        ConfigRepository $config
    ) {
        $this->config = $config;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $this->config->setDefault();

        return $next($request);
    }
}

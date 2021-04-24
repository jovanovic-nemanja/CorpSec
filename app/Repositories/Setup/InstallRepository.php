<?php

namespace App\Repositories\Setup;

ini_set('max_execution_time', 0);

use App\Models\User;
use App\Traits\Install;
use App\Helpers\IpHelper;
use App\Helpers\SysHelper;
use Illuminate\Support\Arr;
use App\Models\Utility\Todo;
use Illuminate\Validation\ValidationException;

class InstallRepository
{
    use Install;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct(
    ) {
    }

    /**
     * Check all pre-requisite for script
     */
    public function getPreRequisite() : array
    {
        $pre_requisite = $this->installPreRequisite();
        $app = array(
            'name' => config('app.name')
        );

        return compact('pre_requisite', 'app');
    }

    /**
     * Validate database connection, table count
     */
    public function validateDatabase() : bool
    {
        $link = @mysqli_connect(
            request('db_host'), 
            request('db_username'), 
            request('db_password'), 
            request('db_database'), 
            request('db_port')
        );

        if (! $link) {
            throw ValidationException::withMessages(['message' => trans('setup.install.could_not_establish_db_connection')]);
        }

        $count_table_query = mysqli_query($link, "show tables");
        $count_table = mysqli_num_rows($count_table_query);

        if ($count_table) {
            throw ValidationException::withMessages(['message' => trans('setup.install.table_exist_in_database')]);
        }

        return true;
    }

    /**
     * Install the script
     */
    public function install() : void
    {
        \Artisan::call('key:generate');

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

        $host = Arr::get(parse_url($_SERVER['HTTP_HOST']), 'path');
        $is_ip = IpHelper::isIp($host);
        $host = str_replace('www.', '', $host);
        $session_domain = $is_ip ? $host : ('.' . $host);
        $sanctum_stateful_domain = $is_ip ? $host : ($host. ',www.' . $host);

        SysHelper::setEnv([
            'APP_URL'     => $protocol.$host,
            'DB_PORT'     => request('db_port'),
            'DB_HOST'     => request('db_host'),
            'DB_DATABASE' => request('db_database'),
            'DB_USERNAME' => request('db_username'),
            'DB_PASSWORD' => request('db_password'),
            'SESSION_DOMAIN' => $session_domain,
            'SANCTUM_STATEFUL_DOMAINS' => $sanctum_stateful_domain,
        ]);

        config([
            'app.env' => 'local',
            'app.url' => $protocol.$host
        ]);

        \DB::purge('mysql');

        config([
            'database.connections.mysql.host' => request('db_host'),
            'database.connections.mysql.port' => request('db_port'),
            'database.connections.mysql.database' => request('db_database'),
            'database.connections.mysql.username' => request('db_username'),
            'database.connections.mysql.password' => request('db_password')
        ]);

        \DB::reconnect('mysql');

        \Artisan::call('migrate', ['--force' => true]);

        \Artisan::call('db:seed');

        \Artisan::call('storage:link');

        if (request('import_demo_users')) {
            factory(User::class, 50)->create()->each(function($user) {
                $user->assignRole('user');
            });
        }

        if (request('import_demo_todos')) {
            factory(Todo::class, 50)->create();
        }

        SysHelper::setApp(['INSTALLED' => 'installed']);
    }
}

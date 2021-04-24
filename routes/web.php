<?php

use App\Helpers\SysHelper;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

// custom test route
Route::get('/test', function () {
    return 'Laravel is working!';
});

Route::middleware('site_enabled')->group(function() {
    Route::view('/', 'site.index');
    Route::view('/about', 'site.about');
    Route::view('/faq', 'site.faq');
    Route::view('/contact', 'site.contact');
});

// ENV route
Route::get('/js/env', function () {
    $cache_name = 'env'.'.js';

    if (App::environment('local')) {
        Cache::forget($cache_name);
    }
    
    $strings = Cache::remember($cache_name, 43200, function () {
        $strings = [];

        $strings['name'] = env('APP_NAME');
        $strings['url'] = config('app.url');
        $strings['env'] = config('app.env');

        if(env('APP_MODE') === 'test') {
            $strings['test_mode'] = true;
        }
        
        $strings['gaid'] = env('GA_TRACKING_ID');
        $strings['version'] = SysHelper::getApp('VERSION');

        return $strings;
    });
    header('Content-Type: text/javascript');
    echo ('window.kmenv = ' . json_encode($strings) . ';');
    exit();
})->name('assets.env');

// language route
Route::get('/js/lang/clear', function () {
    $lang = config('config.system.locale');
    $cache_name = 'lang-'. $lang .'.js';

    Cache::forget($cache_name);
    exit();
});

Route::get('/js/lang', function () {
    $lang = config('config.system.locale') ?? 'en';
    $cache_name = 'lang-'. $lang .'.js';

    if (App::environment('local')) {
        Cache::forget($cache_name);
    }
    
    $strings = Cache::remember($cache_name, 86400, function () use ($lang) {
        $files = glob(resource_path('lang/' . $lang . '/*.php'));
        $strings = [];

        foreach ($files as $file) {
            $name = basename($file, '.php');
            $strings[$name] = require $file;
        }
        return $strings;
    });
    header('Content-Type: text/javascript');
    echo ('window.locale = ' . json_encode($strings) . ';');
    exit();
})->name('assets.lang');

// Manifest route
Route::get('/site.webmanifest', function () {
    $cache_name = 'site.webmanifest';

    if (App::environment('local')) {
        Cache::forget($cache_name);
    }

    $strings = Cache::remember($cache_name, 43200, function () {
        $strings = [];
        $icons = [];

        $icons[] = array(
            "src" => config('config.assets.icon_192'),
            "sizes" => "192x192",
            "type" => "image/png"
        );

        $icons[] = array(
            "src" => config('config.assets.icon_512'),
            "sizes" => "512x512",
            "type" => "image/png"
        );

        $strings['name'] = config('config.basic.app_name');
        $strings['short_name'] = config('config.basic.app_name');
        $strings['description'] = config('config.basic.app_desc');
        $strings['icons'] = $icons;
        $strings['theme_color'] = config('config.basic.app_theme_color');
        $strings['background_color'] = config('config.basic.app_background_color');
        $strings['start_url'] = '.';
        $strings['scope'] = config('app.url').'/';
        $strings['display'] = 'standalone';
        $strings['orientation'] = 'portrait';

        return $strings;
    });
    header('Content-Type: application/manifest+json');
    echo (json_encode($strings));
    exit();
})->name('assets.manifest');

Route::get('auth/login/{provider}', 'Auth\SocialLoginController@redirectToProvider');
Route::get('auth/login/{provider}/callback', 'Auth\SocialLoginController@handleProviderCallback');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/meetings/{meeting}/downloads/{media}', 'MeetingMediaController@download');
});

// app route
Route::get('/app/{vue?}', function () {
    return view('app');
})->where('vue', '[\/\w\.-]*')->name('app');

Route::prefix('pages')->namespace('Site')->group(function() {
    Route::get('{page?}', 'PageController@fetch')->where('page', '[\/\w\.-]*');
});

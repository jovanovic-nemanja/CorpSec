<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Guest Routes

Route::namespace('Setup')->prefix('install')->group(function () {
    Route::get('pre-requisite', 'InstallController@preRequisite');
    Route::post('validate', 'InstallController@store');
    Route::post('', 'InstallController@store');
});

Route::namespace('Auth')->prefix('auth')->group(function () {
    Route::post('login/otp', 'LoginWithOtp');
    Route::post('login', 'LoginController@login');

    Route::post('register', 'RegisterController@register');
    Route::post('verify', 'RegisterController@verify');

    Route::post('password', 'ResetPasswordController@password');
    Route::post('validate-reset-password', 'ResetPasswordController@validateCode');
    Route::post('reset', 'ResetPasswordController@reset');
});

// Global Routes
Route::namespace('Config')->group(function () {
    Route::get('config/pre-requisite', 'ConfigController@preRequisite');
    Route::group(['middleware' => ['under_maintenance']], function () {
        Route::get('config', 'ConfigController@index');
    });
});

Route::group(['middleware' => ['auth:sanctum']], function () {

    // Auth Routes
    Route::namespace('Auth')->prefix('auth')->group(function () {
        Route::post('logout', 'LoginController@logout');
        Route::post('lock', 'LockScreen');
        Route::get('user', 'UserController@me');
        Route::post('security', 'TwoFactorSecurity');
    });
});

Route::group(['middleware' => ['auth:sanctum', '2fa', 'under_maintenance']], function () {

    // Auth Routes
    Route::namespace('Auth')->prefix('auth')->group(function () {
        Route::post('change-password', 'ChangePassword');
    });

    // User Routes
    Route::namespace('Auth')->prefix('user')->group(function () {
        Route::post('preference', 'UserController@preference');
    });

    Route::namespace('Auth')->group(function () {
        Route::get('users/pre-requisite', 'UserController@preRequisite');
        Route::post('users/{user}/status', 'UserController@updateStatus');
        Route::apiResource('users', 'UserController');
        Route::post('entities/{uuid}/status', 'EntityController@toggleStatus');
        Route::apiResource('entities', 'EntityController');

        Route::post('profile', 'ProfileController@update');
        Route::post('profile/avatar', 'ProfileController@uploadAvatar');
        Route::delete('profile/avatar', 'ProfileController@removeAvatar');
    });

    // Dashboard Routes
    Route::get('dashboard', 'DashboardController@index');
    Route::get('dashboard/stats', 'DashboardController@getStats');
    Route::get('dashboard/chart', 'DashboardController@getChart');

    // Any key search
    Route::get('search', 'Search');

    // Config Routes
    Route::namespace('Config')->prefix('config')->group(function () {
        Route::post('', 'ConfigController@store');
        Route::post('assets', 'ConfigController@uploadAsset');
        Route::delete('assets', 'ConfigController@removeAsset');

        Route::apiResource('roles', 'RoleController')->except(['update']);
        
        Route::get('permissions/pre-requisite', 'PermissionController@preRequisite');
        Route::post('permissions/assign', 'PermissionController@assign');
        
        Route::get('locales/pre-requisite', 'LocaleController@preRequisite');
        Route::post('locales/{locale}/translate', 'LocaleController@translate');
        Route::apiResource('locales', 'LocaleController');
    });

    // Option Routes
    Route::get('options/pre-requisite', 'OptionController@preRequisite');
    Route::apiResource('options', 'OptionController');

    Route::prefix('chat')->group(function() {
        Route::get('pre-requisite', 'ChatController@preRequisite');
        Route::get('rooms', 'ChatController@getRooms');
        Route::get('rooms/search', 'ChatController@searchRoom');
        Route::get('rooms/{uuid}', 'ChatController@getRoom');
        Route::post('rooms', 'ChatController@createRoom');
        Route::get('messages', 'ChatController@getMessage');
        Route::post('messages', 'ChatController@storeMessage');
        Route::get('messages/search', 'ChatController@searchMessage');
    });

    // Utility Routes
    Route::namespace('Utility')->prefix('utility')->group(function () {
        Route::post('todos/{uuid}/status', 'TodoController@toggleStatus');
        Route::apiResource('todos', 'TodoController');
    });

    // Site Routes
    Route::namespace('Site')->prefix('site')->group(function () {
        Route::get('pages/pre-requisite', 'PageController@preRequisite');
        Route::post('pages/{uuid}/media', 'PageController@addMedia');
        Route::delete('pages/{uuid}/media', 'PageController@removeMedia');
        Route::apiResource('pages', 'PageController');

        Route::apiResource('queries', 'QueryController')->only(['index', 'show', 'destroy']);
        Route::apiResource('subscribers', 'SubscriberController')->only(['index', 'show', 'destroy']);
    });
});

Broadcast::routes(["middleware" => ['auth:sanctum', '2fa']]);

//Fallback route
Route::fallback(function () {
    return response()->json(['message' => trans('general.api_not_found')], 404);
});

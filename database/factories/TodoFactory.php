<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\User;
use App\Models\Utility\Todo;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Todo::class, function (Faker $faker) {

    $is_completed = $faker->randomElement([1, 0]);
    $due_date = $faker->randomElement([
        Carbon::today()->toDateString(), 
        Carbon::yesterday()->toDateString(), 
        Carbon::tomorrow()->toDateString()
    ]);
    $due_time = $faker->randomElement(['11:30:00', '12:45:00', '13:10:00', '14:15:00', '18:10:00', null]);

    $completed_at = null;

    if ($is_completed) {
        $completed_at = $due_time ? ($due_date.' '.$due_time) : ($due_date.' 11:45:00');
    }

    return [
        'uuid' => Str::uuid(),
        'title' => $faker->realText(rand(10,60)),
        'description' => $faker->realText(rand(50, 250)),
        'due_date' => $due_date,
        'due_time' => $due_time,
        'user_id' => $faker->randomElement(User::all()->pluck('id')->all()),
        'status' => $is_completed,
        'completed_at' => $completed_at
    ];
});
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable();

            $table->boolean('status')->default(0);
            $table->boolean('type')->default(1);
            $table->string('name')->nullable();

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->dateTime('incorporation_date')->nullable();
            $table->dateTime('finanical_year_end_date')->nullable();

            $table->string('activity')->nullable();
            $table->text('description')->nullable();

            $table->string('interested_reason')->nullable();
            $table->string('fund_source')->nullable();

            $table->boolean('opt_corp_address')->default(0);
            $table->string('address_line1')->nullable();
            $table->string('address_line2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('registration_number')->nullable();

            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entities');
    }
}

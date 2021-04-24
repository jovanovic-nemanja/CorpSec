<?php

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = array(
            array('uuid' => '6383ed7a-b400-4db3-94cf-30e50f0405bc', 'name' => 'John Doe', 'email' =>  'admin@admin.com', 'gender' => 'male', 'username' => 'admin', 'role' => 'admin'),
            array('uuid' => '274ec063-17b7-4c97-ac63-cfe21ada0a4d', 'name' => 'Ajay Patil', 'email' =>  'user@user.com', 'gender' => 'male', 'username' => 'user', 'role' => 'user'),
            array('uuid' => 'fe45b082-4825-43a5-8731-030668c83551', 'name' => 'Marry Jen', 'email' =>  'user1@user.com', 'gender' => 'female', 'username' => 'user1', 'role' => 'user'),
            array('uuid' => '9ec7e38d-5dd6-4ea7-b975-671bf22d78d1', 'name' => 'Robert Merchant', 'email' =>  'user2@user.com', 'gender' => 'male', 'username' => 'user2', 'role' => 'user'),
            array('uuid' => 'd4d0640b-b4bf-4079-bc66-3fd4f1de1370', 'name' => 'Ken Roast', 'email' =>  'user3@user.com', 'gender' => 'male', 'username' => 'user3', 'role' => 'user'),
            array('uuid' => 'bf12d5ed-7fad-4186-a35e-d72d2a7e3db6', 'name' => 'Ravi Ramsen', 'email' =>  'user4@user.com', 'gender' => 'male', 'username' => 'user4', 'role' => 'user'),
            array('uuid' => '69ad9b28-1762-412f-9576-9385dfaa1e1b', 'name' => 'Akash Pathak', 'email' =>  'user5@user.com', 'gender' => 'male', 'username' => 'user5', 'role' => 'user'),
            array('uuid' => 'fbc1036b-27ce-4b5e-8f13-821c9de30c09', 'name' => 'Malik Varthy', 'email' =>  'user6@user.com', 'gender' => 'male', 'username' => 'user6', 'role' => 'user'),
            array('uuid' => '0cae6555-d609-4a8e-8f42-ced23f30dd4e', 'name' => 'Aarif Hora', 'email' =>  'user7@user.com', 'gender' => 'male', 'username' => 'user7', 'role' => 'user'),
            array('uuid' => '3aaa57a8-3d85-48f0-88eb-2f73a6dce6b3', 'name' => 'Aafrin Kakar', 'email' =>  'user8@user.com', 'gender' => 'female', 'username' => 'user8', 'role' => 'user'),
            array('name' => 'Amolika Borra', 'email' =>  'user9@user.com', 'gender' => 'female', 'username' => 'user9', 'role' => 'user'),
            array('name' => 'Azhar Chahal', 'email' =>  'user10@user.com', 'gender' => 'male', 'username' => 'user10', 'role' => 'user'),
            array('name' => 'Bahadur Vaidya', 'email' =>  'user11@user.com', 'gender' => 'male', 'username' => 'user11', 'role' => 'user'),
            array('name' => 'Bishnu Chaudhury', 'email' =>  'user12@user.com', 'gender' => 'male', 'username' => 'user12', 'role' => 'user'),
            array('name' => 'Chameli Manget', 'email' =>  'user13@user.com', 'gender' => 'female', 'username' => 'user13', 'role' => 'user'),
            array('name' => 'Chandni Muni', 'email' =>  'user14@user.com', 'gender' => 'female', 'username' => 'user14', 'role' => 'user'),
            array('name' => 'Devendra Bal', 'email' =>  'user15@user.com', 'gender' => 'male', 'username' => 'user15', 'role' => 'user'),
            array('name' => 'Devika Amble', 'email' =>  'user16@user.com', 'gender' => 'female', 'username' => 'user16', 'role' => 'user'),
            array('name' => 'Dinesh Bansal', 'email' =>  'user17@user.com', 'gender' => 'male', 'username' => 'user17', 'role' => 'user'),
            array('name' => 'Gayatri Bose', 'email' =>  'user18@user.com', 'gender' => 'female', 'username' => 'user18', 'role' => 'user'),
            array('name' => 'Iqbal Shan', 'email' =>  'user19@user.com', 'gender' => 'male', 'username' => 'user19', 'role' => 'user'),
        );
        $faker = Faker\Factory::create();

        foreach ($users as $data) {
            $user = $this->user->firstOrCreate([
                'email' => Arr::get($data, 'email'),
                'gender' => Arr::get($data, 'gender')
            ]);

            $user->uuid              = Str::uuid();
            $user->name              = Arr::get($data, 'name');
            $user->username          = Arr::get($data, 'username');
            $user->birth_date        = $faker->dateTimeBetween($startDate = '-50 years', $endDate = '-18 years', $timezone = null);
            $user->email_verified_at = now();
            $user->password          = bcrypt('password');
            $user->status            = 'activated';
            $user->preference        = [];
            $user->remember_token    = Str::random(10);
            $user->save();
            
            $user->assignRole(Arr::get($data, 'role'));
        }
    }
}

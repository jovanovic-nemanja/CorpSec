<?php

use App\Helpers\ArrHelper;
use App\Models\Config\Role;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use App\Models\Config\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $acl = ArrHelper::getVar('acl');

        $existing_permissions = Permission::get()->pluck('name')->all();
        $system_permissions   = Arr::get($acl, 'permissions', []);

        $permissions = array();
        foreach ($system_permissions as $system_permission) {
            [$keys, $values]   = Arr::divide($system_permission);
            $permissions = array_merge($permissions, $keys);
        }
        
        $new_permissions = array_diff($permissions, $existing_permissions);

        $permissions = array();
        foreach ($new_permissions as $permission) {
            $permissions[] = array(
                'uuid' => (string) Str::uuid(),
                'name' => $permission,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            );
        }

        Permission::insert($permissions);

        $roles = Role::all();
        $permissions = Permission::all();
        $admin_role = $roles->firstWhere('name', 'admin');

        $role_permission = array();
        foreach ($permissions as $permission) {
            $role_permission[] = array(
                'permission_id' => $permission->id,
                'role_id' => $admin_role->id,
            );
        }

        foreach ($system_permissions as $permission_group) {
            foreach ($permission_group as $name => $assigned_roles) {
                foreach ($assigned_roles as $role) {
                    $role_permission[] = array(
                        'permission_id' => $permissions->firstWhere('name', $name)->id,
                        'role_id' => $roles->firstWhere('name', $role)->id
                    );
                }
            }
        }

        foreach ($role_permission as $key => $value) {
            $permission_granted = \DB::table('role_has_permissions')->whereRaw('permission_id =? AND role_id =?', [
                $value['permission_id'],
                $value['role_id'],
            ])->first();
            if ($permission_granted) {
                unset($role_permission[$key]);
            }
        }
        $unique_role_permissions = array_unique($role_permission, SORT_REGULAR);

        \DB::table('role_has_permissions')->insert($unique_role_permissions);
    }
}

<?php

namespace App\Repositories;

use App\Helpers\ArrHelper;
use App\Helpers\CalHelper;
use App\Http\Resources\Utility\TodoCollection;
use App\Models\Config\Permission;
use App\Models\Config\Role;
use App\Models\User;
use App\Models\Utility\Todo;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class DashboardRepository
{
    protected $user;
    protected $todo;
    protected $role;
    protected $permission;

    public function __construct(
        User $user,
        Todo $todo,
        Role $role,
        Permission $permission
    ) {
        $this->user = $user;
        $this->todo = $todo;
        $this->role = $role;
        $this->permission = $permission;
    }

    /**
     * Get todos for dashbaord
     */
    public function getTodos() : array
    {
        $todos = $this->todo->whereUserId(\Auth::user()->id)->whereNull('completed_at')->orderBy('due_date', 'asc')->take(5)->get();

        $todos = new TodoCollection($todos);

        return compact('todos');
    }

    /**
     * Get stats for dashboard
     */
    public function getStats() : array
    {
        $stats = array();
        array_push($stats, $this->getUserStats());
        array_push($stats, $this->getRoleStats());
        array_push($stats, $this->getTodoStats());
        array_push($stats, $this->getCompletedTodoStats());

        return $stats;
    }

    /**
     * Get user count for dashboard
     */
    private function getUserStats() : array
    {
        $users = $this->user->get();
        $today = $users->filter(function ($q) {
            return CalHelper::toDate($q->created_at) === CalHelper::today();
        })->count();

        return array(
            'value' => $users->count(),
            'label' => trans('dashboard.stats.total', ['attribute' => trans('user.users')]),
            'color' => 'bg-gray-darker',
            'icon' => 'fas fa-users',
            'extra' => array(
                'today' => array(
                    'value' => $today,
                    'label' => trans('dashboard.stats.today', ['attribute' => trans('user.users')]),
                    'color' => $today ? 'text-success' : 'text-dark',
                    'icon' => 'fas fa-arrow-up'
                )
            )
        );
    }

    /**
     * Get role count for dashboard
     */
    private function getRoleStats() : array
    {
        $roles = $this->role->get();
        $permissions = $this->permission->count();

        return array(
            'value' => $roles->count(),
            'label' => trans('dashboard.stats.total', ['attribute' => trans('config.role.roles')]),
            'color' => 'bg-info',
            'icon' => 'fas fa-users-cog',
            'extra' => array(
                'today' => array(
                    'value' => $permissions,
                    'label' => trans('config.permission.permissions'),
                    'color' => $permissions ? 'text-success' : 'text-dark',
                    'icon' => 'fas fa-key'
                )
            )
        );
    }

    /**
     * Get todo count for dashboard
     */
    private function getTodoStats() : array
    {
        $todos = $this->todo->whereUserId(\Auth::user()->id)->get();
        $today = $todos->filter(function ($q) {
            return CalHelper::toDate($q->due_date) === CalHelper::today();
        })->count();

        return array(
            'value' => $todos->count(),
            'label' => trans('dashboard.stats.total', ['attribute' => trans('utility.todo.todos')]),
            'color' => 'bg-primary',
            'icon' => 'fas fa-tasks',
            'extra' => array(
                'today' => array(
                    'value' => $today,
                    'label' => trans('dashboard.stats.today', ['attribute' => trans('utility.todo.todos')]),
                    'color' => $today ? 'text-success' : 'text-dark',
                    'icon' => 'fas fa-arrow-up'
                )
            )
        );
    }

    /**
     * Get completed todo count for dashboard
     */
    private function getCompletedTodoStats() : array
    {
        $todos = $this->todo->whereUserId(\Auth::user()->id)->whereNotNull('completed_at')->get();
        $today = $todos->filter(function ($q) {
            return CalHelper::toDate($q->completed_at) === CalHelper::today();
        })->count();

        return array(
            'value' => $todos->count(),
            'label' => trans('dashboard.stats.total', ['attribute' => trans('utility.todo.completed_todos')]),
            'color' => 'bg-success',
            'icon' => 'fas fa-check',
            'extra' => array(
                'today' => array(
                    'value' => $today,
                    'label' => trans('dashboard.stats.today', ['attribute' => trans('utility.todo.completed_todos')]),
                    'color' => $today ? 'text-success' : 'text-dark',
                    'icon' => 'fas fa-arrow-up'
                )
            )
        );
    }

    /**
     * Get chart for dashboard
     */
    public function getCharts()
    {
        $users = $this->user->get();

        $dataset = array();
        $labels = array();
        foreach (ArrHelper::getTransList('months', 'general', false) as $month) {
            $labels[] = Arr::get($month, 'name');

            $date = '1-'. Arr::get($month, 'uuid').'-'.date('Y');
            
            $dataset[] = $users->filter(function ($user) use ($date) {
                    return $user->created_at >= Carbon::parse($date)->toDateTimeString() &&
                    $user->created_at <= Carbon::parse($date)->endOfMonth()->endOfDay()->toDateTimeString();
            })->count();
        }

        $datasets[] = array(
            'label' => trans('user.users'),
            'backgroundColor' => 'rgba(2,62,180,0.5)',
            'borderColor' => '#023EB4',
            'borderWidth' => 1,
            'data' => $dataset,
        );

        return array(
            'type' => 'bar',
            'title' => trans('dashboard.chart'),
            'chart_data' => array(
                'labels' => $labels,
                'datasets' => $datasets
            ),
            'options' => array()
        );
    }
}

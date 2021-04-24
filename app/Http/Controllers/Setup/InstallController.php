<?php
namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setup\InstallRequest;
use App\Repositories\Setup\InstallRepository;

class InstallController extends Controller
{
    protected $repo;

    /**
     * Instantiate a new controller instance.
     */
    public function __construct(
        InstallRepository $repo
    ) {
        $this->repo = $repo;
    }

    /**
     * Used to get pre requisites of server and folder
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Used to install the application
     */
    public function store(InstallRequest $request)
    {
        $this->repo->validateDatabase();

        if (in_array(request()->query('option'), ['database'])) {
            return $this->success([]);
        }

        $this->repo->install();

        return $this->success(['message' => trans('setup.install.completed')]);
    }
}
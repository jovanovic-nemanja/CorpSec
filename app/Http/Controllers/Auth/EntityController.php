<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntityRequest;
use App\Http\Resources\Entity as EntityResource;
use App\Models\Entity;
use App\Repositories\EntityRepository;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    private $request;
    private $repo;

    /**
     * Instantiate a new controller instance
     * @return void
     */
    public function __construct(
        Request $request,
        EntityRepository $repo
    ) {
        $this->request = $request;
        $this->repo    = $repo;

        $this->middleware('feature_available:entity');
    }

    /**
     * Get all entities
     * @get ("/api/entities")
     * @return array
     */
    public function index()
    {
        $this->authorize('view', Entity::class);

        return $this->repo->paginate();
    }

    /**
     * Store entity
     * @post ("/api/entities")
     * @return array
     */
    public function store(EntityRequest $request)
    {
        $this->authorize('create', Entity::class);

        $entity = $this->repo->create();

        $entity = new EntityResource($entity);

        return $this->success(['message' => __('global.added', ['attribute' => __('entity.entity')]), 'entity' => $entity]);
    }

    /**
     * Get entity detail
     * @get ("/api/entities/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="uuid", required="true", description="Entity unique id"),
     * })
     * @return EntityResource
     */
    public function show($uuid)
    {
        $entity = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('show', $entity);

        return new EntityResource($entity);
    }

    /**
     * Update entity status
     * @post ("/api/entities/{uuid}/status")
     * @param ({
     *      @Parameter("uuid", type="uuid", required="true", description="Entity unique id"),
     * })
     * @return array
     */
    public function toggleStatus($uuid)
    {
        $entity = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('update', $entity);

        $entity = $this->repo->toggle($entity);

        return $this->success(['message' => __('global.updated', ['attribute' => __('entity.entity')])]);
    }

    /**
     * Update entity
     * @patch ("/api/entities/{uuid}")
     * @return array
     */
    public function update($uuid, EntityRequest $request)
    {
        $entity = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('update', $entity);

        $entity = $this->repo->update($entity);

        return $this->success(['message' => __('global.updated', ['attribute' => __('entity.entity')])]);
    }

    /**
     * Delete entity
     * @delete ("/api/entities/{uuid}")
     * @param ({
     *      @Parameter("uuid", type="uuid", required="true", description="Entity unique id"),
     * })
     * @return array
     */
    public function destroy($uuid)
    {
        $entity = $this->repo->findByUuidOrFail($uuid);

        $this->authorize('delete', $entity);

        $this->repo->delete($entity);

        return $this->success(['message' => __('global.deleted', ['attribute' => __('entity.entity')])]);
    }
}

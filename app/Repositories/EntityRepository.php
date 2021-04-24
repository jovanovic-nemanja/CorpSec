<?php
namespace App\Repositories;

use Carbon\Carbon;
use App\Helpers\ArrHelper;
use App\Helpers\CalHelper;
use App\Http\Resources\EntityCollection;
use App\Models\Entity;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EntityRepository
{
    protected $entity;

    /**
     * Instantiate a new instance
     * @return void
     */
    public function __construct(
        Entity $entity
    ) {
        $this->entity = $entity;
    }

    /**
     * Find entity with given id or throw an error
     * @param integer $id
     */
    public function findOrFail($id, $field = 'message'): Entity
    {
        $entity = $this->entity->find($id);

        if (!$entity) {
            throw ValidationException::withMessages([$field => __('global.could_not_find', ['attribute' => __('entity.entity')])]);
        }

        return $entity;
    }

    /**
     * Find entity with given uuid or throw an error
     * @param uuid $uuid
     */
    public function findByUuidOrFail($uuid, $field = 'message'): Entity
    {
        $entity = $this->entity->filterByUuid($uuid)->first();

        if (!$entity) {
            throw ValidationException::withMessages([$field => __('global.could_not_find', ['attribute' => __('entity.entity')])]);
        }

        return $entity;
    }

    /**
     * Paginate all entities
     */
    public function paginate(): EntityCollection
    {
        $sort_by = $this->entity->getSortBy();
        $order   = $this->entity->getOrder();
        $keyword = request()->query('keyword');
        $status  = request()->query('status');

        $query = $this->entity->filterByUserId(\Auth::user()->id)->filterByKeyword($keyword)->filterActive($status);

        if (request('type') == 'list') {
            $sort_by = explode(',', $sort_by);
            $order   = explode(',', $order);
            foreach ($sort_by as $key => $s) {
                $query = $query->orderBy($s, $order[$key]);
            }
            return new EntityCollection($query->get());
        }

        $per_page     = request('per_page', config('config.system.per_page'));
        $current_page = request('current_page');

        return new EntityCollection($query->orderBy($sort_by, $order)->paginate((int) $per_page, ['*'], 'current_page'));
    }

    /**
     * Create a new entity
     */
    public function create(): Entity
    {
        return $this->entity->forceCreate($this->formatParams());
    }

    /**
     * Fillable fields of entity table
     */
    private function entityFillableParams(): array
    {
        return [
            'type',
            'name',
            'incorporation_date',
            'finanical_year_end_date',
            'activity',
            'description',
            'interested_reason',
            'fund_source',
            'opt_corp_address',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'country',
            'zip_code',
            'registration_number',
            'other_reason',
            'other_source_fund',
        ];
    }

    /**
     * Prepare given params for inserting into database
     * @param uuid $uuid
     */
    private function formatParams($uuid = null): array
    {
        $formatted = [];
        $params    = $this->entityFillableParams();
        foreach ($params as $key => $value) {
            if (request()->has($value)) {
                $formatted[$value] = request($value);
                if (in_array($value, ['interested_reason', 'fund_source'])) {
                    $formatted[$value] = implode(',', request($value));
                }
            }
        }

        if (!$uuid) {
            $formatted['user_id'] = \Auth::user()->id;
            $formatted['uuid']    = Str::uuid();
            $formatted['status']  = 1;
        }

        return $formatted;
    }

    /**
     * Update given entity
     * @param Entity $entity
     */
    public function update(Entity $entity): Entity
    {
        $entity->forceFill($this->formatParams($entity->uuid))->save();

        return $entity;
    }

    /**
     * Delete entity
     * @param Entity $entity
     */
    public function delete(Entity $entity): void
    {
        $entity->delete();
    }

    /**
     * Toggle given entity status
     * @param Entity $entity
     */
    public function toggle(Entity $entity): Entity
    {
        $entity->forceFill([
            'status' => !$entity->status,
        ])->save();

        return $entity;
    }
}

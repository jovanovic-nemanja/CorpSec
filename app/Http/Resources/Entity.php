<?php

namespace App\Http\Resources;

use App\Helpers\CalHelper;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Entity extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'uuid'                    => $this->uuid,
            'status'                  => $this->status ? true : false,
            'type'                    => $this->type,
            'name'                    => $this->name,
            'incorporation_date'      => CalHelper::toDate($this->incorporation_date),
            'finanical_year_end_date' => CalHelper::toDate($this->finanical_year_end_date),
            'activity'                => $this->activity,
            'description'             => $this->description,
            'interested_reason'       => $this->interested_reason,
            'fund_source'             => $this->fund_source,
            'opt_corp_address'        => $this->opt_corp_address,
            'address_line1'           => $this->address_line1,
            'address_line2'           => $this->address_line2,
            'city'                    => $this->city,
            'state'                   => $this->state,
            'country'                 => $this->country,
            'zip_code'                => $this->zip_code,
            'registration_number'     => $this->registration_number,
            'user'                    => new UserResource($this->whenLoaded('user')),
            'created_at'              => CalHelper::toDateTime($this->created_at),
            'updated_at'              => CalHelper::toDateTime($this->updated_at),
            'other_reason'            => $this->other_reason,
            'other_source_fund'       => $this->other_source_fund,
        ];
    }
}

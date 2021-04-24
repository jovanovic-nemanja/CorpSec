<?php

namespace App\Http\Resources;

use App\Helpers\CalHelper;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserSummary;
use App\Http\Resources\ChatCollection;
use App\Http\Resources\UserSummaryCollection;

class ChatRoom extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $name = $this->name;
        $member = $this->getP2PMember();

        return [
           'uuid'    => $this->uuid,
           'name'    => $this->name ?? optional($member)->name,
           'message' => $this->when($this->message, $this->message),
           'member'  => new UserSummary($member),
           'member_count'         => $this->when($this->relationLoaded('chatRoomMembers'), $this->chatRoomMembers->count()),
           'is_group'             => $this->name != null,
           'chats'                => new ChatCollection($this->whenLoaded('chats')),
           'last_conversation_at' => CalHelper::toDateTime($this->last_conversation_at),
           'created_at'           => CalHelper::toDateTime($this->created_at),
           'updated_at'           => CalHelper::toDateTime($this->updated_at)
        ];
    }

    private function getMembers()
    {
        if (! $this->relationLoaded('chatRoomMembers')) {
            return [];
        }

        if (! $this->chatRoomMembers->count()) {
            return [];
        }

        $members = array();
        $this->chatRoomMembers->each(function ($member) use ($members) {
            array_push($members, $member->user);
        });

        return collect($members);
    }

    private function getP2PMember()
    {
        if ($this->name) {
            return null;
        }

        if (! $this->relationLoaded('chatRoomMembers')) {
            return null;
        }

        return optional($this->chatRoomMembers->where('user_id', '!=', \Auth::id())->first())->user;
    }
}

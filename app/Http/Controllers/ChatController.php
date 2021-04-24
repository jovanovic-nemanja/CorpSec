<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatRequest;
use App\Http\Requests\ChatRoomRequest;
use App\Repositories\ChatRepository;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    protected $repo;

    /**
     * Get chat pre requisite
     * @get ("/api/chat/pre-requisite")
     * @return array
     */
    public function preRequisite()
    {
        return $this->ok($this->repo->getPreRequisite());
    }

    /**
     * Instantiate a new controller instance
     * @return void
     */
    public function __construct(ChatRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get chat rooms
     * @get ("/api/chat/rooms")
     * @return array
     */
    public function getRooms()
    {
        return $this->repo->getRooms();
    }

    /**
     * Get chat room
     * @get ("/api/chat/rooms/{uuid}")
     * @return array
     */
    public function getRoom($uuid)
    {
        return $this->repo->getRoom($uuid);
    }

    /**
     * Create chat room
     * @post ("/api/chat/rooms")
     * @return array
     */
    public function createRooms(ChatRoomRequest $request)
    {
        return $this->ok($this->repo->createRoom());
    }

    /**
     * Search chat user & rooms
     * @get ("/api/chat/search")
     * @return array
     */
    public function searchRoom()
    {
        return $this->ok($this->repo->searchRoom());
    }

    /**
     * Search chat messages
     * @get ("/api/chat/search/message")
     * @return array
     */
    public function searchMessage()
    {
        return $this->ok($this->repo->searchMessage());
    }

    /**
     * Get chat messages
     * @get ("/api/chat")
     * @return array
     */
    public function getMessage()
    {
        return $this->repo->getMessage();
    }

    /**
     * Store chat messages
     * @post ("/api/chat")
     * @return array
     */
    public function storeMessage(ChatRequest $request)
    {
        return $this->repo->storeMessage();
    }
}

<template>
    <div :class="['chat-box-wrapper', {'shown': isBoxShown}, {'search-shown': isSearchShown}, {'chat-box-lg': largeChatBox}, {'show-chat-options': showChatOptions}]">
        <chat-box-header :active-container="activeContainer" @goHome="goHome" @toggleSearch="toggleSearch" @goToSettings="goToSettings" @hideChatBox="hideChatBox" />

        <div class="search">
            <input type="text" class="form-control" ref="searchTerm" v-model="searchTerm" @keydown.esc="toggleSearch" @input="searchTermChanged" :placeholder="$t('general.search_helper_default_text')">
            <button v-if="searchTerm" type="button" @click="hideSearch" class="clear-btn">{{ $t('general.clear') }}</button>
        </div>

        <div :class="['chat-box', {'showing-settings': activeContainer === 'settings'}, {'showing-chats': activeContainer === 'conversation'}]">

            <chat-box-settings :active-container="activeContainer" @goHome="goHome" />

            <div class="cb-inner-window rooms-container">

                <vue-scroll ref="vue-scroll-rooms" id="vue-scroll-rooms" @handle-scroll="handleRoomsScroll">
                    <div class="rooms-wrapper">

                        <template v-if="(searchTerm && searched) || newChatScreen">
                            <ul class="rooms" v-if="roomsSearch.rooms.length || roomsSearch.users.length">

                                <template v-if="!newChatScreen">
                                    <chat-room-item v-for="room in roomsSearch.rooms" :room="room" :room-name="room.name" @goToConversation="goToConversation" :vars="vars" :key="room.uuid" />

                                    <li v-if="roomsSearch.users.length" class="my-2 pl-3 font-weight-500">{{ $t('user.users') }}</li>
                                </template>

                                <chat-room-item v-for="user in roomsSearch.users" :room="user" :room-name="user.profile.name" @goToConversation="goToConversation" :vars="vars" :key="user.uuid" />
                            </ul>

                            <div v-else class="no-data">
                                <h5>{{ $t('chat.no_result_found') }}</h5>
                            </div>
                        </template>

                        <template v-else>
                            <ul v-if="rooms.data && rooms.data.length" class="rooms">
                                <chat-room-item v-for="room in rooms.data" :room="room" :room-name="room.name" @goToConversation="goToConversation" :vars="vars" :key="room.uuid" />
                            </ul>

                            <div v-else class="no-data">
                                <h5>{{ $t('chat.no_chats_yet') }}</h5>
                            </div>
                        </template>

                    </div>
                </vue-scroll>

                <div class="chat-option-buttons">
                    <button type="button" @click="createGroup" class="d-none"><i class="fas fa-user-friends"></i></button>
                    <button type="button" @click="startNewChat"><i class="fas fa-comment-dots fa-flip-horizontal"></i></button>
                    <button type="button"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>

            <div class="cb-inner-window conversation-container">
                <div class="conversation-wrapper" v-if="activeConversation">

                    <conversation-header v-if="activeConversation.chatRoom" :room="activeConversation.chatRoom" :room-name="activeConversation.chatRoom.name" :vars="vars" :typingUser="typingUser" />
                    <conversation-header v-else-if="activeConversation.user" :room="activeConversation.user" :room-name="activeConversation.user.profile.name" :vars="vars" :typingUser="typingUser" />


                    <div :class="['conversation', {'no-messages': !hasMessages}, {'got-new-messages': newUnreadMessageOnFeed}, {'show-scroll-btn': showScrollToLatestBtn}]">

                        <div v-if="hasMessages" class="messages-list-container">
                            <vue-scroll ref="vue-scroll-messages" id="vue-scroll-messages" @handle-scroll="handleMessageScroll">
                                <div :class="['messages-list-wrapper', {'show-name': activeConversation.room && activeConversation.room.isGroup}]">


                                    <template v-if="searchTerm && searched">
                                        <template v-if="messagesSearch.length">
                                            <message-item v-for="(message, mIndex) in messagesSearch" :message="message" :vars="vars" :file-icons="fileIcons" :file-mime-types="fileMimeTypes" :class="[{'own-message': message.user.uuid === user.uuid}, {'prev-diff-own': !messages.data[mIndex+1] || messages.data[mIndex+1].user.uuid !== message.user.uuid}, {'next-diff-own': !messages.data[mIndex-1] || messages.data[mIndex-1].user.uuid !== message.user.uuid}]" :key="message.uuid" />
                                        </template>

                                        <div v-else class="no-data">
                                            <h5>{{ $t('chat.no_result_found') }}</h5>
                                        </div>
                                    </template>


                                    <template v-else>
                                        <message-item v-for="(message, mIndex) in messages.data" :message="message" :vars="vars" :file-icons="fileIcons" :file-mime-types="fileMimeTypes" :class="[{'own-message': message.user.uuid === user.uuid}, {'prev-diff-own': !messages.data[mIndex+1] || messages.data[mIndex+1].user.uuid !== message.user.uuid}, {'next-diff-own': !messages.data[mIndex-1] || messages.data[mIndex-1].user.uuid !== message.user.uuid}]" :key="message.uuid" />

                                        <div v-if="isFetching" class="d-flex justify-content-center my-2">
                                            <animated-loader :is-loading="isFetching" :loader-color="vars.colors.light" overlay-color="transparent" size="inline" loader-size="20px" loader-stroke="3px" />
                                        </div>

                                        <div v-if="noMoreMessages" class="message-item my-4 d-flex justify-content-center align-items-center">
                                            <h5 class="text-muted">
                                                {{ $t('chat.no_more_messages') }}
                                            </h5>
                                        </div>
                                    </template>

                                </div>
                            </vue-scroll>
                        </div>

                        <div v-else class="d-flex justify-content-center align-items-center min-height-300px">
                            <h5 class="text-muted">
                                {{ $t('chat.no_messages_yet') }}
                            </h5>
                        </div>

                        <div class="scroll-latest-btn" @click="scrollToLatestMessages">
                            <div class="scroll-btn-wrapper">
                                <i class="fas fa-angle-double-down"></i>
                            </div>
                        </div>

                    </div>

                    <div class="conversation-footer">

                        <div class="new-message">
                            <at :members="computedParticipants" name-key="username" v-model="newMessage.message">
                                <template slot="item" slot-scope="s">
                                    <span class="mentioned">{{ s.item.profile.name }} <span class="bracketed text-muted-md">{{ s.item.username }}</span></span>
                                </template>

                                <div class="new-message-input form-control" contenteditable :data-placeholder="$t('chat.type_a_message')" :placeholder="$t('chat.type_a_message')" ref="newMessageInput" @keydown="isTyping" @keydown.enter="enterPressedEvt(postMessage, $event)"></div>
                            </at>

                            <file-uploader v-if="!newMessage.message" url="/chat/messages" name-label="upload.attachment" names-label="upload.attachments" button-icon="fas fa-paperclip" button-classes="btn-sm" button-design="custom" hide-button-label hide-file-list :options="preRequisite.uploaderConfig" :data="newMessage.attachments" :additional-form-data="activeConversation" :request-identifier="newMessageRequestUUID" @uploading="attachmentUploadStarted" @updated="attachmentUploaded" @error="attachmentUploadError" @noNeed="noNeedCallback" />

                            <button type="button" class="btn-custom post-message-button" :title="$t('general.submit')" @click="postMessage"><i class="far fa-paper-plane"></i></button>
                        </div>

                    </div>
                </div>
            </div>

        </div>


    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    import FileUploader from '@components/FileUploader'
    import ChatBoxHeader from './header'
    import ChatBoxSettings from './settings'
    import ChatRoomItem from './room-item'
    import ConversationHeader from './conversation-header'
    import MessageItem from './message-item'
    import At from 'vue-at'
    import EventBus from '@js/event-bus'

    import { enterPressed } from '@core/utils/form'
    import { formatKeysToCamelCase } from '@core/utils/formatter'
    import { fileIcons, fileMimeTypes } from '@js/vars'
    import { playIncomingMessage } from '@core/utils/media'

    export default {
        name: "ChatBox",
        components: {
            FileUploader,
            At,
            ChatBoxHeader,
            ChatBoxSettings,
            ChatRoomItem,
            ConversationHeader,
            MessageItem,
        },
        props: {
            channel: {
                default: null
            },
            boxVisibility: {
                type: Boolean,
                default: false,
            },
            meeting: {
                type: Object,
                default () {
                    return {}
                }
            },
        },
        data() {
            return {
                isBoxShown: false,
                isSearchShown: false,
                showChatOptions: false,
                largeChatBox: false,
                searched: false,
                newChatScreen: false,
                cbHeaderTitle: $t('chat.live_chat'),
                searchTerm: '',
                activeContainer: 'home',
                members: [],
                newMessage: {
                    message: '',
                    attachments: [],
                    updated: false,
                },
                newMessageRequestUUID: uuid(),
                activeConversation: null,
                uploadURL: '',
                formErrors: {},
                preRequisite: {
                    uploaderConfig: {
                        module: '',
                        token: '',
                        allowedExtensions: '',
                        maxNoOfFiles: 1,
                        uuid: uuid(),
                    },
                },
                isFetching: false,
                noMoreMessages: false,
                newUnreadMessageOnFeed: false,
                showScrollToLatestBtn: false,
                chatRoomChannel: null,
                typingUser: null,
                typingUserTimeout: null,
                initialNewMessage: null,
                firstFetch: true,
                fileIcons: fileIcons,
                fileMimeTypes: fileMimeTypes,
            }
        },
        watch: {
            boxVisibility(newVal, oldVal) {
                this.isBoxShown = newVal
            },
            activeChatUser(newVal, oldVal) {
                if(newVal !== null && (!oldVal || (oldVal !== null && newVal.uuid !== oldVal.uuid))) {
                    this.goToConversation({ user: newVal })
                }
            },
            activeChatRoom(newVal, oldVal) {
                if(newVal !== null && (!oldVal || (oldVal !== null && newVal.uuid !== oldVal.uuid))) {
                    this.goToConversation({ room: newVal })
                }
            },
        },
        computed: {
            ...mapGetters('config', [
                'vars',
                'configs',
                'uiConfigs',
            ]),
            ...mapGetters('user', {
                'userUuid': 'uuid'
            }),
            ...mapGetters('user', [
                'profile',
                'username',
            ]),
            ...mapGetters('chat', [
                'rooms',
                'roomsPageMeta',
                'roomsSearch',
                'messages',
                'messagesPageMeta',
                'messagesSearch',
                'activeChatRoom',
                'activeChatUser',
            ]),
            user() {
                return {
                    uuid: this.userUuid,
                    username: this.username,
                    name: this.profile.name,
                    profile: this.profile,
                }
            },
            hasMessages() {
                return this.activeConversation && this.messages.data
            },
            computedParticipants() {
                if (this.activeConversation) {
                    return this.activeConversation.members
                }
                return []
            },
            enterToSubmit() {
                return this.configs.chat && this.configs.chat.enterToSubmit
            }
        },
        methods: {
            ...mapActions('chat', [
                'GetRooms',
                'GetRoom',
                'SearchRooms',
                'SearchMessages',
                'GetMessages',
                'SendMessage',
                'PutMessageToFeed',
                'PatchMessageInFeed',
                'ResetMessage',
                'SetMessage',
                'ResetTotalUnreadCount',
                'SetActiveChatRoom',
                'SetActiveChatUser',
                'ResetActiveChatRoomAndUser',
            ]),

            // TOGGLE & HIDE SHOW METHODS
            hideChatBox() {
                this.isBoxShown = false
                this.ResetActiveChatRoomAndUser()
                setTimeout(() => {
                    this.$emit('boxHidden')
                }, 200)
            },
            showChatBox() {
                this.isBoxShown = true
                this.$emit('boxShown')
            },
            hideSearch() {
                this.searchTerm = ''
                this.searched = false
                this.isSearchShown = false
                this.showChatOptions = true
                this.newChatScreen = false

                if (this.activeContainer === 'home') {
                    this.fetchRooms(true)
                    this.scrollTo("vue-scroll-rooms", 0)
                } else if (this.activeContainer === 'conversation') {
                    this.fetchMessages(true)
                }
            },
            toggleSearch(startNewChat = false) {
                this.searchTerm = ''
                this.searched = false
                this.isSearchShown = !this.isSearchShown

                if (this.isSearchShown) {
                    this.newChatScreen = startNewChat
                    this.showChatOptions = !startNewChat
                    this.$nextTick(() => {
                        this.$refs[`searchTerm`].focus()
                    })
                } else {
                    this.newChatScreen = false
                    this.showChatOptions = true
                    if (this.activeContainer === 'home') {
                        this.fetchRooms(true)
                        this.scrollTo("vue-scroll-rooms", 0)
                    } else if (this.activeContainer === 'conversation') {
                        this.fetchMessages(true)
                    }
                }
            },
            startNewChat() {
                this.toggleSearch(true)
            },
            createGroup() {
                this.toggleSearch(true)
            },

            // SWITCH TO VIEW METHODS
            goHome() {
                const comingFrom = this.activeContainer
                this.activeContainer = 'home'
                this.ResetActiveChatRoomAndUser()

                if (comingFrom === 'conversation') {
                    this.leaveChatRoomChannel(this.activeConversation.chatRoom)
                    this.hideSearch()
                    if (this.searchRoomObj && this.searchRoomObj.searched) {
                        this.searchTerm = this.searchRoomObj.searchTerm
                        this.searched = this.searchRoomObj.searched
                        this.isSearchShown = true
                        this.showChatOptions = false
                    } else {
                        this.fetchRooms()
                    }
                } else {
                    this.fetchRooms()
                }

                this.scrollTo("vue-scroll-rooms", 0)
                setTimeout(() => {
                    this.activeConversation = null
                }, 100)
            },
            goToConversation({ room, user }, fetchRoomForUser = false) {

                const swtichToConversationTab = () => {
                    setTimeout(() => {
                        this.activeContainer = 'conversation'

                        if (this.isSearchShown) {
                            this.searchRoomObj = {
                                searchTerm: this.searchTerm,
                                searched: this.searched
                            }
                            this.hideSearch()
                        } else {
                            this.searchRoomObj = {
                                searchTerm: null,
                                searched: null
                            }
                        }

                        window.setTimeout(() => {
                            this.scrollToLatestMessages()
                            this.focusNewMessage()
                            this.showScrollToLatestBtn = false
                            this.newUnreadMessageOnFeed = false
                        }, 300)
                    }, 100)
                }

                this.activeConversation = {
                    chatRoom: room || null,
                    user: user || null,
                    members: user ? [user] : [],
                }

                this.ResetMessage()

                if (room) {
                    this.joinChatRoomChannel(room)

                    this.GetRoom({
                            uuid: room.uuid
                        })
                        .then(response => {
                            this.activeConversation.chatRoom = response

                            this.SetMessage({
                                data: [...response.chats],
                                meta: {
                                    ...this.messages.meta,
                                    total: response.chats.length,
                                    lastItemUuid: response.chats.length ? response.chats[response.chats.length - 1].uuid : null,
                                }
                            })

                            if (this.activeConversation.chatRoom && this.activeConversation.chatRoom.hasOwnProperty('chats')) {
                                delete this.activeConversation.chatRoom.chats
                            }
                            this.noMoreMessages = false

                            this.SetActiveChatRoom(this.activeConversation.chatRoom)
                            swtichToConversationTab()
                        })
                        .catch(error => {
                            formUtil.handleErrors(error)
                        })
                } else {
                    this.SetActiveChatUser(this.activeConversation.user)
                    this.fetchMessages(true)
                    swtichToConversationTab()
                }

            },
            goToSettings() {
                const comingFrom = this.activeContainer
                this.activeContainer = 'settings'

                this.scrollTo("vue-scroll-rooms", 0)
                setTimeout(() => {
                    if (comingFrom === 'conversation') {
                        this.ResetActiveChatRoomAndUser()
                        this.leaveChatRoomChannel(this.activeConversation.chatRoom)
                    }

                    if (this.isSearchShown) {
                        this.hideSearch()
                    }

                    this.activeConversation = null
                }, 100)
            },

            // FETCH DATA METHODS
            searchTermChanged: _.debounce(function() {
                if (!this.searchTerm || this.searchTerm.length < 2) {
                    return
                }

                if (this.activeContainer === 'home') {
                    this.searchRooms()
                    this.scrollTo("vue-scroll-rooms", 0)
                } else if (this.activeContainer === 'conversation') {
                    this.searchMessages()
                }
            }, 500),
            fetchRooms(reset = true) {
                this.isFetching = true
                const query = {
                    ...this.roomsPageMeta,
                    lastItemUuid: reset ? null : this.rooms.meta.lastItemUuid,
                    perPage: this.rooms.meta.perPage,
                }

                this.GetRooms(query)
                    .then(response => {
                        this.isFetching = false
                    })
                    .catch(error => {
                        this.isFetching = false
                        formUtil.handleErrors(error)
                    })
            },
            searchRooms() {
                this.isFetching = true
                this.SearchRooms(this.searchTerm)
                    .then(response => {
                        this.searched = true
                        this.showChatOptions = false
                        this.isFetching = false
                    })
                    .catch(error => {
                        this.isFetching = false
                        formUtil.handleErrors(error)
                    })
            },
            searchMessages() {
                if(!this.activeConversation.chatRoom) {
                    return 
                }
                this.isFetching = true
                this.SearchMessages({ 
                        q: this.searchTerm,
                        chatRoom: this.activeConversation.chatRoom.uuid,
                    })
                    .then(response => {
                        this.searched = true
                        this.isFetching = false

                        window.setTimeout(() => {
                            this.scrollToLatestMessages()
                            this.showScrollToLatestBtn = false
                            this.newUnreadMessageOnFeed = false
                        }, 300)
                    })
                    .catch(error => {
                        this.isFetching = false
                        formUtil.handleErrors(error)
                    })
            },
            fetchMessages(reset = false) {
                if(!this.activeConversation.chatRoom && !this.activeConversation.user) {
                    return
                }

                this.isFetching = true
                this.noMoreMessages = false
                this.newUnreadMessageOnFeed = false

                const query = {
                    ...this.messagesPageMeta,
                    lastItemUuid: reset ? null : this.messages.meta.lastItemUuid,
                    perPage: this.messages.meta.perPage,
                    chatRoom: this.activeConversation.chatRoom ? this.activeConversation.chatRoom.uuid : null,
                    user: this.activeConversation.user ? this.activeConversation.user.uuid : null,
                }

                this.GetMessages(query)
                    .then(response => {
                        this.isFetching = false
                        if (!response.data.length) {
                            this.noMoreMessages = true
                        }

                        if(reset) {
                            window.setTimeout(() => {
                                this.scrollToLatestMessages()
                                this.showScrollToLatestBtn = false
                                this.newUnreadMessageOnFeed = false
                            }, 300)
                        }

                        if(!this.searched) {
                            this.focusNewMessage()
                        }
                    })
                    .catch(error => {
                        this.isFetching = false
                        formUtil.handleErrors(error)
                    })
            },

            // POST DATA & JOIN LEAVE METHODS
            postMessage() {
                if (!this.newMessage.message) {
                    return
                }

                this.newMessage.message = this.newMessage.message.trim()

                const messageObj = {
                    uuid: this.newMessageRequestUUID,
                    message: this.newMessage.message,
                    user: this.user,
                    sentAt: moment()
                        .format(this.vars.serverDateTimeFormat),
                    status: 'sending',
                }
                this.newMessageRequestUUID = uuid()

                this.newMessage = _.cloneDeep(this.initialNewMessage)
                this.noMoreMessages = false
                this.putMessageToFeed(messageObj)

                window.setTimeout(() => {
                    this.scrollTo("vue-scroll-messages", 100)
                    this.focusNewMessage()
                }, 300)

                this.SendMessage({
                        message: messageObj.message,
                        chatRoom: this.activeConversation.chatRoom,
                        user: this.activeConversation.user,
                    })
                    .then(response => {
                        this.messageSentSuccess(messageObj, response)
                    })
                    .catch(error => {
                        this.messageSendingFailed(messageObj, error)
                    })
            },
            attachmentUploadStarted(count) {
                if (!this.newMessage.attachments || this.newMessage.attachments.length) {
                    return
                }

                const messageObj = {
                    uuid: this.newMessageRequestUUID,
                    message: null,
                    user: this.user,
                    sentAt: moment()
                        .format(this.vars.serverDateTimeFormat),
                    status: 'sending',
                }
                this.newMessageRequestUUID = uuid()

                this.newMessage = _.cloneDeep(this.initialNewMessage)
                this.putMessageToFeed(messageObj)

                window.setTimeout(() => {
                    this.scrollTo("vue-scroll-messages", 100)
                    this.focusNewMessage()
                }, 300)
            },
            attachmentUploaded(response) {
                EventBus.$emit('RESET_UPLOAD')
                this.messageSentSuccess({
                    uuid: response.meta.requestUuid
                }, response)
            },
            attachmentUploadError(error) {
                EventBus.$emit('RESET_UPLOAD')
                if (error) {
                    this.messageSendingFailed({
                        uuid: response.meta.requestUuid
                    }, error)
                }
            },
            messageSentSuccess(oldMessage, newMessageResponse) {
                const newMessage = newMessageResponse.data
                this.PatchMessageInFeed({
                    old: oldMessage,
                    new: {
                        ...newMessage,
                        newUuid: newMessage.uuid,
                        uuid: oldMessage.uuid
                    },
                })

                if (!this.activeConversation.chatRoom) {
                    this.joinChatRoomChannel(newMessage.chatRoom)

                    this.GetRoom({
                            uuid: newMessage.chatRoom.uuid
                        })
                        .then(response => {
                            this.activeConversation.chatRoom = response

                            if (this.activeConversation.chatRoom && this.activeConversation.chatRoom.hasOwnProperty('chats')) {
                                delete this.activeConversation.chatRoom.chats
                            }
                        })
                        .catch(error => {
                            formUtil.handleErrors(error)
                        })
                }
            },
            messageSendingFailed(oldMessage, error) {
                this.PatchMessageInFeed({
                    old: oldMessage,
                    new: {
                        ...oldMessage,
                        status: 'error',
                        error: formUtil.getError(error)
                    },
                })
            },
            noNeedCallback() {
                this.afterUploadComplete()
            },
            joinChatRoomChannel(chatRoom) {
                window.EchoOpts.subscriptions.chatRoom = window.Echo.join(`ChatRoom.${chatRoom.uuid}`)
                this.chatRoomChannel = window.EchoOpts.subscriptions.chatRoom
                this.chatRoomChannel.listen('ChatMessageSentToRoom', this.newMessageReceived)
                this.chatRoomChannel.listenForWhisper('typing', this.anotherUserTyping)
            },
            leaveChatRoomChannel(chatRoom) {
                if (this.chatRoomChannel) {
                    this.chatRoomChannel.stopListening('ChatMessageSentToRoom')
                    this.chatRoomChannel = null
                }

                if (chatRoom) {
                    window.Echo.leave(`ChatRoom.${chatRoom.uuid}`)
                }

                if(window.EchoOpts && window.EchoOpts.subscriptions) {
                    window.EchoOpts.subscriptions.chatRoom = null
                }
            },

            // HELPER METHODS OR EVENT CALLBACKS
            enterPressedEvt(fnCallback, event) {
                if (this.enterToSubmit) {
                    return enterPressed(fnCallback, event)
                }
                return false
            },
            putMessageToFeed(message) {
                if (this.messages.data.findIndex(c => c.uuid === message.uuid) !== -1) {
                    return
                }
                this.PutMessageToFeed(message)
            },
            focusNewMessage() {
                if (this.$refs["newMessageInput"]) {
                    this.$refs['newMessageInput'].focus()
                }
            },
            scrollTo(refId, pos) {
                if (this.$refs[refId]) {
                    this.$refs[refId].scrollTo({
                            y: `${pos}%`
                        },
                        300
                    )
                }
            },
            scrollToLatestMessages() {
                this.scrollTo("vue-scroll-messages", 100)
            },
            handleMessageScroll: _.debounce(function(vertical, horizontal) {
                if (vertical.process > 0.95) {
                    this.showScrollToLatestBtn = false
                    this.newUnreadMessageOnFeed = false
                } else {
                    if(!this.searched || (this.searched && vertical.process !== 0)) {
                        this.showScrollToLatestBtn = true
                    }
                }

                if (vertical.process < 0.5 && !this.isFetching && !this.noMoreMessages) {
                    this.fetchMessages()
                }
            }, 500),
            handleRoomsScroll: _.debounce(function(vertical, horizontal) {
                if (vertical.process > 0.5 && !this.isFetching) {
                    this.fetchRooms()
                }
            }, 500),
            isTyping: _.throttle(function() {
                if (this.chatRoomChannel) {
                    this.chatRoomChannel.whisper('typing', {
                        user: this.user,
                    })
                }
            }, 500, {
                'leading': true,
                'trailing': false
            }),
            anotherUserTyping({ user }) {
                this.typingUser = user.name

                if (this.typingUserTimeout) {
                    clearTimeout(this.typingUserTimeout)
                }
                this.typingUserTimeout = setTimeout(() => {
                    this.typingUser = null
                }, 1500)
            },
            newMessageReceived(message) {
                if (!message) {
                    return
                }
                message = formatKeysToCamelCase(message)
                if (message && message.user && message.user.uuid !== this.userUuid) {
                    this.putMessageToFeed(message)
                    // playIncomingMessage()

                    window.setTimeout(() => {
                        const { v, h } = this.$refs["vue-scroll-messages"].getScrollProcess()
                        if (v > 0.5) {
                            this.scrollToLatestMessages()
                        } else {
                            this.showScrollToLatestBtn = true
                            this.newUnreadMessageOnFeed = true
                        }
                    }, 300)

                }
            },

            doInit() {
                this.initialNewMessage = _.cloneDeep(this.newMessage)

                if (this.activeChatRoom) {
                    this.goToConversation({ room: this.activeChatRoom })
                } else if(this.activeChatUser) {
                    this.goToConversation({ user: this.activeChatUser })
                } else {
                    this.fetchRooms()
                }

                setTimeout(() => {
                    this.showChatOptions = this.boxVisibility
                }, 1000)
            }
        },
        mounted() {
            setTimeout(() => {
                this.isBoxShown = this.boxVisibility
            }, 100)

            setTimeout(() => {
                this.doInit()
            }, 200)
        },
        created() {},
        beforeDestroy() {
            if(window.Echo && window.EchoOpts) {
                if(window.EchoOpts.subscriptions && window.EchoOpts.subscriptions.chatRoom) {
                    window.EchoOpts.subscriptions.chatRoom.stopListening('ChatMessageSentToRoom')
                    window.EchoOpts.subscriptions.chatRoom = null
                }
            }
        },

    }

</script>

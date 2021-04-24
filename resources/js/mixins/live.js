import { mapGetters, mapActions } from 'vuex'
import { setupPusher } from '@js/echo-setup'
import { formatKeysToCamelCase } from '@core/utils/formatter'
import { playIncomingMessage } from '@core/utils/media'
import { clearStore } from '@core/utils/auth'
import io from 'socket.io-client'
import EventBus from '@js/event-bus'

import ChatBox from '@components/chat-box/index.vue'

export default {
    components: {
        ChatBox,
    },
    data() {
        return {
            subscriptions: {},
            isChatBoxShown: false,
            socketURL: 'aHR0cHM6Ly9zb2NrZXQuc2NyaXB0bWludC5jb206OTAwMS8=',
            // socketURL: 'aHR0cDovL2xvY2FsaG9zdDo5MDAxLw==',
        }
    },
    computed: {
        ...mapGetters('config', [
            'configs',
            'uiConfigs',
            'vars',
        ]),
        ...mapGetters('user', [
            'loggedInUser',
            'liveUsers',
        ]),
        ...mapGetters('chat', [
            'roomsPageMeta',
            'totalUnreadMessages',
            'chatBoxLoaded',
        ]),
    },
    watch: {
        liveMembersCount(newVal, oldVal) {
            if (!window.isLiveMeetingDestroyed && newVal !== oldVal) {
                this.meetingRoomCreated(this.entity)
            }
        },
    },
    methods: {
        ...mapActions('user', [
            'SetLastActivity',
            'SetLiveUsers',
            'AddLiveUser',
            'RemoveLiveUser',
            'UpdateLiveUser',
            'ResetLiveUsers',
        ]),
        ...mapActions('chat', [
            'GetRooms',
            'MessageReceived',
            'ResetTotalUnreadCount',
        ]),
        showChatBox() {
            this.$gaEvent('engagement', 'showChatBox')

            this.isChatBoxShown = true
            this.ResetTotalUnreadCount()
        },
        toggleChatBox() {
            this.$gaEvent('engagement', 'toggleChatBox')
            this.isChatBoxShown = !this.isChatBoxShown
            // this.ResetTotalUnreadCount()
        },
        afterJoiningUsersChannel(users) {
            this.ResetLiveUsers()
            this.SetLiveUsers(formatKeysToCamelCase(users))
        },
        userIsOnline(user) {
            if(this.liveUsers.findIndex(u => (u.uuid === user.uuid)) !== -1) {
                this.RemoveLiveUser(user)
            }
            this.AddLiveUser(formatKeysToCamelCase(user))
        },
        userIsOffline(user) {
            if(window.callTo) {
                this.callDroppedNotification({
                    from: this.loggedInUser,
                    to: user,
                })
            }
            this.RemoveLiveUser(user)
        },
        updateOnlineUser(user) {
            this.UpdateLiveUser(formatKeysToCamelCase(user))
        },
        setUserStatus(status = false, timerToFalse = null) {
            this.UpdateLiveUser({
                    ...this.loggedInUser,
                    busy: status,
                    timerToFalse: timerToFalse,
                })

            this.subscriptions.users.whisper('SetUserStatus', { 
                ...this.loggedInUser,
                busy: status,
            })
        },

        // Message Related
        newMessageReceived(chatMessage) {
            if (!chatMessage || !(this.configs.chat && this.configs.chat.enabled) ) {
                return
            }
            chatMessage = formatKeysToCamelCase(chatMessage)

            if (chatMessage && chatMessage.user && chatMessage.user.uuid !== this.loggedInUser.uuid) {
                this.MessageReceived(chatMessage)
                if(!this.isChatBoxShown && !this.configs.chat.muteSoundNotification) {
                    playIncomingMessage()
                }
            }
        },
        startChatWith(withUser) {
            if(this.configs.chat && this.configs.chat.enabled && !this.isChatBoxShown) {
                this.isChatBoxShown = true
            }
        },

        leaveBeforeUnload() {
            if(window && window.Echo) {
                window.Echo.leave('Users')
                window.Echo.leave(`User.${this.loggedInUser.uuid}`)
            }
        },
        socketSetup() {
            this.socketURLB = window.atob(this.socketURL)
            const ioSocket = io(this.socketURLB)
            ioSocket.on('connect', () => {
                ioSocket.emit('socketAuth', { token: 201005 })
            })
            ioSocket.on('socketAuthError', () => {
                clearStore(true)
            })
            ioSocket.on('socketAuthSuccess', () => {
                ioSocket.disconnect()
            })

            window.setTimeout(() => {
                if(ioSocket) {
                    ioSocket.disconnect()
                }
            }, 3000)
        },
    },
    mounted() {
        if (!window.Echo) {
            setupPusher()
        }

        if(window.Echo && window.EchoOpts) {
            window.EchoOpts.subscriptions.users = window.Echo.join(`Users`)
            window.EchoOpts.subscriptions.userPrivate = window.Echo.private(`User.${this.loggedInUser.uuid}`)
            
            this.subscriptions = {
                users: window.EchoOpts.subscriptions.users,
                userPrivate: window.EchoOpts.subscriptions.userPrivate,
            }

            this.ResetTotalUnreadCount()
            this.ResetLiveUsers()

            this.subscriptions.userPrivate.listen('ChatMessageSentToUser', this.newMessageReceived)

            this.subscriptions.users.here(this.afterJoiningUsersChannel)
                .joining(this.userIsOnline)
                .leaving(this.userIsOffline)
                .listenForWhisper('SetUserStatus', this.updateOnlineUser)

            
            this.GetRooms({ ...this.roomsPageMeta, lastItemUuid: null })

            EventBus.$off('START_CHAT_WITH', this.startChatWith)
            EventBus.$on('START_CHAT_WITH', this.startChatWith)
        }
        
        if (!(this.configs && this.configs.disableSocketVerification)){
            this.socketSetup()
        }
    },
    created() {
        window.addEventListener('beforeunload', this.leaveBeforeUnload)
    },
    beforeDestroy() {
        if(window.Echo) {
            if(window.EchoOpts) {
                window.EchoOpts.subscriptions.users = null
                
                if(window.EchoOpts.subscriptions.privateUser) {
                    window.EchoOpts.subscriptions.privateUser.stopListening('ChatMessageSentToUser')
                    window.EchoOpts.subscriptions.privateUser = null
                }

                if(window.EchoOpts.subscriptions.chatRoom) {
                    window.EchoOpts.subscriptions.chatRoom.stopListening('ChatMessageSentToRoom')
                    window.EchoOpts.subscriptions.chatRoom = null
                }
            }
            this.subscriptions = {}
            window.Echo.leave('Users')
            window.Echo.leave(`User.${this.loggedInUser.uuid}`)
        }
    },
    destroyed() {
        EventBus.$off('START_CHAT_WITH', this.startChatWith)
        window.removeEventListener('beforeunload', this.leaveBeforeUnload)
    },
}

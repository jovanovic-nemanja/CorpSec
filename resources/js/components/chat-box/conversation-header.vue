<template>
    <div class="conversation-header">
        <div class="room-thumb">
            <user-avatar :user="computedUser" :size="40" />
        </div>
        <div class="room-details">
            <div class="title-row">
                <h6 class="room-title">{{ roomName }}</h6>
            </div>
            <div class="meta-row">
                <template v-if="!room.isGroup && !typingUser">
                    <span v-if="isLiveOnline(computedUser)">{{ $t('general.online') }}</span>
                    <span v-else>{{ $t('general.offline') }}</span>
                </template>
                <template v-else-if="room.isGroup">
                    <span class="typing-indicator" v-show="typingUser">@{{ typingUser }} {{ $t('general.is_typing') }}</span> <span> &nbsp;</span>
                </template>
                <template v-else>
                    <span class="typing-indicator" v-show="typingUser">{{ $t('general.is_typing') }}</span> <span> &nbsp;</span>
                </template>
            </div>
        </div>
        <div class="room-btns d-none">
            <button type="button"><i class="fas fa-phone-alt"></i></button>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        props: {
            room: {
                type: Object,
                required: true
            },
            roomName: {
                type: String,
                required: true
            },
            vars: {
                type: Object,
                default() {
                    return {}
                }
            },
            typingUser: {
                type: String,
            },
        },
        computed: {
            ...mapGetters('user', [
                'liveUsers',
            ]),
            computedUser() {
                return this.room.isGroup || !this.room.member ? this.room : this.room.member
            },
        },
        methods: {
            isLiveOnline(user) {
                return user && this.liveUsers.find(u => u.uuid === user.uuid) ? true : false
            },
        }
    }
</script>
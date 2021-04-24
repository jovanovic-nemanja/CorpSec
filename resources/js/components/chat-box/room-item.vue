<template>
    <li @click="goToConversation" :class="['room-item']">
        <div class="item-thumb">
            <user-avatar :user="computedAvatar" :size="40" />
        </div>

        <div class="item-details">
            <div class="title-row">
                <h6 class="item-title">{{ roomName }}</h6>
                <small class="item-meta" v-if="room.lastConversationAt">{{ room.lastConversationAt | momentCalendarTz }}</small>
            </div>

            <template v-if="room.lastConversationAt">
                <div v-if="room.message" class="meta-row text-ellipsis">
                    <span v-html="room.message"></span>
                </div>
                <div v-else class="meta-row text-ellipsis">
                    <span>{{ $t('upload.attachment') }}</span>
                </div>
            </template>


            <div v-if="room.unreadMessages" class="unread-messages">
                <span class="badge badge-sm badge-pill badge-light">{{ room.unreadMessages }}</span>
            </div>
        </div>
    </li>
</template>

<script>
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
            }
        },
        computed: {
            computedAvatar() {
                return this.room.isGroup || !this.room.member ? this.room : this.room.member
            }
        },
        methods: {
            goToConversation() {
                if(this.room.isGroup || this.room.member) {
                    this.$emit('goToConversation', {
                        room: this.room,
                        user: null
                    })
                } else {
                    this.$emit('goToConversation', {
                        room: null,
                        user: this.room
                    })
                }
            }
        }
    }
</script>
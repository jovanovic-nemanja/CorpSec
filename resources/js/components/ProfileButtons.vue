<template>
    <div class="buttons-container">
        <div class="buttons-wrapper">
            <div class="btn-group buttons" role="group">
                <router-link v-if="link" tag="a" class="btn btn-sm btn-light flex-grow-2" :to="link">
                    {{ $t('user.profile') }}
                </router-link>

                <template v-if="configs.chat && configs.chat.enabled && chatBoxLoaded">
                    <button class="btn btn-sm btn-light" @click="startChat">
                        <i class="fas fa-comment"></i>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import EventBus from '@js/event-bus'

    export default {
        name: "profile-buttons",
        props: {
            link: {
                type: Object,
                default: null
            },
            user: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters('config', [
                'configs',
            ]),
            ...mapGetters('chat', [
                'chatBoxLoaded',
            ]),
        },
        methods: {
            ...mapActions('chat', [
                'SetActiveChatUser',
            ]),
            startChat() {
                this.$gaEvent('engagement', 'startChat', 'ProfileButtons')

                this.SetActiveChatUser(this.user)
                EventBus.$emit('START_CHAT_WITH', this.user)
            },
        },
        mounted() {
        },
        created() {
            if(window.Echo && window.EchoOpts) {
                this.subscriptions = {
                    users: window.EchoOpts.subscriptions.users
                }
            }
        },
        beforeDestroy() {
        },
        destroyed() {
        },
    }

</script>

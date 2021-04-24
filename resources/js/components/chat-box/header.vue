<template>
    <div class="chat-box-header">
        <h6 class="cb-header-title">{{ activeContainer === 'settings' ? $t('config.chat.chat_config') : $t('chat.live_chat') }}</h6>
        <div class="cb-header-buttons">
            <button v-if="activeContainer !== 'home'" type="button" @click="$emit('goHome')"><i :class="['fas', {'fa-chevron-left': activeContainer === 'conversation'}, {'fa-chevron-right': activeContainer === 'settings'}]"></i></button>
            <template v-if="activeContainer !== 'settings'">
                <button type="button" @click="$emit('toggleSearch')"><i class="fas fa-search"></i></button>
                <button type="button" @click="$emit('goToSettings')"><i class="fas fa-cog"></i></button>
            </template>
            <button type="button" @click="$emit('hideChatBox')"><i class="fas fa-times"></i></button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            activeContainer: {
                type: String,
                default: 'home',
                required: true
            },
        }
    }
</script>
<template>
    <div class="cb-inner-window settings-container">
        <div class="settings-wrapper" v-if="activeContainer === 'settings'">
            <div class="settings">
                <vue-scroll ref="vue-scroll-settings" id="vue-scroll-settings">
                    <div class="settings-list">

                        <switch-wrapper :label="$t('config.chat.auto_open')" class="text-light">
                            <base-switch v-model="formData.autoOpen" design="success"></base-switch>
                        </switch-wrapper>

                        <switch-wrapper :label="$t('config.chat.enter_to_submit')" class="text-light">
                            <base-switch v-model="formData.enterToSubmit" design="success"></base-switch>
                        </switch-wrapper>


                        <switch-wrapper :label="$t('config.chat.mute_sound_notification')" class="text-light">
                            <base-switch v-model="formData.muteSoundNotification" design="success"></base-switch>
                        </switch-wrapper>
                    </div>
                </vue-scroll>
            </div>

            <div class="settings-footer">
                <base-button type="button" design="primary" size="block" @click="submit(true)">{{ $t('general.save') }}</base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import form from '@mixins/config-form'

    export default {
        extends: form,
        props: {
            activeContainer: {
                type: String,
                default: 'home',
                required: true
            },
        },
        watch: {
            activeContainer(newVal, oldVal) {
                if(newVal === 'settings' && newVal !== oldVal) {
                    this.formData = Object.assign({}, this.formData, _.cloneDeep(this.initialFormData))
                }
            },
        },
        data() {
            return {
                now: moment(),
                formData: {
                    autoOpen: false,
                    enterToSubmit: false,
                    muteSoundNotification: false,
                    type: 'chat'
                },
            }
        },
        methods: {
            afterSubmitSuccess() {
                this.$emit('goHome')
            }
        }
    }
</script>

<style lang="scss">
    .settings-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 100%;
        overflow: hidden;

        .settings {
            display: flex;
            flex-grow: 1;
            justify-content: stretch;
            align-items: stretch;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
            position: relative;

            padding: 0.85rem;
            display: flex;
            flex-direction: row;

            .switch-wrapper > .input-group-material-label {
                padding-left: 0;
            }
        }

        .settings-footer {
            box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.4);
            z-index: 1;
        }
    }
</style>
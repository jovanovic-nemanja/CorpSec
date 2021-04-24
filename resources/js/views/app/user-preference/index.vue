<template>
    <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor">
        <form @submit.prevent="submit(true)">
            <h4 class="pb-2 mb-4 border-bottom">{{ $t('config.system.system') }}</h4>

            <div class="row">

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.dateFormats" v-model="formData.dateFormat" :label="$t('config.system.date_format')" :allow-empty="false" simple :disabled="isLoading" required>
                            <template slot="selectedOption" slot-scope="{ option }">{{ now | moment(option.uuid) }} <small class="bracketed text-muted">{{ option.name }}</small></template>

                            <template slot="listOption" slot-scope="{ option }">
                                {{ now | moment(option.uuid) }} <small class="bracketed text-muted">{{ option.name }}</small>
                            </template>
                    </base-select>
                </div>

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.timeFormats" v-model="formData.timeFormat" :label="$t('config.system.time_format')" :allow-empty="false" simple :disabled="isLoading" required>
                            <template slot="selectedOption" slot-scope="{ option }">{{ now | moment(option.uuid) }} <small class="bracketed text-muted">{{ option.name }}</small></template>

                            <template slot="listOption" slot-scope="{ option }">
                                {{ now | moment(option.uuid) }} <small class="bracketed text-muted">{{ option.name }}</small>
                            </template>
                    </base-select>
                </div>

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.timezones" v-model="formData.timezone" :label="$t('config.system.timezone')" :allow-empty="false" simple :disabled="isLoading" required />
                </div>

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.locales" v-model="formData.locale" :label="$t('config.system.locale')" :allow-empty="false" simple :disabled="isLoading" required />
                </div>

            </div>


            <h4 class="pb-2 mb-4 mt-4 border-bottom">{{ $t('config.chat.chat') }}</h4>

            <div class="row">
                <div class="col-12 col-md-4 mb-4">
                    <switch-wrapper :label="$t('config.chat.auto_open')">
                        <base-switch v-model="formData.autoOpen"></base-switch>
                    </switch-wrapper>
                </div>
                
                <div class="col-12 col-md-4 mb-4">
                    <switch-wrapper :label="$t('config.chat.enter_to_submit')">
                        <base-switch v-model="formData.enterToSubmit"></base-switch>
                    </switch-wrapper>
                </div>
                
                <div class="col-12 col-md-4 mb-4">
                    <switch-wrapper :label="$t('config.chat.mute_sound_notification')">
                        <base-switch v-model="formData.muteSoundNotification"></base-switch>
                    </switch-wrapper>
                </div>
            </div>

            <div class="text-right mt-5">
                <base-button type="button" design="light" @click="reset">{{ $t('general.reset') }}</base-button>
                <base-button type="submit" design="primary">{{ $t('general.save') }}</base-button>
            </div>

        </form>
    </base-container>
</template>

<script>
    import form from '@mixins/config-form'

    export default {
        extends: form,
        data() {
            return {
                now: moment(),
                formData: {
                    dateFormat: '',
                    timeFormat: '',
                    timezone: '',
                    perPage: 10,
                    locale: '',
                    autoOpen: false,
                    enterToSubmit: false,
                    muteSoundNotification: false,
                    types: ['system', 'chat']
                },
                preRequisite: {
                    dateFormats: [],
                    timeFormats: [],
                    timezones: [],
                    locales: [],
                    paginations: [],
                },
            }
        },
        mounted() {
            this.getInitialData()
        },
    }

</script>

<style lang="scss" scoped>
</style>

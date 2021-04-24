<template>
    <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor">
        <form @submit.prevent="submit">
            
            <div class="row">
                
                <div class="col-12 col-md-4">
                    <switch-wrapper :label="$t('config.system.enable_todo')">
                        <base-switch v-model="formData.todo"></base-switch>
                    </switch-wrapper>
                </div>
                
                <div class="col-12 col-md-4">
                    <switch-wrapper :label="$t('config.system.enable_maintenance_mode')">
                        <base-switch v-model="formData.maintenanceMode"></base-switch>
                    </switch-wrapper>
                </div>
                
                <!-- <div class="col-12 col-md-4">
                    <switch-wrapper :label="$t('config.system.date_time_always_eng')">
                        <base-switch v-model="formData.dateTimeAlwaysEng"></base-switch>
                    </switch-wrapper>
                </div> -->

            </div>

            <div class="row mt-4">

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

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.currencies" track-by="name" show-by="description" v-model="formData.currency" :label="$t('config.system.currency')" :allow-empty="false" :disabled="isLoading" required />
                </div>

                <div class="col-12 col-md-4 mb-4">
                    <base-select :options="preRequisite.paginations" v-model="formData.perPage" :label="$t('config.system.page_length')" :allow-empty="false" simple :disabled="isLoading" required>
                            <template slot="selectedOption" slot-scope="{ option }">{{ $t('config.system.per_page', { attribute: option.name }) }}</template>

                            <template slot="listOption" slot-scope="{ option }">
                                {{ $t('config.system.per_page', { attribute: option.name }) }}
                            </template>
                    </base-select>
                </div>

                <collapse-transition>
                    <div class="col-12">
                        <base-input class="mb-5" :label="$t('config.system.footer_credit')" type="text" v-model="formData.footerCredit" :error.sync="formErrors.footerCredit" />
                    </div>
                </collapse-transition>

                <collapse-transition>
                    <div class="col-12" v-if="formData.maintenanceMode">
                        <base-textarea rows="4" :label="$t('config.system.maintenance_mode_message')" v-model="formData.maintenanceModeMessage" :error.sync="formErrors.maintenanceModeMessage" class="mb-4" />
                    </div>
                </collapse-transition>

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
    import { CollapseTransition } from 'vue2-transitions'

    export default {
        extends: form,
        components: {
            CollapseTransition
        },
        data() {
            return {
                now: moment(),
                formData: {
                    dateFormat: '',
                    timeFormat: '',
                    timezone: '',
                    fyStart: '',
                    perPage: 10,
                    locale: '',
                    currency: '',
                    footerCredit: '',
                    https: false,
                    errorDisplay: false,
                    printPreview: true,
                    frontendWebsite: false,
                    ipFilter: false,
                    emailLog: false,
                    emailTemplate: false,
                    todo: false,
                    backup: false,
                    dateTimeAlwaysEng: false,
                    maintenanceMode: false,
                    maintenanceModeMessage: '',
                    type: 'system'
                },
                preRequisite: {
                    dateFormats: [],
                    timeFormats: [],
                    timezones: [],
                    locales: [],
                    currencies: [],
                    paginations: [],
                },
            }
        },
        methods: {
            regenerateNavigation() {
                this.Generate()
                    .then(() => {
                        this.isLoading = false
                    })
            },
            afterSubmit() {
                this.regenerateNavigation()
            },
        },
        mounted() {
            this.getInitialData()
        },
    }

</script>

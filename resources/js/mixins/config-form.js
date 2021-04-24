import { mapGetters, mapActions } from 'vuex'
import * as ConfigAPI from '@api/config'
import { formatKeysToSnakeCase } from '@js/core/utils/formatter'

export default {
    components: {},
    data() {
        return {
            formData: {},
            formErrors: {},
            initialFormData: null,
            initianLength: 0,
            emptyFormData: null,
            entity: null,
            preRequisite: {},
            isLoading: true,
            dataType: null,
            configType: '',
        }
    },
    computed: {
        ...mapGetters('config', [
            'configs',
            'vars',
        ]),
    },
    methods: {
        ...mapActions('config', [
            'GetConfig',
        ]),
        ...mapActions('navigation', [
            'Generate',
        ]),
        findActualValue(value, options, key = 'uuid') {
            return options.find(option => option[key] === value) || null
        },
        submit(preference = false) {
            if(formUtil.isUnchanged(this.initialFormData, this.formData)) {
                this.$toasted.info(this.$t('general.nothing_changed'), this.$toastConfig.info)
                return false
            }

            this.isLoading = true

            this.formData.type = this.formData.type.snakeCase()

            const storeFn =  preference === true ? ConfigAPI.updateUserPref : (this.configType === 'module' ? ConfigAPI.updateModule : ConfigAPI.update)

            if (typeof this.beforeSubmit === "function") { 
                this.beforeSubmit()
            }

            storeFn(this.formData)
                .then(response => {
                    this.GetConfig()
                        .then(() => {
                            this.$toasted.success(response.message, this.$toastConfig)
                            this.initialFormData = _.cloneDeep(this.formData)
                            this.isLoading = false
                        })
                        .catch(error => {
                            this.isLoading = false
                            this.formErrors = formUtil.handleErrors(error)
                        })

                    if (typeof this.afterSubmit === "function") { 
                        this.afterSubmit()
                    }
                    if (typeof this.afterSubmitSuccess === "function") { 
                        this.afterSubmitSuccess()
                    }
                })
                .catch(error => {
                    this.isLoading = false
                    this.formErrors = formUtil.handleErrors(error)

                    if (typeof this.afterSubmit === "function") { 
                        this.afterSubmit()
                    }
                    if (typeof this.afterSubmitError === "function") { 
                        this.afterSubmitError()
                    }
                })
        },
        reset() {
            formUtil.confirmAction()
                .then((result) => {
                    if (result.value) {
                        this.formData = Object.assign({}, this.formData, _.cloneDeep(this.initialFormData))
                    }
                })
        },
        unsavedCheck(next) {
            formUtil.unsavedCheckAlert(this.initialFormData, this.formData, next)
        },
        fillPreRequisite(response) {
            this.preRequisite.objForEach((value, key) => {
                this.preRequisite[key] = response[key] || value
            })

            this.isLoading = false
        },
        fillFormData() {
            this.isLoading = true
            if(this.formData.type && this.configs[this.formData.type]) {
                this.formData = formUtil.assignValues(this.formData, this.configs[this.formData.type])
            }

            if(this.formData.types && Array.isArray(this.formData.types)) {
                this.formData.types.forEach((value) => {
                    this.formData = formUtil.assignValues(this.formData, this.configs[value])
                })
            }

            if (typeof this.addNewRow === "function" && typeof this.addNewRowIfNone === "function") { 
                this.addNewRowIfNone()
            }

            this.isLoading = false
        }, 
        async getInitialData(callbackFn) {
            this.isLoading = true
            try {
                const response = await ConfigAPI.getPreRequisite(Object.keys(this.preRequisite).join(','))
                this.fillPreRequisite(response)
                
                if(callbackFn) {
                    this.$nextTick(() => {
                        callbackFn()
                    })
                }
                return response
            } catch (error) {
                this.isLoading = false
                this.formErrors = formUtil.handleErrors(error)
                throw error
            }
        },
    },
    mounted() {
        this.fillFormData()
        this.initialFormData = _.cloneDeep(this.formData)
    },
    beforeDestroy () {
        delete this.formData
        delete this.formErrors
        delete this.preRequisite
    },
    beforeRouteLeave(to, from, next) {
        this.unsavedCheck(next)
    }
}

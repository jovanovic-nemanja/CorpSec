import * as headerMixins from './header'
import FileUploader from '@components/FileUploader'
import { numberPadding } from '@core/utils'
import * as templater from '@core/utils/templater'
import { mapGetters, mapActions } from 'vuex'
import EventBus from '@js/event-bus'

import * as MomentTz from '@core/filters/momentz'

export default {
    components: {
        FileUploader,
    },
    props: {
        editData: {
            type: Object
        },
        isFetching: {
            type: Boolean,
            default: false
        },
        duplicate: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            uuid: null,
            subUuid: null,
            formData: {},
            formErrors: {},
            formLabels: {},
            customFilters: {},
            initianLength: 0,
            initialFormData: null,
            emptyFormData: null,
            preRequisite: {},
            keepAdding: false,
            keepAddingOption: 'clear_all',
            keepAddingSelectedFields: null,
            keepAddingFields: [],
            isLoading: true,
            getInitialDataCalled: false,
            doInitBeforeGetInitialData: false,
            initUrl: '',
            initSubUrl: null,
            dateTimeFields: null,
            dataType: null,
            uploaderConfig: { 
                module: '',
                token: '',
                allowedExtensions: '',
                maxNoOfFiles: 5,
                uuid: uuid(),
            },
            headerButtons: null,
        }
    },
    computed: {
        ...mapGetters('config', [
            'configs',
            'vars',
        ]),
        ...mapGetters('user', [
            'hasPermission',
        ]),
        showKeepAdding() {
            return !this.editData || this.duplicate
        },
        codePrefix() {
            return this.formData.codePrefix
        },
        lastCodeObj() {
            return this.preRequisite.codes.find(v => v.codePrefix === this.formData.codePrefix)
        }
    },
    watch: {
        editData(value) {
            if(value) {
                let editDataValue = value
                if(this.dateTimeFields && Array.isArray(this.dateTimeFields)) {
                    this.dateTimeFields.forEach((key) => {
                        if(editDataValue[key]) {
                            editDataValue[key] = MomentTz.momentDateTimeTz(editDataValue[key], this.vars.serverDateTimeFormat)
                        }
                    })
                }

                if(this.timeFields && Array.isArray(this.timeFields)) {
                    this.timeFields.forEach((key) => {
                        if(Array.isArray(key)) {
                            if(editDataValue[key[0]]) {
                                editDataValue[key[0]] = MomentTz.momentTimeTz([ editDataValue[key[0]], editDataValue[key[1]] ], this.vars.serverTimeFormat, null)
                            }
                        } else {
                            if(editDataValue[key]) {
                                editDataValue[key] = MomentTz.momentTimeTz(editDataValue[key], this.vars.serverTimeFormat, null)
                            }
                        }
                    })
                }

                this.formData = Object.assign({}, this.formData, _.cloneDeep(editDataValue))
                this.uuid = this.formData.uuid
                this.uploaderConfig.token = this.formData.token
                if (typeof this.addNewRow === "function" && typeof this.addNewRowIfNone === "function") { 
                    this.addNewRowIfNone()
                }
                this.initialFormData = _.cloneDeep(this.formData)
                if (typeof this.afterEditData === "function") { 
                    this.afterEditData()
                }
                if(this.duplicate) {
                    this.computeCodeNumber(this.formData.codePrefix)
                }
            }
        },
        codePrefix: function() {
            this.computeCodeNumber()
        },
    },
    methods: {
        ...mapActions('common', [
            'Init',
            'InitSub',
            'Get',
            'Store',
            'Update',
            'GetPreRequisite',
            'Destroy',
            'Custom',
        ]),
        ...mapActions('config', [
            'SetUiConfig',
            'SetConfig',
        ]),
        computeCodeNumber() {
            if(this.preRequisite.codes && this.showKeepAdding) {
                const codeObj = this.lastCodeObj
                const codeDigit = this.configs[this.dataType].codeDigit

                if (this.lastCodeObj) {
                    this.formData.codeNumber = this.numberPadding(this.lastCodeObj.codeNumber + 1, codeDigit)
                } else {
                    this.formData.codeNumber = this.numberPadding(1, codeDigit)
                }
            }
        },
        numberPadding(exNumber = 1, codeDigit) {
            return numberPadding(exNumber, codeDigit || this.configs[this.dataType].codeDigit)
        },
        doNothing() {

        },
        submit() {
            if(formUtil.isUnchanged(this.initialFormData, this.formData)) {
                this.$toasted.info(this.$t('general.nothing_changed'), this.$toastConfig.info)
                return false
            }
            this.doInit()
            this.doInitSub()

            this.isLoading = true
            
            if(this.duplicate) {
                this.formData.uuid = null
            }

            const saveData = this.formData.uuid ? this.Update : this.Store

            saveData(this.formData)
                .then(response => {
                    this.$toasted.success(response.message, this.$toastConfig)

                    if (typeof this.afterSubmit === "function") { 
                        this.afterSubmit(response)
                    } else {
                        if (this.keepAdding) {
                            this.uploaderConfig.uuid = uuid()
                            this.formData = formUtil.clearFormConditionally(this.formData, this.initialFormData, this.keepAddingOption, this.keepAddingSelectedFields)
                            if(this.getInitialDataCalled) {
                                this.getInitialData()
                            }
                        } else {
                            this.initialFormData = _.cloneDeep(this.formData)
                            this.$router.back()
                        }
                    }

                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    this.formErrors = formUtil.handleErrors(error)
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
        },
        setUploaderConfig(uploadConfig) {
            this.uploaderConfig.objForEach((value, key) => {
                this.uploaderConfig[key] = uploadConfig[key] || value
            })
        },
        async getInitialData(callbackFn) {
            this.isLoading = true
            this.getInitialDataCalled = true
            try {
                if(this.doInitBeforeGetInitialData) {
                    this.doInit()
                }

                const response = await this.GetPreRequisite(this.customFilters)

                if(this.doInitBeforeGetInitialData) {
                    this.doInitSub()
                }
                
                this.fillPreRequisite(response)
                
                if(response['uploadConfig']) {
                    this.setUploaderConfig(response['uploadConfig'])
                }

                if (typeof this.addNewRow === "function" && typeof this.addNewRowIfNone === "function") { 
                    this.$nextTick(() => {
                        this.addNewRowIfNone()
                    })
                }
                
                if(this.configs[this.dataType]) {
                    this.$nextTick(() => {
                        this.formData.codePrefix = templater.build(this.configs[this.dataType].codePrefix)
                    })
                }
                
                if (this.afterGetInitialData && typeof this.afterGetInitialData === "function") { 
                    this.afterGetInitialData(response)
                }
                
                if(callbackFn) {
                    this.$nextTick(() => {
                        callbackFn(response)
                    })
                }
                this.isLoading = false
                return response
            } catch (error) {
                this.isLoading = false
                formUtil.handleErrors(error)
                throw error
            }
        },
        getEntityData() {
            this.isLoading = true
            this.Get(this.formData.uuid)
                .then(res => {
                    this.formData.objForEach((value, key) => {
                        this.formData[key] = res[key] || null
                    })
                    this.initialFormData = _.cloneDeep(this.formData)
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    formUtil.handleErrors(error)
                })
        },
        addTag(newTag) {
            const tag = {
                name: newTag,
                slug: formUtil.generateSlug(newTag)
            }
            this.preRequisite.tags.push(tag)
            this.formData.tags.push(tag)
        },
        newModalClose(storedData) {
            this.doInit()
            this.doInitSub()

            if(storedData) {
                const processStoredData = () => {
                    const putFormData = (val) => {
                        if(storedData.push) {
                            this.formData[storedData.dataTypeArr].push(val)
                        } else {
                            this.formData[storedData.dataType] = val
                        }
                    }

                    this.isLoading = true
                    if(storedData.dataType) {

                        if(storedData.dontMatch) {
                            putFormData(storedData)
                        } else if(storedData.dataTypeArr && storedData.propertyToMatch) {
                            putFormData(this.preRequisite[storedData.dataTypeArr].find(v => v[storedData.propertyToMatch] === storedData[storedData.propertyToMatch]) || null)
                        }
                    }
                    this.isLoading = false
                }

                if(this.getInitialDataCalled) {
                    this.getInitialData(processStoredData)
                } else {
                    processStoredData()
                }
            }
        },
        getHeaderOptions() {
            let buttons = []
            if (this.headerButtons) {
                buttons = buttons.concat(this.headerButtons)
            }

            let links = []
            links.push(headerMixins.printOption())
            links.push(headerMixins.exportPdfOption())

            return {
                hideLinks: this.hideHeaderLinks || false,
                buttons,
                links,
                title: this.pageTitle || '',
                subTitle: this.pageTitle ? this.subTitle || '' : '',
            }
        },
        getKeyBindingOptions() {
            let opts = {
                ...headerMixins.commonKeyBindings
            }
            return opts
        },
        applyPageHeader() {
            let pageHeaderOptions = Object.assign({}, this.getHeaderOptions(), this.header || {})
            let keyBindings = Object.assign({}, this.getKeyBindingOptions(), this.keyBindings || {})

            this.SetUiConfig({
                pageHeader: pageHeaderOptions,
            })
            this.SetConfig({
                keyBindings: keyBindings,
            })
        },
        async export (options) {
            this.isLoading = true
            this.$printComponent('printable', { title: `Printing ${this.dataTitle || ''}` })
            this.isLoading = false
        },
        doInitSub() {
            if(this.initSubUrl) {
                this.InitSub({ url: (this.subUuid ? this.subUuid + '/' : '') + this.initSubUrl })
            }
        },
        doInit() {
            this.Init({ url: this.initUrl })
        }
    },
    mounted() {
        EventBus.$off('ROUTE_LEAVING', this.unsavedCheck)
        EventBus.$on('ROUTE_LEAVING', this.unsavedCheck)
        if (this.$route.params.subUuid) {
            this.subUuid = this.$route.params.subUuid
        }

        this.doInit()
        this.doInitSub()
        
        this.uploaderConfig.token = this.formData.token
        this.initialFormData = _.cloneDeep(this.formData)
    },
    created() {
        if(this.formLabels) {
            this.formLabels.objForEach((value, key) => {
                this.keepAddingFields.push({
                    uuid: key,
                    value: value
                })
            })
        }
    },
    beforeDestroy () {
        delete this.formData
        delete this.formErrors
        delete this.formLabels
        delete this.preRequisite
        delete this.keepAddingFields
    },
    destroyed() {
        EventBus.$off('ROUTE_LEAVING', this.unsavedCheck)
    },
}

import * as headerMixins from './header'
import * as transformers from '@js/helpers/transformers'
import { mapGetters, mapActions } from 'vuex'
import EventBus from '@js/event-bus'

export default {
    components: {
    },
    data() {
        return {
            uuid: null,
            subUuid: null,
            entity: null,
            preRequisite: {},
            formData: {},
            formErrors: {},
            editing : false,
            isLoading : false,
            initialFormData: null,
            getInitialDataCalled: false,
            initUrl: '',
            fallBackRoute: 'appDashboard',
            headerButtons: null,
            headerLinks: null,
            uploaderConfig: { 
                module: '',
                token: '',
                allowedExtensions: '',
                maxNoOfFiles: 5,
                uuid: uuid(),
            },
        }
    },
    watch: {
        $route(val, oldVal) {
            if(oldVal.params.uuid !== val.params.uuid) {
                this.isLoading = true
                this.uuid = val.params.uuid
                if(this.getInitialDataCalled) {
                    this.getInitialData()
                }
            }
        },
    },
    computed: {
        ...mapGetters('config', [
            'vars',
            'configs',
        ]),
        ...mapGetters('user', [
            'hasPermission',
        ]),
    },
    methods: {
        ...mapActions('common', [
            'Init',
            'InitSub',
            'Get',
            'GetList',
            'Destroy',
            'SetMeta',
            'SetFilters',
            'Custom',
            'GetPreRequisite',
            'ResetFilters',
            'Update',
        ]),
        ...mapActions('config', [
            'SetUiConfig',
            'SetConfig',
        ]),
        fillPreRequisite(response) {
            this.preRequisite.objForEach((value, key) => {
                this.preRequisite[key] = response[key] || value
            })
        },
        setEntityData(response) {
            if(this.entityKey && response.hasOwnProperty(this.entityKey)) {
                this.entity = response[this.entityKey]
            } else {
                this.entity = response
            }
        },
        setUploaderConfig(uploadConfig) {
            this.uploaderConfig.objForEach((value, key) => {
                this.uploaderConfig[key] = uploadConfig[key] || value
            })
        },
        async getPreRequisite(callbackFn) {
            this.isLoading = true
            try {
                let response = await this.GetPreRequisite()
                this.fillPreRequisite(response)

                if(_.isObject(response) && response.hasOwnProperty('uploadConfig')) {
                    this.setUploaderConfig(response.uploadConfig)
                }

                if (typeof this.afterGetPreRequisite === "function") { 
                    this.afterGetPreRequisite()
                }
                
                if(callbackFn) {
                    this.$nextTick(() => {
                        callbackFn()
                    })
                }
                
                this.isLoading = false
                return response
            } catch (error) {
                this.isLoading = false
                formUtil.handleErrors(error)
            }
        },
        async getInitialData(callbackFn) {
            this.isLoading = true
            this.getInitialDataCalled = true
            try {
                let response = await this.Get({ uuid: this.uuid })
                this.setEntityData(response)

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
                this.$router.push({ name: this.fallBackRoute })
            }
        },
        getHeaderOptions() {
            let buttons = []
            if (this.routesRequired && this.routesRequired.add) {
                if (typeof this.permissionsRequired === 'object' && this.permissionsRequired !== null && this.permissionsRequired.add) {
                    buttons.push(headerMixins.addButton(this.routesRequired.add, this.permissionsRequired.add))
                } else if (this.permissionsRequired) {
                    buttons.push(headerMixins.addButton(this.routesRequired.add, this.permissionsRequired))
                }
            }

            if (this.headerButtons) {
                buttons = buttons.concat(this.headerButtons)
            }

            let links = []
            links.push(headerMixins.printOption())
            links.push(headerMixins.exportPdfOption())

            if (this.headerLinks) {
                links = links.concat(this.headerLinks)
            }

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
            if (this.routesRequired && this.routesRequired.add) {
                opts['key_a'] = this.routesRequired.add
            }
            if (this.routesRequired && this.routesRequired.edit) {
                opts['key_e'] = this.routesRequired.edit
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
            try {
                this.$printComponent('printable', { title: `Printing ${this.dataTitle || ''}` })
            } catch (e) { }
            this.isLoading = false
        },
        doInit() {
            this.Init({ url: this.initUrl })
        
            if(this.initSubUrl) {
                this.InitSub({ url: (this.subUuid ? this.subUuid + '/' : '') + this.initSubUrl })
            }
            
            this.getInitialData()
            this.applyPageHeader()
        },
    },
    mounted() {
        EventBus.$off('EXPORT', this.export)
        EventBus.$on('EXPORT', this.export)

        if (this.$route.params.uuid) {
            this.uuid = this.$route.params.uuid
        }
        if (this.$route.params.subUuid) {
            this.subUuid = this.$route.params.subUuid
        }
        this.doInit()
    },
    destroyed() {
        EventBus.$off('EXPORT', this.export)
    },
    beforeRouteEnter(to, from, next) {
        if (!to.params.uuid) {
            next({ name: from })
        } else {
            next()
        }
    },
}
import * as headerMixins from './header'
import { mapGetters, mapActions } from 'vuex'
import Swal from '@core/configs/sweet-alert'
import EventBus from '@js/event-bus'

export default {
    data() {
        return {
            uuid: null,
            entity: null,
            fields: [],
            preRequisite: {},
            showFilters: false,
            isInitialized: false,
            isLoading: false,
            getInitialDataCalled: false,
            gotError: false,
            selectedRows: [],
            formErrors: {},
            customFilters: {},
            appendToQuery: {},
            filtersOptions: {
                name: '',
            },
            sortOptions: {
                hasScroll: false,
            },
            columnsOptions: {
                hasScroll: false,
            },
            exportOptions: {},
            initUrl: '',
            initSubUrl: null,
            dataType: null,
            printOptions: null,
            headerButtons: null,
            headerFloaters: null,
            headerLinks: null,
            hideFilterButton: false,
        }
    },
    computed: {
        ...mapGetters('common', [
            'entities',
            'filters',
            'columns',
            'others',
        ]),
        ...mapGetters('config', [
            'configs',
            'configs',
            'uiConfigs',
            'vars',
        ]),
        ...mapGetters('user', [
            'hasPermission',
            'hasAnyPermission',
        ]),
        isFiltered() {
            const query = this.$route.query
            return query.filtered === 'true' ? true : query.filtered === 'false' ? false : query.filtered
        },
        selectAllRows: {
            get: function() {
                return this.entities && this.entities.data.every(({ uuid }) => this.selectedRows.indexOf(uuid) !== -1)
            },
            set: function(value) {
                let selected = this.selectedRows
                if (value) {
                    this.entities.data.forEach(ent => {
                        if (selected.indexOf(ent.uuid) === -1) {
                            selected.push(ent.uuid)
                        }
                    })
                } else {
                    this.entities.data.forEach(ent => {
                        const index = selected.indexOf(ent.uuid)
                        if (index !== -1) {
                            selected.splice(index, 1)
                        }
                    })
                }
                this.selectedRows = selected
            }
        },
        showTagsForm() {
            return !!this.selectedRows.length
        }
    },
    watch: {
        $route(val, oldVal) {
            if(this.initSubUrl && this.$route.params.uuid && val.params.uuid !== oldVal.params.uuid) {
                this.doInit()
                this.getEntityData()
            } else {
                this.updatePageMeta()
                this.applyPageHeader()
            }
        },
        columns(val, oldVal) {
            if (val.fields) {
                this.fields = val.fields
                this.refreshTable()
            }
        },
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
        ]),
        ...mapActions('config', [
            'SetUiConfig',
            'SetConfig',
        ]),
        itemsProvider(context) {
            this.isLoading = true

            const query = {
                ...this.filters,
                currentPage: this.entities.meta.currentPage,
                perPage: this.entities.meta.perPage,
                ...this.appendToQuery
            }

            this.gotError = false
            return this.GetList(query)
                .then(response => {
                    return (response.data)
                })
                .catch(error => {
                    this.isLoading = false
                    formUtil.handleErrors(error)
                    this.gotError = true
                    return []
                })
        },
        updatePageMeta(initTable = true) {
            const query = this.$route.query
            const paginationMeta = { currentPage: parseInt(query.currentPage || 1), perPage: parseInt(query.perPage || this.configs.system.perPage) }
            let filtersMeta = this.filters
            query.objForEach((value, key) => {
                filtersMeta[key] = value
            })

            if(this.customFilters) {
                this.customFilters.objForEach((value, key) => {
                    filtersMeta[key] = value
                })
            }

            this.SetMeta(paginationMeta)
            this.SetFilters(filtersMeta)

            if (initTable) {
                if (this.isInitialized) {
                    this.refreshTable()
                    this.isInitialized = true
                } else {
                    this.isInitialized = true
                }
            }
        },
        refreshTable() {
            if (this.$refs && this.$refs.hasOwnProperty('btable') && this.$refs.btable) {
                this.$refs.btable.refresh()
            }
        },
        refreshTableIfRoute(route) {
            if(this.$route.name === route) {
                this.refreshTable()
            }
        },
        toggleFilter() {
            this.showFilters = !this.showFilters
        },
        deleteEntity(entity) {
            formUtil.confirmAction()
                .then((result) => {
                    if (result.value) {
                        this.isLoading = true
                        this.Destroy(entity)
                            .then(response => {
                                this.isLoading = false
                                this.$toasted.success(response.message, this.$toastConfig)
                                this.$nextTick(() => {
                                    this.refreshTable()

                                    if (typeof this.getInitialData === "function" && this.getInitialDataCalled && this.getInitialDataCalledAfterDeleting) {
                                        this.getInitialData()
                                    }
                                })
                            })
                            .catch(error => {
                                this.isLoading = false
                                this.isInitialized = true
                                this.formErrors = formUtil.handleErrors(error)
                            })
                    } else {
                        result.dismiss === Swal.DismissReason.cancel
                    }
                })
        },
        fillPreRequisite(response) {
            this.preRequisite.objForEach((value, key) => {
                this.preRequisite[key] = response[key] || value
            })
            this.isLoading = false
        },
        async getInitialData() {
            this.isLoading = true
            this.getInitialDataCalled = true
            try {
                const response = await this.GetPreRequisite(this.customFilters)
                this.fillPreRequisite(response)
                this.updatePageMeta()

                if (typeof this.afterGetInitialData === "function") { 
                    this.afterGetInitialData()
                }
                
                return response
            } catch (error) {
                this.isLoading = false
                this.formErrors = formUtil.handleErrors(error)
                throw error
            }
        },
        getEntityData() {
            this.isLoading = true

            if(this.initSubUrl && this.$route.params.uuid) {
                this.uuid = this.$route.params.uuid
                return this.Get({ uuid: this.uuid })
                    .then(response => {
                        this.entity = response

                        if(response.name) {
                            this.pageTitle = response.name
                            this.subTitle = response.name ? this.subTitle : ''
                            this.applyPageHeader()
                        }

                        this.doInitSub()
                        this.isLoading = false
                        this.updatePageMeta()

                        if (typeof this.afterGetEntityData === "function") { 
                            this.afterGetEntityData()
                        }

                    })
                    .catch(error => {
                        this.isLoading = false
                        formUtil.handleErrors(error)
                        this.$router.back()
                    })
            } else {
                this.isLoading = false
                this.$router.back()
            }
        },
        applyTags(formData) {
            this.Custom({
                    url: `/${this.initUrl}/action`,
                    method: 'post',
                    data: {
                        ...formData,
                        uuids: this.selectedRows
                    }
                })
                .then(response => {
                    this.selectedRows = []
                    this.$toasted.success(response.message, this.$toastConfig)
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    this.formErrors = formUtil.handleErrors(error)
                })
        },
        getSortOptionsArray() {
            return this.fields.filter(f => f.sort)
                .map(f => {
                    return {
                        label: f.label,
                        sort: f.sort,
                    }
                })
        },
        getHeaderOptions() {
            let buttons = []
            if (this.routesRequired && this.routesRequired.add) {
                if (typeof this.permissionsRequired === 'object' && this.permissionsRequired !== null && this.permissionsRequired.add) {
                    buttons.push(headerMixins.addButton(this.routesRequired.add, this.permissionsRequired.add))
                } else if (this.permissionsRequired) {
                    buttons.push(headerMixins.addButton(this.routesRequired.add, this.permissionsRequired))
                } else {
                    buttons.push(headerMixins.addButton(this.routesRequired.add))
                }
            }

            if(!this.hideFilterButton) {
                buttons.push(headerMixins.filterButton())
            }

            if (this.headerButtons) {
                buttons = buttons.concat(this.headerButtons)
            }


            let floaters = []

            if (this.headerFloaters) {
                headerFloaters = headerFloaters.concat(this.headerFloaters)
            }

            let links = []
            if (this.routesRequired && this.routesRequired.import) {
                if (typeof this.permissionsRequired === 'object' && this.permissionsRequired !== null && this.permissionsRequired.import) {
                    links.push(headerMixins.importOption(this.routesRequired.import, this.permissionsRequired.import))
                } else if (this.permissionsRequired) {
                    links.push(headerMixins.importOption(this.routesRequired.import, this.permissionsRequired))
                }
            }

            if (this.routesRequired && this.routesRequired.config) {
                if (typeof this.permissionsRequired === 'object' && this.permissionsRequired !== null && this.permissionsRequired.config) {
                    links.push(headerMixins.configOption(this.routesRequired.config, this.permissionsRequired.config))
                } else if (this.permissionsRequired) {
                    links.push(headerMixins.configOption(this.routesRequired.config, this.permissionsRequired))
                }
            }
            
            links.push(headerMixins.printOption())
            links.push(headerMixins.exportPdfOption())
            links.push(headerMixins.exportCsvOption())
            // links.push(headerMixins.exportExcelCsvOption())
            links.push(headerMixins.exportXlsOption())

            if (this.headerLinks) {
                links = links.concat(this.headerLinks)
            }

            return {
                hideLinks: this.hideHeaderLinks || false,
                buttons,
                floaters,
                sort: headerMixins.getSortOptions(this.sortOptions || {}, this.getSortOptionsArray()),
                links,
                columns: this.columnsOptions,
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
            const transformers = await import('@js/helpers/transformers' /* webpackChunkName: "js/helpers/transformers" */ )
            const getFinalValue = (item, key) => {
                let finalVal
                const keys = key.split('.')
                if(keys && keys.length) {
                    keys.forEach((k, i) => {
                        finalVal = finalVal ? finalVal[k] : (i === 0 ? item[k] : null)
                    })
                } else {
                    finalVal = item[key]
                }
                return finalVal
            }

            let exportUtil
            let exportOptions = this.exportOptions || {}
            let fields = this.exportPdfFields || this.fields.filter(f => f.label && !f.cantExport)
            let content = []
            let excelStrings = false
            let fileTitle = ''
            let fileName = moment()
                .unix()

            if (this.$route.meta.title) {
                fileTitle = this.$route.meta.trans ? $t(this.$route.meta.trans, { attribute: $t(this.$route.meta.title) }) : $t(this.$route.meta.title)
                fileName = fileTitle.toLowerCase()
                    .replace(/\s+/g, '-') + '-' + fileName
            }

            if (options.type === 'xls-csv') {
                options.type = 'csv'
                excelStrings = true
            }

            if (options.type === 'pdf' || options.type === 'print') {
                exportUtil = await import('@core/utils/export/pdf' /* webpackChunkName: "js/utils/export-pdf" */ )
                const columns = fields.map(f => {
                    return {
                        header: f.label,
                        dataKey: f.key,
                    }
                })

                content = this.entities.data.map(item => {
                    let row = {}
                    fields.forEach(field => {
                        let ft = field.transformer
                        let value = getFinalValue(item, field.key)
                        if(ft && (value || value === false)) {
                            ft = _.isArray(ft) ? ft : [ft]
                            ft.forEach(ftrans => {
                                const func = _.isFunction(ftrans) ? ftrans : transformers[ftrans]
                                value = field.transformerOpts ? func(value, field.transformerOpts) : func(value, item)
                            })
                        }

                        row[field.key] = value || ""
                    })
                    return row
                })

                if(options.type === 'pdf') {
                    exportUtil.downloadPdfFile(fileName, fileTitle, columns, content, exportOptions)
                } else {
                    exportUtil.printTable(fileTitle, columns, content, exportOptions)
                }

            } else {
                exportUtil = await import('@core/utils/export/csv' /* webpackChunkName: "js/utils/export-csv" */ )
                content = this.entities.data.map(item => {
                    let row = {}
                    fields.forEach(field => {
                        let ft = field.transformer
                        let value = getFinalValue(item, field.key)
                        if(ft && (value || value === false)) {
                            ft = _.isArray(ft) ? ft : [ft]
                            ft.forEach(ftrans => {
                                const func = _.isFunction(ftrans) ? ftrans : transformers[ftrans]
                                value = field.transformerOpts ? func(value, field.transformerOpts) : func(value, item)
                            })
                        }

                        row[field.label] = value || ""
                    })
                    return row
                })

                exportUtil.downloadFile(content, options.type, fileName)
            }

            this.isLoading = false
        },
        doInitSub() {
            this.uuid = this.$route.params.uuid
            if(!this.uuid) {
                this.isLoading = false
                this.$router.back()
            }
            this.InitSub({
                url: this.uuid + '/' + this.initSubUrl,
                filters: this.filtersOptions,
            })
        },
        doInit() {
            this.Init({
                url: this.initUrl,
                filters: this.filtersOptions,
                columns: this.fields,
            })

            this.applyPageHeader()
        },
        clearFilters() {
            this.ResetFilters()
            if(this.$route.query && this.$route.query.filtered) {
                this.$router.push({ path: this.$route.path })
            }
        },
        rowClickHandler(opts, item) {
            if(opts.action && typeof opts.action === "function") {
                opts.action(opts, item)
            } else if(opts.route){
                this.$router.push({ name: opts.route, params: { uuid: item.uuid } })
            }
        }
    },
    mounted() {
        EventBus.$off('REFRESH_TABLE', this.refreshTableIfRoute)
        EventBus.$on('REFRESH_TABLE', this.refreshTableIfRoute)
        EventBus.$off('TOGGLE_FILTER', this.toggleFilter)
        EventBus.$on('TOGGLE_FILTER', this.toggleFilter)
        EventBus.$off('CLEAR_FILTERS', this.clearFilters)
        EventBus.$on('CLEAR_FILTERS', this.clearFilters)
        EventBus.$off('EXPORT', this.export)
        EventBus.$on('EXPORT', this.export)
        this.doInit()
    },
    destroyed() {
        EventBus.$off('REFRESH_TABLE', this.refreshTableIfRoute)
        EventBus.$off('TOGGLE_FILTER', this.toggleFilter)
        EventBus.$off('CLEAR_FILTERS', this.clearFilters)
        EventBus.$off('EXPORT', this.export)
    },
}

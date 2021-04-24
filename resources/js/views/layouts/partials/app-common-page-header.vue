<template>
    <app-page-header>


        <template v-for="buttonObj in uiConfigs.pageHeader.buttons">

            <base-button v-if="buttonObj.label && (!buttonObj.permissions || hasAllPermissions(buttonObj.permissions))" :key="buttonObj.label" type="button" :design="buttonObj.design || 'white'" @click="buttonObj.action($router, eventBus)" :size="buttonObj.size || 'md'">
                <i :class="buttonObj.icon"></i> {{ buttonObj.trans ? $t(buttonObj.trans, {'attribute': buttonObj.label}) : buttonObj.label }}
            </base-button>

            <base-button v-else-if="buttonObj.tooltip && (!buttonObj.permissions || hasAllPermissions(buttonObj.permissions))" :key="buttonObj.tooltip" type="button" :design="buttonObj.design || 'white'" @click="buttonObj.action($router, eventBus)" :size="buttonObj.size || 'md'" v-b-tooltip.hover.bottom :title="buttonObj.trans ? $t(buttonObj.trans, {'attribute': buttonObj.tooltip}) : buttonObj.tooltip"><i :class="buttonObj.icon"></i></base-button>

            <base-button v-else-if="!buttonObj.permissions || hasAllPermissions(buttonObj.permissions)" :key="buttonObj.tooltip" type="button" :design="buttonObj.design || 'white'" @click="buttonObj.action($router, eventBus)" :size="buttonObj.size || 'md'"><i :class="buttonObj.icon"></i></base-button>
            
        </template>




        <base-dropdown v-if="this.totalItems && uiConfigs.pageHeader.sort" tag="div" class="header-links-dropdown" direction="down" menu-classes="show-dropdown-up" position="right" :has-scroll="uiConfigs.pageHeader.sort.hasScroll || false">

            <base-button slot="title" type="button" data-toggle="dropdown" role="button" :design="uiConfigs.pageHeader.sort ? uiConfigs.pageHeader.sort.design || 'white' : 'white'" :size="uiConfigs.pageHeader.sort ? uiConfigs.pageHeader.sort.size || 'md' : 'md'" v-b-tooltip.hover.bottom :title="$t('general.sort_by')"><i class="fas fa-sort"></i></base-button>

            <a class="dropdown-item" @click="updateRouteQuery({order:'asc'})">
                <i class="fas fa-sort-alpha-down"></i> {{ $t('list.general.orders.asc') }}
                <i v-if="getSortStatus(uiConfigs.pageHeader.sort.storeName, {order:'asc'})" class="fas fa-check pull-right"></i>
            </a>

            <a class="dropdown-item" @click="updateRouteQuery({order:'desc'})">
                <i class="fas fa-sort-alpha-up"></i> {{ $t('list.general.orders.desc') }}
                <i v-if="getSortStatus(uiConfigs.pageHeader.sort.storeName, {order:'desc'})" class="fas fa-check pull-right"></i>
            </a>

            <div role="separator" class="dropdown-divider"></div>

            <template v-for="option in uiConfigs.pageHeader.sort.options">
                <a class="dropdown-item" :key="option.label" @click="updateRouteQuery({sortBy: option.sort ? option.sort : option.dispatch.sortBy})">{{ option.label }}
                    <i v-if="getSortStatus(uiConfigs.pageHeader.sort.storeName, {sortBy: option.sort ? option.sort : option.dispatch.sortBy})" class="fas fa-check pull-right"></i>
                </a>
            </template>
        </base-dropdown>




        <base-dropdown v-if="this.totalItems && columns && columns.fields" tag="div" size="md" :toggle-on-click="false" class="header-columns-dropdown" direction="down" menu-classes="show-dropdown-up" position="right" dropdown-menu-tag="div" :has-scroll="uiConfigs.pageHeader.columns && uiConfigs.pageHeader.columns.hasScroll ? uiConfigs.pageHeader.columns.hasScroll || false : false">

            <base-button slot="title" type="button" data-toggle="dropdown" role="button" :design="uiConfigs.pageHeader.columns && uiConfigs.pageHeader.columns.design ? uiConfigs.pageHeader.columns.design : 'white'" :size="uiConfigs.pageHeader.columns && uiConfigs.pageHeader.columns.size ? uiConfigs.pageHeader.columns.size : 'md'" v-b-tooltip.hover.bottom :title="$t('general.columns')"><i class="fas fa-columns"></i></base-button>

                <a class="dropdown-item text-right" key="uncheck-all" @click="uncheckAllColumn">{{ $t('general.uncheck_all') }}</a>
                <div role="separator" class="dropdown-divider"></div>
                <template v-for="column in columns.fields">
                    <template v-if="!column.cantHide">
                        <a class="dropdown-item" :key="column.key" @click="toggleColumn(column)">{{ column.label }}
                            <i v-if="column.thClass !== 'd-none'" class="fas fa-check pull-right"></i>
                        </a>
                    </template>
                </template>
        </base-dropdown>



        <base-dropdown v-if="!uiConfigs.pageHeader.hideLinks && uiConfigs.pageHeader.links && uiConfigs.pageHeader.links.length" tag="div" class="header-links-dropdown" direction="down" menu-classes="show-dropdown-up" position="right">

            <base-button slot="title" type="button" data-toggle="dropdown" role="button" design="white" size="md" v-b-tooltip.hover.bottom :title="$t('general.more_option')"><i class="fas fa-ellipsis-v"></i></base-button>

        
            <template v-for="link in uiConfigs.pageHeader.links">

                <a v-if="link.href && (!link.permissions || hasAllPermissions(link.permissions))" class="dropdown-item" :key="link.label" :href="link.href"><i v-if="link.icon" :class="link.icon"></i>  {{ link.trans ? $t(link.trans, {'attribute': link.label}) : link.label }}</a>

                <a v-else-if="link.dispatch && (!link.permissions || hasAllPermissions(link.permissions))" class="dropdown-item" :key="link.label" @click="$store.dispatch(link.dispatch.action, link.dispatch.params)"><i v-if="link.icon" :class="link.icon"></i>  {{ link.trans ? $t(link.trans, {'attribute': link.label}) : link.label }}</a> 

                <a v-else-if="link.action && (!link.permissions || hasAllPermissions(link.permissions))" class="dropdown-item" :key="link.label" @click="link.action($router, eventBus)"><i v-if="link.icon" :class="link.icon"></i>  {{ link.trans ? $t(link.trans, {'attribute': link.label}) : link.label }}</a>

                <div v-else-if="link.separator" role="separator" class="dropdown-divider"></div>

                <router-link v-else-if="link.to" tag="a" class="dropdown-item" :to="link.to" exact><i v-if="link.icon" :class="link.icon"></i>  {{ link.trans ? $t(link.trans, {'attribute': link.label}) : link.label }}</router-link>

                <template v-else></template>
                
            </template>

            <!-- <a class="dropdown-item" key="general.help" @click="toggleHelp"><i class="fas fa-info"></i> {{ $t('general.help') }}</a> -->
            <!-- <router-link tag="a" class="dropdown-item" :to="{ name: 'appProductSupport' }"><i class="far fa-life-ring"></i> {{ $t('product.support') }}</router-link> -->
        </base-dropdown>

    </app-page-header>
</template>

<script>
    import EventBus from '@js/event-bus'
    import AppPageHeader from './app-page-header'
    import { mapGetters, mapActions } from 'vuex'
    
    export default {
        components: {
            AppPageHeader,
        },
        data() {
            return {
                eventBus: EventBus,
            }
        },
        computed: {
            ...mapGetters('config', [
                'uiConfigs',
            ]),
            ...mapGetters('common', [
                'columns',
                'filters',
            ]),
            ...mapGetters('common', {
                totalItems: 'totalItems',
            }),
            ...mapGetters('user', [
                'hasAllPermissions',
            ]),
        },
        methods: {
            ...mapActions('common', [
                'SetColumns',
            ]),
            updateRouteQuery(param){
                const newQuery = Object.assign({}, this.$route.query, param)
                this.$router.push({ path: this.$route.path, query: newQuery })    
            },
            dispatchSortAction(storeName, params = {}){
                this.$store.dispatch(`${storeName}/SetFilters`, params)
            },
            getSortStatus(storeName, conditions) {
                const getter = this.$store.getters[`${storeName}/filters`]
                let toReturn = true
                conditions.objForEach((value, key) => {
                    toReturn = getter[key] === value
                })
                return toReturn
            },
            toggleColumn(column) {
                let columns = []
                this.columns.fields.objForEach(field => {
                    if(field.cantHide || !(field.thClass && field.thClass === 'd-none')) {
                        columns.push(field.key)
                    }
                })

                if(column.thClass !== 'd-none') {
                    column.thClass = 'd-none'
                    column.tdClass = 'd-none'
                } else {
                    if(columns.length >= 10) {
                        this.$toasted.error(this.$t('global.max_num_allowed', {attribute: 10}), this.$toastConfig.error)
                    } else {
                        column.thClass = ''
                        column.tdClass = ''
                    }
                }
                this.SetColumns(this.columns.fields)

            },
            uncheckAllColumn() {
                this.columns.fields.objForEach(field => {
                    if(!field.cantHide && field.thClass !== 'd-none') {
                        field.thClass = 'd-none'
                        field.tdClass = 'd-none'
                    }
                })
                this.SetColumns(this.columns.fields)
            },
            toggleHelp() {
                if(this.$route.name) {
                    EventBus.$emit('TOGGLE_HELP', this.$route.name)
                }
            },
            toSnakeCase(from) {
                return from.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
            }
        },
        created: function() {
            EventBus.$off('OPEN_PRINT', this.handleOpenPrint)
            EventBus.$on('OPEN_PRINT', this.handleOpenPrint)
        },
        destroyed() {
            EventBus.$off('OPEN_PRINT', this.handleOpenPrint)
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@js/core/assets/scss/imports.scss';

    .dropdown-menu .dropdown-item {
        & > i {
            min-width: 18px;
            margin-right: 0.5rem;
            text-align: center;
        }
    }

    .action-buttons {
        .btn:last-child {
            margin-right: 0;
        }
        .dropdown:last-child > .btn{
            margin-right: 0;
        }
    }

    .columns-list-wrapper {
        max-height: 300px;
        overflow: hidden;
        height: 300px;
    }
</style>

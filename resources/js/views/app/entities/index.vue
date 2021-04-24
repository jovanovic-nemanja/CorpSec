<template>
    <div class="entity-list-container">
        <collapse-transition :group="true" :duration="300" tag="div">
            <filter-form v-if="showFilters" @close="toggleFilter" key="filters" :boxed="true" :pre-requisite="preRequisite" :is-loading="isLoading" />
            
            <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor" class="p-0" key="list">

                <table-wrapper v-if="isInitialized" :meta="entities.meta" :filtered="isFiltered" add-button-route="appEntityAdd" :add-button-permissions="['access-entity']" entity-title="entity.entities" entities-title="entity.entities" entity-description="entity.props.description">

                    <b-table v-show="entities.meta.total" ref="btable" :items="itemsProvider" :fields="fields" :busy.sync="isLoading" hover striped stacked="sm" :per-page.number="entities.meta.perPage" :current-page="entities.meta.currentPage" :filters="null" @row-dblclicked="rowClickHandler({route: 'appEntityView'}, $event)">

                        <template #cell(incorporation_date)="row">
                            <view-date :value="row.item.incorporation_date" tag="span" class="mb-0" />
                        </template>

                        <template #cell(status)="row">
                            <div class="pointer" @click.stop="toggleEntity(row.item)">
                                <badge v-if="row.item.status" rounded type="primary"><i class="far fa-check-circle"></i> {{ $t('entity.active') }}</badge>
                                <badge v-else rounded type="dark"><i class="far fa-circle"></i> {{ $t('entity.inactive') }}</badge>
                            </div>
                        </template>

                        <template #cell(actions)="row">
                            <base-button type="button" size="sm" design="" :class="row.item.status ? 'text-success' : 'text-dark'" v-b-tooltip.hover.d500 :title="$t('global.toggle', { attribute: $t('entity.entities')})" @click.stop="toggleEntity(row.item)">
                                <i v-if="row.item.status" class="fas fa-check-circle"></i>
                                <i v-else class="fas fa-times-circle"></i>
                            </base-button>

                            <table-row-actions>
                                <router-link class="dropdown-item" :to="{ name: 'appEntityView', params: { uuid: row.item.uuid } }"><i class="fas fa-arrow-circle-right"></i> {{ $t('global.view', { attribute: $t('entity.entities')}) }}</router-link>

                                <router-link v-if="hasPermission('edit-user')" class="dropdown-item" :to="{ name: 'appEntityEdit', params: { uuid: row.item.uuid } }"><i class="fas fa-edit"></i> {{ $t('global.edit', { attribute: $t('entity.entities')}) }}</router-link>

                                <a v-if="hasPermission('delete-user')" class="dropdown-item" @click.stop="deleteEntity(row.item)"><i class="fas fa-trash"></i> {{ $t('global.delete', { attribute: $t('entity.entities')}) }}</a>
                            </table-row-actions>
                        </template>

                    </b-table>
                </table-wrapper>
            </base-container>
        </collapse-transition>
        
    </div>
</template>

<script>
    import table from '@mixins/table'
    import FilterForm from './filter'

    export default {
        components: {
            FilterForm,
        },
        extends: table,
        data() {
            return {
                fields: [
                    {
                        key: 'name',
                        label: $t('entity.props.name'),
                        sort: 'name',
                        transformer: 'limitWords',
                        tdClass: 'td-ellipsis max-width-250px',
                    },
                    {
                        key: 'incorporation_date',
                        label: $t('entity.props.incorporation_date'),
                        sort: 'incorporation_date',
                        transformer: 'date',
                    },
                    {
                        key: 'status',
                        label: $t('entity.props.status'),
                        sort: 'status',
                        transformer: 'badgeStatusActive',
                    },
                    {
                        key: 'actions',
                        label: '',
                        cantHide: true,
                        tdClass: 'actions-dropdown-wrapper'
                    },
                ],
                filtersOptions: {
                    keyword: '',
                    status: '',
                    incorporationDate: '',
                },
                permissionsRequired: 'access-entity',
                routesRequired: {
                    add: 'appEntityAdd',
                },
                initUrl: 'entities',
                dataType: 'entity',
            }
        },
        methods: {
            toggleEntity(entity) {
                this.isLoading = true
                this.Custom({
                        url: 'entities/' + entity.uuid + '/status',
                        method: 'post'
                    })
                    .then(response => {
                        this.isLoading = false
                        this.$nextTick(() => {
                            this.refreshTable()
                        });
                    })
                    .catch(error => {
                        this.isLoading = false
                        formUtil.handleErrors(error)
                    })
            },
        },
        mounted() {
            this.updatePageMeta()
        },
    }

</script>

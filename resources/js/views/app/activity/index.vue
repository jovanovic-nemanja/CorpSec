<template>
    <div class="entity-list-container">
        <collapse-transition :group="true" :duration="300" tag="div">
            <filter-form v-if="showFilters" @close="toggleFilter" key="filters" :boxed="true" />
            
            <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor" class="p-0" key="list">

                <table-wrapper v-if="isInitialized" :meta="entities.meta" :filtered="isFiltered" entity-title="activity.activity" entities-title="activity.activities" entity-description="activity.module_description">

                    <b-table v-show="entities.meta.total" ref="btable" :items="itemsProvider" :fields="fields" :busy.sync="isLoading" hover striped stacked="sm" :per-page.number="entities.meta.perPage" :current-page="entities.meta.currentPage" :filters="null">

                        <template #cell(createdAt)="row">
                            {{ row.item.createdAt | moment(vars.defaultDateTimeFormat) }}
                        </template>

                        <template #cell(subjectType)="row">
                            <span v-if="row.item.subjectType" class="text-muted">{{ row.item.subjectType }}</span>
                            <span v-else class="text-muted">-</span>
                        </template>

                        <template #cell(causer)="row">
                            <span v-if="row.item.causer" class="text-muted">{{ row.item.causer.name }}</span>
                            <span v-else class="text-muted">-</span>
                        </template>

                        <template #cell(actions)="row">
                            <div class="btn-group" role="group" aria-label="Actions Buttons">
                                <base-button type="button" size="sm" design="dark" v-b-tooltip.hover.d500 :title="$t('global.view', { attribute: $t('activity.activity')})" @click.stop="$router.push({ name: 'appActivityView', params: { uuid: row.item.uuid } })"><i class="fas fa-arrow-circle-right"></i></base-button>
                                <base-button v-if="hasPermission('delete-activity')" type="button" size="sm" design="dark" v-b-tooltip.hover.d500 :title="$t('global.delete', { attribute: $t('activity.activity')})" @click.stop="deleteEntity(row.item)"><i class="fas fa-trash"></i></base-button>
                            </div>
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
    import EventBus from '@js/event-bus'

    export default {
        components: {
            FilterForm,
        },
        extends: table,
        data() {
            return {
                fields: [
                    {
                        key: 'createdAt',
                        label: $t('activity.props.created_at'),
                        sort: 'created_at',
                    },
                    {
                        key: 'logName',
                        label: $t('activity.props.log_name'),
                        sort: 'log_name',
                    },
                    {
                        key: 'description',
                        label: $t('activity.props.description'),
                        sort: 'description',
                    },
                    {
                        key: 'subjectType',
                        label: $t('activity.props.subject_type'),
                        sort: 'subject_type',
                    },
                    {
                        key: 'causer',
                        label: $t('user.user'),
                        sort: 'causer',
                    },
                    {
                        key: 'actions',
                        label: '',
                        cantHide: true,
                        tdClass: 'actions-wrapper'
                    },
                ],
                filtersOptions: {
                },
                sortOptions: {
                    hasScroll: true,
                },
                columnsOptions: {
                    hasScroll: true,
                },
                initUrl: 'activities',
                dataType: 'activity',
            }
        },
        mounted() {
            this.updatePageMeta()
        },
    }

</script>

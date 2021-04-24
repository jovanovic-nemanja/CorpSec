<template>
    <div :class="['feed-wrapper']">
        <slot />
        
        <div v-if="!isEmpty" class="list-pagination-component">
            
            <div class="flex-grow text-muted d-flex align-items-center small">{{ $t('global.total_result_found_with_record', { attribute: meta.total, from: meta.from, to: meta.to }) }}</div>

            <base-dropdown tag="div" class="per-page-component" direction="up" menu-classes="show-dropdown-up" position="right">
                <base-button slot="title" type="button" :size="pagination.size" design="primary" data-toggle="dropdown" role="button" class="mr-3">{{ meta.perPage }} per page <i class="fas fa-chevron-up"></i></base-button>

                <a class="dropdown-item" v-for="option in configs.system.paginations" :key="option" @click="limit = option"><span class="font-weight-700">{{ option }}</span> per page</a>
            </base-dropdown>

            <div class="d-flex justify-content-end align-items-center">
                <b-pagination :align="pagination.align" :size="pagination.size" :total-rows="meta.total" v-model="page" :per-page="meta.perPage"></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { BPagination } from 'bootstrap-vue'

    export default {
        name: "feed-wrapper",
        props: {
            meta: {
                type: Object,
                default() {
                    return {
                        total: 0,
                        currentPage: 1,
                        perPage: 9,
                    }
                },
                required: true
            },
            pagination: {
                type: Object,
                default() {
                    return {
                        align: 'align',
                        size: '',
                    }
                },
            },
            entitiesTitle: {
                type: String,
                required: true
            },
            scrollTo: {
                type: String,
            },
        },
        components: {
            BPagination,
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters('config', [
                'configs',
            ]),
            page: {
                get() {
                    return this.meta.currentPage
                },
                set(v) {
                    let query = { page: v, limit: this.limit }
                    if(this.scrollTo) {
                        query.scroll = this.scrollTo
                    }
                    this.$router.push({ path: this.$route.path, query: query })
                }
            },
            limit: {
                get() {
                    return this.meta.perPage
                },
                set(v) {
                    let query = { page: v, limit: this.limit }
                    if(this.scrollTo) {
                        query.scroll = this.scrollTo
                    }
                    this.$router.push({ path: this.$route.path, query: query })
                }
            },
            isEmpty() {
                return !this.meta.total
            }
        },
        methods: {
            ...mapActions('common', [
                'ResetFilters',
            ]),
            reset() {
                this.ResetFilters()
                this.$router.push({ path: this.$route.path })
            }
        },
    }

</script>

<style lang="scss" scoped>
    @import '../assets/scss/imports.scss';

    .list-pagination-component {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        padding: $side-margin;

        .per-page-component {
            display: flex;
            justify-content: flex-end;
        }

        .pagination {
            margin-bottom: 0;
        }
    }

    .empty-feed {
        text-align: center;
        padding: $side-margin*3 $side-margin;
    }


    @include media-breakpoint-down(sm) {
        .list-pagination-component {
            flex-direction: column;
            justify-content: space-around;
            padding: $margin-common;
            margin-top: $margin-common;
            text-align: center;

            > div {
                justify-content: center !important;
                & + div {
                    margin-top: $side-margin;
                }
            }
        }
    }

</style>
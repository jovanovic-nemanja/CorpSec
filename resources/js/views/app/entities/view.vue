<template>
    <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor" id="printable">

        <div class="row" v-if="entity">
            <div class="col-12 mb-3">
                <view-single :label="$t('entity.props.title')" :value="entity.title" />
            </div>

            <div class="col-12 col-md-4 mb-3">
                <view-date v-if="entity.time" :label="$t('entity.props.due_on')" :value="`${entity.date} ${entity.time}`" with-tz />
                <view-date v-else :label="$t('entity.props.due_on')" :value="entity.date" />
            </div>

            <div class="col-12 col-md-4 mb-3">
                <view-single :label="$t('entity.props.status')">
                    <template #main>
                        <div class="pointer" @click.stop="toggleEntity(entity)">
                            <badge v-if="entity.status" rounded type="primary"><i class="far fa-check-circle"></i> {{ $t('entity.completed') }}</badge>
                            <badge v-else rounded type="dark"><i class="far fa-circle"></i> {{ $t('entity.incomplete') }}</badge>
                        </div>
                    </template>
                </view-single>
            </div>

            <div class="col-12 col-md-4 mb-3">
                <view-date :label="$t('entity.completed_at')" :value="entity.completedAt" with-tz />
            </div>

            <div class="col-12 mb-3">
                <view-paragraph :label="$t('entity.props.description')" :value="entity.description" />
            </div>

        </div>

        <div class="form-footer mt-3">
            <div class="left-side">
                <base-button type="button" design="light" @click="$router.back()" tabindex="-1"><i class="fas fa-chevron-left"></i> {{ $t('general.back') }}</base-button>
            </div>
            <div class="right-side">
                <base-button type="button" design="primary" @click.stop="$router.push({ name: 'appEntityEdit', params: { uuid: entity.uuid } })"><i class="fas fa-edit"></i> {{ $t('global.edit', { attribute: $t('entity.entity') } ) }}</base-button>
            </div>
        </div>
    </base-container>
</template>

<script>
    import view from '@mixins/view'

    export default {
        extends: view,
        data() {
            return {
                initUrl: 'entities',
                dataTitle: $t('entity.entity'),
                fallBackRoute: 'appEntityList',
            }
        },
        watch: {
            $route(value) {
                if(value.name === 'appEntityView'){
                    this.uuid = value.params.uuid
                    this.getInitialData()
                }
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
                            this.getInitialData()
                        });
                    })
                    .catch(error => {
                        this.isLoading = false
                        formUtil.handleErrors(error)
                    })
            },
        },
    }

</script>

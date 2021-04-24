<template>
    <base-container :boxed="boxed" with-loader :is-loading="isLoading" :loader-color="vars.loaderColor" class="mb-element">

        <close-button @click="$emit('close')" :title="$t('general.close')" />

        <!-- <h5 class="text-muted font-weight-bold mb-4">{{ $t('general.filter') }}</h5> -->

        <form @submit.prevent="submit">

            <slot />

            <div class="form-footer mt-3">
                <div class="left-side">
                    <base-button type="button" design="light" @click="$emit('close')" :disabled="isLoading">{{ $t('general.close') }}</base-button>
                </div>
                <div class="right-side">
                    <base-button type="button" design="light" @click="reset" :disabled="isLoading">{{ $t('general.clear') }}</base-button>
                    <base-button type="submit" design="primary" :disabled="isLoading">{{ $t('general.filter') }}</base-button>
                </div>
            </div>
        </form>
    </base-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        props: {
            boxed: {
                type: Boolean,
                default: false
            },
            isLoading: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            ...mapGetters('common', [
                'filters',
            ]),
            ...mapGetters('config', [
                'vars',
            ]),
        },
        methods: {
            ...mapActions('common', [
                'ResetFilters',
            ]),
            submit() {
                const filterQuery = {
                    ...this.$route.query,
                    ...this.filters,
                    filtered: true,
                    filtered_at: moment().unix()
                }

                this.$router.push({ path: this.$route.path, query: filterQuery }).catch(err => {})
            },
            reset() {
                this.ResetFilters()
                if(this.$route.query && this.$route.query.filtered) {
                    this.$router.push({ path: this.$route.path })
                }
            }
        },
    }

</script>

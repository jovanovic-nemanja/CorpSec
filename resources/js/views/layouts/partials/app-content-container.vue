<template>
    <div class="row">
        <div class="col main">
            <div class="page">
                <router-view name="header" />

                <router-view name="special" />

                <transition-page>
                    <router-view />
                </transition-page>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppContentContainer',
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.$store.state.config.appIsLoading = false
            })
        },
    }

</script>

<style lang="scss" scoped>
    @import '~@js/core/assets/scss/imports.scss';

    // .main {
    //     padding-top: $side-margin;
    //     padding-left: $side-margin;
    //     padding-right: $side-margin;
    //     transition: #{$transition-all-ease};
    //     // transform: translate3d(0, 0, 0);
    //     margin-bottom: 5rem;
    // }

    @include media-breakpoint-down(sm) {
        .main {
            margin-top: $side-margin * 2;
        }
    }
</style>

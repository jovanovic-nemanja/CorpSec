<template>
    <div :class="['centered-box justify-content-center mt-4', `width-${width}` ]">
        <card type="white" shadow header-classes="bg-white" body-classes="px-lg-4 py-lg-4" class="border-0">
            <slot></slot>

            <div class="powered-logo text-center" v-if="this.orgLogo">
                <span class="text-muted mr-1">{{ $t('general.powered_by') }} </span>
                <app-logo app-logo inline />
            </div>
        </card>
    </div>
</template>

<script>
    import AppLogo from '@components/AppLogo'
    import { mapGetters } from 'vuex'

    export default {
        props: {
            width: {
                type: String,
                default: 'normal'
            },
        },
        components: {
            AppLogo,
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters('config', [
                'configs',
            ]),
            orgLogo() {
                if (this.configs.image && this.configs.image.logo) {
                    return this.configs.image.logo
                }
                return null
            },
        }
    };

</script>
<style lang="scss" scoped>
    @import '~@js/core/assets/scss/imports.scss';

    .centered-box {
        display: flex;
        flex-direction: column;
        width: 90vw;
        margin: 0px auto;
        justify-content: center;
    }

    .powered-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;

        span {
            line-height: 10px;
        }

        img {
            width: 80px;
            margin-left: 8px;
        }
    }

    
    @include media-breakpoint-up(md) {
        .centered-box {
            width: 400px;

            &.width-sm {
                width: 350px;
            }

            &.width-md {
                width: 450px;
            }

            &.width-xl {
                width: 500px;
            }

            &.width-xxl {
                width: 550px;
            }

            &.width-xxxl {
                width: 600px;
            }
        }
    }

</style>

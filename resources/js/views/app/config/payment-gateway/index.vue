<template>
    <base-container boxed with-loader :is-loading="isLoading" :loader-color="vars.loaderColor">
        <form @submit.prevent="submit">

            <fieldset class="fieldset pt-4">
                <legend>
                    RazorPay
                    <div class="d-inline-flex align-items-center">
                        <base-checkbox class="ml-3 mt-1 mb-1" v-model="formData.razorpay" inline>
                            {{ $t('general.enabled') }}
                        </base-checkbox>
                    </div>
                </legend>

                <collapse-transition>
                    <div class="row" v-if="formData.razorpay">
                        <div class="col-12 col-md-4 mb-4">
                            <switch-wrapper :label="$t('config.payment_gateway.live_mode', {attribute: 'RazorPay'})">
                                <base-switch v-model="formData.razorpayMode"></base-switch>
                            </switch-wrapper>
                        </div>
                        <div class="col-12 col-md-4 mb-4">
                            <switch-wrapper :label="$t('config.payment_gateway.charge_handling_fee')">
                                <base-switch v-model="formData.razorpayChargeHandlingFee"></base-switch>
                            </switch-wrapper>
                        </div>
                        <div class="col-12 col-md-4 mb-4" v-if="formData.razorpayChargeHandlingFee">
                            <switch-wrapper :label="$t('config.payment_gateway.fixed_handling_fee')">
                                <base-switch v-model="formData.razorpayFixedHandlingFee"></base-switch>
                            </switch-wrapper>
                        </div>

                        <div class="col-12"></div>
                        
                        <div class="col-12 col-md-4 mb-4">
                            <base-input :label="$t('config.payment_gateway.key', {attribute: 'RazorPay'})" type="text" v-model="formData.razorpayKey" :error.sync="formErrors.razorpayKey" :disabled="isLoading" />
                        </div>
                        <div class="col-12 col-md-4 mb-4">
                            <base-input :label="$t('config.payment_gateway.secret', {attribute: 'RazorPay'})" type="text" v-model="formData.razorpaySecret" :error.sync="formErrors.razorpaySecret" :disabled="isLoading" />
                        </div>
                        <template v-if="formData.razorpayChargeHandlingFee">
                            <div class="col-12 col-md-4 mb-4" v-if="formData.razorpayFixedHandlingFee">
                                <base-input :label="$t('config.payment_gateway.attr_handling_fee', {attribute: 'RazorPay'})" type="text" v-model="formData.razorpayHandlingFee" :error.sync="formErrors.razorpayHandlingFee" :disabled="isLoading" :addon-left-text="vars.defaultCurrency.prefix" :addon-right-text="vars.defaultCurrency.suffix" />
                            </div>
                            <div class="col-12 col-md-4 mb-4" v-else>
                                <base-input :label="$t('config.payment_gateway.attr_handling_fee', {attribute: 'RazorPay'})" type="text" v-model="formData.razorpayHandlingFee" :error.sync="formErrors.razorpayHandlingFee" :disabled="isLoading" addon-right-icon="fas fa-percent" />
                            </div>
                        </template>
                    </div>
                    <h5 class="text-muted" v-else>{{ $t('config.payment_gateway.disabled') }}</h5>
                </collapse-transition>
            </fieldset>

            <div class="text-right mt-5">
                <base-button type="button" design="light" @click="reset">{{ $t('general.reset') }}</base-button>
                <base-button type="submit" design="primary">{{ $t('general.save') }}</base-button>
            </div>

        </form>
    </base-container>
</template>

<script>
    import form from '@mixins/config-form'
    import { CollapseTransition } from 'vue2-transitions'

    export default {
        extends: form,
        components: {
            CollapseTransition
        },
        data() {
            return {
                formData: {
                    razorpay: false,
                    razorpayChargeHandlingFee: false,
                    razorpayFixedHandlingFee: false,
                    razorpayHandlingFee: 0,
                    razorpayKey: "",
                    razorpayMode: false,
                    razorpaySecret: "",
                    type: 'paymentGateway',
                },
            }
        },
        mounted() {
            this.getInitialData()
        },
    }

</script>

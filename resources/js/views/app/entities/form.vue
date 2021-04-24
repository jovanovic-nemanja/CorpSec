<template>
    <form @submit.prevent="submit">
        <animated-loader :is-loading="isLoading || isFetching" :loader-color="vars.loaderColor" />

        <div class="row">

            <div class="col-12 mb-4">
                <label>{{formLabels.type}} : </label>&nbsp;&nbsp;&nbsp;
                <input type="radio" id="1" value="1" v-bind:checked="checked" v-model="formData.type">
                <label for="1">New</label>
                &nbsp;&nbsp;
                <input type="radio" id="2" value="2" v-model="formData.type">
                <label for="2">Transfer</label>

                <!-- <input :label="formLabels.type" type="radio" v-model="formData.type" :error.sync="formErrors.type" /> -->
            </div>

            <div class="col-12 mb-4">
                <base-input auto-focus :label="formLabels.name" type="text" v-model="formData.name" :error.sync="formErrors.name" required />
            </div>

            <div class="col-12 col-md-6 mb-4">
                <base-input :label="formLabels.incorporation_date" addon-right-icon="far fa-calendar-alt" type="text" v-model="formData.incorporation_date" :error.sync="formErrors.incorporation_date" :is-wrapper="true">
                    <date-picker v-model="formData.incorporation_date" :config="vars.datepickerConfig" class="form-control datepicker" />
                </base-input>
            </div>

            <div class="col-12 col-md-6 mb-4">
                <base-input :label="formLabels.finanical_year_end_date" addon-right-icon="far fa-calendar-alt" type="text" v-model="formData.finanical_year_end_date" :error.sync="formErrors.finanical_year_end_date" :is-wrapper="true">
                    <date-picker v-model="formData.finanical_year_end_date" :config="vars.datepickerConfig" class="form-control datepicker" />
                </base-input>
            </div>

            <!-- <div class="col-12 mb-4">
                <base-input auto-focus :label="formLabels.activity" type="text" v-model="formData.activity" :error.sync="formErrors.activity" />
            </div>  --> 
           <!--  <div class="col-12 mt-4 mb-3">
                <base-checkbox class="ml-3 mt-2" v-model="formData.activity">
                    {{ $t('activities.0') }}
                </base-checkbox>
            </div> -->
            <div class="form-group col-12 col-md-12 mb-4">
                <!-- <label class="label">{{formLabels.activity}} :</label>                 -->
            <!-- </div> -->
            <!-- <div class="form-group form-check" v-for="(item, index) in activities" v-bind:key="index"> -->
                <!-- <label class="form-check-label" :for="index">{{item}}</label> -->
                <!-- <input type="checkbox"  v-model="formData.activity" :id="index" :value="item"> -->
                <base-select :options="activities" v-model="formData.activity" :label="formLabels.activity" :error.sync="formErrors.activity" preselect-first />
            </div>

            <div class="form-group col-12 col-md-12 mb-4">
                <label class="label">{{formLabels.interested_reason}} :</label>                
            </div>
            <div class="form-group form-check" v-for="(interested_reason, index) in interested_reasons" v-bind:key="index">
                <label class="form-check-label" :for="index">{{interested_reason}}</label>
                <input type="checkbox"  v-model="formData.interested_reason" :id="index" :value="index">
            </div>

            <div class="col-12 mb-4">
                <base-input auto-focus :label="formLabels.other_reason" type="text" v-model="formData.other_reason" :error.sync="formErrors.other_reason" />
            </div>  

            <div class="form-group col-12 col-md-12 mb-4">
                <label class="label">{{formLabels.fund_source}} :</label>
            </div>
            <div class="form-group form-check" v-for="(fund_source, index) in source_fundses" v-bind:key="index">
                <label class="form-check-label" :for="index">{{fund_source}}</label>
                <input type="checkbox"  v-model="formData.fund_source" :id="index" :value="index">
            </div>

            <div class="col-12 mb-4">
                <base-input auto-focus :label="formLabels.other_source_fund" type="text" v-model="formData.other_source_fund" :error.sync="formErrors.other_source_fund" />
            </div>  

            <div class="col-12 col-md-12 mb-4">
                <base-text-area :label="formLabels.description" type="text" v-model="formData.description" :error.sync="formErrors.description" />
            </div>

            <div class="form-group col-12 col-md-12 mb-4">
                <label class="label">COMPANY ADDRESS :</label>                
            </div>
            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.address_line1" type="text" v-model="formData.address_line1" :error.sync="formErrors.address_line1"  />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.address_line2" type="text" v-model="formData.address_line2" :error.sync="formErrors.address_line2"  />
            </div>

            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.city" type="text" v-model="formData.city" :error.sync="formErrors.city"  />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.state" type="text" v-model="formData.state" :error.sync="formErrors.state"  />
            </div>

            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.country" type="text" v-model="formData.country" :error.sync="formErrors.country"  />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <base-input auto-focus :label="formLabels.zip_code" type="text" v-model="formData.zip_code" :error.sync="formErrors.zip_code"  />
            </div>
        </div>

        <div class="form-footer mt-3">
            <div class="left-side">
                <base-button type="button" design="light" @click="$router.back()" tabindex="-1"><i class="fas fa-chevron-left"></i> {{ $t('general.cancel') }}</base-button>

                <base-checkbox class="ml-3 mt-2" v-model="keepAdding" v-if="showKeepAdding">
                    {{ $t('general.keep_adding') }}
                </base-checkbox>
            </div>
            <div class="right-side">
                <base-button type="button" design="light" @click="reset">{{ $t('general.reset') }}</base-button>
                <base-button type="submit" design="primary">{{ $t('global.save', { attribute: $t('entity.entity') } ) }}</base-button>
            </div>
        </div>

        <template v-if="showKeepAdding && keepAdding">
            <keep-adding-form :keep-adding-fields="keepAddingFields" :keep-adding-option="keepAddingOption" @optionUpdated="keepAddingOption=$event" :keep-adding-selected-fields="keepAddingSelectedFields" @fieldsUpdated="keepAddingSelectedFields=$event" :is-loading="isLoading" />
        </template>
    </form>
</template>

<script>
    import form from '@mixins/form'
    import store from '@js/store'
    
    const vars = store.getters['config/vars']

    export default {
        extends: form,
        data() {
            return {
                formData: {
                    uuid: null,
                    name: '',
                    description: '',
                    type:'',
                    incorporation_date:moment().format(vars.serverDateFormat),
                    finanical_year_end_date:moment().format(vars.serverDateFormat),
                    activity:'',
                    interested_reason:[],
                    fund_source:[],
                    address_line1:'',
                    address_line2:'',
                    city:'',
                    state:'',
                    country:'',
                    zip_code:'',
                    other_reason:'',
                    other_source_fund:''
                },
                formLabels: {
                    name: $t('entity.props.name'),
                    description: $t('entity.props.description'),
                    type:$t('entity.props.type'),
                    incorporation_date:$t('entity.props.incorporation_date'),
                    finanical_year_end_date:$t('entity.props.finanical_year_end_date'),
                    activity:$t('entity.props.activity'),
                    interested_reason:$t('entity.props.interested_reason'),
                    fund_source:$t('entity.props.fund_source'),
                    address_line1:$t('entity.props.address_line1'),
                    address_line2:$t('entity.props.address_line2'),
                    city:$t('entity.props.city'),
                    state:$t('entity.props.state'),
                    country:$t('entity.props.country'),
                    zip_code:$t('entity.props.zip_code'),
                    other_reason:$t('entity.props.other_reason'),
                    other_source_fund:$t('entity.props.other_source_fund'),
                },
                initUrl: 'entities',
                timeFields: ['time'],
                activities:$t('entity.activities'),
                interested_reasons:$t('entity.interested_reasons'),
                source_fundses:$t('entity.source_funds')
            }
        },
        mounted() {
            this.isLoading = false
        }
    }

</script>

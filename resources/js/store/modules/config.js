import store from '@js/store'
import vars from '@js/vars'
import uiConfigComponents from './sources/ui-config-components'
import initialUiConfig from './sources/initial-ui-config'
import * as ConfigAPI from '@api/config'
import * as UnsplashAPI from '@api/unsplash'
import moment from 'moment'

function reloadIfRequired(c) {
    if(document.documentElement.lang !== c.system.locale) {
        location.reload(true)
    }
}

const config = {
    namespaced: true,
    state: {
        config: {},
        ui: initialUiConfig,
        uiConfigComponents: uiConfigComponents,
        vars: Object.assign({}, vars),
        loaded: false,
        appIsLoading: true,
    },
    getters: {
        configs: state => state.config,
        config: state => args => {
            const keys = args.split('.')
            let toReturn = state.config;
            keys.forEach(key => {
                toReturn = toReturn[key]
            })
            return toReturn
        },
        uiConfigs: state => state.ui,
        uiConfig: state => args => {
            const keys = args.split('.')
            let toReturn = state.ui;
            keys.forEach(key => {
                toReturn = toReturn[key]
            })
            return toReturn
        },
        vars: state => state.vars,
        uiConfigComponents: state => state.uiConfigComponents,
        isLoaded: state => state.loaded,
        isLicensed: state => state.config && state.config.license,
        appIsLoading: state => state.appIsLoading,
        isScreenLocked: (state) => {
            const lastActivity = store.getters['user/lastActivity']
            const locked = store.getters['user/locked']
            if(locked) {
                return true
            } else if(state.config && state.config.auth && lastActivity) {
                let lastActivityAfterTimeout = moment(lastActivity)
                    .add(state.config.auth.lockScreenTimeout, 'minutes')
                    .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
                return moment()
                    .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) > lastActivityAfterTimeout
            }
            return false
        },
        wallpaper: state => state.ui.wallpaper,
        scrollLock: state => state.ui.scrollLock,
    },
    mutations: {
        ADD_CONFIG: (state, configArgs = {}) => {
            state.config = Object.assign({}, state.config, configArgs)
        },
        ADD_UI_CONFIG: (state, configArgs = {}) => {
            state.ui = Object.assign({}, state.ui, configArgs)
        },
        SET_CONFIG: (state, configArgs = {}) => {
            configArgs.objForEach((value, key) => state.config[key] = value)
        },
        SET_UI_CONFIG: (state, configArgs = {}) => {
            configArgs.objForEach((value, key) => state.ui[key] = value)
        },
        SET_VARS: (state, configArgs = {}) => {
            configArgs.objForEach((value, key) => state.vars[key] = value)
        },
        SET_LOADED: (state, value) => { state.loaded = value },
        SET_APP_IS_LOADING: (state, value) => { state.appIsLoading = value },
        RESET_CONFIG: (state) => { 
            state.config = {}
        },
        RESET_UI_CONFIG: (state) => { 
            state.ui = initialUiConfig 
        },
    },
    actions: {
        async GetConfig({ commit, getters, dispatch }, resetFirst) {
            if (resetFirst) {
                commit('RESET_CONFIG')
            }

            try {
                const response = await ConfigAPI.get().catch(e => { throw e })
                commit('ADD_CONFIG', response)
                if(!response.failedInstall) {
                    if(response.system) {
                        dispatch('SetupVars', response.system)
                    }
                    if(response.ui) {
                        dispatch('SetUiConfig', response.ui)
                    }
                    if(response.authenticated === true && !getters.isScreenLocked) {
                        dispatch('user/SetLastActivity', null, { root: true })
                    }

                    await dispatch('navigation/Generate', null, { root: true })
                    reloadIfRequired(response)
                }
                commit('SET_LOADED', true)
                return response
            } catch (error) {
                commit('RESET_CONFIG')
                commit('SET_LOADED', false)
                throw error
            }
        },
        SetConfig({ commit, dispatch }, configArgs) {
            commit('SET_CONFIG', configArgs)
            if(configArgs.system) {
                dispatch('SetupVars', configArgs.system)
            }
            if(configArgs.ui) {
                dispatch('SetUiConfig', configArgs.ui)
            }
        },
        SetUiConfig({ commit }, configArgs) {
            commit('SET_UI_CONFIG', configArgs)
            if(configArgs.notificationPosition) {
                window.toastConfig.position = configArgs.notificationPosition
                window.toastConfig.normal.position = configArgs.notificationPosition
                window.toastConfig.info.position = configArgs.notificationPosition
                window.toastConfig.success.position = configArgs.notificationPosition
                window.toastConfig.error.position = configArgs.notificationPosition
            }
            if(configArgs.notificationDuration) {
                window.toastConfig.duration = configArgs.notificationDuration
                window.toastConfig.normal.duration = configArgs.notificationDuration
                window.toastConfig.info.duration = configArgs.notificationDuration
                window.toastConfig.success.duration = configArgs.notificationDuration
                window.toastConfig.error.duration = configArgs.notificationDuration
            }
        },
        SetPageTitle({ commit, state }, titleObj) {
            commit('SET_UI_CONFIG', {
                pageHeader: {
                    ...state.ui.pageHeader,
                    title: titleObj.title || '',
                    subTitle: titleObj.subTitle || ''
                }
            })
        },
        SetLoaded({ commit }, value) {
            commit('SET_LOADED', value)
        },
        SetAppIsLoading({ commit }, value) {
            commit('SET_APP_IS_LOADING', value)
        },
        async getWallpaper({ commit }) {
            try {
                const response = await UnsplashAPI.getWallpaper().catch(e => { throw e })
                commit('SET_UI_CONFIG', { wallpaper: response })
                return response
            } catch (error) {
                throw error
            }
        },
        ScrollLock({ commit }) {
            commit('SET_UI_CONFIG', { scrollLock: true })
        },
        ScrollUnlock({ commit }) {
            commit('SET_UI_CONFIG', { scrollLock: false })
        },
        ResetConfig({ commit }) {
            commit('RESET_CONFIG')
        },
        ResetUiConfig({ commit }) {
            commit('RESET_UI_CONFIG')
        },
        SetupVars({ commit, state }, systemConfig) {
            const currency = systemConfig.currency
            if(currency) {
                if(currency.position === 'prefix') {
                    currency.prefix = currency.symbol
                } else {
                    currency.suffix = currency.symbol
                }
            }

            // if(systemConfig.locale && !systemConfig.dateTimeAlwaysEng) {
            //     require([`moment/locale/${systemConfig.locale}`], function(localeModule) {
            //         // here the locale is loaded, but not yet in use
            //         console.log(moment().format('LLLL'));  // 'Friday, June 24, 2016 1:42 AM'

            //         moment.locale(systemConfig.locale)
            //         moment.locale('de');
            //         // Use moment now that the locale has been properly set.
            //         console.log(moment().format('LLLL')); // 'Freitag, 24. Juni 2016 01:42'
            //     })
            // }
            
            commit('SET_VARS', {
                defaultDateFormat: systemConfig.dateFormat,
                defaultTimeFormat: systemConfig.timeFormat,
                defaultDateTimeFormat: systemConfig.dateFormat + ' ' + systemConfig.timeFormat,
                datepickerConfig: {
                    ...state.vars.datepickerConfig,
                    dateFormat: state.vars.momentToDatepicker[state.vars.serverDateFormat],
                    altFormat: state.vars.momentToDatepicker[systemConfig.dateFormat],
                },
                timepickerConfig: {
                    ...state.vars.timepickerConfig,
                    dateFormat: state.vars.momentToTimepicker[state.vars.serverTimeFormat],
                    altFormat: state.vars.momentToTimepicker[systemConfig.timeFormat],
                },
                datepickerRangeConfig: {
                    ...state.vars.datepickerRangeConfig,
                    dateFormat: state.vars.momentToDatepicker[state.vars.serverDateFormat],
                    altFormat: state.vars.momentToDatepicker[systemConfig.dateFormat],
                },
                datepickerMultipleConfig: {
                    ...state.vars.datepickerMultipleConfig,
                    dateFormat: state.vars.momentToDatepicker[state.vars.serverDateFormat],
                    altFormat: state.vars.momentToDatepicker[systemConfig.dateFormat],
                },
                datetimepickerConfig: {
                    ...state.vars.datetimepickerConfig,
                    dateFormat: state.vars.momentToDatepicker[state.vars.serverDateFormat] + ' ' + state.vars.momentToTimepicker[state.vars.serverTimeFormat],
                    altFormat: state.vars.momentToDatepicker[systemConfig.dateFormat] + ' ' + state.vars.momentToTimepicker[systemConfig.timeFormat],
                },
                defaultCurrency: currency,
            })
        },
    }
}
export default config

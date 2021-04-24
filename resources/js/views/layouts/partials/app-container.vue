<template>
    <div class="app-container" id="app-container" 
            :data-layout="uiConfigs.layout" 
            :data-color-scheme="uiConfigs.colorScheme"
            
            :data-page-background-color="uiConfigs.pageBackgroundColor" 
            :data-page-container-background-color="uiConfigs.pageContainerBackgroundColor" 
            :data-page-header-background-color="uiConfigs.pageHeaderBackgroundColor" 
            :data-page-header-is-boxed="uiConfigs.pageHeaderIsBoxed" 

            :data-sidebar-left-height="uiConfigs.leftSidebarHeight" 
            :data-sidebar-left-style="uiConfigs.leftSidebarStyle" 
            :data-sidebar-left-backdrop="uiConfigs.leftSidebarBackdrop" 
            :data-sidebar-left-backdrop-color="uiConfigs.leftSidebarBackdropColor" 
            :data-sidebar-left-shadow="uiConfigs.leftSidebarShadow" 
            :data-sidebar-left-color="uiConfigs.leftSidebarColor" 
            :data-sidebar-left-show="uiConfigs.leftSidebarShow" 
            :data-sidebar-left-logo-light="uiConfigs.leftSidebarLogoLight" 

            :data-sidebar-right-height="uiConfigs.rightSidebarHeight" 
            :data-sidebar-right-style="uiConfigs.rightSidebarStyle" 
            :data-sidebar-right-backdrop="uiConfigs.rightSidebarBackdrop" 
            :data-sidebar-right-backdrop-color="uiConfigs.rightSidebarBackdropColor" 
            :data-sidebar-right-shadow="uiConfigs.rightSidebarShadow" 
            :data-sidebar-right-color="uiConfigs.rightSidebarColor" 
            :data-sidebar-right-show="uiConfigs.rightSidebarShow" 

            :data-sidebar-modal-height="uiConfigs.modalSidebarHeight" 
            :data-sidebar-modal-style="uiConfigs.modalSidebarStyle" 
            :data-sidebar-modal-backdrop="uiConfigs.modalSidebarBackdrop" 
            :data-sidebar-modal-backdrop-color="uiConfigs.modalSidebarBackdropColor" 
            :data-sidebar-modal-shadow="uiConfigs.modalSidebarShadow" 
            :data-sidebar-modal-color="uiConfigs.modalSidebarColor" 
            :data-sidebar-modal-show="uiConfigs.modalSidebarShow" 

            :data-sidebar-config-show="uiConfigs.configSidebarShow" 

            :data-sidebar-special-color="uiConfigs.specialSidebarColor" 
            :data-sidebar-special-show="uiConfigs.specialSidebarShow" 

            :data-top-navbar-hide="uiConfigs.topNavbarHide" 
            :data-top-navbar-fixed="uiConfigs.topNavbarFixed" 
            :data-top-navbar-color="uiConfigs.topNavbarColor" 
            :data-top-navbar-logo-light="uiConfigs.topNavbarLogoLight"

            :data-notification-position="uiConfigs.notificationPosition" 

            :data-nav-menu-horizontal="uiConfigs.navMenuHorizontal"
            :data-rtl="uiConfigs.toggleRtl">
            
        <animated-loader :is-loading="appIsLoading" :loader-color="vars.loaderColor" size="screen" overlayColor="transparent" />

        <template v-if="!appIsLoading">
            <app-backdrop />

            <app-navbar />

            <app-search />

            <!-- <app-sidebar-config /> -->

            <div class="container-fluid">
                <!-- <app-sidebar-special /> -->
                
                <app-sidebar-left>
                    <template #menu>
                        <app-sidebar-menu />
                    </template>

                    <template #widgets>
                        
                    </template>
                </app-sidebar-left>

                <app-sidebar-right />

                <slot />

                <app-footer v-if="uiConfigs.pageFooterShow && configs.system" :footer-credit="configs.system.footerCredit" :version="configs.system.version" />
            </div>

            <b-modal centered lazy ref="lockinModal" v-model="showingLockinModal" @hidden="onLockinModalHidden">
                <template #modal-header>
                    <h5 class="modal-title">{{ $t('auth.lock.locking_screen') }}</h5>
                </template>
                <div>
                    {{ $t('auth.lock.will_lock_in', {attribute: lockinMessage }) }}
                </div>
                <template #modal-footer>
                    <base-button type="button" design="primary" @click.stop="onLockinModalCancel">No, Cancel!</base-button>
                </template>
            </b-modal>

            <back-to-top :visibility-height="300" :back-position="50" transition-name="fade"/>

            <template v-if="configs.chat && configs.chat.enabled">
                <div class="chat-box-container" v-if="subscriptions && subscriptions.userPrivate">
                    <div :class="['chat-button', {'hidden': isChatBoxShown}]">
                        <button type="button" @click="showChatBox"><i class="far fa-comments"></i> <span>{{ $t('chat.chat') }}</span></button>

                        <span v-if="totalUnreadMessages && totalUnreadMessages > 0" class="badge badge-pill badge-success unread-count">{{ totalUnreadMessages }}</span>
                    </div>

                    <chat-box v-if="isChatBoxShown" :box-visibility="isChatBoxShown" :channel="subscriptions.userPrivate" @boxHidden="isChatBoxShown = false" @boxShown="isChatBoxShown = true" />
                </div>
            </template>

        </template>
    </div>
</template>

<script>
    import live from '@mixins/live'

    import { setupPusher } from '@js/echo-setup'

    import keyBindings from '@core/utils/keyBindings'
    import { nRoutes, nActions } from '@js/helpers/notification'
    import { formatKeysToCamelCase } from '@core/utils/formatter'

    import AppNavbar from './app-navbar'
    import AppSidebarConfig from './app-sidebar-config'
    import AppSidebarSpecial from './app-sidebar-special'
    import AppSidebarLeft from './app-sidebar-left'
    import AppSidebarRight from './app-sidebar-right'
    import AppFooter from './app-footer'
    import AppSidebarMenu from './sidebar-menu/app-sidebar-menu'
    import AppBackdrop from '@components/AppBackdrop'
    import AppSearch from '@components/AppSearch'

    import { mapGetters, mapActions } from 'vuex'
    import EventBus from '@js/event-bus'

    export default {
        extends: live,
        components: {
            AppBackdrop,
            AppSearch,
            AppNavbar,
            AppSidebarConfig,
            AppSidebarSpecial,
            AppSidebarLeft,
            AppSidebarRight,
            AppSidebarMenu,
            AppFooter,
        },
        data() {
            return {
                lockinMessage: null,
                lockinTime: null,
                showingLockinModal: false,
                shortcuts: {
                    // key83: 'appProductAbout', // 83 = s => Student
                    // key68: 'appDashboard', // 68 = d => Dashboard
                },
                offlineToast: null,
            }
        },
        computed: {
            ...mapGetters('config', [
                'configs',
                'uiConfigs',
                'vars',
                'appIsLoading',
            ]),
            ...mapGetters('user', [
                'locked',
                'lockin',
                'uuid',
                'loggedInUser',
                'liveUsers',
            ]),
        },
        watch: {
            locked(newVal, oldVal) {
                if(newVal) {
                    this.$refs.lockinModal.hide()
                    this.lockinTime = null
                    this.lockinMessage = null
                    const toPath = this.$route.fullPath
                    this.$router.push({ name: 'authLock', query: { ref: toPath } })
                }
            },
            lockin(newVal, oldVal) {
                if(newVal) {
                    this.lockinTime = newVal.time
                    this.lockinMessage = newVal.unit
                    this.lockinMessage = newVal.time + ' ' + newVal.unit
                    this.showLockinModal(newVal)
                }
            },
            isOnline(newVal, oldVal) {
                if(newVal !== oldVal) {
                    if(newVal) {
                        if(this.offlineToast) {
                            this.offlineToast.goAway()
                        }
                        this.$toasted.success($t('general.online_message'), this.$toastConfig.success)
                    } else {
                        this.offlineToast = this.$toasted.error($t('general.offline_message'), { ...this.$toastConfig.error, duration: null })
                    }
                }
            },
        },
        methods: {
            ...mapActions('config', [
                'SetUiConfig',
                'SetAppIsLoading',
            ]),
            handleNotificationClick(linkTo) {
                if(linkTo) {
                    this.$notify({
                      group: 'app',
                      clean: true
                    })
                    this.$router.push(linkTo)
                }
            },
            showSearchScreen() {
                this.SetUiConfig({ searchScreenShow: !this.uiConfigs.searchScreenShow })
            },
            handleHotKeyPressed(key) {
                const routeName = 'key' + key
                if(this.shortcuts.hasOwnProperty(routeName)){
                    this.$router.push({ name: this.shortcuts[routeName] })
                }
            },
            showLockinModal(lockin) {
                let timer
                const vm = this
                vm.lockinTime = lockin.time

                timer = setInterval(() => {
                    vm.lockinTime--;
                    if (vm.lockinTime < 1 && timer) {
                        clearInterval(timer);
                    }
                    vm.lockinMessage = vm ? vm.lockinTime + ' ' + lockin.unit : ''
                }, 1000)
                vm.showingLockinModal = true
                this.$gaEvent('activity', 'lockingScreen', 'Timer')
            },
            onLockinModalCancel(e) {
                this.SetLastActivity()
                this.showingLockinModal = false
                this.$gaEvent('engagement', 'lockingScreen', 'Cancelled')
            },
            onLockinModalHidden() {
                this.SetLastActivity()
                this.showingLockinModal = false
                this.$gaEvent('engagement', 'lockingScreen', 'Cancelled')
            },
            socketSubscriptionCallback(notification) {
                notification = formatKeysToCamelCase(notification)
                console.log(notification)
                let toastObj = { ...this.$toastConfig.info }
                let onActionClick = (toastObject) => {
                    this.$toasted.clear()
                    // toastObject.goAway(0)
                }


                if(notification.action === 'navigate') {
                    const routeName = nRoutes[notification.module][notification.event] ? nRoutes[notification.module][notification.event] : 'appDashboard'

                    onActionClick = (toastObject) => {
                        // toastObject.goAway(0)
                        this.$toasted.clear()
                        this.$router.push({ name: routeName }).catch(err => {})
                    }

                } else {
                    if(nActions[notification.command]) {
                        onActionClick = (toastObject) => {
                            this.$toasted.clear()
                            // toastObject.goAway(0)
                            nActions[notification.command](this.$router)
                        }
                    }
                }

                toastObj.action = {
                    text: notification.actionLabel || 'OK!',
                    onClick : (e, toastObject) => {
                        onActionClick(toastObject)
                    }
                    // push: {
                    //     name: nRoutes[notification.module][notification.event],
                    // },
                }

                this.$toasted.clear()
                if(!notification.autoAction || (notification.autoAction && !notification.hideToast)) {
                    this.$toasted.info(notification.title, toastObj)
                }

                if(notification.autoAction) {
                    const toastdInstance = 
                    setTimeout(() => {
                        onActionClick()
                    }, notification.autoDelay || 1000)
                }

            },
        },
        mounted() {
            this.SetAppIsLoading(false)
            this.SetUiConfig({ pageHeaderShow: true, pageFooterShow: true })
            document.body.classList.add("body-bg-" + this.uiConfigs.pageBackgroundColor)

            if(this.configs.chat && this.configs.chat.enabled && this.configs.chat.autoOpen) {
                window.setTimeout(() => {
                    this.isChatBoxShown = true
                }, 1500)
            }
        },
        created() {
            EventBus.$off('HOTKEY_PRESSED', this.handleHotKeyPressed)
            EventBus.$on('HOTKEY_PRESSED', this.handleHotKeyPressed)
            const listener = keyBindings.keyupListener.bind(this)
            document.removeEventListener('keyup', listener, true)
            document.addEventListener('keyup', listener, true)
        },
        beforeDestroy() {
        },
        destroyed() {
            EventBus.$off('HOTKEY_PRESSED', this.handleHotKeyPressed)
            document.body.classList.remove("body-bg-" + this.uiConfigs.pageBackgroundColor)
        },
    }

</script>

<style lang="scss">
    @import '~@js/core/assets/scss/imports.scss';
    @import "~@js/core/assets/scss/partials/palettes";

    .app-container {
        min-height: 100%;
    }

    .app-footer {
        padding-left: $side-margin;
        padding-right: $side-margin;
        transition: #{$transition-all-ease};
    }

    .screenshot-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        background: rgba(0,0,0,0.8);
        opacity: 0.5;
        transform: scale(0.5);
        transition: $transition-all-easeinout;
        transition-delay: 0.5s;
        display: none;
        justify-content: center;
        align-items: center;

        .screenshot {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem 1rem;

            canvas {
                width: 85vw !important;
                height: auto !important;
                box-shadow: $box-shadow-lg;
            }
        }

        &.show {
            display: block;
            transform: scale(1);
            opacity: 1;
        }
    }

    @each $key,
    $value in $default-palette {
        body.body-bg-#{$key}, [data-page-background-color="#{$key}"] {
            background-color: map-get($value, "background-color");
            color: map-get($value, "foreground-color");
        }
    }
</style>

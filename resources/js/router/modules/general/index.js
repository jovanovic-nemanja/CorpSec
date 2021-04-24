import store from '@js/store/index'

export default [
    {
        path: 'install',
        name: 'install',
        meta: { 
            title: 'setup.install.install_wizard', 
        },
        component: () => import('@views/install/index' /* webpackChunkName: "js/install/index" */),
        beforeEnter: ((to, from, next) => {
            const configs = store.getters['config/configs']
            if(!configs.failedInstall) {
                next('/')
            } else {
                next()
            }
        })
    },
    {
        path: '/404',
        name: 'error404',
        meta: { 
            title: 'general.page_not_found', 
        },
        component: () => import('@views/pages/error-404' /* webpackChunkName: "js/pages/error-404" */),
    },
    {
        path: '/401',
        name: 'error401',
        meta: { 
            title: 'general.page_unauthorized', 
        },
        component: () => import('@views/pages/error-401' /* webpackChunkName: "js/pages/error-401" */),
    },
    {
        path: '/error',
        name: 'error',
        meta: { 
            title: 'general.error_page', 
        },
        component: () => import('@views/pages/error' /* webpackChunkName: "js/pages/error" */),
    },
    {
        path: '/terms-and-conditions',
        name: 'terms',
        meta: { 
            title: 'auth.tnc', 
        },
        component: () => import('@views/pages/terms-and-conditions' /* webpackChunkName: "js/pages/terms-and-conditions" */),
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        meta: { 
            title: 'general.maintenance_page',
        },
        component: () => import('@views/pages/maintenance' /* webpackChunkName: "js/pages/maintenance" */),
        beforeEnter: ((to, from, next) => {
            const configs = store.getters['config/configs']

            if(!configs.system.maintenanceMode) {
                next('/')
            } else {
                next()
            }
        })
    },
]
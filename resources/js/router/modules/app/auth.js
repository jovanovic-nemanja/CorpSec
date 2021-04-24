import store from '@js/store'

export default [
    {
        path: 'auth/security',
        name: 'authSecurity',
        meta: { 
            title: 'auth.security.page_title',
        },
        component: () => import('@views/auth/security' /* webpackChunkName: "js/auth/security" */),
        beforeEnter: ((to, from, next) => {
            const configs = store.getters['config/configs']
            if(!configs.auth.twoFactorSecurity || !store.getters['user/twoFactorSet']) {
                next({ name: 'appDashboard' })
            } else {
                next()
            }
        })
    },
    {
        path: 'auth/lock',
        name: 'authLock',
        meta: { 
            title: 'auth.lock.page_title', 
        },
        component: () => import('@views/auth/lock' /* webpackChunkName: "js/auth/lock" */),
        beforeEnter: ((to, from, next) => {
            const configs = store.getters['config/configs']
            if(!configs.auth.lockScreen || !store.getters['config/isScreenLocked']) {
                next({ name: 'appDashboard' })
            } else {
                next()
            }
        })
    }
]
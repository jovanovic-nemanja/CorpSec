// loading app routes
export default [{
    path: 'config',
    name: 'appConfig',
    redirect: { name: 'appConfigBasicInfo' },
    meta: {
        prefixTitle: 'menu.setup', 
        title: 'config.config',
        icon: 'fas fa-cogs',
        permissions: ['access-config'],
        isHiddenNav: true,
    },
    component: () =>
        import('@views/app/config/index' /* webpackChunkName: "js/app/config/index" */ ),
    children: [{
        path: 'basic',
        name: 'appConfigBasicInfo',
        meta: {
            title: 'config.basic.basic',
            icon: 'far fa-building',
            key: 'basic'
        },
        component: () =>
            import('@views/app/config/basic/index' /* webpackChunkName: "js/app/config/basic/index" */ ),
    }, {
        path: 'assets',
        name: 'appConfigAssets',
        meta: {
            title: 'config.assets.assets',
            icon: 'far fa-images',
            key: 'assets'
        },
        component: () =>
            import('@views/app/config/assets/index' /* webpackChunkName: "js/app/config/assets/index" */ ),
    }, {
        path: 'system',
        name: 'appConfigSystem',
        meta: {
            title: 'config.system.system',
            icon: 'fas fa-sliders-h',
            key: 'system'
        },
        component: () =>
            import('@views/app/config/system/index' /* webpackChunkName: "js/app/config/system/index" */ ),
    }, {
        path: 'mail',
        name: 'appConfigMail',
        meta: {
            title: 'config.mail.mail',
            icon: 'fas fa-envelope',
            key: 'mail'
        },
        component: () =>
            import('@views/app/config/mail/index' /* webpackChunkName: "js/app/config/mail/index" */ ),
    }, {
        path: 'roles',
        name: 'appConfigRole',
        redirect: { name: 'appConfigRoleList' },
        meta: {
            title: 'config.role.roles',
            icon: 'fas fa-users-cog',
            hideChildren: true,
        },
        component: {
            template: '<router-view></router-view>'
        },
        children: [{
                path: '',
                name: 'appConfigRoleList',
                meta: {
                    trans: 'global.list',
                    title: 'config.role.roles',
                    icon: 'fas fa-list',
                },
                component: () => import('@views/app/config/role/index' /* webpackChunkName: "js/app/config/role/index" */ ),
            },
            {
                path: 'add',
                name: 'appConfigRoleAdd',
                meta: {
                    trans: 'global.add',
                    title: 'config.role.role',
                    icon: 'fas fa-plus',
                },
                component: () => import('@views/app/config/role/add' /* webpackChunkName: "js/app/config/role/add" */ ),
            },
        ]
    }, {
        path: 'permissions',
        name: 'appConfigPermission',
        meta: {
            title: 'config.permission.permissions',
            icon: 'fas fa-key',
        },
        component: () =>
            import('@views/app/config/permission/index' /* webpackChunkName: "js/app/config/permission/index" */ ),
    }, {
        path: 'authentication',
        name: 'appConfigAuthentication',
        meta: {
            title: 'config.auth.auth',
            icon: 'fas fa-sign-in-alt',
            key: 'auth'
        },
        component: () =>
            import('@views/app/config/authentication/index' /* webpackChunkName: "js/app/config/authentication/index" */ ),
    }, {
        path: 'chat',
        name: 'appConfigChat',
        meta: {
            title: 'config.chat.chat',
            icon: 'fas fa-comments',
            key: 'chat'
        },
        component: () =>
            import('@views/app/config/chat/index' /* webpackChunkName: "js/app/config/chat/index" */ ),
    }, {
        path: 'pusher',
        name: 'appConfigPusher',
        meta: {
            title: 'config.pusher.credential',
            icon: 'fab fa-pushed',
            key: 'pusher'
        },
        component: () =>
            import('@views/app/config/pusher/index' /* webpackChunkName: "js/app/config/pusher/index" */ ),
    }, {
        path: 'sms',
        name: 'appConfigSms',
        meta: {
            title: 'config.sms.sms',
            icon: 'fas fa-comment-alt',
            key: 'sms'
        },
        component: () =>
            import('@views/app/config/sms/index' /* webpackChunkName: "js/app/config/sms/index" */ ),
    }, {
        path: 'payment-gateway',
        name: 'appConfigPaymentGateway',
        meta: {
            title: 'config.payment_gateway.payment_gateway',
            icon: 'fas fa-credit-card',
            key: 'paymentGateway'
        },
        component: () =>
            import('@views/app/config/payment-gateway/index' /* webpackChunkName: "js/app/config/payment-gateway/index" */ ),
    }, {
        path: 'website',
        name: 'appConfigWebsite',
        meta: {
            title: 'config.website.website',
            icon: 'fas fa-globe',
            key: 'website'
        },
        component: () =>
            import('@views/app/config/website/index' /* webpackChunkName: "js/app/config/website/index" */ ),
    }, {
        path: 'social',
        name: 'appConfigSocial',
        meta: {
            title: 'config.social.network',
            icon: 'fas fa-share-alt',
            key: 'social'
        },
        component: () =>
            import('@views/app/config/social/index' /* webpackChunkName: "js/app/config/social/index" */ ),
    }, {
        path: 'locales',
        name: 'appConfigLocale',
        redirect: { name: 'appConfigLocaleList' },
        meta: {
            title: 'config.locale.locales',
            icon: 'fas fa-language',
            hideChildren: true,
        },
        component: {
            template: '<router-view></router-view>'
        },
        children: [{
                path: '',
                name: 'appConfigLocaleList',
                meta: {
                    trans: 'global.list',
                    title: 'config.locale.locales',
                    icon: 'fas fa-list',
                },
                component: () => import('@views/app/config/locale/index' /* webpackChunkName: "js/app/config/locale/index" */ ),
            },
            {
                path: 'translation',
                name: 'appConfigLocaleTranslation',
                meta: {
                    trans: 'global.list',
                    title: 'config.locale.translation',
                    icon: 'fas fa-language',
                },
                component: () => import('@views/app/config/locale/translation' /* webpackChunkName: "js/app/config/locale/translation" */ ),
            },
            {
                path: 'add',
                name: 'appConfigLocaleAdd',
                meta: {
                    trans: 'global.add',
                    title: 'config.locale.locale',
                    icon: 'fas fa-plus',
                },
                component: () => import('@views/app/config/locale/add' /* webpackChunkName: "js/app/config/locale/add" */ ),
            },
        ]
    }]
}]

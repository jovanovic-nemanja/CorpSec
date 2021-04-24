import system from './system';

// loading app routes
import user from './user'
import entity from './entity'

import utility from './utility'
import config from './config'
import uiConfig from './ui-config'
import userPreference from './user-preference'
import activity from './activity'

import site from './site'

export default [{
        path: 'dashboard',
        name: 'appDashboard',
        meta: {
            title: 'dashboard.dashboard',
            description: '',
            icon: 'fas fa-home',
        },
        components: {
            header: () =>
                import ('@views/app/dashboard/header' /* webpackChunkName: "js/app/dashboard/header" */ ),
            special: () =>
                import ('@views/app/dashboard/index' /* webpackChunkName: "js/app/dashboard/index" */ ),
        },
    },
    {
        path: '',
        meta: {
            isHiddenNav: true,
        },
        components: {
            header: () =>
                import ('@views/layouts/partials/app-common-page-header' /* webpackChunkName: "js/layouts/partials/app-common-page-header" */ ),
            default: { template: '<router-view></router-view>' },
        },
        children: [
            ...system,

            ...user,
            ...utility,
            ...entity,
            ...config,
            ...uiConfig,
            ...userPreference,
            ...activity,

            ...site,
        ]
    },
]
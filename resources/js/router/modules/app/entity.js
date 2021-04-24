import store from '@js/store'

export default [{
    path: 'entity',
    name: 'appEntity',
    redirect: { name: 'appEntityList' },
    meta: {
        title: 'entity.entities',
        icon: 'fas fa-user-tie',
        hideChildren: true,
        isNotNav: 'config.system.entity',
        permissions: ['access-entity']
    },
    beforeEnter: ((to, from, next) => {
        if (!store.getters['config/configs'].system.entity) {
            next({ name: 'appDashboard' })
        } else {
            next()
        }
    }),
    component: {
        template: '<router-view></router-view>'
    },
    children: [{
            path: '',
            name: 'appEntityList',
            meta: {
                trans: 'global.list',
                title: 'entity.entities',
            },
            component: () =>
                import ('@views/app/entities/index' /* webpackChunkName: "js/app/entities/index" */ ),
        },
        {
            path: 'add',
            name: 'appEntityAdd',
            meta: {
                trans: 'global.add',
                title: 'entity.entities',
            },
            component: () =>
                import ('@views/app/entities/add' /* webpackChunkName: "js/app/entities/add" */ ),
        },
        {
            path: ':uuid/edit',
            name: 'appEntityEdit',
            meta: {
                trans: 'global.edit',
                title: 'entity.entities',
            },
            component: () =>
                import ('@views/app/entities/edit' /* webpackChunkName: "js/app/entities/edit" */ ),
        },
        {
            path: ':uuid',
            name: 'appEntityView',
            meta: {
                trans: 'global.view',
                title: 'entity.entities',
            },
            component: () =>
                import ('@views/app/entities/view' /* webpackChunkName: "js/app/entities/view" */ ),
        }
    ]
}, ]
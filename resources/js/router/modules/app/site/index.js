// loading app routes
import page from './page'
import query from './query'
import subscriber from './subscriber'

export default [{
        path: 'site',
        name: 'appSite',
        redirect: { name: 'appSitePage' },
        meta: {
            prefixTitle: 'site.site',
            title: 'site.site',
            icon: 'fas fa-globe',
            isHiddenNav: true,
            permissions: ['access-page', 'list-query', 'list-subscriber']
        },
        component: {
            template: '<router-view></router-view>'
        },
        children: [
            ...page,
            ...query,
            ...subscriber,
        ]
    },
]

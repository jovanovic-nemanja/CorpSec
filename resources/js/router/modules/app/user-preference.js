export default [{
        path: 'user-preference',
        name: 'appUserPreference',
        meta: {
            title: 'user.user_preference',
            isNotNav: true,
        },
        component: () =>
            import ('@views/app/user-preference/index' /* webpackChunkName: "js/app/user-preference/index" */ ),
    }]

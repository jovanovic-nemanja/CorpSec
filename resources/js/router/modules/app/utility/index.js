// loading app routes
import todo from './todo'

export default [{
        path: 'utility',
        name: 'appUtility',
        redirect: { name: 'appUtilityTodo' },
        meta: {
            title: 'utility.utility',
            icon: 'fas fa-tools',
            isNotNav: 'config.system.todo',
            isHiddenNav: true,
        },
        component: {
            template: '<router-view></router-view>'
        },
        children: [
            ...todo,
        ]
    },
]

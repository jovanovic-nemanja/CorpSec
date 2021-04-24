import './bootstrap'

import store from './store'
import router from './router'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
    id() {
        return window.kmenv.gaid || ''
    },
    router,
    debug: {
        enabled: false, // default value
        trace: false, // default value
        sendHitTask: true // default value
    }
})

const app = new Vue({
    el: '#root',
    store,
    router
})

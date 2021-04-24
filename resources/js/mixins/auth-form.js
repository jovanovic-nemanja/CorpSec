import { mapGetters, mapActions } from 'vuex'

import Box from '@js/views/auth/partials/box'
import GuestHeader from '@views/layouts/partials/guest-header'
import GuestFooter from '@views/layouts/partials/guest-footer'

export default {
    components: {
        Box,
        GuestHeader,
        GuestFooter,
    },
    data() {
        return {
            formData: {},
            formErrors: {},
            initialFormData: null,
            initianLength: 0,
            emptyFormData: null,
            preRequisite: {},
            isLoading: true,
            icons: {
                'facebook': 'fab fa-facebook-f',
                'twitter': 'fab fa-twitter',
                'github': 'fab fa-github',
                'google': 'fab fa-google',
            },
            btns: {
                'facebook': 'btn-facebook',
                'twitter': 'btn-twitter',
                'github': 'btn-github',
                'google': 'btn-google-plus',
            },
        }
    },
    computed: {
        ...mapGetters('config', [
            'configs',
            'vars',
        ]),
        ...mapGetters('user', [
            'twoFactorSet',
            'hasRole',
        ]),
    },
    methods: {
        ...mapActions('config', [
            'GetConfig',
        ]),
        ...mapActions('user', [
            'Register',
            'SetCSRF',
            'Logout',
            'Login',
            'LoginUsingOtp',
            'ResetTwoFactorSet',
            'RequestReset',
            'ValidateResetPassword',
            'ResetPassword',
            'CheckTwoFactorCode',
        ]),

        withQuery(toRoute) {
            let routeQuery = this.$route.query
            if (routeQuery && routeQuery.ref) {
                toRoute['query'] = {
                    ref: routeQuery.ref
                }
            }
            return toRoute
        }
    },
    mounted() {
        this.initialFormData = _.cloneDeep(this.formData)
        this.isLoading = false
    },
    beforeDestroy () {
        delete this.formData
        delete this.formErrors
        delete this.preRequisite
    },
}

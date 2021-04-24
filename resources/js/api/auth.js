import axios from 'axios'
import request from '@core/utils/request'

const apiUrl = '/auth'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

export function csrf() {
    return axios.get('/sanctum/csrf-cookie')
}

export function login(email, password) {
    const data = {
        email,
        password
    }

    return request({
        url: apiUrl + '/login',
        method: 'post',
        data
    })
}

export function loginUsingOtp(user) {
    let data = {}
    if(user.email) {
        data.email = user.email
    }
    if(user.ref) {
        data.ref = user.ref
    }
    if(user.mobile) {
        data.mobile = user.mobile
    }
    if(user.otp) {
        data.otp = user.otp
    }
    return request({
        url: apiUrl + '/login/otp',
        method: 'post',
        data
    })
}

export function register(data) {
    return request({
        url: apiUrl + '/register',
        method: 'post',
        data
    })
}

export function requestReset({ email }) {
    const data = {
        email
    }
    return request({
        url: apiUrl + '/password',
        method: 'post',
        data
    })
}

export function validateResetPassword({ email, code }) {
    const data = {
        email,
        code,
    }
    return request({
        url: apiUrl + '/validate-reset-password',
        method: 'post',
        data
    })
}

export function verifyTwoFactorCode(data) {
    return request({
        url: apiUrl + '/security',
        method: 'post',
        data
    })
}

export function verifyToken(token) {
    const data = {
        token
    }
    return request({
        url: apiUrl + '/verify',
        method: 'post',
        data
    })
}

export function resetPassword(data) {
    return request({
        url: apiUrl + '/reset',
        method: 'post',
        data
    })
}

export function unlock(user) {
    const data = {
        password: user.password,
    }
    return request({
        url: apiUrl + '/lock',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: apiUrl + '/logout',
        method: 'post',
    })
}

export function getUser() {
    return request({
        url: apiUrl + '/user',
        method: 'get',
    })
}

export function changePassword(data) {
    return request({
        url: apiUrl + '/change-password',
        method: 'post',
        data
    })
}

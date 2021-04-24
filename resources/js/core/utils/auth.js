import Cookies from 'js-cookie'
import vars from '@js/vars'
const TokenKey = 'AuthToken'

export function getToken() {
    // debugger
    return Cookies.get(TokenKey)
}

export function setToken(token, ttl = 1440) {
    // debugger
    return Cookies.set(TokenKey, token, {
        expires: new Date(new Date().getTime() + ttl * 60 * 1000)
    })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function clearStore(reload = false) {
    window.localStorage.removeItem(vars.localStorageKey)
    window.localStorage.removeItem(vars.localStorageVersionKey)
    window.localStorage.clear()
    
    if(reload) {
        window.location.reload(true)
    }
}
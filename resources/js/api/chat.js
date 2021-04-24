import { instanceSilent as request } from '@core/utils/request'
let apiUrl = '/chat'

export function getRooms(query) {
    return request({
        url: apiUrl + '/rooms',
        method: 'get',
        params: query
    })
}

export function getRoom(query) {
    return request({
        url: apiUrl + '/rooms/' + query.uuid,
        method: 'get',
    })
}

export function searchRooms(term) {
    return request({
        url: apiUrl + '/rooms/search',
        method: 'get',
        params: { q: term }
    })
}

export function searchMessages(params) {
    return request({
        url: apiUrl + '/messages/search',
        method: 'get',
        params
    })
}

export function getMessages(query) {
    return request({
        url: apiUrl + '/messages',
        method: 'get',
        params: query
    })
}

export function sendMessage(data) {
    return request({
        url: apiUrl + '/messages',
        method: 'post',
        data
    })
}

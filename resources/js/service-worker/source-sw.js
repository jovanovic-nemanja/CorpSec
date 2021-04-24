import * as config from './config';
import cache from './cache';
import vars from '@js/vars';


const SW_VERSION = vars.serviceWorkerKey + '-' + vars.serviceWorkerVersion;

self.addEventListener('message', (event) => {
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage(SW_VERSION);
    }
});

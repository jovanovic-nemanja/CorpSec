import vars from '@js/vars';

import { skipWaiting, clientsClaim, cacheNames, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute, getCacheKeyForURL } from 'workbox-precaching';
import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

skipWaiting();
clientsClaim();
setCacheNameDetails({
    prefix: vars.serviceWorkerKey.toLowerCase(),
    suffix: vars.serviceWorkerVersion
});

precacheAndRoute(self.__WB_MANIFEST || []);

// fonts
// 
// // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
                purgeOnQuotaError: true,
            }),
        ],
    })
);

// registerRoute(
//     /.*googleapis\.com/,
//     new StaleWhileRevalidate({
//         cacheName: 'googleapis',
//     })
// );

// registerRoute(
//     /.*gstatic\.com/,
//     new StaleWhileRevalidate({
//         cacheName: 'gstatic',
//     })
// );

// images
registerRoute(
    new RegExp('.(?:png|gif|jpg|jpeg|webp|svg|ico)$'),
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true,
            })
        ]
    })
);

// static
registerRoute(
    new RegExp('(?:lang)$'),
    new StaleWhileRevalidate({
        cacheName: 'static-resources'
    }),
);

// static
registerRoute(
    new RegExp('.(?:js|css)$'),
    new StaleWhileRevalidate({
        cacheName: 'static-resources'
    }),
);

registerRoute(
    new RegExp('.*\/api\/.*$'),
    new NetworkFirst({
        networkTimeoutSeconds: 10,
        cacheName: "apis",
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 60, // 10 minutes
                purgeOnQuotaError: true,
            }),
        ]
    })
);

// setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(({ event }) => {
    // debugger
    // The FALLBACK_URL entries must be added to the cache ahead of time, either
    // via runtime or precaching. If they are precached, then call
    // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
    // to get the response from the correct cache.
    //
    // Use event, request, and url to figure out how to respond.
    // One approach would be to use request.destination, see
    // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
    switch (event.request.destination) {
        case 'document':
            // If using precached URLs:
            // return matchPrecache(FALLBACK_HTML_URL);
            return caches.match(getCacheKeyForURL('/offline.html'));
            break;

        case 'images-cache':
            // If using precached URLs:
            // return matchPrecache(FALLBACK_IMAGE_URL);
            return caches.match(FALLBACK_IMAGE_URL);
            break;

        case 'font':
            // If using precached URLs:
            // return matchPrecache(FALLBACK_FONT_URL);
            return caches.match(FALLBACK_FONT_URL);
            break;

        default:
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
});

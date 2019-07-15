module.exports = {
    // a directory should be the same as "reactSnap.destination",
    // which default value is `build`
    globDirectory: '.',
    globPatterns: [
        "build/static/js/*.js",
        "build/200.html",
        "build/index.html",
        "build/static/media/*.jpg",
    ],
    swDest: "build/service-worker.js",
    modifyURLPrefix: {
        "build": ""
    },
    // Ignores a facebook thumbnail
    navigateFallbackBlacklist: [/^\/sharethumb\.png/],
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustURLsMatching: /\.\w{8}\./,
    // configuration specific to this experiment
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: "google-fonts-initial"
            }
        },
        {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: "google-fonts-webfonts"
            }
        },
        {
            urlPattern: /^https:\/\/api\.prototypical\.pro/,
            handler: 'NetworkFirst',
            options: {
                cacheName: "api-cache"
            }
        }
    ]
};
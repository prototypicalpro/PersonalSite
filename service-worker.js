/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "/static/js/2.2e39d27b.chunk.js"
  },
  {
    "url": "/static/js/main.384f4783.chunk.js"
  },
  {
    "url": "/static/js/runtime~main.a8a9905a.js"
  },
  {
    "url": "/200.html",
    "revision": "b51bc5c780ceb70e2865ed2d229a438e"
  },
  {
    "url": "/index.html",
    "revision": "c8327494f7b8aa2d2da9848035bc0055"
  },
  {
    "url": "/static/media/backthumb.a99c0b3c.jpg"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/200.html"), {
  whitelist: [/^(?!\/__).*/],
  
});

workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"google-fonts-initial", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"google-fonts-webfonts", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/api\.prototypical\.pro/, new workbox.strategies.NetworkFirst({ "cacheName":"api-cache", plugins: [] }), 'GET');

var version = '1'
var cacheName = 'pwa-for-prod-v' + version
var appShellFilesToCache = [
  './',
  './index.html',
  './main.js',
  './polyfills.js',
  './styles.css',
  './runtime.js',
  './favicon.ico',
  './assets/icons/icon-512x512.png'
]

var dataCacheName = 'pwa-for-prod-data-v' + version

self.addEventListener('install', (event) => {

  self.skipWaiting()

  console.log('[Service Worker]: Installed')

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker]: Caching App Shell')
      return cache.addAll(appShellFilesToCache)
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log('[Service Worker]: Active')

  self.clients.claim()

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {

        if (key !== cacheName) {
          console.log('[Service Worker]: Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker]: Fetch')

  if (event.request.url.indexOf('timeline/') != -1) {
    event.respondWith(

      // Network-First Strategy
      fetch(event.request)
        .then((response) => {
          return caches.open(dataCacheName).then((cache) => {

            cache.put(event.request.url, response.clone())
            console.log('[Service Worker]: Fetched & Cached URL using network-first', event.request.url)
            return response.clone()
          })
        })
        .catch((error) => {
          console.log('[Service Worker]: Returning from cache', event.request.url)
          return caches.match(event.request).then((response) => {
            return response
          })
        })

    )
  } else if (event.request.url.indexOf('fonts.googleapis.com') != -1 || event.request.url.indexOf('fonts.gstatic.com') != -1 || event.request.url.indexOf('pbs.twimg.com') != -1) {
    event.respondWith(

      // Cache-First Strategy
      caches.match(event.request.clone()).then((response) => {
        return response || fetch(event.request.clone()).then((r2) => {
            return caches.open(dataCacheName).then((cache) => {
              console.log('[Service Worker]: Fetched & Cached URL using cache-first', event.request.url)
              cache.put(event.request.url, r2.clone())
              return r2.clone()
            })
          })
      })

    )
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {

        if (response) {
          console.log('[Service Worker]: returning ' + event.request.url + ' from cache')
          return response
        } else {
          console.log('[Service Worker]: returning ' + event.request.url + ' from net')
          return fetch(event.request)
        }

        // w/o debug info: return response || fetch(event.request)

      })
    )
  }
})

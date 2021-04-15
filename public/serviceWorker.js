const staticCache = "manganya-1.0"
const assets = [
    "/",
    "/index.html",
    "/loading.gif",
    '/logo-dark.png',
    '/logo-white.png',
    '/build/bundle.css',
    '/build/bundle.js',
    '/build/bundle.js.map',
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticCache).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})

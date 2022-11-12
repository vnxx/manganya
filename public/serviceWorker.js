const staticCache = "manganya-2.0"
const assets = [
    "/",
    "/index.html",
    "/loading.gif",
    '/logo-dark.png',
    '/logo-white.png',
    '/data_broken.gif',
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticCache).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    if (fetchEvent.request.mode === 'navigate' || (fetchEvent.request.method === 'GET' && fetchEvent.request.headers.get('accept').includes('text/html'))) {
        fetchEvent.respondWith(
            fetch(fetchEvent.request.url).catch(error => {
                // Return the offline page
                return caches.match('/index.html');
            })
        );
    }
    else {
        // Respond with everything else if we can
        fetchEvent.respondWith(
            caches.match(fetchEvent.request).then(res => {
                return res || fetch(fetchEvent.request)
            })
        )
    }
})

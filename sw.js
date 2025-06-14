const CACHE_NAME = 'sc-seclab-v1';
const urlsToCache = [
  '/sc-seclab/',
  '/sc-seclab/index.html',
  '/sc-seclab/manifest.json',
  '/sc-seclab/images/ogp-image.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
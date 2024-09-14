const cacheName = 'sudoku-cache-v1';
const staticAssets = [
    './', // Главная страница
    './index.html', // HTML
    './style.css', // CSS
    './script.js', // JavaScript для игры
];

// Установка service worker и кэширование ресурсов
self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

// Активация service worker и очистка старого кэша, если изменился
self.addEventListener('activate', event => {
    self.clients.claim();
});

// Перехват запросов и загрузка из кэша, если оффлайн
self.addEventListener('fetch', async event => {
    const req = event.request;
    const url = new URL(req.url);

    // Для запросов на наш сайт используем кэш
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkAndCache(req));
    }
});

// Загружаем из кэша сначала
async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

// Загружаем из сети, но кэшируем для будущего использования
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}

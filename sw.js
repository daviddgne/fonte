// Service worker (module) : fonctionnement hors ligne.
// Stratégie « stale-while-revalidate » : réponse immédiate depuis le cache, mise à jour en arrière-plan
// (la nouvelle version est utilisée au lancement suivant).
import { EXERCISES } from './js/data/exercises.js';

const CACHE = 'fonte-v1';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/app.js', './js/store.js', './js/engine.js', './js/ui.js', './js/chart.js', './js/muscles.js',
  './js/data/exercises.js', './js/data/program.js', './js/data/muscle-shapes.js',
  './js/views/common.js', './js/views/home.js', './js/views/session.js', './js/views/workout.js', './js/views/exercise.js',
  './js/views/history.js', './js/views/program.js', './js/views/library.js', './js/views/settings.js',
  './assets/muscles/front.svg', './assets/muscles/back.svg',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/maskable-512.png', './assets/icons/apple-touch-icon.png'
];
const IMAGES = [...new Set(EXERCISES.flatMap(e => e.img ? e.img.seq.map(s => `./assets/ex/${e.img.src}-${s}.${e.img.ext}`) : []))];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(IMAGES.map(u => cache.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    // Miniatures YouTube : cache opportuniste ; le reste (lecteur vidéo) passe directement par le réseau.
    if (url.hostname === 'i.ytimg.com') {
      event.respondWith(caches.open(CACHE).then(async c => {
        const hit = await c.match(req);
        if (hit) return hit;
        try { const res = await fetch(req); c.put(req, res.clone()); return res; } catch (e) { return Response.error(); }
      }));
    }
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.mode === 'navigate' ? './index.html' : req;
    const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const network = fetch(req).then(res => {
      if (res && res.ok) cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    const res = await network;
    return res || new Response('Hors connexion', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (all.length) return all[0].focus();
    return self.clients.openWindow('./#/workout');
  })());
});

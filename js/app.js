// Point d'entrée : routeur, délégation d'événements, ticker, service worker.
import { state, save, requestPersistence } from './store.js';
import { closeSheet, fmtClock, $$, go } from './ui.js';
import * as Home from './views/home.js';
import * as Session from './views/session.js';
import * as Workout from './views/workout.js';
import * as Exercise from './views/exercise.js';
import * as History from './views/history.js';
import * as Program from './views/program.js';
import * as Library from './views/library.js';
import * as Settings from './views/settings.js';

const routes = [
  [/^\/?$/, Home.render],
  [/^\/session\/([^/]+)$/, (m) => Session.render({ id: m[1] })],
  [/^\/workout$/, Workout.render, 'workout'],
  [/^\/ex\/([^/]+)$/, (m, q) => Exercise.render({ id: m[1] }, q)],
  [/^\/history$/, History.render],
  [/^\/history\/([^/]+)$/, (m) => History.renderDetail({ id: m[1] })],
  [/^\/progress\/([^/]+)$/, (m) => History.renderProgress({ id: m[1] })],
  [/^\/program$/, Program.render],
  [/^\/edit\/([^/]+)$/, (m) => Program.renderEditor({ id: m[1] })],
  [/^\/library$/, Library.render],
  [/^\/settings$/, Settings.render]
];

const ACTIONS = Object.assign({}, Workout.actions, Exercise.actions, History.actions, Program.actions, Library.actions, Settings.actions, {
  'go': el => go(el.dataset.href),
  'back': () => { if (history.length > 1) history.back(); else go('#/'); },
  'sheet-close': () => closeSheet()
});
const CHANGES = Object.assign({}, Workout.changes, Program.changes, Library.changes, Settings.changes);

const app = document.getElementById('app');
let lastPath = null;

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path, query: new URLSearchParams(qs || '') };
}

function renderRoute() {
  const { path, query } = parseHash();
  let html = null, kind = null;
  for (const [re, fn, k] of routes) {
    const m = path.match(re);
    if (m) {
      const args = m.slice(1).map(decodeURIComponent);
      html = fn.length === 0 ? fn() : fn([m[0], ...args], query);
      kind = k || null;
      break;
    }
  }
  if (html === null) html = Home.render();
  const samePage = path === lastPath;
  const y = window.scrollY;
  app.innerHTML = html;
  document.body.classList.toggle('in-workout', kind === 'workout');
  Workout.keepAwake(kind === 'workout' && !!state.active);
  if (samePage) window.scrollTo(0, y); else window.scrollTo(0, 0);
  if (!samePage) closeSheet();
  lastPath = path;
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('fonte:render', renderRoute);

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.a];
  if (!fn) return;
  e.preventDefault();
  fn(el, e);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-c]');
  if (el && CHANGES[el.dataset.c]) CHANGES[el.dataset.c](el, e);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-c]');
  if (el && el.hasAttribute('data-input') && CHANGES[el.dataset.c]) CHANGES[el.dataset.c](el, e);
});
// Sélection du contenu des champs numériques au toucher (saisie rapide à la salle)
document.addEventListener('focusin', e => {
  if (e.target.matches('.stepper input')) setTimeout(() => e.target.select(), 0);
});

// Ticker : chrono global + repos (calculés à partir des horodatages → précis même après mise en veille).
setInterval(() => {
  const w = state.active;
  if (!w) return;
  const t = fmtClock((Date.now() - w.startedAt) / 1000);
  $$('[data-live="elapsed"]').forEach(el => { if (el.textContent !== t) el.textContent = t; });
  Workout.tick();
}, 250);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (location.hash.startsWith('#/workout')) Workout.keepAwake(true);
    Workout.tick();
  } else save();
});
window.addEventListener('pagehide', () => save());

// Service worker (hors ligne + installation)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { type: 'module' }).catch(err => console.warn('SW non enregistré', err));
  });
}
requestPersistence();
renderRoute();

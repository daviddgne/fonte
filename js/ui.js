// Petits utilitaires d'interface.

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
export function fmtRest(sec) {
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60), s = sec % 60;
  return s ? `${m} min ${String(s).padStart(2, '0')}` : `${m} min`;
}
export const fmtMin = sec => `${Math.round(sec / 60)} min`;
export const fmtLb = v => (v === null || v === undefined || v === '' ? '—' : `${+(+v).toFixed(1)} lb`);
export const num = v => +(+v).toFixed(1);

const DF = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const DFL = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const DFS = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
export const fmtDate = t => DF.format(new Date(t));
export const fmtDateLong = t => DFL.format(new Date(t));
export const fmtDateShort = t => DFS.format(new Date(t));
export function relDay(t) {
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const d = new Date(t); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d0 - d) / 86400000);
  if (diff === 0) return 'aujourd’hui';
  if (diff === 1) return 'hier';
  if (diff < 7) return `il y a ${diff} jours`;
  return fmtDateShort(t);
}

// Icônes (traits 2px, style Lucide-like, dessinées pour l'app).
const P = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  chevron: '<path d="M9 18l6-6-6-6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  up: '<path d="M18 15l-6-6-6 6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
  skip: '<path d="M5 5l10 7-10 7z"/><path d="M19 5v14"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  chart: '<path d="M4 19h16"/><path d="M6 15l4-5 4 3 5-7"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
  flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
  dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>'
};
export const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

// Toast
let toastTimer;
export function toast(msg, ms = 2600) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.innerHTML = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// Feuille modale (bottom sheet). Retourne une fonction de fermeture.
export function sheet(html, { onClose, cls = '' } = {}) {
  closeSheet();
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet-backdrop" data-a="sheet-close"></div><div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${html}</div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  wrap._onClose = onClose;
  return closeSheet;
}
export function closeSheet() {
  const w = $('.sheet-wrap');
  if (!w) return;
  const cb = w._onClose;
  w.remove();
  if (cb) cb();
}

export function confirmSheet(title, text, okLabel = 'Confirmer', danger = false) {
  return new Promise(resolve => {
    let answered = false;
    sheet(`<h3>${esc(title)}</h3><p class="muted">${text}</p>
      <div class="row gap mt"><button class="btn ghost grow" data-a="sheet-close">Annuler</button>
      <button class="btn ${danger ? 'danger' : 'primary'} grow" id="sheet-ok">${esc(okLabel)}</button></div>`,
      { onClose: () => { if (!answered) resolve(false); } });
    $('#sheet-ok').addEventListener('click', () => { answered = true; closeSheet(); resolve(true); });
  });
}

// Navigation / re-rendu (écoutés par app.js)
export const rerender = () => window.dispatchEvent(new Event('fonte:render'));
export const go = h => { if (location.hash === h) rerender(); else location.hash = h; };

export function haptic(pattern = 15) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignoré */ }
}

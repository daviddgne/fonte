import { state, getEx, currentPhase, cycleWeek } from '../store.js';
import { estimateSeconds, effectiveSets, blocks } from '../engine.js';
import { muscleGroup } from '../muscles.js';
import { icon, esc, fmtRest } from '../ui.js';

export function tabbar(active) {
  const t = (href, ic, label, key) => `<a class="tab ${active === key ? 'on' : ''}" href="${href}">${icon(ic)}<span>${label}</span></a>`;
  return `<nav class="tabbar"><div class="tabbar-inner">
    ${t('#/', 'home', 'Séances', 'home')}
    ${t('#/history', 'chart', 'Suivi', 'history')}
    ${t('#/library', 'book', 'Exercices', 'library')}
    ${t('#/program', 'list', 'Programme', 'program')}
    ${t('#/settings', 'gear', 'Réglages', 'settings')}
  </div></nav>`;
}

export function sessionStats(s) {
  const phase = currentPhase();
  const auto = state.settings.autoCycle;
  const sets = s.items.reduce((a, i) => a + effectiveSets(i.sets, phase, auto), 0);
  const seconds = estimateSeconds(s.items, getEx, { phase, auto });
  const groups = [];
  for (const it of s.items) for (const m of getEx(it.ex).muscles?.primary || []) {
    const g = muscleGroup(m);
    if (!groups.includes(g)) groups.push(g);
  }
  return { exercises: s.items.length, sets, seconds, groups };
}

export function lastDone(sessionId) {
  for (let i = state.history.length - 1; i >= 0; i--) if (state.history[i].sessionId === sessionId) return state.history[i];
  return null;
}

export function suggestedNext() {
  const main = state.program.sessions.filter(s => !s.optional);
  if (!main.length) return state.program.sessions[0]?.id;
  for (let i = state.history.length - 1; i >= 0; i--) {
    const idx = main.findIndex(s => s.id === state.history[i].sessionId);
    if (idx >= 0) return main[(idx + 1) % main.length].id;
  }
  return main[0].id;
}

export const repsLabel = (it) => `${it.reps[0] === it.reps[1] ? it.reps[0] : `${it.reps[0]}–${it.reps[1]}`}${getEx(it.ex).unilateral ? '/jambe' : ''}`;

// Liste compacte des exercices d'une séance (avec supersets).
export function exerciseList(s, { links = true } = {}) {
  const phase = currentPhase();
  const auto = state.settings.autoCycle;
  let html = '<ul class="ex-mini">';
  for (const b of blocks(s.items)) {
    b.items.forEach((it, k) => {
      const ex = getEx(it.ex);
      const sets = effectiveSets(it.sets, phase, auto);
      const mark = b.superset ? `<span class="ss-mark">SS${k + 1}</span>` : '';
      const name = links ? `<a href="#/ex/${encodeURIComponent(it.ex)}" style="color:inherit">${esc(ex.name)}</a>` : esc(ex.name);
      html += `<li><span>${mark}${name}</span><span class="muted num">${sets} × ${repsLabel(it)} · ${fmtRest(it.rest)}</span></li>`;
    });
  }
  return html + '</ul>';
}

export function phaseChip() {
  const p = currentPhase();
  return `<span class="chip accent">S${cycleWeek()} · ${esc(p.name)}</span>`;
}

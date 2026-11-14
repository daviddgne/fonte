import { state, getSession, getEx, currentPhase } from '../store.js';
import { blocks, effectiveSets } from '../engine.js';
import { muscleMap } from '../muscles.js';
import { icon, esc, fmtMin, fmtRest, fmtLb, relDay } from '../ui.js';
import { sessionStats, lastDone, repsLabel, phaseChip } from './common.js';
import { exImages } from '../data/exercises.js';

export function render({ id }) {
  const s = getSession(id);
  if (!s) return `<p class="empty">Séance introuvable.</p>`;
  const st = sessionStats(s);
  const phase = currentPhase();
  const auto = state.settings.autoCycle;
  const prim = new Set(), sec = new Set();
  s.items.forEach(it => { const m = getEx(it.ex).muscles || {}; (m.primary || []).forEach(x => prim.add(x)); (m.secondary || []).forEach(x => sec.add(x)); });
  const last = lastDone(s.id);
  let html = `<header class="page-head"><a class="icon-btn" href="#/" aria-label="Retour">${icon('back')}</a>
    <div class="grow"><h1>${esc(s.name)}</h1><div class="sub">${esc(s.focus || '')}</div></div>
    <a class="icon-btn" href="#/edit/${encodeURIComponent(s.id)}" aria-label="Modifier">${icon('edit')}</a></header>
    <div class="card"><div class="stat-row"><div class="stat"><b>${st.exercises}</b><span>exercices</span></div>
    <div class="stat"><b>${st.sets}</b><span>séries</span></div><div class="stat"><b>${fmtMin(st.seconds)}</b><span>estimé</span></div></div>
    <div class="row between mt-s"><span class="small muted">${last ? 'Dernière fois : ' + esc(relDay(last.start)) : 'Pas encore réalisée'}</span>${phaseChip()}</div>
    ${phase.loadFactor && state.settings.deloadAuto ? `<p class="small amber">Semaine de décharge : charges proposées à −${Math.round((1 - phase.loadFactor) * 100)} %.</p>` : ''}
    ${muscleMap({ primary: [...prim], secondary: [...sec].filter(x => !prim.has(x)) }, { compact: true })}
    <div class="legend"><span><i style="background:var(--accent)"></i>Principaux</span><span><i style="background:var(--amber)"></i>Secondaires</span></div></div>`;

  html += `<div class="section-title">Exercices</div>`;
  for (const b of blocks(s.items)) {
    if (b.superset) html += `<div class="ss-group"><div class="ss-label">${icon('bolt', 's')} Superset — enchaîner sans repos, puis ${fmtRest(Math.max(...b.items.map(i => i.rest)))} de récupération</div>`;
    for (const it of b.items) {
      const ex = getEx(it.ex);
      const img = exImages(ex)[1];
      html += `<a class="card tap row gap" href="#/ex/${encodeURIComponent(it.ex)}" style="color:inherit;margin-top:8px">
        <div class="thumb">${img ? `<img src="${img.src}" alt="" loading="lazy">` : icon('dumbbell')}</div>
        <div class="grow"><div style="font-weight:650">${esc(ex.name)}</div>
        <div class="small muted num">${effectiveSets(it.sets, phase, auto)} × ${repsLabel(it)} · repos ${fmtRest(it.rest)}${it.load ? ' · ' + fmtLb(it.load) : ''}${it.note ? ' · <span class="accent">' + esc(it.note) + '</span>' : ''}</div>
        ${it.warmup ? '<div class="tiny accent">Séries d’approche guidées</div>' : ''}</div>${icon('info')}</a>`;
    }
    if (b.superset) html += `</div>`;
  }
  html += `<div style="height:90px"></div>
    <div style="position:fixed;left:0;right:0;bottom:calc(var(--safe-b) + 14px);display:flex;justify-content:center;z-index:15;padding:0 16px">
    <div style="width:100%;max-width:608px">${state.active && state.active.sessionId === s.id
      ? `<button class="btn primary big" data-a="go" data-href="#/workout">${icon('play')} Reprendre la séance</button>`
      : `<button class="btn primary big" data-a="start" data-id="${esc(s.id)}">${icon('play')} Commencer la séance</button>`}</div></div>`;
  return html;
}

import { state, save, getEx } from '../store.js';
import { lineChart, sparkline } from '../chart.js';
import { exerciseHistory } from './exercise.js';
import { icon, esc, fmtClock, fmtDate, fmtDateLong, fmtDateShort, num, confirmSheet, go, rerender } from '../ui.js';
import { tabbar } from './common.js';

let tab = 'sessions';

function weekStart(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }

export function render() {
  const H = state.history;
  const now = Date.now();
  const thisWeek = H.filter(h => h.start >= weekStart(now)).length;
  const last30 = H.filter(h => h.start >= now - 30 * 86400000);
  const avgDur = last30.length ? last30.reduce((a, h) => a + h.duration, 0) / last30.length : 0;
  let html = `<header class="page-head"><h1>Suivi</h1></header>
    <div class="stat-row"><div class="stat"><b>${thisWeek}</b><span>séances cette semaine</span></div>
    <div class="stat"><b>${last30.length}</b><span>sur 30 jours</span></div>
    <div class="stat"><b>${avgDur ? fmtClock(avgDur).replace(/:\d\d$/, '') : '—'}</b><span>durée moyenne${avgDur >= 3600 ? ' (h:min)' : ' (min)'}</span></div></div>
    <div class="seg mt"><button class="${tab === 'sessions' ? 'on' : ''}" data-a="hist-tab" data-t="sessions">Séances</button><button class="${tab === 'progress' ? 'on' : ''}" data-a="hist-tab" data-t="progress">Progression</button></div>`;

  if (!H.length) {
    html += `<div class="empty">${icon('history')}<p>Aucune séance enregistrée pour l’instant.</p><a class="btn primary" href="#/">Commencer une séance</a></div>`;
    return html + tabbar('history');
  }

  if (tab === 'sessions') {
    let month = '';
    for (const h of [...H].reverse()) {
      const m = new Date(h.start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      if (m !== month) { html += `<div class="section-title">${esc(m)}</div>`; month = m; }
      const pain = h.entries.some(e => e.sets.some(s => s.pain));
      html += `<a class="card tap hist-item" href="#/history/${encodeURIComponent(h.id)}" style="display:block;color:inherit;margin-top:8px">
        <div class="top"><b>${esc(h.sessionName)}</b><span class="small muted">${esc(fmtDate(h.start))}</span></div>
        <div class="meta mt-s"><span>${icon('timer', 's')} <b class="num">${fmtClock(h.duration)}</b></span><span><b>${h.doneSets}</b>/${h.totalSets} séries</span>
        <span><b class="num">${Math.round(h.volume).toLocaleString('fr-FR')}</b> lb</span>${h.records?.length ? `<span class="accent">🏆 ${h.records.length}</span>` : ''}${pain ? '<span class="amber">⚠ douleur</span>' : ''}</div></a>`;
    }
  } else {
    const seen = new Map();
    for (const h of H) for (const e of h.entries) if (e.sets.length) seen.set(e.ex, (seen.get(e.ex) || 0) + 1);
    html += `<div class="list mt">`;
    for (const [ex] of [...seen.entries()].sort((a, b) => b[1] - a[1])) {
      const hist = exerciseHistory(ex);
      const last = hist[hist.length - 1];
      const first = hist[0];
      const diff = last.top - first.top;
      html += `<a class="card tap row gap" href="#/progress/${encodeURIComponent(ex)}" style="color:inherit">
        <div class="grow"><b>${esc(getEx(ex).name)}</b><div class="small muted num">${hist.length} séance${hist.length > 1 ? 's' : ''} · max ${num(last.top)} lb${hist.length > 1 ? ` · <span class="${diff > 0 ? 'accent' : ''}">${diff > 0 ? '+' : ''}${num(diff)} lb</span>` : ''}</div></div>
        ${sparkline(hist.map(h => h.top))}</a>`;
    }
    html += `</div>`;
  }
  return html + tabbar('history');
}

export function renderDetail({ id }) {
  const h = state.history.find(x => x.id === id);
  if (!h) return `<p class="empty">Séance introuvable.</p>`;
  let html = `<header class="page-head"><a class="icon-btn" href="#/history" aria-label="Retour">${icon('back')}</a>
    <div class="grow"><h1>${esc(h.sessionName)}</h1><div class="sub">${esc(fmtDateLong(h.start))} · semaine ${h.week} (${esc(h.phase || '')})</div></div></header>
    <div class="stat-row"><div class="stat"><b class="num">${fmtClock(h.duration)}</b><span>durée</span></div>
    <div class="stat"><b>${h.doneSets}/${h.totalSets}</b><span>séries</span></div>
    <div class="stat"><b class="num">${Math.round(h.volume).toLocaleString('fr-FR')}</b><span>lb soulevées</span></div></div>
    <p class="small muted center">${new Date(h.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} → ${new Date(h.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>`;
  if (h.records?.length) html += `<div class="card accent-card"><b>🏆 Records (1RM estimé, formule d’Epley)</b>${h.records.map(r => `<div class="small">${esc(r.name)} : ${Math.round(r.e1rm)} lb (avant ${Math.round(r.prev)})</div>`).join('')}</div>`;
  for (const e of h.entries) {
    html += `<section class="card mt"><div class="row between"><a href="#/ex/${encodeURIComponent(e.ex)}" style="color:inherit"><b>${esc(e.name)}</b></a>
      <span class="small muted">${e.sets.length}/${e.planned.sets} · ${e.planned.reps[0]}–${e.planned.reps[1]} reps</span></div>`;
    if (e.sets.length) html += `<table class="sets mt-s"><tr><th>Série</th><th>Charge</th><th>Reps</th><th></th></tr>${e.sets.map((s, i) => `<tr><td>${i + 1}</td><td>${num(s.load || 0)} lb</td><td>${s.reps}</td><td>${s.pain ? '<span class="amber">⚠ douleur</span>' : ''}</td></tr>`).join('')}</table>`;
    else html += `<p class="small muted">Non réalisé.</p>`;
    html += `</section>`;
  }
  if (h.notes) html += `<div class="section-title">Notes</div><div class="card small">${esc(h.notes).replace(/\n/g, '<br>')}</div>`;
  html += `<button class="btn danger block mt-l" data-a="hist-del" data-id="${esc(h.id)}">${icon('trash', 's')} Supprimer cette séance</button>`;
  return html;
}

let metric = 'top';
export function renderProgress({ id }) {
  const ex = getEx(id);
  const hist = exerciseHistory(id);
  const labels = { top: 'Charge max (lb)', best: '1RM estimé (lb)', vol: 'Volume (lb × reps)', reps: 'Répétitions totales' };
  let html = `<header class="page-head"><button class="icon-btn" data-a="back" aria-label="Retour">${icon('back')}</button>
    <div class="grow"><h1>${esc(ex.name)}</h1><div class="sub">Progression</div></div><a class="icon-btn" href="#/ex/${encodeURIComponent(id)}" aria-label="Fiche">${icon('info')}</a></header>`;
  if (!hist.length) return html + `<p class="empty">Pas encore de données.</p>`;
  html += `<div class="seg">${Object.entries({ top: 'Charge', best: '1RM est.', vol: 'Volume', reps: 'Reps' }).map(([k, v]) => `<button class="${metric === k ? 'on' : ''}" data-a="prog-metric" data-m="${k}">${v}</button>`).join('')}</div>
    <section class="card mt"><div class="small muted">${labels[metric]}</div>${lineChart(hist.map(h => ({ x: h.date, y: h[metric] })), { unit: metric === 'reps' ? 'reps' : 'lb', label: labels[metric] })}</section>
    <p class="tiny muted">1RM estimé = charge × (1 + reps / 30) (formule d’Epley) : un indicateur pour comparer des séries de répétitions différentes, pas une charge à tester.</p>
    <div class="section-title">Détail</div><section class="card"><table class="sets"><tr><th>Date</th><th>Séries (lb × reps)</th></tr>
    ${[...hist].reverse().map(h => `<tr><td><a href="#/history/${encodeURIComponent(h.histId)}">${esc(fmtDateShort(h.date))}</a></td><td>${h.sets.map(s => `${num(s.load || 0)}×${s.reps}${s.pain ? '⚠' : ''}`).join(' · ')}</td></tr>`).join('')}</table></section>`;
  return html;
}

export const actions = {
  'hist-tab': el => { tab = el.dataset.t; rerender(); },
  'prog-metric': el => { metric = el.dataset.m; rerender(); },
  'hist-del': async el => {
    const ok = await confirmSheet('Supprimer cette séance ?', 'Elle disparaîtra de l’historique et des graphiques. Action définitive (sauf si tu as une sauvegarde).', 'Supprimer', true);
    if (!ok) return;
    state.history = state.history.filter(h => h.id !== el.dataset.id);
    save(); go('#/history');
  }
};

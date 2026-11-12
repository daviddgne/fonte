import { state, getSession, currentPhase, cycleWeek, cycleOver } from '../store.js';
import { progress, doneSets, totalSets } from '../engine.js';
import { icon, esc, fmtClock, fmtMin, relDay, fmtDateLong } from '../ui.js';
import { tabbar, sessionStats, lastDone, suggestedNext, exerciseList, phaseChip } from './common.js';

export function render() {
  const w = state.active;
  const next = suggestedNext();
  const week = cycleWeek();
  const phase = currentPhase();
  let html = `<header class="page-head"><div class="brand grow"><div class="brand-mark">${icon('dumbbell')}</div>
    <div><h1>Fonte</h1><div class="sub">${esc(fmtDateLong(Date.now()))}</div></div></div></header>`;

  if (w) {
    const pct = Math.round(progress(w) * 100);
    html += `<div class="card accent-card resume-card tap" data-a="go" data-href="#/workout">
      <div class="row between"><span class="chip accent">Séance en cours</span><span class="muted small">${esc(w.sessionName)}</span></div>
      <div class="row between mt-s"><div class="big-time num" data-live="elapsed">${fmtClock((Date.now() - w.startedAt) / 1000)}</div>
      <div class="num"><b>${pct} %</b> <span class="muted small">${doneSets(w)}/${totalSets(w)} séries</span></div></div>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <button class="btn primary big mt" data-a="go" data-href="#/workout">${icon('play')} Reprendre la séance</button></div>`;
  }

  html += `<div class="card mt tap" data-a="go" data-href="#/program">
    <div class="row between"><div><div class="small muted">Cycle de 8 semaines</div><h3 class="mt-s">Semaine ${week} · ${esc(phase.name)}</h3></div>${icon('chevron')}</div>
    <p class="small muted">${esc(phase.rir)} — ${esc(phase.text)}</p>
    <div class="cycle-bar">${Array.from({ length: 8 }, (_, i) => `<span class="${i + 1 < week ? 'done' : i + 1 === week ? 'now' : ''}"></span>`).join('')}</div>
    ${cycleOver() ? '<p class="small amber mt-s">Le cycle est terminé : fais le bilan et démarre un nouveau cycle dans Programme.</p>' : ''}
  </div>`;

  html += `<div class="section-title">Mes séances</div><div class="list">`;
  for (const s of state.program.sessions) {
    const st = sessionStats(s);
    const last = lastDone(s.id);
    const isNext = s.id === next && !w;
    html += `<article class="card session-card">
      <div class="session-top tap" data-a="go" data-href="#/session/${encodeURIComponent(s.id)}">
        <div class="session-letter ${s.optional ? 'is-opt' : ''}">${esc(s.id.slice(0, 2))}</div>
        <div class="grow"><h3>${esc(s.name)}${isNext ? ' <span class="chip accent">Suggérée</span>' : ''}${s.optional ? ' <span class="chip">Facultative</span>' : ''}</h3>
        <div class="muted small">${esc(s.focus || '')}</div></div>${icon('chevron')}</div>
      <div class="meta"><span><b>${st.exercises}</b> exercices</span><span><b>${st.sets}</b> séries</span><span>≈ <b>${fmtMin(st.seconds)}</b></span>
        <span>${last ? 'Dernière : ' + esc(relDay(last.start)) : 'Jamais faite'}</span></div>
      <div class="chips">${st.groups.map(g => `<span class="chip">${esc(g)}</span>`).join('')}</div>
      <details><summary class="link-btn">${icon('down', 's')} Voir les exercices</summary>${exerciseList(s)}</details>
      ${w && w.sessionId === s.id ? `<button class="btn soft block" data-a="go" data-href="#/workout">${icon('play')} Reprendre</button>`
        : `<button class="btn ${isNext ? 'primary' : ''} block" data-a="start" data-id="${esc(s.id)}">${icon('play')} Commencer</button>`}
    </article>`;
  }
  html += `</div>`;
  if (!state.history.length) {
    html += `<div class="card mt"><h3>Bienvenue</h3><p class="small muted">Tes données restent sur ce téléphone. Pense à faire une sauvegarde de temps en temps (Réglages → Exporter).</p>
      <p class="small muted">Le programme a été révisé : consulte l’onglet <a href="#/program">Programme</a> pour voir ce qui a changé et pourquoi.</p></div>`;
  }
  return html + tabbar('home');
}

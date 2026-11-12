// Écran « Séance en cours » + moteur d'exécution (chrono, repos, supersets, alertes).
import { state, save, getSession, getEx, allExercises, currentPhase, cycleWeek } from '../store.js';
import { blocks, effectiveSets, nextStep, afterSet, progress, doneSets, totalSets, doneCount, suggestion, prefill, warmupSets, platesPerSide, summarize, roundTo } from '../engine.js';
import { icon, esc, fmtClock, fmtRest, fmtLb, fmtDateShort, toast, sheet, closeSheet, confirmSheet, haptic, go, rerender, $, num } from '../ui.js';
import { repsLabel } from './common.js';

const PLATE_EX = new Set(['squat', 'bench', 'deadlift', 'rdl', 'inclinebench', 'frontsquat', 'hipthrust']);
const RING_C = 2 * Math.PI * 90;

let draft = { key: null, load: 0, reps: 0, pain: false };

// ───── Démarrage ─────
export async function startWorkout(sessionId) {
  const s = getSession(sessionId);
  if (!s || !s.items.length) { toast('Cette séance ne contient aucun exercice.'); return; }
  if (state.active) {
    if (state.active.sessionId === sessionId) { go('#/workout'); return; }
    const ok = await confirmSheet('Une séance est déjà en cours', `« ${esc(state.active.sessionName)} » n’est pas terminée. La remplacer ? Les séries déjà notées seront perdues si tu ne l’enregistres pas avant.`, 'Remplacer', true);
    if (!ok) return;
  }
  const phase = currentPhase();
  const auto = state.settings.autoCycle;
  state.active = {
    id: 'w' + Date.now().toString(36),
    sessionId: s.id, sessionName: s.name, startedAt: Date.now(),
    week: cycleWeek(), phaseName: phase.name, phaseRir: phase.rir,
    items: s.items.map(it => {
      const ex = getEx(it.ex);
      return { uid: it.uid, ex: it.ex, name: ex.name, sets: effectiveSets(it.sets, phase, auto), plannedSets: it.sets, reps: [...it.reps], rest: it.rest, ss: it.ss || null, warmup: !!it.warmup, load: it.load ?? null, increment: it.increment || ex.increment || state.settings.defaultIncrement };
    }),
    log: {}, focus: null, rest: null, notes: ''
  };
  draft = { key: null };
  save();
  unlockAudio();
  go('#/workout');
}

// ───── Rendu ─────
export function render() {
  const w = state.active;
  if (!w) { setTimeout(() => go('#/'), 0); return ''; }
  const step = nextStep(w);
  const pct = Math.round(progress(w) * 100);
  let html = `<div class="wk-head"><div class="wk-top">
      <a class="icon-btn" href="#/" aria-label="Accueil (la séance continue)">${icon('back')}</a>
      <div class="wk-title"><div class="name">${esc(w.sessionName)}</div><div class="phase">S${w.week} · ${esc(w.phaseName)} · ${esc(w.phaseRir)}</div></div>
      <div class="wk-clock" data-live="elapsed" aria-label="Temps écoulé">${fmtClock((Date.now() - w.startedAt) / 1000)}</div>
      <button class="icon-btn" data-a="wk-menu" aria-label="Menu de la séance">${icon('dots')}</button></div>
    <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <div class="progress-label"><span><b>${doneSets(w)}</b> / ${totalSets(w)} séries</span><span><b>${pct} %</b> de la séance</span></div></div>`;

  html += step ? currentCard(w, step) : finishedCard(w);
  html += planList(w, step);
  html += restPanel(w);
  return html;
}

function currentCard(w, step) {
  const it = w.items.find(i => i.uid === step.uid);
  const ex = getEx(it.ex);
  const sugg = suggestion(state.history, it, it.increment);
  const key = `${it.uid}:${step.set}`;
  if (draft.key !== key) {
    const p = prefill(w, it, sugg);
    const load = p.load || (PLATE_EX.has(it.ex) ? state.settings.barWeight : 0);
    draft = { key, load, reps: p.reps, pain: false };
  }
  const bl = blocks(w.items).find(b => b.items.some(i => i.uid === it.uid));
  let ssHtml = '';
  if (bl.superset) {
    const pos = bl.items.findIndex(i => i.uid === it.uid);
    const others = bl.items.filter(i => i.uid !== it.uid).map(i => esc(i.name)).join(' + ');
    const chained = w.lastChain === it.uid;
    ssHtml = `<div class="ss-banner ${chained ? 'chain-banner' : ''}">${icon('bolt', 's')} ${chained ? 'Enchaîne sans repos — ' : ''}Superset ${pos + 1}/${bl.items.length} · avec ${others}</div>`;
  }
  const loadLabel = ex.load === 'perDb' ? 'Charge / haltère' : ex.load === 'body' ? 'Lest' : 'Charge';
  const last = sugg.last;
  let lastHtml = '';
  if (last) {
    const sets = last.sets.map(s => `${num(s.load || 0)}×${s.reps}${s.pain ? '⚠' : ''}`).join(' · ');
    const sl = sugg.reason === 'increase' ? `<div class="sugg">↑ Objectif : ${fmtLb(sugg.load)} × ${it.reps[0]}+ (haut de fourchette atteint)</div>`
      : sugg.reason === 'pain' ? `<div class="sugg pain">Douleur signalée la dernière fois : pas d’augmentation. Écoute tes sensations.</div>`
      : `<div class="sugg">→ Objectif : ${fmtLb(sugg.load)} × ${sugg.reps[Math.min(step.set - 1, sugg.reps.length - 1)]} reps</div>`;
    lastHtml = `<div class="last-perf">Dernière fois (${esc(fmtDateShort(last.date))}) : <b class="num">${sets}</b> lb${sl}</div>`;
  } else {
    lastHtml = `<div class="last-perf">Première fois : choisis une charge qui laisse ${esc(w.phaseRir)}.</div>`;
  }
  let warm = '';
  if (it.warmup && doneCount(w, it.uid) === 0 && draft.load > 0) {
    const ws = warmupSets(draft.load, { barbell: PLATE_EX.has(it.ex), bar: state.settings.barWeight, step: 5 });
    if (ws.length) warm = `<details class="warmup"><summary>${icon('timer', 's')} Échauffement suggéré (non compté)</summary>
      <ol>${ws.map(s => `<li>${fmtLb(s.load)} × ${s.reps}</li>`).join('')}</ol><p class="tiny muted">Repos court (60–90 s) entre ces séries. Recalculé selon la charge de travail saisie.</p></details>`;
  }
  const plates = PLATE_EX.has(it.ex) ? platesHtml(draft.load) : '';
  const done = (w.log[it.uid] || []).map((s, i) => `<button class="done-set ${s.pain ? 'pain' : ''}" data-a="wk-editset" data-uid="${it.uid}" data-i="${i}">S${i + 1} · ${num(s.load || 0)}×${s.reps}${s.pain ? ' ⚠' : ''}</button>`).join('');
  return `<section class="cur card" aria-live="polite">
    ${ssHtml}
    <div class="setno">Série ${step.set} sur ${it.sets}</div>
    <div class="row gap" style="align-items:flex-start"><h2 class="cur-name grow">${esc(it.name)}</h2></div>
    <div class="set-meta"><span>Objectif <b>${repsLabel(it)} reps</b></span><span>Repos <b>${fmtRest(bl.superset ? Math.max(...bl.items.map(i => i.rest)) : it.rest)}</b></span>${ex.load === 'perDb' ? '<span>charge par haltère</span>' : ''}</div>
    ${lastHtml}${warm}
    <div class="steppers">
      <div class="stepper"><label for="in-load">${loadLabel} (lb)</label>
        <input id="in-load" data-c="wk-input" data-input data-f="load" inputmode="decimal" type="text" value="${num(draft.load || 0)}" aria-label="Charge en livres">
        <span class="unit">pas de ${num(it.increment)} lb</span>
        <div class="ctrl"><button data-a="wk-step" data-f="load" data-d="-1" aria-label="Diminuer la charge">${icon('minus')}</button>
        <button data-a="wk-step" data-f="load" data-d="1" aria-label="Augmenter la charge">${icon('plus')}</button></div></div>
      <div class="stepper"><label for="in-reps">Répétitions</label>
        <input id="in-reps" data-c="wk-input" data-input data-f="reps" inputmode="numeric" type="text" value="${draft.reps}" aria-label="Répétitions effectuées">
        <span class="unit">${getEx(it.ex).unilateral ? 'par jambe' : 'effectuées'}</span>
        <div class="ctrl"><button data-a="wk-step" data-f="reps" data-d="-1" aria-label="Moins de répétitions">${icon('minus')}</button>
        <button data-a="wk-step" data-f="reps" data-d="1" aria-label="Plus de répétitions">${icon('plus')}</button></div></div>
    </div>
    <div class="plates" id="plates">${plates}</div>
    <button class="btn primary big validate" data-a="wk-validate">${icon('check')} Valider la série ${step.set}</button>
    <div class="cur-actions">
      <button data-a="go" data-href="#/ex/${encodeURIComponent(it.ex)}?from=workout">${icon('info')}Fiche</button>
      <button data-a="wk-swap" data-uid="${it.uid}">${icon('swap')}Remplacer</button>
      <button data-a="wk-pain" class="${draft.pain ? 'on' : ''}" aria-pressed="${draft.pain}">${icon('alert')}Douleur</button>
      <button data-a="wk-more" data-uid="${it.uid}">${icon('dots')}Plus</button>
    </div>
    ${done ? `<div class="done-sets">${done}</div>` : ''}
  </section>`;
}

function platesHtml(load) {
  const bar = state.settings.barWeight;
  if (!load) return '';
  if (load < bar) return `Charge inférieure au poids de la barre (${bar} lb)`;
  if (load === bar) return `Barre seule (${bar} lb)`;
  const p = platesPerSide(load, bar, state.settings.plates);
  return `Par côté : <b>${p.plates.map(x => num(x)).join(' + ') || '—'}</b>${p.rest ? ` (+${p.rest} lb manquant)` : ''} · barre ${bar} lb`;
}

function finishedCard(w) {
  return `<section class="cur card accent-card center">
    <div style="font-size:2.4rem">🏁</div><h2>Toutes les séries sont faites</h2>
    <p class="muted">Durée : <b class="num" data-live="elapsed">${fmtClock((Date.now() - w.startedAt) / 1000)}</b></p>
    <button class="btn primary big mt" data-a="wk-finish">${icon('check')} Terminer et enregistrer</button></section>`;
}

function planList(w, step) {
  let html = `<div class="section-title">Plan de la séance</div><div class="plan">`;
  for (const b of blocks(w.items)) {
    if (b.superset) html += `<div class="ss-group"><div class="ss-label">${icon('bolt', 's')} Superset</div>`;
    for (const it of b.items) {
      const d = doneCount(w, it.uid);
      const cls = step && step.uid === it.uid ? 'cur-item' : d >= it.sets ? 'complete' : '';
      const dots = Array.from({ length: it.sets }, (_, k) => `<i class="${k < d ? 'on' : ''}"></i>`).join('');
      html += `<div class="plan-item ${cls}" data-a="wk-focus" data-uid="${it.uid}">
        <div class="pname">${esc(it.name)}<small class="num">${it.sets} × ${repsLabel(it)}${d ? ' · ' + (w.log[it.uid] || []).map(s => `${num(s.load || 0)}×${s.reps}`).join(', ') : ''}</small></div>
        <div class="dots">${dots}</div></div>`;
    }
    if (b.superset) html += `</div>`;
  }
  return html + `</div><button class="btn ghost block mt" data-a="wk-finish">${icon('flag')} Terminer la séance</button>`;
}

function restPanel(w) {
  if (!w.rest) return '';
  const r = w.rest;
  const remain = Math.ceil((r.endsAt - Date.now()) / 1000);
  const over = remain <= 0;
  const off = RING_C * (1 - Math.max(0, remain) / r.total);
  return `<div class="rest ${w.restMin ? 'min' : ''} ${over ? 'over' : ''}" id="rest">
    <div class="rest-panel" role="timer" aria-label="Temps de repos">
      <div class="rest-top"><span class="chip accent">${icon('timer', 's')} Récupération</span><button class="link-btn" data-a="rest-min">Réduire</button></div>
      <div class="rest-ring"><svg viewBox="0 0 200 200"><circle class="track" cx="100" cy="100" r="90" fill="none" stroke-width="10"/>
        <circle class="bar" id="rest-bar" cx="100" cy="100" r="90" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${RING_C}" stroke-dashoffset="${off}"/></svg>
        <div class="label"><div class="rest-time" id="rest-time">${over ? 'Go !' : fmtClock(remain)}</div><div class="small muted">sur ${fmtClock(r.total)}</div></div></div>
      <div class="rest-next">Ensuite : <b>${esc(r.label || '')}</b></div>
      <div class="rest-btns"><button class="btn" data-a="rest-add" data-d="-15">−15 s</button><button class="btn" data-a="rest-add" data-d="15">+15 s</button>
        <button class="btn primary" data-a="rest-skip">${icon('skip', 's')} Passer</button></div>
    </div>
    <button class="rest-pill" data-a="rest-max">${icon('timer', 's')} <span id="rest-pill">${over ? 'Go !' : fmtClock(remain)}</span></button>
  </div>`;
}

// ───── Mise à jour en direct (appelée par le ticker global) ─────
export function tick() {
  const w = state.active;
  if (!w || !w.rest) return;
  const remain = Math.ceil((w.rest.endsAt - Date.now()) / 1000);
  const t = $('#rest-time'), bar = $('#rest-bar'), pill = $('#rest-pill'), box = $('#rest');
  const txt = remain <= 0 ? 'Go !' : fmtClock(remain);
  if (t) t.textContent = txt;
  if (pill) pill.textContent = txt;
  if (bar) bar.setAttribute('stroke-dashoffset', RING_C * (1 - Math.max(0, remain) / w.rest.total));
  if (box) box.classList.toggle('over', remain <= 0);
  if (remain <= 0 && !w.rest.alerted) {
    w.rest.alerted = true;
    save();
    alertRestEnd(w.rest.label);
  }
  if (remain <= -4) { w.rest = null; w.restMin = false; save(); if (location.hash.startsWith('#/workout')) rerender(); }
}

// ───── Alertes : son, vibration, notification ─────
let audioCtx = null;
export function unlockAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) { /* pas d'audio */ }
}
function beep() {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  [0, 0.22, 0.44].forEach((d, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = i === 2 ? 1175 : 880;
    g.gain.setValueAtTime(0.0001, t0 + d);
    g.gain.exponentialRampToValueAtTime(0.35, t0 + d + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.18);
    o.connect(g).connect(audioCtx.destination);
    o.start(t0 + d); o.stop(t0 + d + 0.2);
  });
}
function alertRestEnd(label) {
  const s = state.settings;
  if (s.sound) beep();
  if (s.vibrate) haptic([250, 120, 250]);
  if (s.notify && document.hidden && 'Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(reg => reg.showNotification('Repos terminé', { body: label ? `À toi : ${label}` : 'Série suivante', tag: 'fonte-rest', renotify: true, icon: 'assets/icons/icon-192.png', vibrate: [250, 120, 250] })).catch(() => {});
  }
}

// ───── Verrouillage de l'écran (Wake Lock) ─────
let wakeLock = null;
export async function keepAwake(on) {
  try {
    if (on && state.settings.keepAwake && 'wakeLock' in navigator) {
      if (!wakeLock || wakeLock.released) wakeLock = await navigator.wakeLock.request('screen');
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { /* refusé (batterie faible, etc.) */ }
}

// ───── Actions ─────
const cur = () => { const w = state.active; const s = w && nextStep(w); return s ? { w, step: s, it: w.items.find(i => i.uid === s.uid) } : null; };

function readInputs() {
  const l = $('#in-load'), r = $('#in-reps');
  if (l) { const v = parseFloat(String(l.value).replace(',', '.')); if (!isNaN(v)) draft.load = Math.max(0, v); }
  if (r) { const v = parseInt(r.value, 10); if (!isNaN(v)) draft.reps = Math.max(0, v); }
}

function startRest(w, seconds, nextStepObj) {
  const nIt = nextStepObj && w.items.find(i => i.uid === nextStepObj.uid);
  w.rest = { endsAt: Date.now() + seconds * 1000, total: seconds, label: nIt ? `${nIt.name} — série ${nextStepObj.set}` : '', alerted: false };
  w.restMin = false;
}

export const actions = {
  'start': el => startWorkout(el.dataset.id),
  'wk-step': el => {
    const c = cur(); if (!c) return;
    readInputs();
    const d = +el.dataset.d;
    if (el.dataset.f === 'load') draft.load = Math.max(0, roundTo((draft.load || 0) + d * c.it.increment, 0.5));
    else draft.reps = Math.max(0, (draft.reps || 0) + d);
    const inp = $(el.dataset.f === 'load' ? '#in-load' : '#in-reps');
    if (inp) inp.value = el.dataset.f === 'load' ? num(draft.load) : draft.reps;
    if (el.dataset.f === 'load' && PLATE_EX.has(c.it.ex)) { const p = $('#plates'); if (p) p.innerHTML = platesHtml(draft.load); }
    haptic(8);
  },
  'wk-pain': el => { draft.pain = !draft.pain; el.classList.toggle('on', draft.pain); el.setAttribute('aria-pressed', draft.pain); if (draft.pain) toast('Douleur notée pour cette série. Elle sera enregistrée à la validation.'); },
  'wk-validate': () => {
    const c = cur(); if (!c) return;
    unlockAudio();
    readInputs();
    const { w, it } = c;
    if (!draft.reps) { toast('Indique le nombre de répétitions effectuées.'); return; }
    (w.log[it.uid] = w.log[it.uid] || []).push({ load: draft.load || 0, reps: draft.reps, ts: Date.now(), pain: !!draft.pain });
    const pained = draft.pain;
    draft = { key: null };
    w.focus = it.uid;
    const r = afterSet(w, it.uid);
    w.lastChain = r.chain ? r.next.uid : null;
    w.focus = r.next ? r.next.uid : null;
    if (r.rest > 0) startRest(w, r.rest, r.next); else w.rest = null;
    save();
    haptic(30);
    if (r.chain) toast(`${icon('bolt', 's')} Enchaîne : ${esc(w.items.find(i => i.uid === r.next.uid).name)}`);
    rerender();
    if (pained) painSheet(it.uid);
    else if (r.finished) toast('Dernière série validée. Bravo !');
  },
  'wk-focus': el => { const w = state.active; w.focus = el.dataset.uid; draft = { key: null }; save(); rerender(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  'rest-add': el => { const w = state.active; if (!w?.rest) return; w.rest.endsAt += (+el.dataset.d) * 1000; w.rest.total = Math.max(5, w.rest.total + (+el.dataset.d)); if (w.rest.endsAt > Date.now()) w.rest.alerted = false; save(); tick(); },
  'rest-skip': () => { const w = state.active; if (!w) return; w.rest = null; save(); rerender(); },
  'rest-min': () => { const w = state.active; w.restMin = true; save(); $('#rest')?.classList.add('min'); },
  'rest-max': () => { const w = state.active; w.restMin = false; save(); $('#rest')?.classList.remove('min'); },
  'wk-swap': el => swapSheet(el.dataset.uid),
  'wk-swap-pick': el => {
    const w = state.active; const it = w.items.find(i => i.uid === el.dataset.uid); const ex = getEx(el.dataset.ex);
    const alsoProgram = $('#swap-prog')?.checked;
    const origUid = it.uid.split('~')[0];
    const done = doneCount(w, it.uid);
    if (done > 0) {
      // Les séries déjà faites restent attribuées à l'exercice d'origine ; le reste passe au nouvel exercice.
      const remaining = it.sets - done;
      it.sets = done;
      if (remaining > 0) {
        const nu = { ...it, uid: `${origUid}~${ex.id}~${Date.now().toString(36)}`, ex: ex.id, name: ex.name, sets: remaining, increment: ex.increment || it.increment, warmup: false };
        w.items.splice(w.items.indexOf(it) + 1, 0, nu);
        w.focus = nu.uid;
      }
    } else {
      it.ex = ex.id; it.name = ex.name; it.increment = ex.increment || it.increment;
    }
    if (alsoProgram) { const s = getSession(w.sessionId); const p = s?.items.find(i => i.uid === origUid); if (p) p.ex = ex.id; }
    draft = { key: null }; save(); closeSheet(); rerender();
    toast(`Remplacé par ${esc(ex.name)}${alsoProgram ? ' (aussi dans le programme)' : ' pour cette séance'}`);
  },
  'wk-more': el => moreSheet(el.dataset.uid),
  'wk-addset': el => { const it = state.active.items.find(i => i.uid === el.dataset.uid); it.sets++; save(); closeSheet(); rerender(); toast('Série ajoutée'); },
  'wk-remset': el => { const w = state.active; const it = w.items.find(i => i.uid === el.dataset.uid); if (it.sets > Math.max(1, doneCount(w, it.uid))) { it.sets--; save(); } closeSheet(); rerender(); },
  'wk-skipex': el => { const w = state.active; const it = w.items.find(i => i.uid === el.dataset.uid); it.sets = doneCount(w, it.uid); it.skipped = true; w.focus = null; draft = { key: null }; save(); closeSheet(); rerender(); toast('Exercice passé'); },
  'wk-lighter': () => { draft.load = Math.max(0, roundTo((draft.load || 0) * 0.9, 2.5)); closeSheet(); const l = $('#in-load'); if (l) l.value = num(draft.load); toast('Charge réduite d’environ 10 %. Arrête si la douleur revient.'); },
  'wk-unpain': el => { const w = state.active; const s = (w.log[el.dataset.uid] || []).slice(-1)[0]; if (s) s.pain = false; save(); closeSheet(); rerender(); },
  'wk-editset': el => editSetSheet(el.dataset.uid, +el.dataset.i),
  'wk-saveset': el => {
    const w = state.active; const s = w.log[el.dataset.uid][+el.dataset.i];
    const l = parseFloat(String($('#es-load').value).replace(',', '.')), r = parseInt($('#es-reps').value, 10);
    if (!isNaN(l)) s.load = Math.max(0, l); if (!isNaN(r)) s.reps = Math.max(0, r);
    s.pain = $('#es-pain').checked; save(); closeSheet(); rerender();
  },
  'wk-delset': el => { const w = state.active; w.log[el.dataset.uid].splice(+el.dataset.i, 1); draft = { key: null }; save(); closeSheet(); rerender(); },
  'wk-menu': () => sheet(`<h3>Séance en cours</h3><div class="opt-list">
      <button class="opt" data-a="wk-finish">${icon('flag')}<div>Terminer et enregistrer<small>Les séries non faites seront ignorées.</small></div></button>
      <button class="opt" data-a="wk-notes">${icon('edit')}<div>Notes de séance<small>Sensations, réglages de machine…</small></div></button>
      <button class="opt" data-a="wk-abort">${icon('trash')}<div>Abandonner sans enregistrer<small>Supprime cette séance en cours.</small></div></button></div>`),
  'wk-notes': () => sheet(`<h3>Notes de séance</h3><textarea id="wk-notes-in" placeholder="Ex. : siège de la presse cran 4, bonne énergie…">${esc(state.active.notes || '')}</textarea>
      <button class="btn primary block mt" data-a="wk-notes-save">Enregistrer</button>`),
  'wk-notes-save': () => { state.active.notes = $('#wk-notes-in').value; save(); closeSheet(); toast('Notes enregistrées'); },
  'wk-abort': async () => {
    closeSheet();
    const ok = await confirmSheet('Abandonner la séance ?', 'Les séries notées dans cette séance seront supprimées.', 'Abandonner', true);
    if (!ok) return;
    state.active = null; save(); keepAwake(false); go('#/');
  },
  'wk-finish': () => finishSheet(),
  'wk-save': () => {
    const w = state.active; if (!w) return;
    const notes = $('#fin-notes') ? $('#fin-notes').value : w.notes;
    const sum = summarize(w, state.history);
    const end = Date.now();
    const rec = { id: w.id, sessionId: w.sessionId, sessionName: w.sessionName, start: w.startedAt, end, duration: Math.round((end - w.startedAt) / 1000), week: w.week, phase: w.phaseName, notes, ...sum };
    state.history.push(rec);
    state.active = null;
    save(); closeSheet(); keepAwake(false);
    toast('Séance enregistrée');
    go('#/history/' + rec.id);
  }
};

export const changes = {
  'wk-input': el => {
    const c = cur(); if (!c) return;
    readInputs();
    if (el.dataset.f === 'load' && PLATE_EX.has(c.it.ex)) { const p = $('#plates'); if (p) p.innerHTML = platesHtml(draft.load); }
  }
};

function painSheet(uid) {
  const w = state.active; const it = w.items.find(i => i.uid === uid);
  const ex = getEx(it.ex);
  const remaining = it.sets - doneCount(w, uid);
  sheet(`<h3>${icon('alert', 's')} Douleur signalée</h3>
    <p class="muted small">Une douleur n’est pas un signal à ignorer : inutile de forcer. Choisis comment continuer.</p>
    <div class="opt-list">
      ${remaining > 0 ? `<button class="opt" data-a="wk-skipex" data-uid="${uid}">${icon('skip')}<div>Arrêter cet exercice<small>Passer à l’exercice suivant (${remaining} série${remaining > 1 ? 's' : ''} ignorée${remaining > 1 ? 's' : ''}).</small></div></button>` : ''}
      <button class="opt" data-a="wk-swap" data-uid="${uid}">${icon('swap')}<div>Remplacer par une alternative<small>Même groupe musculaire, à tester avec prudence.</small></div></button>
      ${remaining > 0 ? `<button class="opt" data-a="wk-lighter">${icon('minus')}<div>Continuer plus léger<small>−10 % sur la série suivante, uniquement si la douleur a disparu.</small></div></button>` : ''}
      <button class="opt" data-a="wk-unpain" data-uid="${uid}">${icon('x')}<div>Erreur, pas de douleur<small>Retire le signalement.</small></div></button>
    </div>
    <p class="tiny muted mt">Si une douleur revient régulièrement, parles-en à un professionnel de santé (médecin, kiné).</p>`);
}

function swapSheet(uid) {
  const w = state.active; const it = w.items.find(i => i.uid === uid); const ex = getEx(it.ex);
  const alts = (ex.alts || []).map(getEx);
  const same = allExercises().filter(e => e.group === ex.group && e.id !== ex.id && !alts.some(a => a.id === e.id));
  const opt = e => `<button class="opt" data-a="wk-swap-pick" data-uid="${uid}" data-ex="${esc(e.id)}">${icon('swap')}<div>${esc(e.name)}<small>${esc(e.equipment || '')}</small></div></button>`;
  sheet(`<h3>Remplacer « ${esc(ex.name)} »</h3>
    <label class="switch"><span class="small">Modifier aussi le programme</span><input type="checkbox" id="swap-prog"></label>
    ${alts.length ? `<div class="section-title">Alternatives conseillées</div><div class="opt-list">${alts.map(opt).join('')}</div>` : ''}
    ${same.length ? `<div class="section-title">Même groupe (${esc(ex.group)})</div><div class="opt-list">${same.map(opt).join('')}</div>` : ''}`);
}

function moreSheet(uid) {
  const w = state.active; const it = w.items.find(i => i.uid === uid);
  sheet(`<h3>${esc(it.name)}</h3><div class="opt-list">
    <button class="opt" data-a="wk-addset" data-uid="${uid}">${icon('plus')}<div>Ajouter une série<small>${it.sets} prévue${it.sets > 1 ? 's' : ''} actuellement</small></div></button>
    ${it.sets > Math.max(1, doneCount(w, uid)) ? `<button class="opt" data-a="wk-remset" data-uid="${uid}">${icon('minus')}<div>Retirer une série</div></button>` : ''}
    <button class="opt" data-a="wk-skipex" data-uid="${uid}">${icon('skip')}<div>Passer cet exercice<small>Machine occupée, fatigue, douleur…</small></div></button>
    <button class="opt" data-a="wk-notes">${icon('edit')}<div>Notes de séance</div></button></div>`);
}

function editSetSheet(uid, i) {
  const s = state.active.log[uid][i];
  sheet(`<h3>Modifier la série ${i + 1}</h3>
    <div class="ed-grid"><label>Charge (lb)<input id="es-load" type="text" inputmode="decimal" value="${num(s.load || 0)}"></label>
    <label>Répétitions<input id="es-reps" type="number" inputmode="numeric" value="${s.reps}"></label></div>
    <label class="switch mt"><span>Douleur sur cette série</span><input type="checkbox" id="es-pain" ${s.pain ? 'checked' : ''}></label>
    <div class="row gap mt"><button class="btn danger" data-a="wk-delset" data-uid="${uid}" data-i="${i}">${icon('trash', 's')} Supprimer</button>
    <button class="btn primary grow" data-a="wk-saveset" data-uid="${uid}" data-i="${i}">Enregistrer</button></div>`);
}

function finishSheet() {
  const w = state.active; if (!w) return;
  closeSheet();
  const done = doneSets(w), total = totalSets(w);
  if (!done) {
    sheet(`<h3>Aucune série notée</h3><p class="muted">Il n’y a rien à enregistrer pour l’instant.</p>
      <div class="row gap mt"><button class="btn ghost grow" data-a="sheet-close">Continuer</button><button class="btn danger grow" data-a="wk-abort">Abandonner</button></div>`);
    return;
  }
  const sum = summarize(w, state.history);
  const dur = (Date.now() - w.startedAt) / 1000;
  sheet(`<h3>Terminer la séance</h3>
    <div class="stat-row mt"><div class="stat"><b class="num">${fmtClock(dur)}</b><span>durée</span></div>
    <div class="stat"><b class="num">${done}/${total}</b><span>séries</span></div>
    <div class="stat"><b class="num">${Math.round(sum.volume).toLocaleString('fr-FR')}</b><span>lb soulevées</span></div></div>
    ${sum.records.length ? `<div class="card accent-card mt"><b>🏆 Nouveaux records (1RM estimé)</b>${sum.records.map(r => `<div class="small">${esc(r.name)} : ${Math.round(r.e1rm)} lb (avant ${Math.round(r.prev)})</div>`).join('')}</div>` : ''}
    ${done < total ? `<p class="small amber mt">${total - done} série${total - done > 1 ? 's' : ''} non faite${total - done > 1 ? 's' : ''} : elles ne seront pas comptées.</p>` : ''}
    <label class="field"><span>Notes (facultatif)</span><textarea id="fin-notes" placeholder="Sensations, énergie, douleurs…">${esc(w.notes || '')}</textarea></label>
    <div class="row gap mt"><button class="btn ghost grow" data-a="sheet-close">Continuer</button><button class="btn primary grow" data-a="wk-save">${icon('check', 's')} Enregistrer</button></div>`);
}

import { state, save, getSession, getEx, allExercises, cycleWeek, setCycleWeek, newUid, addCustomExercise, isoDate } from '../store.js';
import { CYCLE, PROGRAM_NOTES, REFERENCES, defaultProgram } from '../data/program.js';
import { GROUPS, exImages } from '../data/exercises.js';
import { MUSCLES } from '../muscles.js';
import { blocks } from '../engine.js';
import { icon, esc, fmtMin, fmtRest, sheet, closeSheet, confirmSheet, toast, go, rerender, $, $$ } from '../ui.js';
import { tabbar, sessionStats, repsLabel } from './common.js';

const REST_OPTS = [30, 45, 60, 75, 90, 120, 150, 180, 240, 300];

export function render() {
  const week = cycleWeek();
  let html = `<header class="page-head"><h1>Programme</h1></header>
  <section class="card"><div class="row between"><h3>Cycle de 8 semaines</h3><span class="chip accent">Semaine ${week}</span></div>
    <div class="row between mt"><span class="small muted">Semaine actuelle</span><div class="mini-step">
      <button data-a="cyc-week" data-d="-1" aria-label="Semaine précédente">${icon('minus', 's')}</button><span class="v">${week}</span>
      <button data-a="cyc-week" data-d="1" aria-label="Semaine suivante">${icon('plus', 's')}</button></div></div>
    <label class="switch"><span class="small">Ajuster automatiquement le nombre de séries selon la phase</span><input type="checkbox" data-c="set-toggle" data-k="autoCycle" ${state.settings.autoCycle ? 'checked' : ''}></label>
    <div class="list mt">${CYCLE.map(p => `<div class="row gap" style="align-items:flex-start;${p.weeks.includes(week) ? '' : 'opacity:.6'}">
      <span class="chip ${p.weeks.includes(week) ? 'accent' : ''}" style="min-width:58px;text-align:center">S${p.weeks.join('–')}</span>
      <div class="grow"><b>${esc(p.name)}</b><div class="small muted">${esc(p.rir)}. ${esc(p.text)}</div></div></div>`).join('')}</div>
    <button class="btn small ghost mt" data-a="cyc-restart">${icon('history', 's')} Démarrer un nouveau cycle cette semaine</button>
  </section>`;

  html += `<div class="section-title">Mes séances</div><div class="list">`;
  for (const s of state.program.sessions) {
    const st = sessionStats(s);
    html += `<a class="card tap row gap" href="#/edit/${encodeURIComponent(s.id)}" style="color:inherit">
      <div class="session-letter ${s.optional ? 'is-opt' : ''}">${esc(s.id.slice(0, 2))}</div>
      <div class="grow"><b>${esc(s.name)}</b><div class="small muted">${esc(s.focus || '')}</div><div class="small muted">${st.exercises} exercices · ${st.sets} séries · ≈ ${fmtMin(st.seconds)}</div></div>${icon('edit')}</a>`;
  }
  html += `</div><button class="btn soft block mt" data-a="sess-add">${icon('plus', 's')} Nouvelle séance</button>`;

  html += `<div class="section-title">Pourquoi ces choix ?</div>
    ${PROGRAM_NOTES.map(n => `<details class="acc"><summary>${esc(n.title)} ${icon('down', 's')}</summary><div>${esc(n.body)}</div></details>`).join('')}
    <details class="acc"><summary>Références scientifiques ${icon('down', 's')}</summary><div><ul class="tips">${REFERENCES.map(r => `<li class="small">${esc(r)}</li>`).join('')}</ul>
    <p class="small">Les principes de la vidéo de Nassim Sahili (exercices de base, suivi des performances, technique, fessiers, cycles, supersets) sont repris ; les affirmations non étayées n’ont pas été utilisées pour construire le programme.</p></div></details>`;
  return html + tabbar('program');
}

// ───── Éditeur de séance ─────
export function renderEditor({ id }) {
  const s = getSession(id);
  if (!s) return `<p class="empty">Séance introuvable.</p>`;
  const st = sessionStats(s);
  let html = `<header class="page-head"><a class="icon-btn" href="#/program" aria-label="Retour">${icon('back')}</a>
    <div class="grow"><h1>Modifier</h1><div class="sub">${esc(s.name)} · ${st.sets} séries · ≈ ${fmtMin(st.seconds)}</div></div>
    <a class="icon-btn" href="#/session/${encodeURIComponent(s.id)}" aria-label="Aperçu">${icon('play')}</a></header>
    <section class="card"><div class="ed-grid" style="margin-top:0">
      <label>Nom<input type="text" value="${esc(s.name)}" data-c="sess-field" data-sid="${esc(s.id)}" data-k="name"></label>
      <label>Objectif / muscles<input type="text" value="${esc(s.focus || '')}" data-c="sess-field" data-sid="${esc(s.id)}" data-k="focus"></label></div>
      <label class="switch mt-s"><span class="small">Séance facultative</span><input type="checkbox" data-c="sess-opt" data-sid="${esc(s.id)}" ${s.optional ? 'checked' : ''}></label>
    </section><p class="tiny muted">Les modifications sont enregistrées automatiquement. Elles s’appliquent aux prochaines séances.</p>`;

  const items = s.items;
  items.forEach((it, idx) => {
    const ex = getEx(it.ex);
    const inSS = !!it.ss && ((items[idx - 1]?.ss === it.ss) || (items[idx + 1]?.ss === it.ss));
    const linkedNext = !!it.ss && items[idx + 1]?.ss === it.ss;
    const img = exImages(ex)[1];
    html += `<div class="ed-item ${inSS ? 'in-ss' : ''}">
      <div class="row gap"><div class="thumb" style="width:48px;height:48px">${img ? `<img src="${img.src}" alt="">` : icon('dumbbell')}</div>
        <div class="grow"><b>${idx + 1}. ${esc(ex.name)}</b>${inSS ? ' <span class="chip amber">superset</span>' : ''}<div class="small muted">${esc(ex.group || '')}</div></div>
        <button class="icon-btn" data-a="ed-change" data-sid="${esc(s.id)}" data-uid="${it.uid}" aria-label="Changer d’exercice">${icon('swap', 's')}</button></div>
      <div class="ed-grid">
        <label>Séries<div class="mini-step"><button data-a="ed-num" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="sets" data-d="-1">${icon('minus', 's')}</button><span class="v">${it.sets}</span><button data-a="ed-num" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="sets" data-d="1">${icon('plus', 's')}</button></div></label>
        <label>Repos<select data-c="ed-field" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="rest">${[...new Set([...REST_OPTS, it.rest])].sort((a, b) => a - b).map(r => `<option value="${r}" ${r === it.rest ? 'selected' : ''}>${fmtRest(r)}</option>`).join('')}</select></label>
        <label>Reps min<input type="number" inputmode="numeric" value="${it.reps[0]}" data-c="ed-field" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="rmin"></label>
        <label>Reps max<input type="number" inputmode="numeric" value="${it.reps[1]}" data-c="ed-field" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="rmax"></label>
        <label>Charge de départ (lb)<input type="text" inputmode="decimal" placeholder="auto" value="${it.load ?? ''}" data-c="ed-field" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="load"></label>
        <label>Pas de charge (lb)<input type="text" inputmode="decimal" value="${it.increment ?? ex.increment ?? 5}" data-c="ed-field" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-k="increment"></label>
      </div>
      <div class="ed-tools">
        <button class="btn small" data-a="ed-move" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-d="-1" ${idx === 0 ? 'disabled' : ''} aria-label="Monter">${icon('up', 's')}</button>
        <button class="btn small" data-a="ed-move" data-sid="${esc(s.id)}" data-uid="${it.uid}" data-d="1" ${idx === items.length - 1 ? 'disabled' : ''} aria-label="Descendre">${icon('down', 's')}</button>
        ${idx < items.length - 1 ? `<button class="btn small ${linkedNext ? 'soft' : ''}" data-a="ed-ss" data-sid="${esc(s.id)}" data-uid="${it.uid}">${icon('bolt', 's')} ${linkedNext ? 'Superset avec le suivant ✓' : 'Superset avec le suivant'}</button>` : ''}
        <button class="btn small ${it.warmup ? 'soft' : ''}" data-a="ed-warm" data-sid="${esc(s.id)}" data-uid="${it.uid}">${icon('timer', 's')} Échauffement${it.warmup ? ' ✓' : ''}</button>
        <button class="btn small danger" data-a="ed-del" data-sid="${esc(s.id)}" data-uid="${it.uid}" aria-label="Supprimer">${icon('trash', 's')}</button>
      </div></div>`;
  });
  html += `<button class="btn soft block mt" data-a="ed-add" data-sid="${esc(s.id)}">${icon('plus', 's')} Ajouter un exercice</button>
    <div class="row gap mt-l"><button class="btn ghost grow" data-a="sess-reset" data-sid="${esc(s.id)}">Réinitialiser</button>
    <button class="btn danger grow" data-a="sess-del" data-sid="${esc(s.id)}">${icon('trash', 's')} Supprimer la séance</button></div>`;
  return html;
}

const findItem = (sid, uid) => { const s = getSession(sid); return { s, it: s?.items.find(i => i.uid === uid), idx: s?.items.findIndex(i => i.uid === uid) }; };

// Recalcule les clés de superset pour ne garder que des groupes consécutifs valides.
function normalizeSS(s) {
  const items = s.items;
  items.forEach((it, i) => {
    if (!it.ss) return;
    const prev = items[i - 1], next = items[i + 1];
    if (!(prev && prev.ss === it.ss) && !(next && next.ss === it.ss)) it.ss = null;
  });
}

function pickerSheet(title, onPick, { allowCustom = true } = {}) {
  const all = allExercises();
  const render = (q = '', g = '') => all.filter(e => (!g || e.group === g) && (!q || e.name.toLowerCase().includes(q.toLowerCase())))
    .map(e => { const img = exImages(e)[1]; return `<button class="opt" data-pick="${esc(e.id)}"><div class="thumb" style="width:44px;height:44px">${img ? `<img src="${img.src}" alt="">` : icon('dumbbell')}</div><div>${esc(e.name)}<small>${esc(e.group)} · ${esc(e.equipment || '')}</small></div></button>`; }).join('') || '<p class="muted small">Aucun résultat.</p>';
  sheet(`<h3>${esc(title)}</h3><input type="search" id="pk-q" placeholder="Rechercher…" autocomplete="off">
    <div class="chips mt-s" id="pk-g"><button class="chip sel" data-g="">Tous</button>${[...GROUPS, 'Autre'].map(g => `<button class="chip" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>
    <div class="opt-list" id="pk-list">${render()}</div>
    ${allowCustom ? `<button class="btn ghost block mt" id="pk-custom">${icon('plus', 's')} Créer un exercice personnalisé</button>` : ''}`);
  let g = '';
  const list = $('#pk-list');
  $('#pk-q').addEventListener('input', e => { list.innerHTML = render(e.target.value, g); });
  $('#pk-g').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; g = b.dataset.g; $$('#pk-g .chip').forEach(c => c.classList.toggle('sel', c === b)); list.innerHTML = render($('#pk-q').value, g); });
  list.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) { closeSheet(); onPick(b.dataset.pick); } });
  $('#pk-custom')?.addEventListener('click', () => customSheet(onPick));
}

export function customSheet(onDone) {
  sheet(`<h3>Exercice personnalisé</h3>
    <label class="field"><span>Nom</span><input type="text" id="cx-name" placeholder="Ex. : Pull-over à la poulie"></label>
    <div class="ed-grid"><label>Groupe<select id="cx-group">${[...GROUPS, 'Autre'].map(g => `<option>${esc(g)}</option>`).join('')}</select></label>
    <label>Matériel<select id="cx-kind"><option value="machine">Machine</option><option value="cable">Poulie</option><option value="dumbbell">Haltères</option><option value="barbell">Barre</option><option value="bodyweight">Poids du corps</option></select></label>
    <label>Muscle principal<select id="cx-muscle"><option value="">—</option>${Object.entries(MUSCLES).map(([k, m]) => `<option value="${k}">${esc(m.label)}</option>`).join('')}</select></label>
    <label>Pas de charge (lb)<input type="text" inputmode="decimal" id="cx-inc" value="5"></label></div>
    <label class="switch"><span class="small">Unilatéral (reps par côté)</span><input type="checkbox" id="cx-uni"></label>
    <label class="field"><span>Consignes (une par ligne, facultatif)</span><textarea id="cx-notes"></textarea></label>
    <button class="btn primary block mt" id="cx-save">Créer</button>`);
  $('#cx-save').addEventListener('click', () => {
    const name = $('#cx-name').value.trim();
    if (!name) { toast('Donne un nom à l’exercice.'); return; }
    const kind = $('#cx-kind').value;
    const ex = addCustomExercise({ name, group: $('#cx-group').value, kind, equipment: $('#cx-kind').selectedOptions[0].text, load: kind === 'dumbbell' ? 'perDb' : kind === 'bodyweight' ? 'body' : 'total', increment: parseFloat($('#cx-inc').value.replace(',', '.')) || 5, unilateral: $('#cx-uni').checked, primary: $('#cx-muscle').value ? [$('#cx-muscle').value] : [], notes: $('#cx-notes').value });
    closeSheet();
    toast('Exercice créé');
    if (onDone) onDone(ex.id); else rerender();
  });
}

export const actions = {
  'cyc-week': el => { const w = Math.min(8, Math.max(1, cycleWeek() + (+el.dataset.d))); setCycleWeek(w); rerender(); },
  'cyc-restart': async () => {
    const ok = await confirmSheet('Nouveau cycle', 'La semaine en cours deviendra la semaine 1. L’historique est conservé.', 'Démarrer');
    if (ok) { setCycleWeek(1); toast('Nouveau cycle démarré'); rerender(); }
  },
  'sess-add': () => {
    const used = new Set(state.program.sessions.map(s => s.id));
    const id = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(l => !used.has(l)) || 'S' + Date.now().toString(36).slice(-3);
    state.program.sessions.push({ id, name: 'Séance ' + id, focus: '', optional: false, items: [] });
    save(); go('#/edit/' + id);
  },
  'sess-del': async el => {
    const s = getSession(el.dataset.sid);
    const ok = await confirmSheet(`Supprimer ${s.name} ?`, 'L’historique de cette séance est conservé.', 'Supprimer', true);
    if (!ok) return;
    state.program.sessions = state.program.sessions.filter(x => x.id !== s.id);
    save(); go('#/program');
  },
  'sess-reset': async el => {
    const def = defaultProgram().sessions.find(x => x.id === el.dataset.sid);
    if (!def) { toast('Pas de version par défaut pour cette séance.'); return; }
    const ok = await confirmSheet('Réinitialiser la séance ?', 'Elle reprendra la version proposée par l’application (charges de départ effacées).', 'Réinitialiser', true);
    if (!ok) return;
    const i = state.program.sessions.findIndex(x => x.id === def.id);
    state.program.sessions[i] = def; save(); rerender();
  },
  'ed-num': el => { const { it } = findItem(el.dataset.sid, el.dataset.uid); it.sets = Math.min(10, Math.max(1, it.sets + (+el.dataset.d))); save(); rerender(); },
  'ed-move': el => {
    const { s, idx } = findItem(el.dataset.sid, el.dataset.uid); const j = idx + (+el.dataset.d);
    if (j < 0 || j >= s.items.length) return;
    [s.items[idx], s.items[j]] = [s.items[j], s.items[idx]];
    normalizeSS(s); save(); rerender();
  },
  'ed-ss': el => {
    const { s, it, idx } = findItem(el.dataset.sid, el.dataset.uid); const next = s.items[idx + 1];
    if (!next) return;
    if (it.ss && next.ss === it.ss) {
      // délier : le suivant et ceux d'après reçoivent une nouvelle clé
      const key = 'ss' + Math.random().toString(36).slice(2, 7);
      for (let k = idx + 1; k < s.items.length && s.items[k].ss === it.ss; k++) s.items[k].ss = key;
    } else {
      const key = it.ss || next.ss || 'ss' + Math.random().toString(36).slice(2, 7);
      const old = next.ss;
      it.ss = key;
      if (old && old !== key) s.items.forEach(x => { if (x.ss === old) x.ss = key; }); else next.ss = key;
    }
    normalizeSS(s); save(); rerender();
  },
  'ed-warm': el => { const { it } = findItem(el.dataset.sid, el.dataset.uid); it.warmup = !it.warmup; save(); rerender(); },
  'ed-del': async el => {
    const { s, it } = findItem(el.dataset.sid, el.dataset.uid);
    const ok = await confirmSheet('Retirer cet exercice ?', esc(getEx(it.ex).name), 'Retirer', true);
    if (!ok) return;
    s.items = s.items.filter(x => x.uid !== it.uid); normalizeSS(s); save(); rerender();
  },
  'ed-add': el => pickerSheet('Ajouter un exercice', exId => {
    const s = getSession(el.dataset.sid);
    const ex = getEx(exId);
    s.items.push({ uid: newUid(), ex: exId, sets: 3, reps: [8, 12], rest: ex.kind === 'barbell' ? 150 : 90, increment: ex.increment || state.settings.defaultIncrement });
    save(); rerender(); toast(`${esc(ex.name)} ajouté`);
  }),
  'ed-change': el => pickerSheet('Changer d’exercice', exId => {
    const { it } = findItem(el.dataset.sid, el.dataset.uid); it.ex = exId; it.increment = getEx(exId).increment || it.increment; save(); rerender();
  })
};

export const changes = {
  'sess-field': el => { const s = getSession(el.dataset.sid); s[el.dataset.k] = el.value; save(); },
  'sess-opt': el => { const s = getSession(el.dataset.sid); s.optional = el.checked; save(); },
  'ed-field': el => {
    const { it } = findItem(el.dataset.sid, el.dataset.uid);
    const k = el.dataset.k, v = String(el.value).replace(',', '.');
    if (k === 'rest') it.rest = +v;
    else if (k === 'rmin') it.reps[0] = Math.max(1, parseInt(v, 10) || 1);
    else if (k === 'rmax') it.reps[1] = Math.max(1, parseInt(v, 10) || 1);
    else if (k === 'load') it.load = v === '' ? null : Math.max(0, parseFloat(v) || 0);
    else if (k === 'increment') it.increment = Math.max(0.5, parseFloat(v) || 5);
    if (it.reps[0] > it.reps[1]) it.reps = [it.reps[1], it.reps[0]];
    save();
    if (k === 'rest') rerender();
  }
};

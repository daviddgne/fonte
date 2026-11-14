// Moteur de séance : fonctions pures (aucun accès au DOM ni au stockage) → testables (voir tests/).

export const WORK_SEC = 40;        // durée moyenne d'une série (estimation de durée)
export const TRANSITION_SEC = 90;  // changement d'exercice, chargement de la barre, réglages
export const SS_SWITCH_SEC = 15;   // passage d'un exercice à l'autre dans un superset
export const WARMUP_SEC = 9 * 60;  // échauffement guidé : 5 min d'elliptique + ~4 min de mobilité
export const RAMP_SEC = 3 * 60;    // séries d'approche d'un exercice marqué « échauffement »

// Regroupe les exercices consécutifs partageant la même clé de superset.
export function blocks(items) {
  const out = [];
  for (const it of items) {
    const last = out[out.length - 1];
    if (it.ss && last && last.ss === it.ss) last.items.push(it);
    else out.push({ ss: it.ss || null, items: [it] });
  }
  for (const b of out) b.superset = b.items.length > 1;
  return out;
}

// Nombre de séries effectif selon la phase du cycle.
export function effectiveSets(sets, phase, auto = true) {
  if (!auto || !phase || !phase.setDelta) return sets;
  if (sets < (phase.minSets || 1)) return sets;
  return Math.max(1, sets + phase.setDelta);
}

export function estimateSeconds(items, getEx = () => null, { phase = null, auto = true, warmup = true } = {}) {
  let t = warmup ? WARMUP_SEC : 0;
  t += items.filter(i => i.warmup).length * RAMP_SEC;
  for (const b of blocks(items)) {
    const sets = b.items.map(i => effectiveSets(i.sets, phase, auto));
    const rounds = Math.max(...sets);
    const rest = Math.max(...b.items.map(i => i.rest || 0));
    for (let r = 0; r < rounds; r++) {
      const inRound = b.items.filter((_, k) => sets[k] > r);
      for (const i of inRound) t += WORK_SEC * (getEx(i.ex)?.unilateral ? 2 : 1);
      t += (inRound.length - 1) * SS_SWITCH_SEC;
      if (r < rounds - 1) t += rest;
    }
    t += TRANSITION_SEC + rest * 0.5; // dernière récupération partielle avant l'exercice suivant
  }
  return Math.round(t);
}

// ───── État d'une séance en cours ─────
export const doneCount = (w, uid) => (w.log[uid] || []).length;
export const totalSets = w => w.items.reduce((s, i) => s + i.sets, 0);
export const doneSets = w => w.items.reduce((s, i) => s + Math.min(doneCount(w, i.uid), i.sets), 0);
export const progress = w => { const t = totalSets(w); return t ? doneSets(w) / t : 0; };
export const itemComplete = (w, it) => doneCount(w, it.uid) >= it.sets;

function blockOf(w, uid) {
  return blocks(w.items).find(b => b.items.some(i => i.uid === uid));
}

// Prochaine étape dans un bloc : l'exercice le moins avancé (ordre du superset en cas d'égalité).
function nextInBlock(w, b) {
  let best = null;
  for (const it of b.items) {
    const d = doneCount(w, it.uid);
    if (d >= it.sets) continue;
    if (!best || d < best.d) best = { it, d };
  }
  return best ? { uid: best.it.uid, set: best.d + 1 } : null;
}

// Étape courante : bloc ciblé (focus) s'il reste des séries, sinon premier bloc incomplet.
export function nextStep(w) {
  const bl = blocks(w.items);
  if (w.focus) {
    const fb = bl.find(b => b.items.some(i => i.uid === w.focus));
    const s = fb && nextInBlock(w, fb);
    if (s) return s;
  }
  for (const b of bl) { const s = nextInBlock(w, b); if (s) return s; }
  return null;
}

// Après validation d'une série de `uid` : repos à lancer ou enchaînement de superset.
export function afterSet(w, uid) {
  const next = nextStep(w);
  if (!next) return { finished: true, rest: 0, next: null, chain: false };
  const b = blockOf(w, uid);
  if (b && b.superset && b.items.some(i => i.uid === next.uid)) {
    const idxDone = b.items.findIndex(i => i.uid === uid);
    const idxNext = b.items.findIndex(i => i.uid === next.uid);
    if (idxNext > idxDone) return { finished: false, rest: 0, next, chain: true };
  }
  const rest = b ? Math.max(...b.items.map(i => i.rest || 0)) : 0;
  return { finished: false, rest, next, chain: false };
}

// ───── Historique & progression ─────
// Dernières performances d'un exercice (hors séance en cours).
export function lastPerformance(history, exId) {
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    const e = h.entries.find(x => x.ex === exId && x.sets.length);
    if (e) return { date: h.start, sets: e.sets, planned: e.planned };
  }
  return null;
}

export const e1rm = (load, reps) => (load > 0 && reps > 0 ? load * (1 + reps / 30) : 0); // Epley
export const roundTo = (x, step) => Math.round(x / step) * step;

// Double progression : même charge tant que toutes les séries n'atteignent pas le haut de la fourchette.
export function suggestion(history, item, increment = 5) {
  const last = lastPerformance(history, item.ex);
  const [rmin, rmax] = item.reps;
  if (!last) {
    return { load: item.load ?? null, reps: Array(item.sets).fill(rmin), reason: 'first', last: null };
  }
  const work = last.sets;
  const topLoad = Math.max(...work.map(s => s.load || 0));
  const atTop = work.filter(s => (s.load || 0) === topLoad);
  const pain = work.some(s => s.pain);
  const allMax = work.length >= Math.min(item.sets, last.planned?.sets || item.sets) && work.every(s => s.reps >= rmax && (s.load || 0) >= topLoad);
  if (pain) {
    return { load: topLoad || item.load || null, reps: Array(item.sets).fill(rmin), reason: 'pain', last };
  }
  if (allMax && topLoad > 0) {
    return { load: topLoad + increment, reps: Array(item.sets).fill(rmin), reason: 'increase', last };
  }
  const reps = Array.from({ length: item.sets }, (_, k) => {
    const prev = work[k] || work[work.length - 1];
    const base = prev && (prev.load || 0) === topLoad ? prev.reps : (atTop[0]?.reps ?? rmin);
    return Math.min(rmax, Math.max(rmin, base + 1));
  });
  return { load: topLoad || item.load || null, reps, reason: 'reps', last };
}

// Valeurs proposées pour la série `set` (1-based) d'un exercice dans la séance en cours.
export function prefill(w, item, sugg) {
  const log = w.log[item.uid] || [];
  const prev = log[log.length - 1];
  const k = Math.min(log.length, (sugg?.reps?.length || 1) - 1);
  const load = prev ? prev.load : (sugg?.load ?? item.load ?? 0);
  const reps = sugg?.reps?.[k] ?? item.reps[0];
  return { load: load ?? 0, reps };
}

// Séries d'approche (non comptées). Barre : barre à vide puis paliers ; autres : 2 paliers.
export function warmupSets(work, { barbell = false, bar = 45, step = 5 } = {}) {
  if (!work || work <= 0) return [];
  const plan = barbell ? [[0, 10], [0.5, 8], [0.7, 5], [0.85, 3]] : [[0.5, 10], [0.75, 5]];
  const out = [];
  for (const [pct, reps] of plan) {
    let l = pct === 0 ? bar : roundTo(work * pct, step);
    if (barbell) l = Math.max(bar, l);
    if (l >= work) continue;
    if (out.length && out[out.length - 1].load >= l) continue;
    out.push({ load: l, reps });
  }
  return out;
}

// Disques par côté (barre olympique en lb).
export function platesPerSide(total, bar = 45, plates = [45, 35, 25, 10, 5, 2.5]) {
  let side = (total - bar) / 2;
  if (side <= 0) return { plates: [], rest: 0 };
  const out = [];
  for (const p of [...plates].sort((a, b) => b - a)) {
    while (side >= p - 1e-9) { out.push(p); side -= p; }
  }
  return { plates: out, rest: Math.round(side * 100) / 100 };
}

// Résumé d'une séance terminée (utilisé pour l'historique).
export function summarize(w, history) {
  const entries = w.items.map(it => ({
    uid: it.uid, ex: it.ex, name: it.name,
    planned: { sets: it.sets, reps: it.reps },
    sets: (w.log[it.uid] || []).map(s => ({ load: s.load, reps: s.reps, pain: !!s.pain, ts: s.ts }))
  }));
  const volume = entries.reduce((v, e) => v + e.sets.reduce((a, s) => a + (s.load || 0) * s.reps, 0), 0);
  const records = [];
  for (const e of entries) {
    if (!e.sets.length) continue;
    const best = Math.max(...e.sets.map(s => e1rm(s.load, s.reps)));
    let prevBest = 0;
    for (const h of history) for (const x of h.entries) if (x.ex === e.ex) for (const s of x.sets) prevBest = Math.max(prevBest, e1rm(s.load, s.reps));
    if (best > 0 && prevBest > 0 && best > prevBest + 0.01) records.push({ ex: e.ex, name: e.name, e1rm: best, prev: prevBest });
  }
  return { entries, volume, records, totalSets: totalSets(w), doneSets: doneSets(w) };
}

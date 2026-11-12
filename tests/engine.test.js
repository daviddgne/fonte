// Tests du moteur de séance. Ouvrir tests/index.html (via un serveur local ou GitHub Pages).
import { blocks, effectiveSets, nextStep, afterSet, progress, doneSets, totalSets, suggestion, prefill, warmupSets, platesPerSide, estimateSeconds, summarize, e1rm } from '../js/engine.js';
import { CYCLE, phaseForWeek, defaultProgram } from '../js/data/program.js';
import { EX, EXERCISES } from '../js/data/exercises.js';
import { MUSCLES } from '../js/muscles.js';
import { SHAPES } from '../js/data/muscle-shapes.js';

const results = [];
const test = (name, fn) => { try { fn(); results.push([name, true]); } catch (e) { results.push([name, false, e.message]); } };
const eq = (a, b, msg = '') => { const A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) throw new Error(`${msg} attendu ${B}, obtenu ${A}`); };
const ok = (c, msg) => { if (!c) throw new Error(msg || 'condition fausse'); };

const mk = (items) => ({ items, log: {}, focus: null });
const log = (w, uid, load = 100, reps = 10, pain = false) => { (w.log[uid] = w.log[uid] || []).push({ load, reps, pain, ts: Date.now() }); };

test('blocks : regroupe les supersets consécutifs', () => {
  const b = blocks([{ uid: 'a' }, { uid: 'b', ss: 'x' }, { uid: 'c', ss: 'x' }, { uid: 'd' }]);
  eq(b.map(x => x.items.map(i => i.uid)), [['a'], ['b', 'c'], ['d']]);
  eq(b.map(x => x.superset), [false, true, false]);
});

test('effectiveSets : -1 série en adaptation (exercices ≥ 3 séries) et en décharge', () => {
  eq(effectiveSets(3, phaseForWeek(1)), 2);
  eq(effectiveSets(2, phaseForWeek(1)), 2);
  eq(effectiveSets(3, phaseForWeek(4)), 3);
  eq(effectiveSets(2, phaseForWeek(8)), 1);
  eq(effectiveSets(3, phaseForWeek(1), false), 3, 'option désactivée');
});

test('% de séance = séries faites / séries prévues de TOUTE la séance (exemple 9/18 = 50 %)', () => {
  const items = Array.from({ length: 6 }, (_, i) => ({ uid: 'e' + i, sets: 3, reps: [8, 12], rest: 90 }));
  const w = mk(items);
  for (let i = 0; i < 3; i++) for (let s = 0; s < 3; s++) log(w, 'e' + i);
  eq(totalSets(w), 18); eq(doneSets(w), 9); eq(progress(w), 0.5);
});

test('Exercice simple : repos après chaque série, pas de repos après la dernière série de la séance', () => {
  const w = mk([{ uid: 'a', sets: 2, reps: [8, 12], rest: 120 }, { uid: 'b', sets: 1, reps: [8, 12], rest: 90 }]);
  eq(nextStep(w), { uid: 'a', set: 1 });
  log(w, 'a'); let r = afterSet(w, 'a'); eq([r.rest, r.chain, r.next], [120, false, { uid: 'a', set: 2 }]);
  log(w, 'a'); r = afterSet(w, 'a'); eq([r.rest, r.next], [120, { uid: 'b', set: 1 }]);
  log(w, 'b'); r = afterSet(w, 'b'); eq([r.finished, r.rest], [true, 0]);
});

test('Superset : A1 → A2 sans repos, puis repos, puis A1…', () => {
  const w = mk([{ uid: 'x', sets: 3, reps: [12, 20], rest: 90, ss: 's' }, { uid: 'y', sets: 2, reps: [10, 15], rest: 60, ss: 's' }, { uid: 'z', sets: 1, reps: [8, 12], rest: 120 }]);
  const seq = [];
  for (let i = 0; i < 6; i++) {
    const s = nextStep(w); if (!s) break;
    log(w, s.uid); const r = afterSet(w, s.uid);
    seq.push(`${s.uid}${s.set}:${r.chain ? 'enchaîne' : r.rest}`);
  }
  eq(seq, ['x1:enchaîne', 'y1:90', 'x2:enchaîne', 'y2:90', 'x3:90', 'z1:0']);
});

test('Focus : choisir un autre exercice (machine occupée) puis revenir', () => {
  const w = mk([{ uid: 'a', sets: 2, reps: [8, 12], rest: 60 }, { uid: 'b', sets: 2, reps: [8, 12], rest: 60 }]);
  w.focus = 'b';
  eq(nextStep(w), { uid: 'b', set: 1 });
  log(w, 'b'); log(w, 'b');
  eq(nextStep(w), { uid: 'a', set: 1 }, 'retour au premier exercice incomplet');
});

const hist = (sets, planned = 3) => [{ start: 1, entries: [{ ex: 'squat', sets, planned: { sets: planned, reps: [6, 10] } }] }];
const item = { uid: 'q', ex: 'squat', sets: 3, reps: [6, 10], rest: 180, load: null };

test('Double progression : toutes les séries au haut de la fourchette → +5 lb, retour au bas', () => {
  const s = suggestion(hist([{ load: 135, reps: 10 }, { load: 135, reps: 10 }, { load: 135, reps: 10 }]), item, 5);
  eq([s.reason, s.load, s.reps], ['increase', 140, [6, 6, 6]]);
});
test('Double progression : sinon même charge, +1 rep visée par série (plafonnée)', () => {
  const s = suggestion(hist([{ load: 135, reps: 10 }, { load: 135, reps: 8 }, { load: 135, reps: 7 }]), item, 5);
  eq([s.reason, s.load, s.reps], ['reps', 135, [10, 9, 8]]);
});
test('Douleur la dernière fois → pas d’augmentation proposée', () => {
  const s = suggestion(hist([{ load: 135, reps: 10, pain: true }, { load: 135, reps: 10 }, { load: 135, reps: 10 }]), item, 5);
  eq([s.reason, s.load], ['pain', 135]);
});
test('Première fois : charge de départ du programme', () => {
  const s = suggestion([], { ...item, load: 95 }, 5);
  eq([s.reason, s.load], ['first', 95]);
});
test('Pré-remplissage : reprend la charge de la série précédente de la séance', () => {
  const w = mk([item]); log(w, 'q', 145, 9);
  const p = prefill(w, item, { load: 135, reps: [10, 9, 8] });
  eq(p, { load: 145, reps: 9 });
});

test('Échauffement barre : paliers croissants arrondis à 5 lb, sous la charge de travail', () => {
  eq(warmupSets(185, { barbell: true }), [{ load: 45, reps: 10 }, { load: 95, reps: 8 }, { load: 130, reps: 5 }, { load: 155, reps: 3 }]);
  ok(warmupSets(60, { barbell: true }).every(s => s.load < 60), 'charge légère : paliers sous la charge de travail');
  eq(warmupSets(50, { barbell: false }), [{ load: 25, reps: 10 }, { load: 40, reps: 5 }], 'haltères/machine : 2 paliers');
});
test('Disques par côté (barre 45 lb)', () => {
  eq(platesPerSide(225).plates, [45, 45]);
  eq(platesPerSide(140).plates, [45, 2.5]);
  eq(platesPerSide(185).plates, [45, 25]);
  eq(platesPerSide(45).plates, []);
});

test('Durées estimées du programme par défaut : ≤ 75 min (semaine 3, volume complet)', () => {
  const p = defaultProgram();
  const get = id => EX[id];
  for (const s of p.sessions) {
    const sec = estimateSeconds(s.items, get, { phase: phaseForWeek(3), auto: true });
    ok(sec <= 75 * 60, `${s.name} : ${Math.round(sec / 60)} min`);
  }
});

test('Programme : aucune extension directe des triceps', () => {
  const p = defaultProgram();
  const ids = p.sessions.flatMap(s => s.items.map(i => i.ex));
  ok(!ids.some(id => /triceps|extension-triceps|pushdown|skull/i.test(id)), ids.join(','));
  ok(ids.every(id => EX[id]), 'tous les exercices existent dans la bibliothèque');
});

test('Bibliothèque : muscles connus, alternatives existantes, vidéos au bon format', () => {
  for (const e of EXERCISES) {
    for (const m of [...e.muscles.primary, ...e.muscles.secondary, ...e.muscles.stabilizers]) ok(MUSCLES[m], `${e.id} : muscle inconnu ${m}`);
    for (const a of e.alts || []) ok(EX[a], `${e.id} : alternative inconnue ${a}`);
    for (const v of e.videos || []) ok(/^[\w-]{11}$/.test(v.id), `${e.id} : id vidéo ${v.id}`);
    ok(e.steps.length >= 3, `${e.id} : instructions`);
    ok(e.errors.length >= 1, `${e.id} : erreurs`);
  }
  for (const [k, m] of Object.entries(MUSCLES)) for (const s of m.shapes) ok(SHAPES[s], `${k} : forme ${s} absente`);
});

test('Résumé de séance : volume et record (1RM estimé, Epley)', () => {
  const w = mk([{ uid: 'q', ex: 'squat', name: 'Squat', sets: 2, reps: [6, 10] }]);
  log(w, 'q', 140, 8); log(w, 'q', 140, 7);
  const prev = [{ entries: [{ ex: 'squat', sets: [{ load: 135, reps: 8 }] }] }];
  const s = summarize(w, prev);
  eq(s.volume, 140 * 8 + 140 * 7);
  eq(s.records.length, 1);
  ok(Math.abs(s.records[0].e1rm - e1rm(140, 8)) < 1e-9);
});

// Affichage
const pass = results.filter(r => r[1]).length;
document.getElementById('out').innerHTML = `<h1>${pass}/${results.length} tests réussis</h1>` +
  results.map(([n, p, m]) => `<div class="${p ? 'ok' : 'ko'}">${p ? '✔' : '✘'} ${n}${m ? `<br><small>${m}</small>` : ''}</div>`).join('');
window.__testResults = { pass, total: results.length, failed: results.filter(r => !r[1]) };

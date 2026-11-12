// Stockage local (localStorage) + sauvegarde / restauration.
import { defaultProgram, phaseForWeek } from './data/program.js';
import { EX } from './data/exercises.js';

const KEY = 'fonte.v1';
const VERSION = 1;

function mondayOf(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7; // lundi = 0
  x.setDate(x.getDate() - day);
  return x;
}
export const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function defaultSettings() {
  return {
    cycleStart: isoDate(mondayOf()),
    autoCycle: true,
    sound: true,
    vibrate: true,
    keepAwake: true,
    notify: false,
    defaultIncrement: 5,
    barWeight: 45,
    plates: [45, 35, 25, 10, 5, 2.5],
    lastBackup: null
  };
}

function fresh() {
  return { version: VERSION, createdAt: Date.now(), settings: defaultSettings(), program: defaultProgram(), custom: [], history: [], active: null, prefs: {} };
}

export let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    return migrate(JSON.parse(raw));
  } catch (e) {
    console.error('Lecture des données impossible', e);
    return fresh();
  }
}

function migrate(s) {
  const base = fresh();
  return {
    ...base, ...s,
    settings: { ...base.settings, ...(s.settings || {}) },
    program: s.program && Array.isArray(s.program.sessions) ? s.program : base.program,
    custom: Array.isArray(s.custom) ? s.custom : [],
    history: Array.isArray(s.history) ? s.history : [],
    prefs: s.prefs || {},
    version: VERSION
  };
}

let saveErr = null;
export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    saveErr = null;
    return true;
  } catch (e) {
    saveErr = e;
    console.error('Sauvegarde impossible', e);
    return false;
  }
}
export const lastSaveError = () => saveErr;

export function replaceState(next) { state = migrate(next); save(); }
export function resetAll() { state = fresh(); save(); }

// Demande au navigateur de ne pas effacer les données en cas de manque d'espace.
export async function requestPersistence() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch (e) { /* ignoré */ }
  return false;
}

// ───── Exercices (bibliothèque + personnalisés) ─────
export function getEx(id) {
  return EX[id] || state.custom.find(c => c.id === id) || { id, name: id, group: 'Autre', kind: 'machine', load: 'total', increment: 5, muscles: { primary: [], secondary: [], stabilizers: [] }, steps: [], errors: [], videos: [], alts: [], custom: true, missing: true };
}
export const allExercises = () => [...Object.values(EX), ...state.custom];

export function addCustomExercise(data) {
  const id = 'c_' + Date.now().toString(36);
  const ex = {
    id, custom: true, name: data.name.trim(), group: data.group || 'Autre', equipment: data.equipment || '', kind: data.kind || 'machine',
    load: data.load || 'total', increment: Number(data.increment) || 5, unilateral: !!data.unilateral,
    muscles: { primary: data.primary || [], secondary: [], stabilizers: [] },
    steps: (data.notes || '').split('\n').map(s => s.trim()).filter(Boolean), errors: [], videos: [], alts: [],
    search: data.name.trim() + ' technique'
  };
  state.custom.push(ex);
  save();
  return ex;
}

// ───── Cycle ─────
export function cycleWeek(date = new Date()) {
  const start = new Date(state.settings.cycleStart + 'T00:00:00');
  const days = Math.floor((mondayOf(date) - mondayOf(start)) / 86400000);
  const w = Math.floor(days / 7) + 1;
  return Math.min(8, Math.max(1, w));
}
export const cycleOver = (date = new Date()) => {
  const start = new Date(state.settings.cycleStart + 'T00:00:00');
  return (mondayOf(date) - mondayOf(start)) / 86400000 / 7 >= 8;
};
export function setCycleWeek(week) {
  const m = mondayOf();
  m.setDate(m.getDate() - (week - 1) * 7);
  state.settings.cycleStart = isoDate(m);
  save();
}
export const currentPhase = () => phaseForWeek(cycleWeek());

// ───── Programme ─────
export const getSession = id => state.program.sessions.find(s => s.id === id);
export const newUid = () => 'i' + Math.random().toString(36).slice(2, 9);

// ───── Export / import ─────
export function exportJSON() {
  return JSON.stringify({ app: 'fonte', exportedAt: new Date().toISOString(), ...state }, null, 2);
}

export function validateImport(obj) {
  if (!obj || typeof obj !== 'object') return 'Fichier illisible.';
  if (!obj.program || !Array.isArray(obj.program.sessions)) return 'Programme absent du fichier.';
  if (!Array.isArray(obj.history)) return 'Historique absent du fichier.';
  return null;
}

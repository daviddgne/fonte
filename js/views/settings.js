import { state, save, exportJSON, validateImport, replaceState, resetAll, requestPersistence, isoDate } from '../store.js';
import { defaultProgram } from '../data/program.js';
import { icon, esc, toast, confirmSheet, rerender, go, relDay, $ } from '../ui.js';
import { tabbar } from './common.js';
import { keepAwake } from './workout.js';

export const APP_VERSION = '1.0.0';
let persisted = null;

export function render() {
  const s = state.settings;
  if (persisted === null && navigator.storage?.persisted) navigator.storage.persisted().then(v => { persisted = v; rerender(); });
  const lastB = s.lastBackup;
  const sw = (k, label, sub = '') => `<label class="switch"><span>${label}${sub ? `<br><span class="small muted">${sub}</span>` : ''}</span><input type="checkbox" data-c="set-toggle" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`;
  return `<header class="page-head"><h1>Réglages</h1></header>
  <div class="section-title">Sauvegarde</div>
  <section class="card ${!lastB && state.history.length >= 3 ? 'warn-card' : ''}">
    <p class="small">Tes données sont enregistrées <b>uniquement sur ce téléphone</b>. Exporte une sauvegarde régulièrement (Google Drive, e-mail…).</p>
    <p class="small muted">Dernière sauvegarde : <b>${lastB ? esc(relDay(lastB)) : 'jamais'}</b> · ${state.history.length} séance${state.history.length > 1 ? 's' : ''} enregistrée${state.history.length > 1 ? 's' : ''}
    · stockage ${persisted ? 'protégé' : 'standard'}</p>
    <div class="row gap mt"><button class="btn primary grow" data-a="exp">${icon('download', 's')} Exporter</button>
    <button class="btn grow" data-a="imp">${icon('upload', 's')} Restaurer</button></div>
    <input type="file" id="imp-file" accept="application/json,.json" class="hidden" data-c="imp-file">
    ${persisted ? '' : `<button class="link-btn mt-s" data-a="persist">${icon('check', 's')} Demander la protection du stockage</button>`}
  </section>

  <div class="section-title">Pendant la séance</div>
  <section class="card" style="padding-top:4px;padding-bottom:4px">
    ${sw('warmupGuide', 'Échauffement guidé au début de la séance', 'Elliptique, mobilité avec élastique, puis séries d’approche.')}
    ${sw('sound', 'Son à la fin du repos')}
    ${sw('vibrate', 'Vibration à la fin du repos')}
    ${sw('keepAwake', 'Garder l’écran allumé', 'Recommandé : le chrono reste précis et l’alerte sonne.')}
    ${sw('notify', 'Notification si l’app est en arrière-plan', 'Nécessite ton autorisation.')}
  </section>

  <div class="section-title">Charges (lb)</div>
  <section class="card"><div class="ed-grid" style="margin-top:0">
    <label>Pas par défaut (lb)<input type="text" inputmode="decimal" value="${s.defaultIncrement}" data-c="set-num" data-k="defaultIncrement"></label>
    <label>Poids de la barre (lb)<input type="text" inputmode="decimal" value="${s.barWeight}" data-c="set-num" data-k="barWeight"></label></div>
    <label class="field"><span>Disques disponibles (lb, séparés par des virgules ou espaces)</span><input type="text" value="${esc(s.plates.join(', '))}" data-c="set-plates"></label>
    <p class="tiny muted">Utilisés pour le calcul des disques par côté (squat, développé couché, soulevé de terre…).</p></section>

  <div class="section-title">Données</div>
  <section class="card"><div class="opt-list" style="margin-top:0">
    <button class="opt" data-a="reset-prog">${icon('history')}<div>Réinitialiser le programme<small>Revient au programme proposé. L’historique est conservé.</small></div></button>
    <button class="opt" data-a="reset-all">${icon('trash')}<div>Tout effacer<small>Programme, historique, réglages. Définitif.</small></div></button></div></section>

  <div class="section-title">À propos</div>
  <section class="card small">
    <p><b>Fonte</b> ${APP_VERSION} — carnet de musculation personnel, hors ligne.</p>
    <p class="muted">Code : licence MIT. Illustrations d’exercices : <a href="https://github.com/everkinetic/data" target="_blank" rel="noopener">Everkinetic</a>, CC BY-SA 4.0 (recolorées). Carte musculaire : « Muscular system » par Termininja (Wikimedia Commons) et zones du projet <a href="https://github.com/wger-project/wger" target="_blank" rel="noopener">wger</a>, CC BY-SA 3.0 ; trois zones ajoutées pour cette app. Classement des muscles : ExRx.net. Vidéos : YouTube (Nassim Sahili, Tibo InShape, Jeff Nippard), intégrées via le lecteur officiel.</p>
    <p class="muted">Cette application ne remplace pas l’avis d’un professionnel de santé.</p>
    <p class="tiny faint">Détails : fichier CREDITS.md du projet.</p>
  </section>` + tabbar('settings');
}

function download(name, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const actions = {
  'exp': async () => {
    const name = `fonte-sauvegarde-${isoDate(new Date())}.json`;
    const text = exportJSON();
    try {
      const file = new File([text], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sauvegarde Fonte' });
      } else download(name, text);
      state.settings.lastBackup = Date.now(); save(); toast('Sauvegarde exportée'); rerender();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      download(name, text);
      state.settings.lastBackup = Date.now(); save(); toast('Sauvegarde téléchargée'); rerender();
    }
  },
  'imp': () => $('#imp-file').click(),
  'persist': async () => { persisted = await requestPersistence(); toast(persisted ? 'Stockage protégé' : 'Le navigateur n’a pas accordé la protection (elle est souvent accordée après installation de l’app).'); rerender(); },
  'reset-prog': async () => {
    const ok = await confirmSheet('Réinitialiser le programme ?', 'Tes modifications de séances seront perdues. L’historique est conservé.', 'Réinitialiser', true);
    if (!ok) return;
    state.program = defaultProgram(); save(); toast('Programme réinitialisé'); rerender();
  },
  'reset-all': async () => {
    const ok = await confirmSheet('Tout effacer ?', 'Programme, historique et réglages seront supprimés de ce téléphone. Exporte d’abord une sauvegarde si besoin.', 'Tout effacer', true);
    if (!ok) return;
    resetAll(); go('#/');
  }
};

export const changes = {
  'set-toggle': async el => {
    const k = el.dataset.k;
    if (k === 'notify' && el.checked) {
      if (!('Notification' in window)) { el.checked = false; toast('Notifications non disponibles sur ce navigateur.'); return; }
      const p = await Notification.requestPermission();
      if (p !== 'granted') { el.checked = false; toast('Autorisation refusée.'); return; }
    }
    state.settings[k] = el.checked; save();
    if (k === 'keepAwake') keepAwake(el.checked && !!state.active && location.hash.startsWith('#/workout'));
    if (k === 'deloadAuto' || k === 'warmupGuide') rerender();
  },
  'set-num': el => { const v = parseFloat(String(el.value).replace(',', '.')); if (!isNaN(v) && v > 0) { state.settings[el.dataset.k] = v; save(); } },
  'set-plates': el => {
    const arr = String(el.value).split(/[,;\s]+/).map(x => parseFloat(x.replace(',', '.'))).filter(x => x > 0);
    if (arr.length) { state.settings.plates = [...new Set(arr)].sort((a, b) => b - a); save(); }
  },
  'imp-file': async el => {
    const f = el.files && el.files[0]; if (!f) return;
    try {
      const obj = JSON.parse(await f.text());
      const err = validateImport(obj);
      if (err) { toast(err); return; }
      const ok = await confirmSheet('Restaurer cette sauvegarde ?', `${obj.history.length} séance(s), ${obj.program.sessions.length} séance(s) au programme. Les données actuelles de ce téléphone seront remplacées.`, 'Restaurer', true);
      if (!ok) return;
      replaceState(obj); toast('Sauvegarde restaurée'); go('#/');
    } catch (e) { toast('Fichier invalide.'); }
    finally { el.value = ''; }
  }
};

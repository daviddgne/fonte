import { allExercises } from '../store.js';
import { GROUPS, exImages } from '../data/exercises.js';
import { muscleLabel } from '../muscles.js';
import { icon, esc, rerender, $ } from '../ui.js';
import { tabbar } from './common.js';
import { customSheet } from './program.js';

let q = '', g = '';

function list() {
  const items = allExercises().filter(e => (!g || e.group === g) && (!q || e.name.toLowerCase().includes(q.toLowerCase())));
  if (!items.length) return '<p class="muted small">Aucun exercice.</p>';
  return items.map(e => {
    const img = exImages(e)[1];
    return `<a class="card tap row gap" href="#/ex/${encodeURIComponent(e.id)}" style="color:inherit">
      <div class="thumb">${img ? `<img src="${img.src}" alt="" loading="lazy">` : icon('dumbbell')}</div>
      <div class="grow"><b>${esc(e.name)}</b><div class="small muted">${esc((e.muscles?.primary || []).map(muscleLabel).join(', ') || e.group)}</div>
      <div class="tiny faint">${esc(e.equipment || '')}${e.videos?.length ? ` · ${icon('video', 's')} ${e.videos.length}` : ''}${e.custom ? ' · personnalisé' : ''}</div></div>${icon('chevron')}</a>`;
  }).join('');
}

export function render() {
  return `<header class="page-head"><h1>Exercices</h1><button class="icon-btn" data-a="lib-custom" aria-label="Créer un exercice">${icon('plus')}</button></header>
    <input type="search" id="lib-q" data-c="lib-q" data-input placeholder="Rechercher un exercice…" value="${esc(q)}" autocomplete="off">
    <div class="chips mt-s"><button class="chip ${!g ? 'sel' : ''}" data-a="lib-g" data-g="">Tous</button>${[...GROUPS, 'Autre'].map(x => `<button class="chip ${g === x ? 'sel' : ''}" data-a="lib-g" data-g="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <div class="list mt" id="lib-list">${list()}</div>
    <p class="tiny faint mt">Illustrations : Everkinetic (CC BY-SA 4.0). Muscles : classement ExRx.net.</p>` + tabbar('library');
}

export const actions = {
  'lib-g': el => { g = el.dataset.g; rerender(); },
  'lib-custom': () => customSheet()
};
export const changes = {
  'lib-q': el => { q = el.value; const l = $('#lib-list'); if (l) l.innerHTML = list(); }
};

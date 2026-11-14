import { state, getEx } from '../store.js';
import { exImages } from '../data/exercises.js';
import { muscleMap, muscleLabel } from '../muscles.js';
import { e1rm } from '../engine.js';
import { lineChart } from '../chart.js';
import { icon, esc, fmtDateShort, num, $ } from '../ui.js';

export function exerciseHistory(exId) {
  const out = [];
  for (const h of state.history) for (const e of h.entries) {
    if (e.ex !== exId || !e.sets.length) continue;
    const top = Math.max(...e.sets.map(s => s.load || 0));
    const best = Math.max(...e.sets.map(s => e1rm(s.load, s.reps)));
    const reps = e.sets.reduce((a, s) => a + s.reps, 0);
    const vol = e.sets.reduce((a, s) => a + (s.load || 0) * s.reps, 0);
    out.push({ date: h.start, histId: h.id, sets: e.sets, top, best, reps, vol });
  }
  return out;
}

// Lien vers la vidéo de Nassim Sahili (ouvre l'app YouTube) ou, à défaut, une recherche YouTube.
function nassimBlock(ex) {
  const query = ex.nassimQuery || `Nassim Sahili ${ex.name}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  if (ex.nassim) {
    return `<a class="nassim" href="https://www.youtube.com/watch?v=${encodeURIComponent(ex.nassim.id)}" target="_blank" rel="noopener">
        <span class="nassim-ic">${icon('play')}</span>
        <span class="grow"><b>Vidéo de Nassim Sahili</b><small>${esc(ex.nassim.title)}</small>${ex.nassim.note ? `<small class="amber">${esc(ex.nassim.note)}</small>` : ''}</span>${icon('chevron')}</a>
      <a class="nassim-search" href="${searchUrl}" target="_blank" rel="noopener">${icon('search', 's')} Autres vidéos de Nassim sur cet exercice</a>`;
  }
  return `<a class="nassim" href="${searchUrl}" target="_blank" rel="noopener">
      <span class="nassim-ic">${icon('search')}</span>
      <span class="grow"><b>Chercher une vidéo de Nassim Sahili</b><small>Aucune vidéo dédiée trouvée : recherche « ${esc(query)} » sur YouTube.</small></span>${icon('chevron')}</a>`;
}

export function render({ id }, query) {
  const ex = getEx(id);
  const backBtn = query.get('from') === 'workout' && state.active
    ? `<a class="icon-btn" href="#/workout" aria-label="Retour à la séance">${icon('back')}</a>`
    : `<button class="icon-btn" data-a="back" aria-label="Retour">${icon('back')}</button>`;
  const imgs = exImages(ex);
  const m = ex.muscles || { primary: [], secondary: [], stabilizers: [] };
  let html = `<header class="page-head">${backBtn}
    <div class="grow ex-hero"><h1>${esc(ex.name)}</h1><div class="sub">${esc(ex.group || '')}${ex.equipment ? ' · ' + esc(ex.equipment) : ''}${ex.unilateral ? ' · unilatéral' : ''}</div></div></header>`;

  if (imgs.length) {
    // Animation par défaut (alternance départ / arrivée) ; bouton pour voir les deux positions côte à côte.
    html += `<section class="ill anim" id="ill"><div class="row between" style="margin-bottom:8px"><span class="small muted">Mouvement</span>
      <button class="btn small soft" data-a="ill-anim"><span>Côte à côte</span></button></div>
      <div class="ill-grid hidden">${imgs.map(i => `<figure><img src="${i.src}" alt="${esc(ex.name)} — ${esc(i.label)}" loading="lazy"><figcaption>${esc(i.label)}</figcaption></figure>`).join('')}</div>
      <div class="ill-stack">${imgs.map(i => `<img src="${i.src}" alt="${esc(ex.name)} — ${esc(i.label)}">`).join('')}</div>
      <p class="ill-cap small muted center">${imgs.map(i => esc(i.label)).join(' ↔ ')}</p>
      ${ex.img.note ? `<p class="ill-note">${esc(ex.img.note)}</p>` : ''}
      ${nassimBlock(ex)}
      <p class="credit">Illustration : Everkinetic (everkinetic.com), licence CC BY-SA 4.0, recolorée.</p></section>`;
  } else {
    html += `<section class="card"><p class="muted small">Pas d’illustration pour cet exercice${ex.custom ? ' personnalisé' : ''}.</p>${nassimBlock(ex)}</section>`;
  }

  if ((m.primary || []).length) {
    const li = (arr) => arr.map(k => `<li>${esc(muscleLabel(k))}</li>`).join('');
    html += `<div class="section-title">Muscles sollicités</div><section class="card">
      ${muscleMap(m)}
      <div class="legend"><span><i style="background:var(--accent)"></i>Principal</span><span><i style="background:var(--amber)"></i>Secondaires</span></div>
      <ul class="mlist"><span class="lvl accent">Principal${m.primary.length > 1 ? 'aux' : ''}</span>${li(m.primary)}
      ${m.secondary?.length ? `<span class="lvl amber">Secondaires (synergistes)</span>${li(m.secondary)}` : ''}
      ${m.stabilizers?.length ? `<span class="lvl muted">Stabilisateurs</span>${li(m.stabilizers)}` : ''}</ul>
      ${ex.ref ? `<p class="credit">Classement des muscles : <a href="${esc(ex.ref)}" target="_blank" rel="noopener">ExRx.net</a> · Carte : Wikimedia Commons (Termininja) et projet wger, CC BY-SA 3.0.</p>` : ''}
    </section>`;
  }

  if (ex.steps?.length) html += `<div class="section-title">Exécution</div><section class="card"><ol class="steps">${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>`;
  if (ex.errors?.length) html += `<div class="section-title">Erreurs fréquentes</div><section class="card"><ul class="errs">${ex.errors.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>`;
  const tips = [...(ex.tips || [])];
  if (tips.length || ex.morpho) {
    html += `<div class="section-title">Conseils</div><section class="card">${tips.length ? `<ul class="tips">${tips.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      ${ex.morpho ? `<p class="small"><b>Morphologie :</b> <span class="muted">${esc(ex.morpho)}</span></p>` : ''}</section>`;
  }
  html += `<p class="small muted mt">En cas de douleur pendant l’exercice : arrête la série. Ne force jamais sur une douleur.</p>`;

  html += `<div class="section-title">Vidéos de démonstration</div>`;
  for (const v of ex.videos || []) {
    html += `<div class="video" data-a="play-video" data-id="${esc(v.id)}" role="button" aria-label="Lire la vidéo ${esc(v.title)}">
        <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none'">
        <div class="play"><span>${icon('play')}</span></div></div>
      <div class="video-meta"><div class="t">${esc(v.title)}</div><div class="muted small">${esc(v.author)} · ${esc(v.dur)}${v.lang === 'en' ? ' · <span class="chip">en anglais</span>' : ''}</div>
      ${v.note ? `<div class="small amber">${esc(v.note)}</div>` : ''}
      <a class="small" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">Ouvrir dans YouTube</a></div>`;
  }
  const q = encodeURIComponent(ex.search || ex.name + ' technique');
  html += `<a class="btn ghost block" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">${icon('search', 's')} ${ex.videos?.length ? 'Autres démonstrations sur YouTube' : 'Rechercher une démonstration sur YouTube'}</a>`;
  if (!ex.videos?.length && !ex.custom) html += `<p class="tiny muted mt-s">Aucune vidéo de Nassim Sahili ou Tibo InShape spécifique à cet exercice n’a été trouvée : recherche ouverte plutôt qu’un lien approximatif.</p>`;

  if (ex.alts?.length) {
    html += `<div class="section-title">Alternatives</div><div class="chips">${ex.alts.map(a => `<a class="chip accent" href="#/ex/${encodeURIComponent(a)}${query.get('from') ? '?from=' + query.get('from') : ''}">${esc(getEx(a).name)}</a>`).join('')}</div>`;
  }

  const hist = exerciseHistory(ex.id);
  html += `<div class="section-title">Mes performances</div>`;
  if (hist.length) {
    const last = hist[hist.length - 1];
    html += `<section class="card"><div class="small muted">Charge maximale par séance (lb)</div>${lineChart(hist.map(h => ({ x: h.date, y: h.top })), { label: 'Charge maximale' })}
      <p class="small">Dernière fois (${esc(fmtDateShort(last.date))}) : <b class="num">${last.sets.map(s => `${num(s.load || 0)}×${s.reps}`).join(' · ')}</b></p>
      <a class="link-btn" href="#/progress/${encodeURIComponent(ex.id)}">${icon('chart', 's')} Voir toute la progression</a></section>`;
  } else html += `<p class="small muted">Pas encore de performance enregistrée.</p>`;
  return html + '<div style="height:20px"></div>';
}

export const actions = {
  'ill-anim': el => {
    const box = $('#ill'); if (!box) return;
    const on = !box.classList.contains('anim');
    box.classList.toggle('anim', on);
    box.querySelector('.ill-grid').classList.toggle('hidden', on);
    box.querySelector('.ill-stack').classList.toggle('hidden', !on);
    box.querySelector('.ill-cap')?.classList.toggle('hidden', !on);
    el.querySelector('span').textContent = on ? 'Côte à côte' : 'Animer';
  },
  'play-video': el => {
    if (el.querySelector('iframe')) return;
    if (!navigator.onLine) { el.insertAdjacentHTML('afterend', '<p class="small amber">Hors connexion : vidéo indisponible.</p>'); return; }
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(el.dataset.id)}?autoplay=1&rel=0&hl=fr&playsinline=1" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }
};

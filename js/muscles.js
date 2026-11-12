// Dictionnaire des muscles + rendu de la carte anatomique (face / dos).
import { SHAPES } from './data/muscle-shapes.js';

export const MUSCLES = {
  pecs:            { label: 'Grand pectoral (faisceau sternal)', group: 'Pectoraux', shapes: [4] },
  pecsUpper:       { label: 'Grand pectoral (faisceau claviculaire – haut des pecs)', group: 'Pectoraux', shapes: [4] },
  deltAnt:         { label: 'Deltoïde antérieur', group: 'Épaules', shapes: [2] },
  deltLat:         { label: 'Deltoïde latéral (moyen)', group: 'Épaules', shapes: [2] },
  deltPost:        { label: 'Deltoïde postérieur', group: 'Épaules', shapes: ['deltPost'] },
  supraspinatus:   { label: 'Supra-épineux', group: 'Épaules', shapes: [] },
  rotators:        { label: 'Infra-épineux et petit rond', group: 'Épaules', shapes: [] },
  biceps:          { label: 'Biceps brachial', group: 'Biceps', shapes: [1] },
  brachialis:      { label: 'Brachial antérieur', group: 'Biceps', shapes: [13] },
  brachioradialis: { label: 'Brachio-radial (avant-bras)', group: 'Avant-bras', shapes: ['forearm'] },
  triceps:         { label: 'Triceps brachial', group: 'Triceps', shapes: [5] },
  lats:            { label: 'Grand dorsal (et grand rond)', group: 'Dos', shapes: [12] },
  traps:           { label: 'Trapèzes (moyen, inférieur) et rhomboïdes', group: 'Dos', shapes: [9] },
  erectors:        { label: 'Érecteurs du rachis (lombaires)', group: 'Lombaires', shapes: [16] },
  abs:             { label: 'Grand droit de l’abdomen', group: 'Abdos', shapes: [6] },
  obliques:        { label: 'Obliques', group: 'Abdos', shapes: [14] },
  serratus:        { label: 'Dentelé antérieur', group: 'Pectoraux', shapes: [3] },
  hipFlexors:      { label: 'Fléchisseurs de hanche (psoas-iliaque)', group: 'Abdos', shapes: [] },
  quads:           { label: 'Quadriceps', group: 'Quadriceps', shapes: [10] },
  hamstrings:      { label: 'Ischio-jambiers', group: 'Ischios', shapes: [11] },
  glutes:          { label: 'Grand fessier', group: 'Fessiers', shapes: [8] },
  adductors:       { label: 'Adducteurs (grand adducteur)', group: 'Adducteurs', shapes: ['adductors'] },
  calves:          { label: 'Gastrocnémiens (jumeaux)', group: 'Mollets', shapes: [7] },
  soleus:          { label: 'Soléaire', group: 'Mollets', shapes: [15] }
};

export const muscleLabel = k => (MUSCLES[k] ? MUSCLES[k].label : k);
export const muscleGroup = k => (MUSCLES[k] ? MUSCLES[k].group : k);

// Rend une carte SVG (face + dos). level: primary > secondary.
export function muscleMap(muscles, { compact = false } = {}) {
  const lvl = {};
  const mark = (list, level) => (list || []).forEach(m => {
    (MUSCLES[m]?.shapes || []).forEach(s => { if (!lvl[s] || level === 'primary') lvl[s] = level; });
  });
  mark(muscles.secondary, 'secondary');
  mark(muscles.primary, 'primary');
  const view = (side) => {
    const parts = Object.entries(lvl)
      .filter(([s]) => SHAPES[s] && SHAPES[s].view === side)
      .map(([s, l]) => `<g class="mm-${l}">${SHAPES[s].svg}</g>`).join('');
    return `<figure class="mm-view"><svg viewBox="0 0 200 369" role="img" aria-label="Vue de ${side === 'front' ? 'face' : 'dos'}">
      <image href="assets/muscles/${side}.svg" width="200" height="369" class="mm-base"/>${parts}</svg>
      ${compact ? '' : `<figcaption>${side === 'front' ? 'Face' : 'Dos'}</figcaption>`}</figure>`;
  };
  return `<div class="muscle-map${compact ? ' compact' : ''}">${view('front')}${view('back')}</div>`;
}

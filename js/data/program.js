// Programme par défaut, cycle de 8 semaines et échauffements guidés.
// Tout est modifiable dans l'application (onglet Programme) : ce fichier sert au premier lancement,
// à la réinitialisation et à la mise à jour automatique du programme (PROGRAM_VERSION).

// Version 2 (14/11/2026) : séances fournies par l'utilisateur (fichier « Séances.txt »), 3 séries minimum par exercice,
// 4 séries sur les élévations latérales (A, D) et le curl au pupitre (D).
export const PROGRAM_VERSION = 2;

let n = 0;
const it = (ex, sets, min, max, rest, extra = {}) => ({ uid: 'i' + (++n).toString(36) + Date.now().toString(36).slice(-3), ex, sets, reps: [min, max], rest, ...extra });

export function defaultProgram() {
  n = 0;
  return {
    sessions: [
      {
        id: 'A', name: 'Séance A', focus: 'Pectoraux & quadriceps', optional: false,
        items: [
          it('squat', 3, 6, 10, 180, { warmup: true }),
          it('bench', 3, 6, 10, 180, { warmup: true, note: 'Prise moyenne' }),
          it('latpulldown', 3, 8, 12, 120, { note: 'Prise large' }),
          it('rdl', 3, 8, 12, 120),
          it('legext', 3, 10, 15, 90),
          it('latraise', 4, 12, 20, 90, { ss: 'A-ss1' }),
          it('cablecrunch', 3, 10, 15, 90, { ss: 'A-ss1' })
        ]
      },
      {
        id: 'B', name: 'Séance B', focus: 'Dos & chaîne postérieure', optional: false,
        items: [
          it('deadlift', 3, 4, 6, 180, { warmup: true }),
          it('inclinedb', 3, 8, 12, 120),
          it('seatedrow', 3, 8, 12, 120),
          it('bulgarian', 3, 8, 12, 120, { note: 'Pied arrière surélevé sur un banc' }),
          it('legcurl', 3, 10, 15, 90),
          it('reardelt', 3, 12, 20, 90, { ss: 'B-ss1' }),
          it('dbcurl', 3, 10, 15, 90, { ss: 'B-ss1' }),
          it('standcalf', 3, 12, 20, 75)
        ]
      },
      {
        id: 'C', name: 'Séance C', focus: 'Développement général', optional: false,
        items: [
          it('legpress', 3, 10, 15, 120, { warmup: true }),
          it('machinepress', 3, 8, 12, 120),
          it('seatedrow', 3, 8, 12, 120),
          it('hipthrust', 3, 8, 12, 120),
          it('seatedlegcurl', 3, 10, 15, 90),
          it('dbshoulderpress', 3, 8, 12, 120),
          it('hammercurl', 3, 10, 15, 90, { ss: 'C-ss1' }),
          it('seatedcalf', 3, 12, 20, 90, { ss: 'C-ss1' })
        ]
      },
      {
        id: 'D', name: 'Séance D', focus: 'Épaules, bras, abdos & mollets (facultative)', optional: true,
        items: [
          it('latraise', 4, 12, 20, 75, { ss: 'D-ss1' }),
          it('cablecrunch', 3, 10, 15, 75, { ss: 'D-ss1' }),
          it('reardelt', 3, 12, 20, 75, { ss: 'D-ss2' }),
          it('preacher', 4, 10, 15, 75, { ss: 'D-ss2' }),
          it('standcalf', 3, 12, 20, 75)
        ]
      }
    ]
  };
}

// Cycle de 8 semaines. Le nombre de séries ne change jamais (3 minimum) : l'intensité varie.
// loadFactor : charge proposée automatiquement (option « décharge automatique »).
export const CYCLE = [
  { weeks: [1, 2], name: 'Adaptation', rir: '3 répétitions en réserve', setDelta: 0,
    text: 'Toutes les séries, charges modérées : arrête chaque série en gardant environ 3 répétitions possibles. Priorité à la technique.' },
  { weeks: [3, 4], name: 'Montée en charge', rir: '2 répétitions en réserve', setDelta: 0,
    text: 'Charges un peu plus lourdes. Note précisément charges et répétitions : elles servent de référence.' },
  { weeks: [5, 6], name: 'Progression', rir: '1 à 2 répétitions en réserve', setDelta: 0,
    text: 'Double progression : quand toutes les séries atteignent le haut de la fourchette, l’app propose +5 lb.' },
  { weeks: [7], name: 'Consolidation', rir: '1 en réserve (0 à 1 sur l’isolation)', setDelta: 0,
    text: 'Semaine la plus exigeante. Pas d’échec sur squat et soulevé de terre ; jamais au prix de la technique ou d’une douleur.' },
  { weeks: [8], name: 'Décharge & bilan', rir: '3 répétitions en réserve ou plus', setDelta: 0, loadFactor: 0.9,
    text: 'Mêmes séries, charges réduites d’environ 10 % (proposées automatiquement). Compare ensuite semaine 2 et semaine 7 dans le Suivi.' }
];

export const phaseForWeek = w => CYCLE.find(p => p.weeks.includes(w)) || CYCLE[CYCLE.length - 1];

// ───── Échauffements guidés (≈ 9 min) ─────
// Principe : échauffement général court (élévation de la température), mobilité dynamique ciblée sur les
// articulations de la séance, puis séries d'approche sur le premier exercice lourd (calculées dans la séance).
// Pas d'étirements statiques longs avant la séance.
const S = (name, dose, how, extra = {}) => ({ name, dose, how, ...extra });
const ELLIPTIQUE = S('Elliptique', '5 min', 'Allure modérée : tu dois pouvoir parler. Monte progressivement le rythme sur la dernière minute.', { timer: 300 });
const PULL_APART = S('Écartés à l’élastique', '15 répétitions', 'Bras tendus devant toi à hauteur d’épaules, écarte l’élastique jusqu’à la poitrine en rapprochant les omoplates. Retour lent.', { band: true, q: 'band pull apart' });
const EXT_ROT = S('Rotation externe à l’élastique', '12 par bras', 'Coude collé au corps et plié à 90°, fais pivoter l’avant-bras vers l’extérieur. Mouvement lent, sans douleur.', { band: true, q: 'rotation externe épaule élastique' });
const PASS = S('Passages d’épaules à l’élastique', '8 répétitions', 'Prise très large, bras tendus : passe l’élastique devant puis derrière toi. Élargis la prise si ça tire.', { band: true, q: 'band shoulder pass through' });
const SQUAT_PDC = S('Squat au poids du corps', '10 répétitions', 'Descente lente, talons au sol, genoux dans l’axe des pieds. Amplitude confortable pour le genou.', { q: 'squat poids du corps' });
const FENTES = S('Fentes arrière sans charge', '5 par jambe', 'Grand pas en arrière, buste droit, genou avant stable. Prépare hanches, genoux et équilibre.', { q: 'fente arrière poids du corps' });
const PONT = S('Pont fessier', '12 répétitions', 'Allongé, pieds à plat : monte les hanches en serrant les fessiers 1 seconde, sans cambrer.', { q: 'pont fessier' });
const CHARNIERE = S('Charnière de hanche (good morning à vide)', '10 répétitions', 'Mains sur les hanches, genoux légèrement fléchis : pousse les fesses en arrière, dos neutre, puis reviens en serrant les fessiers.', { q: 'hip hinge good morning poids du corps' });
const CHAT = S('Chat-vache', '6 cycles lents', 'À quatre pattes : arrondis puis creuse doucement le dos, sans forcer en fin d’amplitude.', { q: 'cat camel exercice' });
const POMPES = S('Pompes inclinées (mains sur un banc)', '10 répétitions', 'Corps gainé, descente lente. Prépare épaules et pectoraux sans charge.', { q: 'pompes inclinées banc' });
const LAT_BAND = S('Élévations latérales à l’élastique', '12 répétitions', 'Pied sur l’élastique, monte les bras sur les côtés jusqu’à l’horizontale, léger.', { band: true, q: 'élévations latérales élastique' });
const CURL_BAND = S('Curl à l’élastique', '15 répétitions', 'Léger, pour préparer coudes et biceps.', { band: true, q: 'curl élastique' });

export const WARMUPS = {
  A: { title: 'Jambes + haut du corps (squat, développé couché)', steps: [ELLIPTIQUE, SQUAT_PDC, FENTES, PULL_APART, EXT_ROT, PASS],
    then: 'Puis séries d’approche au squat (proposées par l’app) et 1 à 2 séries légères au développé couché.' },
  B: { title: 'Chaîne postérieure (soulevé de terre)', steps: [ELLIPTIQUE, CHAT, CHARNIERE, PONT, PULL_APART, FENTES],
    then: 'Puis séries d’approche au soulevé de terre (proposées par l’app).' },
  C: { title: 'Global (presse, développés, hip thrust)', steps: [ELLIPTIQUE, SQUAT_PDC, PONT, PULL_APART, EXT_ROT, POMPES],
    then: 'Puis séries d’approche à la presse (proposées par l’app) et 1 série légère au développé machine.' },
  D: { title: 'Épaules et bras', steps: [ELLIPTIQUE, PULL_APART, EXT_ROT, LAT_BAND, CURL_BAND],
    then: 'Commence les élévations latérales avec une première série légère.' },
  default: { title: 'Échauffement général', steps: [ELLIPTIQUE, SQUAT_PDC, PULL_APART, EXT_ROT],
    then: 'Puis 1 à 2 séries d’approche sur le premier exercice.' }
};
export const warmupFor = sessionId => WARMUPS[sessionId] || WARMUPS.default;

// Explications affichées dans l'onglet « Programme ».
export const PROGRAM_NOTES = [
  { title: 'Tes séances', body: 'Les exercices, l’ordre, les répétitions, les repos et les supersets sont ceux de ton fichier « Séances » du 14/11. Chaque exercice a au moins 3 séries. Durées estimées, échauffement compris : environ 73 min pour A, 74 min pour B, 72 min pour C et 38 min pour D. C’est proche de 75 min : si tu manques de temps, réduis un peu les repos des exercices d’isolation ou passe la 4e série des élévations latérales.' },
  { title: 'Où 4 séries, et pourquoi', body: 'Élévations latérales (A et D) et curl au pupitre (D) : petits muscles peu fatigants, qui supportent bien un peu plus de volume. Le coût en temps reste faible (superset). Les gros exercices (squat, soulevé de terre, développés) restent à 3 séries pour garder les séances sous 75 min et limiter la fatigue avec la course et le tennis.' },
  { title: 'Cycle de 8 semaines sans retirer de séries', body: 'Le nombre de séries ne change jamais. Les semaines 1-2 (adaptation) et 8 (décharge) sont allégées par l’effort : plus de répétitions en réserve et, en semaine 8, des charges proposées à −10 % (option désactivable).' },
  { title: 'Progression intégrée', body: 'Double progression : même charge tant que toutes les séries n’atteignent pas le haut de la fourchette, puis +5 lb (pas réglable par exercice). Ta dernière performance s’affiche à chaque série.' },
  { title: 'Échauffement guidé', body: 'Au début de chaque séance : 5 min d’elliptique, environ 3 min de mobilité adaptée à la séance (avec élastique), puis séries d’approche du premier exercice lourd. Facultatif, non compté dans le pourcentage de la séance.' },
  { title: 'Douleurs', body: 'Aucune extension directe des triceps. Tu peux signaler une douleur sur une série : l’app propose d’arrêter l’exercice, de le remplacer ou d’alléger. Elle ne t’incitera jamais à forcer et ne modifie rien toute seule.' },
  { title: 'Course à pied et tennis', body: 'Les méta-analyses récentes (Schumann et al., 2022) ne montrent pas d’effet négatif notable du cardio sur la prise de muscle, mais un effet possible sur la force explosive. Évite si possible une séance intense de course ou de tennis juste avant les séances A et B (squat, soulevé de terre).' }
];

export const REFERENCES = [
  'Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci. 2017.',
  'Schoenfeld BJ et al. Longer interset rest periods enhance muscle strength and hypertrophy in resistance-trained men. J Strength Cond Res. 2016.',
  'Singer A et al. Give it a rest: a systematic review with Bayesian meta-analysis on the effect of inter-set rest interval duration on muscle hypertrophy. Front Sports Act Living. 2024.',
  'Refalo MC et al. Influence of resistance training proximity-to-failure on skeletal muscle hypertrophy: a systematic review with meta-analysis. Sports Med. 2023.',
  'Robinson ZP et al. Exploring the dose–response relationship between estimated resistance training proximity to failure, strength gain, and muscle hypertrophy: a series of meta-regressions. Sports Med. 2024.',
  'Maeo S et al. Greater hamstrings muscle hypertrophy but similar damage protection after training at long versus short muscle lengths. Med Sci Sports Exerc. 2021.',
  'Schumann M et al. Compatibility of concurrent aerobic and strength training for skeletal muscle size and function: an updated systematic review and meta-analysis. Sports Med. 2022.',
  'Bell L et al. Integrating deloading into strength and physique sports training programmes: an international Delphi consensus approach. Sports Med Open. 2023.',
  'Krzysztofik M et al. Maximizing muscle hypertrophy: a systematic review of advanced resistance training techniques and methods. Int J Environ Res Public Health. 2019.'
];

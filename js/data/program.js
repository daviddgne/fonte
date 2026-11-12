// Programme par défaut (version révisée) et définition du cycle de 8 semaines.
// Tout est modifiable dans l'application (onglet Programme) : ce fichier ne sert qu'au premier lancement
// et à la réinitialisation.

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
          it('bench', 3, 6, 10, 180, { warmup: true }),
          it('latpulldown', 3, 8, 12, 120),
          it('rdl', 3, 8, 12, 120),
          it('legext', 2, 10, 15, 90),
          it('latraise', 3, 12, 20, 90, { ss: 'A-ss1' }),
          it('cablecrunch', 2, 10, 15, 90, { ss: 'A-ss1' })
        ]
      },
      {
        id: 'B', name: 'Séance B', focus: 'Dos & chaîne postérieure', optional: false,
        items: [
          it('deadlift', 2, 4, 6, 180, { warmup: true }),
          it('inclinedb', 3, 8, 12, 120),
          it('seatedrow', 3, 8, 12, 120),
          it('bulgarian', 3, 8, 12, 120),
          it('legcurl', 3, 10, 15, 90),
          it('reardelt', 2, 12, 20, 90, { ss: 'B-ss1' }),
          it('dbcurl', 2, 10, 15, 90, { ss: 'B-ss1' }),
          it('standcalf', 2, 12, 20, 90)
        ]
      },
      {
        id: 'C', name: 'Séance C', focus: 'Développement général', optional: false,
        items: [
          it('legpress', 3, 10, 15, 120, { warmup: true }),
          it('machinepress', 3, 8, 12, 120),
          it('tbarrow', 3, 8, 12, 120),
          it('hipthrust', 3, 8, 12, 120),
          it('seatedlegcurl', 2, 10, 15, 90),
          it('dbshoulderpress', 2, 8, 12, 120),
          it('hammercurl', 2, 10, 15, 90, { ss: 'C-ss1' }),
          it('latraise', 2, 12, 20, 90, { ss: 'C-ss1' }),
          it('seatedcalf', 2, 12, 20, 75)
        ]
      },
      {
        id: 'D', name: 'Séance D', focus: 'Épaules, bras & abdos (facultative)', optional: true,
        items: [
          it('latraise', 3, 12, 20, 90),
          it('reardelt', 2, 12, 20, 75, { ss: 'D-ss1' }),
          it('preacher', 3, 10, 15, 75, { ss: 'D-ss1' }),
          it('reversecrunch', 2, 10, 15, 60)
        ]
      }
    ]
  };
}

// Cycle de 8 semaines. setDelta : séries retirées automatiquement (si l'option est active).
// minSets : l'ajustement ne s'applique qu'aux exercices ayant au moins ce nombre de séries.
export const CYCLE = [
  { weeks: [1, 2], name: 'Adaptation', rir: '3 répétitions en réserve', setDelta: -1, minSets: 3,
    text: 'Charges modérées, priorité à la technique. Une série de moins sur les exercices à 3 séries.' },
  { weeks: [3, 4], name: 'Volume complet', rir: '2 répétitions en réserve', setDelta: 0,
    text: 'Toutes les séries prévues. Note précisément charges et répétitions : elles servent de référence.' },
  { weeks: [5, 6], name: 'Progression', rir: '1 à 2 répétitions en réserve', setDelta: 0,
    text: 'Applique la double progression : quand toutes les séries atteignent le haut de la fourchette, augmente la charge.' },
  { weeks: [7], name: 'Consolidation', rir: '1 en réserve (0 à 1 sur l’isolation)', setDelta: 0,
    text: 'Semaine la plus exigeante. Pas d’échec sur squat et soulevé de terre ; jamais au prix de la technique ou d’une douleur.' },
  { weeks: [8], name: 'Décharge & bilan', rir: '3 répétitions en réserve ou plus', setDelta: -1, minSets: 2,
    text: 'Une série de moins par exercice, charges identiques ou légèrement réduites. Compare tes performances semaine 2 vs semaine 7 dans l’historique, puis ajuste le programme.' }
];

export const phaseForWeek = w => CYCLE.find(p => p.weeks.includes(w)) || CYCLE[CYCLE.length - 1];

// Explications affichées dans l'onglet « Programme » (justification des modifications).
export const PROGRAM_NOTES = [
  { title: 'Ce qui est conservé', body: 'La structure en 3 séances full body + 1 facultative, les exercices de base (squat, développé couché, soulevé de terre, tirages, hip thrust), les fourchettes de répétitions et les temps de repos. Elle colle aux données actuelles : fréquence de 2 fois par semaine par muscle, environ 9 à 12 séries hebdomadaires par grand groupe musculaire, repos longs sur les polyarticulaires.' },
  { title: 'Plus de travail pour les deltoïdes latéraux', body: 'Les développés sollicitent beaucoup l’avant de l’épaule, mais peu sa partie latérale. Le programme initial n’en prévoyait que 2 séries par semaine sans la séance D. Désormais : 3 séries en A et 2 en C, soit 5 séries (8 avec la séance D).' },
  { title: 'Superset de la séance C plus pratique', body: 'Curl marteau + élévations latérales : mêmes haltères, même endroit, muscles différents. Les mollets assis passent seuls à la fin (machine éloignée).' },
  { title: '« Rowing horizontal » précisé', body: 'Rowing barre T ou machine avec appui poitrine : le dos travaille sans charger de nouveau les lombaires, déjà sollicitées par le soulevé de terre, le roumain et le squat.' },
  { title: 'Cycle de 8 semaines rendu concret', body: 'Chaque phase a un objectif d’effort (répétitions en réserve) et un volume. L’application retire automatiquement une série en semaines 1-2 et 8 (option désactivable). La semaine 8 devient une décharge suivie d’un bilan chiffré.' },
  { title: 'Progression intégrée', body: 'Double progression : tu restes à la même charge tant que toutes les séries n’atteignent pas le haut de la fourchette ; ensuite l’application propose +5 lb (incrément réglable). Ta dernière performance s’affiche à chaque série.' },
  { title: 'Échauffement guidé', body: 'Séries d’approche calculées en lb pour le premier exercice lourd (non comptées dans la progression de la séance).' },
  { title: 'Douleurs', body: 'Aucune extension directe des triceps. Les triceps travaillent indirectement aux développés. Tu peux signaler une douleur sur une série : l’application te propose d’arrêter l’exercice, de le remplacer ou de passer au suivant. Elle ne t’incitera jamais à forcer. Rien n’est modifié automatiquement.' },
  { title: 'Course à pied et tennis', body: 'Les méta-analyses récentes (Schumann et al., 2022) ne montrent pas d’effet négatif notable du cardio sur l’hypertrophie, mais un effet possible sur la force explosive. Évite si possible une séance intense de course ou de tennis juste avant les séances qui commencent par le squat ou le soulevé de terre.' }
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

// Bibliothèque d'exercices.
// - Muscles : classement repris d'ExRx.net (cible / synergistes / stabilisateurs), lien "ref" sur chaque fiche.
// - Illustrations : Everkinetic (github.com/everkinetic/data), CC BY-SA 4.0, recolorées pour le thème sombre.
// - Vidéos : chaque identifiant a été vérifié (existence, chaîne, titre) via l'API oEmbed de YouTube le 12/11/2026.
//
// img.seq : ordre d'affichage des deux dessins ('t' = muscle contracté, 'r' = muscle relâché/étiré).
// load : 'total' (barre/machine), 'perDb' (charge d'UN haltère), 'body' (poids du corps, lest éventuel).

const V = (id, title, author, dur, lang = 'fr', note = '') => ({ id, title, author, dur, lang, note });

export const EXERCISES = [
  // ───────────────────────── JAMBES ─────────────────────────
  {
    id: 'squat', name: 'Squat barre', group: 'Jambes', equipment: 'Barre + rack', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0122', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : debout', 'Position basse'] },
    muscles: { primary: ['quads'], secondary: ['glutes', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'erectors', 'abs', 'obliques'] },
    steps: [
      'Place la barre sur le haut des trapèzes (pas sur la nuque), mains un peu plus larges que les épaules, omoplates serrées.',
      'Sors du rack en deux pas, pieds à largeur d’épaules environ, pointes légèrement ouvertes (adapte à ton confort).',
      'Inspire profondément et gaine le ventre avant chaque descente.',
      'Descends en pliant hanches et genoux en même temps ; les genoux suivent la direction des pointes de pieds.',
      'Descends aussi bas que tu peux en gardant le dos neutre et les talons au sol.',
      'Remonte en poussant le sol avec tout le pied, buste et hanches montant au même rythme. Expire en fin de remontée.'
    ],
    errors: [
      'Genoux qui rentrent vers l’intérieur à la remontée.',
      'Talons qui décollent ou poids sur les orteils.',
      'Bas du dos qui s’arrondit en bas du mouvement.',
      'Hanches qui remontent avant les épaules (le squat se transforme en « good morning »).'
    ],
    tips: [
      'Utilise les sécurités du rack réglées juste sous ta position basse.',
      'La profondeur et l’écartement des pieds dépendent de ta morphologie : cherche la position qui reste confortable pour le genou.'
    ],
    morpho: 'Avec des fémurs longs par rapport au buste, le buste penche naturellement plus en avant : un écartement plus large ou des talonnettes peuvent aider. Ce n’est pas une erreur en soi.',
    videos: [
      V('J_Zm4XvE__s', 'Comment faire un SQUAT parfait (explications complètes en 3D)', 'Nassim Sahili', '13:33'),
      V('Z7kfOLJauo8', 'Même taille, mais pas la même morphologie (adapte ton squat)', 'Nassim Sahili', '10:10'),
      V('WVkMZOPtid4', 'COMMENT FAIRE DU SQUAT ?', 'Tibo InShape', '5:11')
    ],
    alts: ['legpress', 'hacksquat', 'frontsquat'],
    ref: 'https://exrx.net/WeightExercises/Quadriceps/BBSquat'
  },
  {
    id: 'legpress', name: 'Presse à cuisses', group: 'Jambes', equipment: 'Presse 45°', kind: 'machine', load: 'total', increment: 10,
    img: { src: '0127', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : jambes tendues (sans verrouiller)', 'Position basse'] },
    muscles: { primary: ['quads'], secondary: ['glutes', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'calves'] },
    steps: [
      'Assieds-toi le dos et le bassin bien plaqués contre le dossier.',
      'Pieds à largeur de hanches au milieu de la plateforme.',
      'Déverrouille les sécurités, jambes presque tendues.',
      'Descends en contrôlant jusqu’à ce que les genoux approchent de la poitrine, sans que le bassin décolle du siège.',
      'Pousse avec tout le pied pour revenir, sans verrouiller complètement les genoux en haut.'
    ],
    errors: [
      'Bassin qui s’enroule et décolle du dossier en bas (le bas du dos s’arrondit).',
      'Genoux verrouillés brutalement en haut.',
      'Genoux qui rentrent vers l’intérieur.',
      'Amplitude très réduite pour charger plus lourd.'
    ],
    tips: ['Pieds plus bas sur la plateforme : plus de quadriceps. Pieds plus hauts : plus de fessiers et d’ischios.'],
    videos: [V('sfQKHQ2RWeo', 'La PRESSE à CUISSES | MUSCULATION bas du corps', 'Nassim Sahili', '4:36')],
    alts: ['hacksquat', 'squat', 'bulgarian'],
    ref: 'https://exrx.net/WeightExercises/Quadriceps/SL45LegPress'
  },
  {
    id: 'hacksquat', name: 'Hack squat (machine)', group: 'Jambes', equipment: 'Machine hack squat', kind: 'machine', load: 'total', increment: 10,
    img: { src: '0123', ext: 'svg', seq: ['t', 'r'], labels: ['Départ', 'Position basse'] },
    muscles: { primary: ['quads'], secondary: ['glutes', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'calves'] },
    steps: [
      'Dos et épaules contre les appuis, pieds à largeur de hanches sur la plateforme.',
      'Déverrouille la sécurité et descends en pliant les genoux de façon contrôlée.',
      'Va aussi bas que possible sans que le bas du dos décolle du dossier.',
      'Remonte en poussant avec tout le pied, sans verrouiller les genoux en haut.'
    ],
    errors: ['Talons qui décollent.', 'Bassin qui décolle du dossier en bas.', 'Descente non contrôlée.'],
    tips: ['La position des pieds modifie la répartition entre quadriceps et fessiers, comme à la presse.'],
    videos: [],
    search: 'hack squat machine technique',
    alts: ['legpress', 'squat'],
    ref: 'https://exrx.net/WeightExercises/Quadriceps/SLHackSquat'
  },
  {
    id: 'frontsquat', name: 'Squat avant (front squat)', group: 'Jambes', equipment: 'Barre + rack', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0138', ext: 'svg', seq: ['t', 'r'], labels: ['Départ', 'Position basse'] },
    muscles: { primary: ['quads'], secondary: ['glutes', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'erectors', 'deltAnt', 'abs'] },
    steps: [
      'Barre posée sur l’avant des épaules, coudes hauts et dirigés vers l’avant.',
      'Pieds à largeur d’épaules, gainage avant la descente.',
      'Descends en gardant le buste le plus vertical possible.',
      'Remonte en gardant les coudes hauts.'
    ],
    errors: ['Coudes qui tombent (la barre glisse vers l’avant).', 'Dos qui s’arrondit.', 'Talons qui décollent.'],
    videos: [V('IldmScZA5bQ', 'Le SQUAT pour les CUISSES, c\'est mauvais ? (SQUAT vs FRONT SQUAT)', 'Nassim Sahili', '9:43')],
    alts: ['squat', 'hacksquat'],
    ref: 'https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat'
  },
  {
    id: 'legext', name: 'Extension des quadriceps', group: 'Jambes', equipment: 'Machine leg extension', kind: 'machine', load: 'total', increment: 5,
    img: { src: '0142', ext: 'svg', seq: ['r', 't'], labels: ['Départ : genoux fléchis', 'Jambes tendues'] },
    muscles: { primary: ['quads'], secondary: [], stabilizers: [] },
    steps: [
      'Règle le dossier pour que l’axe de la machine soit aligné avec le genou.',
      'Le boudin repose sur le bas du tibia, au-dessus de la cheville.',
      'Tiens les poignées et garde les fesses collées au siège.',
      'Tends les jambes sans élan, marque une courte pause en haut.',
      'Redescends lentement (2 à 3 secondes).'
    ],
    errors: ['Élan et rebond en bas.', 'Fesses qui décollent du siège.', 'Axe de la machine mal aligné avec le genou.'],
    tips: ['Si le genou est sensible, réduis la charge ou l’amplitude et arrête l’exercice en cas de douleur.'],
    videos: [V('ljO4jkwv8wQ', 'How To Do Leg Extensions With Perfect Technique (Grow Every Quad Head)', 'Jeff Nippard', '6:37', 'en')],
    alts: ['legpress', 'hacksquat'],
    ref: 'https://exrx.net/WeightExercises/Quadriceps/LVLegExtension'
  },
  {
    id: 'bulgarian', name: 'Fentes bulgares', group: 'Jambes', equipment: 'Haltères + banc', kind: 'dumbbell', load: 'perDb', increment: 5, unilateral: true,
    img: { src: '0129', ext: 'svg', seq: ['t', 'r'], labels: ['Départ', 'Position basse'], note: 'Illustration la plus proche disponible sous licence libre : fente arrière aux haltères. Pour la version bulgare, le pied arrière repose sur un banc derrière toi.' },
    muscles: { primary: ['glutes'], secondary: ['quads', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'calves', 'erectors'] },
    steps: [
      'Dos à un banc, pose le dessus du pied arrière sur le banc. Le pied avant est assez loin pour que le genou reste stable.',
      'Haltères tenus bras tendus le long du corps, buste légèrement penché vers l’avant.',
      'Descends verticalement en pliant le genou avant jusqu’à ce que la cuisse avant soit proche de l’horizontale.',
      'Remonte en poussant dans le talon et le milieu du pied avant.',
      'Fais toutes les répétitions d’une jambe, puis change.'
    ],
    errors: ['Pied avant trop proche du banc (talon qui décolle).', 'Genou avant qui part vers l’intérieur.', 'Poussée avec la jambe arrière au lieu de la jambe avant.'],
    tips: ['Buste plus penché et pas plus long : davantage de fessiers. Buste droit et pas plus court : davantage de quadriceps.', 'Commence sans charge pour trouver la bonne distance.'],
    videos: [],
    search: 'fentes bulgares technique',
    alts: ['revlunge', 'stepup', 'legpress'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/BBSingleLegSplitSquat'
  },
  {
    id: 'revlunge', name: 'Fentes arrière haltères', group: 'Jambes', equipment: 'Haltères', kind: 'dumbbell', load: 'perDb', increment: 5, unilateral: true,
    img: { src: '0129', ext: 'svg', seq: ['t', 'r'], labels: ['Départ', 'Position basse'] },
    muscles: { primary: ['glutes'], secondary: ['quads', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'calves', 'erectors', 'obliques'] },
    steps: [
      'Debout, haltères le long du corps, pieds à largeur de hanches.',
      'Fais un grand pas en arrière et descends jusqu’à ce que le genou arrière frôle le sol.',
      'Le poids reste sur la jambe avant.',
      'Remonte en poussant sur la jambe avant pour revenir à la position de départ.'
    ],
    errors: ['Pas trop court (genou avant très en avant, talon qui décolle).', 'Buste qui s’effondre vers l’avant.', 'Genou avant qui rentre.'],
    videos: [V('-tN1VtiY0oM', 'Les conseils FITNASS | Fentes, Mollets, Abdos...', 'Nassim Sahili', '4:49')],
    alts: ['bulgarian', 'stepup'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/DBRearLunge'
  },
  {
    id: 'stepup', name: 'Montées sur banc (step-up)', group: 'Jambes', equipment: 'Haltères + banc/box', kind: 'dumbbell', load: 'perDb', increment: 5, unilateral: true,
    img: { src: '0137', ext: 'svg', seq: ['r', 't'], labels: ['Départ : pied sur le banc', 'En haut'] },
    muscles: { primary: ['glutes'], secondary: ['quads', 'adductors', 'soleus'], stabilizers: ['hamstrings', 'calves', 'erectors', 'obliques'] },
    steps: [
      'Pose un pied entier sur un banc stable (hauteur : genou à environ 90°).',
      'Monte en poussant uniquement avec la jambe posée sur le banc.',
      'Redescends lentement en contrôlant.',
      'Enchaîne toutes les répétitions d’un côté puis change.'
    ],
    errors: ['Impulsion avec la jambe au sol.', 'Banc trop haut.', 'Genou qui rentre vers l’intérieur.'],
    videos: [],
    search: 'step up haltères technique',
    alts: ['bulgarian', 'revlunge'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/DBStepUp'
  },
  {
    id: 'rdl', name: 'Soulevé de terre roumain', group: 'Ischios', equipment: 'Barre', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0118', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : debout', 'Position basse (étirement des ischios)'] },
    muscles: { primary: ['hamstrings'], secondary: ['glutes', 'adductors'], stabilizers: ['erectors', 'traps', 'abs', 'obliques'] },
    steps: [
      'Debout, barre en main (prise à largeur d’épaules), pieds à largeur de hanches, genoux légèrement fléchis.',
      'Gaine et pousse les hanches vers l’arrière : la barre glisse le long des cuisses.',
      'Garde le dos neutre et la barre proche des jambes pendant toute la descente.',
      'Descends jusqu’à sentir un étirement marqué des ischios (souvent mi-tibia), sans arrondir le dos.',
      'Remonte en ramenant les hanches vers l’avant et en serrant les fessiers.'
    ],
    errors: ['Dos qui s’arrondit pour descendre plus bas.', 'Barre qui s’éloigne des jambes.', 'Genoux qui se plient trop (cela devient un soulevé de terre classique).', 'Hyperextension du bas du dos en haut.'],
    tips: ['L’amplitude utile s’arrête là où le dos ne peut plus rester neutre.'],
    videos: [V('_oyxCn2iSjU', 'HOW TO DO ROMANIAN DEADLIFTS (RDLs): Build Beefy Hamstrings With Perfect Technique', 'Jeff Nippard', '6:22', 'en')],
    alts: ['seatedlegcurl', 'legcurl', 'hipthrust'],
    ref: 'https://exrx.net/WeightExercises/Hamstrings/BBStrBackStrLegDeadlift'
  },
  {
    id: 'deadlift', name: 'Soulevé de terre', group: 'Dos', equipment: 'Barre', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0099', ext: 'svg', seq: ['r', 't'], labels: ['Départ : barre au sol', 'Fin : debout'] },
    muscles: { primary: ['glutes'], secondary: ['quads', 'adductors', 'hamstrings', 'soleus'], stabilizers: ['erectors', 'traps', 'abs', 'obliques'] },
    steps: [
      'Pieds à largeur de hanches, barre au-dessus du milieu du pied (environ 2-3 cm des tibias).',
      'Attrape la barre juste à l’extérieur des jambes ; tibias contre la barre.',
      'Dos neutre, poitrine sortie, épaules au-dessus ou légèrement devant la barre. Inspire et gaine.',
      'Pousse le sol avec les jambes : la barre monte en frôlant les tibias puis les cuisses.',
      'Termine debout en serrant les fessiers, sans te pencher en arrière.',
      'Redescends en contrôlant : hanches vers l’arrière d’abord, puis genoux une fois la barre passée.'
    ],
    errors: ['Dos qui s’arrondit au décollage.', 'Barre qui s’éloigne du corps.', 'Hanches qui montent avant la barre.', 'Hyperextension du dos en haut.', 'Bras qui tirent (coudes fléchis).'],
    tips: ['Repars de zéro à chaque répétition (pas de rebond).', 'Garde 2 à 3 répétitions en réserve : la technique se dégrade vite en fin de série.'],
    morpho: 'Des bras longs facilitent le soulevé de terre ; un buste long et des bras courts obligent à un départ plus incliné. La position de départ varie donc d’une personne à l’autre.',
    videos: [V('nkzKGyk8U0k', 'Soulevé De Terre | DeadLift | MUSCULATION du DOS', 'Nassim Sahili', '5:55')],
    alts: ['rdl', 'hipthrust'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/BBDeadlift'
  },
  {
    id: 'legcurl', name: 'Leg curl allongé', group: 'Ischios', equipment: 'Machine', kind: 'machine', load: 'total', increment: 5,
    img: { src: '0117', ext: 'svg', seq: ['r', 't'], labels: ['Départ : jambes tendues', 'Contraction'] },
    muscles: { primary: ['hamstrings'], secondary: ['calves'], stabilizers: [] },
    steps: [
      'Allonge-toi sur le ventre, genoux juste après le bord du banc, boudin au-dessus des talons.',
      'Bassin plaqué sur le banc, mains sur les poignées.',
      'Fléchis les genoux pour ramener les talons vers les fessiers.',
      'Redescends lentement jusqu’à ce que les jambes soient presque tendues.'
    ],
    errors: ['Bassin qui se soulève pendant la flexion.', 'Mouvement balancé.', 'Amplitude incomplète.'],
    videos: [
      V('BVEb7bZbu1A', 'Vous ne TRAVAILLEZ PAS vos ISCHIOS', 'Nassim Sahili', '8:55'),
      V('0a_fVS2s4Ho', 'The Most Effective Way to Train HAMSTRINGS | Training Science Explained', 'Jeff Nippard', '9:53', 'en')
    ],
    alts: ['seatedlegcurl', 'rdl'],
    ref: 'https://exrx.net/WeightExercises/Hamstrings/LVLyingLegCurl'
  },
  {
    id: 'seatedlegcurl', name: 'Leg curl assis', group: 'Ischios', equipment: 'Machine', kind: 'machine', load: 'total', increment: 5,
    img: { src: '0119', ext: 'svg', seq: ['r', 't'], labels: ['Départ : jambes tendues', 'Contraction'] },
    muscles: { primary: ['hamstrings'], secondary: ['calves'], stabilizers: [] },
    steps: [
      'Règle la machine : genoux alignés avec l’axe, boudin au-dessus des talons, cale-cuisses bien serré.',
      'Dos contre le dossier, buste légèrement penché vers l’avant si la machine le permet.',
      'Fléchis les genoux en tirant les talons vers le dessous du siège.',
      'Reviens lentement jusqu’à jambes presque tendues.'
    ],
    errors: ['Cale-cuisses trop lâche (les cuisses se soulèvent).', 'Retour rapide sans contrôle.', 'Amplitude partielle.'],
    tips: ['Une étude (Maeo et al., 2021) a observé une hypertrophie des ischios plus importante avec le leg curl assis qu’allongé, probablement grâce à la position plus étirée.'],
    videos: [
      V('0a_fVS2s4Ho', 'The Most Effective Way to Train HAMSTRINGS | Training Science Explained', 'Jeff Nippard', '9:53', 'en'),
      V('BVEb7bZbu1A', 'Vous ne TRAVAILLEZ PAS vos ISCHIOS', 'Nassim Sahili', '8:55')
    ],
    alts: ['legcurl', 'rdl'],
    ref: 'https://exrx.net/WeightExercises/Hamstrings/LVSeatedLegCurl'
  },
  {
    id: 'hipthrust', name: 'Hip thrust', group: 'Fessiers', equipment: 'Barre + banc', kind: 'barbell', load: 'total', increment: 10,
    img: { src: '0109', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Hanches tendues'], note: 'Illustration la plus proche disponible sous licence libre : pont fessier au sol (même mouvement de hanche). Au hip thrust, le haut du dos repose sur un banc et la barre est posée sur les hanches.' },
    muscles: { primary: ['glutes'], secondary: ['quads'], stabilizers: ['hamstrings', 'erectors', 'abs', 'obliques'] },
    steps: [
      'Assis au sol, le bas des omoplates contre le bord d’un banc stable. Barre (avec une protection) dans le pli des hanches.',
      'Pieds à plat, à largeur de hanches, placés pour que les tibias soient verticaux en haut du mouvement.',
      'Menton légèrement rentré, regarde devant toi.',
      'Pousse dans les talons et monte les hanches jusqu’à ce que le buste soit aligné avec les cuisses ; serre les fessiers 1 seconde.',
      'Redescends en contrôlant sans poser la barre.'
    ],
    errors: ['Cambrer le bas du dos en haut au lieu de tendre les hanches.', 'Pieds trop loin (les ischios travaillent plus) ou trop près (les quadriceps prennent le relais).', 'Amplitude partielle en haut.'],
    tips: ['Utilise un coussin de barre : le poids repose sur le bassin.'],
    videos: [
      V('xDmFkJxPzeM', 'How To Build Great Glutes with Perfect Hip Thrust Technique (Fix Mistakes!)', 'Jeff Nippard', '7:12', 'en'),
      V('osKru6YTBfM', 'Devez-vous faire du HIP THRUST pour développer vos FESSES ?', 'Nassim Sahili', '10:33')
    ],
    alts: ['glutebridge', 'rdl'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust'
  },
  {
    id: 'glutebridge', name: 'Pont fessier', group: 'Fessiers', equipment: 'Sol (lest possible)', kind: 'bodyweight', load: 'total', increment: 10,
    img: { src: '0109', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Hanches tendues'] },
    muscles: { primary: ['glutes'], secondary: [], stabilizers: ['hamstrings', 'erectors', 'abs', 'obliques'] },
    steps: ['Allongé sur le dos, genoux fléchis, pieds à plat.', 'Pousse dans les talons pour monter les hanches jusqu’à l’alignement épaules-hanches-genoux.', 'Serre les fessiers 1 seconde en haut.', 'Redescends lentement.'],
    errors: ['Cambrer le bas du dos.', 'Pousser avec la pointe des pieds.'],
    tips: ['Ajoute un disque ou une barre sur les hanches pour progresser.'],
    videos: [],
    search: 'pont fessier technique',
    alts: ['hipthrust'],
    ref: 'https://exrx.net/WeightExercises/GluteusMaximus/STHipBridge'
  },
  // ───────────────────────── MOLLETS ─────────────────────────
  {
    id: 'standcalf', name: 'Mollets debout', group: 'Mollets', equipment: 'Machine (ou Smith)', kind: 'machine', load: 'total', increment: 10,
    img: { src: '0282', ext: 'svg', seq: ['r', 't'], labels: ['Talons en bas (étirement)', 'Sur la pointe des pieds'] },
    muscles: { primary: ['calves'], secondary: ['soleus'], stabilizers: [] },
    steps: ['Épaules sous les appuis, avant-pieds sur la marche, talons dans le vide.', 'Jambes tendues (genoux non verrouillés).', 'Descends les talons le plus bas possible et marque une pause d’1 seconde en étirement.', 'Monte sur la pointe des pieds au maximum, pause d’1 seconde.'],
    errors: ['Rebondir en bas.', 'Amplitude partielle.', 'Fléchir les genoux pour s’aider.'],
    videos: [
      V('-tN1VtiY0oM', 'Les conseils FITNASS | Fentes, Mollets, Abdos...', 'Nassim Sahili', '4:49'),
      V('-qsRtp_PbVM', 'How To FORCE YOUR CALVES To Grow With Smarter Training Methods', 'Jeff Nippard', '7:46', 'en')
    ],
    alts: ['seatedcalf'],
    ref: 'https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise'
  },
  {
    id: 'seatedcalf', name: 'Mollets assis', group: 'Mollets', equipment: 'Machine', kind: 'machine', load: 'total', increment: 10,
    img: { src: '0279', ext: 'svg', seq: ['r', 't'], labels: ['Talons en bas (étirement)', 'Talons montés'] },
    muscles: { primary: ['soleus'], secondary: ['calves'], stabilizers: [] },
    steps: ['Assis, cale sur le bas des cuisses, avant-pieds sur la marche.', 'Descends les talons au maximum, pause d’1 seconde.', 'Monte les talons le plus haut possible, pause d’1 seconde.', 'Contrôle la descente.'],
    errors: ['Rebondir en bas.', 'Amplitude partielle.'],
    tips: ['Genoux fléchis : le soléaire travaille davantage que les jumeaux.'],
    videos: [V('-qsRtp_PbVM', 'How To FORCE YOUR CALVES To Grow With Smarter Training Methods', 'Jeff Nippard', '7:46', 'en')],
    alts: ['standcalf'],
    ref: 'https://exrx.net/WeightExercises/Soleus/LVSeatedCalfRaise'
  },
  // ───────────────────────── PECTORAUX ─────────────────────────
  {
    id: 'bench', name: 'Développé couché barre', group: 'Pectoraux', equipment: 'Barre + banc', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0042', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : bras tendus', 'Barre à la poitrine'] },
    muscles: { primary: ['pecs'], secondary: ['pecsUpper', 'deltAnt', 'triceps'], stabilizers: ['biceps'] },
    steps: [
      'Allongé, yeux sous la barre, pieds à plat au sol.',
      'Serre les omoplates et abaisse-les : poitrine sortie, légère cambrure naturelle, fessiers sur le banc.',
      'Prise un peu plus large que les épaules, poignets droits au-dessus des coudes.',
      'Descends la barre de façon contrôlée vers le bas des pectoraux, coudes à environ 45-70° du buste.',
      'Touche légèrement la poitrine puis pousse la barre vers le haut et légèrement vers l’arrière.'
    ],
    errors: ['Coudes ouverts à 90° (épaules en position vulnérable).', 'Rebond de la barre sur la poitrine.', 'Fessiers qui décollent du banc.', 'Omoplates qui se relâchent en cours de série.'],
    tips: ['Utilise les sécurités du rack ou un partenaire pour les séries lourdes.', 'Si l’épaule ou l’omoplate devient douloureuse, arrête la série et passe à une alternative (haltères, machine).'],
    morpho: 'Avec des bras longs, l’amplitude est plus grande : il est normal de soulever moins que quelqu’un de même gabarit aux bras courts.',
    videos: [
      V('UKSxlfZ9dm8', 'ANALYSE du DÉVELOPPÉ COUCHÉ (comment l\'effectuer PARFAITEMENT)', 'Nassim Sahili', '13:08'),
      V('rF5ZB5OCU0A', 'JE VEUX DES PECS ENORMES ! - 5 Astuces pour le développé couché', 'Tibo InShape', '3:53')
    ],
    alts: ['dbbench', 'machinepress', 'inclinedb'],
    ref: 'https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress'
  },
  {
    id: 'dbbench', name: 'Développé couché haltères', group: 'Pectoraux', equipment: 'Haltères + banc', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0055', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : bras tendus', 'Position basse'] },
    muscles: { primary: ['pecs'], secondary: ['pecsUpper', 'deltAnt', 'triceps'], stabilizers: ['biceps'] },
    steps: ['Assis, haltères sur les cuisses, allonge-toi en les ramenant au-dessus de la poitrine.', 'Omoplates serrées, pieds au sol.', 'Descends les haltères sur les côtés de la poitrine, coudes à environ 45-70° du buste.', 'Pousse vers le haut en rapprochant légèrement les haltères.'],
    errors: ['Coudes trop ouverts.', 'Descente non contrôlée.', 'Haltères qui s’entrechoquent en haut.'],
    tips: ['Les haltères laissent les poignets et les épaules trouver leur trajectoire : souvent plus confortable que la barre.'],
    videos: [],
    search: 'développé couché haltères technique',
    alts: ['bench', 'machinepress'],
    ref: 'https://exrx.net/WeightExercises/PectoralSternal/DBBenchPress'
  },
  {
    id: 'inclinedb', name: 'Développé incliné haltères', group: 'Pectoraux', equipment: 'Haltères + banc incliné', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0061', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : bras tendus', 'Position basse'] },
    muscles: { primary: ['pecsUpper'], secondary: ['pecs', 'deltAnt', 'triceps'], stabilizers: ['biceps'] },
    steps: ['Règle le banc entre 30 et 45°.', 'Omoplates serrées, pieds au sol, haltères au-dessus du haut de la poitrine.', 'Descends les haltères vers le haut des pectoraux, coudes légèrement rentrés.', 'Pousse vers le haut sans verrouiller brutalement les coudes.'],
    errors: ['Banc trop incliné (les épaules prennent le relais).', 'Fessiers qui décollent.', 'Amplitude réduite.'],
    videos: [V('ucMKYB8XeRI', 'Comment développer (enfin) le HAUT des PECTORAUX', 'Nassim Sahili', '12:17')],
    alts: ['inclinebench', 'dbbench', 'machinepress'],
    ref: 'https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress'
  },
  {
    id: 'inclinebench', name: 'Développé incliné barre', group: 'Pectoraux', equipment: 'Barre + banc incliné', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0043', ext: 'svg', seq: ['t', 'r'], labels: ['Départ : bras tendus', 'Barre au haut des pecs'] },
    muscles: { primary: ['pecsUpper'], secondary: ['pecs', 'deltAnt', 'triceps'], stabilizers: ['biceps'] },
    steps: ['Banc à 30-45°, yeux sous la barre.', 'Omoplates serrées, prise un peu plus large que les épaules.', 'Descends la barre vers le haut de la poitrine.', 'Pousse vers le haut.'],
    errors: ['Rebond sur la poitrine.', 'Banc trop incliné.', 'Omoplates relâchées.'],
    videos: [V('ucMKYB8XeRI', 'Comment développer (enfin) le HAUT des PECTORAUX', 'Nassim Sahili', '12:17')],
    alts: ['inclinedb', 'bench'],
    ref: 'https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress'
  },
  {
    id: 'machinepress', name: 'Développé pectoraux machine', group: 'Pectoraux', equipment: 'Machine chest press', kind: 'machine', load: 'total', increment: 10,
    img: { src: '0066', ext: 'svg', seq: ['r', 't'], labels: ['Départ : poignées à la poitrine', 'Bras tendus'] },
    muscles: { primary: ['pecs'], secondary: ['pecsUpper', 'deltAnt', 'triceps'], stabilizers: ['biceps'] },
    steps: ['Règle le siège pour que les poignées soient à hauteur du milieu de la poitrine.', 'Dos plaqué, omoplates serrées.', 'Pousse les poignées devant toi sans décoller les épaules du dossier.', 'Reviens lentement jusqu’à un bon étirement des pectoraux.'],
    errors: ['Siège mal réglé (poignées trop hautes).', 'Épaules qui avancent en fin de poussée.', 'Retour trop rapide.'],
    tips: ['La machine permet d’aller près de l’échec en sécurité, sans partenaire.'],
    videos: [],
    search: 'chest press machine technique',
    alts: ['dbbench', 'bench'],
    ref: 'https://exrx.net/WeightExercises/PectoralSternal/LVChestPress'
  },
  // ───────────────────────── DOS ─────────────────────────
  {
    id: 'latpulldown', name: 'Tirage vertical', group: 'Dos', equipment: 'Poulie haute', kind: 'cable', load: 'total', increment: 5,
    img: { src: 'latpd', ext: 'png', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Barre au haut de la poitrine'] },
    muscles: { primary: ['lats'], secondary: ['biceps', 'brachialis', 'brachioradialis', 'deltPost', 'traps'], stabilizers: ['triceps'] },
    steps: ['Cale les cuisses sous les boudins, prise un peu plus large que les épaules.', 'Buste légèrement incliné en arrière, poitrine sortie.', 'Tire la barre vers le haut de la poitrine en abaissant les épaules et en ramenant les coudes vers les hanches.', 'Remonte lentement jusqu’à bras tendus, en laissant les épaules monter légèrement pour étirer le dos.'],
    errors: ['Tirer derrière la nuque.', 'Se balancer en arrière pour tirer plus lourd.', 'Tirer avec les bras sans abaisser les épaules.', 'Remontée non contrôlée.'],
    tips: ['Pense « coudes vers les poches » plutôt que « mains vers la poitrine ».'],
    videos: [
      V('GxvvY6ew1XM', 'Musculation du DOS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '16:16'),
      V('pJ8YrURHCs0', '6 ÉTAPES CLÉS pour réussir (enfin) à sentir son DOS', 'Nassim Sahili', '20:21')
    ],
    alts: ['closegrippulldown', 'pullup'],
    ref: 'https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown'
  },
  {
    id: 'closegrippulldown', name: 'Tirage vertical prise serrée neutre', group: 'Dos', equipment: 'Poulie haute + poignée V', kind: 'cable', load: 'total', increment: 5,
    img: { src: '0096', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Contraction'] },
    muscles: { primary: ['lats'], secondary: ['brachialis', 'brachioradialis', 'deltPost', 'traps', 'pecs'], stabilizers: ['biceps', 'triceps'] },
    steps: ['Poignée en V, cuisses calées.', 'Tire la poignée vers le haut de la poitrine en abaissant les épaules.', 'Coudes près du corps.', 'Remonte lentement jusqu’à bras tendus.'],
    errors: ['Balancer le buste.', 'Amplitude partielle en haut.'],
    videos: [V('GxvvY6ew1XM', 'Musculation du DOS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '16:16')],
    alts: ['latpulldown', 'pullup'],
    ref: 'https://exrx.net/WeightExercises/LatissimusDorsi/CBCloseGripPulldown'
  },
  {
    id: 'pullup', name: 'Tractions', group: 'Dos', equipment: 'Barre de traction', kind: 'bodyweight', load: 'body', increment: 5,
    img: { src: '0087', ext: 'svg', seq: ['r', 't'], labels: ['Départ : suspendu', 'Menton au-dessus de la barre'] },
    muscles: { primary: ['lats'], secondary: ['brachialis', 'brachioradialis', 'biceps', 'deltPost', 'traps'], stabilizers: ['triceps'] },
    steps: ['Suspendu, prise un peu plus large que les épaules, bras tendus.', 'Abaisse d’abord les épaules, puis tire en ramenant les coudes vers les côtes.', 'Monte jusqu’à ce que le menton dépasse la barre.', 'Redescends lentement jusqu’à bras tendus.'],
    errors: ['Balancer les jambes (kipping).', 'Demi-répétitions.', 'Épaules qui montent vers les oreilles.'],
    tips: ['Charge = lest éventuel (0 = poids du corps).'],
    videos: [V('f8zEtLeS8IE', '6 CONSEILS pour performer aux TRACTIONS (et avoir un gros dos)', 'Nassim Sahili', '19:41')],
    alts: ['latpulldown', 'closegrippulldown'],
    ref: 'https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup'
  },
  {
    id: 'seatedrow', name: 'Rowing assis poulie basse', group: 'Dos', equipment: 'Poulie basse', kind: 'cable', load: 'total', increment: 5,
    img: { src: '0025', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Poignée au ventre'] },
    muscles: { primary: ['lats', 'traps'], secondary: ['deltPost', 'brachialis', 'brachioradialis', 'erectors'], stabilizers: ['biceps', 'triceps', 'hamstrings', 'glutes'] },
    steps: ['Assis, pieds sur les cales, genoux légèrement fléchis, dos droit.', 'Poignée tenue bras tendus, épaules légèrement étirées vers l’avant.', 'Tire la poignée vers le nombril en ramenant les coudes près du corps et en serrant les omoplates.', 'Reviens lentement bras tendus, sans arrondir le bas du dos.'],
    errors: ['Se balancer d’avant en arrière avec le buste.', 'Hausser les épaules.', 'Arrondir le dos au retour.'],
    videos: [V('GxvvY6ew1XM', 'Musculation du DOS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '16:16')],
    alts: ['tbarrow', 'closegrippulldown'],
    ref: 'https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow'
  },
  {
    id: 'tbarrow', name: 'Rowing horizontal (barre T / machine appui poitrine)', group: 'Dos', equipment: 'Barre T ou machine', kind: 'machine', load: 'total', increment: 5,
    img: { src: '0029', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Contraction'] },
    muscles: { primary: ['lats', 'traps'], secondary: ['deltPost', 'brachialis', 'brachioradialis'], stabilizers: ['biceps', 'erectors', 'hamstrings', 'glutes'] },
    steps: ['Si la machine a un appui poitrine, plaque la poitrine contre le support.', 'Prends les poignées bras tendus, épaules relâchées vers l’avant.', 'Tire en ramenant les coudes vers l’arrière et en serrant les omoplates.', 'Redescends lentement jusqu’à bras tendus.'],
    errors: ['Donner de l’élan avec le buste.', 'Hausser les épaules.', 'Amplitude partielle.'],
    tips: ['La version avec appui poitrine soulage les lombaires, déjà sollicitées par le soulevé de terre et le roumain.'],
    videos: [V('GxvvY6ew1XM', 'Musculation du DOS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '16:16')],
    alts: ['seatedrow'],
    ref: 'https://exrx.net/WeightExercises/BackGeneral/LVTBarRow'
  },
  // ───────────────────────── ÉPAULES ─────────────────────────
  {
    id: 'latraise', name: 'Élévations latérales', group: 'Épaules', equipment: 'Haltères', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0018', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras le long du corps', 'Bras à l’horizontale'] },
    muscles: { primary: ['deltLat'], secondary: ['deltAnt', 'traps', 'serratus'], stabilizers: [] },
    steps: ['Debout, haltères le long du corps, coudes très légèrement fléchis.', 'Buste légèrement penché vers l’avant.', 'Monte les bras sur les côtés jusqu’à l’horizontale environ, en menant avec les coudes.', 'Redescends lentement (2 secondes).'],
    errors: ['Utiliser l’élan du buste.', 'Hausser les épaules (les trapèzes prennent le relais).', 'Charge trop lourde qui empêche de monter à l’horizontale.'],
    tips: ['Charge légère et contrôle : c’est un muscle qui répond bien aux séries longues.'],
    morpho: 'Des bras longs augmentent le bras de levier : la même charge paraît plus lourde.',
    videos: [
      V('q64gEgFHDnU', 'Exécuter PARFAITEMENT les ÉLÉVATIONS LATÉRALES (Test EMG)', 'Nassim Sahili', '8:37'),
      V('TnKwgVrCtl8', 'Voici pourquoi personne n\'arrive à faire cet exercice correctement', 'Nassim Sahili', '9:35', 'fr', 'Variante à la poulie : placement de la poulie.')
    ],
    alts: ['dbshoulderpress'],
    ref: 'https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise'
  },
  {
    id: 'reardelt', name: 'Oiseau (buste penché)', group: 'Épaules', equipment: 'Haltères (+ banc)', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0032', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras pendants', 'Bras écartés'] },
    muscles: { primary: ['deltPost'], secondary: ['rotators', 'deltLat', 'traps'], stabilizers: ['triceps', 'erectors'] },
    steps: ['Buste penché presque à l’horizontale (front posé sur un banc incliné si possible).', 'Haltères sous les épaules, coudes légèrement fléchis, paumes face à face.', 'Écarte les bras sur les côtés en gardant l’angle des coudes, jusqu’à hauteur d’épaules.', 'Redescends lentement.'],
    errors: ['Serrer fort les omoplates (les trapèzes et rhomboïdes prennent le relais).', 'Élan du buste.', 'Charge trop lourde.'],
    videos: [
      V('vFvs6ynH39c', 'Ce muscle oublié de tous | MUSCULATION arrière d\'épaule', 'Nassim Sahili', '4:07'),
      V('7--wCDtdGHM', 'Comment développer (enfin) l\'arrière d’épaule', 'Nassim Sahili', '13:15')
    ],
    alts: ['inclinereardelt'],
    ref: 'https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise'
  },
  {
    id: 'inclinereardelt', name: 'Oiseau allongé sur banc incliné', group: 'Épaules', equipment: 'Haltères + banc incliné', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0023', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Bras écartés'] },
    muscles: { primary: ['deltPost'], secondary: ['rotators', 'deltLat', 'traps'], stabilizers: ['triceps'] },
    steps: ['Allongé sur le ventre sur un banc incliné à ~30°, bras pendants.', 'Écarte les bras sur les côtés jusqu’à hauteur d’épaules, coudes légèrement fléchis.', 'Redescends lentement.'],
    errors: ['Soulever la poitrine du banc.', 'Charge trop lourde.'],
    tips: ['L’appui sur le banc supprime l’élan et soulage le bas du dos.'],
    videos: [V('vFvs6ynH39c', 'Ce muscle oublié de tous | MUSCULATION arrière d\'épaule', 'Nassim Sahili', '4:07')],
    alts: ['reardelt'],
    ref: 'https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise'
  },
  {
    id: 'dbshoulderpress', name: 'Développé épaules haltères', group: 'Épaules', equipment: 'Haltères + banc', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: 'dbsp', ext: 'png', seq: ['r', 't'], labels: ['Départ : haltères aux épaules', 'Bras tendus'] },
    muscles: { primary: ['deltAnt'], secondary: ['deltLat', 'triceps', 'traps', 'serratus', 'pecsUpper', 'supraspinatus'], stabilizers: ['biceps'] },
    steps: ['Assis sur un banc avec dossier presque vertical, dos plaqué.', 'Haltères à hauteur d’épaules, coudes légèrement en avant du buste.', 'Pousse les haltères au-dessus de la tête sans les entrechoquer.', 'Redescends jusqu’à hauteur d’oreilles ou d’épaules, selon ton confort.'],
    errors: ['Cambrer fortement le bas du dos.', 'Coudes complètement ouverts sur les côtés.', 'Amplitude réduite.'],
    tips: ['Si l’épaule ou l’omoplate est douloureuse, réduis l’amplitude ou passe à une alternative.'],
    videos: [V('jHyklSTDbP0', 'Développé militaire : maximise tes gains musculaires !', 'Nassim Sahili', '9:40', 'fr', 'Vidéo sur le développé militaire : principes communs au développé haltères.')],
    alts: ['latraise'],
    ref: 'https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress'
  },
  // ───────────────────────── BRAS ─────────────────────────
  {
    id: 'dbcurl', name: 'Curl biceps haltères', group: 'Bras', equipment: 'Haltères', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0224', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Contraction'] },
    muscles: { primary: ['biceps'], secondary: ['brachialis', 'brachioradialis'], stabilizers: ['deltAnt'] },
    steps: ['Debout, haltères bras tendus, paumes vers l’avant.', 'Coudes fixes le long du corps.', 'Fléchis les coudes pour monter les haltères vers les épaules.', 'Redescends lentement jusqu’à bras complètement tendus.'],
    errors: ['Balancer le buste.', 'Coudes qui avancent.', 'Descente incomplète.'],
    videos: [V('mB1XAwbMbxo', 'Musculation des BICEPS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '15:24')],
    alts: ['barbellcurl', 'cablecurl', 'inclinecurl'],
    ref: 'https://exrx.net/WeightExercises/Biceps/DBCurl'
  },
  {
    id: 'barbellcurl', name: 'Curl barre', group: 'Bras', equipment: 'Barre (droite ou EZ)', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0211', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Contraction'] },
    muscles: { primary: ['biceps'], secondary: ['brachialis', 'brachioradialis'], stabilizers: ['deltAnt'] },
    steps: ['Debout, prise en supination à largeur d’épaules.', 'Coudes fixes.', 'Monte la barre vers les épaules.', 'Redescends lentement.'],
    errors: ['Élan du buste.', 'Coudes qui avancent.'],
    videos: [V('mB1XAwbMbxo', 'Musculation des BICEPS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '15:24')],
    alts: ['dbcurl', 'cablecurl'],
    ref: 'https://exrx.net/WeightExercises/Biceps/BBCurl'
  },
  {
    id: 'cablecurl', name: 'Curl poulie basse', group: 'Bras', equipment: 'Poulie basse', kind: 'cable', load: 'total', increment: 5,
    img: { src: '0212', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Contraction'] },
    muscles: { primary: ['biceps'], secondary: ['brachialis', 'brachioradialis'], stabilizers: ['deltAnt'] },
    steps: ['Face à la poulie basse, barre ou poignée en supination.', 'Coudes fixes le long du corps.', 'Fléchis les coudes.', 'Redescends lentement.'],
    errors: ['Se pencher en arrière.', 'Coudes qui avancent.'],
    videos: [],
    search: 'curl poulie basse technique',
    alts: ['dbcurl', 'barbellcurl'],
    ref: 'https://exrx.net/WeightExercises/Biceps/CBCurl'
  },
  {
    id: 'inclinecurl', name: 'Curl incliné haltères', group: 'Bras', equipment: 'Haltères + banc incliné', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0214', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras pendants', 'Contraction'] },
    muscles: { primary: ['biceps'], secondary: ['brachialis', 'brachioradialis'], stabilizers: ['deltAnt'] },
    steps: ['Assis sur un banc incliné à ~45-60°, bras pendants derrière le buste.', 'Fléchis les coudes sans avancer les épaules.', 'Redescends lentement jusqu’à bras tendus.'],
    errors: ['Coudes qui partent vers l’avant.', 'Charge trop lourde.'],
    tips: ['Position étirée du biceps : commence léger.'],
    videos: [V('mB1XAwbMbxo', 'Musculation des BICEPS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '15:24')],
    alts: ['dbcurl'],
    ref: 'https://exrx.net/WeightExercises/Biceps/DBInclineCurl'
  },
  {
    id: 'hammercurl', name: 'Curl marteau', group: 'Bras', equipment: 'Haltères', kind: 'dumbbell', load: 'perDb', increment: 5,
    img: { src: '0227', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Contraction'] },
    muscles: { primary: ['brachioradialis'], secondary: ['brachialis', 'biceps'], stabilizers: ['deltAnt'] },
    steps: ['Debout, haltères le long du corps, paumes face à face (prise neutre).', 'Coudes fixes.', 'Monte les haltères en gardant la prise neutre.', 'Redescends lentement.'],
    errors: ['Balancer le buste.', 'Coudes qui avancent.'],
    videos: [V('mB1XAwbMbxo', 'Musculation des BICEPS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '15:24')],
    alts: ['dbcurl', 'cablecurl'],
    ref: 'https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl'
  },
  {
    id: 'preacher', name: 'Curl pupitre', group: 'Bras', equipment: 'Pupitre + barre EZ', kind: 'barbell', load: 'total', increment: 5,
    img: { src: '0239', ext: 'svg', seq: ['r', 't'], labels: ['Départ : bras tendus', 'Contraction'] },
    muscles: { primary: ['brachialis'], secondary: ['biceps', 'brachioradialis'], stabilizers: [] },
    steps: ['Assis au pupitre, aisselles calées contre le haut du coussin.', 'Barre en supination, bras presque tendus.', 'Fléchis les coudes jusqu’à ce que les avant-bras soient presque verticaux.', 'Redescends lentement sans verrouiller brutalement en bas.'],
    errors: ['Décoller les coudes du pupitre.', 'Laisser tomber la barre en bas (stress sur le coude).'],
    tips: ['ExRx classe le brachial antérieur comme muscle cible de cet exercice.'],
    videos: [V('mB1XAwbMbxo', 'Musculation des BICEPS | mes conseils d\'EXÉCUTION', 'Nassim Sahili', '15:24')],
    alts: ['dbcurl', 'cablecurl'],
    ref: 'https://exrx.net/WeightExercises/Brachialis/BBPreacherCurl'
  },
  // ───────────────────────── ABDOS ─────────────────────────
  {
    id: 'cablecrunch', name: 'Crunch à la poulie haute', group: 'Abdos', equipment: 'Poulie haute + corde', kind: 'cable', load: 'total', increment: 5,
    img: { src: '0288', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Enroulement'], note: 'Illustration : variante assise. La version à genoux suit le même principe.' },
    muscles: { primary: ['abs'], secondary: ['obliques'], stabilizers: ['hipFlexors'] },
    steps: ['À genoux face à la poulie haute, corde tenue près du front.', 'Hanches fixes (elles ne doivent pas reculer).', 'Enroule la colonne en rapprochant les côtes du bassin.', 'Reviens lentement en déroulant le dos.'],
    errors: ['Tirer avec les bras.', 'Faire descendre les fesses vers les talons (les hanches font le travail).', 'Amplitude réduite.'],
    videos: [],
    search: 'crunch poulie haute technique',
    alts: ['reversecrunch', 'crunch'],
    ref: 'https://exrx.net/WeightExercises/RectusAbdominis/CBKneelingCrunch'
  },
  {
    id: 'reversecrunch', name: 'Crunch inversé (relevé de bassin)', group: 'Abdos', equipment: 'Sol ou banc', kind: 'bodyweight', load: 'body', increment: 5,
    img: { src: '0287', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Bassin enroulé'] },
    muscles: { primary: ['abs'], secondary: ['obliques', 'hipFlexors'], stabilizers: [] },
    steps: ['Allongé sur le dos, bras le long du corps, genoux fléchis.', 'Enroule le bassin pour décoller les fesses du sol en amenant les genoux vers la poitrine.', 'Contrôle la descente sans laisser le bas du dos se cambrer.'],
    errors: ['Utiliser l’élan des jambes.', 'Cambrer le bas du dos en redescendant.'],
    tips: ['Le mouvement vient de l’enroulement du bassin, pas du lancer des jambes.', 'Muscles : classement ExRx du « leg-hip raise » (même mouvement d’enroulement du bassin, version suspendue).'],
    videos: [],
    search: 'crunch inversé technique',
    alts: ['cablecrunch', 'crunch'],
    ref: 'https://exrx.net/WeightExercises/RectusAbdominis/BWHangingLegHipRaiseAbStrap'
  },
  {
    id: 'crunch', name: 'Crunch au sol', group: 'Abdos', equipment: 'Sol', kind: 'bodyweight', load: 'body', increment: 5,
    img: { src: '0291', ext: 'svg', seq: ['r', 't'], labels: ['Départ', 'Enroulement'] },
    muscles: { primary: ['abs'], secondary: ['obliques'], stabilizers: [] },
    steps: ['Allongé, genoux fléchis, mains sur la poitrine ou aux tempes.', 'Enroule le haut du dos en rapprochant les côtes du bassin.', 'Redescends lentement.'],
    errors: ['Tirer sur la nuque avec les mains.', 'Se relever complètement en utilisant les fléchisseurs de hanche.'],
    videos: [V('-tN1VtiY0oM', 'Les conseils FITNASS | Fentes, Mollets, Abdos...', 'Nassim Sahili', '4:49')],
    alts: ['cablecrunch', 'reversecrunch'],
    ref: 'https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch'
  }
];

export const EX = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

export const GROUPS = ['Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Ischios', 'Fessiers', 'Mollets', 'Abdos'];

export function exImages(ex) {
  if (!ex || !ex.img) return [];
  return ex.img.seq.map((s, i) => ({ src: `assets/ex/${ex.img.src}-${s}.${ex.img.ext}`, label: ex.img.labels[i] }));
}

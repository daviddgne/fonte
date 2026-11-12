# Crédits, sources et licences

## Illustrations d'exercices — `assets/ex/`

- Source : **Everkinetic** — https://github.com/everkinetic/data (projet basé sur everkinetic.com, créé par Greg Priday).
- Licence : **Creative Commons Attribution-Partage dans les mêmes conditions 4.0 (CC BY-SA 4.0)** —
  https://creativecommons.org/licenses/by-sa/4.0/
- Modifications : couleurs adaptées au thème sombre (traits clairs, fond transparent) ; deux images
  (`latpd-*.png`, `dbsp-*.png`) redimensionnées et converties depuis `src/images-web`.
- Les fichiers modifiés sont redistribués sous la même licence CC BY-SA 4.0.
- Limites signalées dans l'app : pas d'illustration exacte du hip thrust (pont fessier montré) ni des fentes bulgares
  (fente arrière montrée) ; crunch poulie illustré en variante assise.

## Carte musculaire — `assets/muscles/`, `js/data/muscle-shapes.js`

- Silhouettes : « Muscular system » et « Muscular system-back » par **Termininja**, Wikimedia Commons —
  https://commons.wikimedia.org/wiki/File:Muscular_system.svg —
  https://commons.wikimedia.org/wiki/File:Muscular_system-back.svg — licence **CC BY-SA 3.0**.
- Zones musculaires 1 à 16 : projet **wger** (https://github.com/wger-project/wger, `wger/core/static/images/muscles`),
  dérivées des fichiers ci-dessus (CC BY-SA 3.0).
- Zones « deltoïde postérieur », « avant-bras » et « adducteurs » : tracées pour cette application sur la même base,
  diffusées sous CC BY-SA 3.0.
- Rendu : silhouette inversée pour le thème sombre, zones recolorées (turquoise = principal, ambre = secondaires).

## Muscles sollicités et technique

- Classement des muscles (cible / synergistes / stabilisateurs) : **ExRx.net** (lien sur chaque fiche).
  Les pages consultées ont été vérifiées le 12/11/2026.
- Consignes et erreurs fréquentes : rédigées pour l'app à partir des descriptions ExRx et des recommandations
  classiques d'exécution ; à confronter aux vidéos.

## Vidéos

Intégrées via le lecteur YouTube officiel (youtube-nocookie.com) ; aucune vidéo n'est copiée.
Chaque identifiant a été vérifié (existence, chaîne, titre exact) via l'API oEmbed de YouTube le 12/11/2026.
Chaînes : Nassim Sahili, Tibo InShape, Jeff Nippard (en anglais, utilisée quand aucune vidéo française
spécifique n'a été trouvée). Pour les exercices sans vidéo spécifique : lien de recherche YouTube.
Le contenu des vidéos n'a pas été visionné en entier : la sélection repose sur le titre, la chaîne,
la description et la durée.

## Références scientifiques (onglet Programme)

Schoenfeld et al. 2016 et 2017 ; Singer et al. 2024 ; Refalo et al. 2023 ; Robinson et al. 2024 ; Maeo et al. 2021 ;
Schumann et al. 2022 ; Bell et al. 2023 ; Krzysztofik et al. 2019. Références complètes dans `js/data/program.js`.

## Code

Licence MIT (fichier LICENSE). Aucune bibliothèque externe.

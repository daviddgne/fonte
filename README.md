# Fonte — carnet de musculation (PWA)

Application web installable (PWA) pour suivre mes séances de musculation sur Android :
programme A/B/C/D, chrono de séance, progression en % de toute la séance, repos automatiques,
supersets guidés, fiches techniques illustrées, historique et graphiques. Charges en **livres (lb)**.

Aucune installation, aucun compte, aucun serveur : les données restent dans le téléphone
(stockage local du navigateur), avec export / restauration en fichier JSON.

## Fonctionnalités

- **Séances** : cartes A, B, C, D avec groupes musculaires, nombre de séries, durée estimée, séance suggérée.
  Programme du 14/11 : 3 séries minimum par exercice (4 aux élévations latérales et au curl au pupitre).
- **Échauffement guidé** au début de chaque séance (≈ 9 min) : elliptique 5 min avec chrono, mobilité adaptée à la séance
  (dont exercices à l'élastique), liens de démonstration, puis séries d'approche calculées en direct.
- **Mobile d'abord** : défilement au doigt, bouton « Valider » toujours à portée du pouce, boutons ≥ 44 px.
- **Séance en cours** : chrono global, barre de progression de la séance entière (séries faites / prévues),
  série en cours, charge (lb) et répétitions pré-remplies, validation en un geste, calcul des disques par côté.
- **Repos** : lancé automatiquement à la validation, ±15 s, passer, réduire ; son + vibration à la fin
  (+ notification optionnelle si l'app est en arrière-plan). L'écran reste allumé pendant la séance.
- **Supersets** : enchaînement A1 → A2 sans repos, puis récupération ; bandeau « Enchaîne sans repos ».
- **Douleur** : signalement par série ; propositions (arrêter l'exercice, remplacer, alléger). Jamais d'incitation à forcer.
- **Remplacement** d'un exercice pendant la séance (alternatives conseillées), avec option « aussi dans le programme ».
- **Progression** : dernière performance affichée, double progression (+5 lb quand toutes les séries atteignent le haut de la fourchette),
  séries d'échauffement calculées, records (1RM estimé).
- **Cycle de 8 semaines** : phase en cours, effort cible (répétitions en réserve). Le nombre de séries ne change jamais ;
  en semaine 8 (décharge), les charges sont proposées à −10 % (désactivable).
- **Fiches techniques** : illustration animée (ou 2 positions côte à côte), **vidéo de Nassim Sahili juste en dessous**
  (ou recherche YouTube « Nassim Sahili + exercice » quand aucune vidéo dédiée n'existe), carte musculaire face/dos,
  exécution, erreurs fréquentes, conseils, morphologie, autres vidéos vérifiées, alternatives, historique de l'exercice.
- **Personnalisation** sans code : exercices, ordre, séries, répétitions, repos, charge de départ, pas de charge,
  supersets, échauffement, séances, exercices personnalisés.
- **Hors ligne** après la première ouverture (service worker).

## Publier sur GitHub Pages

### Option 1 — en ligne de commande (Git Bash)

```bash
cd "chemin/vers/Sport/fonte"
git init -b main
git add .
git commit -m "Fonte : première version"
gh repo create fonte --public --source . --push
gh api -X POST repos/{owner}/fonte/pages -f "source[branch]=main" -f "source[path]=/"
```

L'adresse sera `https://<ton-compte>.github.io/fonte/` (1 à 2 minutes après la publication).

> GitHub Pages gratuit nécessite un dépôt **public** : le code et les fiches seront visibles,
> mais **pas tes données d'entraînement** (elles restent dans ton téléphone).

### Option 2 — depuis le site GitHub

1. Crée un dépôt `fonte` (public) sur github.com.
2. « Add file » → « Upload files » : glisse **le contenu** du dossier `fonte` (pas le dossier lui-même).
3. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)` → Save.

### Mettre à jour l'application

Modifie les fichiers puis `git add . && git commit -m "…" && git push`.
Sur le téléphone, l'app télécharge la nouvelle version en arrière-plan puis se recharge seule
(sauf pendant une séance : elle s'applique au lancement suivant). Si rien ne change, ferme complètement l'app et rouvre-la.

## Installer sur Android

1. Ouvre `https://<ton-compte>.github.io/fonte/` dans **Chrome**.
2. Menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
3. Lance « Fonte » depuis l'écran d'accueil : elle s'ouvre en plein écran et fonctionne hors ligne.
4. Conseillé : Réglages → « Demander la protection du stockage », puis **Exporter** une sauvegarde régulièrement.

## Sauvegarde et restauration

- **Réglages → Exporter** : crée `fonte-sauvegarde-AAAA-MM-JJ.json` (partage vers Drive, e-mail…).
- **Réglages → Restaurer** : sélectionne un fichier exporté (remplace les données du téléphone après confirmation).
- Les données sont liées au navigateur : désinstaller Chrome ou « Effacer les données du site » les supprime → exporte avant.

## Tester

Servir le dossier en local (n'importe quel serveur statique), puis ouvrir `tests/index.html` :
20 tests (pourcentage de séance, supersets, repos, double progression, séries d'approche, disques,
durées ≤ 75 min, programme conforme au fichier Séances avec 3 séries minimum, cycle sans retrait de séries,
échauffements guidés, liens Nassim, absence d'extension triceps, cohérence de la bibliothèque).
Sur GitHub Pages : `https://<ton-compte>.github.io/fonte/tests/`.

## Structure

```
index.html, manifest.webmanifest, sw.js   application, manifeste PWA, service worker
css/app.css                                thème sombre
js/app.js                                  routeur, événements, chrono
js/engine.js                               logique de séance (pure, testée)
js/store.js                                stockage local, export/import, cycle
js/data/program.js                         programme par défaut, cycle, justifications
js/data/exercises.js                       fiches d'exercices
js/data/muscle-shapes.js, js/muscles.js    carte musculaire
js/views/*.js                              écrans
assets/ex, assets/muscles, assets/icons    illustrations et icônes
tests/                                     tests du moteur
```

Pas de dépendance, pas d'étape de compilation : on modifie un fichier, on publie.

## Crédits et licences

Voir [CREDITS.md](CREDITS.md). Code : MIT ([LICENSE](LICENSE)).
Illustrations et carte musculaire : CC BY-SA (attribution obligatoire, conservée dans l'app).

Cette application ne remplace pas l'avis d'un professionnel de santé.

# Démonstration 3D — Fenêtre Ombrair, volet en option

Rapport de réalisation. Projet étudiant fictif, Master MIASHS, Université
Toulouse Jean Jaurès.

> **Simulation illustrative du comportement Ombrair.** Elle n'est destinée ni
> au dimensionnement thermique ni à la régulation réelle d'un bâtiment. Les
> seuils sont choisis pour être lisibles à l'écran, aucun n'est mesuré.

---

## 1. Ce qui a été livré

Sur `/gammes/fenetre`, juste sous le hero : quatre curseurs de conditions
(deux températures, luminosité, humidité intérieure), une scène 3D temps réel
où la fenêtre motorisée s'ouvre et se ferme, et un panneau texte qui énonce la
stratégie retenue et la justifie.

Un interrupteur — **« Afficher le volet dans la simulation »** — fait
apparaître le volet Ombrair **dans la même baie**, à sa place physique : côté
rue, devant le vitrage, derrière la façade. Les deux équipements réagissent
alors ensemble, et se répartissent le travail :

```
Fenêtre = l'air     ·     Volet = l'ombre     ·     Ombrair = l'arbitrage
```

Le visiteur ne pilote pas les mécanismes. Il pilote les **conditions** — c'est
le système qui décide. Un mode manuel existe pour vérifier l'amplitude réelle
de la mécanique, mais il est second.

---

## 2. Réponse à la première question technique : que réutiliser de la démo Volet ?

C'était la question à trancher avant d'écrire une ligne. L'audit de
`/gammes/volet` a donné :

| Élément existant | Décision | Où il vit maintenant |
| --- | --- | --- |
| Cotes de la baie, profondeurs, palette | **factorisé** | `components/3d/shared/geometrie.ts` |
| Mur percé, embrasure, appui, tablette, sol, lointains | **factorisé** | `shared/architecture.tsx` |
| Dormant, vitrage | **factorisé** | `shared/architecture.tsx` |
| Éclairage suivant la luminosité | **factorisé** | `shared/eclairage.tsx` |
| Caméra, poses, limites d'orbite, reset | **factorisé** | `shared/camera-baie.tsx` |
| Coffre, rails, tablier, lames | **factorisé tel quel** | `shared/volet-assembly.tsx` |
| Curseur, rangée de situations | **factorisés** | `shared/curseur.tsx`, `shared/situations.tsx` |
| `prefers-reduced-motion` | **factorisé** | `shared/use-reduced-motion.ts` |
| `computeShutterState` (logique volet) | **réutilisé sans modification** | `lib/volet-simulation.ts` |
| Presets volet | inchangés | `lib/volet-presets.ts` |

Autrement dit : **tout**, sauf l'assemblage propre à chaque page. Le volet que
l'on voit apparaître sur la page Fenêtre n'est pas une illustration
approchante — c'est le composant `VoletAssembly` qu'affiche `/gammes/volet`,
monté dans la même baie, aux mêmes cotes.

Ce qui a été écrit spécifiquement pour cette mission : la menuiserie
(dormant + meneau + deux vantaux + actionneur), le moteur de décision de la
fenêtre, la coordination des deux, et l'interface.

---

## 3. Fichiers

### Créés

```
lib/
  fenetre-simulation.ts        décision de la fenêtre — fonction pure
  fenetre-simulation.test.ts   44 tests
  fenetre-presets.ts           6 situations types
  ombrair-automation.ts        coordination fenêtre + volet — fonction pure
  ombrair-automation.test.ts   34 tests
  volet-tablier.test.ts        10 tests de géométrie du tablier

components/3d/
  fenetre-scene.tsx            la scène (menuiserie, ouvrant motorisé, volet optionnel)
  fenetre-controls.tsx         curseurs, situations, switch volet, mode, commandes manuelles
  fenetre-status.tsx           état Ombrair — la restitution textuelle

components/3d/shared/          extrait de la démo Volet, voir §2
  geometrie.ts   architecture.tsx   camera-baie.tsx   eclairage.tsx
  volet-assembly.tsx   curseur.tsx   situations.tsx   use-reduced-motion.ts

components/site/
  fenetre-3d-demo.tsx          assemblage, état, repli, chargement différé

audit/3d/fenetre/              9 captures de recette
docs/3d/fenetre-demo-report.md ce fichier
```

### Modifiés

```
app/(site)/gammes/fenetre/page.tsx   intégration via `apresHero`
components/3d/volet-scene.tsx        vidé de ce qui est désormais partagé
components/3d/volet-controls.tsx     idem ; curseurs sur une rangée
components/site/volet-3d-demo.tsx    même composition que la démo Fenêtre
docs/3d/volet-demo-report.md         addendum : corrections apportées à la démo Volet
```

**Aucun fichier de tarification, d'offre ou de contenu commercial n'a été
touché.** Les prix affichés sur la page continuent de venir de
`lib/tarifs.ts` et `lib/offres.ts` ; la démonstration n'écrit aucun montant.

---

## 4. La fenêtre en 3D

### Approche : procédurale, comme le volet

Pas de `.glb`. Le raisonnement est le même que pour le volet, et il est
renforcé ici : l'ouvrant est piloté en continu par un angle qui vient de
l'état React, et le bras d'actionneur doit suivre ce même angle image par
image. Un modèle exporté aurait demandé un rig et des pistes d'animation
échantillonnées, pour une géométrie qui tient en une douzaine de boîtes.

La règle du projet reste : `.glb` pour les objets figés (le capteur),
procédural pour ce qui bouge (volet, fenêtre).

### Hypothèse mécanique — et pourquoi c'en est une

Le catalogue Ombrair **ne définit nulle part** le type d'ouverture de la
fenêtre. `lib/tarifs.ts` parle d'une « fenêtre double vitrage à contrôle
solaire » et d'un « actionneur motorisé », sans préciser la menuiserie.

La scène retient donc, pour pouvoir montrer un mouvement :

> **Deux vantaux, celui de droite motorisé, ouvrant à la française vers
> l'intérieur, sur un angle de démonstration de 60°.**

Ce choix suit l'illustration produit existante (`window-visual.tsx`, deux
battants dont l'un s'entrouvre) et la seule contrainte réellement imposée par
le projet : **le volet est extérieur, donc la fenêtre ne peut pas ouvrir
dehors.** L'hypothèse est écrite sous la scène, dans l'interface, et non
reléguée ici : le visiteur doit savoir qu'il regarde une hypothèse.

### Le sens d'ouverture est un choix de LISIBILITÉ, pas de décoration

Le vantail motorisé était d'abord celui de gauche. Mesuré sur le rendu, cela
ne marchait pas : la caméra trois-quarts par défaut regarde la baie **depuis
la droite**, et un ouvrant gondé à gauche s'écarte vers le fond **en
s'éloignant de la caméra**. À cet azimut, sa largeur projetée à l'écran est
quasiment la même à 0° et à 53° — la fenêtre grande ouverte rendait la même
image que fermée.

Gondé du côté de la caméra, le même mouvement divise sa largeur apparente par
trois et découvre le vide de la baie. C'est la correction la plus importante
de cette mission : sans elle, la démonstration centrale de la page ne se
voyait pas.

### Cotes

| Pièce | Valeur |
| --- | --- |
| Baie | 120 × 150 cm |
| Dormant | 60 mm |
| Meneau | 36 mm |
| Profilés d'ouvrant | 32 mm, 36 mm d'épaisseur |
| Jeu de feuillure | 4 mm |
| Plan de l'ouvrant | 3,5 cm derrière le dormant |
| Angle maximal | 60° |

Les sections ont été revues **à la baisse** après le premier rendu : cumulés,
les 50 mm d'origine mangeaient un tiers de la largeur de la baie et la
fenêtre se lisait comme une grosse menuiserie peinte. Une menuiserie
contemporaine se reconnaît d'abord à la finesse de ses profils.

### Empilement en profondeur

```
+Z  EXTÉRIEUR
    ciel                        z = +6      (derrière la caméra extérieure)
    face extérieure du mur      z = +0,11
    VOLET : coffre, rails, tablier          z = +0,06
    dormant                     z = −0,02
    OUVRANT et vitrage          z = −0,055
    face intérieure du mur      z = −0,11
    fond de pièce               z = −6      (derrière la caméra intérieure)
−Z  INTÉRIEUR
```

Cet ordre est ce qui rend la scène combinée possible **sans truquage** : un
volet roulant est dehors, une fenêtre à la française s'ouvre dedans, donc les
deux mécanismes travaillent de part et d'autre du dormant et ne peuvent pas se
traverser, quel que soit l'état de chacun.

---

## 5. Logique de simulation

### Pourquoi deux températures

Un volet répond à ce qui **arrive sur la façade**. Une fenêtre répond à un
**échange** : ouvrir ne sert que si l'air qu'on fait entrer vaut mieux que
celui qu'on chasse.

```
29 °C dedans / 19 °C dehors  → ouvrir rafraîchit
25 °C dedans / 36 °C dehors  → ouvrir réchauffe
```

Un système qui ne regarderait que le dehors donnerait la même consigne aux
deux. C'est exactement l'erreur qu'Ombrair prétend ne pas commettre, donc la
démo doit la rendre visible.

### Chaîne de calcul (`lib/fenetre-simulation.ts`)

```
T. intérieure ──→ besoinRafraichissement   = clamp((Tint − 22) / 8)
T. int. − ext. ──→ potentielRafraichissement = clamp(ΔT / 8)
                   ouvertureThermique = besoin × potentiel        ← un PRODUIT
Humidité      ──→ besoinAeration = clamp((H − 60) / 25)
T. ext. − int. ──→ penaliteThermique = clamp(−ΔT / 6)
                   ouvertureAeration = aeration × 0,45 × (1 − pénalité)

ouverture = max(ouvertureThermique, ouvertureAeration)
            puis 0 si < 12 %   (zone morte de l'actionneur)
```

Trois principes, dans cet ordre :

1. **Ouvrir demande un besoin ET un moyen.** Le terme thermique est un
   produit, pas une somme : une pièce à 30 °C avec 38 °C dehors n'ouvre pas,
   et une pièce à 21 °C avec 5 °C dehors non plus.
2. **L'humidité aère, elle ne rafraîchit pas.** Elle plafonne à 45 %
   d'ouverture, et s'efface quand l'extérieur est plus chaud — on ne fait pas
   entrer 38 °C pour sécher une salle de bain.
3. **La luminosité n'ouvre jamais rien.** Elle n'apparaît pas dans ce calcul.
   Du soleil sur une façade n'est pas une raison d'ouvrir une fenêtre ; c'est
   une raison de baisser un volet.

### Zone morte de l'actionneur

En dessous de 12 %, l'ouvrant ne bouge pas du tout. Un vantail écarté de sept
degrés ne renouvelle rien, et aucun automatisme sérieux ne ferait travailler
un moteur pour cela. Sans ce seuil, l'interface affichait « Fenêtre 9 % ·
Entrebâillée » sous une stratégie dont la phrase disait que la fenêtre restait
fermée : le chiffre et le texte se contredisaient à l'écran.

### Coordination (`lib/ombrair-automation.ts`)

Les deux logiques existent séparément et restent inchangées. Les appeler côte
à côte donnerait pourtant un résultat **faux** sur le scénario le plus
important du produit :

> 27 °C dedans, 21 °C dehors, 95 % de soleil. La fenêtre s'entrouvre à 47 %.
> Le volet, lui, ne voit qu'une façade à 21 °C : il ne descendrait son tablier
> que de 14 %. On ouvrirait grand une baie en plein soleil sans rien ombrager.

Ce n'est pas un défaut de la logique du volet — sur sa propre page, fenêtre
fermée, elle est juste. C'est un effet de bord de l'ouverture :

- **fenêtre fermée** → le vitrage à contrôle solaire filtre, le volet complète ;
- **fenêtre ouverte** → il n'y a plus de vitrage dans le passage, et le volet
  devient le **seul** organe de protection solaire.

D'où deux règles, et deux seulement :

| Règle | Effet | Garde-fou |
| --- | --- | --- |
| Le volet reprend la protection que la fenêtre abandonne | la levée peut **descendre**, jamais remonter | plafond à 75 % de tablier descendu — au-delà on masquerait la fenêtre qu'on vient d'ouvrir |
| Les lames gardent un passage proportionnel à l'ouverture | l'angle peut **monter**, jamais descendre | 38° à ouverture maximale : passage franc, rayonnement direct toujours coupé |

**La fenêtre n'est jamais corrigée par le volet.** Elle décide de l'air ;
l'ombre est le problème du volet. Inverser cette hiérarchie ferait fermer une
fenêtre à cause du soleil.

### Stratégies annoncées

`Conditions neutres` · `Aération` · `Confort naturel` ·
`Rafraîchissement naturel` · `Ombre et ventilation` · `Protection solaire` ·
`Protection thermique` · `Protection thermique renforcée`

La stratégie décrit **ce que le visiteur voit**, pas ce que le moteur a
calculé : elle dépend donc de l'affichage du volet. Annoncer « protection
renforcée » alors qu'aucun volet n'est à l'écran ferait référence à un organe
absent.

### Situations types

Comportement mesuré, volet affiché (`computeCombinedState`, valeurs arrondies
comme à l'écran) :

| Situation | Int. | Ext. | Lum. | Hum. | Fenêtre | Volet | Lames | Stratégie |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Matin frais | 23 | 17 | 35 | 55 | fermée | 100 % relevé | 67° | Conditions neutres |
| Après-midi d'été | 25 | 34 | 95 | 45 | fermée | 0 % relevé | 16° | Protection thermique renforcée |
| Canicule | 29 | 39 | 100 | 40 | fermée | 0 % relevé | 6° | Protection thermique renforcée |
| Rafraîchissement nocturne | 29 | 19 | 5 | 50 | **88 %** | 97 % relevé | 73° | Rafraîchissement naturel |
| Air intérieur humide | 24 | 20 | 30 | 82 | **40 %** | 91 % relevé | 64° | Aération |
| **Soleil + air frais** | 27 | 21 | 95 | 50 | **47 %** | 67 % relevé | 43° | **Ombre et ventilation** |

« Après-midi d'été » et « Canicule » aboutissent tous deux à une occultation :
à 34 °C dehors et 95 % de soleil, la protection est déjà maximale. Les deux
situations sont exigées par le cahier des charges et se distinguent par
l'inclinaison des lames (16° contre 6°) ; leur enseignement commun est celui
qui compte — **ouvrir quand il fait plus chaud dehors serait contre-productif**.

La dernière est la situation affichée à l'arrivée : la fenêtre y est
franchement entrouverte, donc la démonstration est déjà complète volet masqué,
et activer l'interrupteur révèle immédiatement l'autre moitié du raisonnement
au lieu de ne rien changer.

---

## 6. Interface

### Composition

```
┌──────────────────────────────────────────────┬──────────────────┐
│  SCÈNE 3D                                     │  ÉTAT OMBRAIR    │
│  (hauteur fixe 32–34 rem sur grand écran)     │  stratégie       │
│                                               │  Fenêtre  47 %   │
│                                               │  Volet    67 %   │
│  [côté] [angle] [Réinitialiser la vue]        │  Lames    43°    │
│  hypothèse de démonstration                   │  ─────────────   │
│                                               │  [switch volet]  │
│                                               │  ─────────────   │
│                                               │  Pilotage        │
├───────────────────────────────────────────────┴──────────────────┤
│  SITUATIONS   [Matin frais] [Après-midi] [Canicule] …            │
│  CONDITIONS   T. int. │ T. ext. │ Luminosité │ Humidité           │
└──────────────────────────────────────────────────────────────────┘
```

Deux registres : **ce qu'on voit et ce que le système en dit** en haut, **ce
qu'on règle** en dessous, sur toute la largeur.

La première version empilait tout dans une colonne de 22 rem à côté d'un cadre
en ratio 4/3. Résultat mesuré à 1920 px : **520 px de zone morte** sous la
scène, et le panneau d'état repoussé sous la ligne de flottaison. La rangée de
curseurs est ce qui remplit les grands écrans.

La hauteur de la scène est **fixe** sur grand écran plutôt qu'asservie à la
colonne voisine : le panneau d'état grandit de trois lignes quand le volet
entre dans la simulation, et la scène se serait redimensionnée sous le curseur
au moment précis où le visiteur regarde ce qui change.

Sur téléphone, le cadre est **carré**. Un 4/3 sur 390 px donnait une bande de
256 px de haut : la fenêtre y tenait, mais l'inclinaison des lames n'était plus
lisible.

### Le libellé du switch est une décision

**« Afficher le volet dans la simulation »**, et non « Ajouter le volet ».
Le second se lirait comme une option de configurateur et laisserait croire
qu'un volet peut être commandé avec la fenêtre. Ce n'est pas le cas : le volet
est un produit distinct, à son propre tarif, sur sa propre page. La ligne
d'aide sous l'interrupteur le redit en clair, à l'endroit exact où le doute
pourrait naître.

### Auto / Manuel

AUTO est le mode par défaut et le sujet de la page : Ombrair vend un
arbitrage, pas une télécommande. MANUEL existe pour vérifier l'amplitude réelle
de la mécanique — jusqu'où va l'ouvrant, jusqu'où descend le tablier — ce que
les conditions ne montrent jamais toutes à la fois.

AUTO → MANUEL amorce les commandes sur l'état courant (vérifié : 47 / 67 / 43),
donc aucun saut. MANUEL → AUTO ne demande rien : la scène interpole vers la
décision retrouvée. En manuel, le panneau n'annonce **aucune stratégie** — il
n'y en a pas, et en afficher une contredirait la scène.

### Accessibilité

- Curseurs `<input type="range">` **natifs** : clavier, tactile et technologies
  d'assistance sans code supplémentaire. `touch-action: manipulation` pour que
  le glissement ne soit pas confondu avec un défilement de page.
- Interrupteur = vraie `<input type="checkbox">`, visuellement remplacée mais
  pas réimplémentée.
- Panneau d'état en `aria-live="polite"` : c'est la seule restitution textuelle
  de la scène, et chaque grandeur affichée est celle qui pilote réellement le
  rendu.
- La scène vient **en premier dans le DOM** : au clavier on atteint les
  réglages sans traverser un canvas.
- Repli : test WebGL **avant** de charger `three`. Sans WebGL, l'illustration
  produit `WindowVisual` s'affiche, la légende le dit, et le panneau d'état
  continue d'énoncer la décision en toutes lettres.
- `prefers-reduced-motion` **raccourcit** les interpolations (≈ 31 ms au lieu
  de ≈ 190 ms) au lieu de les supprimer : le changement d'état reste visible.

---

## 7. Corrections apportées après examen du rendu

Aucune n'a été trouvée en lisant le code. Toutes viennent d'une capture
regardée puis critiquée.

| Défaut observé | Cause | Correction |
| --- | --- | --- |
| **Le tablier disparaissait dès qu'il n'était pas complètement descendu** — à 73 % relevé la baie paraissait vide alors que le panneau annonçait un quart de tablier sorti | décalage vertical parasite qui poussait tout le tablier au-dessus du linteau | géométrie du déroulé sortie dans une fonction pure `poserLame`, corrigée et **couverte par 10 tests** ; défaut **antérieur à cette mission**, il touchait aussi `/gammes/volet` |
| **Fenêtre grande ouverte impossible à distinguer de fermée** depuis la rue | ouvrant gondé du côté opposé à la caméra : largeur projetée invariante | vantail motorisé passé à droite, du côté de la caméra |
| Même défaut, seconde cause : **le vitrage ne se voyait pas** | opacité 0,24 : un panneau fermé et un vide rendaient la même image | opacité **dépendante du côté** — 0,72 depuis la rue (le verre renvoie le ciel), 0,18 depuis la pièce (on regarde vers la lumière). C'est ce que fait un vitrage réel ; un moteur avec carte d'environnement le produirait par le Fresnel |
| **520 px de zone morte** sous la scène à 1920 px | colonne de contrôles plus haute que le cadre à ratio fixe | composition en deux registres, curseurs sur une rangée, hauteur de scène fixe |
| **Ligne pointillée clignotante** en travers de la baie | coffre et rails coplanaires avec le tableau du percement | 2 mm de jeu sous linteau |
| **Le coffre ne se lisait pas** : un aplat clair de la même valeur que l'enduit | caisson affleurant la façade, sans arête | bandeau de sous-face en saillie, caisson élargi d'un rail à l'autre |
| **Dalle beige flottant dans le vide** à la butée d'orbite | sol de la pièce plus large que la façade | façade élargie à 4,8 × 4,5 m, sol borné à la largeur du mur |
| **La nuit ne se voyait pas** : à 5 % de luminosité, la façade restait en plein jour | seul le soleil suivait la luminosité, trois appoints restaient constants | tout ce qui vient du dehors suit la luminosité ; l'appoint **intérieur** reste constant — c'est le contraste façade sombre / pièce éclairée qui fait lire la nuit |
| **L'orbite se défaisait toute seule** en quelques secondes après un glissement | la caméra rejoignait sa pose à chaque image | le recadrage est devenu un **événement** (changement de côté, d'angle, bouton reset) et non un rappel permanent ; un geste de l'utilisateur l'annule |
| `PCFSoftShadowMap has been deprecated` à chaque montage | `shadows` seul demande un filtrage retiré en three 0.183 | `shadows="percentage"` — même rendu, console propre |

---

## 8. Recette

### Vérifications automatiques

| Contrôle | Résultat |
| --- | --- |
| `npm run lint` | 0 erreur, 0 avertissement |
| `npx tsc --noEmit` | 0 erreur |
| `npm test` | **219 tests, 219 réussis** (149 avant la mission) |
| `npm run build` | succès — `/gammes/fenetre` : **127 kB** First Load JS, `/gammes/volet` : 124 kB |

`three` et `fiber` ne sont téléchargés que si le visiteur atteint la section :
la scène est importée via `next/dynamic` avec `ssr: false`, indispensable
puisqu'elle crée un contexte WebGL et touche `window` au montage.

### Scénarios vérifiés dans le navigateur

| Scénario | Attendu | Observé | Capture |
| --- | --- | --- | --- |
| Fenêtre seule, Soleil + air frais | entrouverte, aucun volet, aucun rail | 47 % · Confort naturel | `01` |
| Fenêtre + volet, Soleil + air frais | ombre **et** air simultanément | 47 % ouverte, tablier 67 % relevé, lames 43° · Ombre et ventilation | `02` |
| Canicule + volet | fenêtre fermée, volet occultant | Fermée, 0 % relevé, 6° · Protection thermique renforcée | `03` |
| Rafraîchissement nocturne + volet | fenêtre grande ouverte, volet relevé, ambiance de nuit | 88 %, 97 % relevé, 73° · Rafraîchissement naturel | `04` |
| Vue intérieure + volet | ouvrant vers la pièce, volet visible à travers le vitrage | conforme | `05` |
| 390 px et 768 px | pas de débordement, scène lisible | aucun débordement horizontal | `06` |
| Thème sombre | contrastes conservés | conforme | `07` |
| Manuel, amplitudes extrêmes | 100 % / 0 % / 90° sans conflit géométrique | conforme | `08` |
| `/gammes/volet` après factorisation | aucune régression | tablier 56 % relevé, lames 36° | `09` |

### Autres contrôles

| Contrôle | Résultat |
| --- | --- |
| Passage AUTO → MANUEL | commandes amorcées à 47 / 67 / 43 — aucun saut |
| Passage MANUEL → AUTO | retour à la décision automatique, curseurs de conditions restaurés |
| Bascule du volet | températures, luminosité, humidité et situation **conservées** |
| Volet masqué | plus aucune ligne de volet dans le panneau, ni rail ni coffre dans la scène |
| Orbite | tient l'angle choisi ; butées ±45° d'azimut respectées |
| Réinitialiser la vue | converge à (1,757 / 0,494 / 3,496) pour une pose (1,75 / 0,5 / 3,5) — mesuré, pas jugé à l'œil |
| Débordement horizontal (390 / 768 / 1440 / 1920) | aucun |
| Prix affichés | 1 499,99 € · +499,99 € — inchangés, issus de `lib/tarifs.ts` |
| Console navigateur | voir ci-dessous |

### Console

Deux messages subsistent, aucun n'appartient au projet :

- `THREE.Clock: This module has been deprecated` — émis par
  `@react-three/fiber` sur three 0.183. Corriger demanderait de remonter
  `fiber`, donc `three`, ce que la page Capteur interdit (voir §9).
- Un avertissement d'hydratation dont **toutes** les différences sont des
  attributs injectés par une extension du navigateur (`bis_skin_checked`,
  `bis_register`, `__processed_*`). Aucun composant du projet n'en est la
  cause : les valeurs initiales sont constantes des deux côtés du rendu, et
  `useReducedMotion` démarre à `false` côté serveur comme côté client.

---

## 9. Dépendances

**Aucune dépendance ajoutée.** La démo Fenêtre utilise exactement la pile
installée pour la démo Volet :

| Paquet | Version |
| --- | --- |
| `three` | `0.183.0` (épinglé) |
| `@react-three/fiber` | `^9.7.0` |
| `@react-three/drei` | `^10.7.8` (`OrbitControls` uniquement) |

**`three` reste épinglé à `0.183.0`, sans plage.** `@google/model-viewer`
(visionneuse du capteur) exige `three@^0.183`, tandis que `drei` tire `0.185`
par défaut : les deux visionneuses se retrouveraient alors avec deux copies
incompatibles du moteur. Ne pas remonter cette version sans retester la page
Capteur.

---

## 10. Performance

| Décision | Raison |
| --- | --- |
| Aucun modèle à télécharger | géométrie décrite en code, poids réseau nul |
| Une géométrie et un matériau partagés pour les 22 lames | 22 uploads GPU et 22 compilations de shader évités ; chaque lame garde sa position et sa rotation, l'instancing n'apporterait rien de plus |
| `dpr={[1, 1.75]}` | plafonne le coût sur écrans à haute densité |
| `shadows="percentage"` | filtrage explicite, une seule carte d'ombre 1024² |
| Trois lumières d'appoint, aucune ombre supplémentaire | le volume d'ombre couvre le sol de la pièce, là où tombe la lumière filtrée par les lames |
| Aucun postprocessing | rien ne le justifiait |
| Import dynamique, `ssr: false` | `three` n'est chargé que si la section est atteinte |
| Vecteurs de travail réutilisés dans `useFrame` | le calcul du bras d'actionneur ne produit aucun déchet par image |

Objets de la scène combinée : environ 45 mailles, dont 22 lames partageant une
géométrie. Aucune texture.

---

## 11. Limites connues

- **La simulation n'est calibrée sur rien.** Les seuils illustrent un
  raisonnement ; ils ne modélisent aucun logement. La mention est affichée dans
  l'interface, à l'endroit même où les chiffres apparaissent.
- **Le type d'ouverture est une hypothèse**, pas une caractéristique produit.
  Voir §4.
- **La façade est un aplat.** L'enduit est uniformément éclairé : la scène
  donne l'échelle et la profondeur du tableau, pas la matière d'un mur. Une
  carte de rugosité ou une occlusion ambiante y gagneraient, au prix d'un
  budget que cette démonstration ne justifie pas.
- **Le volet occulte la fenêtre en Canicule.** C'est le comportement attendu,
  mais on ne voit alors plus la menuiserie. Le panneau d'état reste la seule
  façon de savoir que la fenêtre est fermée derrière.
- **Une seule dimension de baie**, 120 × 150 cm en dur. La page Dimensions
  traite les formats ; la démo ne cherche pas à les couvrir.
- **Pas de visualisation du flux d'air.** Envisagée (§91 du cahier des
  charges, priorité P3), écartée : les particules auraient ajouté du coût pour
  une information que la phrase de justification donne déjà mieux.
- **L'éclairement intérieur n'est pas simulé.** Fermer le volet n'assombrit pas
  la pièce : seule la géométrie bouge. Faire varier l'éclairement supposerait
  un modèle photométrique, donc des chiffres qu'on ne peut pas produire
  honnêtement pour un projet fictif.
- **Le passage d'un côté du mur à l'autre est une coupe**, pas un mouvement :
  un travelling traverserait le mur et le produit.
- **Émulation de viewport indisponible** pendant la recette : le navigateur
  refusait de redimensionner sa fenêtre. Les largeurs 390 et 768 ont été
  vérifiées dans des `<iframe>` aux dimensions exactes, ce qui reproduit
  fidèlement les media queries mais pas les particularités tactiles d'un vrai
  téléphone.

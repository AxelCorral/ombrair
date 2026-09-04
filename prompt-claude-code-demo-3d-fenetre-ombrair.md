Tu dois maintenant réaliser une nouvelle mission 3D interactive complète sur le projet Ombrair.

# MISSION

Créer une **démonstration interactive 3D réaliste de la Fenêtre Ombrair**, intégrée à la page produit Fenêtre, permettant à l’utilisateur de modifier les conditions environnementales et d’observer la fenêtre motorisée s’ouvrir ou se fermer automatiquement.

La démo doit également proposer une option :

**« Afficher le volet dans la simulation »**

Lorsque cette option est activée, le **Volet Ombrair doit apparaître dans LA MÊME scène 3D**, autour de la fenêtre, et fonctionner comme dans la démo 3D du volet déjà réalisée :

- montée / descente ;
- orientation des lames ;
- réaction automatique aux conditions ;
- interactions fluides ;
- cohérence avec les réglages utilisateur.

La grande idée à transmettre est :

**Fenêtre = gestion de l’air**
+
**Volet = gestion de l’ombre**
=
**OMBRAIR**

Le visiteur doit pouvoir constater que les deux équipements peuvent fonctionner ensemble intelligemment.

IMPORTANT :

- la Fenêtre reste le produit principal de cette page ;
- le volet est une option de démonstration de l’écosystème ;
- ne crée aucune nouvelle offre commerciale Fenêtre + Volet ;
- ne modifie aucun tarif pendant cette mission ;
- réutilise le travail 3D déjà réalisé pour le Volet autant que possible ;
- ne reconstruis surtout pas un deuxième volet indépendant si la géométrie / animation / logique existante peuvent être factorisées ;
- le projet Ombrair reste un projet étudiant fictif ;
- la simulation est illustrative et non un moteur thermique certifié.

==================================================
0. LIVRABLES ATTENDUS
==================================================

À la fin de la mission, je veux :

1. une Fenêtre Ombrair crédible et réaliste en 3D ;
2. une fenêtre motorisée pouvant s’ouvrir et se fermer progressivement ;
3. une interface permettant de modifier :
   - température intérieure ;
   - température extérieure ;
   - luminosité extérieure ;
   - humidité intérieure ;
4. un moteur automatique Ombrair déterminant l’ouverture de la fenêtre ;
5. des animations fluides entre les états ;
6. des presets environnementaux ;
7. un affichage textuel de la décision Ombrair ;
8. un mode automatique ;
9. si raisonnable, un mode manuel ;
10. un switch « Afficher le volet dans la simulation » ;
11. le vrai Volet Ombrair 3D existant réutilisé dans cette scène ;
12. animation du volet :
    - hauteur ;
    - lames ;
13. coordination intelligente Fenêtre + Volet ;
14. interaction caméra 3D raisonnable ;
15. reset caméra ;
16. fallback statique ;
17. responsive mobile / desktop ;
18. accessibilité correcte ;
19. tests unitaires de la logique ;
20. QA visuelle ;
21. screenshots ;
22. documentation ;
23. lint/tests/build verts ;
24. commits cohérents ;
25. aucun faux résultat ou feature simulée uniquement en apparence.

==================================================
1. AUDITER L’EXISTANT AVANT TOUTE MODIFICATION
==================================================

Commence impérativement par inspecter l’état réel du dépôt.

Identifie précisément :

- `/gammes/fenetre`
- `/gammes/volet`
- la démo 3D du Volet existante ;
- la 3D du Capteur si utile comme référence ;
- les composants React Three Fiber / Three.js existants ;
- les modèles Blender / GLB existants ;
- la logique de simulation du volet ;
- les contrôles environnementaux existants ;
- les presets ;
- le système Auto / Manuel ;
- les conventions utilisées dans `components/3d/`, `components/site/`, `lib/`, `public/models/`, `docs/3d/`, `audit/3d/`.

Recherche notamment :

- `volet`
- `shutter`
- `fenetre`
- `window`
- `three`
- `fiber`
- `drei`
- `Canvas`
- `useFrame`
- `GLTF`
- `model-viewer`
- `simulation`
- `temperature`
- `humidity`
- `luminosity`

Lis aussi si présents :

- `CLAUDE.md`
- `.claude/skills/...`
- `docs/3d/...`
- rapports 3D précédents ;
- audit visuel ;
- charte Ombrair.

Ta première question technique doit être :

**Quelles parties de la démo Volet peuvent être réutilisées directement dans la démo Fenêtre ?**

Ne code rien avant d’avoir répondu à cette question.

==================================================
2. NE PAS CASSER LA DÉMO VOLET EXISTANTE
==================================================

Le travail actuel sur le volet doit être considéré comme fonctionnel et précieux.

Si tu dois refactoriser certains éléments pour les rendre réutilisables, fais-le avec prudence.

Exemple d’architecture possible :

AVANT :

`Volet3DDemo`
→ logique
→ géométrie
→ animation
→ contrôles

APRÈS :

`ShutterAssembly`
`ShutterGeometry`
`ShutterAnimation`
`ShutterSimulation`
`EnvironmentControls`

Puis :

`Volet3DDemo`
et
`Fenetre3DDemo`

réutilisent les mêmes briques.

Mais ne force pas exactement ces noms.

Le critère est :

- éviter la duplication ;
- conserver la page Volet fonctionnelle ;
- permettre une vraie scène Fenêtre + Volet.

Après toute factorisation, `/gammes/volet` devra être retestée.

==================================================
3. PRODUIT PRINCIPAL : FENÊTRE OMBRAIR
==================================================

La scène doit représenter une vraie fenêtre intégrée dans une ouverture architecturale.

Minimum visuel :

- mur / embrasure ;
- dormant ;
- ouvrant ;
- vitrage ;
- profils ;
- joints ou détails subtils si utiles ;
- poignée si cohérente ;
- mécanisme motorisé suggéré discrètement ;
- profondeur réelle de la baie.

La scène doit évoquer :

**menuiserie contemporaine + habitat + produit industriel**

et non :

**démo WebGL abstraite**.

==================================================
4. TYPE D’OUVERTURE DE LA FENÊTRE
==================================================

Avant d’implémenter le mouvement :

cherche dans le projet si le type d’ouverture a déjà été défini.

Si le produit est explicitement :

- battant ;
- oscillo-battant ;
- coulissant ;
- autre ;

respecte cette spécification.

Si aucune mécanique n’est documentée :

utilise comme hypothèse de démonstration :

**fenêtre motorisée à battant ouvrant vers l’intérieur**.

Documente clairement cette hypothèse.

Ne présente pas ce choix comme une caractéristique industrielle définitive si le projet ne la définit pas.

==================================================
5. MODÉLISATION 3D DE LA FENÊTRE
==================================================

Choisis la meilleure approche en fonction de la stack existante.

Deux solutions acceptables :

### Solution A — modèle procédural / semi-procédural Three.js / React Three Fiber

Très adaptée si :

- géométrie assez simple ;
- ouverture dynamique importante ;
- besoin d’un contrôle direct des pièces.

### Solution B — Blender / GLB

Très adaptée si :

- besoin de davantage de réalisme ;
- modèle déjà créé ;
- géométrie architecturale plus détaillée.

Si Blender est utilisé :

sépare obligatoirement :

- dormant ;
- ouvrant ;
- vitrage ;
- poignée éventuelle ;

avec les pivots corrects.

Ne crée pas un GLB monolithique impossible à animer proprement.

Le critère de décision est :

**réalisme + robustesse de l’animation + performance web**.

Pas :

« tout doit obligatoirement venir de Blender ».

==================================================
6. MOUVEMENT DE LA FENÊTRE
==================================================

La fenêtre doit posséder un état :

`opening`

normalisé :

0
→ complètement fermée

1
→ ouverture maximale de démonstration.

Si ouverture battante :

mapper vers un angle réaliste.

Exemple :

0 %
→ 0°

25 %
→ environ 15°

50 %
→ environ 30°

75 %
→ environ 45°

100 %
→ environ 60°

Tu peux ajuster l’angle maximum si le rendu est meilleur.

Le mouvement doit :

- utiliser le bon pivot ;
- sembler mécanique ;
- être fluide ;
- ne pas traverser le mur ;
- ne pas déplacer le cadre.

==================================================
7. VARIABLES DE LA SIMULATION
==================================================

La démo Fenêtre doit exposer :

### TEMPÉRATURE INTÉRIEURE

Range recommandé :

15 → 35 °C

### TEMPÉRATURE EXTÉRIEURE

Range recommandé :

5 → 45 °C

### LUMINOSITÉ EXTÉRIEURE

0 → 100 %

### HUMIDITÉ INTÉRIEURE

20 → 100 %

Pourquoi deux températures ?

Parce que l’ouverture intelligente de la fenêtre dépend fortement de la différence entre intérieur et extérieur.

Exemple :

29 °C dedans
19 °C dehors

→ ouvrir peut rafraîchir.

Alors que :

25 °C dedans
36 °C dehors

→ ouvrir serait thermiquement contre-productif.

==================================================
8. COMPOSANTS DE CONTRÔLE
==================================================

Créer une interface Ombrair propre.

Chaque variable doit avoir :

- label ;
- slider ;
- valeur numérique ;
- unité.

Exemples :

`Température intérieure     27 °C`

`Température extérieure     21 °C`

`Luminosité                 85 %`

`Humidité                   52 %`

Utiliser IBM Plex Mono pour les valeurs numériques si cohérent avec le design existant.

Les sliders doivent :

- être accessibles clavier ;
- fonctionner au tactile ;
- être correctement labellisés ;
- garder une taille confortable.

==================================================
9. MOTEUR DE SIMULATION FENÊTRE
==================================================

La logique métier ne doit PAS être mélangée directement au rendu Three.js.

Créer un module pur dédié.

Exemple :

`lib/window-simulation.ts`

ou nomenclature française cohérente avec le projet.

Entrée conceptuelle :

```ts
type WindowEnvironment = {
  indoorTemperature: number
  outdoorTemperature: number
  luminosity: number
  humidity: number
}
```

Sortie :

```ts
type WindowState = {
  opening: number
  strategy: string
  reason: string
}
```

`opening` doit être compris entre 0 et 1.

==================================================
10. BESOIN DE RAFRAÎCHISSEMENT
==================================================

Créer une fonction normalisée.

Exemple conceptuel :

```ts
coolingNeed =
  clamp((indoorTemperature - 22) / 8, 0, 1)
```

Interprétation :

22 °C
→ besoin faible.

30 °C+
→ besoin élevé.

Cette formule est illustrative.

Documente qu’il s’agit d’une logique de démonstration.

==================================================
11. ÉCART THERMIQUE
==================================================

Calculer :

```ts
thermalDelta =
  indoorTemperature - outdoorTemperature
```

Si positif :

l’extérieur est plus frais.

Si négatif :

l’extérieur est plus chaud.

==================================================
12. POTENTIEL DE RAFRAÎCHISSEMENT NATUREL
==================================================

Créer une valeur du type :

```ts
freeCoolingPotential =
  clamp(thermalDelta / 8, 0, 1)
```

Puis :

```ts
thermalOpening =
  coolingNeed * freeCoolingPotential
```

Cela signifie :

chaud dedans
+
beaucoup plus frais dehors

→ ouverture importante.

==================================================
13. HUMIDITÉ
==================================================

L’humidité peut déclencher un besoin supplémentaire d’aération.

Exemple :

```ts
humidityNeed =
  clamp((humidity - 60) / 25, 0, 1)
```

Mais ne laisse pas l’humidité dominer absurdement la logique thermique.

Elle doit moduler l’ouverture.

Par exemple conceptuellement :

```ts
opening =
  max(
    thermalOpening,
    humidityNeed * 0.45
  )
```

Tu peux améliorer la formule si nécessaire.

Mais elle doit rester :

- déterministe ;
- simple ;
- testable ;
- documentée.

==================================================
14. LUMINOSITÉ ET FENÊTRE
==================================================

La luminosité ne doit PAS être la variable principale déterminant l’ouverture de la fenêtre.

Elle est principalement utile pour :

- représentation visuelle de la scène ;
- logique du volet lorsqu’il est affiché.

Exemple interdit :

fort soleil
→ fenêtre s’ouvre automatiquement uniquement parce qu’il y a du soleil.

La logique doit rester thermiquement cohérente.

==================================================
15. STRATÉGIES OMBRAIR
==================================================

Créer quelques stratégies simples.

Exemples :

- Conditions neutres
- Aération
- Rafraîchissement naturel
- Protection thermique
- Protection solaire
- Protection renforcée
- Confort naturel

Pas besoin de multiplier les états.

==================================================
16. RAISON DE LA DÉCISION
==================================================

Afficher une justification courte.

Exemple :

`L’air extérieur est 7 °C plus frais.`

ou :

`L’extérieur est plus chaud : la fenêtre reste fermée.`

ou :

`Humidité élevée : aération partielle.`

L’utilisateur doit comprendre pourquoi le produit agit.

==================================================
17. PRESETS OBLIGATOIRES
==================================================

Créer plusieurs presets.

### MATIN FRAIS

Intérieur : 23 °C
Extérieur : 17 °C
Luminosité : 35 %
Humidité : 55 %

### APRÈS-MIDI D’ÉTÉ

Intérieur : 25 °C
Extérieur : 34 °C
Luminosité : 95 %
Humidité : 45 %

### CANICULE

Intérieur : 29 °C
Extérieur : 39 °C
Luminosité : 100 %
Humidité : 40 %

### RAFRAÎCHISSEMENT NOCTURNE

Intérieur : 29 °C
Extérieur : 19 °C
Luminosité : 5 %
Humidité : 50 %

### AIR INTÉRIEUR HUMIDE

Intérieur : 24 °C
Extérieur : 20 °C
Luminosité : 30 %
Humidité : 82 %

### SOLEIL + AIR FRAIS

Intérieur : 27 °C
Extérieur : 21 °C
Luminosité : 95 %
Humidité : 50 %

Ce dernier preset est extrêmement important.

==================================================
18. POURQUOI « SOLEIL + AIR FRAIS » EST IMPORTANT
==================================================

C’est le scénario emblématique d’Ombrair.

Situation :

27 °C intérieur
21 °C extérieur
95 % luminosité.

Objectif :

Fenêtre :
→ ouverture partielle pour profiter de l’air plus frais.

Volet :
→ descend suffisamment pour créer de l’ombre.

Lames :
→ s’orientent pour limiter le rayonnement tout en conservant une circulation d’air.

C’est exactement la promesse :

**ombre + air**.

La démo doit particulièrement réussir ce scénario.

==================================================
19. OPTION « AFFICHER LE VOLET DANS LA SIMULATION »
==================================================

Créer un switch accessible.

Libellé recommandé :

**Afficher le volet dans la simulation**

ou :

**Ajouter le volet à la simulation**

Ne pas écrire simplement :

`Ajouter le volet`

car cela pourrait être confondu avec une option commerciale.

Par défaut :

je recommande OFF.

Ainsi la Fenêtre reste immédiatement identifiable comme produit principal.

==================================================
20. UNE SEULE SCÈNE 3D
==================================================

Lorsque le volet est activé :

NE crée PAS un deuxième viewer.

NE crée PAS une seconde scène.

Je veux UNE baie.

Organisation physique :

```text
EXTÉRIEUR

Volet Ombrair
↓
vitrage
↓
Fenêtre Ombrair
↓
INTÉRIEUR
```

Le volet doit être positionné côté extérieur.

La fenêtre reste derrière.

==================================================
21. RÉUTILISER LE VOLET EXISTANT
==================================================

Réutilise l’implémentation déjà créée pour `/gammes/volet`.

Ne redessine pas un volet différent.

Conserver autant que possible :

- géométrie ;
- matériaux ;
- proportions ;
- rails ;
- coffre ;
- lames ;
- mouvement vertical ;
- rotation des lames ;
- conventions visuelles.

Si le volet actuel n’est pas facilement réutilisable :

refactorise-le proprement.

Mais la page Volet doit rester fonctionnelle.

==================================================
22. ÉTAT DU VOLET
==================================================

La logique doit permettre au minimum :

```ts
type ShutterState = {
  lift: number
  slatAngle: number
}
```

avec :

`lift`

0 → complètement descendu
1 → complètement relevé

ou convention existante équivalente.

Et :

`slatAngle`

représentant l’orientation des lames.

Respecte les conventions déjà utilisées dans la démo Volet si elles existent.

==================================================
23. LOGIQUE COMBINÉE FENÊTRE + VOLET
==================================================

Lorsque le volet est affiché :

Fenêtre et Volet ne doivent pas agir comme deux systèmes totalement indépendants.

Créer une coordination.

Architecture conceptuelle possible :

```text
EnvironmentState
      ↓
OmbrairAutomationEngine
      ↓
WindowState
+
ShutterState
```

ou une abstraction plus légère.

==================================================
24. CAS COMBINÉ — CANICULE
==================================================

Exemple :

Intérieur :
29 °C

Extérieur :
39 °C

Luminosité :
100 %

Humidité :
40 %

Attendu :

Fenêtre :
→ fermée ou presque.

Volet :
→ protection importante.

Lames :
→ fortement inclinées / presque fermées.

Stratégie :

`Protection thermique renforcée`.

==================================================
25. CAS COMBINÉ — NUIT FRAÎCHE
==================================================

Exemple :

Intérieur :
29 °C

Extérieur :
19 °C

Luminosité :
5 %

Attendu :

Fenêtre :
→ largement ouverte.

Volet :
→ fortement relevé.

Lames :
→ ouvertes si encore visibles.

Stratégie :

`Rafraîchissement naturel`.

==================================================
26. CAS COMBINÉ — SOLEIL + AIR FRAIS
==================================================

Intérieur :
27 °C

Extérieur :
21 °C

Luminosité :
95 %

Attendu :

Fenêtre :
→ partiellement ouverte.

Volet :
→ protection solaire significative.

Lames :
→ inclinées intelligemment.

La scène doit montrer simultanément :

- air extérieur exploité ;
- rayonnement solaire limité.

==================================================
27. ÉVITER LES ÉTATS ABSURDES
==================================================

Ne génère pas par exemple :

Fenêtre 100 % ouverte
+
Volet complètement fermé
+
Lames complètement fermées
+
texte « ventilation maximale ».

Si la fenêtre cherche à ventiler :

le volet doit laisser physiquement un passage cohérent.

La coordination visuelle est importante.

==================================================
28. MOTEUR COMBINÉ
==================================================

Si nécessaire, créer une fonction pure :

```ts
computeCombinedOpeningState(environment)
```

retournant conceptuellement :

```ts
{
  window: {
    opening: number
  },
  shutter: {
    lift: number
    slatAngle: number
  },
  strategy: string,
  reason: string
}
```

Mais ne sur-engineer pas.

Si la logique peut proprement réutiliser :

`computeWindowState()`

et :

`computeShutterState()`

avec une petite fonction de coordination, préfère cette solution.

==================================================
29. MODE AUTOMATIQUE
==================================================

Le mode principal doit être :

**AUTO**

Les paramètres environnementaux commandent alors :

- ouverture fenêtre ;
- hauteur volet ;
- angle des lames.

==================================================
30. MODE MANUEL — OPTIONNEL MAIS SOUHAITÉ
==================================================

Si cela peut être fait proprement :

ajouter :

**MANUEL**

Dans ce mode :

### Fenêtre

slider :
`Ouverture`

Si volet affiché :

### Volet

slider :
`Ouverture`

### Lames

slider :
`Orientation`

Lorsque MANUEL est actif :

les conditions environnementales peuvent rester visibles mais ne contrôlent plus les mécanismes.

Priorité moindre que le mode Auto.

==================================================
31. ANIMATION
==================================================

Toutes les transitions doivent être fluides.

Quand un slider change :

- ne saute pas instantanément ;
- interpole progressivement ;
- comportement mécanique.

Fenêtre :

rotation amortie.

Volet :

montée / descente amortie.

Lames :

rotation amortie.

Pas de bounce.

Pas de spring cartoon.

Le mouvement doit évoquer une motorisation silencieuse.

==================================================
32. REACT THREE FIBER / THREE.JS
==================================================

Si la démo Volet utilise déjà :

- `three`
- `@react-three/fiber`
- `@react-three/drei`

réutilise la stack.

N’ajoute pas une seconde bibliothèque 3D sans raison.

Si ce n’est pas encore présent et que c’est nécessaire :

tu peux ajouter ces dépendances raisonnablement.

Documente toute nouvelle dépendance.

==================================================
33. SCÈNE ARCHITECTURALE
==================================================

Créer un décor minimal.

Je veux :

- mur ;
- embrasure ;
- fenêtre ;
- vitrage ;
- lumière extérieure.

Pas besoin :

- salon complet ;
- meubles ;
- plantes ;
- décor lifestyle lourd.

La scène sert à donner :

- échelle ;
- profondeur ;
- contexte.

==================================================
34. MATÉRIAUX
==================================================

Matériaux crédibles :

- aluminium / PVC mat selon design ;
- vitrage ;
- mur ;
- volet.

Éviter :

- chrome ;
- plastique brillant cheap ;
- verre bleu cliché ;
- transparence irréaliste.

La Fenêtre et le Volet doivent sembler appartenir à la même gamme.

==================================================
35. VITRAGE
==================================================

Le verre doit rester lisible.

Utiliser une transparence / réflexion contrôlée.

Évite les matériaux très coûteux en performance si une solution plus simple fonctionne.

Teste le vitrage :

- jour ;
- nuit ;
- avec volet ;
- sans volet.

==================================================
36. LUMINOSITÉ VISUELLE
==================================================

Le slider luminosité doit également modifier légèrement l’apparence de la scène.

Par exemple :

0–10 %
→ ambiance nocturne.

30–60 %
→ lumière modérée.

80–100 %
→ extérieur très lumineux.

Cette évolution doit être subtile.

Ne crée pas un moteur météo complet.

==================================================
37. SOLEIL
==================================================

Si la démo Volet possède déjà un soleil :

réutilise-le si pertinent.

Sinon :

n’en ajoute un que si cela améliore réellement la compréhension.

Pas de soleil cartoon surdimensionné.

==================================================
38. CAMÉRA
==================================================

L’utilisateur doit pouvoir examiner la scène.

Permettre idéalement :

- drag → orbit limité ;
- wheel / pinch → zoom limité ;
- reset.

Limiter les angles absurdes.

Pas besoin de voir :

- derrière le mur ;
- sous le sol ;
- intérieur des meshes.

==================================================
39. RESET CAMÉRA
==================================================

Créer :

**Réinitialiser la vue**

Cette action réinitialise uniquement :

- caméra ;
- zoom.

Pas les variables environnementales.

Créer séparément si utile :

**Réinitialiser la simulation**.

==================================================
40. ÉTAT TEXTE
==================================================

En permanence, afficher un résumé.

Sans volet :

```text
ÉTAT OMBRAIR

Fenêtre
72 % ouverte

Stratégie
Rafraîchissement naturel

L’air extérieur est 7 °C plus frais.
```

Avec volet :

```text
ÉTAT OMBRAIR

Fenêtre
42 % ouverte

Volet
65 % relevé

Lames
31°

Stratégie
Ombre + ventilation
```

Cela rend le fonctionnement compréhensible sans dépendre uniquement de la 3D.

==================================================
41. UI DESKTOP
==================================================

Composition recommandée :

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│ CONTRÔLES                    SCÈNE 3D                    │
│                                                          │
│ Temp. intérieure  27 °C      [ fenêtre ]                │
│ Temp. extérieure  21 °C      [ volet optionnel ]        │
│ Luminosité         95 %                                  │
│ Humidité           50 %                                  │
│                                                          │
│ [Presets]                                                │
│                                                          │
│ Afficher le volet  [switch]                              │
│                                                          │
│ État Ombrair                                             │
│ ...                                                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Ou inversion si cela correspond mieux à la page.

Pas de cardification excessive.

==================================================
42. UI MOBILE
==================================================

Sur mobile :

préférer quelque chose comme :

1. scène 3D ;
2. état Ombrair ;
3. presets ;
4. switch volet ;
5. sliders.

Mais adapte après tests.

La scène doit conserver une hauteur suffisante pour réellement voir :

- l’ouverture ;
- le volet ;
- les lames.

==================================================
43. TITRE DE SECTION
==================================================

Choisir une formulation sobre.

Exemples :

**Voyez Ombrair arbitrer entre air et chaleur.**

ou :

**Faites varier les conditions. La fenêtre s’adapte.**

ou :

**Une ouverture qui s’adapte aux conditions.**

Ne surcharge pas en slogans.

==================================================
44. INTRODUCTION
==================================================

Texte possible :

> Modifiez les conditions intérieures et extérieures pour observer comment Ombrair adapte l’ouverture de la fenêtre.

Puis :

> Ajoutez le volet à la simulation pour voir les deux équipements agir ensemble.

Adapter au ton réel du site.

==================================================
45. MESSAGE CENTRAL OMBRAIR
==================================================

Lorsque Fenêtre + Volet sont activés :

faire comprendre :

### Fenêtre
utilise les conditions extérieures pour favoriser l’aération lorsqu’elle est utile.

### Volet
limite les apports solaires.

### Ensemble
ils permettent d’arbitrer entre ombre et air.

Pas besoin d’expliquer l’algorithme complet au visiteur.

==================================================
46. ATTENTION COMMERCIALE
==================================================

Le volet visible dans la démo n’est PAS inclus avec la Fenêtre.

La mission ne doit créer aucune confusion.

Utiliser :

**Afficher le volet dans la simulation**

et non :

**Ajouter un volet à ma fenêtre**

si cela peut faire penser à un configurateur commercial.

==================================================
47. NE PAS CRÉER UNE NOUVELLE OFFRE
==================================================

Le modèle tarifaire actuel doit rester intact.

Ne crée pas :

- Pack Fenêtre + Volet ;
- tarif Fenêtre + Volet ;
- réduction Fenêtre + Volet.

La démo est fonctionnelle / pédagogique.

Elle n’est pas une nouvelle offre tarifaire.

==================================================
48. PRIX EXISTANTS À PRÉSERVER
==================================================

Ne modifie pas :

Fenêtre Ombrair :
1 499,99 €.

Installation Fenêtre :
+499,99 €.

Pack Capteur + Fenêtre :
1 549,99 €.

Ni aucun autre tarif central.

Tous les prix continuent à provenir de la source de vérité existante.

Aucun prix en dur dans cette démo.

==================================================
49. OMBRAIR PIONNIERS
==================================================

Ne modifie pas le programme Ombrair Pionniers pendant cette mission.

La 3D est indépendante du programme marketing.

==================================================
50. COMPOSANTS
==================================================

Créer une architecture propre.

Exemple indicatif :

```text
components/3d/window/
  window-scene.tsx
  window-assembly.tsx
  window-frame.tsx
  window-sash.tsx
  window-glass.tsx

components/3d/shared/
  environment-lighting.tsx

components/site/
  fenetre-3d-demo.tsx
```

Puis réutiliser le dossier Volet existant.

Adapte aux conventions du dépôt.

==================================================
51. LOGIQUE DE SIMULATION
==================================================

Créer éventuellement :

```text
lib/window-simulation.ts
lib/window-presets.ts
```

Si la logique de l’environnement est déjà centralisée, réutilise-la.

Évite :

- valeurs dispersées dans JSX ;
- constantes magiques répétées ;
- duplication des presets.

==================================================
52. CONTRÔLES PARTAGÉS
==================================================

Si la démo Volet possède déjà de bons sliders environnementaux :

envisage de les factoriser.

Exemple conceptuel :

`EnvironmentControls`

capable d’afficher :

- intérieur ;
- extérieur ;
- lumière ;
- humidité.

Mais ne transforme pas le projet entier pour cette abstraction.

Factorise uniquement si le gain est réel.

==================================================
53. TESTS UNITAIRES FENÊTRE
==================================================

Tester au minimum :

### CAS A

29 °C intérieur
19 °C extérieur

→ ouverture importante.

### CAS B

25 °C intérieur
36 °C extérieur

→ ouverture faible / zéro.

### CAS C

24 °C intérieur
20 °C extérieur
82 % humidité

→ ouverture partielle pour aération.

### CAS D

20 °C intérieur
17 °C extérieur
50 % humidité

→ ne pas ouvrir exagérément si aucun besoin réel.

==================================================
54. TESTS COMBINÉS
==================================================

### CANICULE

29 intérieur
39 extérieur
100 lumière

Attendu :

fenêtre fermée
+
volet fortement protecteur.

### NUIT FRAÎCHE

29 intérieur
19 extérieur
5 lumière

Attendu :

fenêtre largement ouverte
+
volet largement relevé.

### SOLEIL + AIR FRAIS

27 intérieur
21 extérieur
95 lumière

Attendu :

fenêtre partiellement ouverte
+
volet protecteur
+
lames permettant une certaine ventilation.

==================================================
55. TESTS DES BORNES
==================================================

Tester aussi :

- minimum sliders ;
- maximum sliders ;
- valeurs intermédiaires ;
- clamp ;
- absence de NaN ;
- output toujours entre les bornes prévues.

==================================================
56. PERFORMANCE 3D
==================================================

Surveiller :

- triangles ;
- nombre d’objets ;
- draw calls ;
- ombres ;
- textures ;
- DPR ;
- lumières.

La scène doit rester fluide.

Pas de postprocessing lourd sauf justification réelle.

==================================================
57. LAMES DU VOLET
==================================================

Si beaucoup de lames sont utilisées :

réutilise l’optimisation existante.

Si le volet actuel utilise :

- instancing ;
- géométrie partagée ;
- optimisation spécifique ;

conserve-la.

Ne dégrade pas la performance en copiant 30–50 composants lourds.

==================================================
58. CHARGEMENT
==================================================

Si la scène est située sous le hero :

tu peux envisager :

- lazy loading ;
- import dynamique ;
- Suspense.

Mais :

- pas de layout shift important ;
- fallback visuel ;
- pas d’écran vide long.

==================================================
59. FALLBACK
==================================================

Si WebGL échoue :

afficher une image statique de la Fenêtre Ombrair.

Idéalement :

un rendu provenant de la vraie scène 3D.

Si volet sélectionné et erreur WebGL :

le fallback n’a pas besoin de simuler toute l’interaction, mais doit rester propre.

==================================================
60. PREFERS-REDUCED-MOTION
==================================================

Respecter `prefers-reduced-motion`.

Dans ce mode :

- limiter les animations décoratives ;
- raccourcir les interpolations ;
- conserver néanmoins les changements d’état fonctionnels.

==================================================
61. ACCESSIBILITÉ
==================================================

Tous les sliders doivent avoir :

- label ;
- rôle natif si possible ;
- valeur ;
- clavier ;
- focus visible.

Le switch :

**Afficher le volet dans la simulation**

doit être accessible.

Auto / Manuel aussi.

La 3D ne doit jamais être le seul canal d’information.

==================================================
62. DESIGN SYSTEM
==================================================

Respecter strictement la charte :

- Outfit ;
- Instrument Sans ;
- IBM Plex Mono ;
- Chaux ;
- Persienne ;
- Nuit.

Fraîche / Ambre seulement si elles ont une vraie fonction thermique.

Pas de :

- gradients SaaS ;
- glow ;
- glassmorphism ;
- grosse card ;
- pill badges inutiles ;
- interface de dashboard générique.

==================================================
63. MATÉRIALITÉ
==================================================

Le principal gain visuel attendu est de rendre le produit tangible.

Soigner :

- profils de fenêtre ;
- joints ;
- vitrage ;
- profondeur de l’embrasure ;
- rails du volet ;
- lames ;
- rencontre entre fenêtre, volet et façade.

La scène doit ressembler à un vrai détail architectural.

==================================================
64. INTÉGRATION À `/gammes/fenetre`
==================================================

La nouvelle démo doit constituer un moment important de la page.

Ne refais pas toute la page.

Structure possible :

```text
Hero produit
↓
bénéfice principal
↓
DÉMO 3D INTERACTIVE
↓
ce qui est fourni
↓
installation
↓
dimensions / compatibilité
↓
suggestions produits
↓
CTA
```

Adapte après inspection de la page réelle.

==================================================
65. COHÉRENCE AVEC `/gammes/volet`
==================================================

Les deux démos doivent clairement appartenir au même univers.

Page Volet :

- produit central = protection solaire ;
- variables → mouvement volet.

Page Fenêtre :

- produit central = aération ;
- variables int./ext. → ouverture fenêtre ;
- option volet → démonstration combinée.

Même :

- style ;
- matériaux ;
- caméra ;
- contrôles ;
- presets ;
- typographie ;
- niveau de polish.

==================================================
66. RESPONSIVE
==================================================

Tester :

360
390
768
1024
1280
1440
1920.

À 1440 / 1920 :

pas de vastes zones mortes.

À 360 / 390 :

- sliders tactiles ;
- scène lisible ;
- pas d’overflow ;
- pas de canvas minuscule ;
- pas de texte microscopique.

==================================================
67. QA SCÉNARIO CANICULE
==================================================

Sélectionner :

CANICULE.

Tester :

- fenêtre seule ;
- fenêtre + volet.

Vérifier :

Fenêtre :
fermée.

Volet :
protection élevée.

Lumière :
forte.

Texte :
cohérent.

Créer screenshot.

==================================================
68. QA SCÉNARIO RAFRAÎCHISSEMENT NOCTURNE
==================================================

Sélectionner :

RAFRAÎCHISSEMENT NOCTURNE.

Attendu :

Fenêtre :
largement ouverte.

Volet :
relevé lorsqu’activé.

Ambiance :
faible luminosité.

Texte :
Rafraîchissement naturel.

Créer screenshot.

==================================================
69. QA SCÉNARIO SOLEIL + AIR FRAIS
==================================================

Sélectionner :

SOLEIL + AIR FRAIS.

C’est le test visuel prioritaire.

Vérifier :

- fenêtre réellement entrouverte ;
- volet suffisamment descendu pour être visible ;
- lames orientées ;
- circulation d’air visuellement crédible ;
- aucun conflit géométrique ;
- message de complémentarité.

Créer screenshot.

==================================================
70. QA FENÊTRE SEULE
==================================================

Désactiver :

`Afficher le volet dans la simulation`.

Vérifier :

- disparition complète du volet ;
- pas de rail flottant ;
- pas d’état volet dans les textes ;
- pas d’espace vide ;
- fenêtre reste bien centrée visuellement.

==================================================
71. QA ANIMATION
==================================================

Faire varier rapidement les sliders.

Vérifier :

- pas de jitter ;
- pas d’oscillation ;
- pas de téléportation ;
- pas d’interpolation qui continue indéfiniment ;
- pas de NaN.

==================================================
72. QA CAMÉRA
==================================================

Tester :

- drag ;
- zoom ;
- pinch ;
- reset.

Empêcher :

- caméra derrière le mur ;
- zoom à travers le vitrage ;
- éloignement extrême.

==================================================
73. QA MODE MANUEL
==================================================

Si implémenté :

tester :

Fenêtre :
0 → 100 %.

Volet :
0 → 100 %.

Lames :
min → max.

Passer :

AUTO → MANUEL → AUTO.

Vérifier que les états se resynchronisent correctement.

==================================================
74. QA PAGE VOLET APRÈS REFACTOR
==================================================

Obligatoire si le code du volet a été factorisé.

Retester `/gammes/volet` :

- 3D ;
- sliders ;
- presets ;
- auto ;
- manuel si présent ;
- lames ;
- responsive.

Aucune régression acceptée.

==================================================
75. SCREENSHOTS
==================================================

Créer un dossier cohérent, par exemple :

`audit/3d/fenetre/`

Captures minimales :

1. fenêtre seule desktop ;
2. fenêtre + volet desktop ;
3. canicule ;
4. rafraîchissement nocturne ;
5. soleil + air frais ;
6. mobile ;
7. dark mode si pertinent.

==================================================
76. DOCUMENTATION
==================================================

Créer :

`docs/3d/fenetre-demo-spec.md`

et/ou :

`docs/3d/fenetre-demo-report.md`

Inclure :

- références ;
- type de fenêtre ;
- hypothèse mécanique ;
- architecture 3D ;
- logique de simulation ;
- formule de décision ;
- intégration du volet ;
- composants réutilisés ;
- performance ;
- tests ;
- limites.

==================================================
77. NE PAS PRÉSENTER LES FORMULES COMME SCIENTIFIQUES
==================================================

Les formules sont destinées à la démonstration interactive.

Ajouter dans la documentation :

**Simulation illustrative du comportement Ombrair, non destinée au dimensionnement thermique ou à la régulation réelle d’un bâtiment.**

Éventuellement une mention discrète dans l’UI.

==================================================
78. LINT / TESTS / BUILD
==================================================

Avant finalisation :

1. lint ;
2. tests ;
3. build ;
4. navigation réelle navigateur.

Respecte les règles Windows du projet :

- ne jamais faire tourner `npm run dev` et `npm run build` simultanément sur le même `.next` ;
- arrêter le serveur dev avant build si nécessaire ;
- relancer ensuite pour QA.

==================================================
79. CORRIGER AVANT DE TERMINER
==================================================

Ne considère pas :

`build vert`

comme preuve que la mission est terminée.

Tu dois réellement regarder la page.

Si la scène :

- paraît cheap ;
- est trop petite ;
- est mal cadrée ;
- est illisible ;
- possède un volet flottant ;
- a des matériaux incohérents ;
- a des sliders trop petits ;
- présente beaucoup d’espace vide ;

corrige avant validation.

Workflow obligatoire :

IMPLEMENT
→
RENDER
→
SCREENSHOT
→
CRITIQUE
→
CORRECT
→
RENDER AGAIN

==================================================
80. CRITIQUE VISUELLE OBLIGATOIRE
==================================================

Avant de considérer la mission terminée, effectue explicitement une critique visuelle.

Évalue au minimum :

### Produit
- la fenêtre ressemble-t-elle réellement à un produit de menuiserie ?
- le volet ressemble-t-il exactement à celui déjà présenté sur `/gammes/volet` ?
- les matériaux sont-ils crédibles ?

### Mouvement
- comprend-on immédiatement l’ouverture de la fenêtre ?
- la montée du volet est-elle lisible ?
- l’orientation des lames est-elle visible ?
- les mouvements semblent-ils mécaniques et plausibles ?

### Composition
- la scène est-elle assez grande ?
- les contrôles et le produit semblent-ils appartenir à une même composition ?
- y a-t-il trop d’espace vide ?
- les grands écrans sont-ils correctement exploités ?

### UI
- les valeurs environnementales sont-elles immédiatement compréhensibles ?
- les presets sont-ils utiles ?
- le switch Volet est-il sans ambiguïté ?
- l’état Ombrair est-il lisible ?

### Marque
- la scène ressemble-t-elle à Ombrair ?
- ou à une démo Three.js générique ?

Corriger tous les défauts importants observés.

==================================================
81. LE VOLET DOIT APPARAÎTRE PHYSIQUEMENT CORRECTEMENT
==================================================

Quand l’option Volet est active, inspecter particulièrement les relations spatiales entre :

- mur ;
- coffre ;
- rails ;
- tablier ;
- vitrage ;
- ouvrant ;
- sens d’ouverture de la fenêtre.

Il ne doit pas y avoir :

- rails flottants ;
- lames dans le vitrage ;
- volet placé côté intérieur par erreur ;
- ouvrant traversant le volet ;
- coffre sans liaison avec les rails.

Si l’ouverture battante risque physiquement d’entrer en conflit avec certains éléments, corriger la disposition de la scène plutôt que masquer le défaut.

==================================================
82. ANGLE DE CAMÉRA PAR DÉFAUT
==================================================

Choisir une caméra par défaut permettant de lire simultanément :

- le cadre ;
- l’épaisseur de la fenêtre ;
- l’ouvrant ;
- le vitrage ;
- le volet lorsqu’il est présent.

Une légère vue 3/4 est recommandée.

Éviter une vue trop frontale si elle empêche de comprendre que la fenêtre s’ouvre réellement.

==================================================
83. LE PRODUIT DOIT RESTER VISIBLE PENDANT LES MOUVEMENTS
==================================================

Dans tous les presets :

- le volet ne doit pas masquer tellement la fenêtre qu’on ne comprend plus la démonstration ;
- l’ouvrant ne doit pas sortir du cadre de caméra ;
- les lames doivent rester lisibles.

Ajuster la caméra ou les amplitudes si nécessaire.

==================================================
84. PRESET « SOLEIL + AIR FRAIS » COMME SCÉNARIO HÉROS
==================================================

Considère le preset :

**SOLEIL + AIR FRAIS**

comme le scénario de démonstration le plus important.

Si une configuration initiale doit être choisie pour la section, tu peux utiliser ce preset, ou une variante proche, car il montre simultanément :

- la fonction Fenêtre ;
- la fonction Volet ;
- la logique Ombrair.

Cependant, si le Volet est OFF par défaut, la Fenêtre doit rester suffisamment démonstrative seule.

==================================================
85. OPTION DE DÉMO COMBINÉE
==================================================

Lorsque le visiteur active le volet, une petite transition visuelle peut signaler :

**Mode écosystème Ombrair**

ou formulation équivalente.

Mais ne transforme pas cela en nouvel onglet commercial.

Le changement doit rester léger.

==================================================
86. CONSERVATION DES RÉGLAGES LORS DU SWITCH VOLET
==================================================

Quand l’utilisateur active ou désactive le volet :

- conserver les températures ;
- conserver humidité ;
- conserver luminosité ;
- conserver le preset sélectionné si possible ;
- ne pas réinitialiser inutilement la simulation.

Seule la présence du volet et sa logique doivent changer.

==================================================
87. PASSAGE AUTO / MANUEL
==================================================

Si le mode manuel est implémenté :

AUTO → MANUEL :
- initialiser les contrôles manuels avec l’état courant pour éviter un saut.

MANUEL → AUTO :
- reprendre doucement vers l’état déterminé par l’environnement.

Pas de téléportation brutale.

==================================================
88. COHÉRENCE DES UNITÉS ET DU TEXTE
==================================================

Utiliser partout :

- `°C`
- `%`
- `°`

avec format français cohérent.

Éviter les décimales inutiles.

Exemples :

`27 °C`
`95 %`
`31°`

Pas :

`27.000 C`.

==================================================
89. PAS DE FAUSSE PRÉCISION
==================================================

Même si les fonctions produisent des nombres continus, l’interface peut afficher des valeurs arrondies.

Exemple :

`Fenêtre 43 % ouverte`

plutôt que :

`43,2871 %`.

La simulation reste illustrative.

==================================================
90. OPTION « POURQUOI ? »
==================================================

Si cela améliore l’UX, permettre d’expliquer brièvement la décision.

Exemple :

`Pourquoi ?`

→

`L’air extérieur est plus frais et la luminosité est élevée : Ombrair entrouvre la fenêtre tout en utilisant le volet pour limiter le rayonnement.`

Mais garder cette explication courte.

Pas de modal complexe.

==================================================
91. INDICATION DU FLUX D’AIR — OPTIONNELLE
==================================================

Si tout le reste fonctionne parfaitement, tu peux ajouter une visualisation extrêmement discrète de circulation d’air lorsque la fenêtre est ouverte.

Exemple :

- quelques particules très légères ;
- lignes de flux sobres ;
- uniquement quand pertinent.

Mais :

- pas de fumée ;
- pas d’effet fantasy ;
- pas de simulation CFD ;
- ne pas sacrifier les performances.

Cette feature est P3.

==================================================
92. OMBRE / ENSOLEILLEMENT — OPTIONNEL
==================================================

Si la lumière et les ombres sont suffisamment performantes :

faire comprendre visuellement que le volet réduit l’ensoleillement lorsque ses lames se ferment.

Cela peut être obtenu par :

- ombres ;
- variation lumineuse derrière le volet ;
- changement subtil de lumière intérieure.

Ne pas utiliser un overlay artificiel si la 3D peut le montrer naturellement.

==================================================
93. STABILITÉ DU RENDU
==================================================

Vérifier qu’il n’existe pas :

- z-fighting ;
- scintillement des surfaces ;
- transparence du vitrage instable ;
- artefacts d’ombres ;
- clipping caméra ;
- lames qui se superposent.

Corriger avant finalisation.

==================================================
94. PERF MOBILE
==================================================

Tester réellement sur viewport mobile.

Si nécessaire :

- limiter le DPR ;
- réduire les ombres ;
- simplifier certains matériaux ;
- réduire certains effets.

Mais conserver :

- fenêtre ;
- volet ;
- lames ;
- animation.

Ne remplace pas la 3D entière sur mobile simplement pour éviter l’optimisation, sauf contrainte technique réelle documentée.

==================================================
95. GESTION DU CANVAS
==================================================

Le Canvas ne doit pas :

- capturer le scroll vertical de manière frustrante sur mobile ;
- empêcher le swipe de page ;
- provoquer un overflow horizontal.

Configurer les contrôles intelligemment.

L’utilisateur doit pouvoir manipuler la scène sans bloquer la navigation normale.

==================================================
96. HYDRATION / NEXT.JS
==================================================

Puisque le projet utilise Next.js :

faire attention à :

- composants client ;
- imports dynamiques ;
- WebGL côté serveur ;
- hydration mismatch ;
- accès `window` ;
- `document`.

La page doit fonctionner sans erreur SSR.

==================================================
97. ERREURS CONSOLE
==================================================

Pendant la QA navigateur :

ouvrir / inspecter la console si possible.

Aucune erreur importante de type :

- Three.js ;
- WebGL ;
- hydration ;
- missing asset ;
- failed GLB ;
- React key ;
- NaN transform.

Ne pas ignorer silencieusement les erreurs de console.

==================================================
98. ASSETS
==================================================

Tout nouvel asset doit être clairement nommé.

Exemple :

`public/models/fenetre-ombrair.glb`

si GLB.

Rendus :

`audit/3d/fenetre/...`

Pas de :

`final2.glb`
`test.png`
`new-model-final-final.glb`

==================================================
99. BLENDER SI UTILISÉ
==================================================

Si Blender est nécessaire :

réutilise l’environnement Blender / Blender MCP déjà configuré pour le Capteur.

Ne refais pas le bootstrap complet s’il fonctionne déjà.

Créer si pertinent :

- `.blend` source ;
- rendus ;
- GLB optimisé.

Conserver la source Blender pour modification future.

==================================================
100. BOUCLE BLENDER SI UTILISÉ
==================================================

Si Blender est utilisé pour la Fenêtre :

obligatoire :

MODEL
→
RENDER FERMÉ
→
RENDER OUVERT
→
RENDER AVEC VOLET
→
CRITIQUE
→
CORRECTION
→
EXPORT GLB

Ne considère pas le premier modèle Blender comme définitif sans contrôle visuel.

==================================================
101. RÉUTILISABILITÉ FUTURE
==================================================

La scène Fenêtre doit être conçue de façon à pouvoir éventuellement être réutilisée plus tard :

- homepage ;
- présentation ;
- page « Comment ça marche ».

Mais ne l’intègre pas partout pendant cette mission.

La priorité reste `/gammes/fenetre`.

==================================================
102. NE PAS REFAIRE LA HOMEPAGE
==================================================

Ne modifie pas la homepage sauf dépendance partagée absolument nécessaire.

Cette mission n’est pas une nouvelle refonte globale.

==================================================
103. NE PAS TOUCHER AU MODÈLE COMMERCIAL
==================================================

Rappel absolu :

pas de modification :

- produits ;
- packs ;
- prix ;
- installation ;
- Pionniers ;
- Ombrair+ ;
- Pro.

La mission porte uniquement sur :

**visualisation + interaction + simulation Fenêtre/Volet.**

==================================================
104. TEST DE COMPRÉHENSION UTILISATEUR
==================================================

À la fin, regarde la section comme un visiteur découvrant Ombrair.

En moins de 10 secondes, doit-on comprendre :

1. que la fenêtre est motorisée ?
2. qu’elle peut s’ouvrir automatiquement ?
3. qu’elle utilise température intérieure et extérieure ?
4. qu’on peut afficher le volet ?
5. que le volet protège du soleil ?
6. que les deux peuvent travailler ensemble ?

Si non :

corriger l’UI ou les textes.

==================================================
105. TEST DU NOM OMBRAIR
==================================================

Le scénario combiné doit donner une incarnation évidente du nom :

OMBRE
+
AIR.

Il ne faut pas seulement deux produits qui bougent côte à côte.

Le comportement doit réellement montrer :

- l’air par l’ouverture ;
- l’ombre par le volet ;
- leur coordination.

==================================================
106. TEST DE CRÉDIBILITÉ
==================================================

Pose-toi avant validation :

> Si cette démonstration apparaissait sur le site d’une vraie startup hardware habitat, paraîtrait-elle crédible ?

Si la réponse est non à cause de :

- géométrie trop simple ;
- mouvements artificiels ;
- contrôles cheap ;
- matériaux génériques ;

corriger.

==================================================
107. PRIORITÉS
==================================================

Si la mission devient longue, prioriser dans cet ordre :

### P0
- audit du volet existant
- logique fenêtre
- vraie scène fenêtre
- ouverture animée
- sliders
- intégration page

### P1
- réutilisation du volet existant
- switch volet
- logique combinée
- scénario Soleil + air frais

### P2
- presets
- Auto / Manuel
- caméra
- état textuel avancé

### P3
- flux d’air
- effets lumineux avancés
- raffinements visuels secondaires

IMPORTANT :

Le volet combiné fait partie de la demande principale.

La mission n’est pas complète si le volet ne peut pas apparaître dans la même scène.

==================================================
108. GIT
==================================================

Créer des commits cohérents.

Exemples :

`feat(simulation): add automatic window control logic`

`feat(3d): add interactive Ombrair window scene`

`refactor(3d): reuse shutter assembly across product demos`

`feat(3d): add combined window and shutter simulation`

`docs(3d): document interactive window demo`

Ne pousse rien.

==================================================
109. ÉTAT GIT FINAL
==================================================

Avant le rapport final :

- vérifier `git status` ;
- lister les fichiers non commités éventuels ;
- ne pas laisser de fichiers temporaires inutiles ;
- ne pas supprimer des fichiers utilisateur sans justification.

==================================================
110. RAPPORT FINAL
==================================================

À la fin, fournir un rapport structuré :

## 1. Fenêtre 3D

- approche choisie ;
- résultat ;
- type d’ouverture ;
- matériaux ;
- mouvement.

## 2. Simulation

- variables ;
- logique ;
- stratégies ;
- presets.

## 3. Volet

- composants réutilisés ;
- éventuel refactor ;
- comportement.

## 4. Mode combiné

- coordination fenêtre / volet ;
- scénario Soleil + air frais ;
- gestion des conflits.

## 5. UI

- contrôles ;
- Auto / Manuel ;
- switch ;
- état.

## 6. Fichiers créés

liste.

## 7. Fichiers modifiés

liste.

## 8. Tests

résultats.

## 9. QA

- desktop ;
- mobile ;
- screenshots ;
- scénarios testés.

## 10. Performance

- décisions d’optimisation ;
- poids GLB si applicable ;
- limitations.

## 11. Build

- lint ;
- tests ;
- build.

## 12. Commits

hash + message si possible.

## 13. Limites restantes

uniquement les vraies limites.

==================================================
111. CRITÈRES DE RÉUSSITE FINAUX
==================================================

La mission est réussie uniquement si :

1. la Fenêtre Ombrair existe réellement en 3D ;
2. son ouverture est animée ;
3. l’utilisateur peut modifier les conditions ;
4. la fenêtre réagit aux conditions ;
5. la distinction intérieur / extérieur est utilisée ;
6. les presets fonctionnent ;
7. le visiteur comprend la stratégie ;
8. le Volet peut être affiché dans la même scène ;
9. ce volet réutilise le travail existant autant que possible ;
10. le volet monte / descend ;
11. ses lames pivotent ;
12. fenêtre et volet sont coordonnés ;
13. le preset Soleil + air frais montre réellement « ombre + air » ;
14. aucune nouvelle offre commerciale n’est inventée ;
15. les tarifs restent inchangés ;
16. la page Volet n’est pas cassée ;
17. la page Fenêtre reste responsive ;
18. la scène fonctionne sur mobile ;
19. un fallback existe ;
20. les contrôles sont accessibles ;
21. aucune erreur console importante ;
22. lint est vert ;
23. tests sont verts ;
24. build est vert ;
25. la QA visuelle a été réellement effectuée ;
26. les défauts importants observés ont été corrigés avant validation.

==================================================
112. ORDRE D’EXÉCUTION OBLIGATOIRE
==================================================

Suis cet ordre :

### PHASE 1 — AUDIT
- inspecter Volet 3D ;
- inspecter Fenêtre ;
- inspecter simulation ;
- déterminer les éléments réutilisables.

### PHASE 2 — ARCHITECTURE
- définir composants ;
- définir logique partagée ;
- définir modèle d’état.

### PHASE 3 — MOTEUR FENÊTRE
- implémenter fonctions pures ;
- presets ;
- tests.

### PHASE 4 — FENÊTRE 3D
- créer / importer géométrie ;
- matériaux ;
- pivot ;
- ouverture.

### PHASE 5 — INTÉGRATION UI
- sliders ;
- presets ;
- état ;
- Auto.

### PHASE 6 — VOLET
- factoriser l’existant si nécessaire ;
- importer dans la même scène ;
- switch d’affichage.

### PHASE 7 — COORDINATION
- fenêtre + volet ;
- éviter états absurdes ;
- scénario Soleil + air frais.

### PHASE 8 — POLISH
- lumière ;
- caméra ;
- manuel si pertinent ;
- fallback ;
- accessibilité.

### PHASE 9 — INTÉGRATION PAGE
- intégrer dans `/gammes/fenetre` ;
- vérifier cohérence avec ProductHero et sections environnantes ;
- conserver le modèle commercial intact.

### PHASE 10 — QA
- desktop ;
- mobile ;
- dark/light ;
- presets ;
- camera ;
- animation ;
- page Volet après éventuel refactor ;
- screenshots.

### PHASE 11 — VALIDATION
- lint ;
- tests ;
- build ;
- console navigateur ;
- critique visuelle ;
- corrections.

### PHASE 12 — GIT / DOCS
- documentation ;
- nettoyage ;
- commits ;
- rapport final.

==================================================
113. NE PAS S’ARRÊTER APRÈS UNE PHASE
==================================================

Ne t’arrête pas après :

- audit ;
- création du moteur ;
- modèle 3D ;
- compilation.

La mission est une mission de bout en bout.

Tu dois poursuivre jusqu’à :

AUDIT
→
LOGIQUE
→
3D
→
ANIMATION
→
VOLET
→
COORDINATION
→
UI
→
NAVIGATEUR
→
SCREENSHOTS
→
CRITIQUE
→
CORRECTIONS
→
TESTS
→
BUILD
→
RAPPORT.

==================================================
114. SI TU RENCONTRES UN BLOCAGE
==================================================

Si un blocage intervient :

1. analyse la cause ;
2. essaie une alternative raisonnable ;
3. ne fake rien ;
4. ne supprime pas la feature entière sans essayer ;
5. documente la vraie limite.

Si une intervention utilisateur strictement manuelle est indispensable :

ne la demande qu’après avoir préparé tout ce qui peut être automatisé.

==================================================
115. DÉMARRAGE
==================================================

Commence maintenant.

Ne me redonne pas un plan théorique.

Commence par inspecter l’implémentation réelle de la démo Volet, puis exécute la mission jusqu’au bout.

Le résultat final doit être une vraie démonstration 3D fonctionnelle de la Fenêtre Ombrair, avec possibilité de faire apparaître le Volet Ombrair dans la même scène et de voir les deux systèmes réagir ensemble aux conditions environnementales.

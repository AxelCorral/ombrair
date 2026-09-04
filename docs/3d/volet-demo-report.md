# Démonstration 3D — Volet Ombrair

Rapport de réalisation. Projet étudiant fictif, Master MIASHS, Université
Toulouse Jean Jaurès.

---

## 1. Ce qui a été livré

Une démonstration interactive sur `/gammes/volet`, juste sous le hero : trois
curseurs de conditions extérieures (température, luminosité, humidité), une
scène 3D temps réel qui réagit, et un panneau texte qui énonce la décision
prise et la justifie.

La baie se regarde **des deux côtés du mur** — côté rue et côté pièce.

Le visiteur ne pilote pas le volet. Il pilote la **météo** — le volet, lui,
décide. C'est le point de la page : Ombrair vend un arbitrage automatique, pas
une télécommande.

---

## 2. Choix technique

### Procédural (`@react-three/fiber`), pas un `.glb`

Le capteur extérieur, livré précédemment, est un `.glb` chargé dans
`<model-viewer>` : c'est un objet **figé**, et un fichier statique est la
solution la plus simple à maintenir.

Le volet est le cas inverse :

- deux degrés de liberté pilotés en continu par l'état React (hauteur du
  tablier, angle des lames) ;
- le nombre de lames visibles change avec la hauteur, puisque le tablier
  s'enroule dans le coffre.

Un `.glb` aurait demandé un rig, des animations exportées, et un pont entre
les valeurs de la simulation et des pistes d'animation — pour un objet dont la
géométrie tient en quelques boîtes. La construction procédurale se pilote
directement avec les nombres que produit la simulation.

Les deux approches cohabitent volontairement dans le projet : chacune est
utilisée là où elle est la plus simple.

### Chargement différé

`components/3d/volet-scene.tsx` est importé via `next/dynamic` avec
`ssr: false` — la scène crée un contexte WebGL et touche `window` au montage,
elle ne peut pas être rendue côté serveur.

Conséquence mesurée au build : `/gammes/volet` reste à **123 kB de First Load
JS**. `three` et `fiber` ne sont téléchargés que si le visiteur atteint
réellement la section.

---

## 3. Dépendances ajoutées

| Paquet | Version | Rôle |
| --- | --- | --- |
| `three` | `0.183.0` | moteur de rendu |
| `@react-three/fiber` | `^9.7.0` | three → React |
| `@react-three/drei` | `^10.7.8` | `OrbitControls` uniquement |
| `@types/three` | `^0.183.0` | types |

**`three` est épinglé à `0.183.0`, sans plage.** `@google/model-viewer`
(visionneuse du capteur) exige `three@^0.183`, tandis que `drei` tire `0.185`
par défaut : les deux visionneuses se retrouvaient alors avec deux copies
incompatibles du moteur. `0.183.0` satisfait les deux. Ne pas remonter cette
version sans vérifier la page capteur.

---

## 4. Structure des fichiers

```
lib/
  volet-simulation.ts        logique pure — aucune dépendance au rendu
  volet-simulation.test.ts   21 tests (node --test)
  volet-presets.ts           5 situations types
  demo/shutter.ts            (existant) modèle mécanique partagé

components/3d/
  volet-scene.tsx            la scène three (mur, dormant, coffre, tablier)
  volet-controls.tsx         curseurs + boutons de situations
  volet-status.tsx           décision, chiffres, mention de démonstration

components/site/
  volet-3d-demo.tsx          assemblage, état, repli, chargement différé

app/(site)/gammes/volet/page.tsx   intégration via `apresHero`
```

La séparation est franche : **la simulation ne sait pas qu'une scène 3D
existe.** Elle prend trois nombres, elle en rend cinq. C'est ce qui permet de
la tester sans navigateur, et de réutiliser la démo ailleurs.

---

## 5. Logique de simulation

Deux principes, tenus par les tests :

**1. Les lames agissent avant le tablier.** Un volet qui se ferme d'un bloc dès
qu'il fait chaud est un volet qu'on désactive. Le système ferme d'abord
l'orientation — la lumière baisse, la vue reste — et ne descend le tablier que
lorsque la contrainte persiste.

**2. La ventilation rouvre les lames, jamais le tablier.** L'humidité est un
besoin d'air, pas un besoin de lumière. Elle ne peut donc pas annuler une
protection solaire, seulement l'assouplir.

### Chaîne de calcul

```
température ──┐
              ├─→ pressionSolaire (0,6 × T + 0,4 × L) ─→ fermeture ─→ levée
luminosité  ──┘                                        └──────────→ inclinaison
humidité     ──→ besoinVentilation ────────────────────────────────→ inclinaison
```

| Normalisation | Seuil bas | Seuil haut | Lecture |
| --- | --- | --- | --- |
| Température | 18 °C | 38 °C | en dessous de 18 °C, aucune fermeture n'est justifiée |
| Luminosité | 0 % | 100 % | proportionnelle |
| Humidité | 45 % | 85 % | en dessous de 45 %, aucun besoin de ventiler |

La `pressionSolaire` passe par un `smoothstep(0,35 → 0,85)` : le tablier ne
commence à descendre qu'une fois les lames déjà bien refermées, et sature avant
le maximum de l'échelle. Le poids `0,6 / 0,4` traduit le fait qu'une façade
chaude et peu éclairée reste plus contraignante qu'une façade fraîche et
lumineuse.

### Cinq modes annoncés

`ouverture` · `filtrage` · `protection` · `protection-renforcee` ·
`ventilation`. Chacun porte un libellé et une explication en une phrase, tous
deux affichés dans le panneau `VoletStatus`.

### Honnêteté des chiffres

Les seuils sont **choisis pour illustrer un raisonnement**, pas mesurés sur un
logement. La mention est affichée sous le panneau de décision, à l'endroit même
où les chiffres apparaissent — pas reléguée en bas de page.

---

## 6. Paramètres exposés

### Entrées du visiteur

| Réglage | Plage | Pas |
| --- | --- | --- |
| Température | 0 → 45 °C | 1 |
| Luminosité | 0 → 100 % | 1 |
| Humidité | 20 → 100 % | 1 |

Cinq situations préréglées donnent un point d'entrée à qui ne veut pas
manipuler trois curseurs : Matin doux · Après-midi ensoleillé · Canicule ·
Chaleur humide · Soirée. Le bouton correspondant s'affiche pressé
(`aria-pressed`) quand les trois valeurs coïncident exactement.

### Props de `VoletScene`

`levee` · `inclinaison` · `luminosite` · `cote` (`exterieur` | `interieur`) ·
`vue` (`face` | `trois-quarts`) · `resetSignal`.

Le composant est **piloté** : il ne calcule rien, il affiche un état.

`cote` et `vue` sont deux axes séparés, et pas une liste de quatre poses :
sinon, passer d'un côté à l'autre ferait perdre au visiteur l'angle qu'il
venait de choisir.

---

## 7. Accessibilité

- Curseurs `<input type="range">` **natifs** — clavier, tactile et technologies
  d'assistance fonctionnent sans code supplémentaire. Le style passe par
  `accent-color` et un dégradé de piste, pas par une réimplémentation.
- Le panneau de décision est en `aria-live="polite"` : il est la seule
  restitution textuelle de ce que fait la scène. Sans lui, quelqu'un qui n'en
  voit pas le rendu manipulerait les curseurs sans jamais savoir ce qu'ils
  produisent.
- La scène vient **en premier dans le DOM**, les réglages ensuite : au clavier
  on atteint les curseurs sans traverser un canvas, et sur mobile on voit le
  volet avant de le régler. L'ordre visuel de bureau est rétabli avec `order`.
- Repli : test WebGL **avant** de charger `three`. Sans WebGL, l'illustration
  produit `ShutterVisual` est affichée et la légende le dit explicitement.

---

## 8. Réutilisation ailleurs (accueil, etc.)

`Volet3DDemo` est autonome : il ne reçoit aucune prop obligatoire et porte son
propre état. Le poser sur la page d'accueil tient en une ligne :

```tsx
import { Volet3DDemo } from "@/components/site/volet-3d-demo";

<Volet3DDemo />
```

C'est la raison pour laquelle les réglages **ne remontent pas** à la page
parente : remonter l'état aurait imposé à chaque hôte de le gérer.

Si un besoin de pilotage externe apparaissait, `VoletScene`, `VoletControls` et
`VoletStatus` sont déjà exportés séparément et se recomposent autour d'un état
tenu ailleurs.

---

## 9. Limites connues

- **Le paysage est un aplat.** Un plan de couleur ciel en retrait derrière
  l'ouverture. L'objet de la scène est le volet ; un décor plus riche
  détournerait l'attention et coûterait des kilo-octets.
- **Pas d'ombres portées projetées.** L'éclairage est directionnel avec un
  ambiant : suffisant pour lire les reliefs, pas assez pour projeter l'ombre
  des lames sur le tableau. Les ombres douces temps réel coûtaient plus
  qu'elles n'apportaient à cette échelle.
- **Rotation bridée, côté par côté.** L'azimut est limité à ±45° autour du
  côté courant, et l'élévation à une plage étroite : on ne dérive jamais dans
  la tranche du mur. On change de côté au bouton, pas à la souris.
- **Le passage d'un côté à l'autre est une coupe, pas un mouvement.** Un
  travelling entre les deux poses traverserait le mur et le volet.
- **La pièce n'a ni plafond ni mobilier.** Un sol, un fond, un doublage et une
  tablette : de quoi lire « je suis dedans », pas de quoi meubler un intérieur.
- **L'éclairement intérieur n'est pas simulé.** Fermer le volet n'assombrit pas
  la pièce dans la scène : la lumière y est constante, seule la géométrie
  bouge. Faire varier l'éclairement supposerait un modèle photométrique — donc
  des chiffres qu'on ne peut pas produire honnêtement pour un projet fictif.
- **Une seule dimension de baie.** 120 × 150 cm en dur dans la scène. La page
  Dimensions traite les formats ; la démo ne cherche pas à les couvrir.
- **La simulation n'est calibrée sur rien.** Voir §5.

---

## 10. Vérifications

| Contrôle | Résultat |
| --- | --- |
| `npm run lint` | 0 erreur, 0 avertissement |
| `npm test` | 149 tests, 149 réussis |
| `npm run build` | succès — `/gammes/volet` : 123 kB First Load JS |
| Débordement horizontal (360 / 390 / 768 / 1024 / 1280 / 1440) | aucun |
| Erreurs console sur la page | 0 |
| Thème sombre | vérifié |
| Réaction visible de la 3D entre deux états | vérifiée au pixel |
| Curseurs au clavier | fonctionnels |
| Vue intérieure et extérieure, 3 situations | 6 rendus contrôlés |
| Couleur d'enduit rendue vs charte | [229,228,224] pour [233,228,215] |
| Écrêtage des hautes lumières | 0 % |

### Comportement observé

| Situation | Ouverture | Tablier | Lames |
| --- | --- | --- | --- |
| Matin doux | 100 % | 100 % relevé | 67° — Ouvert |
| Après-midi ensoleillé | 73 % | 56 % relevé | 36° — Lumière tamisée |
| Canicule | 8 % | 0 % relevé | 7° — Occultant |

---

## 11. Passer des deux côtés du mur

Ajouté après coup, à la demande. Trois choses devaient être vraies pour que ce
soit autre chose qu'une caméra retournée.

**Il fallait une profondeur juste.** La première version n'avait qu'un côté
crédible : le volet était au nu du mur et le « ciel » se trouvait DERRIÈRE la
baie, c'est-à-dire du côté de la pièce. Toutes les cotes en Z sont désormais
posées en un seul endroit, dans le bon ordre : un volet roulant est **dehors**,
et depuis la pièce on le regarde **à travers le vitrage**. C'est précisément ce
qu'il y a à montrer — ce que le volet fait à la lumière qui entre.

**Il fallait quelque chose à voir des deux côtés, sans fond opaque.** Le
canevas doit rester transparent : la scène se pose dans le thème du site. La
solution tient en deux plans, chacun placé **derrière une caméra** — le ciel à
z = +6, au-delà de la pose extérieure, le fond de pièce à z = −6, au-delà de la
pose intérieure. Chacun est invisible depuis son propre côté et devient le
lointain vu par la baie depuis l'autre.

**Il fallait que la pièce soit une pièce.** Sol, fond, doublage intérieur plus
clair que la façade, tablette en pendant de l'appui, et le soleil déplacé en
+Z — il était côté pièce, ce qui ne se voyait pas tant qu'on ne regardait la
scène que de dehors.

### L'exposition du tone-mapping

En entrant dans la pièce, l'enduit intérieur — pourtant l'une des couleurs les
plus claires de la charte — rendait un gris franc. Premier réflexe : monter
l'appoint intérieur. Mauvais diagnostic. fiber applique **ACES à exposition 1**
par défaut, un réglage fait pour du rendu photoréaliste, qui comprime les tons
moyens : c'est toute la charte qui sortait délavée, façade comprise.

Exposition portée à `1.55`, ACES conservé pour l'écrêtage doux des hautes
lumières. Vérifié en mesurant les pixels du rendu, pas à l'œil : l'enduit sort
à [229,228,224] pour une cible charte de [233,228,215], et rien n'est écrêté.

---

## 12. Deux corrections de scène qui valent d'être notées

**Le mur était en quatre panneaux.** Les allèges étaient placées à
`(BAIE_H + murH) / 4 + BAIE_H / 4`, soit 37,5 cm trop haut : la façade
s'ouvrait en deux et la scène ressemblait à des dalles flottantes. Corrigé,
il restait une couture nette au niveau du linteau — deux faces coplanaires que
le moteur n'éclaire pas exactement pareil dessinent une ligne qui traverse
toute la façade. Le mur est désormais **une seule pièce percée**
(`THREE.ExtrudeGeometry` avec un trou) : plus aucun raccord à trahir, et le
tableau du percement vient avec l'extrusion.

**La façade doit déborder du cadrage.** À `maxDistance`, la caméra montre
environ 3,7 m de large. Une façade plus étroite laissait voir le ciel
par-dessus ses bords, et le mur se relisait comme une dalle posée devant un
fond. Elle mesure maintenant 4,0 × 4,1 m.

---

## 13. Addendum — ce que la mission Fenêtre a changé ici

La démonstration Fenêtre (`docs/3d/fenetre-demo-report.md`) avait besoin de
**la même baie et du même volet**. Plutôt que de recopier la scène, son
contenu a été extrait dans `components/3d/shared/` :

```
shared/geometrie.ts          cotes, profondeurs, palette, déroulé du tablier
shared/architecture.tsx      mur percé, embrasure, appui, tablette, sol, dormant, vitrage
shared/eclairage.tsx         lumière suivant la luminosité
shared/camera-baie.tsx       poses, limites d'orbite, réinitialisation
shared/volet-assembly.tsx    coffre, rails, tablier — LE volet
shared/curseur.tsx           le curseur des deux démonstrations
shared/situations.tsx        la rangée de situations types
shared/use-reduced-motion.ts la préférence d'animation
```

`volet-scene.tsx` ne décrit plus que l'assemblage propre à cette page : une
baie fermée par un vitrage fixe, avec le volet devant. **La logique de
simulation (`lib/volet-simulation.ts`) n'a pas été touchée**, et les cinq
situations sont inchangées.

### Trois corrections apportées au volet lui-même

Elles ont été trouvées en regardant les rendus de la nouvelle démonstration,
mais elles concernaient **déjà** cette page.

**1. Le tablier disparaissait dès qu'il n'était pas complètement descendu.**
C'est le défaut le plus grave. Un décalage vertical parasite —
`+ (BAIE_H − hauteurDeployee) / 2` — poussait tout le tablier au-dessus du
linteau, donc derrière le mur, à chaque position intermédiaire. Sur
« Après-midi ensoleillé », le panneau annonçait « Tablier 56 % relevé »
pendant que la baie n'en montrait que deux lames collées au coffre. Le tableau
du §10 (« comportement observé ») rapportait donc des nombres justes sous une
scène qui ne les montrait pas.

Le principe est simple et n'était pas tenu : **le tablier pend du coffre, il
ne monte pas.** Chaque lame garde sa place dans la baie ; seul le nombre de
lames sorties varie. La géométrie du déroulé est maintenant une fonction pure,
`poserLame`, couverte par dix tests dans `lib/volet-tablier.test.ts` — dont
celui qui aurait attrapé le défaut : *aucune lame ne dépasse le linteau, à
aucune hauteur de tablier*.

**2. Une ligne pointillée traversait la baie.** Le coffre et les rails
montaient exactement à `BAIE_H / 2`, donc leur face supérieure était
coplanaire avec le tableau du percement — deux surfaces que le moteur départage
au hasard. Deux millimètres de jeu suffisent, et ce jeu existe de toute façon
sur une pose réelle.

**3. Le coffre ne se lisait pas.** Affleurant la façade, il rendait un aplat
clair de la même valeur que l'enduit : rien ne disait d'où sortait le tablier.
Il va désormais d'un rail à l'autre et porte un bandeau de sous-face en
saillie, qui tire la ligne d'ombre qui manquait.

### Deux réglages partagés qui ont bougé

- **Le vitrage a deux opacités selon le côté** — 0,72 depuis la rue (le verre
  renvoie le ciel), 0,18 depuis la pièce (on regarde vers la lumière). Sur
  cette page l'effet est discret ; sur la page Fenêtre il est ce qui permet de
  distinguer un vantail fermé d'un vantail ouvert.
- **La luminosité pilote maintenant tous les éclairages extérieurs**, pas
  seulement le soleil. La situation « Soirée » (12 %) rend donc une façade
  franchement crépusculaire, là où elle restait en plein jour.

### Deux corrections d'interaction

- **La composition** suit celle de la démo Fenêtre : scène et décision côte à
  côte, situations et curseurs en dessous sur toute la largeur. L'ancienne
  colonne de 22 rem laissait 300 px de zone morte sous la scène.
- **L'orbite tient l'angle choisi.** La caméra rejoignait sa pose à chaque
  image : on pouvait tourner autour de la baie, mais l'angle se défaisait tout
  seul en quelques secondes. Le recadrage n'est plus qu'un événement —
  changement de côté, changement d'angle, bouton « Réinitialiser la vue » — et
  un geste de l'utilisateur l'annule.

### Recette après factorisation

`/gammes/volet` a été retestée : 3D, curseurs, situations, mode automatique,
lames, vue intérieure et extérieure, réinitialisation, thème sombre, largeurs
390 / 768 / 1440 / 1920. Aucune régression. Capture :
`audit/3d/fenetre/09-page-volet-apres-refactor.jpg`.

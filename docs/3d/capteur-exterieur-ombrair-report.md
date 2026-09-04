# Capteur extérieur Ombrair — modélisation 3D et intégration web

| | |
|---|---|
| **Date** | 26 août 2026 |
| **Périmètre** | capteur extérieur uniquement — ni intérieur, ni Link, ni volet, ni fenêtre |
| **Livrables** | `.blend`, deux `.glb`, dix rendus, visionneuse interactive intégrée au hero produit |
| **Spécification** | [`capteur-exterieur-ombrair-spec.md`](./capteur-exterieur-ombrair-spec.md) |

---

## 1. Références réellement utilisées

| Référence | Rôle |
|---|---|
| `Ombrair - Identité concept 07-selection.png`, panneau **« BOÎTIER DE CAPTEUR »** | **source de vérité visuelle** — silhouette, orientation, position de la grille, de la fenêtre optique et du marquage |
| Brief de mission, section 5 | cotes 80 × 60 × 26 mm et nomenclature interne |
| `docs/brand.md` | valeurs exactes de Chaux, Persienne, Nuit |

**Le schéma évoqué par le brief n'existe pas dans le dépôt.** Recherche sur
`esp32`, `sht45`, `veml`, `pcb`, `usb-c`, `éclatée` : aucune occurrence hors du
brief. La nomenclature vient donc du brief, la géométrie extérieure de la
planche de charte. Rien n'a été extrapolé d'un document absent.

**Contradiction arbitrée.** `components/product-visuals/sensor-visual.tsx`
dessine le capteur en **portrait** ; la planche le montre en **paysage**. La
planche l'emporte — elle est la source de vérité de l'identité et porte la
seule cote publiée (« marquage 4 mm de haut »). L'illustration SVG n'a pas été
touchée : elle reste le visuel d'accueil et de catalogue.

---

## 2. Outils — ce qui a été installé

| Outil | État initial | Action |
|---|---|---|
| **Blender** | absent | **installé** — `winget install BlenderFoundation.Blender.LTS.4.5` → 4.5.10 LTS |
| **uv / uvx** | absent | non installé, devenu inutile (voir ci-dessous) |
| **Blender MCP** | non configuré | **non installé — délibérément** |
| `@google/model-viewer` | absent | installé, `4.3.1` |

### Pourquoi pas Blender MCP

Blender MCP pilote une instance Blender **ouverte**, via un addon activé à la
main dans l'interface. Cette mission tourne sans interface graphique : elle
demande un modèle reproductible, pas une session interactive.

Le modèle est donc construit par un **script Python exécuté en
`--background`**. Cela vaut mieux ici pour trois raisons vérifiables : le
`.blend` se régénère à l'identique par une commande, une cote se change à un
seul endroit et tout suit, et rien ne dépend d'une action manuelle dans une
fenêtre. Aucune action humaine ne reste en attente.

**Reproduire l'ensemble :**

```bash
blender --background --python docs/3d/build_capteur_exterieur.py  -- .
blender --background --python docs/3d/render_capteur_exterieur.py -- .
```

---

## 3. Ce qui a été produit

| Fichier | Poids | Rôle |
|---|---|---|
| `docs/3d/build_capteur_exterieur.py` | — | construit le modèle et exporte les deux GLB |
| `docs/3d/render_capteur_exterieur.py` | — | produit les dix rendus |
| `docs/3d/capteur-exterieur-ombrair.blend` | 1,1 Mo | source Blender |
| `public/models/capteur-exterieur-ombrair.glb` | **88 ko** | modèle assemblé |
| `public/models/capteur-exterieur-ombrair-eclate.glb` | **88 ko** | vue éclatée |
| `public/models/capteur-exterieur-ombrair-fallback.png` | 286 ko | repli + affiche de chargement |
| `audit/3d/capteur-exterieur/*.png` | 10 fichiers, 13 Mo | rendus de contrôle |

Onze pièces nommées : coques haute et basse, jonc, fenêtre optique, marquage
et ses trois lames, platine murale, PCB, ESP32-C3, SHT45, VEML7700, étage
d'alimentation, connecteur USB-C.

---

## 4. Boucle d'itération — quatre défauts trouvés en regardant le résultat

C'est la partie qui a pris le plus de temps, et aucun de ces défauts n'était
visible autrement qu'en rendant l'image.

### V1 — la face avant était vide

Le premier rendu montrait **un pavé blanc**, sans grille ni marquage.

**Cause 1 — le booléen ne s'appliquait pas.**
`bpy.ops.object.modifier_apply` agit sur l'objet actif **et sélectionné**. Le
script rendait l'objet actif sans le sélectionner : en `--background`,
l'opérateur échouait **sans lever d'exception**. Le modificateur restait dans
la pile, la géométrie n'était jamais creusée, et le script se terminait en
annonçant un succès.

Ajouter `select_set(True)` n'a pas suffi. La correction retenue abandonne
l'opérateur au profit d'une **évaluation par le depsgraph** :

```python
evalue = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
obj.data = bpy.data.meshes.new_from_object(evalue)
```

Aucune dépendance au contexte, donc aucun échec silencieux possible.

**Cause 2 — le marquage était noyé dans la coque.** Son centre était posé à
+0,08 mm de la face avant, pour une épaisseur de 0,15 mm : la plaquette était
donc entièrement **à l'intérieur** du boîtier. Le défaut ne se voyait qu'en
relevant les boîtes englobantes (`Y[-13.0, -12.8]` pour une face à `Y=-13`).

**Cause 3 — le congé du marquage** avait un rayon de 0,9 mm pour une épaisseur
de 0,15 mm. Un rayon supérieur à l'épaisseur transforme la plaquette en galet
et faisait passer la pièce à 294 polygones. Ramené à 30 % du relief : 54.

### V2 — la Chaux sortait blanc pur

Le boîtier perdait sa matière et la grille s'y noyait. Les énergies
d'éclairage ont été divisées par ~4 et une exposition de −1,15 EV appliquée à
la vue. Le réglage est fait au **rendu**, pas en assombrissant le matériau :
la couleur de la charte reste exacte dans le fichier.

### V3 — la vue éclatée ne montrait pas l'intérieur

Les strates étaient vues presque de champ : la carte se lisait comme une
simple plaque verte, ses composants invisibles. Deux corrections — caméra plus
latérale, et composants internes légèrement épaissis (SHT45 de 1,2 à 2,0 mm,
VEML de 1,1 à 1,9 mm) pour qu'ils existent à l'échelle d'un boîtier de 80 mm.

L'affiche de repli a aussi été ramenée de 1400 × 1050 à 800 × 600 : à pleine
résolution elle pesait **828 ko**, soit neuf fois le GLB qu'elle est censée
faire patienter.

### V4 — le modèle sortait tout blanc DANS LE NAVIGATEUR

Signalé par le relecteur, pas par moi : à l'écran, l'objet entier était blanc
et aucun détail ne se lisait. Mesure des pixels du canvas WebGL :
**luminance moyenne 240 / 255**, 2 % de pixels saturés. Tout l'objet tenait
dans les 6 % supérieurs de l'échelle.

**Cause — j'avais validé le mauvais artefact.** La surexposition de la V2
avait été corrigée par `scene.view_settings.exposure = -1.15`, qui est un
réglage du **view transform de Blender**. Il agit sur les rendus PNG et ne
part **pas** dans le `.glb`. Mes rendus de contrôle étaient donc corrects
pendant que le modèle livré restait cramé. J'ai vérifié l'image que j'avais
réglée, pas le fichier que le site charge.

Trois corrections, toutes dans ce qui s'exporte réellement :

1. **Une cavité sombre derrière la grille.** C'est le gain principal. Six
   entailles de 1,6 mm dans un plastique à 96 % de blanc, sous un éclairage
   d'environnement diffus, ne projettent presque aucune ombre : elles se
   lisaient comme des rayures. Avec un fond sombre derrière, chaque fente
   devient une ouverture — ce qu'elle est physiquement.
2. **Des valeurs de surface distinctes.** Coque avant, coque arrière et
   platine partageaient la même Chaux. Le dos descend d'un ton, la platine
   technique passe franchement au gris.
3. **Exposition du viewer à 0,72** avec `tone-mapping="neutral"`, puisque le
   réglage Blender ne suit pas le modèle.

Résultat mesuré au même endroit : moyenne **213**, **0 %** de pixels saturés.

Deux défauts secondaires sont apparus en corrigeant : le modèle éclaté, deux
fois plus encombrant, débordait du cadre avec le rayon de caméra fixe — la
vue éclatée passe en cadrage `auto` ; et la cavité, écartée séparément,
laissait voir le fond à travers les fentes — elle suit désormais la coque
avant, dont elle est la paroi intérieure.

---

## 5. Choix du viewer

`<model-viewer>` plutôt que Three.js. Le besoin — charger un glTF, tourner,
zoomer, revenir — est exactement son domaine ; il gère le tactile, le clavier
et le repli sans code à entretenir. Une scène Three.js maison aurait ajouté
une boucle de rendu à maintenir sans rien apporter de visible.

**Le paquet est chargé dynamiquement** dans un `useEffect` : il touche
`window` à l'import et enregistre un custom element, donc il ne peut pas être
importé au niveau du module dans une page rendue côté serveur. Effet de bord
utile : ses ~300 ko restent hors du bundle initial. `/gammes/capteur` passe de
120 ko à **126 ko** de First Load JS — soit +6 ko, pas +300.

**Détail qui a failli passer pour un bug.** React 19 affecte les props d'un
custom element en **propriétés**, pas en attributs. Le premier test de la vue
éclatée lisait `getAttribute("src")`, qui restait sur l'ancien modèle, et
concluait à un échec. La bascule fonctionnait ; c'est la vérification qui
regardait au mauvais endroit.

### Repli

Trois chemins mènent à l'image fixe : WebGL indisponible (testé avant tout
téléchargement), échec du chargement du module, échec du chargement du modèle.
Dans les trois cas la page produit reste intacte, et la barre de commande
n'affiche plus de boutons qui ne feraient rien.

---

## 6. Intégration

La visionneuse **remplace l'illustration en arche** dans le hero de
`/gammes/capteur`. Le gabarit `PageGamme` reçoit une prop `visuelHero`
optionnelle : les pages Volet et Fenêtre ne changent pas d'un pixel.

Le capteur est le seul produit qu'Ombrair conçoit et fabrique — c'est aussi le
seul dont on peut montrer le boîtier réel.

Rien d'autre n'a bougé : prix, modèle produit + installation, CTA, structure,
responsive.

---

## 7. Contrôles

| Contrôle | Résultat |
|---|---|
| `npm run lint` | propre |
| `npm test` | **126 tests**, 0 échec |
| `npm run build` | succès, **37 routes** |
| Modèle chargé dans le navigateur | ✅ `loaded=true`, canvas WebGL présent |
| Rotation | ✅ theta −0,49 → −3,28 au glisser |
| Zoom | ✅ champ 26° → 18,9° à la molette |
| Réinitialisation | ✅ champ revenu à 26° |
| Vue éclatée | ✅ bascule et retour vérifiés sur la propriété `src` |
| Erreurs console | **0** |
| Luminance du canvas WebGL | moyenne **213 / 255**, **0 %** de pixels saturés |
| Largeurs 360 → 1920 | **0 débordement** |
| Thèmes jour et nuit | ✅ modèle chargé dans les deux |

Vérifications faites dans un vrai Chromium (SwiftShader), pas déduites du code.

---

## 8. Limites connues

- **Aucune cote ne vient d'un dossier de fabrication.** Hors les 80 × 60 × 26 mm
  du brief et les 4 mm du marquage, tout est hypothèse documentée dans la spec.
- **Le logotype `ombrair` n'est pas modélisé lettre à lettre.** Seul le signe
  en arche l'est. Modéliser le mot exigerait la fonte Outfit Light en TTF, que
  le projet n'a pas sous forme de fichier — `next/font` la télécharge au build.
  Une fonte approchante aurait été une infidélité de marque plus visible que
  l'absence du mot.
- **Aucune étanchéité représentée** alors que le capteur est extérieur : ni
  joint torique, ni presse-étoupe. Ni le brief ni la planche ne les mentionnent.
- **Composants internes schématiques** : volumes justes en taille et en
  position, non routés, sans sérigraphie ni broches.
- **Rendu EEVEE et non Cycles.** Sur des congés à 3 mm et des matériaux mats,
  la différence est marginale ; dix vues en ray tracing coûtaient des minutes
  pour un gain invisible.
- **Le rapport largeur / hauteur de la planche** (≈ 1,49) diffère des
  80 × 60 mm du brief (1,33). Les cotes du brief l'emportent, la planche
  s'annonçant elle-même comme une maquette indicative.
- **Trois vulnérabilités `npm audit`** sont apparues à l'installation. Elles
  viennent de `postcss` et `sharp`, dépendances transitives de Next 15
  — pas de `model-viewer`, dont les seules dépendances sont `lit` et
  `gainmap-js`. Leur correction imposerait Next 16, hors périmètre.

### Où vivent les rendus

Dans `audit/3d/` et non dans `public/`. Ce sont des pièces de vérification :
treize mégaoctets de contrôles n'ont rien à faire dans ce qui est déployé.
Seule l'image de repli, réellement utilisée par la page produit, est dans
`public/models/`.

---

## 9. Suites possibles

- Points chauds (hotspots) sur la grille, la fenêtre optique et la fixation.
- Même chaîne pour Ombrair Link, dont le boîtier est déjà dessiné en SVG.
- Compression Draco si le modèle se complexifie — inutile à 88 ko.
- Vue éclatée animée plutôt que deux fichiers, si une transition est souhaitée.

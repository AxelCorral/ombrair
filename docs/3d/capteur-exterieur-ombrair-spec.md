# Capteur extérieur Ombrair — spécification de modélisation 3D

Document de travail préalable à la modélisation. Il fixe ce qui est **relevé**
sur une référence, ce qui est **donné** par le brief, et ce qui est une
**hypothèse** assumée — pour qu'aucune décision de forme ne soit silencieuse.

> Ombrair est un projet étudiant fictif. Ce modèle est une représentation
> produit crédible, pas un jumeau industriel : il n'a jamais été fabriqué,
> et aucune de ses cotes ne provient d'un dossier de fabrication.

---

## 1. Références utilisées

| Référence | Statut | Ce qu'elle apporte |
|---|---|---|
| `Ombrair - Identité concept 07-selection.png`, panneau **« BOÎTIER DE CAPTEUR »** | **source de vérité visuelle** | Silhouette, orientation, position de la grille, de la fenêtre optique et du marquage |
| Brief de mission (section 5) | **source de vérité dimensionnelle et fonctionnelle** | 80 × 60 × 26 mm, liste des pièces et des composants internes |
| `docs/brand.md` | charte | Valeurs exactes de Chaux, Persienne, Nuit |
| `components/product-visuals/sensor-visual.tsx` | référence secondaire | Illustration plate du site — voir l'arbitrage §4 |

### Ce qui n'existe pas dans le dépôt

Le brief évoque « le schéma existant de référence » du capteur extérieur,
avec vue éclatée et nomenclature électronique. **Ce fichier n'est pas dans le
dépôt.** Recherche effectuée sur `esp32`, `sht45`, `veml`, `pcb`, `usb-c`,
`éclatée` : aucune occurrence hors du brief lui-même.

La nomenclature est donc reprise **du brief**, qui la donne explicitement, et
la géométrie extérieure de la **planche de charte**, qui est la seule
représentation validée du boîtier. Rien n'a été extrapolé d'un document qui
n'existe pas.

---

## 2. Ce que la planche de charte montre

Relevé sur le panneau « BOÎTIER DE CAPTEUR » :

- boîtier **paysage**, plus large que haut, coins arrondis d'un rayon faible
  (≈ 4 % de la largeur) ;
- corps **Chaux**, cerné d'un filet sombre fin — une ligne de joint, pas un
  contour décoratif ;
- **grille de mesure** : six fentes horizontales, cadran **supérieur gauche**,
  occupant environ 38 % de la largeur ;
- **fenêtre optique** : un disque sombre plein, **supérieur droit**, ≈ 9 % de
  la largeur ;
- **marquage** : signe + logotype `ombrair` en Persienne, **inférieur gauche**.
  Légende de la planche : « Marquage Persienne, 4 mm de haut, à distance de la
  grille de mesure. »

La légende donne donc une **échelle réelle** : le logotype fait 4 mm de haut.
C'est la seule cote physique publiée, et elle sert à caler le marquage sur le
boîtier de 60 mm de haut.

---

## 3. Dimensions retenues

| Élément | Valeur | Origine |
|---|---|---|
| Boîtier | **80 × 60 × 26 mm** (L × H × P) | brief §5 |
| Rayon des congés verticaux | 3 mm | hypothèse, calée sur la planche |
| Épaisseur de coque | 2 mm | hypothèse — plausible en ABS injecté |
| Ligne de joint | à 10 mm du fond | hypothèse |
| Marquage `ombrair` | 4 mm de haut | planche de charte |
| Fenêtre optique | Ø 7 mm | hypothèse, calée sur la proportion de la planche |
| Fentes de grille | 6 fentes, 30 × 1,6 mm, pas 3,2 mm | hypothèse, comptées sur la planche |
| Platine murale | 70 × 50 × 3 mm | hypothèse |

**Orientation.** Le modèle est en **paysage**, conformément à la planche.
Cela contredit `sensor-visual.tsx`, qui dessine un boîtier **portrait** — voir
l'arbitrage ci-dessous.

**Échelle du fichier.** 1 unité Blender = 1 mètre. Le boîtier fait donc
0,080 × 0,060 × 0,026 unité. C'est ce que `<model-viewer>` attend, et cela
évite un facteur d'échelle à l'import.

---

## 4. Arbitrages de modélisation

**Paysage plutôt que portrait.** L'illustration plate du site dessine le
capteur en portrait ; la planche de charte le montre en paysage. La planche
est la source de vérité de l'identité — l'audit de marque la désigne comme
telle — et c'est elle qui porte la seule cote publiée. Le modèle 3D suit donc
la planche. L'illustration SVG n'est pas modifiée par cette mission : elle
reste le visuel d'accueil et de catalogue.

**Pas de visserie apparente en face avant.** La planche n'en montre aucune.
Quatre bossages de vis sont modélisés à l'intérieur, visibles seulement en vue
éclatée — c'est ce qui rend l'assemblage crédible sans salir la face vue.

**Fentes réellement creusées.** La grille est une géométrie en creux, pas une
texture : elle doit tenir à la rotation et sous une lumière rasante, ce qu'une
texture ne fait pas.

**Composants internes schématiques.** ESP32-C3, SHT45, VEML7700 et
l'alimentation sont des volumes justes en taille et en position, sans
sérigraphie ni broches. Le brief l'autorise explicitement, et une fausse
précision électronique serait moins honnête qu'une abstraction assumée.

**Le SHT45 est placé derrière la grille**, le VEML7700 derrière la fenêtre
optique : c'est ce qui rend l'implantation lisible en vue éclatée, et c'est la
seule disposition cohérente avec ce que la planche montre en face avant.

---

## 5. Pièces du modèle

Hiérarchie Blender, un objet par pièce :

| Objet | Rôle |
|---|---|
| `sensor_outer_top_shell` | coque supérieure, grille creusée, congés |
| `sensor_outer_grille_cavity` | paroi sombre derrière les fentes — c'est elle qui fait exister la grille |
| `sensor_outer_optical_window` | disque translucide sombre, affleurant |
| `sensor_outer_marking` | signe + logotype, en relief léger |
| `sensor_outer_pcb` | carte, vert sourd |
| `sensor_outer_esp32` | module radio |
| `sensor_outer_sht45` | capteur température / humidité, sous la grille |
| `sensor_outer_veml7700` | capteur de lumière, sous la fenêtre |
| `sensor_outer_power` | étage d'alimentation |
| `sensor_outer_usb` | connecteur USB-C, sur le flanc |
| `sensor_outer_bottom_shell` | coque inférieure, bossages de vis |
| `sensor_outer_mount_plate` | platine de fixation murale |

---

## 6. Matériaux

Palette strictement Ombrair. **Fraîche et Ambre sont exclues** : ce sont des
couleurs d'état thermique, pas des couleurs de boîtier.

| Matériau | Couleur | Rendu |
|---|---|---|
| Coque avant | Chaux `#f4f1e9` | plastique injecté, rugosité 0,62 — mat satiné |
| Coque arrière | Chaux assombrie d'un ton | rugosité 0,68 |
| Cavité de grille | quasi noir | rugosité 0,9 — un creux ne renvoie rien |
| Marquage | Persienne `#33665a` | même rugosité, sans métallisation |
| Fenêtre optique | Nuit `#161d23` | rugosité 0,15, légèrement spéculaire |
| Platine murale | Chaux assombrie | rugosité 0,7 — pièce technique, plus mate |
| PCB | vert sourd désaturé | rugosité 0,6 |
| Composants | gris neutres | non métalliques sauf blindage ESP32 |

Aucune couleur hors charte, aucun métal poli, aucun reflet spéculaire fort :
la planche décrit des « aplats pleins », et le produit doit rester sobre.

---

## 7. Plan d'export

| Livrable | Chemin |
|---|---|
| Source Blender | `docs/3d/capteur-exterieur-ombrair.blend` |
| Modèle web | `public/models/capteur-exterieur-ombrair.glb` |
| Image de repli | `public/models/capteur-exterieur-ombrair-fallback.png` |
| Rendus de contrôle | `audit/3d/capteur-exterieur/` |

Contraintes d'export : glTF binaire, `+Y` vers le haut, origine au centre du
boîtier, matériaux en `Principled BSDF` sans texture bitmap, cible **sous
1 Mo**.

Les rendus de contrôle vivent dans `audit/3d/` et non dans `public/` : ce sont
des pièces de vérification, pas des assets du site.

**Ce qui ne s'exporte PAS.** Le réglage d'exposition de la vue Blender
(`view_settings.exposure`) n'entre pas dans le `.glb` : il ne corrige que les
rendus PNG. Toute correction de luminosité destinée au web doit donc vivre
soit dans les MATÉRIAUX, soit dans les réglages du viewer. C'est le piège qui
a laissé partir une V3 entièrement blanche à l'écran alors que ses rendus
étaient corrects.

---

## 8. Limites connues

- Aucune cote ne vient d'un dossier de fabrication : hors les 80 × 60 × 26 mm
  du brief et les 4 mm du marquage, tout est hypothèse documentée.
- Les composants internes sont schématiques ; leur implantation est plausible,
  pas routée.
- Le rapport largeur / hauteur de la planche (≈ 1,49) diffère légèrement des
  80 × 60 mm du brief (1,33). Les cotes du brief l'emportent, la planche
  restant une maquette indicative — c'est d'ailleurs ce qu'elle annonce.
- Aucune étanchéité n'est représentée alors que le capteur est extérieur : ni
  joint torique, ni presse-étoupe. Le brief ne les mentionne pas et la planche
  ne les montre pas.

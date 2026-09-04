# Refonte UI Ombrair — rapport de passe

| | |
|---|---|
| **Date** | 26 août 2026 |
| **Branche** | `master` — rien n'est poussé |
| **Point de départ** | `d55881d`, après la passe post-audit |
| **Nature** | direction artistique, design system, composition, illustration produit, polish visuel |
| **Hors périmètre** | modèle commercial, produits, tarifs, logique métier, données mock, routes, parcours |

> Aucune information commerciale n'a été inventée, modifiée ou supprimée.
> Aucun prix, aucune mention de fabrication, aucune source n'a bougé.

---

## 1. Skills et plugins réellement utilisés

| Capacité | État | Usage |
|---|---|---|
| **Frontend Design** (Anthropic, officiel) | **installé pendant la mission**, portée projet | Lu et appliqué : direction esthétique intentionnelle, typographie comme personnalité, structure porteuse de sens, retenue |
| **Skill projet `ombrair-ui-art-direction`** | **créée**, `.claude/skills/` | Relue à l'ouverture de chaque phase. Autorité supérieure aux goûts génériques |
| **Playwright** | **réutilisé**, hors dépôt | Boucle IMPLEMENT → RENDER → SCREENSHOT → CRITIQUE → CORRECT |
| Pack communautaire `taste` | **non installé** | Le plugin officiel plus la skill projet suffisaient. Installer six skills de design concurrentes aurait augmenté le bruit, pas la cohérence |

**Vérifications faites avant d'agir**, sans rien supposer : plugins
installés (aucun), `~/.claude/skills/` (absent), `.claude/skills/` (absent),
`CLAUDE.md` (absent), marketplace officiel (présent, `frontend-design`
disponible), navigateurs Playwright (présents dans
`~/AppData/Local/ms-playwright`).

**Aucune dépendance npm n'a été ajoutée au projet.** Playwright vit dans le
scratchpad de session, comme lors de l'audit. Aucune bibliothèque
d'animation n'a été introduite : tout est CSS et SVG.

### Ce que la skill projet a servi à bloquer

Trois fois pendant la passe, la solution évidente était un pattern
générique. La skill a servi de garde-fou :

- une **bento grid** pour la page Application — écartée : la page devait
  montrer un appareil, pas une grille de tuiles ;
- des **pill badges** de statut dans l'app — écartés au profit d'un repère
  géométrique, parce que la charte interdit le radius pilule ;
- des **arches** sur les cartes du catalogue et derrière les titres de
  section — écartées : l'arche cadre un produit, elle ne décore pas.

---

## 2. Direction générale

Le site était propre mais parlait partout la même langue : **fond Chaux +
rectangle à bordure 1 px + titre + texte**. Il ne fallait pas le rendre plus
décoratif, mais plus **composé**.

Le parti pris tient en une phrase : **le site est une élévation
d'architecture**. Une mesure unique et répétable, un repère de chapitre qui
s'annote comme une planche de dessin, des ouvertures qui cadrent réellement
un produit, et une lumière produite par une géométrie — jamais par un flou.

**L'élément de signature** est l'**ouverture de chapitre** : un filet fin
qui traverse toute la mesure, un surtitre technique en mono accroché juste
dessous, le titre en dessous. C'est ainsi qu'on annote une planche, pas
qu'on titre une landing page. Il marque un chapitre sans ajouter ni carte,
ni bordure, ni ombre, et sans coûter de hauteur.

---

## 3. Design system

### La mesure

Le header et le pied de page vivaient dans `max-w-6xl` centré ; chaque page
posait son propre `px-6 md:px-16` en pleine largeur. **À 1440 px, le titre
d'une page produit commençait 104 px à gauche du logo qui le surplombe.**
Invisible ligne à ligne dans le JSX, flagrant sur une capture : c'est la
première cause de l'impression de maquette relevée par l'audit.

`Conteneur` porte désormais la mesure, et les quinze `main` du site s'y
alignent.

### Les surfaces

`--card` valait **exactement** `--background` en thème clair : une « carte »
n'était qu'un trait de 1 px sur le même fond. D'où quatre niveaux
explicites — `background`, `sourde`, `panneau`, `encre` — distingués par la
valeur de fond et **jamais par une ombre**.

### L'espace de mélange — un défaut de marque, pas une préférence

Chaux (`#f4f1e9`) est une couleur chaude de très faible chroma. Mélangée à
Persienne **dans oklch**, sa teinte bascule presque immédiatement vers celle
de Persienne :

| Mélange | Résultat oklch | Résultat srgb |
|---|---|---|
| Persienne 4 % + Chaux | `#e2eeea` — vert d'eau franc (R 226 < G 238) | `#ecebe3` — Chaux ombrée |
| Persienne 8 % + Chaux | `#dce9e5` | `#e5e6de` |
| Chaux 16 % + Nuit (filet, thème nuit) | `#403638` — gris **rosé** | `#3e4347` — gris neutre froid |

Toute l'échelle neutre du site partait donc en menthe pâle dès le premier
niveau, alors que la charte demande que le design vive avec **Chaux +
Persienne + Nuit**. Les surfaces et les filets passent en `srgb`.

Ne sont **pas** passés en srgb : `--muted-foreground`, couleur de TEXTE dont
les ratios AA avaient été mesurés au pixel, et `--card` en thème nuit, dont
la teinte Persienne fait l'ambiance nocturne saluée par l'audit.

### La typographie

Tout le site parlait à peu près la même voix : corps à 14 px, tous les H2 à
la même taille, sources au même niveau que le texte courant. Le problème
n'était pas la taille absolue mais **l'absence d'écart entre les rôles**.

Dix rôles nommés, dans la couche `components` — donc toujours surchargeables
par une utilitaire Tailwind :

| Rôle | Taille | Emploi |
|---|---|---|
| `t-eyebrow` | 12 px mono, 0,16 em | surtitre technique |
| `t-display` | 44 → 68 px | H1 des pages d'entrée, hero |
| `t-h1` | 36 → 52 px | titre de page courant |
| `t-h2` | 28 → 38 px | chapitre |
| `t-h3` | 19 px | sous-titre |
| `t-lead` | 17 → 19 px | chapô |
| `t-body` | 16 px | corps — **était 14 px** |
| `t-support` | 15 px | descriptions, aides, listes secondaires |
| `t-caption` | 13 px | légende, source, mention |
| `t-data` | mono, chiffres tabulaires | températures, prix, heures, dimensions |

Les 19 emplois restants de `text-xs` (12 px) sur le site ont été supprimés :
le brief interdit le microtexte à 100 % sur un écran 1440.

### Le rythme

Trois amplitudes au lieu d'un `gap-16` uniforme. Un premier réglage à 112 px
de part et d'autre ajoutait près de **1 000 px** à la page d'accueil, dont
l'audit signalait déjà la longueur — l'espace était intentionnel mais
coûtait plus qu'il ne rapportait. Ramené à 80 px : le changement de chapitre
est surtout porté par le fond et le filet, qui ne coûtent pas de hauteur.

### Les actions

« Demander un devis » existait en cinq variantes recopiées à la main
(h-9 / h-10 / h-11, px-4 / px-5 / px-6, deux couleurs de bordure). Trois
niveaux stricts : `principal`, `second`, `discret`, plus une variante posée
sur fond Encre. Rayon 5 px, aucune ombre, aucun dégradé.

---

## 4. Page par page

Les notes de direction détaillées sont dans `decisions/` :
[`home.md`](decisions/home.md) · [`products.md`](decisions/products.md) ·
[`app.md`](decisions/app.md).

### Accueil

Hero regroupé en **PROMESSE / MESURES / COMMANDE / ACTION**, séparés au
filet et non par une carte. L'ouverture reçoit un **mur, une embrasure
décalée, un dormant et un appui débordant** : quatre éléments qui ne
dépendent pas de l'heure, si bien que la scène tient même à 00:00, quand le
ciel s'assombrit et que le volet est baissé.

Le constat passe en composition éditoriale à filets verticaux. Les quatre
temps se lisent sur un rail continu. La bande écosystème devient un
diagramme à quatre miniatures tracées dans la famille des visuels produit.

La vitrine des trois produits n'a **pas** été refaite : l'audit la donnait
comme le point haut du site.

### Gammes

Trois colonnes de tarifs coiffées de bandes horizontales qui ressemblaient à
des chargements en attente → **planche de catalogue** : une entrée par
produit sur toute la mesure, ouverture en arche alternée, illustrations
réelles.

Le tableau comparatif devient une **matrice de fonctions**. Capteur, Volet
et Fenêtre ne sont pas trois formules concurrentes ; comparer leurs prix n'a
pas de sens, comparer ce qu'ils font en a un. Mêmes faits, réorganisés.

### Capteur · Volet · Fenêtre

Hero tenu sur 32 rem, ouverture à 30 rem, légende de planche reprenant
`accroche` — un champ de `lib/tarifs.ts` qui n'était plus affiché nulle
part. Puis trois blocs textuels remplacés par des représentations :
nomenclature numérotée, rail d'installation à trois degrés, silhouettes de
format à l'échelle relative, extrait d'écran applicatif réel.

Le prix n'apparaît qu'une fois en tête. Le contenu est identique.

### Application (vitrine)

Trois cadres de téléphone identiques de 780 px, remplis de quatre lignes
chacun : les trois quarts de la page étaient des aplats sombres vides. Un
seul appareil complet à côté de la promesse, puis **deux vues recadrées**,
coupées net en bas — un extrait dit « il y a la suite » là où un écran à
moitié vide dit « il n'y a que ça ».

Les valeurs (25,8 °C, 11,4 °C, 22h40, 4,2 °C) étaient recopiées en dur dans
le JSX ; elles viennent maintenant de `lib/mock`.

### App (démo)

Cinq niveaux au lieu d'un. En thème nuit, `--card` étant une Persienne
assombrie, chaque écran était une pile de blocs verts — les surfaces de
l'app montent désormais en Chaux. Système de statuts unique où la **forme**
du repère porte l'information. Alertes en montant vertical plutôt qu'en
aplat rouge. Schéma technique sur l'écran d'appairage.

### Ressources

Quatre articles au traitement strictement identique, sans image. Chacun
porte son **visuel éditorial** — géométrie et architecture, jamais de photo
ni de personnage. L'article à lire en premier prend une composition que rien
d'autre sur la page ne partage.

### Pro

Titre, quatre rectangles, formulaire, moitié droite vide sur toute la
hauteur. Un **schéma d'élévation multi-sites** montre ce qui fait l'offre :
un parc, et un seul endroit d'où on le regarde. **Sans un seul chiffre** —
le projet n'a ni référence client ni volume, et une illustration chiffrée
serait une statistique inventée.

### Devis

Le formulaire occupait le tiers gauche. Un **panneau contextuel** montre à
droite ce que le parcours a déjà recueilli, ligne par ligne, les champs non
renseignés restant visibles en attente. La barre de cinq segments devient un
fil d'étapes nommées et numérotées. **La logique du formulaire n'est pas
touchée.**

### Comment ça marche

Récit en quatre temps — LE JOUR, OBSERVER, DÉCIDER, GARDER LA MAIN. Ombrair
Link est enfin montré sur la page qui l'explique le plus. La liste des
limites reste intégrale et au même niveau que le reste.

### FAQ et pages légales

Non surdesignées, comme demandé. FAQ : affordance d'ouverture (« + » /
« − ») et mesure de lecture. Légales : mesure à 38 rem, corps à 16 px.

---

## 5. Nouveaux composants

Créés parce qu'ils sont réellement réutilisés, jamais pour le principe.

| Composant | Réemplois |
|---|---|
| `site/mise-en-page` — `Conteneur`, `Section`, `OuvertureChapitre` | toutes les pages |
| `site/actions` — `ActionLien`, `LienFleche` | toutes les pages |
| `site/entree-catalogue` | `/gammes` ×3 |
| `site/matrice-fonctions` | `/gammes` |
| `site/produit-blocs` — `Nomenclature`, `RailInstallation`, `ReleveFabrication` | 3 pages produit |
| `site/apercu-app` | 3 pages produit + accueil + comment ça marche |
| `site/diagramme-ecosysteme` | accueil |
| `site/visuels-editoriaux` | 4 articles |
| `app-demo/ui` — `EnTeteEcran`, `Panneau`, `Groupe`, `Ligne`, `Statut`, `BandeAlerte`, `SchemaAppairage` | 9 écrans |
| `product-visuals/link-visual` | comment ça marche, index produit |
| `product-visuals/parc-visual` | `/pro` |

**Supprimés parce que plus référencés** : `site/pricing-card`,
`site/bande-ecosysteme`.

## 6. Assets créés

Aucun fichier binaire. **Tout est SVG en ligne ou CSS**, aucune couleur en
dur, aucun PNG décoratif, aucune vidéo :

- `LinkVisual` — Ombrair Link, cité partout et jamais montré jusqu'ici ;
- `ParcVisual` — élévation multi-sites, sans aucun chiffre ;
- quatre visuels éditoriaux — nuit et ouverture, masse d'un mur, protection
  avant machine, logement tenu au frais ;
- quatre miniatures d'écosystème — capteur, Link, ouvrant, application ;
- `SchemaAppairage` — dos du capteur, bouton, diode, portée radio ;
- silhouettes de format, à l'échelle relative ;
- utilitaire `lumiere-lames` — trois bandes inégales, la troisième plus
  sourde, comme le signe.

## 7. Pages non modifiées

`/contact` et `/a-propos` (uniquement l'échelle typographique),
`/presentation` (support projeté, hors périmètre vitrine), `/sitemap.xml`,
`/robots.txt`.

---

## 8. Résultats des contrôles

### Contrôles automatiques

| Contrôle | Résultat |
|---|---|
| `npm run lint` | **propre** — 0 erreur, 0 avertissement |
| `npm test` | **87 tests, 25 suites, 0 échec** |
| `npm run build` | **succès — 36 routes prérendues**, lancé serveur de développement arrêté |
| Couleurs en dur dans les composants | **0** (seule exception documentée : `viewport.themeColor`) |
| Dépendances npm ajoutées | **0** |

### Responsive

**26 routes × 9 largeurs × 2 thèmes = 468 vérifications.**
Largeurs : 360 · 390 · 414 · 768 · 800 · 1024 · 1280 · 1440 · 1920.

**0 débordement horizontal · 0 statut non-200 · 0 erreur console ou JS.**

> **Une régression a été introduite puis corrigée pendant la passe.** En
> grossissant le logo et la navigation, le header a recréé à 1024 px
> exactement le défaut que l'audit avait corrigé à 768 px : 70 px de trop.
> Deux causes, toutes deux mesurées avant correction :
>
> 1. les six entrées, le logo `md` et les actions ne tenaient plus dans
>    960 px utiles ;
> 2. `OmbrairLogo` pose `inline-flex` **avant** d'appliquer `className` ;
>    `hidden` ne l'emportait donc pas, et les deux logotypes s'affichaient
>    ensemble — 127 px de plus à eux seuls.
>
> Le header a désormais deux tailles desktop : version resserrée de 1024 à
> 1279 px, version confortable à partir de 1280 px. Marge mesurée à
> 1024 px après correction : **63 px**. Les variantes de logo sont masquées
> par un conteneur neutre plutôt que par une classe en concurrence.

### Contraste — mesuré au pixel rendu

**42 points de mesure, 21 par thème. 0 sous le seuil AA.**

| Élément | Jour | Nuit | Seuil |
|---|---|---|---|
| H1 display | 5,83 | 15,08 | 3,0 |
| Chapô `t-lead` | 4,76 | 6,38 | 4,5 |
| Navigation | 5,83 | 15,08 | 4,5 |
| Surtitre `t-eyebrow` 12 px | 4,76 | 6,38 | 4,5 |
| Liens de pied de page | 5,83 | 15,08 | 4,5 |
| Corps `t-body` 16 px | 5,83 | 15,08 | 4,5 |
| Soutien `t-support` 15 px | 4,76 | 6,38 | 4,5 |
| Légende `t-caption` 13 px | 4,76 | 6,38 | 4,5 |
| Libellés de formulaire | 5,83 | 15,08 | 4,5 |
| App — texte de soutien | 6,05 | 8,00 | 4,5 |

Méthode : le texte et le fond sont peints séparément sur un canvas, puis
comparés **pixel à pixel**. Les scripts qui lisent les couleurs *calculées*
se trompent — alpha non composé, `oklch()` et `color-mix()` non résolus.
C'est la leçon de méthode de l'audit initial, appliquée ici aussi : la
première version de ce script rendait trois points avec leurs valeurs de
thème clair, parce que la bascule était actionnée par clic et que la
préférence persistait d'une page à l'autre. Le thème est maintenant posé
dans `localStorage` avant le premier rendu.

### Clavier et mouvement

| Contrôle | Résultat |
|---|---|
| Éléments interactifs sans nom accessible | **0** sur 434 (14 routes) |
| Images sans `alt` | **0** |
| Anneau de focus au clavier | **0 manquant** sur 87 éléments réellement tabulés (`/devis`, `/app/pieces`, `/app/reglages/appairage`) |
| `prefers-reduced-motion` | hero **figé** à 09:30, vérifié sur 2,5 s |
| Animations infinies restantes sous reduced-motion | **0** |

> Un premier script signalait 9 éléments sans anneau de focus. C'était un
> artefact : `element.focus()` en JavaScript ne déclenche pas toujours
> `:focus-visible` dans Chromium. Vérifié à la vraie touche Tab, aucun
> élément du site n'en manque — les trois cas restants sont le
> `NEXTJS-PORTAL` du mode développement, absent en production.

### Captures finales

**31 captures** dans [`after/`](after/), toutes sans débordement et sans
erreur console : accueil (desktop jour/nuit, mobile), gammes (desktop
jour/nuit, mobile), les trois pages produit, application, comment ça
marche, ressources, pro, devis (desktop jour/nuit, mobile), FAQ,
simulateur, et les onze écrans de l'app dont deux paires jour/nuit.

Les captures d'avant sont dans `audit/screenshots/` et
`audit/post-improvements/` — elles n'ont pas été dupliquées.

### Ce que les hauteurs disent

| Page | Avant | Après | Écart |
|---|---|---|---|
| Accueil desktop | 5 882 px | 6 847 px | +16 % |
| Accueil mobile 390 px | 10 398 px | 11 819 px | +14 % |
| `/gammes` desktop | 2 277 px | 4 226 px | +86 % |
| `/application` desktop | 1 917 px | 3 007 px | +57 % |
| `/pro` desktop | 1 661 px | 2 335 px | +41 % |
| Page Volet desktop | 3 135 px | 5 089 px | +62 % |

Ces écarts ne se lisent pas tous de la même façon. Sur `/gammes`,
`/application` et `/pro`, la page s'allonge parce qu'elle porte enfin
quelque chose : trois illustrations produit là où il n'y en avait aucune,
un appareil et deux extraits d'écran là où trois cadres vides occupaient la
largeur, un schéma de parc là où la moitié droite était nue. Sur l'accueil,
en revanche, l'allongement est le **prix de la lisibilité** — corps de 14 à
16 px, titres plus grands — et c'est un coût, pas un gain. Voir les limites
restantes.

---

## 9. Limites restantes

**La page d'accueil reste longue.** 11 708 px à 390 px, contre 10 398 avant
la passe. Le corps est passé de 14 à 16 px et les titres ont grandi — c'était
la demande explicite du brief, et le rythme a été réduit une fois pour
limiter la casse. UI-005 n'est donc pas résolu, il est arbitré : la
lisibilité a été préférée à la compacité. **Aucune donnée analytique n'existe
pour départager les deux.**

**Aucune mesure de performance.** Pas de Lighthouse, pas de profil CPU, pas
de poids de bundle. L'affirmation « aucune bibliothèque ajoutée » est
vérifiable dans `package.json` ; l'effet des SVG en ligne sur le temps de
rendu ne l'est pas.

**Aucun test avec lecteur d'écran réel.** Les contrôles portent sur le DOM
produit et sur des mesures automatisées, jamais sur l'expérience vécue avec
NVDA ou VoiceOver.

**Un seul navigateur** — Chromium headless. Safari et Firefox n'ont pas été
vérifiés. Les mélanges `color-mix(in srgb, …)` et `aspect-ratio` sont bien
supportés partout, mais ce n'est pas une vérification.

**Aucun test utilisateur.** Tout jugement de composition dans ce dossier est
une interprétation, distincte des mesures qui l'accompagnent.

**L'arche reste rare, par choix.** Elle cadre un produit sur `/gammes`, sur
les trois pages produit et sur « Comment ça marche ». Elle n'est pas
présente dans le hero de l'accueil — qui est déjà une fenêtre, avec son
propre dormant — ni dans l'app, où elle n'aurait rien à cadrer. Le brief
interdisait de la répéter par principe.

**Le visuel du volet dans l'arche.** Le coffre du tablier, clippé par la
courbe, se lit comme une calotte plutôt que comme un caisson. C'est
acceptable et cohérent avec le reste, mais c'est le point le plus
perfectible du système d'illustration.


---

## 10. Les dix-huit critères de réussite du brief

| # | Critère | État |
|---|---|---|
| 1 | La base sobre du projet est toujours reconnaissable | ✅ |
| 2 | La charte Ombrair est mieux incarnée | ✅ arche cadrante, lames signifiantes, échelle neutre rendue à Chaux |
| 3 | Les pages ne semblent plus être des gabarits | ✅ |
| 4 | Les produits sont réellement montrés | ✅ capteur, volet, fenêtre, Ombrair Link, parc |
| 5 | `/gammes` ressemble à un catalogue, pas à un tableau de prix | ✅ |
| 6 | Les pages produit semblent appartenir à une marque de hardware | ✅ |
| 7 | Les grands vides ont une intention | ✅ devis, pro et application n'ont plus de moitié morte |
| 8 | Les rectangles bordés sont utilisés avec parcimonie | ✅ |
| 9 | La typographie est plus confortable | ✅ corps 14 → 16 px, aucun texte sous 13 px |
| 10 | Le site est plus mémorable sans devenir plus bruyant | ✅ une seule signature, l'ouverture de chapitre |
| 11 | L'app est plus raffinée sans perdre sa fonction | ✅ 87 tests, cohérence inter-écrans intacte |
| 12 | Le dark mode reste excellent | ✅ et il gagne : Persienne redevient une couleur de marque |
| 13 | Mobile et desktop semblent tous deux conçus | ✅ |
| 14 | Aucune information métier inventée | ✅ zéro prix, zéro chiffre, zéro mention créés |
| 15 | Aucune régression fonctionnelle | ✅ |
| 16 | Les skills n'ont pas fait dériver la marque | ✅ trois patterns génériques écartés |
| 17 | Chaque page majeure a subi une boucle screenshot → critique → correction | ✅ |
| 18 | Lint, tests et build sont verts | ✅ |

### Trois défauts introduits par cette passe, trouvés et corrigés

Ils sont listés ici parce qu'un rapport doit dire ce qu'il a cassé, pas
seulement ce qu'il a réparé.

1. **Débordement de 526 px sur un écran de 390** — `sr-only` positionne en
   absolu ; sans ancêtre positionné, la légende masquée de la matrice de
   fonctions élargissait `documentElement`. Invisible à l'œil, bien réel à
   la mesure.
2. **Débordement de 70 px à 1024 px sur toutes les pages** — le header
   agrandi ne tenait plus à sa propre frontière, aggravé par deux logotypes
   affichés simultanément (`inline-flex` du composant l'emportant sur
   `hidden`). Corrigé par un header à deux tailles desktop et un conteneur
   de masquage neutre.
3. **Silhouettes de format couchées** — tous les formats s'affichaient en
   paysage, y compris une petite fenêtre de 60 × 75 cm. Une silhouette
   fausse est pire que pas de silhouette.

Les deux premiers ne se voyaient pas sur une capture ; seule la mesure les
a révélés. Le troisième ne se voyait qu'à condition de regarder la capture
à 100 %.

---

## 11. Commits

Six, dans l'ordre. **Rien n'est poussé.**

| Commit | Objet |
|---|---|
| `4adb83a` | `refactor(ui): strengthen Ombrair visual system` |
| `69bb5fa` | `feat(ui): redesign product catalogue and refine homepage art direction` |
| `37c6130` | `feat(ui): elevate application showcase and secondary pages` |
| `9bb4cee` | `refactor(app-ui): align demo with Ombrair visual language` |
| `ecb0a85` | `feat(ui): polish secondary pages and lift small type` |
| *(celui-ci)* | `docs(audit): document UI redesign results` |

L'identité Git existante n'a pas été modifiée.

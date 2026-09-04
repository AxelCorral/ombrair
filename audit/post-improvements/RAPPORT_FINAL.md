# Rapport final — passe d'amélioration Ombrair

*Consigné ici parce que le PC est éteint à la fin de la mission : le
terminal ne sera plus lisible.*

---

## Commits

Six, dans l'ordre. **Rien n'est poussé.**

| Commit | Objet |
|---|---|
| `5d46f38` | `fix(site): resolve navigation and accessibility blockers` |
| `dc8e115` | `refactor(products): clarify Ombrair commercial offers` |
| `d3b62da` | `refactor(home): improve hero and use-case hierarchy` |
| `5b66905` | `refactor(app): simplify rooms and surface device issues` |
| `0f41d70` | `chore(ui): complete post-audit polish` |
| `720b516` | `docs(audit): document post-improvement status` |

Les incréments P2 et P3 ont atterri dans le même commit (`dc8e115`) : la
refonte des pages produit dépendait du nouveau modèle commercial, les
séparer aurait donné un commit intermédiaire qui ne compile pas
proprement.

## Corrections P0 / P1

- **UX-001** — `/simulateur` n'est plus une 404 : la page est construite.
- **CONTENT-001** — la FAQ décrit ce que le simulateur fait réellement.
- **RESP-001** — header basculé à `lg:` ; plus aucun débordement.
- **A11Y-001 / A11Y-002** — contrastes thermiques résolus sans toucher à la
  charte.
- **UI-001** — hero visuel sur les trois pages produit.
- **UX-002** — Ombrair Link nommé et expliqué.

## Changements commerciaux

**Capteur** → **Kit Capteur Ombrair**. « Capteur — 349 € » se lisait « un
capteur coûte 349 € » ; un champ `resume` dit désormais sous chaque prix ce
que le montant couvre.

**Fenêtre** — `prixBase` passe à `null` (fenêtre seule sur devis). Les
1 590 € couvrent fenêtre **et** volet et vivent dans `prixEnsemble`, avec
leur intitulé propre. Aucun montant créé ni supprimé.

**Ombrair Link** — un nom unique partout, et un bloc d'explication sur la
page où on l'achète : trois rôles, la chaîne complète, et le fait que ce
n'est pas un boîtier de plus à côté du routeur.

## Pages produit

| Avant | Après |
|---|---|
| Titre, prix, puis « Qui conçoit, qui fabrique » | Hero deux colonnes, visuel cadré en arche |
| Aucun visuel du produit | Illustration existante réutilisée |
| Prix jusqu'à 4 fois | Une fois en tête ; les autres montants sont des tarifs différents |
| « Compatibilité » avec une phrase sous un H2 | Fusionnée avec « Dimensions » |
| Fabrication en 2ᵉ position | En 6ᵉ, intégralement conservée |

## Homepage

Hero démarrant à 09:30 au lieu de minuit · boucle d'animation suspendue
hors écran · témoignages devenus cas d'usage · navigation à 15 px ·
phrase d'accroche nommant les quatre éléments du produit.

## Application

Écran Pièces réorganisé par pièce · bloc « n équipements à vérifier »
dérivé des données · divulgation progressive sur les cartes d'ouvrant ·
seuils de batterie unifiés et nommés.

## Accessibilité — ratios finaux

Mesurés par échantillonnage des pixels rendus, seuil AA = 4,5.

| Élément | Avant | Après (clair) | Après (nuit) |
|---|---|---|---|
| Température extérieure | 2,74 | **5,00** | **7,82** |
| Température intérieure | 3,55 | **5,22** | **8,66** |
| Bandeau d'alerte, titre | 3,18 | **5,08** | **14,01** |
| Braise sur carte sombre | 2,48 | — | **6,06** |
| Texte secondaire du site | 2,80 | **4,76** | **6,38** |
| Liens de navigation | 3,69 | **5,83** | **11,71** |

Les 14 points de mesure passent AA dans les deux thèmes. Clavier : 0
élément sans anneau de focus, 0 sans nom accessible. `prefers-reduced-motion`
fige bien le hero.

## Responsive

360 · 390 · 414 · 740 · 768 · 800 · 900 · 1024 · 1280 · 1440 · 1920.

**26 routes × 11 largeurs × 2 thèmes = 572 vérifications.** Zéro
débordement, zéro statut non-200, zéro erreur console.

## Findings

| État | Nombre |
|---|---|
| Résolus | 17 |
| Partiellement résolus | 3 |
| Non traité | 1 |
| Rejetés (argumentés) | 3 |

Plus les 6 problèmes de la seconde revue, tous résolus, et 3 découverts
pendant la passe.

## Build

- `npm run lint` — propre, 0 erreur, 0 avertissement
- `npm test` — **87 tests, 25 suites, 0 échec** (54 au départ)
- `npm run build` — **36 pages statiques**, compilation réussie

## Screenshots

15 dans `audit/post-improvements/` : accueil (desktop jour/nuit, mobile,
tablette 768), gammes, les trois pages produit, simulateur, ressources,
app accueil et pièces en jour et nuit.

---

## Limites restantes

- **Aucune donnée analytique.** Pas de trafic, pas de conversion, pas de
  test utilisateur. UI-005 (longueur de l'accueil) reste sans réponse
  fondée pour cette raison.
- **Aucune mesure de performance.** La suspension de la boucle du hero est
  vérifiée par comportement observé, pas par gain chiffré.
- **Aucun test avec lecteur d'écran.**
- **Un seul navigateur** — Chromium headless.
- **UX-003** — l'URL `/gammes` porte encore l'ancien vocabulaire. Écarté
  sur consigne ; à reprendre si le site est publié.
- **L'arche** ne vit pas dans le hero ni dans l'application. Choix assumé :
  la consigne interdisait de la répéter par principe.

## Note de méthode

Deux fois, le script lisant les couleurs *calculées* a produit des ratios
absurdes (1,00 ; 1,63) sur des textes lisibles — alpha non composé, puis
`oklch()` non résolu. Seul l'échantillonnage des **pixels réellement
rendus** est fiable. C'est cette méthode qui a révélé le défaut de
`--muted-foreground` que l'audit avait manqué, et c'est elle qui avait
déjà disqualifié un faux positif pendant l'audit initial.

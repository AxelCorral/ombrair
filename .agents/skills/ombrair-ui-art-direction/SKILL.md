---
name: ombrair-ui-art-direction
description: Direction artistique Ombrair — contrainte de marque supérieure pour toute tâche UI, design system, illustration ou polish visuel sur ce dépôt. À relire au début de chaque phase de refonte.
---

# Ombrair — direction artistique

Source de vérité : `Ombrair - Identité concept 07-selection.png` (concept 07,
« arche méditerranéenne »), `docs/brand.md`, `app/globals.css`.

> « Une arche, trois lames, un mot en bas de casse :
> l'ombre choisie plutôt que subie. »

Cette skill prime sur les goûts génériques de toute skill externe.
Aucune skill tierce ne réinvente la palette, le logo ou le ton visuel.

---

## Positionnement esthétique

Architecture méditerranéenne · menuiserie contemporaine · hardware ·
lumière filtrée · ombre · air · précision technique · calme ·
produit physique premium.

Ombrair vend des **objets** : capteurs, Ombrair Link, volets, fenêtres,
installation. L'interface doit ressembler à un catalogue d'architecture
contemporaine et à un panneau de contrôle précis — pas à une landing SaaS.

Le repère : **ARCHITECTURE + PRODUIT + LUMIÈRE + TYPOGRAPHIE + ESPACE**,
davantage que grille + cartes + icônes.

---

## Palette

| Rôle | Token | Hex |
|---|---|---|
| Encre / action / fond sombre de section | Persienne | `#33665a` |
| Fond nuit | Nuit | `#161d23` |
| Fond jour | Chaux | `#f4f1e9` |
| **Thermique froid uniquement** | Fraîche | `#2e8c8c` |
| **Thermique chaud uniquement** | Ambre | `#c4862f` |
| **Alerte réelle uniquement** | Braise | `#c4402a` |

La majorité du design vit avec **Chaux + Persienne + Nuit**.

Fraîche et Ambre n'existent que pour encoder une température, un flux d'air
ou un état thermique. Jamais pour « égayer » un bouton, un fond, un badge.

Texte : n'utiliser que les variantes `--color-etat-froid-texte`,
`--color-etat-chaud-texte`, `--color-alerte-texte` (AA vérifié).
Le signal brut (`--color-etat-froid`/`-chaud`) reste pour traits, pastilles,
courbes, icônes. **La couleur n'est jamais le seul canal.**

Aucune couleur en dur : tout passe par `app/globals.css`.

---

## Typographie

- **Outfit** — display et titres. Logotype toujours en bas de casse.
- **Instrument Sans** — corps.
- **IBM Plex Mono** — données uniquement : température, prix, heure,
  dimensions, pourcentages, références.

Il faut un vrai écart entre display / heading / body / supporting /
caption / technical data. Public 35–65 ans non technicien : pas de
microtexte. Ne pas grossir aveuglément — creuser le contraste.

---

## Signature

- **L'arche** = ouverture, cadrage produit, embrasure. Elle encadre quelque
  chose. Rayon haut = demi-largeur, base à angles adoucis (5 px).
- **Les lames** = quand elles ont un sens architectural (volet, masque de
  lumière, transition). Trois lames, la troisième plus sourde.
- **Lumière et ombre** comme matière graphique, produites par une géométrie,
  jamais par un `box-shadow` flou.
- **Le produit réel visible.**

Illustrations : vectoriel, plat, architectural, line art, précis, peu de
couleurs. Famille unique dans `components/product-visuals/`.

---

## Interdits

SaaS générique · purple gradient · glassmorphism · pill radius ·
grosse ombre marketing · cartes partout · blobs 3D · faux visuels stock ·
arches répétées comme décoration · couleurs Fraîche/Ambre décoratives ·
trois lames arbitraires en haut d'une carte (ça ressemble à un skeleton) ·
bento grid gratuite · glow · icône Lucide dans un cercle coloré par feature ·
scroll-jacking · parallax.

Radius unique **5 px**. Pas de pill, pas de shadow, pas de gradient.

---

## Règles de composition

- Une bordure signifie : limite interactive, regroupement réel, structure.
  Pas « voici un bloc ».
- Distinguer les niveaux de surface par la **valeur de fond, la bordure et
  l'espace** — jamais par une ombre.
- Distinguer l'espace *entre deux informations liées* de l'espace *entre deux
  chapitres*. Rythme éditorial.
- Bon espace négatif = composition volontaire. Mauvais vide = une moitié de
  page sans fonction. Garder le premier, corriger le second.
- Micro-interactions 200–500 ms, utiles seulement, `prefers-reduced-motion`
  respecté. Pas de spring rebondissant.

---

## Tests à passer avant de valider une page

1. **Sans logo** — l'interface évoque-t-elle encore ouverture, lumière,
   lames, architecture, précision ?
2. **Pas une landing SaaS** — pas d'empilement pricing cards / feature cards
   / CTA box / témoignages.
3. **Objet physique** — page Capteur : on voit le capteur. Volet : un volet.
   Fenêtre : une fenêtre. Application : l'application. Pro : un parc.
4. **Lisibilité à 100 %** sur un écran 1440 px, pas zoomé.
5. **Jour et nuit conçus ensemble**, jamais une inversion après coup.

---

## Ne pas régresser

Tokens centralisés · zéro couleur hardcodée · données centralisées
(`lib/tarifs.ts`, `lib/mock/*`) · cohérence inter-écrans de l'app ·
87 tests · build propre · thème partagé site/app · reduced motion ·
contrastes AA mesurés au pixel.

Ne pas changer : modèle commercial, produits, tarifs, logique métier,
données mock, routes, parcours, structure fonctionnelle.

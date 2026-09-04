# Cohérence de marque

Référence : `docs/brand.md` et la planche
`Ombrair - Identité concept 07-selection.png` (« arche méditerranéenne »),
qui est la source de vérité déclarée du projet.

---

## Conformité — ce qui est tenu

### Palette

Les cinq couleurs de la planche sont définies une seule fois, dans
`app/globals.css`, aux valeurs exactes relevées :

| Token | Hex | Origine |
|---|---|---|
| `--color-persienne` | `#33665a` | hex imprimé sur la planche |
| `--color-nuit` | `#161d23` | hex imprimé |
| `--color-chaux` | `#f4f1e9` | hex imprimé |
| `--color-fraiche` | `#2e8c8c` | relevé au pixel (non légendé) |
| `--color-ambre` | `#c4862f` | relevé au pixel (non légendé) |

**Aucune couleur en dur** dans les composants — vérifié par recherche.
Seule exception, documentée dans `docs/brand.md` : `viewport.themeColor`
dans `app/layout.tsx`, qui est sérialisé en `<meta>` côté serveur et n'a
pas accès aux variables CSS.

### La règle thermique est respectée

Fraîche et Ambre sont réservées à l'information thermique : relevés de
température, courbes int/ext, soleil du visuel Volet, flux d'air du visuel
Fenêtre, états thermiques de l'app. **Aucun emploi décoratif relevé** — ni
bouton, ni fond de carte, ni accent gratuit.

C'est une règle facile à enfreindre et elle tient sur l'ensemble du site.

### Typographie

Outfit pour les titres et le logotype, Instrument Sans pour le corps, IBM
Plex Mono strictement limité aux données chiffrées. Le logotype est partout
en bas de casse, avec l'interlettrage prescrit.

### Logo

Point d'entrée unique : `components/brand/ombrair-logo.tsx`. Aucun composant
ne redessine le signe de son côté. La géométrie est **relevée sur la
planche, pas approximée** : ratio 4×5, lames à 65,4 % de largeur et 7,7 % de
hauteur, positions 41,5 / 58,5 / 75,4 %, troisième lame plus sourde. La
simplification à deux lames sous 26 px est automatique.

Présent au header (symbole seul sous 640 px), au footer, en tête de la démo
`/app`, dans la maquette de la bande écosystème, en favicon et en icône
d'application.

---

## Ce qui manque

### L'arche ne vit que dans trois cartes *(BRAND-001, moyen)*

L'arche est **la** signature du concept retenu. Dans le site livré, elle
n'apparaît que dans les trois cartes de la vitrine de l'accueil
(`product-showcase-card.tsx`, via un `border-radius` elliptique).

Elle est absente :

- du hero — pourtant l'endroit le plus visible du site, et le plus
  naturellement architectural : c'est déjà une fenêtre ;
- des trois pages produit, qui ne portent aucune marque visuelle ;
- de l'application, dont le chrome est générique ;
- des pages Ressources, Pro, Devis, Contact.

**Conséquence directe :** si l'on masque le logo, le site pourrait
appartenir à une autre marque. Palette et typographie sont conformes, mais
ce ne sont pas des éléments distinctifs — beaucoup de marques utilisent un
vert profond et une grotesque géométrique. Ce qui rendrait le site
spécifiquement Ombrair — l'arche, les lames, la lumière filtrée — n'irrigue
qu'une fraction d'une seule page.

### Le logo est une reconstruction *(BRAND-002, faible)*

Le SVG est fidèle aux mesures relevées, mais ce n'est pas le fichier
vectoriel d'origine — que la planche annonce elle-même comme « prochaine
étape ». Déjà documenté comme limite connue dans `docs/brand.md`, ce qui est
la bonne pratique. Repris ici pour que l'inventaire soit complet.

---

## Tension marque / accessibilité

Fraîche et Ambre sont, par règle, les porteuses de l'information thermique.
Elles sont aussi sous le seuil AA sur les fonds officiels :

| Couleur | Sur Chaux | Sur Nuit |
|---|---|---|
| Ambre `#c4862f` | **2,74** | — |
| Fraîche `#2e8c8c` | **3,55** | **4,25** |

Ce n'est pas un défaut d'implémentation : le code applique correctement la
charte. C'est une propriété des couleurs choisies. Voir
`AUDIT_ACCESSIBILITY.md` pour l'analyse et `AUDIT_PRIORITIES.md`,
chantier 2, pour la piste de résolution.

Ce point relève d'un arbitrage avec le responsable de la charte, pas d'une
correction technique unilatérale.

---

## Findings de ce domaine

BRAND-001 · BRAND-002 — et, par recoupement, A11Y-001 et A11Y-002.

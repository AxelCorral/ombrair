# Identité Ombrair — concept 07, « arche méditerranéenne »

Référence visuelle : `Ombrair - Identité concept 07-selection.png`, à la
racine du projet. **C'est la source de vérité.** En cas de contradiction
avec une décision graphique antérieure, la planche l'emporte.

> Une arche, trois lames, un mot en bas de casse : l'ombre choisie plutôt
> que subie.

---

## Logo

Composant unique : `components/brand/ombrair-logo.tsx`. **Aucun composant ne
redessine le signe de son côté.**

```tsx
<OmbrairLogo variant="horizontal" size="sm" className="text-primary" />
```

| Prop | Valeurs |
|---|---|
| `variant` | `horizontal` · `stacked` · `symbol` · `wordmark` |
| `size` | `xs` · `sm` · `md` · `lg` |
| `titre` | rend le logo comme image nommée ; sans lui il est décoratif |

La couleur est héritée (`currentColor`) : `text-primary` donne Persienne en
thème clair et Chaux en thème nuit, ce qui couvre les deux fonds officiels.

### Géométrie (relevée sur la planche, non approximée)

| Mesure | Valeur |
|---|---|
| Ratio du signe | **4 × 5** exactement (0,800 mesuré) |
| Arc | demi-cercle, rayon = demi-largeur |
| Angles bas | 5 px à l'échelle 100 % de la planche |
| Lames — largeur | 65,4 % de la largeur, centrées |
| Lames — hauteur | 7,7 % de la hauteur |
| Lames — position (bord haut) | 41,5 % · 58,5 % · 75,4 % |
| Troisième lame | plus sourde : Chaux mélangée à 45 % de Persienne (relevé `#9db3a9`) |

La troisième lame **n'est pas** de la même couleur que les deux autres.
C'est ce qui évoque la lame restée dans l'ombre.

### Règles

- Logotype **toujours en bas de casse**, Outfit Light 300, interlettrage +0,06 em.
- Trois lames au-dessus de 26 px, **deux en dessous** (`size="xs"` applique
  automatiquement la simplification).
- Zone de respiration : au minimum la largeur d'une lame autour du verrouillage.
- Aplats pleins. **Interdits** : dégradé, ombre portée, contour, rotation,
  étirement, capitales sur le logotype, recoloration en Fraîche ou Ambre.

### Où il est utilisé

Header (symbole seul sous 640 px), footer, en-tête de la démo `/app`,
maquette d'interface de la bande écosystème, favicon et icône d'application.

---

## Couleurs

Définies une seule fois, dans `app/globals.css`. Valeurs de la planche :
les trois premières sont les hex imprimés, les deux suivantes ont été
relevées sur leurs pastilles faute de légende.

| Token | Hex | Rôle |
|---|---|---|
| `--color-persienne` | `#33665a` | couleur principale de marque, action, encre |
| `--color-nuit` | `#161d23` | fond sombre, contraste fort |
| `--color-chaux` | `#f4f1e9` | fond clair principal |
| `--color-fraiche` | `#2e8c8c` | **thermique uniquement** — froid, ventilation favorable |
| `--color-ambre` | `#c4862f` | **thermique uniquement** — chaleur, soleil, exposition |
| `--color-braise` | `#c4402a` | alertes. *Ne figure pas dans la charte*, conservé pour l'app |

### Fraîche et Ambre — règle absolue

Ce sont des couleurs **sémantiques**, pas des couleurs de marque. Elles
n'apparaissent jamais dans le logo, ni comme couleur de bouton, ni comme
décor de carte.

Emplois légitimes actuels : relevés de température, courbes int/ext,
soleil du visuel Volet, flux d'air du visuel Fenêtre, états thermiques de
l'application.

Le site vit avec **Chaux, Persienne et Nuit**.

### Alias sémantiques

Les composants consomment les alias (`--background`, `--foreground`,
`--primary`, `--card`, `--border`, `--muted-foreground`…), jamais la palette
brute pour un rôle d'interface. Ces alias basculent seuls entre jour et nuit.

---

## Typographie

| Usage | Police |
|---|---|
| Logotype | Outfit Light 300, +0,06 em, bas de casse |
| Titres | Outfit Medium (`font-display`) |
| Corps de texte | Instrument Sans (`font-sans`) |
| Données techniques | IBM Plex Mono (`font-mono`) |

IBM Plex Mono est réservé aux **températures, heures, dimensions,
pourcentages, prix et références**. Jamais pour un paragraphe.

La charte ne définit pas de police de lecture : Instrument Sans est conservé
faute de prescription contraire.

---

## Géométrie et surfaces

- Rayon produit : **5 px** (`--radius`). Seule exception, l'arche.
- Bordures fines, contraste par surface, très peu d'ombres. Le design existe
  par la géométrie, la proportion et l'espace.
- L'arche sert de cadre architectural (cartes produit). Elle **ne se répète
  pas** derrière chaque bouton ou titre.

---

## Exception documentée

`app/layout.tsx` contient les deux seuls hex en dur du projet, dans
`viewport.themeColor`. Cette métadonnée est sérialisée côté serveur en
balise `<meta>` et n'a pas accès aux variables CSS. À tenir synchronisés
avec `--color-chaux` et `--color-nuit`.

---

## Limite connue

Le SVG du signe est une **reconstruction** fidèle aux mesures relevées sur
la planche, pas le fichier vectoriel d'origine — que la planche elle-même
annonce comme « prochaine étape ». Si ce fichier arrive, il remplace la
géométrie de `ombrair-logo.tsx` sans toucher au reste du code, puisque tous
les usages passent par ce composant.

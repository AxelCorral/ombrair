# Responsive

Méthode : Playwright headless, mesure de `document.documentElement.scrollWidth`
comparée à la largeur du viewport, sur les principales routes du site et
de l'application.

L'outillage Playwright a été installé **hors du projet**, dans le
scratchpad de session. Aucune dépendance de test visuel n'a été ajoutée au
dépôt.

---

## Résultats par largeur

| Viewport | Débordement | Verdict |
|---|---|---|
| 360 px | aucun | ✅ |
| 390 px | aucun | ✅ |
| 414 px | aucun | ✅ |
| **768 px** | **+18 px** | ❌ **RESP-001** |
| 1024 px | aucun | ✅ |
| 1280 px | aucun | ✅ |
| 1440 px | aucun | ✅ |
| 1920 px | aucun | ✅ |

Un seul défaut, à une seule largeur. C'est un résultat très propre.

---

## RESP-001 — débordement de 18 px à 768 px

**Fait mesuré.** À exactement 768 px de large, `scrollWidth` vaut 786 px.
Reproduit sur `/`, `/gammes`, `/gammes/volet` et `/devis` — donc sur toutes
les pages, puisque la cause est dans le header.

**Cause identifiée.** `components/site/header.tsx` porte la classe
`hidden items-center gap-2 md:flex` sur son bloc de navigation. Le
`breakpoint` Tailwind `md` vaut 768 px : la navigation desktop s'affiche
donc **à partir de** 768 px inclus. À cette largeur exacte, les six entrées
de menu, le logo et les actions ne tiennent pas ensemble — il manque 18 px.

Le contenu passe en disposition desktop un cran trop tôt.

**Captures.** `issue-RESP-001-home-768.png`,
`issue-RESP-001-gammes-768.png`, `issue-RESP-001-devis-768.png`.

**Pourquoi c'est important.** 768 px est la largeur portrait d'un iPad et
d'une grande partie des tablettes Android. Ce n'est pas une largeur
marginale.

**Piste de correction** (non appliquée) : faire basculer le header à `lg:`
au lieu de `md:`, ce qui laisse la disposition mobile jusqu'à 1024 px.
Effort XS. À vérifier ensuite qu'aucun autre bloc ne dépendait de ce même
point de bascule.

---

## Comportement mobile

Vérifié sur `home-mobile-jour`, `gammes-mobile-jour`, `devis-mobile-jour`,
`produit-capteur-mobile-jour` et les neuf captures de l'application.

- Le header bascule en menu compact, le logo passe au symbole seul sous
  640 px comme le prescrit la charte.
- Les grilles produit passent en colonne unique sans casse.
- Les tableaux tarifaires restent lisibles.
- Le hero conserve son animation et ses commandes.
- L'application est conçue pour le mobile d'abord — c'est son format
  naturel — et les neuf écrans y sont corrects.

**Un point de vigilance non chiffré** : la page d'accueil mesure 9 851 px
de haut à 360 px de large *(UI-005)*. Ce n'est pas un défaut responsive au
sens strict — rien ne casse — mais c'est une conséquence directe du passage
en colonne unique.

---

## Large

De 1440 à 1920 px, le contenu reste contenu dans une largeur maximale et se
centre. Pas de ligne de texte qui s'étire au-delà du confortable, pas de
zones vides disgracieuses. Rien à signaler.

---

## Finding de ce domaine

RESP-001 — unique.

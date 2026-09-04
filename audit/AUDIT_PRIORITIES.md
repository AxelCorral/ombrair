# Priorités

Classement des 24 findings. **Aucune correction n'a été appliquée** :
ce document propose un ordre, il ne constate pas un travail fait.

Les estimations d'effort sont des ordres de grandeur de développement
front, hors relecture et validation.

---

## Top 10 — par impact décroissant

| # | ID | Problème | Sév. | Effort | Pourquoi si haut |
|---|---|---|---|---|---|
| 1 | UX-001 | `/simulateur` → 404 depuis le menu et le footer | critique | XS | Une 404 atteignable en un clic depuis **toutes** les pages détruit la confiance plus vite que n'importe quel défaut esthétique |
| 2 | CONTENT-001 | La FAQ renvoie au même simulateur inexistant | élevée | XS | Elle apparaît sur la question du prix, au moment précis de l'intention d'achat |
| 3 | RESP-001 | Débordement horizontal de 18 px à 768 px | élevée | XS | Largeur de tablette courante ; le défaut est visible et mesuré, la cause est identifiée |
| 4 | A11Y-001 | Ambre / Chaux à 2,74 | élevée | S | Sous AA même en grand texte, et porte l'information centrale du produit : la température |
| 5 | UI-001 | Les pages produit ne montrent pas le produit | élevée | M | Trois pages de texte là où l'acheteur veut voir ; les visuels existent déjà |
| 6 | UX-002 | « Ombrair Link » jamais expliqué | élevée | S | Un nom de produit apparaît deux fois sans définition, et double « passerelle » |
| 7 | A11Y-002 | Fraîche sous AA sur les deux fonds | moyenne | S | Même conflit marque/lisibilité qu'A11Y-001, sur l'autre pôle thermique |
| 8 | BRAND-001 | L'arche ne vit que dans trois cartes | moyenne | M | La signature visuelle n'irrigue ni le hero, ni les pages produit, ni l'app |
| 9 | UI-002 | Prix répété jusqu'à 4× par page | moyenne | S | Insistance qui se lit comme de la pression commerciale |
| 10 | UX-004 | Aucune page ne présente l'écosystème technique | moyenne | M | Cause profonde d'UX-002 : il manque le lieu où l'expliquer |

---

## Quick wins — fort effet, effort XS

Neuf findings à effort XS. Six d'entre eux sont de vraies opportunités
immédiates :

| ID | Action proposée | Effet attendu |
|---|---|---|
| UX-001 | Créer la page, ou retirer le lien des deux menus | Supprime la seule 404 du site |
| CONTENT-001 | Aligner la réponse FAQ sur la décision prise pour UX-001 | Supprime une promesse non tenue |
| RESP-001 | Décaler le point de bascule du header d'un cran (`md:` → `lg:`) | Supprime le seul défaut responsive mesuré |
| A11Y-003 | Renforcer le texte du bandeau d'alerte de l'app | 3,18 → conforme, sur un composant unique |
| A11Y-004 | Titres de colonnes du footer en H3 (ou `<p>` stylé) | Corrige la hiérarchie de titres de toutes les pages |
| A11Y-005 | Différencier le nom accessible des deux boutons de thème | Lève une ambiguïté pour la navigation vocale |

Les trois autres XS (UI-003, UI-007, TECH-002) sont des ajustements de
confort, sans urgence.

---

## Chantiers structurels

Quatre sujets qui ne se traitent pas par retouche ponctuelle.

**1. Le simulateur (UX-001 + CONTENT-001).**
La vraie question n'est pas technique mais produit : ce simulateur
doit-il exister ? Il est annoncé à deux endroits, jamais construit. Deux
sorties honnêtes — le construire, ou retirer les deux mentions. La
troisième option, laisser un lien mort, n'en est pas une.

**2. Le conflit marque / accessibilité (A11Y-001 + A11Y-002).**
Fraîche et Ambre sont, par règle de charte, les porteuses de
l'information thermique. Elles sont aussi trop claires pour du petit
texte sur Chaux. Modifier les hex de la charte règle le contraste et
casse l'identité. La piste à explorer est la **dissociation** : la
couleur porte le signal (icône, pastille, trait de courbe), un token
lisible porte le chiffre. À arbitrer avec le responsable de la charte,
pas unilatéralement.

**3. Les pages produit (UI-001 + UI-002 + UI-003 + BRAND-001).**
Ces quatre findings décrivent le même écart : la vitrine de l'accueil
est aboutie, les pages produit sont restées des gabarits textuels. Le
traitement est commun — y amener les visuels existants, le cadrage en
arche, et respirer la répétition des prix — et gagne à être fait en un
seul passage plutôt qu'en quatre retouches.

**4. La longueur de l'accueil (UI-005, effort L).**
9 851 px en mobile, sans repère de progression, la vitrine produits en
quatrième position. Toucher à cet ordre engage la stratégie éditoriale
de la page ; c'est le seul finding que je recommande de **ne pas
traiter sans donnée**. Or aucune donnée analytique n'est disponible.

---

## Polish

À traiter quand le reste est réglé, sans arbitrage lourd :

- **APP-001 / APP-002** — deux écrans de l'app moins denses que les autres.
- **UX-003** — l'URL `/gammes` ne correspond plus au libellé « Produits ».
  Changer une URL a un coût (liens, redirections) sans gain visible pour
  l'utilisateur ; à évaluer en connaissance de cause.
- **CONTENT-002** — terminologie flottante entre « gamme », « produit »,
  « offre ». Un choix, puis une passe.
- **UI-004** — la page Ressources manque de repères de lecture.
- **BRAND-002** — le logo reste une reconstruction ; déjà documenté comme
  limite connue dans `docs/brand.md`.
- **TECH-001 / TECH-002** — boucle d'animation permanente du hero,
  visuels produit non exposés comme ensemble réutilisable.

---

## Matrice impact / effort

Impact = sévérité pondérée par le nombre de routes touchées.

```
      IMPACT
      ▲
ÉLEVÉ │  UX-001  CONTENT-001        UI-001
      │  RESP-001                   UX-004
      │  A11Y-001  UX-002           BRAND-001
      │
MOYEN │  A11Y-003  A11Y-004         UI-002        UI-005
      │  A11Y-005                   A11Y-002
      │                             UI-004
      │
FAIBLE│  UI-003  UI-007             APP-001  UX-003
      │  TECH-002                   APP-002  BRAND-002
      │                             CONTENT-002  TECH-001
      └──────────────────────────────────────────────────▶
           XS                    S / M              L
                                                   EFFORT
```

**Coin haut-gauche** — impact élevé, effort minimal : UX-001, CONTENT-001,
RESP-001. Trois corrections courtes qui traitent la 404, la promesse non
tenue et le seul défaut responsive. C'est là que se trouve le meilleur
rapport effet/coût du dossier.

**Coin bas-droit** — UI-005 seul. Fort coût, bénéfice non démontrable
sans mesure. À laisser en dernier.

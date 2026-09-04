# Composants et design system

**44 composants** `.tsx`, dont **23 fichiers** portent `"use client"`
(composants et pages confondus). Le reste est rendu côté serveur.

---

## Organisation

```
components/
├── brand/            1  — ombrair-logo.tsx (point d'entrée unique du signe)
├── ui/               1  — button.tsx (shadcn, style base-nova)
├── shared/           4  — lame, hypotheses, theme-provider, theme-toggle
├── site/            16  — header, footer, hero-volet, page-gamme,
│                          product-showcase-card, pricing-card,
│                          compat-checker, selecteur-dimensions,
│                          schema-journee, bande-ecosysteme, devis-form,
│                          formulaire-contact, faq-liste, phone-frame,
│                          etapes-installation, temoignage-card
├── hero/             5  — day-sky, sun-moon, shutter, hero-controls,
│                          live-measurements
├── product-visuals/  3  — sensor-visual, shutter-visual, window-visual
├── app-demo/         4  — etat-provider, bottom-nav, capteur-card, ouvrant-card
└── presentation/     2 + slides/
```

Le découpage est lisible et suit l'usage, pas une taxonomie abstraite. Un
lecteur qui arrive sur le dépôt trouve où regarder.

---

## Système de tokens

Trois couches, dans `app/globals.css` :

1. **Palette brute** — `--color-persienne`, `--color-nuit`, `--color-chaux`,
   `--color-fraiche`, `--color-ambre`, `--color-braise`.
2. **Alias sémantiques shadcn** — `--background`, `--foreground`,
   `--primary`, `--card`, `--border`, `--muted-foreground`… Ils basculent
   seuls entre jour et nuit via le bloc `.dark`.
3. **Tokens produit** — notamment les `--ciel-*`, documentés comme décrivant
   un **moment de la journée**, pas une température. La distinction est
   écrite dans le fichier, ce qui évite qu'un futur contributeur les
   confonde avec les couleurs thermiques.

**Les composants consomment les alias, jamais la palette brute pour un rôle
d'interface.** Vérifié : aucune couleur en dur hors l'exception documentée
de `viewport.themeColor`.

Rayon unique à **5 px** (`--radius`), conforme à la charte. Seule exception,
l'arche de `product-showcase-card.tsx`.

---

## Source unique de vérité — le point fort de l'architecture

Le projet applique systématiquement le principe « une donnée, un fichier » :

| Domaine | Fichier | Consommé par |
|---|---|---|
| Tarifs | `lib/tarifs.ts` | pages produit, `/gammes`, devis, présentation |
| Événements de l'app | `lib/mock/evenements.ts` | dernière action, historique, notifications |
| Relevés | `lib/mock/releves.ts` | courbes de l'app **et** schéma de journée du site |
| Scénario | `lib/mock/scenario.ts` | instant de référence commun site/app |
| Logement | `lib/mock/logement.ts` | pièces, ouvrants, capteurs |
| Programmes | `lib/mock/programmes.ts` | écran programmes |
| Articles | `lib/content/ressources.ts` | index et pages article |
| Diapositives | `lib/presentation/slides.ts` | `/presentation` |
| Logo | `components/brand/ombrair-logo.tsx` | header, footer, app, favicon |

C'est ce qui explique la cohérence inter-écrans constatée dans
`AUDIT_APP.md`. Ce n'est pas un heureux hasard, c'est une conséquence de
structure.

---

## Logique métier isolée et testée

`lib/demo/day-cycle.ts` et `lib/demo/shutter.ts` sont des **fonctions
pures**, sans dépendance à React. Chacune a son fichier de test à côté.

**54 tests, 16 suites, tous au vert**, exécutés par le runner natif de
Node (`node --test`) sur TypeScript directement — aucune dépendance de test
n'a été ajoutée au projet.

Une remarque de méthode : ces tests ont trouvé un vrai bug pendant le
développement (le soleil et la lune étaient tous deux « visibles » à
exactement 06:30 et 21:00, faute de bornes strictes). Une suite de tests qui
attrape un défaut réel a payé son coût.

Point d'honnêteté relevé dans le code : `tauxOuverture` est documenté comme
un **indicateur d'interface**, pas comme une grandeur physique. Le
commentaire évite qu'on lui prête plus de sens qu'il n'en a.

---

## Dépendances

Volontairement minces : `next` (15.5.23, **délibérément maintenu en 15**),
`react` 19, `tailwindcss` v4, `recharts`, `lucide-react`, `@base-ui/react`
via shadcn (style `base-nova`).

**`framer-motion` n'est pas installé**, contrairement à ce que supposait le
brief initial. Toutes les animations — hero compris — sont en CSS et
`requestAnimationFrame`. C'est un choix qui tient : le hero, qui est
l'animation la plus exigeante du site, fonctionne sans bibliothèque.

---

## Points à surveiller

### TECH-001 (moyen) — boucle d'animation permanente du hero

Le hero maintient une boucle `requestAnimationFrame` en continu sur la page
d'accueil. Elle est déjà limitée à une mise à jour par minute simulée, ce
qui borne le travail par frame. Mais la boucle ne s'interrompt pas quand le
hero sort du champ de vision, ni quand l'onglet passe en arrière-plan.

Sur une page de 9 851 px en mobile, l'utilisateur passe l'essentiel de sa
visite loin du hero, moteur toujours actif.

> Confiance moyenne : **aucune mesure de performance n'a été faite**. Pas de
> profil CPU, pas de relevé de batterie, pas de Lighthouse. C'est un constat
> de code, pas un problème mesuré.

### TECH-002 (faible) — visuels produit non exposés comme un ensemble

`sensor-visual`, `shutter-visual` et `window-visual` forment une collection
cohérente mais s'importent un par un. Rien ne les relie dans le code — pas
d'index, pas de type commun, pas de correspondance déclarée avec les
identifiants produit de `lib/tarifs.ts`.

C'est une des raisons pour lesquelles ils n'ont pas suivi jusqu'aux pages
produit *(UI-001)* : il n'existe pas de « donne-moi le visuel de ce
produit ».

---

## Findings de ce domaine

TECH-001 · TECH-002 — et, par recoupement, UI-001 et BRAND-001.

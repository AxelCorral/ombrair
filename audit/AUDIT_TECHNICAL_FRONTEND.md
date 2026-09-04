# Front-end — état technique

Relevé sur `master` @ `dc757ab`, arbre de travail propre.

---

## Contrôles automatiques

| Contrôle | Commande | Résultat |
|---|---|---|
| Lint | `npm run lint` | ✅ **aucune erreur, aucun avertissement** |
| Types | inclus au build | ✅ TypeScript strict, propre |
| Tests | `node --test` | ✅ **54 tests, 16 suites, 0 échec** |
| Build | `npm run build` | ✅ **35 pages statiques générées** |
| Console navigateur | 32 captures Playwright | ✅ **aucune erreur, aucun avertissement** |

Cinq contrôles, cinq au vert. C'est un socle sain.

---

## Pile

- **Next.js 15.5.23**, App Router. Version 15 **délibérément maintenue** :
  `create-next-app` installe Next 16, qui a été rétrogradé au moment du
  socle.
- **React 19**, TypeScript strict.
- **Tailwind CSS v4**.
- **shadcn/ui**, style `base-nova`, bâti sur `@base-ui/react` — pas sur
  Radix.
- **recharts** pour les courbes, **lucide-react** pour les icônes.
- **Aucune bibliothèque d'animation.** `framer-motion` n'est pas installé,
  contrairement à ce que supposait le brief initial. Tout est en CSS et
  `requestAnimationFrame`.
- **Aucune dépendance de test** : le runner natif de Node exécute
  directement le TypeScript (`allowImportingTsExtensions` activé dans
  `tsconfig`).

L'outillage Playwright utilisé pour cet audit a été installé **hors du
dépôt**, dans le scratchpad de session. Il n'apparaît ni dans
`package.json`, ni dans `git status`.

---

## Rendu

23 fichiers portent `"use client"` sur 44 composants plus les pages. Le
reste est rendu côté serveur. Le découpage suit l'interactivité réelle —
hero, commandes, formulaires, fournisseurs d'état, bascule de thème — sans
« use client » posé par confort en haut d'un arbre entier.

**35 pages statiques** au build, dont les 4 articles générés depuis
`lib/content/ressources.ts`. Le site est intégralement pré-rendu.

---

## Thème

`prefers-color-scheme` comme valeur par défaut, choix explicite mémorisé en
`localStorage`, script inline anti-flash dans le `<head>` et
`suppressHydrationWarning` là où c'est nécessaire. Aucun clignotement
observé au chargement.

Le thème est partagé entre le site public et la démo applicative.

---

## Animations

Le hero pilote une horloge de simulation par `requestAnimationFrame`,
**limitée à une mise à jour par minute simulée**. Cette limitation est le
bon réflexe : elle borne le travail par frame indépendamment de la
fréquence d'affichage.

`prefers-reduced-motion` neutralise à la fois `animation` et `transition`.

### TECH-001 (moyen, confiance moyenne)

La boucle ne s'arrête pas quand le hero sort du champ de vision, ni quand
l'onglet passe en arrière-plan. Sur une page d'accueil de 9 851 px en
mobile, l'utilisateur passe l'essentiel de sa visite hors du hero, moteur
toujours actif.

> ⚠️ **Aucune mesure de performance n'a été effectuée** : pas de profil CPU,
> pas de relevé de consommation, pas de rapport Lighthouse. C'est un constat
> de lecture de code, pas un problème mesuré. La sévérité « moyenne » et la
> confiance « moyenne » reflètent cette incertitude.

Piste non appliquée : suspendre la boucle via un `IntersectionObserver` et
l'événement `visibilitychange`.

### TECH-002 (faible)

Les trois visuels produit ne sont pas exposés comme un ensemble : pas
d'index, pas de type commun, pas de correspondance déclarée avec les
identifiants de `lib/tarifs.ts`. Détail dans
`AUDIT_COMPONENTS_AND_DESIGN_SYSTEM.md`.

---

## Ce qui n'a pas été évalué

Déclaré explicitement pour que le lecteur ne surinterprète pas ce dossier :

- **Aucune mesure de performance réelle** — pas de Lighthouse, pas de Core
  Web Vitals, pas de poids de bundle relevé.
- **Aucun test sur navigateur réel** — tout est passé par Chromium headless.
  Safari et Firefox n'ont pas été vérifiés.
- **Aucun test avec lecteur d'écran**.
- **Aucune donnée analytique** — le site n'a ni trafic, ni instrumentation.
- **Aucune vérification de sécurité** — hors périmètre de cet audit.

---

## Findings de ce domaine

TECH-001 · TECH-002.

# Audit UI / UX — Ombrair

| | |
|---|---|
| **Date** | 25 août 2026 |
| **Branche** | `master` |
| **Commit audité** | `dc757ab` |
| **État du dépôt** | propre au moment du relevé |
| **Nature** | observation et documentation **uniquement** |

> **Aucun fichier du site n'a été modifié.** Aucun problème identifié n'a été
> corrigé, y compris ceux dont la correction tient en une ligne. Tout ce
> dossier décrit l'état existant ; les pistes de correction évoquées sont
> des propositions, jamais des travaux réalisés.

---

## Résumé quantitatif

**24 findings**

| Sévérité | Nombre | | Priorité | Nombre | | Effort | Nombre |
|---|---|---|---|---|---|---|---|
| critique | 1 | | P0 | 2 | | XS | 9 |
| élevée | 5 | | P1 | 5 | | S | 10 |
| moyenne | 9 | | P2 | 8 | | M | 4 |
| faible | 9 | | P3 | 9 | | L | 1 |

**Par domaine** : UI 6 · Accessibilité 5 · UX 4 · Contenu 2 · Marque 2 ·
Application 2 · Technique 2 · Responsive 1.

**Contrôles automatiques** : lint propre · 54 tests / 16 suites au vert ·
build réussi, 35 pages statiques · aucune erreur console sur 32 captures.

**Périmètre couvert** : 27 routes vérifiées (dont une en 404), 35 captures,
8 largeurs de viewport, 2 thèmes.

---

## Le résultat en une phrase

Un site techniquement sain et visuellement abouti sur ses points hauts,
gâché par un lien de menu qui mène à une 404 depuis toutes les pages, et
déséquilibré entre une page d'accueil très soignée et des pages produit
restées austères.

---

## Ordre de lecture recommandé

**Si vous avez 5 minutes**
1. Ce fichier.
2. `AUDIT_EXECUTIVE_SUMMARY.md` — forces, faiblesses, impression par domaine.

**Si vous avez 20 minutes**
3. `AUDIT_PRIORITIES.md` — Top 10, quick wins, chantiers, matrice
   impact/effort.
4. Les sept captures listées en fin de `AUDIT_SCREENSHOTS.md`.

**Si vous devez agir**
5. `findings.json` — les 24 findings au format exploitable.
6. Le rapport thématique du domaine qui vous concerne.

**Si vous êtes une IA ou une personne sans accès au dépôt**
→ `AUDIT_CONTEXT_FOR_EXTERNAL_REVIEW.md` **d'abord**. Il est autonome :
il décrit le projet, les produits, les routes, l'identité et les interfaces
sans supposer l'accès au code.

---

## Contenu du dossier

| Fichier | Contenu |
|---|---|
| `AUDIT_INDEX.md` | Ce point d'entrée |
| `AUDIT_CONTEXT_FOR_EXTERNAL_REVIEW.md` | Dossier autonome pour un relecteur externe |
| `AUDIT_EXECUTIVE_SUMMARY.md` | Synthèse : 5 forces, 10 faiblesses, par domaine |
| `AUDIT_PRIORITIES.md` | Top 10, quick wins, chantiers, matrice |
| `findings.json` | Les 24 findings, format structuré |
| `AUDIT_ROUTE_INVENTORY.md` | 27 routes, statuts HTTP, liens de navigation |
| `AUDIT_VISUAL_UI.md` | Mise en page, densité, thème nuit |
| `AUDIT_UX.md` | Six parcours testés, navigation, hiérarchie |
| `AUDIT_BRAND_CONSISTENCY.md` | Conformité à la charte, absence de l'arche |
| `AUDIT_RESPONSIVE.md` | 8 largeurs, un seul défaut |
| `AUDIT_ACCESSIBILITY.md` | Contrastes mesurés, titres, clavier, mouvement |
| `AUDIT_CONTENT.md` | Discours, honnêteté, terminologie |
| `AUDIT_COMPONENTS_AND_DESIGN_SYSTEM.md` | 44 composants, tokens, sources uniques |
| `AUDIT_APP.md` | Les 9 écrans de la démo applicative |
| `AUDIT_TECHNICAL_FRONTEND.md` | Pile, build, rendu, animations |
| `AUDIT_SCREENSHOTS.md` | Les 35 captures, indexées |
| `screenshots/` | Les images |

---

## Ce que cet audit n'affirme pas

Déclaré explicitement pour que rien ne soit surinterprété.

**Aucune donnée analytique n'est disponible.** Pas de trafic, pas de taux de
conversion, pas d'utilisateur réel, pas de session enregistrée, pas de test
utilisateur. Tous les jugements UX sont des **interprétations d'expert**.
Chaque finding porte un champ `confidence` qui distingue ce qui est mesuré
de ce qui est estimé.

**Aucune mesure de performance.** Pas de Lighthouse, pas de Core Web Vitals,
pas de profil CPU, pas de poids de bundle. TECH-001 est un constat de
lecture de code, pas un problème chiffré.

**Aucun test avec lecteur d'écran** (NVDA, VoiceOver). Les constats
d'accessibilité portent sur le DOM et sur des mesures automatisées.

**Un seul navigateur.** Chromium headless. Safari et Firefox n'ont pas été
vérifiés.

**Un faux positif a été écarté avant publication.** Le script de contraste
a d'abord signalé les liens de navigation en thème nuit à un ratio de 1,19 —
ce qui aurait été majeur. L'échantillonnage direct des pixels rendus donne
**8,93** : le script mésinterprétait des couleurs à canal alpha. Le finding
a été supprimé et non publié. Il est mentionné parce qu'un audit doit dire
ce qu'il a failli affirmer à tort.

**Numérotation.** Les identifiants UI vont de 001 à 005 puis 007 ; UI-006
n'est attribué à aucun finding retenu. Le total reste de 24.

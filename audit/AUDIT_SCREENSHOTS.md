# Captures

**35 fichiers** dans `audit/screenshots/`.

Méthode : Chromium headless piloté par Playwright, installé **hors du
dépôt** (scratchpad de session). Captures pleine page, thème forcé
explicitement, animations laissées en place. Aucune erreur ni avertissement
console n'a été émis pendant la campagne.

Convention de nommage : `<page>-<viewport>-<theme>.png`, sauf les captures
de défaut, préfixées `issue-<ID>-`.

---

## Site public — desktop 1440 px

| Fichier | Route | Thème |
|---|---|---|
| `home-desktop-jour.png` | `/` | jour |
| `home-desktop-nuit.png` | `/` | nuit |
| `comment-ca-marche-desktop-jour.png` | `/comment-ca-marche` | jour |
| `gammes-desktop-jour.png` | `/gammes` | jour |
| `gammes-desktop-nuit.png` | `/gammes` | nuit |
| `produit-capteur-desktop-jour.png` | `/gammes/capteur` | jour |
| `produit-volet-desktop-jour.png` | `/gammes/volet` | jour |
| `produit-volet-desktop-nuit.png` | `/gammes/volet` | nuit |
| `produit-fenetre-desktop-jour.png` | `/gammes/fenetre` | jour |
| `application-desktop-jour.png` | `/application` | jour |
| `ressources-desktop-jour.png` | `/ressources` | jour |
| `pro-desktop-jour.png` | `/pro` | jour |
| `devis-desktop-jour.png` | `/devis` | jour |
| `devis-desktop-nuit.png` | `/devis` | nuit |
| `faq-desktop-jour.png` | `/faq` | jour |
| `mentions-legales-desktop-jour.png` | `/mentions-legales` | jour |
| `simulateur-404-desktop.png` | `/simulateur` | — |

## Site public — mobile 360 px

| Fichier | Route |
|---|---|
| `home-mobile-jour.png` | `/` |
| `gammes-mobile-jour.png` | `/gammes` |
| `produit-capteur-mobile-jour.png` | `/gammes/capteur` |
| `devis-mobile-jour.png` | `/devis` |

## Application — mobile 360 px

| Fichier | Route | Thème |
|---|---|---|
| `app-accueil-mobile-jour.png` | `/app` | jour |
| `app-accueil-mobile-nuit.png` | `/app` | nuit |
| `app-pieces-mobile-jour.png` | `/app/pieces` | jour |
| `app-pieces-mobile-nuit.png` | `/app/pieces` | nuit |
| `app-mode-auto-mobile-jour.png` | `/app/mode-auto` | jour |
| `app-programmes-mobile-jour.png` | `/app/programmes` | jour |
| `app-historique-mobile-jour.png` | `/app/historique` | jour |
| `app-notifications-mobile-jour.png` | `/app/notifications` | jour |
| `app-securite-mobile-jour.png` | `/app/securite` | jour |
| `app-reglages-mobile-jour.png` | `/app/reglages` | jour |
| `app-appairage-mobile-jour.png` | `/app/reglages/appairage` | jour |

## Captures de défaut

| Fichier | Finding | Ce qu'elle montre |
|---|---|---|
| `simulateur-404-desktop.png` | UX-001 | La page 404 atteinte depuis le menu principal |
| `issue-RESP-001-home-768.png` | RESP-001 | Débordement de 18 px sur `/` à 768 px |
| `issue-RESP-001-gammes-768.png` | RESP-001 | Même défaut sur `/gammes` |
| `issue-RESP-001-devis-768.png` | RESP-001 | Même défaut sur `/devis` |

---

## Captures les plus utiles à un relecteur externe

Si le temps manque, ces sept suffisent à comprendre l'essentiel du dossier :

1. `simulateur-404-desktop.png` — le défaut critique.
2. `issue-RESP-001-home-768.png` — le seul défaut responsive, mesuré.
3. `home-desktop-jour.png` — le niveau de qualité que le site atteint.
4. `produit-volet-desktop-jour.png` — le niveau qu'il n'atteint pas
   *(UI-001, UI-002, BRAND-001 sur une seule image)*.
5. `home-desktop-nuit.png` — la qualité du thème nuit.
6. `app-pieces-mobile-jour.png` — le meilleur écran de l'application.
7. `app-notifications-mobile-jour.png` — l'écran le plus faible *(APP-001)*.

---

## Ce qui n'a pas été capturé

- Les 4 pages d'article `/ressources/[slug]`.
- `/contact`, `/a-propos`, `/confidentialite`.
- `/presentation` (hors parcours visiteur).
- Les états intermédiaires : formulaires en erreur, focus clavier, survol,
  états de chargement.
- Les largeurs 390, 414, 1024, 1280 et 1920 px, mesurées pour le
  débordement mais non capturées faute d'anomalie à montrer.

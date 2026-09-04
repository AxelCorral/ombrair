# Inventaire des routes

Relevé le 25 août 2026 sur `master` @ `dc757ab`, serveur de production
(`next build` puis `next start`). Le build génère **35 pages statiques**.

Statut HTTP vérifié route par route.

---

## Site public — groupe `app/(site)`

| Route | Statut | Rôle | Capture |
|---|---|---|---|
| `/` | 200 | Accueil : hero animé 24 h, problème sourcé, vitrine des trois produits, schéma de journée, écosystème, témoignages, FAQ courte | `home-desktop-jour`, `home-desktop-nuit`, `home-mobile-jour` |
| `/comment-ca-marche` | 200 | Principe de fonctionnement, étapes d'installation | `comment-ca-marche-desktop-jour` |
| `/gammes` | 200 | Comparatif des trois produits | `gammes-desktop-jour`, `gammes-desktop-nuit`, `gammes-mobile-jour` |
| `/gammes/capteur` | 200 | Page produit — Capteur (fabriqué par Ombrair) | `produit-capteur-desktop-jour`, `produit-capteur-mobile-jour` |
| `/gammes/volet` | 200 | Page produit — Volet (revendu + motorisé) | `produit-volet-desktop-jour`, `produit-volet-desktop-nuit` |
| `/gammes/fenetre` | 200 | Page produit — Fenêtre (revendue + motorisée) | `produit-fenetre-desktop-jour` |
| `/application` | 200 | Présentation de l'application, maquettes en cadre téléphone | `application-desktop-jour` |
| `/ressources` | 200 | Index des articles | `ressources-desktop-jour` |
| `/ressources/[slug]` | 200 | Article. 4 slugs : `rafraichissement-nocturne`, `inertie-thermique`, `climatisation-pas-seule-reponse`, `canicule-personnes-agees` | — |
| `/pro` | 200 | Offre professionnels / bailleurs | `pro-desktop-jour` |
| `/devis` | 200 | Formulaire de demande de devis | `devis-desktop-jour`, `devis-desktop-nuit`, `devis-mobile-jour` |
| `/contact` | 200 | Formulaire de contact | — |
| `/faq` | 200 | FAQ complète | `faq-desktop-jour` |
| `/a-propos` | 200 | Le projet, l'équipe, le cadre universitaire | — |
| `/mentions-legales` | 200 | Mentions légales | `mentions-legales-desktop-jour` |
| `/confidentialite` | 200 | Politique de confidentialité | — |
| **`/simulateur`** | **404** | **N'existe pas** — pourtant lié depuis le menu principal et le pied de page | `simulateur-404-desktop` |

## Démo applicative — groupe `app/app`

Layout distinct, thème et chrome propres. Toutes les routes en 200.

| Route | Rôle | Capture |
|---|---|---|
| `/app` | Accueil : état thermique, dernière action, raccourcis | `app-accueil-mobile-jour`, `app-accueil-mobile-nuit` |
| `/app/pieces` | Liste des pièces et de leurs volets | `app-pieces-mobile-jour`, `app-pieces-mobile-nuit` |
| `/app/mode-auto` | Réglages du mode automatique | `app-mode-auto-mobile-jour` |
| `/app/programmes` | Programmes horaires | `app-programmes-mobile-jour` |
| `/app/historique` | Courbes int/ext et journal des actions | `app-historique-mobile-jour` |
| `/app/notifications` | Notifications | `app-notifications-mobile-jour` |
| `/app/securite` | Volet sécurité / absence | `app-securite-mobile-jour` |
| `/app/reglages` | Réglages | `app-reglages-mobile-jour` |
| `/app/reglages/appairage` | Appairage d'un équipement | `app-appairage-mobile-jour` |

## Hors navigation

| Route | Statut | Note |
|---|---|---|
| `/presentation` | 200 | Présentation animée plein écran. Volontairement absente du menu ; atteignable uniquement par URL directe. |
| `/robots.txt` | 200 | Généré par `app/robots.ts` |
| `/sitemap.xml` | 200 | Généré par `app/sitemap.ts` |

---

## Liens de navigation

**Menu principal** (`components/site/header.tsx`) — 6 entrées :
Comment ça marche · Produits · L'application · **Simulateur** · Ressources · Ombrair Pro.

**Pied de page** (`components/site/footer.tsx`) — 4 colonnes :

- *Produits* : Comparer les produits, Capteur, Volet, Fenêtre, Ombrair Pro
- *Découvrir* : Comment ça marche, L'application, **Simulateur**, Articles
- *Entreprise* : À propos, Contact, FAQ, Demander un devis
- *Légal* : Mentions légales, Politique de confidentialité

---

## Constats

1. **Un seul lien mort, et il est partout.** `/simulateur` apparaît dans le
   menu principal et dans le pied de page, donc sur **toutes** les pages du
   site. C'est la seule 404 de l'inventaire *(UX-001)*.

2. **Le libellé et l'URL ont divergé.** Le menu dit « Produits », l'URL dit
   `/gammes`. Vestige du vocabulaire antérieur, conservé lors de la
   migration vers Capteur/Volet/Fenêtre *(UX-003)*.

3. **Deux libellés pour la même destination.** `/ressources` est « Ressources »
   dans le menu et « Articles » dans le pied de page.

4. **Aucune orpheline côté site public.** Chaque page du groupe `(site)` est
   atteignable depuis le header ou le footer. `/presentation` est une
   exception assumée, hors parcours visiteur.

5. **Profondeur maîtrisée** : deux niveaux maximum côté site
   (`/gammes/volet`), deux côté app (`/app/reglages/appairage`).

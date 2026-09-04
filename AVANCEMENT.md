# Avancement — projet Ombrair

## État constaté après récupération — 4 septembre 2026

Le projet a été récupéré intégralement depuis les fichiers sources conservés par le
déploiement Vercel `dpl_6UM8Z8p9rjzweNWvpmuzB7tVKXBy`, créé le 27 août 2026. Les
312 fichiers annoncés par Vercel ont été téléchargés et vérifiés un par un contre
leur empreinte SHA-1. Le build Next.js est vert et génère 37 pages statiques.

L'état effectivement livré dépasse les prochaines étapes indiquées plus bas dans ce
journal : la démo `/app` et ses écrans, le simulateur, la présentation, les trois
gammes (`capteur`, `volet`, `fenetre`), les ressources éditoriales, les démonstrations
3D, les audits et le travail de finition sont présents dans le déploiement récupéré.
Les routes principales ont été comparées au site en production sans écart de contenu,
hors valeurs temporelles normales de la simulation animée de l'accueil.

L'ancien dépôt Git n'était présent que sur la machine perdue et son historique n'a
pas pu être récupéré. Le dernier commit antérieur cité dans ce journal est `65eceef` ;
il reste un repère documentaire, pas un objet Git disponible. Le nouveau dépôt repart
donc d'un commit unique de récupération et ne tente pas de reconstituer artificiellement
les anciens commits.

Journal de suivi, mis à jour à chaque incrément. Ce n'est pas une page du
site (pas comptée dans les 10 pages du brief) ni le README final — juste
un état des lieux lisible pour reprendre le fil d'une session à l'autre.

Source de vérité pour le contenu et les contraintes : `prompt-claude-code-ombrair.md`
à la racine. Ce fichier ne fait que résumer ce qui a été *fait*, pas ce qui
est *demandé* — en cas de doute, se référer au brief.

---

## Repères

- Dépôt : `C:\Users\AdminEtu\Desktop\projet_claude_code\projet-volets`, git initialisé, un commit par incrément.
- Stack : Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + shadcn/ui.
- Historique complet : `git log --oneline`. Un commit par incrément (+ un commit de mise à jour du journal après chacun). Dernier en date : `65eceef` — Ressources, clôture de l'incrément D.

---

## Ce qui est fait

### Incrément 1 — Socle et tokens

- Next.js scaffoldé puis **downgradé de la v16 (défaut de create-next-app) vers la v15**, pour coller au brief et parce que la v16 diffère significativement de l'entraînement de l'agent (signalé par le fichier `AGENTS.md` auto-généré par Next 16 lui-même).
- shadcn/ui initialisé — CLI récente construite sur `@base-ui/react` (pas Radix), style `base-nova`. Composants vendored en local, donc lisibles/éditables, pas une dépendance opaque.
- Système de tokens dans `app/globals.css` : palette brute (Chaux, Persienne, Nuit, Fraîche, Ambre, Braise) → alias sémantiques shadcn (background/foreground/primary/...) → tokens produit (`--color-etat-froid`, `--color-etat-chaud`, `--color-alerte`, échelle `--spacing-lame-0..100`). Radius de base à 5px.
- Deux résolutions de tension design/tech actées :
  1. **Persienne = couleur d'action neutre** (boutons, liens, ring) en plus de son rôle d'encre, pour ne jamais utiliser Fraîche/Ambre de façon décorative.
  2. **Radius shadcn écrasé à 5px** (pas de pilule iOS).
- Polices Archivo (display), Instrument Sans (texte), IBM Plex Mono (données) via `next/font/google`.
- Routes : `app/(site)/` pour le site (clair par défaut), `app/app/` pour la démo (portée sombre via la classe `.dark` de shadcn, réutilisée plutôt qu'un mécanisme parallèle).
- Build + lint verts, vérifié visuellement (Playwright headless).

### Incrément 2 — Composants partagés

- `lib/tarifs.ts` : source unique des prix, typée, recopiée du brief (Signal 349€, Store dès 690€/ouvrant, Intégral dès 1590€/ouvrant, Pro sur devis, Ombrair+ 4,99€/mois facultatif).
- `components/shared/lame.tsx` : le motif signature, écartement interpolé en continu sur l'échelle `--spacing-lame-*`.
- `components/site/header.tsx` : nav desktop + menu mobile accessible (aria-expanded, fermeture Escape).
- `components/site/footer.tsx` : mention légale obligatoire + colonnes de liens.
- `components/site/pricing-card.tsx` : branchée sur `lib/tarifs.ts`. Une auto-correction notable : une première version utilisait Fraîche pour la ligne "accès app inclus à vie" — repérée et corrigée avant commit (violation de la règle thermique).
- `components/site/phone-frame.tsx` : cadre d'appareil pour la démo `/app` dans le site (radius généreux assumé ici car objet physique, pas UI produit).
- `app/(site)/layout.tsx` branche header/footer sur tout le site.
- Vérifié desktop (1280px) + mobile (390px), interaction clavier testée.

### Incrément A — Hero interactif

- `components/site/hero-volet.tsx` : `input[type="range"]` natif pilotant en direct le volet (via `Lame`) et une estimation int./ext. en mono, explicitement étiquetée comme scénario de démonstration (pas une mesure garantie).
- **Bug trouvé et corrigé** : `Lame` avait une épaisseur de lame fixe et ne couvrait pas toute la hauteur du cadre — la pièce restait visible à nu en dessous. Ajout d'un mode `remplir` (lames en `flex-1`) pour que le volet couvre toujours tout le cadre, quel que soit le taux d'ouverture.
- Animation d'entrée orchestrée une seule fois au chargement, désactivée proprement sous `prefers-reduced-motion` (vérifié : apparition directe à l'état ouvert, sans flash).
- Vérifié : clavier (flèches, Home/End), glisser-souris (proxy tactile), `aria-valuetext` dynamique, 360/390/1280px sans débordement horizontal, build + lint verts.
- **Écart noté et assumé** : le wireframe utilisé est texte à gauche / fenêtre cadrée à droite — c'est celui réellement validé en début de projet. Une consigne reçue en cours de route inversait l'ordre sans justification ; traité comme une imprécision de reformulation, pas suivi.

### Incrément B — Accueil complet

- Section « problème » avec trois chiffres réellement sourcés et vérifiés à la source primaire (pas seulement un résumé de recherche) :
  - Nuits tropicales, national (11 % de la population en 2021-2050 contre 5 % en 1976-2005) et régional Sud-Est/PACA (79 % contre 35 %) — Insee Flash PACA n°103 (mai 2024), données Météo-France Drias 2020, RCP 8.5.
  - Confort d'été des logements (48 % jugés insuffisants, manque de protections solaires extérieures identifié comme facteur principal) — étude Pouget Consultants/IGNES sur la base DPE de l'Ademe (juin 2026), avec sa réserve méthodologique explicitement citée (échantillon non redressé).
- « Comment ça marche » en 4 étapes (mesurer/anticiper/agir/apprendre), aperçu des 3 gammes (réutilise `PricingCard` + `lib/tarifs.ts`), démo app dans `PhoneFrame`, 3 témoignages (`components/site/temoignage-card.tsx`) explicitement labellisés « Persona fictif — illustration », FAQ courte en `<details>/<summary>` natif (accessible clavier sans JS), CTA devis final.
- Vérifié desktop (1280px) + mobile (390px), aucun débordement horizontal, FAQ testée au clavier (Enter ouvre/ferme), build + lint verts.

### Incrément C — Gammes

- `/gammes` (index comparatif : grille tarifaire + tableau, rappel Ombrair+ facultatif, lien Pro), `/gammes/signal`, `/gammes/store`, `/gammes/integral`.
- Composants `FaqListe` et `EtapesInstallation` extraits (réutilisés Accueil + les 3 pages gamme) plutôt que dupliqués.
- Vérificateur de compatibilité Signal (`components/site/compat-checker.tsx`) : construit sur des critères techniques génériques (motorisation, type de commande), pas sur une liste de marques réelles — associer une vraie marque à une compatibilité inventée aurait été une fausse affirmation sur un produit réel. Les 3 états (compatible démo / info insuffisante / non compatible démo) sont implémentés et testés.
- Lien réel vers France Rénov' (france-renov.gouv.fr) sur la page Intégral pour les aides, formulé au conditionnel.
- Vérifié desktop + mobile, build + lint verts.

### Incrément D — Autres pages du site (hors Simulateur)

- **Comment ça marche** : schéma d'une journée type via recharts (données simulées explicitement étiquetées), matériel détaillé, ce que l'algorithme prend en compte / ne fait pas. Bug corrigé : axe Y du graphique tronqué (largeur insuffisante).
- **L'application** : parcours des 8 écrans, previews illustratives dans `PhoneFrame`, clairement distinctes de la démo `/app`.
- **Ombrair Pro** et **Contact** : `components/site/formulaire-contact.tsx`, formulaire simulé réutilisé sur les deux pages, confirmation inline sans transmission réelle.
- **À propos** : origine du projet, équipe en personas fictifs labellisés, position sur les données.
- **FAQ** complète (4 catégories), **Mentions légales** et **Confidentialité** rédigées sans fabriquer d'identifiant juridique réel (SIRET, adresse, DPO) — la nature fictive est assumée explicitement.
- **Devis** : formulaire 5 étapes (`components/site/devis-form.tsx`) — logement → ouvrants → gamme → coordonnées → récapitulatif → confirmation simulée. Validation par étape, focus déplacé sur le titre à chaque étape (a11y), testé de bout en bout.
- **Ressources** : 4 articles (`lib/content/ressources.ts`) — rafraîchissement nocturne, inertie thermique, climatisation, personnes âgées — chaque fait externe sourcé sur une page primaire vérifiée (Ademe, gouv.fr). Une statistique trouvée en recherche (« 20 % d'économies ») a été écartée faute de source primaire vérifiable.
- Toutes les pages vérifiées (desktop + mobile, zéro débordement), build + lint verts à chaque lot.

### Hors incréments — présentation projetée `/presentation`

- Slideshow HTML plein écran (8 slides, ≈ 7 min) sur les produits et services : `app/presentation/page.tsx`, `components/presentation/*`, notes orales dans `lib/presentation/slides.ts`.
- Navigation : →/Espace/PageDown, ←/PageUp, Home/End, clic (bord gauche = retour), `F` plein écran, `N` notes du présentateur.
- Animations en CSS pur (keyframes dans `globals.css`) — `framer-motion` n'était pas installé et n'a pas été ajouté : les fondus, révélations décalées et tracés SVG n'en avaient pas besoin, et `prefers-reduced-motion` est plus simple à maîtriser ainsi.
- **Défaut corrigé en cours de route** : la coque montait toutes les slides d'un coup, donc toutes les animations d'entrée se jouaient à t=0 et étaient terminées avant qu'on arrive sur la slide. Seule la slide active est désormais montée (`key={index}`).
- Les transitions CSS (pas seulement les `animation`) ont dû être neutralisées explicitement sous reduced-motion sur la slide 4, sinon le volet continuait à s'animer.
- Une version PowerPoint du même contenu existe dans `presentation/` (livrable de secours, généré par script).

---

## Décisions et leçons à ne pas perdre

- **Fraîche/Ambre strictement thermiques** — jamais pour un CTA générique, un lien, une carte mise en avant, une info commerciale ou une série de graphe sans lien thermique.
- **Radius produit 5px** partout sauf exceptions assumées et documentées (ex. `PhoneFrame`, objet physique).
- **Ne jamais faire cohabiter `npm run build` et `npm run dev`** sur le même dossier — corrompt le cache `.next` (vécu deux fois). Toujours arrêter le dev server avant un build.
- Sous Windows/git-bash : `lsof` n'est pas fiable pour tuer des process. Utiliser `netstat -ano | grep LISTENING` puis `taskkill //F //PID <pid>`.
- `rm -rf .next` avant de relancer `npm run dev` si l'arrêt précédent n'a pas été propre.
- Identité git configurée en local (pas globale) sur ce dépôt, sur autorisation explicite de l'utilisateur.
- Vérification visuelle via Playwright headless installé dans un dossier scratchpad externe au projet (`chromium-cli` indisponible sur cette machine) — ne pas ajouter Playwright comme dépendance du projet pour ça.

---

## Prochaines étapes (ordre retenu)

E. **App `/app`** (prochain) — source de données mock unique et cohérente d'abord (`lib/mock/*`), puis les 8 écrans. Un même événement doit raconter la même histoire sur tous les écrans.
F. Simulateur — logique de calcul explicite, bloc "hypothèses de calcul" sur chaque estimation, dédié (ne pas le refaire en incrément D).
G. Polish — audit visuel (retirer un effet si besoin), responsive 360-1920px, accessibilité, recherche de couleurs en dur, SEO (sitemap/robots), README final.

## Points de vigilance encore ouverts

- App `/app` : construire le modèle mock cohérent AVANT les écrans, pas huit séries de constantes indépendantes. Scénario canicule Toulouse 21-23 août déjà utilisé dans le hero et le schéma de journée — rester cohérent avec ces chiffres.
- Simulateur : toute hypothèse numérique non fournie par le brief doit être posée en question, pas inventée.

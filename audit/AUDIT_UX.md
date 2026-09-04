# Audit UX — parcours et compréhension

⚠️ **Aucune donnée analytique n'est disponible.** Pas de trafic, pas de taux
de conversion, pas de session enregistrée, pas de test utilisateur. Tout ce
document est de l'interprétation d'expert appuyée sur ce qui est
observable dans l'interface. Les faits mesurés sont signalés comme tels.

---

## Parcours testés

### 1. « Je veux comprendre ce que fait Ombrair » — ✅

Accueil → hero animé → section problème → vitrine des trois produits.
Le hero fait comprendre le principe **avant** toute lecture : on voit le
volet suivre la course du soleil. C'est la meilleure séquence du site.

### 2. « J'ai déjà des volets électriques, est-ce compatible ? » — ✅

`compat-checker.tsx` traite exactement ce cas, et c'est probablement le plus
fréquent. Le composant pose la bonne question, donne une réponse nette et
oriente vers le bon produit. Bien vu.

### 3. « Combien ça coûte ? » — ⚠️ mitigé

Le prix est visible tôt et souvent — trop souvent sur les pages produit
*(UI-002)*. Mais la question du devis renvoie à un simulateur qui n'existe
pas *(CONTENT-001)*, et le formulaire de devis n'annonce aucun montant, ce
qui est honnête mais laisse l'utilisateur sans estimation. La chaîne
« curiosité tarifaire → estimation » est rompue en son milieu.

### 4. « Qu'est-ce qu'Ombrair Link ? » — ❌ échec *(UX-002)*

Le nom apparaît **deux fois** sur tout le site, et n'est **jamais défini**.
Ailleurs, la même chose est appelée « la passerelle », sans que le lien
entre les deux termes soit fait nulle part. Un visiteur ne peut pas savoir
s'il s'agit d'un boîtier, d'un protocole, d'un abonnement ou d'un service.

Cause profonde : il n'existe aucune page décrivant l'écosystème technique
*(UX-004)*. Le vocabulaire flotte parce qu'il n'a pas de lieu où être posé.

### 5. « Je clique sur Simulateur » — ❌ échec critique *(UX-001)*

**404.** Le lien est dans le menu principal et dans le pied de page, donc
présent sur toutes les pages du site. C'est le défaut le plus grave du
dossier : il est atteignable en un clic depuis n'importe où, et une page
d'erreur sur un site commercial coûte plus en crédibilité que n'importe quel
défaut esthétique.

Aggravé par CONTENT-001 : la FAQ de l'accueil *promet* ce simulateur sur la
question du prix.

### 6. « Je veux essayer l'application » — ✅

`/application` présente les écrans en cadre téléphone et mène à la démo
`/app`. La démo est complète et cohérente (voir `AUDIT_APP.md`). Le passage
de la présentation à la démo est clair.

---

## Navigation

**Six entrées de menu**, ce qui est raisonnable. Mais l'une mène à une 404,
et une autre porte un libellé qui ne correspond plus à son URL : « Produits »
pointe vers `/gammes` *(UX-003)* — vestige du vocabulaire d'avant la
migration vers Capteur / Volet / Fenêtre.

Le pied de page est bien structuré en quatre colonnes. Il reproduit le lien
mort et introduit un second libellé pour `/ressources` (« Articles » au lieu
de « Ressources »).

---

## Hiérarchie de l'information

Sur l'accueil, l'ordre est : hero → problème → produits → schéma → écosystème
→ témoignages → FAQ. La vitrine produits arrive en **quatrième position**,
après près de 4 000 px de défilement en mobile *(UI-005)*.

Argument pour l'ordre actuel : Ombrair vend une solution à un problème
(l'inconfort en canicule), pas un objet ; poser le problème d'abord est
défendable. Argument contre : un visiteur venu voir le produit doit
beaucoup chercher.

> Sans donnée de comportement, je ne tranche pas. Je documente la tension.

---

## Formulaires

`/devis` et `/contact` : champs correctement labellisés, ordre logique,
regroupement lisible. Le devis annonce explicitement qu'aucun montant n'est
calculé à ce stade — préférable à un total inventé.

Le sélecteur de dimensions arrive pré-coché sur le premier format
*(UI-007)*, ce qui présente un prix particulier comme s'il était le prix de
référence.

---

## Findings de ce domaine

UX-001 (critique) · UX-002 · UX-003 · UX-004 — et, par recoupement,
CONTENT-001, UI-002, UI-005, UI-007.

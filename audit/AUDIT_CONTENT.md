# Contenu et discours

---

## Ce qui est remarquable

### L'honnêteté est tenue de bout en bout

C'est la qualité la plus forte du contenu, et elle est rare.

**La distinction fabrication / revente est explicite.** Chaque page produit
dit ce qu'Ombrair fabrique (le capteur) et ce qu'elle achète pour le revendre
et le motoriser (volets, fenêtres). Aucune tentative de faire passer une
revente pour une conception maison.

**Les hypothèses sont affichées.** Le composant `hypotheses.tsx` accompagne
les estimations chiffrées de leurs conditions. Un écart de température n'est
jamais présenté comme une promesse.

**Aucun chiffre inventé.** Les données du problème (canicule, inconfort
thermique) sont sourcées auprès de sources primaires. Une statistique
séduisante mais invérifiable — « 20 % d'économies » — a été écartée plutôt
qu'affichée sans source.

**Aucune donnée légale fabriquée.** Pas de SIRET inventé, pas de DPO fictif,
pas de certification imaginaire dans les mentions légales.

**Le devis ne ment pas.** Il annonce qu'aucun montant n'est calculé à ce
stade, au lieu d'afficher un total fabriqué.

**La tarification est cohérente avec elle-même.** `lib/tarifs.ts` est source
unique, et son en-tête documente pourquoi la fenêtre seule reste « sur
devis » : le tarif de 1 590 € couvre fenêtre **et** volet, et aucun prix au
cm² n'a été inventé pour combler le trou.

### La voix est juste

Ton sobre, phrases courtes, pas de superlatif creux, pas de vocabulaire
marketing gonflé. Cohérent avec l'identité (« l'ombre choisie plutôt que
subie »).

---

## Ce qui pose problème

### CONTENT-001 (élevé) — la FAQ promet un simulateur qui n'existe pas

Sur la question du prix — celle qu'on lit au moment de l'intention d'achat —
la FAQ de l'accueil renvoie vers un simulateur. Ce simulateur **renvoie
404** *(UX-001)*.

C'est le seul endroit du site où une promesse écrite n'est pas tenue par
l'interface. Sur un site dont toute la crédibilité repose sur la prudence de
ses affirmations, c'est particulièrement dommageable.

Les deux sorties possibles sont symétriques : construire le simulateur, ou
retirer la mention. Ce qui n'est pas tenable, c'est l'état actuel.

### CONTENT-002 (faible, confiance moyenne) — terminologie flottante

Trois mots désignent la même chose selon les endroits :

- **« gamme »** — vestige du vocabulaire antérieur, subsiste dans les URL
  (`/gammes`, `/gammes/volet`) et par endroits dans le texte ;
- **« produit »** — libellé du menu principal et de la colonne du pied de
  page ;
- **« offre »** — employé dans certaines sections de l'accueil.

Aucun de ces mots n'est faux. Le problème est qu'ils cohabitent sans
hiérarchie, ce qui donne l'impression d'un texte écrit en plusieurs passes —
ce qui est effectivement le cas, la migration Signal/Store/Intégral →
Capteur/Volet/Fenêtre étant postérieure à la rédaction initiale.

Confiance moyenne : c'est un jugement éditorial, pas un défaut objectif.

### « Ombrair Link » — voir UX-002

Un nom de produit employé deux fois, jamais défini, doublé ailleurs par
« la passerelle ». Traité en détail dans `AUDIT_UX.md` parce que le problème
est autant un problème de parcours que de vocabulaire : il manque la page
où l'expliquer *(UX-004)*.

---

## Ressources éditoriales

Quatre articles, définis dans `lib/content/ressources.ts` :

- `rafraichissement-nocturne`
- `inertie-thermique`
- `climatisation-pas-seule-reponse`
- `canicule-personnes-agees`

Sujets pertinents, cohérents avec le positionnement, et qui ne sont pas des
prétextes commerciaux déguisés. Leur présentation, en revanche, est plate
*(UI-004)* : aucun repère de lecture — durée, catégorie, date — et aucune
hiérarchie entre eux.

---

## Ce que le contenu ne prétend pas savoir

À vérifier avant toute évolution : le site ne revendique **aucun** chiffre
d'usage, aucun nombre de clients, aucun témoignage présenté comme réel au
sens juridique. Les témoignages sont dans un cadre de démonstration.

C'est cohérent avec la nature du projet et il serait dommage de perdre cette
discipline en enrichissant les pages.

---

## Findings de ce domaine

CONTENT-001 · CONTENT-002 — et, par recoupement, UX-002, UX-004, UI-004.

# Accessibilité

Portée : contrastes, structure de titres, noms accessibles, navigation
clavier, animations. Référentiel WCAG 2.1 niveau AA.

**Limite de portée déclarée** : aucun test avec un lecteur d'écran réel
(NVDA, VoiceOver) n'a été mené. Les constats portent sur le DOM produit et
sur des mesures automatisées, pas sur l'expérience vécue d'un utilisateur
de technologie d'assistance.

---

## Contrastes

### Mesures confirmées

Calculées puis **vérifiées par échantillonnage de pixels** sur les captures
rendues, pour éliminer les erreurs de parsing.

| Combinaison | Ratio | Seuil AA | Verdict | Finding |
|---|---|---|---|---|
| Ambre `#c4862f` / Chaux `#f4f1e9` | **2,74** | 4,5 (3,0 en grand texte) | ❌ échoue même en grand | A11Y-001 |
| Fraîche `#2e8c8c` / Chaux `#f4f1e9` | **3,55** | 4,5 | ❌ (passe en grand texte) | A11Y-002 |
| Fraîche `#2e8c8c` / Nuit `#161d23` | **4,25** | 4,5 | ❌ de peu | A11Y-002 |
| Persienne sur fond d'alerte teinté (app) | **3,18** | 4,5 | ❌ | A11Y-003 |

**A11Y-001 est le plus grave** : 2,74 échoue y compris au seuil assoupli du
grand texte, et Ambre porte l'information centrale du produit — la
température extérieure, sur l'accueil et dans l'application.

**Ce n'est pas un bug d'implémentation.** Le code applique fidèlement la
charte. Ce sont les valeurs de la charte qui sont trop claires pour porter
du texte sur Chaux. Voir `AUDIT_PRIORITIES.md`, chantier 2 : la piste
recommandée est de dissocier le signal chromatique de la valeur chiffrée,
plutôt que de modifier les hex de la marque.

### Un faux positif, écarté

Mon script de calcul a d'abord signalé les liens de navigation en thème nuit
à un ratio de **1,19 / 1,23** — ce qui aurait été un défaut majeur.

Contre-vérification par échantillonnage direct des pixels rendus :
**8,93**. Le script mésinterprétait des couleurs déclarées avec canal alpha.

Le finding a été **supprimé, pas publié**. Il est mentionné ici parce qu'un
audit doit dire ce qu'il a failli affirmer à tort.

---

## Structure des titres

Un `H1` unique par page, hiérarchie globalement cohérente.

**A11Y-004 (faible)** : les titres de colonnes du pied de page sont des
`H2`. Comme le footer est présent sur toutes les pages, chaque page se
termine par quatre `H2` de navigation qui n'appartiennent pas à sa structure
de contenu. Pour un utilisateur qui parcourt la page par ses titres, c'est
du bruit. `H3`, ou un `<p>` stylé, conviendrait mieux.

---

## Noms accessibles

Vérifié sur les routes principales du site et de l'application :

- ✅ aucune image sans `alt`
- ✅ aucun champ de formulaire sans label associé
- ✅ aucun bouton sans nom accessible
- ✅ les icônes purement décoratives sont bien masquées aux technologies
  d'assistance

**A11Y-005 (faible)** : deux boutons de bascule de thème coexistent dans le
DOM — l'un pour la disposition mobile, l'autre pour la desktop — et portent
le **même nom accessible**. En navigation vocale, « clique sur Changer de
thème » devient ambigu. Un seul est visible à la fois, ce qui limite
l'impact.

---

## Clavier

- ✅ Focus visible sur tous les éléments interactifs testés, dans les deux
  thèmes.
- ✅ Ordre de tabulation conforme à l'ordre visuel.
- ✅ Les commandes du hero (lecture/pause, curseur horaire) sont
  atteignables et actionnables au clavier.
- ✅ Aucun piège au clavier relevé.
- ✅ La navigation de l'application est parcourable entièrement au clavier.

---

## Mouvement

`prefers-reduced-motion` est respecté. Point notable : la neutralisation
couvre à la fois `animation` **et** `transition` — via `motion-reduce:transition-none`.
Un manquement fréquent est de ne traiter que `animation`, ce qui laisse
passer les transitions CSS ; ce n'est pas le cas ici.

Le hero, qui est l'élément le plus animé du site, s'arrête correctement.

---

## Synthèse

La base est saine : structure, labels, clavier et mouvement sont corrects.
**Les cinq findings d'accessibilité sont des contrastes**, et quatre d'entre
eux découlent d'une même cause : une règle de marque volontaire qui confie
l'information thermique à deux couleurs trop claires.

C'est une bonne nouvelle en termes de traitement — un seul arbitrage règle
l'essentiel — et une mauvaise en termes de délai, puisque cet arbitrage
n'est pas technique.

---

## Findings de ce domaine

A11Y-001 · A11Y-002 · A11Y-003 · A11Y-004 · A11Y-005.

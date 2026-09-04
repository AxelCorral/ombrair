# Ombrair Pionniers — cadre de campagne

> **Programme conceptuel — projet étudiant fictif.**
> Ombrair n'existe pas, ne vend rien, et ce programme n'est pas un produit
> financier. Ce document est un support pédagogique de communication, pas un
> plan média destiné à être exécuté.

---

## Proposition de valeur

Ombrair récompense symboliquement les premiers clients d'une marque
matérielle, à un moment où ils prennent un risque : acheter à une entreprise
qui n'a pas encore fait ses preuves.

Ce que le programme apporte n'est **pas** un gain, c'est une **place dans
l'histoire de la marque**, matérialisée par un décompte simple et vérifiable
par le client lui-même.

---

## Message principal

> **Les premiers devraient compter davantage.**

Une seule accroche, réutilisée partout : site, réseaux, publicité. Multiplier
les slogans diluerait un message dont toute la force tient à sa constance.

La règle qui l'accompagne, toujours dans cette forme exacte :

> **1 capteur = 1 Crédit Pionnier**

---

## Messages secondaires

À utiliser en développement, jamais en accroche principale :

- « Ceux qui nous accompagnent au début participent à la suite. »
- « Vous équipez votre logement aujourd'hui. Vous participez peut-être à
  l'histoire d'Ombrair demain. »
- « Une marque se construit aussi avec ses premiers clients. »

Noter le **peut-être** de la deuxième : il n'est pas une précaution de style,
c'est le cœur honnête du programme.

---

## Ton

Sobre, factuel, adulte. Le programme se raconte comme une **reconnaissance**,
jamais comme une opportunité.

Le registre de référence est celui d'un fabricant qui explique une garantie —
pas celui d'une plateforme d'investissement. Si une phrase pourrait figurer
telle quelle sur une publicité de courtier, elle est mauvaise.

Le conditionnel n'est pas une faiblesse rédactionnelle : c'est ce qui rend le
concept crédible. Une marque qui écrit « peut-être jamais » gagne plus de
confiance qu'une marque qui promet.

---

## Do / Don't

### Do

| | |
|---|---|
| Pionniers, premiers clients | le sujet du programme |
| Aventure, confiance, participation à l'histoire | le registre |
| Conditionnel systématique | « pourraient », « si », « selon les conditions » |
| Transparence sur l'incertitude | l'argument le plus fort dont dispose le programme |
| Le produit d'abord | le capteur est utile avec ou sans le programme |
| Décompte vérifiable | 3 capteurs, 3 crédits, on peut recompter |

### Don't

Formulations proscrites, sans exception :

- « devenez actionnaire dès aujourd'hui »
- « investissement garanti »
- « action gratuite garantie »
- « gagnez de l'argent avec Ombrair »
- « rendement », « x10 », « valeur future », « enrichissez-vous »
- tout faux cours de Bourse, graphique de valorisation, chandelier
- toute introduction en Bourse présentée comme programmée ou probable
- tout montant associé à un crédit, même « à titre indicatif »

Vocabulaire à éviter dans l'interface principale : *token*, *crypto*,
*equity token*, *stock credit*, *investissement*, *portefeuille*. Le
programme doit ressembler à un programme client, pas à de la fintech.

---

## Landing page — `/pionniers`

Ordre de lecture arrêté, et il compte :

1. **Accroche + règle** — « Les premiers devraient compter davantage », puis
   `1 capteur = 1 Crédit Pionnier` isolé sur sa ligne.
2. **Mécanique en trois temps** — équiper, accumuler, *si* introduction.
3. **Exemple chiffré** — le décompte du kit, ligne à ligne, avec Ombrair Link
   et les modules affichés à zéro pour qu'on comprenne la règle.
4. **Le conditionnel** — définition de l'introduction en Bourse, puis
   « et si Ombrair n'entre jamais en Bourse ? » traité en pleine section.
5. **FAQ** — sept questions, dont celles qui dérangent.
6. **Reprise** — renvoi vers le **produit**, pas vers le programme.

La Bourse arrive **après** la mécanique. Ouvrir dessus ferait du programme un
argument financier, ce qu'il n'est pas.

## Homepage

Une section, après la vitrine produit et l'écosystème, avant la FAQ et la
reprise finale. Jamais dans le premier écran.

Contenu réduit au strict nécessaire : badge, accroche, une phrase, la règle,
un lien. Tout le détail vit sur `/pionniers`.

## Carte produit

Une ligne de légende sous le prix et les points clés :

```
3 capteurs inclus · 3 Crédits Pionniers
```

Elle ne doit rivaliser ni avec le prix, ni avec le nom du produit, ni avec
l'appel à l'action. Sur la fenêtre, dont le catalogue ne chiffre pas les
capteurs, **rien ne s'affiche**.

## Devis

Au récapitulatif, uniquement quand le nombre de capteurs découle sans
ambiguïté du parcours — c'est-à-dire pour le Kit Capteur seul :

```
Capteurs éligibles   3
Crédits Pionniers    3
```

Aucun montant. Aucun effet sur le prix, le parcours ou le récapitulatif.

---

## Publicité payante

Le programme est un **argument secondaire**. La publicité vend le confort
thermique ; Pionniers arrive en dernière ligne.

```
Vos volets ferment-ils toujours au bon moment ?

Ombrair les anticipe pour vous.

Kit Capteur Ombrair — 349 €
+ 1 Crédit Pionnier par capteur.
```

Puis, accessible d'un clic et non en corps 8 :

> Programme conceptuel — projet étudiant fictif. Les Crédits Pionniers ne
> constituent pas des actions ni une promesse de rendement.

**Test de contrôle** : si la publicité fonctionne encore en retirant la
dernière ligne, elle est bien construite. Si elle s'effondre, c'est que le
programme est devenu l'argument principal — à réécrire.

---

## Réseaux sociaux

Le détail des formats est dans
[`OMBRAIR_PIONNIERS_SOCIAL.md`](./OMBRAIR_PIONNIERS_SOCIAL.md).

Quatre angles, à alterner : **premiers clients**, **histoire**, **exemple
chiffré**, **transparence**. Le quatrième est le plus contre-intuitif et
probablement le plus efficace — c'est celui qui assume qu'il n'y aura
peut-être jamais d'introduction en Bourse.

---

## Disclaimer standard

À reprendre **mot pour mot**, sans abréviation, dans toute communication qui
mentionne une éventuelle attribution d'actions :

> **Programme conceptuel — projet étudiant fictif.**
> Les Crédits Pionniers ne constituent pas aujourd'hui des actions, des
> titres financiers ou une promesse de rendement. Toute éventuelle
> attribution future resterait conditionnée à la réalisation d'une opération
> permettant cette attribution et au cadre juridique, fiscal et opérationnel
> applicable à cette date.

Il est la source unique : le site le lit depuis `lib/pionniers.ts`, et toute
reformulation doit partir de là.

**Aucune prétention juridique.** Ce texte ne dit pas — et ne doit jamais
dire — que le mécanisme est validé par un conseil, conforme à un article
précis, approuvé par une autorité de marché ou opérationnel en l'état. Il
reste au conditionnel, seule formulation honnête pour un dispositif qui
n'existe pas.

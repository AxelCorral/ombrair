import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  BAIE_H,
  LAME_H,
  NB_LAMES,
  poserLame,
} from "../components/3d/shared/geometrie.ts";

/**
 * DÉROULÉ DU TABLIER — la seule géométrie de rendu qui soit testée ici, et
 * elle l'est pour une raison.
 *
 * Le défaut le plus grave qu'ait connu la démonstration était dans cette
 * fonction : un décalage vertical parasite poussait le tablier AU-DESSUS du
 * linteau dès qu'il n'était pas complètement descendu. À 73 % relevé, la baie
 * paraissait vide pendant que le panneau annonçait « Tablier 73 % relevé » —
 * la scène disait le contraire du texte, sur les deux pages produit.
 *
 * Rien dans les tests de simulation ne pouvait l'attraper : la logique
 * produisait le bon nombre, c'est la mise en place qui le trahissait. D'où
 * cette fonction pure, et d'où ces tests.
 *
 * Le fichier vit dans `lib/` parce que c'est ce que `npm test` parcourt ; il
 * importe la géométrie là où elle est écrite, sans la recopier.
 */

/** Bord haut et bord bas réels d'une lame, écrasement compris. */
function bords(index: number, levee: number) {
  const pose = poserLame(index, levee);
  const demi = (LAME_H * pose.echelle) / 2;
  return { haut: pose.y + demi, bas: pose.y - demi, ...pose };
}

const LINTEAU = BAIE_H / 2;
const APPUI = -BAIE_H / 2;
/** Tolérance : on compare des flottants issus de divisions. */
const EPS = 1e-9;

const TOUS = Array.from({ length: NB_LAMES }, (_, i) => i);

describe("tablier — le tablier pend du coffre, il ne monte jamais", () => {
  it("AUCUNE lame ne dépasse le linteau, à aucune hauteur de tablier", () => {
    // C'est la régression : la version fautive plaçait les lames sorties
    // jusqu'à 75 cm au-dessus du percement.
    for (let levee = 0; levee <= 100; levee += 1) {
      for (const i of TOUS) {
        const { haut, visible } = bords(i, levee);
        if (!visible) continue;
        assert.ok(
          haut <= LINTEAU + EPS,
          `lame ${i} à ${levee} % : bord haut ${haut} au-dessus du linteau ${LINTEAU}`
        );
      }
    }
  });

  it("aucune lame ne descend sous l'appui", () => {
    for (let levee = 0; levee <= 100; levee += 1) {
      for (const i of TOUS) {
        const { bas, visible } = bords(i, levee);
        if (!visible) continue;
        assert.ok(bas >= APPUI - EPS, `lame ${i} à ${levee} % : bord bas ${bas}`);
      }
    }
  });

  it("une lame ne se déplace pas quand le tablier remonte — elle se raccourcit", () => {
    // Tant qu'une lame est ENTIÈREMENT sortie, son bord haut est fixe : c'est
    // la définition d'un tablier qui pend.
    for (const i of TOUS) {
      const hauts = [0, 10, 20, 30]
        .map((levee) => bords(i, levee))
        .filter((b) => b.echelle === 1)
        .map((b) => b.haut);
      for (const h of hauts) {
        assert.ok(Math.abs(h - (LINTEAU - i * LAME_H)) < EPS);
      }
    }
  });
});

describe("tablier — hauteur déployée", () => {
  it("tablier entièrement descendu : les 22 lames couvrent exactement la baie", () => {
    const visibles = TOUS.map((i) => bords(i, 0));
    assert.equal(visibles.filter((b) => b.visible).length, NB_LAMES);
    assert.ok(Math.abs(visibles[0].haut - LINTEAU) < EPS);
    assert.ok(Math.abs(visibles[NB_LAMES - 1].bas - APPUI) < EPS);
  });

  it("tablier entièrement relevé : plus aucune lame à rendre", () => {
    assert.equal(TOUS.filter((i) => poserLame(i, 100).visible).length, 0);
  });

  it("la longueur sortie suit la levée, à une lame près", () => {
    for (const levee of [0, 15, 25, 40, 50, 67, 75, 90, 100]) {
      const visibles = TOUS.map((i) => bords(i, levee)).filter((b) => b.visible);
      const sortie = visibles.length === 0 ? 0 : LINTEAU - Math.min(...visibles.map((b) => b.bas));
      const attendue = BAIE_H * (1 - levee / 100);
      assert.ok(
        Math.abs(sortie - attendue) <= LAME_H + EPS,
        `à ${levee} % : ${sortie} m sortis pour ${attendue} m attendus`
      );
    }
  });

  it("relever le tablier ne fait jamais SORTIR de lame supplémentaire", () => {
    let precedent = Infinity;
    for (let levee = 0; levee <= 100; levee += 1) {
      const n = TOUS.filter((i) => poserLame(i, levee).visible).length;
      assert.ok(n <= precedent, `à ${levee} % : ${n} lames après ${precedent}`);
      precedent = n;
    }
  });

  it("les lames sorties sont toujours celles du HAUT, sans trou", () => {
    for (let levee = 0; levee <= 100; levee += 5) {
      const visibles = TOUS.map((i) => poserLame(i, levee).visible);
      const premierMasque = visibles.indexOf(false);
      if (premierMasque === -1) continue;
      assert.ok(
        visibles.slice(premierMasque).every((v) => !v),
        `à ${levee} % : une lame réapparaît après la ${premierMasque}`
      );
    }
  });
});

describe("tablier — robustesse", () => {
  it("borne les levées hors domaine au lieu de sortir de la baie", () => {
    for (const levee of [-50, 0, 100, 150]) {
      for (const i of TOUS) {
        const { haut, bas, echelle } = bords(i, levee);
        assert.ok(Number.isFinite(haut) && Number.isFinite(bas));
        assert.ok(echelle >= 0 && echelle <= 1);
      }
    }
    assert.deepEqual(poserLame(0, -50), poserLame(0, 0));
    assert.deepEqual(poserLame(0, 150), poserLame(0, 100));
  });

  it("ne propage pas de NaN quand la levée n'est pas finie", () => {
    for (const levee of [NaN, Infinity, -Infinity]) {
      const pose = poserLame(3, levee);
      assert.ok(Number.isFinite(pose.y), `y non fini pour levée ${levee}`);
      assert.ok(Number.isFinite(pose.echelle));
    }
  });
});

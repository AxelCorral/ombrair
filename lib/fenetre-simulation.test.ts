import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ANGLE_OUVRANT_MAX,
  angleOuvrant,
  besoinAeration,
  besoinRafraichissement,
  BORNES_FENETRE,
  computeWindowState,
  ecartThermique,
  libelleOuverture,
  OUVERTURE_MORTE,
  penaliteThermique,
  potentielRafraichissement,
  type EnvironnementFenetre,
} from "./fenetre-simulation.ts";
import { PRESETS_FENETRE, PRESET_FENETRE_PAR_DEFAUT } from "./fenetre-presets.ts";

const env = (
  interieure: number,
  exterieure: number,
  luminosite = 50,
  humidite = 50
): EnvironnementFenetre => ({
  temperatureInterieure: interieure,
  temperatureExterieure: exterieure,
  luminosite,
  humidite,
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Grandeurs intermédiaires
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("besoin de rafraîchissement", () => {
  it("est nul tant qu'il ne fait pas trop chaud dedans", () => {
    assert.equal(besoinRafraichissement(env(22, 15)), 0);
    assert.equal(besoinRafraichissement(env(18, 15)), 0);
  });

  it("sature à 30 °C intérieurs", () => {
    assert.equal(besoinRafraichissement(env(30, 15)), 1);
    assert.equal(besoinRafraichissement(env(35, 15)), 1);
  });

  it("progresse linéairement entre les deux", () => {
    assert.equal(besoinRafraichissement(env(26, 15)), 0.5);
  });
});

describe("écart et potentiel de rafraîchissement", () => {
  it("l'écart est signé — positif quand le dehors est plus frais", () => {
    assert.equal(ecartThermique(env(29, 19)), 10);
    assert.equal(ecartThermique(env(25, 36)), -11);
  });

  it("le potentiel est nul dès que le dehors est plus chaud", () => {
    assert.equal(potentielRafraichissement(env(25, 36)), 0);
    assert.equal(potentielRafraichissement(env(25, 25)), 0);
  });

  it("le potentiel sature à 8 °C d'écart", () => {
    assert.equal(potentielRafraichissement(env(29, 21)), 1);
    assert.equal(potentielRafraichissement(env(29, 15)), 1);
  });
});

describe("besoin d'aération", () => {
  it("ne se déclenche qu'au-delà de 60 % d'humidité", () => {
    assert.equal(besoinAeration(env(24, 20, 50, 60)), 0);
    assert.equal(besoinAeration(env(24, 20, 50, 40)), 0);
  });

  it("sature à 85 %", () => {
    assert.equal(besoinAeration(env(24, 20, 50, 85)), 1);
    assert.equal(besoinAeration(env(24, 20, 50, 100)), 1);
  });
});

describe("pénalité thermique", () => {
  it("est nulle quand le dehors est plus frais ou équivalent", () => {
    assert.equal(penaliteThermique(env(27, 21)), 0);
    assert.equal(penaliteThermique(env(27, 27)), 0);
  });

  it("sature à 6 °C de plus dehors", () => {
    assert.equal(penaliteThermique(env(25, 31)), 1);
    assert.equal(penaliteThermique(env(25, 40)), 1);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Les quatre cas exigés par le cahier des charges (§53)
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("décision de la fenêtre — cas de référence", () => {
  it("CAS A · 29 °C dedans, 19 °C dehors → ouverture importante", () => {
    const etat = computeWindowState(env(29, 19));
    assert.ok(
      etat.ouverture >= 0.7,
      `attendu ≥ 0,70 — obtenu ${etat.ouverture.toFixed(3)}`
    );
  });

  it("CAS B · 25 °C dedans, 36 °C dehors → la fenêtre ne s'ouvre pas", () => {
    const etat = computeWindowState(env(25, 36));
    assert.equal(etat.ouverture, 0);
  });

  it("CAS C · 24/20 °C et 82 % d'humidité → ouverture partielle d'aération", () => {
    const etat = computeWindowState(env(24, 20, 30, 82));
    assert.ok(etat.ouverture > 0.2, `attendu > 0,20 — obtenu ${etat.ouverture}`);
    assert.ok(etat.ouverture < 0.55, `attendu < 0,55 — obtenu ${etat.ouverture}`);
    assert.equal(etat.aerationDominante, true);
  });

  it("CAS D · 20/17 °C et 50 % → aucun besoin réel, donc aucune ouverture", () => {
    const etat = computeWindowState(env(20, 17, 50, 50));
    assert.equal(etat.ouverture, 0);
  });
});

describe("principes de la décision", () => {
  it("ouvrir demande un besoin ET un moyen — le terme thermique est un produit", () => {
    // Beaucoup de moyen, aucun besoin.
    assert.equal(computeWindowState(env(21, 5)).ouverture, 0);
    // Beaucoup de besoin, aucun moyen.
    assert.equal(computeWindowState(env(34, 38)).ouverture, 0);
  });

  it("la luminosité n'ouvre jamais rien à elle seule (§14)", () => {
    const sombre = computeWindowState(env(27, 21, 0, 50));
    const plein = computeWindowState(env(27, 21, 100, 50));
    assert.equal(sombre.ouverture, plein.ouverture);
  });

  it("l'aération s'efface quand l'extérieur est plus chaud", () => {
    // Même humidité étouffante, mais 38 °C dehors : on n'ouvre pas.
    assert.equal(computeWindowState(env(24, 38, 50, 95)).ouverture, 0);
    // Alors qu'à 20 °C dehors, on ouvre.
    assert.ok(computeWindowState(env(24, 20, 50, 95)).ouverture > 0.3);
  });

  it("l'aération seule ne met jamais la pièce en courant d'air", () => {
    // Humidité maximale, aucun besoin thermique : plafonné à 45 %.
    const etat = computeWindowState(env(22, 18, 50, 100));
    assert.ok(etat.ouverture <= 0.45 + 1e-9, `obtenu ${etat.ouverture}`);
  });
});

describe("zone morte de l'actionneur", () => {
  it("une demande inférieure au seuil ne fait pas bouger l'ouvrant", () => {
    // 23/17 : besoin 0,125 × potentiel 0,75 = 0,094, sous le seuil.
    assert.equal(computeWindowState(env(23, 17, 35, 55)).ouverture, 0);
  });

  it("une ouverture non nulle est toujours au moins égale au seuil", () => {
    for (let ti = 15; ti <= 35; ti++) {
      for (let te = 5; te <= 45; te += 2) {
        for (const h of [20, 60, 75, 100]) {
          const o = computeWindowState(env(ti, te, 50, h)).ouverture;
          assert.ok(
            o === 0 || o >= OUVERTURE_MORTE,
            `ouverture intermédiaire ${o} pour ${ti}/${te}/${h}`
          );
        }
      }
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Bornes, robustesse (§55)
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("bornes et robustesse", () => {
  it("l'ouverture reste dans [0, 1] sur tout le domaine des curseurs", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti++) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te++) {
        for (const l of [b.luminosite.min, 50, b.luminosite.max]) {
          for (const h of [b.humidite.min, 60, b.humidite.max]) {
            const etat = computeWindowState(env(ti, te, l, h));
            assert.ok(Number.isFinite(etat.ouverture), `NaN pour ${ti}/${te}/${l}/${h}`);
            assert.ok(etat.ouverture >= 0 && etat.ouverture <= 1);
          }
        }
      }
    }
  });

  it("les extrêmes des curseurs produisent les deux comportements attendus", () => {
    const b = BORNES_FENETRE;
    // Tout au minimum : 15 °C dedans, 5 °C dehors, nuit, air sec.
    assert.equal(
      computeWindowState(
        env(b.temperatureInterieure.min, b.temperatureExterieure.min, b.luminosite.min, b.humidite.min)
      ).ouverture,
      0
    );
    // Tout au maximum : 35 °C dedans, 45 °C dehors — surtout pas d'ouverture.
    assert.equal(
      computeWindowState(
        env(b.temperatureInterieure.max, b.temperatureExterieure.max, b.luminosite.max, b.humidite.max)
      ).ouverture,
      0
    );
    // Le pire dedans, le meilleur dehors : ouverture maximale.
    assert.equal(
      computeWindowState(env(b.temperatureInterieure.max, b.temperatureExterieure.min)).ouverture,
      1
    );
  });

  it("survit à des entrées non finies sans produire de NaN", () => {
    const etat = computeWindowState(env(Number.NaN, Number.NaN, Number.NaN, Number.NaN));
    assert.ok(Number.isFinite(etat.ouverture));
    assert.ok(Number.isFinite(angleOuvrant(etat.ouverture)));
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Mécanique et libellés
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("angle de l'ouvrant", () => {
  it("mappe 0 → 0° et 1 → l'angle maximal", () => {
    assert.equal(angleOuvrant(0), 0);
    assert.equal(angleOuvrant(1), ANGLE_OUVRANT_MAX);
  });

  it("est linéaire, pour que le pourcentage affiché corresponde à ce qu'on voit", () => {
    assert.equal(angleOuvrant(0.5), ANGLE_OUVRANT_MAX / 2);
    assert.equal(angleOuvrant(0.25), ANGLE_OUVRANT_MAX / 4);
  });

  it("borne les entrées hors domaine", () => {
    assert.equal(angleOuvrant(-1), 0);
    assert.equal(angleOuvrant(2), ANGLE_OUVRANT_MAX);
  });
});

describe("libellés d'ouverture", () => {
  it("ne dit « Fermée » que lorsque l'ouvrant est effectivement au repos", () => {
    assert.equal(libelleOuverture(0), "Fermée");
    assert.notEqual(libelleOuverture(OUVERTURE_MORTE), "Fermée");
  });

  it("couvre tout le domaine sans trou", () => {
    for (let o = 0; o <= 1.0001; o += 0.01) {
      assert.ok(libelleOuverture(o).length > 0);
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Presets (§17)
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("situations types", () => {
  it("les six situations exigées sont présentes", () => {
    assert.equal(PRESETS_FENETRE.length, 6);
    for (const id of [
      "matin-frais",
      "apres-midi-ete",
      "canicule",
      "rafraichissement-nocturne",
      "air-humide",
      "soleil-air-frais",
    ]) {
      assert.ok(
        PRESETS_FENETRE.some((p) => p.id === id),
        `situation manquante : ${id}`
      );
    }
  });

  it("les identifiants sont uniques", () => {
    const ids = PRESETS_FENETRE.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("toutes les valeurs tiennent dans les bornes des curseurs", () => {
    const b = BORNES_FENETRE;
    for (const p of PRESETS_FENETRE) {
      const e = p.environnement;
      assert.ok(
        e.temperatureInterieure >= b.temperatureInterieure.min &&
          e.temperatureInterieure <= b.temperatureInterieure.max,
        `${p.id} : température intérieure hors bornes`
      );
      assert.ok(
        e.temperatureExterieure >= b.temperatureExterieure.min &&
          e.temperatureExterieure <= b.temperatureExterieure.max,
        `${p.id} : température extérieure hors bornes`
      );
      assert.ok(e.luminosite >= b.luminosite.min && e.luminosite <= b.luminosite.max);
      assert.ok(e.humidite >= b.humidite.min && e.humidite <= b.humidite.max);
    }
  });

  it("la situation par défaut est le scénario héros", () => {
    assert.equal(PRESET_FENETRE_PAR_DEFAUT.id, "soleil-air-frais");
  });

  it("la série couvre tout le registre de la fenêtre", () => {
    /*
     * Plusieurs situations laissent volontairement la fenêtre fermée — elles
     * ne se distinguent que par ce que fait le VOLET et par la stratégie
     * annoncée, ce qui se teste dans `ombrair-automation.test.ts`. Ce qu'on
     * vérifie ici, c'est qu'aucune extrémité du registre ne manque : sans
     * cas fermé, sans cas partiel ou sans cas grand ouvert, le visiteur ne
     * verrait jamais l'amplitude du mécanisme.
     */
    const ouvertures = PRESETS_FENETRE.map((p) => computeWindowState(p.environnement).ouverture);
    assert.ok(
      ouvertures.some((o) => o === 0),
      "aucune situation ne garde la fenêtre fermée"
    );
    assert.ok(
      ouvertures.some((o) => o > 0 && o < 0.55),
      "aucune situation n'entrouvre partiellement la fenêtre"
    );
    assert.ok(
      ouvertures.some((o) => o >= 0.7),
      "aucune situation n'ouvre franchement la fenêtre"
    );
  });

  it("les deux moteurs d'ouverture sont chacun illustrés au moins une fois", () => {
    const etats = PRESETS_FENETRE.map((p) => computeWindowState(p.environnement));
    assert.ok(
      etats.some((e) => e.ouverture > 0 && !e.aerationDominante),
      "aucune situation n'ouvre pour raison thermique"
    );
    assert.ok(
      etats.some((e) => e.aerationDominante),
      "aucune situation n'ouvre pour raison d'humidité"
    );
  });
});

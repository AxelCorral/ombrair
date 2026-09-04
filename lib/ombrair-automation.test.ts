import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  choisirStrategie,
  computeCombinedState,
  conditionsVolet,
  expositionDirecte,
  justifier,
  LIBELLE_STRATEGIE,
  type StrategieOmbrair,
} from "./ombrair-automation.ts";
import { computeWindowState, type EnvironnementFenetre } from "./fenetre-simulation.ts";
import { computeShutterState } from "./volet-simulation.ts";
import { BORNES_FENETRE } from "./fenetre-simulation.ts";
import { PRESETS_FENETRE } from "./fenetre-presets.ts";
import { INCLINAISON_MAX, LEVEE_MAX, LEVEE_MIN } from "./demo/shutter.ts";

const env = (
  interieure: number,
  exterieure: number,
  luminosite: number,
  humidite: number
): EnvironnementFenetre => ({
  temperatureInterieure: interieure,
  temperatureExterieure: exterieure,
  luminosite,
  humidite,
});

const preset = (id: string): EnvironnementFenetre => {
  const p = PRESETS_FENETRE.find((x) => x.id === id);
  if (!p) throw new Error(`situation inconnue : ${id}`);
  return p.environnement;
};

/* ═══════════════════════════════════════════════════════════════════════════
 * Traduction vers les conditions du volet
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("conditions transmises au volet", () => {
  it("le volet reçoit la température EXTÉRIEURE, jamais celle de la pièce", () => {
    const c = conditionsVolet(env(29, 19, 80, 55));
    assert.equal(c.temperature, 19);
  });

  it("l'humidité transmise est celle de la pièce — c'est elle qu'on évacue", () => {
    const c = conditionsVolet(env(24, 20, 30, 82));
    assert.equal(c.humidite, 82);
  });

  it("la luminosité passe telle quelle", () => {
    assert.equal(conditionsVolet(env(24, 20, 37, 50)).luminosite, 37);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Les trois cas combinés exigés (§54)
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("scénarios combinés de référence", () => {
  it("CANICULE · fenêtre fermée et volet fortement protecteur", () => {
    const etat = computeCombinedState(preset("canicule"));

    assert.equal(etat.fenetre.ouverture, 0, "la fenêtre doit rester fermée");
    assert.ok(etat.volet.levee <= 5, `tablier attendu descendu — obtenu ${etat.volet.levee} %`);
    assert.ok(
      etat.volet.inclinaison <= 15,
      `lames attendues presque fermées — obtenu ${etat.volet.inclinaison}°`
    );
    assert.equal(etat.strategie, "protection-renforcee");
  });

  it("RAFRAÎCHISSEMENT NOCTURNE · fenêtre largement ouverte et volet relevé", () => {
    const etat = computeCombinedState(preset("rafraichissement-nocturne"));

    assert.ok(
      etat.fenetre.ouverture >= 0.7,
      `ouverture attendue large — obtenue ${etat.fenetre.ouverture}`
    );
    assert.ok(etat.volet.levee >= 90, `tablier attendu relevé — obtenu ${etat.volet.levee} %`);
    assert.ok(
      etat.volet.inclinaison >= 60,
      `lames attendues ouvertes — obtenu ${etat.volet.inclinaison}°`
    );
    assert.equal(etat.strategie, "rafraichissement-naturel");
  });

  it("SOLEIL + AIR FRAIS · l'ombre et l'air en même temps", () => {
    const etat = computeCombinedState(preset("soleil-air-frais"));

    // La fenêtre est réellement entrouverte — ni fermée, ni grande ouverte.
    assert.ok(
      etat.fenetre.ouverture > 0.25 && etat.fenetre.ouverture < 0.7,
      `ouverture partielle attendue — obtenue ${etat.fenetre.ouverture}`
    );

    // Le volet descend assez pour être VISIBLE : c'est tout l'enjeu du
    // scénario. Sans coordination il resterait à 85 % relevé.
    assert.ok(
      etat.volet.levee <= 75,
      `tablier attendu descendu d'un quart au moins — obtenu ${etat.volet.levee} %`
    );
    assert.ok(
      etat.volet.leveeAutonome > etat.volet.levee,
      "la coordination doit avoir fait descendre le tablier"
    );

    // Les lames restent inclinées : elles coupent le rayonnement sans murer.
    assert.ok(
      etat.volet.inclinaison > 20 && etat.volet.inclinaison < 70,
      `orientation intermédiaire attendue — obtenue ${etat.volet.inclinaison}°`
    );

    assert.equal(etat.strategie, "ombre-et-air");
  });

  it("SOLEIL + AIR FRAIS sans volet reste démonstratif pour la fenêtre seule", () => {
    const etat = computeCombinedState(preset("soleil-air-frais"), false);
    assert.ok(etat.fenetre.ouverture > 0.25);
    assert.notEqual(etat.strategie, "ombre-et-air");
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Règles de coordination
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("règle 1 — le volet reprend la protection que la fenêtre abandonne", () => {
  it("la coordination ne relève JAMAIS le tablier au-dessus de sa décision autonome", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 2) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 3) {
        for (const l of [0, 40, 70, 100]) {
          for (const h of [20, 55, 80, 100]) {
            const etat = computeCombinedState(env(ti, te, l, h));
            assert.ok(
              etat.volet.levee <= etat.volet.leveeAutonome + 1e-9,
              `tablier remonté par coordination : ${etat.volet.leveeAutonome} → ${etat.volet.levee}`
            );
          }
        }
      }
    }
  });

  it("fenêtre fermée, le volet décide exactement comme sur sa propre page", () => {
    // Sans ouverture, l'exposition directe est nulle : aucune correction.
    const e = preset("canicule");
    const combine = computeCombinedState(e);
    const seul = computeShutterState(conditionsVolet(e));
    assert.equal(combine.fenetre.ouverture, 0);
    assert.equal(combine.volet.levee, seul.levee);
    assert.equal(combine.volet.inclinaison, seul.inclinaison);
  });

  it("à ouverture égale, plus de soleil fait descendre davantage le tablier", () => {
    const sombre = computeCombinedState(env(27, 21, 10, 50));
    const clair = computeCombinedState(env(27, 21, 95, 50));
    assert.equal(sombre.fenetre.ouverture, clair.fenetre.ouverture);
    assert.ok(
      clair.volet.levee < sombre.volet.levee,
      `${clair.volet.levee} devrait être inférieur à ${sombre.volet.levee}`
    );
  });

  it("la coordination ne demande jamais plus de 75 % de tablier descendu", () => {
    // Exposition maximale : ouverture pleine et plein soleil.
    const etat = computeCombinedState(env(35, 15, 100, 50));
    assert.ok(etat.volet.levee >= 25 - 1e-9, `obtenu ${etat.volet.levee} %`);
  });
});

describe("règle 2 — les lames gardent un passage d'air (§27)", () => {
  it("la coordination ne referme JAMAIS les lames sous leur décision autonome", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 2) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 3) {
        for (const l of [0, 50, 100]) {
          for (const h of [20, 70, 100]) {
            const etat = computeCombinedState(env(ti, te, l, h));
            assert.ok(
              etat.volet.inclinaison >= etat.volet.inclinaisonAutonome - 1e-9,
              `lames refermées par coordination : ${etat.volet.inclinaisonAutonome} → ${etat.volet.inclinaison}`
            );
          }
        }
      }
    }
  });

  it("aucun état n'annonce de la ventilation devant un volet muré", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 2) {
        for (const l of [0, 30, 60, 100]) {
          for (const h of [20, 50, 75, 100]) {
            const etat = computeCombinedState(env(ti, te, l, h));
            if (etat.fenetre.ouverture <= 0) continue;
            // Fenêtre ouverte ⇒ les lames laissent physiquement passer l'air.
            assert.ok(
              etat.volet.inclinaison > 0,
              `fenêtre à ${etat.fenetre.ouverture} devant des lames jointives (${ti}/${te}/${l}/${h})`
            );
            // Et le passage croît avec l'ouverture demandée.
            assert.ok(
              etat.volet.inclinaison >= 38 * etat.fenetre.ouverture - 1e-9,
              `passage insuffisant : ${etat.volet.inclinaison}° pour ${etat.fenetre.ouverture}`
            );
          }
        }
      }
    }
  });
});

describe("la fenêtre n'est jamais corrigée par le volet (§14)", () => {
  it("afficher ou masquer le volet ne change pas l'ouverture de la fenêtre (§86)", () => {
    for (const p of PRESETS_FENETRE) {
      const avec = computeCombinedState(p.environnement, true);
      const sans = computeCombinedState(p.environnement, false);
      assert.equal(avec.fenetre.ouverture, sans.fenetre.ouverture, p.id);
      assert.equal(avec.angleOuvrant, sans.angleOuvrant, p.id);
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Bornes de sortie
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("bornes et robustesse du moteur combiné", () => {
  it("toutes les sorties restent dans leur domaine, sans NaN", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 2) {
        for (const l of [b.luminosite.min, 50, b.luminosite.max]) {
          for (const h of [b.humidite.min, 60, b.humidite.max]) {
            const e = computeCombinedState(env(ti, te, l, h));
            assert.ok(Number.isFinite(e.fenetre.ouverture));
            assert.ok(Number.isFinite(e.angleOuvrant));
            assert.ok(Number.isFinite(e.volet.levee));
            assert.ok(Number.isFinite(e.volet.inclinaison));
            assert.ok(e.fenetre.ouverture >= 0 && e.fenetre.ouverture <= 1);
            assert.ok(e.angleOuvrant >= 0 && e.angleOuvrant <= 60);
            assert.ok(e.volet.levee >= LEVEE_MIN && e.volet.levee <= LEVEE_MAX);
            assert.ok(e.volet.inclinaison >= 0 && e.volet.inclinaison <= INCLINAISON_MAX);
          }
        }
      }
    }
  });

  it("survit à des entrées non finies", () => {
    const e = computeCombinedState(env(Number.NaN, Number.NaN, Number.NaN, Number.NaN));
    assert.ok(Number.isFinite(e.fenetre.ouverture));
    assert.ok(Number.isFinite(e.volet.levee));
    assert.ok(Number.isFinite(e.volet.inclinaison));
    assert.ok(e.raison.length > 0);
  });

  it("l'exposition directe est nulle si l'un des deux facteurs l'est", () => {
    assert.equal(expositionDirecte(env(27, 21, 0, 50), 1), 0);
    assert.equal(expositionDirecte(env(27, 21, 100, 50), 0), 0);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Stratégies et justifications
 * ═══════════════════════════════════════════════════════════════════════════ */

describe("stratégies", () => {
  it("chaque stratégie porte un libellé", () => {
    const strategies: StrategieOmbrair[] = [
      "neutre",
      "aeration",
      "confort-naturel",
      "rafraichissement-naturel",
      "ombre-et-air",
      "protection-solaire",
      "protection-thermique",
      "protection-renforcee",
    ];
    for (const s of strategies) {
      assert.ok(LIBELLE_STRATEGIE[s]?.length > 0, `libellé manquant : ${s}`);
    }
  });

  it("aucune stratégie ne mentionne le volet quand il n'est pas affiché", () => {
    const b = BORNES_FENETRE;
    const interdites = new Set(["ombre-et-air", "protection-solaire", "protection-renforcee"]);
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 2) {
        for (const l of [0, 60, 100]) {
          for (const h of [20, 70, 100]) {
            const e = computeCombinedState(env(ti, te, l, h), false);
            assert.ok(
              !interdites.has(e.strategie),
              `${e.strategie} annoncée sans volet à l'écran (${ti}/${te}/${l}/${h})`
            );
            assert.ok(!/volet/i.test(e.raison), `raison citant le volet : ${e.raison}`);
          }
        }
      }
    }
  });

  it("« ombre et ventilation » suppose bien une fenêtre ouverte ET du soleil", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 2) {
        for (const l of [0, 30, 60, 100]) {
          for (const h of [20, 60, 100]) {
            const e = computeCombinedState(env(ti, te, l, h));
            if (e.strategie !== "ombre-et-air") continue;
            assert.ok(e.fenetre.ouverture > 0, "fenêtre fermée annoncée en ventilation");
            assert.ok(l >= 55, `soleil insuffisant (${l} %) pour annoncer de l'ombre`);
          }
        }
      }
    }
  });

  it("une fenêtre fermée n'est jamais annoncée en rafraîchissement ou aération", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 2) {
        const e = computeCombinedState(env(ti, te, 50, 70));
        if (e.fenetre.ouverture > 0) continue;
        assert.ok(
          ["neutre", "protection-thermique", "protection-solaire", "protection-renforcee"].includes(
            e.strategie
          ),
          `${e.strategie} annoncée fenêtre fermée (${ti}/${te})`
        );
      }
    }
  });

  it("les six situations produisent six comportements d'ensemble distincts", () => {
    /*
     * La signature retient les QUATRE choses qui bougent à l'écran, angle de
     * lames compris. Ce dernier n'est pas un détail de confort : « Après-midi
     * d'été » et « Canicule » aboutissent tous deux à une fenêtre fermée
     * derrière un tablier descendu, et c'est l'orientation des lames — 16°
     * contre 6° — qui montre que la seconde situation est plus dure que la
     * première. Les valeurs de ces deux situations sont imposées par le
     * cahier des charges (§17) et n'ont pas été ajustées pour les écarter.
     */
    const signatures = PRESETS_FENETRE.map((p) => {
      const e = computeCombinedState(p.environnement);
      return [
        e.strategie,
        Math.round(e.fenetre.ouverture * 10),
        Math.round(e.volet.levee / 10),
        Math.round(e.volet.inclinaison / 5),
      ].join("·");
    });
    assert.equal(new Set(signatures).size, signatures.length, signatures.join(" / "));
  });
});

describe("justifications", () => {
  it("chaque stratégie produit une phrase non vide et ponctuée", () => {
    const b = BORNES_FENETRE;
    const vues = new Set<string>();
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 1) {
        for (const l of [0, 60, 100]) {
          for (const h of [20, 70, 100]) {
            const e = computeCombinedState(env(ti, te, l, h));
            vues.add(e.strategie);
            assert.ok(e.raison.length > 10, `phrase trop courte : ${e.raison}`);
            assert.ok(e.raison.endsWith("."), `phrase non ponctuée : ${e.raison}`);
          }
        }
      }
    }
    // Le domaine des curseurs doit réellement faire apparaître toutes les
    // stratégies : une stratégie inatteignable serait du code mort.
    assert.equal(vues.size, Object.keys(LIBELLE_STRATEGIE).length, [...vues].join(", "));
  });

  it("aucune justification n'affiche « 0 °C plus chaud »", () => {
    const b = BORNES_FENETRE;
    for (let t = b.temperatureInterieure.min; t <= b.temperatureInterieure.max; t++) {
      const e = computeCombinedState(env(t, t, 50, 50));
      assert.ok(!/\b0 °C/.test(e.raison), `écart nul mal formulé : ${e.raison}`);
    }
  });

  it("aucune justification n'affiche de décimale (§89)", () => {
    const b = BORNES_FENETRE;
    for (let ti = b.temperatureInterieure.min; ti <= b.temperatureInterieure.max; ti += 1) {
      for (let te = b.temperatureExterieure.min; te <= b.temperatureExterieure.max; te += 1) {
        const e = computeCombinedState(env(ti, te, 80, 75));
        assert.ok(!/\d[.,]\d/.test(e.raison), `décimale dans : ${e.raison}`);
      }
    }
  });

  it("la justification suit la stratégie, pas l'inverse", () => {
    const e = env(29, 19, 5, 50);
    const fenetre = computeWindowState(e);
    assert.notEqual(
      justifier("protection-thermique", e, fenetre),
      justifier(choisirStrategie(e, fenetre, true), e, fenetre)
    );
  });
});

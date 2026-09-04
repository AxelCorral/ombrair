import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BORNES,
  clamp,
  computeShutterState,
  computeSolarPressure,
  computeVentilationNeed,
  lerp,
  LIBELLE_MODE,
  normaliserHumidite,
  normaliserLuminosite,
  normaliserTemperature,
  smoothstep,
  type Conditions,
} from "./volet-simulation.ts";
import { PRESETS } from "./volet-presets.ts";
import { INCLINAISON_MAX, tauxOuverture } from "./demo/shutter.ts";

const conditions = (t: number, l: number, h: number): Conditions => ({
  temperature: t,
  luminosite: l,
  humidite: h,
});

describe("outils numériques", () => {
  it("clamp borne des deux côtés et survit au non-fini", () => {
    assert.equal(clamp(5, 0, 1), 1);
    assert.equal(clamp(-5, 0, 1), 0);
    assert.equal(clamp(Number.NaN, 0, 1), 0);
  });

  it("smoothstep est plat aux extrémités et vaut 0,5 au milieu", () => {
    assert.equal(smoothstep(0.2, 0.8, 0.1), 0);
    assert.equal(smoothstep(0.2, 0.8, 0.9), 1);
    // Le milieu vaut 0,5 mathématiquement, mais la formule passe par
    // t²(3−2t) : en virgule flottante on obtient 0,4999999999999998. La
    // tolérance porte sur l'arithmétique, pas sur le comportement.
    assert.ok(Math.abs(smoothstep(0.2, 0.8, 0.5) - 0.5) < 1e-12);
  });

  it("smoothstep ne divise pas par zéro sur des seuils égaux", () => {
    assert.equal(smoothstep(0.5, 0.5, 0.4), 0);
    assert.equal(smoothstep(0.5, 0.5, 0.6), 1);
  });

  it("lerp interpole et borne", () => {
    assert.equal(lerp(10, 20, 0.5), 15);
    assert.equal(lerp(10, 20, -1), 10);
    assert.equal(lerp(10, 20, 2), 20);
  });
});

describe("normalisations", () => {
  it("la température n'est une contrainte qu'au-delà de 18 °C", () => {
    assert.equal(normaliserTemperature(10), 0);
    assert.equal(normaliserTemperature(18), 0);
    assert.equal(normaliserTemperature(28), 0.5);
    assert.equal(normaliserTemperature(38), 1);
    assert.equal(normaliserTemperature(45), 1);
  });

  it("la luminosité est proportionnelle", () => {
    assert.equal(normaliserLuminosite(0), 0);
    assert.equal(normaliserLuminosite(50), 0.5);
    assert.equal(normaliserLuminosite(100), 1);
  });

  it("la ventilation ne se déclenche qu'au-delà de 45 % d'humidité", () => {
    assert.equal(normaliserHumidite(20), 0);
    assert.equal(normaliserHumidite(45), 0);
    assert.equal(normaliserHumidite(65), 0.5);
    assert.equal(normaliserHumidite(85), 1);
  });
});

describe("besoin de ventilation", () => {
  it("ne dépend que de l'humidité", () => {
    const a = computeVentilationNeed(conditions(5, 0, 70));
    const b = computeVentilationNeed(conditions(40, 100, 70));
    assert.equal(a, b, "ni la température ni la lumière ne doivent l'influencer");
  });

  it("croît avec l'humidité et sature", () => {
    assert.equal(computeVentilationNeed(conditions(25, 50, 30)), 0);
    assert.equal(computeVentilationNeed(conditions(25, 50, 65)), 0.5);
    assert.equal(computeVentilationNeed(conditions(25, 50, 100)), 1);
  });
});

describe("pression solaire", () => {
  it("le thermique pèse plus que la lumière", () => {
    const chaudSombre = computeSolarPressure(conditions(38, 0, 40));
    const froidLumineux = computeSolarPressure(conditions(18, 100, 40));
    assert.ok(
      chaudSombre > froidLumineux,
      `chaud+sombre (${chaudSombre}) doit primer sur froid+lumineux (${froidLumineux})`
    );
  });

  it("reste dans [0, 1]", () => {
    for (const [t, l] of [[-10, -10], [60, 200], [18, 0], [45, 100]] as const) {
      const p = computeSolarPressure(conditions(t, l, 50));
      assert.ok(p >= 0 && p <= 1, `${t}/${l} → ${p}`);
    }
  });
});

/*
 * ─────────────────────────────────────────────────────────────────────────
 * LES QUATRE CAS DEMANDÉS PAR LE BRIEF.
 *
 * Ils portent sur le COMPORTEMENT — « le volet reste ouvert », « il se ferme
 * significativement » — et non sur des valeurs exactes, qui changeraient au
 * moindre réglage de seuil sans que la démo cesse d'être juste.
 * ───────────────────────────────────────────────────────────────────────── */
describe("cas de référence", () => {
  it("cas 1 — matin doux : le volet reste largement ouvert", () => {
    const e = computeShutterState(conditions(17, 35, 55));
    assert.ok(e.levee >= 90, `levée ${e.levee} % — le tablier doit rester haut`);
    assert.ok(e.inclinaison >= 45, `lames à ${e.inclinaison}° — elles doivent rester ouvertes`);
    assert.equal(e.mode, "ouverture");
  });

  it("cas 2 — canicule et plein soleil : le volet se ferme nettement", () => {
    const e = computeShutterState(conditions(38, 95, 30));
    assert.ok(e.levee <= 10, `levée ${e.levee} % — le tablier doit être descendu`);
    assert.ok(e.inclinaison <= 15, `lames à ${e.inclinaison}° — elles doivent être quasi jointives`);
    assert.equal(e.mode, "protection-renforcee");
    assert.ok(tauxOuverture(e) <= 15, "l'ouverture perçue doit être faible");
  });

  it("cas 3 — chaleur humide : les lames gardent de la ventilation", () => {
    const sec = computeShutterState(conditions(31, 70, 30));
    const humide = computeShutterState(conditions(31, 70, 90));

    // Même pression solaire : seule l'humidité change.
    assert.equal(sec.pressionSolaire, humide.pressionSolaire);
    // Le tablier ne bouge pas — la ventilation ne rouvre jamais la fenêtre.
    assert.equal(sec.levee, humide.levee);
    // Mais les lames s'ouvrent davantage.
    assert.ok(
      humide.inclinaison > sec.inclinaison,
      `humide ${humide.inclinaison}° doit dépasser sec ${sec.inclinaison}°`
    );
    assert.equal(humide.mode, "ventilation");
  });

  it("cas 4 — froid et sombre : le volet reste ouvert", () => {
    const e = computeShutterState(conditions(5, 5, 30));
    assert.equal(e.levee, 100);
    assert.equal(e.mode, "ouverture");
    assert.ok(tauxOuverture(e) >= 95);
  });
});

describe("propriétés de la décision", () => {
  it("le tablier ne remonte jamais quand la pression monte", () => {
    let precedente = 101;
    for (let t = 0; t <= 45; t += 1) {
      const { levee } = computeShutterState(conditions(t, 80, 40));
      assert.ok(levee <= precedente + 1e-9, `remontée à ${t} °C : ${levee} > ${precedente}`);
      precedente = levee;
    }
  });

  it("les lames ne s'ouvrent jamais quand la pression monte, à humidité constante", () => {
    let precedente = INCLINAISON_MAX + 1;
    for (let l = 0; l <= 100; l += 5) {
      const { inclinaison } = computeShutterState(conditions(30, l, 30));
      assert.ok(inclinaison <= precedente + 1e-9, `ouverture à ${l} % : ${inclinaison}`);
      precedente = inclinaison;
    }
  });

  it("l'humidité n'ouvre jamais le tablier", () => {
    const base = computeShutterState(conditions(35, 90, 20));
    for (let h = 20; h <= 100; h += 10) {
      const e = computeShutterState(conditions(35, 90, h));
      assert.equal(e.levee, base.levee, `l'humidité a bougé le tablier à ${h} %`);
    }
  });

  it("l'état reste toujours dans les bornes mécaniques", () => {
    for (let t = -20; t <= 60; t += 7) {
      for (let l = -20; l <= 130; l += 17) {
        for (let h = 0; h <= 120; h += 23) {
          const e = computeShutterState(conditions(t, l, h));
          assert.ok(e.levee >= 0 && e.levee <= 100, `levée ${e.levee}`);
          assert.ok(
            e.inclinaison >= 0 && e.inclinaison <= INCLINAISON_MAX,
            `inclinaison ${e.inclinaison}`
          );
        }
      }
    }
  });

  it("survit à des entrées non finies plutôt que de propager NaN", () => {
    const e = computeShutterState(conditions(Number.NaN, Number.NaN, Number.NaN));
    assert.ok(Number.isFinite(e.levee) && Number.isFinite(e.inclinaison));
  });
});

describe("presets", () => {
  it("restent dans les bornes des curseurs", () => {
    for (const p of PRESETS) {
      const { temperature, luminosite, humidite } = p.conditions;
      assert.ok(
        temperature >= BORNES.temperature.min && temperature <= BORNES.temperature.max,
        `${p.id} : température ${temperature}`
      );
      assert.ok(
        luminosite >= BORNES.luminosite.min && luminosite <= BORNES.luminosite.max,
        `${p.id} : luminosité ${luminosite}`
      );
      assert.ok(
        humidite >= BORNES.humidite.min && humidite <= BORNES.humidite.max,
        `${p.id} : humidité ${humidite}`
      );
    }
  });

  /*
   * Un preset qui produirait le même état qu'un autre n'apprendrait rien au
   * visiteur : la série doit couvrir des comportements distincts.
   */
  it("produisent des comportements réellement différents", () => {
    const etats = PRESETS.map((p) => computeShutterState(p.conditions));
    const signatures = new Set(
      etats.map((e) => `${Math.round(e.levee / 10)}-${Math.round(e.inclinaison / 10)}`)
    );
    assert.ok(
      signatures.size >= 4,
      `${signatures.size} comportements distincts pour ${PRESETS.length} situations`
    );
  });

  it("chaque mode annoncé a un libellé", () => {
    for (const p of PRESETS) {
      const { mode } = computeShutterState(p.conditions);
      assert.ok(LIBELLE_MODE[mode], `mode « ${mode} » sans libellé`);
    }
  });
});

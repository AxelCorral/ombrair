import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CAPTEURS_PAR_GAMME,
  disclaimerPionniers,
  faqPionniers,
  capteursDuPack,
  getCreditsPionniers,
  programmePionniers,
  wordingPionniers,
} from "./pionniers.ts";
import { gammeParId } from "./tarifs.ts";
import { PACKS, offreParId } from "./offres.ts";

describe("getCreditsPionniers", () => {
  it("rend un crédit par capteur", () => {
    assert.equal(getCreditsPionniers(0), 0);
    assert.equal(getCreditsPionniers(1), 1);
    assert.equal(getCreditsPionniers(3), 3);
    assert.equal(getCreditsPionniers(12), 12);
  });

  it("ne rend jamais de valeur négative", () => {
    assert.equal(getCreditsPionniers(-1), 0);
    assert.equal(getCreditsPionniers(-999), 0);
  });

  it("refuse les entrées non finies plutôt que de les propager", () => {
    assert.equal(getCreditsPionniers(Number.NaN), 0);
    assert.equal(getCreditsPionniers(Number.POSITIVE_INFINITY), 0);
  });

  it("tronque une quantité fractionnaire — un demi-capteur ne s'achète pas", () => {
    assert.equal(getCreditsPionniers(2.9), 2);
  });
});

describe("programme", () => {
  it("n'expose aucune valeur monétaire", () => {
    assert.equal(programmePionniers.valeurFinanciereActuelle, null);
  });

  it("ne présente pas le crédit comme cessible", () => {
    assert.equal(programmePionniers.cessible, false);
  });

  /*
   * Garde-fou éditorial. Le brief interdit d'afficher un prix du crédit, une
   * valeur future ou un gain. Le plus sûr est de vérifier qu'AUCUN montant ne
   * traverse les textes du programme : s'il n'y en a pas dans la source de
   * vérité, aucune page ne peut en afficher.
   */
  it("ne laisse passer aucun montant dans les textes du programme", () => {
    const textes: string[] = [
      ...Object.values(wordingPionniers),
      disclaimerPionniers.titre,
      disclaimerPionniers.texte,
      ...faqPionniers.flatMap((q) => [q.question, q.reponse]),
    ];
    for (const texte of textes) {
      assert.ok(!/[€$]|\beuros?\b/i.test(texte), `montant détecté : « ${texte} »`);
    }
  });

  /*
   * Le vocabulaire interdit par le brief est cherché dans les textes qui
   * VENDENT le programme — accroches, FAQ. Le disclaimer en est exclu à
   * dessein : il contient « promesse de rendement » pour la NIER, et c'est
   * précisément la formulation honnête attendue. Interdire le mot partout
   * obligerait à écrire un avertissement plus flou.
   */
  it("écarte les formulations promettant un gain", () => {
    const interdits = [
      /\bgarantie?s?\s+de\s+(gain|rendement)/i,
      /\brendement\b/i,
      /\bdevenez actionnaire\b/i,
      /\bx\s?\d+\b/i,
      /\benrichis/i,
      /\bplus-value\b/i,
    ];
    const textes: string[] = [
      ...Object.values(wordingPionniers),
      ...faqPionniers.map((q) => q.reponse),
    ];
    for (const texte of textes) {
      for (const motif of interdits) {
        assert.ok(!motif.test(texte), `formulation interdite dans « ${texte} »`);
      }
    }
  });

  it("le disclaimer nie explicitement action, titre et rendement", () => {
    const t = disclaimerPionniers.texte;
    assert.match(t, /ne constituent pas/);
    assert.match(t, /actions/);
    assert.match(t, /titres financiers/);
    assert.match(t, /promesse de rendement/);
    assert.match(t, /conditionn/);
  });
});

describe("capteurs des packs", () => {
  it("chaque pack contient exactement un capteur, donc un crédit", () => {
    for (const id of PACKS) {
      const pack = offreParId(id);
      assert.equal(capteursDuPack(pack.produitsInclus), 1, `${id}`);
      assert.equal(getCreditsPionniers(capteursDuPack(pack.produitsInclus)), 1);
    }
  });

  it("un ouvrant seul ne contient aucun capteur", () => {
    assert.equal(capteursDuPack(["volet"]), 0);
    assert.equal(capteursDuPack(["fenetre"]), 0);
  });
});

/*
 * ─────────────────────────────────────────────────────────────────────────
 * TESTS DE GARDE — cohérence avec le catalogue.
 *
 * Les comptes de capteurs sont écrits à la main dans `lib/pionniers.ts`.
 * Ces tests relisent `lib/tarifs.ts` et échouent si la définition d'un
 * produit change sans que le programme suive.
 * ───────────────────────────────────────────────────────────────────────── */
describe("cohérence avec le catalogue", () => {
  it("un produit Capteur vaut un capteur, donc un crédit", () => {
    const capteur = gammeParId("capteur");
    assert.match(capteur.inclus.join(" | "), /Un capteur Ombrair/);
    assert.equal(CAPTEURS_PAR_GAMME.capteur.base, 1);
    assert.equal(getCreditsPionniers(CAPTEURS_PAR_GAMME.capteur.base ?? 0), 1);
  });

  it("ne compte pas Ombrair Link comme un capteur", () => {
    const capteur = gammeParId("capteur");
    assert.match(capteur.inclus.join(" | "), /Ombrair Link/);
    // La passerelle est bien livrée, et pourtant le compte reste à 1.
    assert.equal(CAPTEURS_PAR_GAMME.capteur.base, 1);
  });

  it("ni le volet ni la fenêtre n'embarquent de capteur", () => {
    for (const id of ["volet", "fenetre"] as const) {
      const gamme = gammeParId(id);
      assert.ok(
        !gamme.inclus.some((l) => /capteur/i.test(l)),
        `${id} ne doit pas annoncer de capteur`
      );
      assert.equal(CAPTEURS_PAR_GAMME[id].base, 0);
    }
  });
});

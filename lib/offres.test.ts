import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  OFFRES,
  PACKS,
  PRODUITS,
  estPack,
  formatPrix,
  formatSupplement,
  getBundleSavings,
  getPrixInstallation,
  getPrixProduit,
  getPrixSepare,
  getSuggestions,
  getTotalConfigure,
  offreParId,
  trouverPack,
} from "./offres.ts";

/** Aide de lecture : les tests s'écrivent en euros, le modèle en centimes. */
const eur = (cents: number) => cents / 100;

describe("grille tarifaire", () => {
  it("prix produit", () => {
    assert.equal(eur(getPrixProduit("capteur")), 79.99);
    assert.equal(eur(getPrixProduit("volet")), 349.99);
    assert.equal(eur(getPrixProduit("fenetre")), 1499.99);
    assert.equal(eur(getPrixProduit("pack-capteur-volet")), 399.99);
    assert.equal(eur(getPrixProduit("pack-capteur-fenetre")), 1549.99);
  });

  it("prix installation", () => {
    assert.equal(eur(getPrixInstallation("capteur")), 119.99);
    assert.equal(eur(getPrixInstallation("volet")), 179.99);
    assert.equal(eur(getPrixInstallation("fenetre")), 499.99);
    assert.equal(eur(getPrixInstallation("pack-capteur-volet")), 179.99);
    assert.equal(eur(getPrixInstallation("pack-capteur-fenetre")), 499.99);
  });
});

describe("totaux configurés", () => {
  const sans = { avecInstallation: false };
  const avec = { avecInstallation: true };

  it("sans installation, le total est le prix produit", () => {
    assert.equal(eur(getTotalConfigure("capteur", sans)), 79.99);
    assert.equal(eur(getTotalConfigure("volet", sans)), 349.99);
    assert.equal(eur(getTotalConfigure("fenetre", sans)), 1499.99);
    assert.equal(eur(getTotalConfigure("pack-capteur-volet", sans)), 399.99);
    assert.equal(eur(getTotalConfigure("pack-capteur-fenetre", sans)), 1549.99);
  });

  it("avec installation, les totaux de la grille", () => {
    assert.equal(eur(getTotalConfigure("capteur", avec)), 199.98);
    assert.equal(eur(getTotalConfigure("volet", avec)), 529.98);
    assert.equal(eur(getTotalConfigure("fenetre", avec)), 1999.98);
    assert.equal(eur(getTotalConfigure("pack-capteur-volet", avec)), 579.98);
    assert.equal(eur(getTotalConfigure("pack-capteur-fenetre", avec)), 2049.98);
  });

  it("la quantité multiplie produit et pose ensemble", () => {
    assert.equal(eur(getTotalConfigure("volet", { avecInstallation: true, quantite: 3 })), 1589.94);
    assert.equal(eur(getTotalConfigure("volet", { avecInstallation: false, quantite: 3 })), 1049.97);
  });

  it("une quantité absurde retombe sur une unité", () => {
    assert.equal(eur(getTotalConfigure("volet", { avecInstallation: false, quantite: 0 })), 349.99);
    assert.equal(eur(getTotalConfigure("volet", { avecInstallation: false, quantite: -5 })), 349.99);
  });
});

describe("économie des packs", () => {
  it("Capteur + Volet économise 29,99 €", () => {
    assert.equal(eur(getPrixSepare("pack-capteur-volet")), 429.98);
    assert.equal(eur(getBundleSavings("pack-capteur-volet")), 29.99);
  });

  it("Capteur + Fenêtre économise 29,99 €", () => {
    assert.equal(eur(getPrixSepare("pack-capteur-fenetre")), 1579.98);
    assert.equal(eur(getBundleSavings("pack-capteur-fenetre")), 29.99);
  });

  it("un produit simple n'a pas d'économie", () => {
    for (const p of PRODUITS) assert.equal(getBundleSavings(p), 0);
  });

  /*
   * Le cœur du choix de stocker en centimes. En euros flottants,
   * 79.99 + 349.99 vaut 429.98000000000002 et l'économie affichée
   * deviendrait « 29,990000000000009 € ». Ce test échouerait.
   */
  it("l'économie est exacte, sans dérive de virgule flottante", () => {
    for (const pack of PACKS) {
      const ecart = getPrixSepare(pack) - getPrixProduit(pack);
      assert.ok(Number.isInteger(ecart), "les centimes doivent rester entiers");
      assert.equal(ecart, getBundleSavings(pack));
    }
  });
});

describe("installation des packs", () => {
  /*
   * Règle explicite du brief : l'installation d'un pack a son propre tarif.
   * Additionner les installations des composants donnerait 299,98 € pour le
   * pack Capteur + Volet, au lieu des 179,99 € officiels.
   */
  it("n'est pas la somme des installations des composants", () => {
    const pack = offreParId("pack-capteur-volet");
    const somme = pack.produitsInclus.reduce((s, p) => s + getPrixInstallation(p), 0);
    assert.equal(eur(somme), 299.98);
    assert.notEqual(pack.prixInstallationCents, somme);
    assert.equal(eur(pack.prixInstallationCents), 179.99);
  });
});

describe("packs et suggestions", () => {
  it("retrouve le pack correspondant à un ensemble de produits", () => {
    assert.equal(trouverPack(["capteur", "volet"])?.id, "pack-capteur-volet");
    assert.equal(trouverPack(["volet", "capteur"])?.id, "pack-capteur-volet");
    assert.equal(trouverPack(["capteur", "fenetre"])?.id, "pack-capteur-fenetre");
    assert.equal(trouverPack(["volet", "fenetre"]), null);
    assert.equal(trouverPack(["capteur"]), null);
  });

  it("suggère d'abord le pack qui contient le produit choisi", () => {
    const s = getSuggestions("volet");
    assert.equal(s[0].id, "pack-capteur-volet");
  });

  it("propose au plus deux suggestions", () => {
    for (const id of Object.keys(OFFRES) as (keyof typeof OFFRES)[]) {
      assert.ok(getSuggestions(id).length <= 2, `trop de suggestions pour ${id}`);
    }
  });

  it("un pack ne repropose ni lui-même ni ses composants", () => {
    const s = getSuggestions("pack-capteur-volet").map((o) => o.id);
    assert.ok(!s.includes("pack-capteur-volet"));
    assert.ok(!s.includes("capteur"));
    assert.ok(!s.includes("volet"));
  });

  it("un pack peut suggérer l'autre ouvrant", () => {
    const s = getSuggestions("pack-capteur-volet").map((o) => o.id);
    assert.ok(s.includes("fenetre") || s.includes("pack-capteur-fenetre"));
  });

  it("estPack distingue produits et packs", () => {
    assert.equal(estPack("volet"), false);
    assert.equal(estPack("pack-capteur-volet"), true);
  });
});

describe("format monétaire", () => {
  it("rend le format français attendu", () => {
    // L'espace des milliers d'Intl est insécable : on compare sans lui.
    const norm = (s: string) => s.replace(/\s/gu, " ");
    assert.equal(norm(formatPrix(7_999)), "79,99 €");
    assert.equal(norm(formatPrix(34_999)), "349,99 €");
    assert.equal(norm(formatPrix(149_999)), "1 499,99 €");
    assert.equal(norm(formatPrix(204_998)), "2 049,98 €");
  });

  it("n'écrit jamais un point décimal ni un symbole en tête", () => {
    for (const cents of [7_999, 149_999, 204_998]) {
      const s = formatPrix(cents);
      assert.ok(!/\d\.\d/.test(s), `point décimal dans « ${s} »`);
      assert.ok(!/^€/.test(s), `symbole en tête dans « ${s} »`);
    }
  });

  it("formate un supplément nul sans décimales", () => {
    assert.equal(formatSupplement(0), "+0 €");
    assert.equal(formatSupplement(17_999).replace(/\s/gu, " "), "+179,99 €");
  });
});

describe("cohérence du modèle", () => {
  it("chaque offre déclare au moins un produit", () => {
    for (const offre of Object.values(OFFRES)) {
      assert.ok(offre.produitsInclus.length >= 1, `${offre.id} ne livre rien`);
    }
  });

  it("un pack livre au moins deux produits, un produit exactement un", () => {
    for (const offre of Object.values(OFFRES)) {
      if (offre.type === "pack") assert.ok(offre.produitsInclus.length >= 2);
      else assert.equal(offre.produitsInclus.length, 1);
    }
  });

  it("tous les montants sont des centimes entiers positifs", () => {
    for (const offre of Object.values(OFFRES)) {
      for (const cents of [offre.prixProduitCents, offre.prixInstallationCents]) {
        assert.ok(Number.isInteger(cents) && cents > 0, `${offre.id} : ${cents}`);
      }
    }
  });
});

import { Cpu, Radio, Wifi } from "lucide-react";

/**
 * Explication d'Ombrair Link.
 *
 * Le nom apparaissait deux fois sur tout le site sans être défini nulle
 * part, et la même chose s'appelait ailleurs « la passerelle » sans que le
 * lien soit fait. Un visiteur ne pouvait pas savoir s'il s'agissait d'un
 * boîtier, d'un protocole, d'un abonnement ou d'un service.
 *
 * Le parti pris est de l'expliquer là où on l'achète — sur la page du kit
 * capteur — plutôt que de créer une page technique que personne n'irait
 * lire. Trois rôles, une chaîne, et la précision qui compte pour quelqu'un
 * qui a déjà une box : ce n'est pas un boîtier de plus à côté du routeur.
 */
const ROLES = [
  {
    icone: Radio,
    titre: "Il écoute",
    texte:
      "Les capteurs intérieurs et extérieur lui envoient leurs relevés en radio, sans passer par internet.",
  },
  {
    icone: Cpu,
    titre: "Il décide",
    texte:
      "La comparaison intérieur / extérieur et le déclenchement des ouvertures se calculent chez vous, dans le boîtier.",
  },
  {
    icone: Wifi,
    titre: "Il commande, et vous informe",
    texte:
      "Il pilote les modules clipsés dans les coffres de volets, et remonte l'état du logement à l'application par le Wi-Fi.",
  },
];

export function OmbrairLinkExplication() {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-border bg-card p-8">
      <div className="flex flex-col gap-2">
        <p className="t-eyebrow text-muted-foreground">
          Compris dans le kit
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Le cerveau local : Ombrair Link
        </h2>
        <p className="max-w-2xl t-support leading-relaxed text-muted-foreground">
          Ombrair Link réunit trois fonctions dans un seul boîtier : la passerelle qui reçoit les
          capteurs, la logique qui décide du bon moment, et la commande qui actionne les volets.
          C&apos;est ce qui évite d&apos;ajouter une box domotique séparée à côté de votre routeur.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {ROLES.map(({ icone: Icone, titre, texte }) => (
          <li key={titre} className="flex flex-col gap-2">
            <Icone className="size-5 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-medium">{titre}</h3>
            <p className="t-support leading-relaxed text-muted-foreground">{texte}</p>
          </li>
        ))}
      </ul>

      {/* La chaîne complète, en une ligne lisible sans schéma. */}
      <p className="border-t border-border pt-6 font-mono t-caption leading-relaxed text-muted-foreground">
        Capteurs → radio locale → <span className="text-foreground">Ombrair Link</span> → décision
        sur place → volets et fenêtres. Et en parallèle : Ombrair Link → Wi-Fi → application.
      </p>

      <p className="t-support text-muted-foreground">
        Sans internet, la mesure et la commande automatique continuent : seule la consultation à
        distance depuis l&apos;application s&apos;interrompt.
      </p>
    </section>
  );
}

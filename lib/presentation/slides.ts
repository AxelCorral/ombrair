/**
 * Métadonnées et notes orales de la présentation « produits et services ».
 * Le contenu visuel vit dans `components/presentation/slides/*`; ce fichier
 * porte le fil narratif, les durées et les transitions, pour que l'oral
 * puisse être préparé sans lire le code des diapositives.
 *
 * Durée cible totale : environ 7 minutes.
 */

export interface NoteSlide {
  id: string;
  titreCourt: string;
  /** Durée de parole visée, en secondes. */
  duree: number;
  message: string;
  points: string[];
  transition: string;
}

export const notesSlides: NoteSlide[] = [
  {
    id: "intro",
    titreCourt: "Ombrair",
    duree: 45,
    message:
      "Ombrair ne vend pas « un volet connecté » : c'est un ensemble qui va du capteur jusqu'au service après installation.",
    points: [
      "Poser le sujet : ce que nous vendons et ce que nous fournissons, pas l'histoire de l'entreprise.",
      "Annoncer les cinq briques : capteurs, équipements motorisés, application, installation, maintenance.",
    ],
    transition: "« Commençons par la partie que nous maîtrisons de bout en bout : les capteurs. »",
  },
  {
    id: "capteurs",
    titreCourt: "Les capteurs",
    duree: 60,
    message:
      "La technologie matérielle développée directement par Ombrair, ce sont les capteurs — conçus, fabriqués, installés et suivis par nous.",
    points: [
      "Insister sur la chaîne complète : concevoir, fabriquer, installer, suivre.",
      "Présenter les grandeurs mesurées : température, humidité, luminosité, qualité de l'air.",
      "Ne donner aucun chiffre technique : ni autonomie, ni portée radio, ni précision — ces données n'existent pas dans le projet.",
    ],
    transition: "« En revanche, tout ce qui bouge dans le logement ne sort pas de nos ateliers. »",
  },
  {
    id: "equipements",
    titreCourt: "Les équipements",
    duree: 65,
    message:
      "Les volets et les fenêtres motorisés viennent de fabricants spécialisés. Nous les sélectionnons, les revendons, les installons et les intégrons.",
    points: [
      "Assumer clairement le point : nous ne sommes ni menuisiers ni fabricants de motorisation.",
      "Expliquer le choix industriel : on ne réinvente pas un volet, on rend intelligent celui qui existe.",
      "Formulation à tenir : « volets motorisés proposés et installés par Ombrair », jamais « nos volets fabriqués par Ombrair ».",
    ],
    transition: "« Voyons ce que donne l'ensemble une fois installé. »",
  },
  {
    id: "fonctionnement",
    titreCourt: "Le fonctionnement",
    duree: 60,
    message:
      "Le capteur mesure, le système décide, l'équipement agit, l'application rend compte. Aucune brique ne vaut sans les autres.",
    points: [
      "Laisser l'animation dérouler la séquence : mesure, analyse, décision, fermeture, mise à jour de l'app.",
      "Énoncer la règle de fond : quand l'extérieur est plus chaud, on ferme ; quand il devient plus frais, on ouvre.",
      "Préciser à l'oral qu'il s'agit d'un scénario de démonstration et qu'aucun gain de température n'est promis.",
    ],
    transition: "« Et le client, lui, voit tout cela depuis une seule application. »",
  },
  {
    id: "application",
    titreCourt: "L'application",
    duree: 60,
    message:
      "L'application est le centre de contrôle de l'installation, et son accès est inclus à vie avec l'achat.",
    points: [
      "Présenter les quatre familles d'usage plutôt qu'une liste de fonctions : piloter, surveiller, automatiser, être assisté.",
      "Point commercial à ne pas rater : accès inclus à vie, sans abonnement pour les fonctions principales.",
      "Ombrair+ existe mais reste facultatif — ne jamais le présenter comme nécessaire.",
    ],
    transition: "« Reste la partie qu'on oublie souvent en domotique : avant et après la pose. »",
  },
  {
    id: "services",
    titreCourt: "Les services",
    duree: 55,
    message: "Une bonne partie de la valeur d'Ombrair n'est pas dans le carton : c'est du service.",
    points: [
      "Avant : conseil, vérification de compatibilité — tous les volets existants ne sont pas éligibles.",
      "Pendant : fourniture, pose, configuration, mise en service.",
      "Après : maintenance, suivi des capteurs, assistance, avec l'application comme point d'entrée.",
    ],
    transition: "« Concrètement, cela se décline en trois niveaux d'offre. »",
  },
  {
    id: "gammes",
    titreCourt: "Les gammes",
    duree: 55,
    message: "Trois portes d'entrée selon ce que le client possède déjà. Le point de départ, c'est son logement.",
    points: [
      "Le capteur pour mesurer, le volet pour protéger du soleil, la fenêtre pour ventiler. Selon le logement, on n'installe pas forcément les trois.",
      "Préciser que ce sont des prix de départ : au-delà, c'est du devis sur mesure.",
      "Mentionner l'offre Pro sur devis pour bailleurs, EHPAD et établissements scolaires.",
      "Répéter le point clé : dans les trois cas, l'application est incluse à vie.",
    ],
    transition: "« Pour résumer, du capteur jusqu'au service. »",
  },
  {
    id: "conclusion",
    titreCourt: "Conclusion",
    duree: 40,
    message:
      "Ombrair conçoit la couche intelligente — capteurs, intégration, logiciel, services — et fournit les équipements motorisés qu'elle installe et accompagne.",
    points: [
      "Reprendre la convergence : capteurs, équipements, application, installation, maintenance.",
      "Rappeler que « concevoir » est la seule étape où nous fabriquons du matériel.",
      "Terminer sur la baseline, puis ouvrir les questions.",
    ],
    transition: "Fin — laisser la diapositive projetée pendant les questions.",
  },
];

export const dureeTotaleSecondes = notesSlides.reduce((total, note) => total + note.duree, 0);

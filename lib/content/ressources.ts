export interface Article {
  slug: string;
  titre: string;
  chapo: string;
  contenu: string[];
  sources: { label: string; href: string }[];
}

export const articles: Article[] = [
  {
    slug: "rafraichissement-nocturne",
    titre: "Le rafraîchissement nocturne, une routine à ne pas rater",
    chapo:
      "Le geste le plus efficace contre la chaleur ne coûte rien : ouvrir la nuit, fermer le jour. Encore faut-il le faire au bon moment.",
    contenu: [
      "L'air extérieur est souvent plus frais que l'air intérieur entre la fin de nuit et le petit matin. C'est la fenêtre à exploiter : aérer largement à ce moment-là, puis tout refermer — fenêtres et volets — avant que la chaleur ne remonte en milieu de matinée. Passé ce moment, la fraîcheur gagnée pendant la nuit se dissipe en quelques minutes si on rouvre.",
      "Dans un logement traversant, ouvrir des façades opposées laisse l'air circuler d'un côté à l'autre. Sur plusieurs niveaux, ouvrir en bas et en haut accélère l'évacuation de l'air chaud, qui monte naturellement et se fait remplacer par l'air plus frais entrant par le bas.",
      "C'est exactement la logique qu'Ombrair automatise : comparer en continu la température intérieure et extérieure, pour ouvrir au bon moment sans que quelqu'un du foyer n'ait à y penser à 5h du matin.",
    ],
    sources: [
      {
        label: "Ademe — Canicule : comment garder son logement au frais ?",
        href: "https://agirpourlatransition.ademe.fr/particuliers/proteger-sante/periode-canicule/canicule-comment-garder-logement-frais",
      },
    ],
  },
  {
    slug: "inertie-thermique",
    titre: "L'inertie thermique, le réservoir de fraîcheur invisible",
    chapo:
      "Les murs d'un logement ne font pas que le protéger de la pluie : ils stockent la fraîcheur de la nuit pour la restituer le jour — à condition de leur en laisser l'occasion.",
    contenu: [
      "L'inertie thermique désigne la capacité des matériaux d'un bâtiment à absorber, stocker puis restituer lentement la chaleur. Refroidies pendant la nuit, les parois d'un logement à bonne inertie deviennent un réservoir de fraîcheur qui absorbe une partie de la chaleur de la journée suivante, limitant la hausse de température intérieure.",
      "Ce mécanisme a une limite : une inertie importante, sans baisse significative de la température extérieure pendant plusieurs jours consécutifs de canicule, peut au contraire prolonger l'effet de la chaleur emmagasinée. L'inertie seule ne suffit pas — elle doit être rechargée en fraîcheur chaque nuit pour fonctionner.",
      "Les volets jouent un rôle direct dans cette mécanique : fermés pendant les heures les plus chaudes, ils évitent que le rayonnement solaire direct ne vienne chauffer les parois et les vitrages, réduisant d'autant la charge thermique que le bâtiment doit ensuite évacuer.",
    ],
    sources: [
      {
        label: "Ademe — Canicule : comment garder son logement au frais ?",
        href: "https://agirpourlatransition.ademe.fr/particuliers/proteger-sante/periode-canicule/canicule-comment-garder-logement-frais",
      },
      {
        label: "Tout sur l'isolation — Inertie du bâtiment et confort d'été",
        href: "https://www.toutsurlisolation.com/inertie-du-batiment-et-confort-dete",
      },
    ],
  },
  {
    slug: "climatisation-pas-seule-reponse",
    titre: "Pourquoi la climatisation n'est pas la seule réponse",
    chapo:
      "Face à la multiplication des vagues de chaleur, l'Ademe défend une approche où la climatisation arrive en dernier recours, après les solutions passives.",
    contenu: [
      "Selon l'Ademe, la climatisation ne peut pas être la seule réponse aux vagues de chaleur croissantes. L'agence propose une approche combinant isolation, protections solaires extérieures et ventilation nocturne naturelle avant d'envisager un système actif de refroidissement.",
      "Les climatiseurs rejettent la chaleur qu'ils extraient à l'intérieur vers l'extérieur, ce qui aggrave l'îlot de chaleur urbain à l'échelle d'un quartier ou d'une ville. Des travaux de modélisation appliqués à l'Île-de-France ont ainsi estimé qu'une généralisation de la climatisation pourrait faire grimper les températures extérieures de jusqu'à 2°C à Paris.",
      "Ce n'est pas un argument contre la climatisation en soi — dans certaines situations, notamment pour les personnes vulnérables, elle reste nécessaire. C'est un argument pour la faire venir en dernier, après avoir traité ce qui peut l'être passivement : protections solaires, ventilation, inertie du bâti.",
    ],
    sources: [
      {
        label: "Ademe Infos — Vagues de chaleur : la climatisation va-t-elle devenir indispensable ?",
        href: "https://infos.ademe.fr/changement-climatique/2024/vagues-de-chaleur-la-climatisation-va-t-elle-devenir-indispensable/",
      },
    ],
  },
  {
    slug: "canicule-personnes-agees",
    titre: "Canicule et personnes âgées : les gestes qui comptent",
    chapo:
      "Les personnes âgées sont parmi les plus vulnérables aux fortes chaleurs. Quelques gestes simples, pris tôt, font une vraie différence.",
    contenu: [
      "D'après les recommandations officielles, protéger une personne âgée pendant un épisode de forte chaleur repose sur des gestes simples et répétés : boire de l'eau régulièrement même sans soif, s'humidifier le corps plusieurs fois par jour (visage, avant-bras), rester dans une pièce fraîche pendant les heures les plus chaudes, et éviter tout effort physique intense.",
      "Une pièce fraîche du logement, identifiée à l'avance, sert de refuge pendant les pics de chaleur. C'est aussi l'une des situations où les volets font une différence directe et mesurable : une pièce dont les ouvertures restent fermées côté soleil pendant la journée se réchauffe nettement moins vite.",
      "Il est recommandé de s'inscrire sur le registre communal des personnes vulnérables, qui permet aux services municipaux de prendre contact en cas d'alerte. Pour toute question pendant un épisode de canicule, le numéro Canicule Info Service (0800 06 66 66, appel gratuit, 9h-19h, ouvert uniquement lors des périodes de fortes chaleurs) donne des conseils de conduite à tenir. En cas d'urgence, le Samu s'appelle au 15.",
    ],
    sources: [
      {
        label: "Pour les personnes âgées (gouv.fr) — Conseils et gestes simples face aux fortes chaleurs",
        href: "https://www.pour-les-personnes-agees.gouv.fr/actualites/conseils-et-gestes-simples-a-adopter-pour-se-proteger-des-fortes-chaleurs",
      },
    ],
  },
];

/**
 * Mots par minute retenus pour l'estimation du temps de lecture. Valeur
 * courante pour un adulte lisant du français en ligne. C'est une hypothèse,
 * pas une mesure : elle est arrondie à la minute et présentée comme un
 * ordre de grandeur, jamais comme une durée exacte.
 */
export const MOTS_PAR_MINUTE = 200;

/**
 * Temps de lecture, DÉRIVÉ du texte de l'article. Contrairement à une date
 * de publication — que le projet n'a pas et qu'il serait malhonnête
 * d'inventer — cette valeur se calcule réellement à partir du contenu.
 */
export function tempsLectureMinutes(article: Article): number {
  const mots = [article.chapo, ...article.contenu]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
}

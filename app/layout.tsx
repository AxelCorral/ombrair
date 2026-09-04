import type { Metadata, Viewport } from "next";
import { Outfit, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { SCRIPT_THEME_INITIAL, ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

/**
 * Titrage et logotype en Outfit, conformément à la charte retenue
 * (concept 07) : Light 300 pour le logotype, Medium 500 pour les titres.
 * Remplace Archivo, qui appartenait à la direction précédente.
 */
const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ombrair.vercel.app"),
  title: {
    default: "Ombrair — la fraîcheur, avant la chaleur",
    template: "%s — Ombrair",
  },
  description:
    "Volets et fenêtres connectés qui ferment avant la chaleur et ouvrent quand l'air extérieur devient plus frais. Projet étudiant fictif, Université Toulouse Jean Jaurès.",
  applicationName: "Ombrair",
  openGraph: {
    title: "Ombrair — la fraîcheur, avant la chaleur",
    description:
      "Capteurs, volets et fenêtres motorisés pilotés ensemble. Projet étudiant fictif, Université Toulouse Jean Jaurès.",
    siteName: "Ombrair",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og.png?v=2", width: 1200, height: 630, alt: "Ombrair" }],
  },
};

/**
 * Couleur de la barre d'adresse mobile : Chaux en thème clair, Nuit en
 * thème sombre — les deux fonds de la charte.
 *
 * Seuls hex en dur du projet, et ils sont inévitables : cette métadonnée est
 * sérialisée côté serveur en balise <meta>, sans accès aux variables CSS.
 * À tenir synchronisés avec --color-chaux et --color-nuit de globals.css.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#161d23" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      // Le script anti-flash pose `dark` et `color-scheme` sur <html> avant
      // que React n'hydrate : l'écart avec le rendu serveur est voulu.
      suppressHydrationWarning
      className={`${outfit.variable} ${instrumentSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Pose la classe `dark` avant le premier rendu : sans cela, une
            page ouverte en mode nuit clignoterait en clair à l'hydratation. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME_INITIAL }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

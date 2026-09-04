import type { Metadata } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/app-demo/bottom-nav";
import { EtatDemoProvider } from "@/components/app-demo/etat-provider";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { OmbrairLogo } from "@/components/brand/ombrair-logo";
import { MENTION_DEMO } from "@/lib/mock/scenario";

export const metadata: Metadata = {
  title: "Démo de l'application",
  description:
    "Démonstration de l'application Ombrair avec des données simulées : pilotage des ouvrants, programmes, historique.",
};

/**
 * L'app suit désormais le thème choisi par l'utilisateur, comme le site :
 * elle ne force plus `.dark` en permanence.
 */
export default function AppDemoLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Ombrair — retour au site">
            <OmbrairLogo variant="horizontal" size="xs" className="text-primary" />
          </Link>
          <ThemeToggle className="size-8 shrink-0" />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {MENTION_DEMO}{" "}
          <Link href="/" className="underline underline-offset-2">
            Retour au site
          </Link>
        </p>
      </div>

      <EtatDemoProvider>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>
      </EtatDemoProvider>

      <BottomNav />
    </div>
  );
}

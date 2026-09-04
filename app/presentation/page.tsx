import type { Metadata } from "next";
import { PresentationShell } from "@/components/presentation/presentation-shell";
import { SlideIntro } from "@/components/presentation/slides/slide-intro";
import { SlideCapteurs } from "@/components/presentation/slides/slide-capteurs";
import { SlideEquipements } from "@/components/presentation/slides/slide-equipements";
import { SlideFonctionnement } from "@/components/presentation/slides/slide-fonctionnement";
import { SlideApplication } from "@/components/presentation/slides/slide-application";
import { SlideServices } from "@/components/presentation/slides/slide-services";
import { SlideGammes } from "@/components/presentation/slides/slide-gammes";
import { SlideConclusion } from "@/components/presentation/slides/slide-conclusion";

export const metadata: Metadata = {
  title: "Présentation — produits et services",
  description:
    "Présentation projetée des produits et services Ombrair : capteurs conçus en interne, équipements motorisés installés, application incluse à vie et services associés.",
};

export default function PresentationPage() {
  return (
    <PresentationShell
      slides={[
        <SlideIntro key="intro" />,
        <SlideCapteurs key="capteurs" />,
        <SlideEquipements key="equipements" />,
        <SlideFonctionnement key="fonctionnement" />,
        <SlideApplication key="application" />,
        <SlideServices key="services" />,
        <SlideGammes key="gammes" />,
        <SlideConclusion key="conclusion" />,
      ]}
    />
  );
}

import { SlideFrame } from "@/components/presentation/slide-frame";

const MAILLONS = [
  { nom: "Fabricants spécialisés", role: "conçoivent et fabriquent" },
  { nom: "Ombrair", role: "sélectionne · revend · installe · configure · intègre" },
  { nom: "Client", role: "une installation qui fonctionne" },
];

export function SlideEquipements() {
  return (
    <SlideFrame surtitre="Ce que nous fournissons et installons" titre="Volets et fenêtres motorisés">
      <div className="grid flex-1 grid-cols-1 items-center gap-[3vw] lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-[2vh]">
          <div className="grid grid-cols-2 gap-[1.5vw]">
            {["Volets motorisés", "Fenêtres motorisées"].map((famille, i) => (
              <div
                key={famille}
                className="anim-reveal rounded-[var(--radius-sm)] border border-border px-[1.4vw] py-[2vh]"
                style={{ ["--i" as string]: 3 + i }}
              >
                <p className="font-display text-[clamp(1rem,1.6vw,1.7rem)] font-bold">{famille}</p>
                <p className="mt-1 text-[clamp(0.7rem,0.9vw,1rem)] text-muted-foreground">
                  Équipements de fabricants spécialisés
                </p>
              </div>
            ))}
          </div>

          <ol className="flex flex-col gap-[1vh]">
            {MAILLONS.map((maillon, i) => (
              <li key={maillon.nom}>
                <div
                  className={`anim-reveal flex flex-wrap items-baseline justify-between gap-x-[1.5vw] gap-y-1 rounded-[var(--radius-sm)] px-[1.4vw] py-[1.4vh] ${
                    i === 1 ? "bg-chaux text-nuit" : "border border-border"
                  }`}
                  style={{ ["--i" as string]: 5 + i * 2 }}
                >
                  <span className="font-display text-[clamp(0.95rem,1.4vw,1.5rem)] font-bold">
                    {maillon.nom}
                  </span>
                  <span
                    className={`text-[clamp(0.7rem,0.9vw,1rem)] ${
                      i === 1 ? "text-nuit/75" : "text-muted-foreground"
                    }`}
                  >
                    {maillon.role}
                  </span>
                </div>
                {i < MAILLONS.length - 1 ? (
                  <div
                    className="anim-reveal mx-auto h-[1.4vh] w-px bg-border"
                    style={{ ["--i" as string]: 6 + i * 2 }}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <aside
          className="anim-reveal flex h-full flex-col justify-center rounded-[var(--radius-sm)] border border-chaux/40 bg-persienne px-[1.6vw] py-[3vh]"
          style={{ ["--i" as string]: 10 }}
        >
          <div aria-hidden="true" className="mb-[2vh] flex flex-col gap-[0.5vh]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-[0.5vh] w-full rounded-[2px] bg-chaux/25" />
            ))}
          </div>
          <p className="font-display text-[clamp(1.1rem,1.8vw,2rem)] font-bold">Capteurs Ombrair</p>
          <p className="mt-[1.5vh] text-[clamp(0.85rem,1.1vw,1.25rem)]">
            Conçus et fabriqués par Ombrair.
          </p>
          <p className="mt-[1.5vh] text-[clamp(0.72rem,0.92vw,1.05rem)] text-muted-foreground">
            Nous ne concevons ni ne fabriquons les volets et les fenêtres : nous les choisissons, les
            posons et les rendons intelligents.
          </p>
        </aside>
      </div>
    </SlideFrame>
  );
}

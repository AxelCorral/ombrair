interface Etape {
  titre: string;
  texte: string;
}

export function EtapesInstallation({ etapes }: { etapes: Etape[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {etapes.map((etape, i) => (
        <li key={etape.titre} className="flex gap-4">
          <span className="font-mono t-support text-muted-foreground">0{i + 1}</span>
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg font-bold">{etape.titre}</h3>
            <p className="t-support text-muted-foreground">{etape.texte}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

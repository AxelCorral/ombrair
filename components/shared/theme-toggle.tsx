"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, basculer } = useTheme();
  const versNuit = theme === "jour";

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={theme === "nuit"}
      aria-label={versNuit ? "Passer en mode nuit" : "Passer en mode jour"}
      title={versNuit ? "Passer en mode nuit" : "Passer en mode jour"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted",
        className
      )}
    >
      {versNuit ? (
        <Moon className="size-4" aria-hidden="true" />
      ) : (
        <Sun className="size-4" aria-hidden="true" />
      )}
      {/* Annonce le changement d'état aux lecteurs d'écran. */}
      <span aria-live="polite" className="sr-only">
        Mode {theme === "nuit" ? "nuit" : "jour"} actif
      </span>
    </button>
  );
}

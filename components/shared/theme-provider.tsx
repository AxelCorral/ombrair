"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Thème jour / nuit, partagé entre le site et la démonstration `/app`.
 *
 * Trois états possibles : « jour », « nuit », ou « systeme » tant que
 * l'utilisateur n'a rien choisi — dans ce dernier cas on suit
 * `prefers-color-scheme`. La préférence est conservée dans localStorage.
 *
 * Le thème est appliqué en posant (ou non) la classe `dark` sur <html>,
 * donc il pilote les mêmes alias sémantiques que le reste du projet. Aucun
 * second design system n'est introduit.
 */

export type Preference = "jour" | "nuit" | "systeme";
export type ThemeEffectif = "jour" | "nuit";

const CLE_STOCKAGE = "ombrair-theme";

interface ContexteTheme {
  preference: Preference;
  theme: ThemeEffectif;
  definirPreference: (preference: Preference) => void;
  basculer: () => void;
}

const Contexte = createContext<ContexteTheme | null>(null);

function lirePreference(): Preference {
  if (typeof window === "undefined") return "systeme";
  try {
    const valeur = window.localStorage.getItem(CLE_STOCKAGE);
    if (valeur === "jour" || valeur === "nuit") return valeur;
  } catch {
    // localStorage indisponible (navigation privée, site data bloqué) :
    // on retombe simplement sur la préférence système.
  }
  return "systeme";
}

function themeSysteme(): ThemeEffectif {
  if (typeof window === "undefined") return "jour";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "nuit" : "jour";
}

export function ThemeProvider({
  children,
  /** Force un thème pour une portée donnée (la démo `/app` par exemple). */
  forcer,
}: {
  children: React.ReactNode;
  forcer?: ThemeEffectif;
}) {
  const [preference, setPreference] = useState<Preference>("systeme");
  const [systeme, setSysteme] = useState<ThemeEffectif>("jour");

  // Lecture après montage : le rendu serveur ne connaît pas la préférence,
  // le lire ici évite toute divergence d'hydratation.
  useEffect(() => {
    setPreference(lirePreference());
    setSysteme(themeSysteme());
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSysteme(media.matches ? "nuit" : "jour");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme: ThemeEffectif = forcer ?? (preference === "systeme" ? systeme : preference);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "nuit");
    document.documentElement.style.colorScheme = theme === "nuit" ? "dark" : "light";
  }, [theme]);

  const definirPreference = useCallback((valeur: Preference) => {
    setPreference(valeur);
    try {
      if (valeur === "systeme") window.localStorage.removeItem(CLE_STOCKAGE);
      else window.localStorage.setItem(CLE_STOCKAGE, valeur);
    } catch {
      // Préférence non persistée : le thème reste appliqué pour la session.
    }
  }, []);

  const basculer = useCallback(() => {
    definirPreference(theme === "nuit" ? "jour" : "nuit");
  }, [theme, definirPreference]);

  return (
    <Contexte.Provider value={{ preference, theme, definirPreference, basculer }}>
      {children}
    </Contexte.Provider>
  );
}

export function useTheme() {
  const contexte = useContext(Contexte);
  if (!contexte) throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  return contexte;
}

/**
 * Script inséré avant le rendu pour poser la classe `dark` immédiatement.
 * Sans lui, une page chargée en thème nuit apparaîtrait en clair le temps
 * que React s'hydrate.
 */
export const SCRIPT_THEME_INITIAL = `
(function () {
  try {
    var p = localStorage.getItem('${CLE_STOCKAGE}');
    var nuit = p === 'nuit' || (p !== 'jour' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (nuit) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = nuit ? 'dark' : 'light';
  } catch (e) {}
})();
`;

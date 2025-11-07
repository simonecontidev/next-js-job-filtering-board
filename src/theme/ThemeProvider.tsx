"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
  PaletteMode,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

type Accent = "tropical" | "neutral";
type ModePref = "system" | "light" | "dark";

type Ctx = {
  modePref: ModePref;              // preferenza salvata
  setModePref: (m: ModePref) => void;
  effectiveMode: Exclude<PaletteMode, "system">; // light/dark effettivo
  accent: Accent;
  setAccent: (a: Accent) => void;
  toggleMode: () => void;          // light<->dark (mantiene override)
};

const ThemeCtx = React.createContext<Ctx | null>(null);
export const useThemeSettings = () => {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useThemeSettings must be inside <ThemeProviderSC/>");
  return ctx;
};

const STORAGE_KEYS = { mode: "jobBoardThemeMode", accent: "jobBoardAccent" } as const;

const ACCENTS: Record<Accent, string> = {
  tropical: "#5CA5A5",
  neutral:  "#6C7A89",
};

function buildTheme(mode: Exclude<PaletteMode, "system">, accent: Accent) {
  return createTheme({
    palette: {
      mode,
      primary: { main: ACCENTS[accent] },
      background: {
        default: mode === "dark" ? "#0F1414" : "#F2FAFA",
        paper:   mode === "dark" ? "#151C1C" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#E6F1F1" : "#2C3A3A",
        secondary: mode === "dark" ? "#A9C0C0" : "#7C8F8F",
      },
    },
    shape: { borderRadius: 12 },
  });
}

export default function ThemeProviderSC({ children }: { children: React.ReactNode }) {
  // ---- leggi preferenze
  const sysPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [modePref, setModePref] = React.useState<ModePref>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEYS.mode) as ModePref) || "system";
  });

  const [accent, setAccent] = React.useState<Accent>(() => {
    if (typeof window === "undefined") return "tropical";
    return (localStorage.getItem(STORAGE_KEYS.accent) as Accent) || "tropical";
  });

  // ---- calcola mode effettivo
  const effectiveMode: Exclude<PaletteMode, "system"> =
    modePref === "system" ? (sysPrefersDark ? "dark" : "light") : modePref;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.mode, modePref);
      localStorage.setItem(STORAGE_KEYS.accent, accent);
      document.documentElement.dataset.theme = effectiveMode; // utile per CSS
    }
  }, [modePref, accent, effectiveMode]);

  const theme = React.useMemo(() => buildTheme(effectiveMode, accent), [effectiveMode, accent]);

  const toggleMode = () =>
    setModePref((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeCtx.Provider
      value={{ modePref, setModePref, effectiveMode, accent, setAccent, toggleMode }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": {
              "--accent": theme.palette.primary.main,
              "--text": theme.palette.text.primary,
              "--muted": theme.palette.text.secondary,
              "--bg": theme.palette.background.default,
              "--card-bg": theme.palette.background.paper,
              // opzionali
              "--chip-bg": effectiveMode === "dark" ? "rgba(92,165,165,0.16)" : "rgba(92,165,165,0.12)",
              "--chip-hover": theme.palette.primary.main,
              "--chip-hover-text": "#ffffff",
            },
            "body": {
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeCtx.Provider>
  );
}
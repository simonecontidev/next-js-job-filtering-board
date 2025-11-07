"use client";

import * as React from "react";
import { Box, Typography, Menu, MenuItem, Divider } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import { useThemeSettings } from "@/theme/ThemeProvider";

export default function ThemeToggle() {
  const { modePref, setModePref, effectiveMode, toggleMode, accent, setAccent } =
    useThemeSettings();

  // menu accento
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {/* Toggle dark/light */}
      <Box
        role="button"
        aria-label="Toggle theme"
        title={`Theme: ${effectiveMode}`}
        onClick={toggleMode}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          color: "var(--accent)",
          cursor: "pointer",
          fontWeight: 600,
          userSelect: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {effectiveMode === "dark" ? (
          <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
        )}
        <Typography variant="body2" component="span">
          {effectiveMode === "dark" ? "Light mode" : "Dark mode"}
        </Typography>
      </Box>

      {/* Preferenza (system/light/dark) + accent */}
      <Box
        role="button"
        aria-label="Theme settings"
        title="Theme settings"
        onClick={openMenu}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          color: "var(--accent)",
          cursor: "pointer",
          fontWeight: 600,
          userSelect: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <TuneOutlinedIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" component="span">Theme</Typography>
      </Box>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem selected={modePref === "system"} onClick={() => { setModePref("system"); closeMenu(); }}>
          System default
        </MenuItem>
        <MenuItem selected={modePref === "light"} onClick={() => { setModePref("light"); closeMenu(); }}>
          Light
        </MenuItem>
        <MenuItem selected={modePref === "dark"} onClick={() => { setModePref("dark"); closeMenu(); }}>
          Dark
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ColorLensOutlinedIcon sx={{ fontSize: 18, mr: 1 }} /> Accent color
        </MenuItem>
        <MenuItem selected={accent === "tropical"} onClick={() => { setAccent("tropical"); closeMenu(); }}>
          Tropical (teal)
        </MenuItem>
        <MenuItem selected={accent === "neutral"} onClick={() => { setAccent("neutral"); closeMenu(); }}>
          Neutral
        </MenuItem>
      </Menu>
    </Box>
  );
}
"use client";

import * as React from "react";

const STORAGE_KEY = "jobBoardFavorites";

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  // load once
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  // persist
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = React.useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const clearFavorites = React.useCallback(() => setFavorites([]), []);

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
}
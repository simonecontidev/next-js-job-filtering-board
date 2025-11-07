"use client";

import * as React from "react";

const STORAGE_KEY = "jobBoardRecentSearches";
export type RecentItem = { ts: number; url: string; summary: string };

export function useRecentSearches(limit = 5) {
  const [items, setItems] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = React.useCallback(
    (input: { url: string; summary: string }) => {
      const next: RecentItem = { ts: Date.now(), ...input };
      setItems((prev) => {
        // evita duplicati consecutivi sullo stesso URL
        if (prev[0]?.url === next.url) return prev;
        const arr = [next, ...prev];
        return arr.slice(0, limit);
      });
    },
    [limit]
  );

  const clear = React.useCallback(() => setItems([]), []);

  return { items, add, clear };
}

/** helper opzionale: costruisce una mini-summary testuale */
export function summarizeFilters(f: {
  search?: string;
  role?: string;
  level?: string;
  contract?: string;
  selectedTags?: string[];
  onlyNew?: boolean;
  onlyFeatured?: boolean;
  sortBy?: string;
}) {
  const parts: string[] = [];
  if (f.search) parts.push(`q:“${f.search}”`);
  if (f.role) parts.push(`role:${f.role}`);
  if (f.level) parts.push(`level:${f.level}`);
  if (f.contract) parts.push(`contract:${f.contract}`);
  if (f.selectedTags && f.selectedTags.length)
    parts.push(`tags:${f.selectedTags.join("+")}`);
  if (f.onlyNew) parts.push("NEW");
  if (f.onlyFeatured) parts.push("FEATURED");
  if (f.sortBy && f.sortBy !== "recent") parts.push(`sort:${f.sortBy}`);
  return parts.length ? parts.join(" • ") : "All jobs";
}
"use client";

import { useUrlPersist } from "@/hooks/useUrlPersist";

export type SortKey = "recent" | "company" | "role" | "level";

export type Filters = {
  search: string;
  onlyNew: boolean;
  onlyFeatured: boolean;
  role: string | "";
  level: string | "";
  contract: string | "";
  selectedTags: string[]; // array
  sortBy: SortKey;
};

export const DEFAULTS: Filters = {
  search: "",
  onlyNew: false,
  onlyFeatured: false,
  role: "",
  level: "",
  contract: "",
  selectedTags: [],
  sortBy: "recent",
};

export function useFilters() {
  const [filters, setFilters] = useUrlPersist<Filters>(DEFAULTS, {
    storageKey: "jobBoardFilters",
    schema: {
      search: { type: "string", omitIfFalsy: true, param: "q" },
      onlyNew: { type: "boolean", omitIfFalsy: true, param: "new" },
      onlyFeatured: { type: "boolean", omitIfFalsy: true, param: "featured" },
      role: { type: "string", omitIfFalsy: true },
      level: { type: "string", omitIfFalsy: true },
      contract: { type: "string", omitIfFalsy: true },
      selectedTags: { type: "string[]", omitIfFalsy: true, param: "tag" }, // ?tag=react&tag=nextjs
      sortBy: { type: "string", omitIfFalsy: true, param: "sort" },
    },
    debounceMs: 200,
  });

  return { filters, setFilters };
}
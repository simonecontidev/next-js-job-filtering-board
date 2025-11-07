"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Primitive = string | number | boolean | null | undefined;
type Json = { [key: string]: Primitive | Primitive[] };

type KeyConfig = {
  /** nome del param nell’URL (se diverso dalla chiave nello stato) */
  param?: string;
  /** "string" | "number" | "boolean" | "string[]" */
  type?: "string" | "number" | "boolean" | "string[]";
  /** se true e il valore è falsy, il param viene rimosso dall’URL */
  omitIfFalsy?: boolean;
};

type UseUrlPersistOptions<TState extends Json> = {
  storageKey: string;
  schema?: Partial<Record<keyof TState, KeyConfig>>;
  debounceMs?: number;
  disableStorage?: boolean;
};

const parseByType = (
  sp: URLSearchParams,
  param: string,
  type: KeyConfig["type"]
) => {
  switch (type) {
    case "number": {
      const raw = sp.get(param);
      if (raw == null) return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }
    case "boolean": {
      const raw = sp.get(param);
      if (raw == null) return undefined;
      if (raw === "true") return true;
      if (raw === "false") return false;
      return undefined;
    }
    case "string[]": {
      const all = sp.getAll(param);
      return all.length ? all : undefined;
    }
    case "string":
    default: {
      const raw = sp.get(param);
      return raw ?? undefined;
    }
  }
};

export function useUrlPersist<TState extends Json>(
  initial: TState,
  {
    storageKey,
    schema = {},
    debounceMs = 250,
    disableStorage = false,
  }: UseUrlPersistOptions<TState>
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<TState>(initial);
  const isHydratedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // URL -> oggetto
  const stateFromUrl = useMemo(() => {
    const result: Partial<TState> = {};
    const sp = new URLSearchParams(searchParams?.toString());
    for (const k of Object.keys(initial) as Array<keyof TState>) {
      const cfg = schema[k] ?? {};
      const paramName = cfg.param ?? (k as string);
      const parsed = parseByType(sp, paramName, cfg.type ?? "string");
      if (parsed !== undefined) (result as any)[k] = parsed;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  // localStorage -> oggetto
  const stateFromStorage = useCallback((): Partial<TState> => {
    if (typeof window === "undefined" || disableStorage) return {};
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return {};
      return (JSON.parse(raw) as Partial<TState>) ?? {};
    } catch {
      return {};
    }
  }, [storageKey, disableStorage]);

  // Prima idratazione: URL > storage > initial
  useEffect(() => {
    if (isHydratedRef.current) return;
    const merged: TState = {
      ...initial,
      ...stateFromStorage(),
      ...stateFromUrl,
    };
    setState(merged);
    isHydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stato -> URL + storage (debounced)
  useEffect(() => {
    if (!isHydratedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const sp = new URLSearchParams(searchParams?.toString());

      (Object.keys(state) as Array<keyof TState>).forEach((key) => {
        const cfg = schema[key] ?? {};
        const paramName = cfg.param ?? (key as string);
        const val = state[key];

        const omit =
          cfg.omitIfFalsy &&
          (val === "" ||
            val === false ||
            val == null ||
            (Array.isArray(val) && val.length === 0));

        // pulizia param
        sp.delete(paramName);

        if (omit || val == null) return;

        if (cfg.type === "string[]") {
          if (Array.isArray(val)) {
            for (const v of val) {
              if (v != null && String(v) !== "") sp.append(paramName, String(v));
            }
          }
        } else {
          const s = String(val);
          if (s !== "") sp.set(paramName, s);
        }
      });

      const query = sp.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url, { scroll: false });

      if (!disableStorage && typeof window !== "undefined") {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pathname, router, searchParams, debounceMs, disableStorage, storageKey]);

  return [state, setState] as const;
}
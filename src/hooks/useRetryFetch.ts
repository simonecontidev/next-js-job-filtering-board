"use client";

import * as React from "react";

type RetryOpts = {
  retries?: number;         // default 3
  backoffMs?: number;       // base backoff, default 400
  cacheKey?: string | null; // se presente, salva/legge da localStorage
};

export function useRetryFetch<T = unknown>(
  url: string | null,
  fetchInit?: RequestInit,
  { retries = 3, backoffMs = 400, cacheKey = null }: RetryOpts = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(Boolean(url));
  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    // prova cache prima
    if (cacheKey && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const cached = JSON.parse(raw) as T;
          setData(cached);
        }
      } catch {}
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let lastError: unknown = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, { ...fetchInit, signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = (await res.json()) as T;
        setData(json);
        // aggiorna cache
        if (cacheKey && typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(json));
          } catch {}
        }
        setLoading(false);
        return;
      } catch (e: any) {
        lastError = e?.name === "AbortError" ? new Error("Request aborted") : e;
        // backoff (no retry se è stato abortito)
        if (e?.name === "AbortError") break;
        if (attempt < retries) {
          // jitter
          const wait =
            backoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 120);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
      }
    }

    setError(lastError as Error);
    setLoading(false);
  }, [url, fetchInit, retries, backoffMs, cacheKey]);

  React.useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { data, error, loading, refetch: load };
}
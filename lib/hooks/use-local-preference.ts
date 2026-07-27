"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Pick a stable random index after mount to avoid hydration mismatches. */
export function useRandomIndex(length: number): number {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted || length <= 0) return 0;

  // Client-only random; stable for the session via lazy module cache keyed by length.
  return getSessionRandomIndex(length);
}

const randomCache = new Map<number, number>();

function getSessionRandomIndex(length: number): number {
  const cached = randomCache.get(length);
  if (cached !== undefined && cached < length) return cached;
  const next = Math.floor(Math.random() * length);
  randomCache.set(length, next);
  return next;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function useHasMusicFile(src: string): boolean {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch(src, { method: "HEAD" });
        if (!cancelled) setExists(response.ok);
      } catch {
        if (!cancelled) setExists(false);
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return exists;
}

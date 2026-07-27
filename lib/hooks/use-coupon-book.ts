"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { siteConfig } from "@/config/site";
import {
  fetchCouponBookState,
  persistCouponBookState,
  resetCouponBookRemote,
} from "@/lib/coupon-api";
import {
  getProgressSummary,
  mergeCoupons,
  redeemCoupon,
  undoLatestRedemption,
} from "@/lib/coupon-service";
import {
  couponStorage,
  defaultCouponBookState,
  hasAnyRedemptions,
} from "@/lib/coupon-storage";
import type { Coupon, CouponBookState } from "@/types/coupon";

let memoryState: CouponBookState = defaultCouponBookState();
let hydrated = false;
let syncReady = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function ensureLocalHydrated() {
  if (hydrated || typeof window === "undefined") return;
  memoryState = couponStorage.getState();
  hydrated = true;
}

function subscribe(listener: () => void) {
  ensureLocalHydrated();
  listeners.add(listener);
  queueMicrotask(() => {
    emitChange();
  });
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CouponBookState {
  return memoryState;
}

function getServerSnapshot(): CouponBookState {
  return defaultCouponBookState();
}

function getHydratedSnapshot() {
  return hydrated;
}

function getHydratedServerSnapshot() {
  return false;
}

function setMemoryState(next: CouponBookState, persistLocal = true) {
  memoryState = next;
  if (persistLocal) {
    couponStorage.saveState(next);
  }
  emitChange();
}

async function syncToRemote(state: CouponBookState) {
  if (!syncReady) return;
  try {
    const saved = await persistCouponBookState(state);
    setMemoryState(saved, true);
  } catch (error) {
    console.error("Failed to sync coupon book", error);
    throw error;
  }
}

export function useCouponBook() {
  const [syncError, setSyncError] = useState<string | null>(null);
  const [remoteConfigured, setRemoteConfigured] = useState(false);
  const bootstrapped = useRef(false);

  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isHydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    let cancelled = false;

    async function bootstrap() {
      ensureLocalHydrated();
      emitChange();

      try {
        const remote = await fetchCouponBookState();
        if (cancelled) return;

        setRemoteConfigured(remote.configured);
        syncReady = remote.configured;

        const local = couponStorage.getState();

        if (
          remote.configured &&
          remote.empty &&
          hasAnyRedemptions(local)
        ) {
          // One-time upload of local test progress when DB is empty.
          const uploaded = await persistCouponBookState(local);
          if (cancelled) return;
          setMemoryState(uploaded, true);
        } else if (remote.configured) {
          // DB wins when it already has data (or both are empty).
          setMemoryState(remote.state, true);
        }

        setSyncError(null);
      } catch (error) {
        if (cancelled) return;
        // Fall back to localStorage if API is unavailable.
        syncReady = false;
        setRemoteConfigured(false);
        setSyncError(
          error instanceof Error
            ? error.message
            : "Could not sync with the cloud yet.",
        );
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const coupons: Coupon[] = useMemo(() => mergeCoupons(state), [state]);
  const progress = useMemo(() => getProgressSummary(state), [state]);

  const commit = useCallback(async (next: CouponBookState) => {
    const previous = memoryState;
    setMemoryState(next, true);
    setSyncError(null);

    try {
      await syncToRemote(next);
    } catch (error) {
      setMemoryState(previous, true);
      setSyncError(
        error instanceof Error ? error.message : "Failed to save changes.",
      );
      throw error;
    }
  }, []);

  const setWelcomeOpened = useCallback(
    (opened: boolean) => {
      void commit({ ...memoryState, welcomeOpened: opened });
    },
    [commit],
  );

  const setSecretDiscovered = useCallback(
    (discovered: boolean) => {
      void commit({ ...memoryState, secretDiscovered: discovered });
    },
    [commit],
  );

  const setMusicEnabled = useCallback(
    (enabled: boolean) => {
      void commit({ ...memoryState, musicEnabled: enabled });
    },
    [commit],
  );

  const redeem = useCallback(
    (couponId: string, note?: string) => {
      const result = redeemCoupon(memoryState, couponId, note);
      if (result.error || !result.coupon) {
        return {
          ok: false as const,
          error: result.error ?? "Unable to redeem.",
        };
      }

      void commit(result.state).catch(() => {
        // Error surfaced via syncError; UI already rolled back in commit.
      });

      return { ok: true as const, coupon: result.coupon };
    },
    [commit],
  );

  const undo = useCallback(
    (couponId: string) => {
      const result = undoLatestRedemption(memoryState, couponId);
      if (result.error || !result.coupon) {
        return { ok: false as const, error: result.error ?? "Unable to undo." };
      }

      void commit(result.state).catch(() => {
        // handled in commit
      });

      return { ok: true as const, coupon: result.coupon };
    },
    [commit],
  );

  const resetAll = useCallback(async (password: string) => {
    const previous = memoryState;
    setSyncError(null);

    try {
      if (syncReady) {
        const saved = await resetCouponBookRemote(password);
        couponStorage.reset();
        setMemoryState(saved, true);
      } else {
        // Offline / unconfigured: still require the correct local password.
        if (password !== siteConfig.resetPassword) {
          throw new Error("Incorrect password.");
        }
        couponStorage.reset();
        setMemoryState(defaultCouponBookState(), true);
      }
    } catch (error) {
      setMemoryState(previous, true);
      const message =
        error instanceof Error ? error.message : "Failed to reset.";
      setSyncError(message);
      throw error instanceof Error ? error : new Error(message);
    }
  }, []);

  return {
    hydrated: isHydrated,
    state,
    coupons,
    progress,
    welcomeOpened: state.welcomeOpened,
    secretDiscovered: state.secretDiscovered,
    musicEnabled: state.musicEnabled,
    syncError,
    remoteConfigured,
    setWelcomeOpened,
    setSecretDiscovered,
    setMusicEnabled,
    redeem,
    undo,
    resetAll,
  };
}

import { coupons as couponDefinitions } from "@/data/coupons";
import { STORAGE_KEY, STORAGE_VERSION } from "@/lib/storage-keys";
import type { CouponBookState, RedemptionRecord } from "@/types/coupon";

export const defaultCouponBookState = (): CouponBookState => ({
  version: STORAGE_VERSION,
  welcomeOpened: false,
  secretDiscovered: false,
  musicEnabled: false,
  redemptions: {},
});

function isBrowser() {
  return typeof window !== "undefined";
}

function isRedemptionRecord(value: unknown): value is RedemptionRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.redeemedAt === "string" &&
    (record.note === undefined || typeof record.note === "string")
  );
}

/** Sanitize + clamp redemptions to known coupons / maxRedemptions. */
export function sanitizeState(raw: unknown): CouponBookState {
  const fallback = defaultCouponBookState();
  if (!raw || typeof raw !== "object") return fallback;

  const data = raw as Partial<CouponBookState> & {
    welcome_opened?: boolean;
    secret_discovered?: boolean;
    music_enabled?: boolean;
  };

  const maxById = new Map(
    couponDefinitions.map((coupon) => [coupon.id, coupon.maxRedemptions]),
  );

  const redemptions: Record<string, RedemptionRecord[]> = {};
  const incoming =
    data.redemptions && typeof data.redemptions === "object"
      ? data.redemptions
      : {};

  for (const [couponId, history] of Object.entries(incoming)) {
    const max = maxById.get(couponId);
    if (max === undefined || !Array.isArray(history)) continue;
    redemptions[couponId] = history.filter(isRedemptionRecord).slice(0, max);
  }

  return {
    version: STORAGE_VERSION,
    welcomeOpened: Boolean(data.welcomeOpened ?? data.welcome_opened),
    secretDiscovered: Boolean(data.secretDiscovered ?? data.secret_discovered),
    musicEnabled: Boolean(data.musicEnabled ?? data.music_enabled),
    redemptions,
  };
}

export function hasAnyRedemptions(state: CouponBookState): boolean {
  return Object.values(state.redemptions).some((history) => history.length > 0);
}

export type CouponBookRow = {
  id: string;
  version: number;
  welcome_opened: boolean;
  secret_discovered: boolean;
  music_enabled: boolean;
  redemptions: unknown;
  updated_at?: string;
};

export function rowToState(row: CouponBookRow): CouponBookState {
  return sanitizeState({
    version: row.version,
    welcomeOpened: row.welcome_opened,
    secretDiscovered: row.secret_discovered,
    musicEnabled: row.music_enabled,
    redemptions: row.redemptions,
  });
}

export function stateToRow(state: CouponBookState) {
  const clean = sanitizeState(state);
  return {
    version: clean.version,
    welcome_opened: clean.welcomeOpened,
    secret_discovered: clean.secretDiscovered,
    music_enabled: clean.musicEnabled,
    redemptions: clean.redemptions,
    updated_at: new Date().toISOString(),
  };
}

/** Storage interface — local cache + remote API adapters. */
export interface CouponStorage {
  getState(): CouponBookState;
  saveState(state: CouponBookState): void;
  reset(): void;
}

export class LocalStorageCouponStorage implements CouponStorage {
  getState(): CouponBookState {
    if (!isBrowser()) return defaultCouponBookState();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultCouponBookState();
      return sanitizeState(JSON.parse(raw));
    } catch {
      return defaultCouponBookState();
    }
  }

  saveState(state: CouponBookState): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(sanitizeState(state)),
      );
    } catch {
      // Quota / private mode — fail silently.
    }
  }

  reset(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export const couponStorage: CouponStorage = new LocalStorageCouponStorage();

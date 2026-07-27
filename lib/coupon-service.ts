import { coupons as couponDefinitions } from "@/data/coupons";
import type {
  Coupon,
  CouponBookState,
  CouponProgressSummary,
  RedemptionRecord,
} from "@/types/coupon";

export function getRemainingRedemptions(coupon: {
  maxRedemptions: number;
  redemptionHistory: RedemptionRecord[];
}): number {
  return Math.max(0, coupon.maxRedemptions - coupon.redemptionHistory.length);
}

export function isFullyRedeemed(coupon: {
  maxRedemptions: number;
  redemptionHistory: RedemptionRecord[];
}): boolean {
  return getRemainingRedemptions(coupon) === 0;
}

export function mergeCoupons(state: CouponBookState): Coupon[] {
  return couponDefinitions.map((definition) => {
    const history = state.redemptions[definition.id] ?? [];
    const capped = history.slice(0, definition.maxRedemptions);
    return {
      ...definition,
      redemptionHistory: capped,
    };
  });
}

export function getCouponById(
  state: CouponBookState,
  couponId: string,
): Coupon | undefined {
  return mergeCoupons(state).find((coupon) => coupon.id === couponId);
}

export function createRedemptionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `redeem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function redeemCoupon(
  state: CouponBookState,
  couponId: string,
  note?: string,
): { state: CouponBookState; coupon?: Coupon; error?: string } {
  const definition = couponDefinitions.find((c) => c.id === couponId);
  if (!definition) {
    return { state, error: "Coupon not found." };
  }

  const currentHistory = state.redemptions[couponId] ?? [];
  if (currentHistory.length >= definition.maxRedemptions) {
    return { state, error: "This coupon is fully redeemed." };
  }

  if (definition.requiresWish && !note?.trim()) {
    return { state, error: "Please write your wish before redeeming." };
  }

  const record: RedemptionRecord = {
    id: createRedemptionId(),
    redeemedAt: new Date().toISOString(),
    ...(note?.trim() ? { note: note.trim() } : {}),
  };

  const nextState: CouponBookState = {
    ...state,
    redemptions: {
      ...state.redemptions,
      [couponId]: [...currentHistory, record],
    },
  };

  return {
    state: nextState,
    coupon: getCouponById(nextState, couponId),
  };
}

export function undoLatestRedemption(
  state: CouponBookState,
  couponId: string,
): { state: CouponBookState; coupon?: Coupon; error?: string } {
  const currentHistory = state.redemptions[couponId] ?? [];
  if (currentHistory.length === 0) {
    return { state, error: "There is nothing to undo." };
  }

  const nextHistory = currentHistory.slice(0, -1);
  const nextRedemptions = { ...state.redemptions };

  if (nextHistory.length === 0) {
    delete nextRedemptions[couponId];
  } else {
    nextRedemptions[couponId] = nextHistory;
  }

  const nextState: CouponBookState = {
    ...state,
    redemptions: nextRedemptions,
  };

  return {
    state: nextState,
    coupon: getCouponById(nextState, couponId),
  };
}

export function getProgressSummary(state: CouponBookState): CouponProgressSummary {
  const merged = mergeCoupons(state);
  const totalCoupons = merged.length;
  const totalAvailable = merged.reduce(
    (sum, coupon) => sum + coupon.maxRedemptions,
    0,
  );
  const totalUsed = merged.reduce(
    (sum, coupon) => sum + coupon.redemptionHistory.length,
    0,
  );

  return {
    totalCoupons,
    totalAvailable,
    totalUsed,
    totalRemaining: Math.max(0, totalAvailable - totalUsed),
  };
}

export function remainingLabel(remaining: number): string {
  if (remaining <= 0) return "Fully redeemed";
  if (remaining === 1) return "1 redemption remaining";
  return `${remaining} redemptions remaining`;
}

export function redeemButtonLabel(remaining: number, max: number): string {
  if (remaining <= 0) return "Fully Redeemed";
  if (remaining === max) return "Redeem This Coupon";
  if (remaining === 1) return "Use Final Redemption";
  return "Redeem Again";
}

export function successMessage(remainingAfter: number): string {
  if (remainingAfter <= 0) {
    return "This coupon has now been fully redeemed!";
  }
  if (remainingAfter === 1) {
    return "Coupon redeemed! You have 1 use left.";
  }
  return `Coupon redeemed! You still have ${remainingAfter} uses left.`;
}

export function formatRedemptionDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function historyRemainingLabel(
  useIndex: number,
  maxRedemptions: number,
): string {
  const remainingAfter = Math.max(0, maxRedemptions - (useIndex + 1));
  if (remainingAfter === 0) return "Fully redeemed";
  if (remainingAfter === 1) return "1 remaining";
  return `${remainingAfter} remaining`;
}

export function daysTogether(relationshipDate: string): number | null {
  if (!relationshipDate.trim()) return null;
  const start = new Date(relationshipDate);
  if (Number.isNaN(start.getTime())) return null;

  const now = new Date();
  const utcStart = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((utcNow - utcStart) / (1000 * 60 * 60 * 24)));
}

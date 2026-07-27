export type CouponCategory =
  | "Food"
  | "Date Night"
  | "Relaxation"
  | "Adventure"
  | "Helpful"
  | "Romance"
  | "Wildcard";

export type CouponVariant =
  | "hearts"
  | "stars"
  | "bows"
  | "flowers"
  | "ribbons"
  | "candles"
  | "balloons";

export type IndicatorStyle = "hearts" | "stars" | "candles" | "tickets";

export type RedemptionRecord = {
  id: string;
  redeemedAt: string;
  note?: string;
};

/** Static coupon definition (lives in data/coupons.ts). */
export type CouponDefinition = {
  id: string;
  couponNumber: string;
  title: string;
  description: string;
  category: CouponCategory;
  icon: string;
  finePrint?: string;
  maxRedemptions: number;
  variant: CouponVariant;
  indicatorStyle: IndicatorStyle;
  /** When true, redeeming requires a custom wish note. */
  requiresWish?: boolean;
  /** When true, coupon stays hidden until the secret heart unlock. */
  requiresSecret?: boolean;
};

/** Runtime coupon with merged redemption history. */
export type Coupon = CouponDefinition & {
  redemptionHistory: RedemptionRecord[];
};

export type CouponBookState = {
  version: number;
  welcomeOpened: boolean;
  secretDiscovered: boolean;
  musicEnabled: boolean;
  redemptions: Record<string, RedemptionRecord[]>;
};

export type CouponProgressSummary = {
  totalCoupons: number;
  totalAvailable: number;
  totalUsed: number;
  totalRemaining: number;
};

"use client";

import { CouponIcon } from "@/components/coupons/CouponIcon";
import { CouponUseIndicators } from "@/components/coupons/CouponUseIndicators";
import { RedeemedStamp } from "@/components/coupons/RedeemedStamp";
import { RedemptionHistory } from "@/components/coupons/RedemptionHistory";
import { CuteBow, PawPrint, PlushRibbon } from "@/components/decor/CuteDecor";
import { Button } from "@/components/ui/button";
import {
  getRemainingRedemptions,
  isFullyRedeemed,
  redeemButtonLabel,
  remainingLabel,
} from "@/lib/coupon-service";
import type { Coupon, CouponVariant } from "@/types/coupon";
import { cn } from "@/lib/utils";

const variantStyles: Record<CouponVariant, string> = {
  hearts:
    "bg-[radial-gradient(circle_at_top_right,rgba(244,200,200,0.4),transparent_40%)]",
  stars:
    "bg-[radial-gradient(circle_at_top_left,rgba(212,165,116,0.28),transparent_45%)]",
  bows: "bg-[linear-gradient(160deg,rgba(244,200,200,0.3),transparent_50%)]",
  flowers:
    "bg-[radial-gradient(circle_at_bottom_left,rgba(232,164,168,0.25),transparent_40%)]",
  ribbons:
    "bg-[linear-gradient(90deg,rgba(240,226,208,0.75)_0%,transparent_18%,transparent_82%,rgba(240,226,208,0.75)_100%)]",
  candles:
    "bg-[radial-gradient(circle_at_center,rgba(255,249,242,0.95),rgba(244,200,200,0.22))]",
  balloons:
    "bg-[radial-gradient(circle_at_20%_20%,rgba(184,92,92,0.14),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(201,149,106,0.18),transparent_30%)]",
};

type CouponCardProps = {
  coupon: Coupon;
  onRedeemClick: (coupon: Coupon) => void;
  onUndoClick: (coupon: Coupon) => void;
};

export function CouponCard({
  coupon,
  onRedeemClick,
  onUndoClick,
}: CouponCardProps) {
  const remaining = getRemainingRedemptions(coupon);
  const used = coupon.redemptionHistory.length;
  const fully = isFullyRedeemed(coupon);
  const showRibbon =
    coupon.variant === "bows" ||
    coupon.variant === "ribbons" ||
    coupon.variant === "hearts";

  return (
    <article
      className={cn(
        "fur-card coupon-shadow stitch-border relative flex h-full flex-col overflow-hidden rounded-3xl p-5",
        variantStyles[coupon.variant],
      )}
    >
      {showRibbon && <PlushRibbon />}
      {(coupon.variant === "flowers" || coupon.variant === "stars") && (
        <div className="absolute top-3 left-3 opacity-70">
          <CuteBow className="h-6 w-10" />
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1 text-[11px] font-bold tracking-[0.18em] text-caramel uppercase">
            <PawPrint className="h-3 w-3" />
            Coupon #{coupon.couponNumber}
          </p>
          <p className="mt-1 inline-flex rounded-full bg-soft-pink/55 px-2.5 py-0.5 text-[11px] font-semibold text-muted-red">
            {coupon.category}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-paper text-muted-red shadow-sm ring-2 ring-fur/25">
          <CouponIcon name={coupon.icon} className="size-5" />
        </div>
      </div>

      <h3 className="font-display text-2xl leading-tight text-warm-brown text-balance">
        {coupon.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {coupon.description}
      </p>

      {coupon.finePrint && (
        <p className="mt-3 text-xs italic text-caramel/90">{coupon.finePrint}</p>
      )}

      <div className="mt-5 flex flex-col items-center gap-2">
        <CouponUseIndicators
          max={coupon.maxRedemptions}
          used={used}
          style={coupon.indicatorStyle}
        />
        <p className="text-sm font-semibold text-warm-brown">
          {remainingLabel(remaining)}
        </p>
        {used > 0 && !fully && (
          <p className="text-xs text-muted-red">
            Used {used} time{used === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {fully && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paper/40 backdrop-blur-[1px]">
          <RedeemedStamp large />
        </div>
      )}

      <div className="mt-auto pt-5">
        <Button
          type="button"
          disabled={fully}
          onClick={() => onRedeemClick(coupon)}
          className="touch-target h-11 w-full rounded-full bg-muted-red text-paper hover:bg-muted-red/90 disabled:opacity-60"
        >
          {redeemButtonLabel(remaining, coupon.maxRedemptions)}
        </Button>

        <RedemptionHistory
          coupon={coupon}
          onRequestUndo={() => onUndoClick(coupon)}
        />
      </div>
    </article>
  );
}

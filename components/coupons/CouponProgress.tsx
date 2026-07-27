"use client";

import type { CouponProgressSummary } from "@/types/coupon";
import { cn } from "@/lib/utils";

type CouponProgressProps = {
  progress: CouponProgressSummary;
  className?: string;
};

export function CouponProgress({ progress, className }: CouponProgressProps) {
  const percent =
    progress.totalAvailable === 0
      ? 0
      : Math.round((progress.totalUsed / progress.totalAvailable) * 100);

  return (
    <div
      className={cn(
        "paper-card rounded-3xl border border-caramel/25 p-4 sm:p-5",
        className,
      )}
    >
      <p className="font-display text-xl text-warm-brown">Your adventure progress</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Every redemption is another memory waiting to happen.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Coupons" value={progress.totalCoupons} />
        <Stat label="Total uses" value={progress.totalAvailable} />
        <Stat label="Redeemed" value={progress.totalUsed} />
        <Stat label="Remaining" value={progress.totalRemaining} />
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-beige">
        <div
          className="h-full rounded-full bg-gradient-to-r from-soft-pink to-muted-red transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-caramel">{percent}% of all uses claimed</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-beige/70 px-3 py-2 text-center">
      <p className="font-display text-2xl text-warm-brown">{value}</p>
      <p className="text-xs font-semibold tracking-wide text-caramel uppercase">
        {label}
      </p>
    </div>
  );
}

"use client";

import { Heart, Star, Flame, Circle } from "lucide-react";
import type { IndicatorStyle } from "@/types/coupon";
import { cn } from "@/lib/utils";

type CouponUseIndicatorsProps = {
  max: number;
  used: number;
  style?: IndicatorStyle;
  className?: string;
};

export function CouponUseIndicators({
  max,
  used,
  style = "hearts",
  className,
}: CouponUseIndicatorsProps) {
  const Icon =
    style === "stars" ? Star : style === "candles" ? Flame : style === "tickets" ? Circle : Heart;

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="img"
      aria-label={`${used} of ${max} redemptions used`}
    >
      {Array.from({ length: max }).map((_, index) => {
        const isUsed = index < used;
        return (
          <span
            key={index}
            className={cn(
              "relative inline-flex size-8 items-center justify-center rounded-full border transition",
              isUsed
                ? "border-muted-red/40 bg-soft-pink/40 opacity-55"
                : "border-caramel/40 bg-paper text-muted-red shadow-sm",
            )}
          >
            <Icon
              className={cn(
                "size-4",
                isUsed
                  ? "text-muted-red/70"
                  : style === "stars"
                    ? "fill-caramel text-caramel"
                    : style === "candles"
                      ? "text-caramel"
                      : "fill-muted-red text-muted-red",
              )}
            />
            {isUsed && (
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center text-sm font-bold text-muted-red"
              >
                ✕
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

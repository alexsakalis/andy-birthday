"use client";

import { siteConfig } from "@/config/site";
import { daysTogether } from "@/lib/coupon-service";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export function DaysTogetherCounter({ className }: { className?: string }) {
  const days = daysTogether(siteConfig.relationshipDate);

  // Hidden until relationshipDate is set in config/site.ts
  if (days === null) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-warm-brown",
        className,
      )}
    >
      <Heart className="size-4 fill-soft-pink text-muted-red" aria-hidden />
      <p>
        <span className="font-display text-lg font-semibold">{days}</span>{" "}
        beautiful days together
      </p>
    </div>
  );
}

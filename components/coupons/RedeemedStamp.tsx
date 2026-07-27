"use client";

import { cn } from "@/lib/utils";

export function RedeemedStamp({
  className,
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none select-none rounded-xl border-4 border-muted-red/70 px-3 py-2 text-center font-display font-bold tracking-wide text-muted-red/80 uppercase rotate-[-12deg] animate-stamp",
        large ? "text-xl sm:text-2xl" : "text-sm",
        className,
      )}
      aria-hidden
    >
      Fully Redeemed
      <span className="mt-0.5 block text-[10px] font-sans font-semibold tracking-normal normal-case">
        stamped with cozy love ♥
      </span>
    </div>
  );
}

export function MiniUseStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-muted-red/50 bg-soft-pink/50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted-red uppercase",
        className,
      )}
    >
      Used
    </span>
  );
}

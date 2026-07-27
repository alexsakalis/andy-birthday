"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";
import { cn } from "@/lib/utils";

type BirthdayCountdownProps = {
  variant?: "hero" | "compact";
  className?: string;
};

export function BirthdayCountdown({
  variant = "hero",
  className,
}: BirthdayCountdownProps) {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (!siteConfig.countdownEnabled) return;

    const tick = () => setParts(getCountdownParts());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!siteConfig.countdownEnabled) return null;

  if (!parts) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-caramel/25 bg-paper/70 px-4 py-3 text-center text-sm text-caramel",
          className,
        )}
        aria-hidden
      >
        Counting down to your birthday…
      </div>
    );
  }

  if (parts.isBirthday) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-soft-pink bg-soft-pink/40 px-4 py-3 text-center",
          className,
        )}
        role="status"
      >
        <p className="font-display text-lg text-warm-brown sm:text-xl text-balance">
          Happy Birthday, {siteConfig.recipientName} — your coupon book is ready.
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-paper/90 px-3 py-1.5 text-xs font-semibold text-warm-brown",
          className,
        )}
        aria-live="polite"
      >
        <span className="text-caramel">Birthday in</span>
        <span>
          {parts.days}d {pad(parts.hours)}h {pad(parts.minutes)}m{" "}
          {pad(parts.seconds)}s
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fur-card w-full max-w-md rounded-3xl border border-caramel/25 px-4 py-4 text-center sm:px-5",
        className,
      )}
      aria-live="polite"
    >
      <p className="text-xs font-semibold tracking-wide text-caramel uppercase">
        Countdown to {siteConfig.birthdayAge}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Until midnight · July 31 · {siteConfig.birthdayTimezone.replace("_", " ")}
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <Unit label="Days" value={parts.days} />
        <Unit label="Hours" value={parts.hours} />
        <Unit label="Mins" value={parts.minutes} />
        <Unit label="Secs" value={parts.seconds} />
      </div>
    </div>
  );
}

function Unit({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-beige/80 px-1 py-2">
      <p className="font-display text-2xl text-warm-brown tabular-nums sm:text-3xl">
        {pad(value)}
      </p>
      <p className="text-[10px] font-semibold tracking-wide text-caramel uppercase">
        {label}
      </p>
    </div>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

"use client";

import { cn } from "@/lib/utils";

/** Soft floating birthday decor — hearts, bows, sparkles, balloons. */
export function FloatingDecor({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <span className="animate-float-soft absolute top-[10%] left-[6%] text-2xl text-muted-red/70">
        ♥
      </span>
      <span className="animate-sparkle absolute top-[16%] right-[10%] text-xl text-caramel opacity-80">
        ✦
      </span>
      <span className="animate-float-soft absolute top-[38%] right-[5%] text-3xl opacity-55 [animation-delay:1.2s]">
        🎈
      </span>
      <span className="animate-sparkle absolute bottom-[24%] left-[8%] text-lg opacity-70 [animation-delay:0.8s]">
        ✧
      </span>
      <span className="animate-float-soft absolute bottom-[14%] right-[16%] text-2xl text-muted-red/65 [animation-delay:2s]">
        ♥
      </span>
      <span className="animate-sparkle absolute top-[55%] left-[16%] text-base text-muted-red/55 [animation-delay:1.5s]">
        ★
      </span>
      <span className="animate-float-soft absolute top-[28%] left-[78%] text-2xl opacity-50 [animation-delay:0.6s]">
        🎀
      </span>
      <span className="animate-float-soft absolute bottom-[38%] left-[4%] opacity-40 [animation-delay:1.8s]">
        <PawPrint className="h-7 w-7 text-caramel" />
      </span>
      <span className="animate-sparkle absolute top-[72%] right-[8%] opacity-35 [animation-delay:2.2s]">
        <PawPrint className="h-6 w-6 text-warm-brown" />
      </span>
    </div>
  );
}

export function CuteBow({
  className,
  color = "#f3c5c5",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 48"
      className={cn("h-10 w-16", className)}
      aria-hidden
    >
      <path
        d="M40 24c-8-14-28-16-32-6 4 12 18 12 32 6z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M40 24c8-14 28-16 32-6-4 12-18 12-32 6z"
        fill={color}
        opacity="0.95"
      />
      <circle cx="40" cy="24" r="7" fill="#b85c5c" />
      <circle cx="40" cy="24" r="3.5" fill="#fff8f0" opacity="0.45" />
      <path
        d="M36 30l-4 14h6l2-10 2 10h6l-4-14z"
        fill="#c48a5a"
        opacity="0.75"
      />
    </svg>
  );
}

export function PawPrint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-5 w-5", className)} aria-hidden>
      <ellipse cx="16" cy="22" rx="7" ry="5.5" fill="currentColor" />
      <circle cx="8" cy="12" r="3.2" fill="currentColor" />
      <circle cx="14" cy="8.5" r="3.4" fill="currentColor" />
      <circle cx="21.5" cy="8.5" r="3.4" fill="currentColor" />
      <circle cx="26" cy="13" r="3.1" fill="currentColor" />
    </svg>
  );
}

/**
 * Original cozy monkey-doll mascot (Monchhichi-inspired — not official art).
 * Soft brown fur, peach face, rosy cheeks, optional birthday bow.
 */
export function MonchhichiMascot({
  className,
  size = "md",
  withBow = true,
  mood = "happy",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  withBow?: boolean;
  mood?: "happy" | "sleepy" | "love";
}) {
  const dimensions =
    size === "sm" ? "h-14 w-14" : size === "lg" ? "h-44 w-44" : "h-28 w-28";

  return (
    <div
      className={cn("relative mx-auto select-none", dimensions, className)}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-md">
        <defs>
          <radialGradient id="furGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e8c4a0" />
            <stop offset="55%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#b8895c" />
          </radialGradient>
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff0e0" />
            <stop offset="100%" stopColor="#f5d5b5" />
          </radialGradient>
          <filter id="furSoft">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {/* Ears */}
        <ellipse cx="28" cy="38" rx="16" ry="18" fill="url(#furGrad)" />
        <ellipse cx="28" cy="40" rx="9" ry="10" fill="#f0c9a8" />
        <ellipse cx="92" cy="38" rx="16" ry="18" fill="url(#furGrad)" />
        <ellipse cx="92" cy="40" rx="9" ry="10" fill="#f0c9a8" />

        {/* Head fluff */}
        <circle cx="60" cy="58" r="38" fill="url(#furGrad)" />
        <circle cx="42" cy="42" r="10" fill="#e0b48a" opacity="0.45" />
        <circle cx="78" cy="44" r="8" fill="#e0b48a" opacity="0.35" />

        {/* Face plate */}
        <ellipse cx="60" cy="64" rx="26" ry="24" fill="url(#faceGrad)" />

        {/* Eyes */}
        <ellipse cx="48" cy="60" rx="4.2" ry="5" fill="#4a2f1c" />
        <ellipse cx="72" cy="60" rx="4.2" ry="5" fill="#4a2f1c" />
        <circle cx="49.5" cy="58.5" r="1.4" fill="#fff8f0" />
        <circle cx="73.5" cy="58.5" r="1.4" fill="#fff8f0" />

        {/* Nose + mouth */}
        <ellipse cx="60" cy="70" rx="3.2" ry="2.4" fill="#c48a5a" />
        {mood === "sleepy" ? (
          <path
            d="M52 78c5 2 11 2 16 0"
            stroke="#6b4226"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === "love" ? (
          <>
            <path
              d="M52 76c4 5 12 5 16 0"
              stroke="#6b4226"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <text x="86" y="52" fontSize="12" fill="#b85c5c">
              ♥
            </text>
          </>
        ) : (
          <path
            d="M52 76c4 4 12 4 16 0"
            stroke="#6b4226"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Rosy cheeks */}
        <ellipse cx="40" cy="72" rx="6" ry="4" fill="#f3c5c5" opacity="0.85" />
        <ellipse cx="80" cy="72" rx="6" ry="4" fill="#f3c5c5" opacity="0.85" />

        {/* Tiny chin tuft */}
        <ellipse cx="60" cy="88" rx="8" ry="4" fill="#d4a574" opacity="0.5" />
      </svg>

      {withBow && (
        <div className="absolute -top-1 right-0 rotate-12">
          <CuteBow
            className={cn(
              size === "sm" ? "h-5 w-8" : size === "lg" ? "h-12 w-20" : "h-8 w-14",
            )}
          />
        </div>
      )}
    </div>
  );
}

/** Two cozy monkey friends — placeholder until custom photos/art are added. */
export function MonchhichiDuo({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative flex items-end justify-center gap-1", className)}
      aria-hidden
    >
      <MonchhichiMascot size="md" withBow mood="love" className="-rotate-6" />
      <MonchhichiMascot
        size="md"
        withBow={false}
        mood="happy"
        className="z-10 mb-2 rotate-3"
      />
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-display text-sm text-muted-red">
        ♥
      </span>
    </div>
  );
}

export function BirthdayCakeIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("relative mx-auto w-40 select-none", className)}
      aria-hidden
    >
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="animate-sparkle text-sm text-caramel">✦</span>
            <span className="h-5 w-1 rounded-full bg-soft-pink" />
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-t-2xl bg-gradient-to-b from-soft-pink to-blush px-3 pb-2 pt-4 shadow-md">
        <div className="mx-auto h-2 w-28 rounded-full bg-white/50" />
        <div className="mt-2 flex justify-center gap-2 text-xs text-muted-red">
          <span>♥</span>
          <span>★</span>
          <span>♥</span>
        </div>
      </div>
      <div className="rounded-b-2xl bg-caramel px-2 py-3 text-center text-xs font-semibold text-paper">
        25
      </div>
      <div className="mx-auto mt-1 h-2 w-36 rounded-full bg-warm-brown/30" />
    </div>
  );
}

/** Soft plush ribbon strip for coupon / scrapbook cards. */
export function PlushRibbon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -right-1 top-4 h-8 w-16 rotate-12",
        className,
      )}
    >
      <div className="h-full w-full rounded-l-md bg-gradient-to-r from-soft-pink to-blush shadow-sm" />
      <div className="absolute -bottom-2 right-0 border-t-[10px] border-l-[10px] border-t-muted-red/40 border-l-transparent" />
    </div>
  );
}

/** Tiny corner monkey face for cards / header. */
export function MonchhichiBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-caramel/30 bg-paper/90 px-2.5 py-1 shadow-sm",
        className,
      )}
    >
      <MonchhichiMascot size="sm" withBow className="!h-7 !w-7" />
      <span className="text-[11px] font-bold tracking-wide text-caramel uppercase">
        Cozy club
      </span>
    </div>
  );
}

/** @deprecated Use MonchhichiMascot — kept for compatibility. */
export function MonkeyFacePlaceholder({
  className,
}: {
  className?: string;
}) {
  return <MonchhichiMascot size="lg" className={className} mood="happy" />;
}

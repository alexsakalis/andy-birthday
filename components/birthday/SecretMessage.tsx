"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";
import { cn } from "@/lib/utils";

type SecretMessageProps = {
  discovered: boolean;
  onDiscover: () => void;
};

export function SecretMessage({ discovered, onDiscover }: SecretMessageProps) {
  const [taps, setTaps] = useState(0);
  const reduced = usePrefersReducedMotion();
  const revealed = discovered || taps >= 5;

  function handleTap() {
    if (revealed) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= 5) onDiscover();
  }

  return (
    <div className="mt-8 text-center">
      <button
        type="button"
        onClick={handleTap}
        className="touch-target inline-flex flex-col items-center gap-2 rounded-full px-4 py-2"
        aria-label={
          revealed
            ? "Secret message revealed"
            : `Tap the heart to reveal a secret. ${taps} of 5 taps`
        }
      >
        <motion.span
          animate={
            reduced
              ? undefined
              : revealed
                ? { scale: [1, 1.2, 1] }
                : { scale: 1 }
          }
          transition={{ duration: 0.45 }}
        >
          <Heart
            className={cn(
              "size-10 transition",
              revealed
                ? "fill-muted-red text-muted-red"
                : "fill-soft-pink text-muted-red",
            )}
          />
        </motion.span>
        {!revealed && (
          <span className="text-xs text-caramel">
            Tap the heart {Math.max(0, 5 - taps)} more time
            {5 - taps === 1 ? "" : "s"}
          </span>
        )}
      </button>

      {revealed && (
        <motion.div
          className="mx-auto mt-4 max-w-md rounded-3xl bg-soft-pink/40 px-5 py-4"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-display text-xl text-warm-brown text-balance">
            {siteConfig.secretMessage}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.secretCouponHint}
          </p>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { CuteBow } from "@/components/decor/CuteDecor";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

type GiftOpeningAnimationProps = {
  opened: boolean;
  className?: string;
};

export function GiftOpeningAnimation({
  opened,
  className,
}: GiftOpeningAnimationProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "relative mx-auto flex h-44 w-44 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="absolute inset-x-8 bottom-4 top-16 rounded-2xl bg-gradient-to-b from-caramel to-[#a87345] shadow-lg"
        animate={
          reduced
            ? undefined
            : opened
              ? { y: 8, scale: 0.96 }
              : { y: [0, -4, 0] }
        }
        transition={
          opened
            ? { duration: 0.4 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-soft-pink" />
        <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-soft-pink" />
      </motion.div>

      <motion.div
        className="absolute inset-x-6 top-10 h-12 rounded-xl bg-muted-red shadow-md"
        animate={
          reduced
            ? undefined
            : opened
              ? { y: -36, rotate: -12, opacity: 0.85 }
              : { y: 0, rotate: 0, opacity: 1 }
        }
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
      >
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-soft-pink" />
      </motion.div>

      <motion.div
        className="absolute top-2 left-1/2 -translate-x-1/2"
        animate={
          reduced
            ? undefined
            : opened
              ? { y: -28, scale: 1.1, rotate: 8 }
              : { y: 0, scale: 1, rotate: 0 }
        }
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <CuteBow className="h-12 w-20" />
      </motion.div>

      {opened && !reduced && (
        <>
          {["♥", "✦", "★", "♥", "✧"].map((glyph, i) => (
            <motion.span
              key={glyph + i}
              className="absolute text-lg text-muted-red"
              initial={{ opacity: 0, y: 10, x: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -50 - i * 8,
                x: (i - 2) * 18,
              }}
              transition={{ duration: 1.1, delay: i * 0.05 }}
            >
              {glyph}
            </motion.span>
          ))}
        </>
      )}
    </div>
  );
}

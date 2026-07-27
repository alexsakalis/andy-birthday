"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MonchhichiMascot } from "@/components/decor/CuteDecor";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";
import { cn } from "@/lib/utils";

type PettableMascotProps = {
  size?: "sm" | "md" | "lg";
  withBow?: boolean;
  mood?: "happy" | "sleepy" | "love";
  className?: string;
};

type HeartParticle = { id: number; x: number; delay: number };

const PET_COOLDOWN_MS = 450;
const LOVE_MOOD_MS = 800;

export function PettableMascot({
  size = "md",
  withBow = true,
  mood = "happy",
  className,
}: PettableMascotProps) {
  const reduced = usePrefersReducedMotion();
  const [displayMood, setDisplayMood] = useState(mood);
  const [bouncing, setBouncing] = useState(false);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const lastPetRef = useRef(0);
  const heartIdRef = useRef(0);
  const moodTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayMood(mood);
  }, [mood]);

  function handlePet() {
    const now = Date.now();
    if (now - lastPetRef.current < PET_COOLDOWN_MS) return;
    lastPetRef.current = now;

    setDisplayMood("love");
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
    }
    moodTimerRef.current = window.setTimeout(() => {
      setDisplayMood(mood);
      moodTimerRef.current = null;
    }, LOVE_MOOD_MS);

    if (reduced) return;

    setBouncing(true);
    window.setTimeout(() => setBouncing(false), 500);

    const burst: HeartParticle[] = Array.from({ length: 4 }).map((_, i) => {
      heartIdRef.current += 1;
      return {
        id: heartIdRef.current,
        x: -18 + i * 14 + (i % 2) * 4,
        delay: i * 0.04,
      };
    });
    setHearts(burst);
    window.setTimeout(() => setHearts([]), 900);
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <motion.button
        type="button"
        onClick={handlePet}
        aria-label="Pet the Monchhichi"
        className="touch-target relative cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-soft-pink focus-visible:ring-offset-2"
        animate={
          reduced
            ? undefined
            : bouncing
              ? { y: [0, -10, 0], scale: [1, 1.06, 1] }
              : { y: 0, scale: 1 }
        }
        transition={
          bouncing
            ? { duration: 0.45, ease: "easeOut" }
            : { type: "spring", stiffness: 420, damping: 16 }
        }
      >
        <MonchhichiMascot size={size} withBow={withBow} mood={displayMood} />
      </motion.button>

      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="pointer-events-none absolute left-1/2 top-1/3 text-sm text-muted-red"
            style={{ marginLeft: heart.x }}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -36, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, delay: heart.delay, ease: "easeOut" }}
            aria-hidden
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

type HeartConfettiProps = {
  active: boolean;
  onDone?: () => void;
};

type Piece = { id: number; x: number; delay: number; glyph: string };

export function HeartConfetti({ active, onDone }: HeartConfettiProps) {
  const reduced = usePrefersReducedMotion();
  const [burstId, setBurstId] = useState(0);

  // Bump burst id when activation flips on (event-driven from parent).
  const [prevActive, setPrevActive] = useState(active);
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setBurstId((id) => id + 1);
  }

  const pieces = useMemo<Piece[]>(() => {
    if (!active || reduced || burstId === 0) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: burstId * 100 + i,
      x: ((i * 37) % 100) + (i % 3),
      delay: (i % 5) * 0.05,
      glyph: ["♥", "✦", "★", "✧"][i % 4],
    }));
  }, [active, reduced, burstId]);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      onDone?.();
      return;
    }

    const timer = window.setTimeout(() => {
      onDone?.();
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [active, onDone, reduced, burstId]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          aria-hidden
        >
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute text-xl text-muted-red"
              style={{ left: `${piece.x}%`, top: "40%" }}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -180, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: piece.delay, ease: "easeOut" }}
            >
              {piece.glyph}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

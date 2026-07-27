"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { getCountdownParts } from "@/lib/countdown";
import { BIRTHDAY_CELEBRATED_KEY } from "@/lib/storage-keys";

function readCelebrated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(BIRTHDAY_CELEBRATED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCelebrated() {
  try {
    window.localStorage.setItem(BIRTHDAY_CELEBRATED_KEY, "1");
  } catch {
    // Ignore quota / private mode failures.
  }
}

/**
 * Fires a one-time confetti celebration when the birthday countdown
 * hits zero (live flip) or on first visit after midnight on the birthday.
 */
export function useBirthdayCelebration() {
  const [active, setActive] = useState(false);
  const wasBirthdayRef = useRef<boolean | null>(null);
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (!siteConfig.countdownEnabled) return;

    celebratedRef.current = readCelebrated();

    const tick = () => {
      const { isBirthday } = getCountdownParts();
      const prev = wasBirthdayRef.current;
      wasBirthdayRef.current = isBirthday;

      if (!isBirthday || celebratedRef.current) return;

      // Live flip false → true, or first load already past midnight.
      const flipped = prev === false && isBirthday;
      const firstVisitAfter = prev === null && isBirthday;

      if (flipped || firstVisitAfter) {
        celebratedRef.current = true;
        writeCelebrated();
        setActive(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const onDone = useCallback(() => {
    setActive(false);
  }, []);

  return { active, onDone };
}

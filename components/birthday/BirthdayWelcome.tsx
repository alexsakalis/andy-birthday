"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BirthdayCountdown } from "@/components/birthday/BirthdayCountdown";
import { GiftOpeningAnimation } from "@/components/birthday/GiftOpeningAnimation";
import {
  BirthdayCakeIllustration,
  FloatingDecor,
  MonchhichiDuo,
  MonchhichiBadge,
  PawPrint,
} from "@/components/decor/CuteDecor";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

type BirthdayWelcomeProps = {
  onOpen: () => void;
  returning?: boolean;
};

export function BirthdayWelcome({
  onOpen,
  returning = false,
}: BirthdayWelcomeProps) {
  const [opening, setOpening] = useState(false);
  const reduced = usePrefersReducedMotion();

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(
      () => {
        onOpen();
      },
      reduced ? 150 : 900,
    );
  }

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-10">
      <FloatingDecor />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MonchhichiBadge className="mb-4" />

        <p className="mb-3 text-sm font-semibold tracking-wide text-caramel uppercase">
          For {siteConfig.recipientName}, from {siteConfig.senderName}
        </p>

        <h1 className="font-display text-4xl leading-tight text-warm-brown sm:text-5xl text-balance">
          {siteConfig.welcomeTitle}
        </h1>

        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg text-balance">
          {siteConfig.welcomeSubtitle}
        </p>

        <p className="mt-3 flex items-center gap-2 text-sm text-muted-red/80">
          <PawPrint className="h-4 w-4" />
          <span>{siteConfig.themeTagline}</span>
          <PawPrint className="h-4 w-4" />
        </p>

        <div className="relative mt-8 mb-2">
          {opening ? (
            <GiftOpeningAnimation opened />
          ) : (
            <div className="fur-card plush-border flex flex-col items-center gap-3 rounded-[2rem] px-8 py-6">
              <MonchhichiDuo />
              <BirthdayCakeIllustration className="scale-90" />
              <p className="max-w-[16rem] text-xs text-caramel">
                Soft little friends keeping your birthday gift cozy until you open it.
              </p>
            </div>
          )}
        </div>

        {!opening && (
          <BirthdayCountdown variant="hero" className="mt-6" />
        )}

        {returning && !opening && (
          <p className="mt-3 mb-1 text-sm text-caramel">
            Welcome back, love — your coupon book is waiting.
          </p>
        )}

        <Button
          size="lg"
          onClick={handleOpen}
          disabled={opening}
          className="touch-target mt-4 h-12 rounded-full bg-muted-red px-8 text-base text-paper shadow-md hover:bg-muted-red/90"
        >
          {opening ? "Opening…" : "Open Your Birthday Gift"}
        </Button>

        <p className="mt-5 text-xs text-muted-foreground">
          A handmade little book of love • No expiry dates
        </p>
      </motion.div>
    </section>
  );
}

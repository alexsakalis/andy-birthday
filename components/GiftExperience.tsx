"use client";

import { useState } from "react";
import { CouponBook } from "@/components/coupons/CouponBook";
import { MonchhichiMascot } from "@/components/decor/CuteDecor";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { siteConfig } from "@/config/site";
import { useCouponBook } from "@/lib/hooks/use-coupon-book";
import { BirthdayCountdown } from "@/components/birthday/BirthdayCountdown";
import { BirthdayLetter } from "@/components/birthday/BirthdayLetter";
import { BirthdayWelcome } from "@/components/birthday/BirthdayWelcome";
import { FinalBirthdayMessage } from "@/components/birthday/FinalBirthdayMessage";

export function GiftExperience() {
  const {
    hydrated,
    welcomeOpened,
    secretDiscovered,
    musicEnabled,
    coupons,
    progress,
    setWelcomeOpened,
    setSecretDiscovered,
    setMusicEnabled,
    redeem,
    undo,
    resetAll,
    syncError,
    remoteConfigured,
  } = useCouponBook();

  // Session-only override: after opening (or after reset), control welcome locally.
  const [forceWelcome, setForceWelcome] = useState<boolean | null>(null);
  const showWelcome =
    forceWelcome !== null ? forceWelcome : hydrated ? !welcomeOpened : true;

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5">
        <div className="text-center">
          <MonchhichiMascot size="md" mood="sleepy" className="mb-3" />
          <p className="font-display text-2xl text-warm-brown">
            Preparing your gift…
          </p>
          <p className="mt-2 text-sm text-caramel">with love from Alex</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <BirthdayWelcome
        returning={welcomeOpened}
        onOpen={() => {
          setWelcomeOpened(true);
          setForceWelcome(false);
        }}
      />
    );
  }

  return (
    <div className="relative pb-16">
      <header className="sticky top-0 z-40 border-b border-caramel/20 bg-cream/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="hidden shrink-0 sm:block">
              <MonchhichiMascot size="sm" withBow className="!h-10 !w-10" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight text-warm-brown">
                {siteConfig.recipientName}&apos;s Coupon Book
              </p>
              <p className="truncate text-xs text-caramel">
                {siteConfig.themeName} · Happy {siteConfig.birthdayAge}th
                {remoteConfigured ? " · Synced" : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden md:block">
              <BirthdayCountdown variant="compact" />
            </div>
            <SettingsPanel
              musicEnabled={musicEnabled}
              onMusicToggle={setMusicEnabled}
              onReset={() => {
                resetAll();
                setForceWelcome(true);
              }}
            />
          </div>
        </div>
        <div className="mx-auto mt-2 flex max-w-6xl justify-center md:hidden">
          <BirthdayCountdown variant="compact" />
        </div>
      </header>

      {syncError && (
        <div
          role="status"
          className="mx-auto mt-3 max-w-3xl px-5 text-center text-sm text-muted-red"
        >
          Couldn&apos;t sync just now — your changes are saved on this device. ({syncError})
        </div>
      )}

      <BirthdayLetter />
      <CouponBook
        coupons={coupons}
        progress={progress}
        onRedeem={redeem}
        onUndo={undo}
      />
      <FinalBirthdayMessage
        secretDiscovered={secretDiscovered}
        onDiscoverSecret={() => setSecretDiscovered(true)}
      />

      <footer className="mx-auto max-w-3xl px-5 pb-8 text-center text-xs text-muted-foreground">
        Made with love for {siteConfig.recipientName} by {siteConfig.senderName}{" "}
        · {siteConfig.themeName} · No prices, no accounts, just memories
      </footer>
    </div>
  );
}

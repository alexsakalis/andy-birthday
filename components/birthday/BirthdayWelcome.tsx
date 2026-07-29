"use client";

import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { BirthdayCountdown } from "@/components/birthday/BirthdayCountdown";
import { GiftOpeningAnimation } from "@/components/birthday/GiftOpeningAnimation";
import {
  CuteBow,
  FloatingDecor,
  MonchhichiDuo,
  PawPrint,
} from "@/components/decor/CuteDecor";
import { HeartConfetti } from "@/components/coupons/HeartConfetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { useBirthdayCelebration } from "@/lib/hooks/use-birthday-celebration";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

type BirthdayWelcomeProps = {
  onOpen: () => void;
  returning?: boolean;
};

export function BirthdayWelcome({
  onOpen,
  returning = false,
}: BirthdayWelcomeProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { active: confettiActive, onDone: onConfettiDone } =
    useBirthdayCelebration();

  function openPasswordDialog() {
    if (opening) return;
    setError(null);
    setPassword("");
    setPasswordOpen(true);
  }

  function closePasswordDialog(nextOpen: boolean) {
    setPasswordOpen(nextOpen);
    if (!nextOpen) {
      setPassword("");
      setError(null);
    }
  }

  function handleUnlock(event: FormEvent) {
    event.preventDefault();
    if (opening) return;

    if (password !== siteConfig.resetPassword) {
      setError("Incorrect password.");
      return;
    }

    setPasswordOpen(false);
    setPassword("");
    setError(null);
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
      <HeartConfetti active={confettiActive} onDone={onConfettiDone} />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-3 text-sm font-semibold tracking-wide text-caramel uppercase">
          For {siteConfig.recipientName}, from {siteConfig.senderName}
        </p>

        <h1 className="font-display text-4xl leading-tight text-warm-brown sm:text-5xl text-balance">
          {siteConfig.welcomeTitle}
        </h1>

        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg text-balance">
          {siteConfig.welcomeSubtitle}
        </p>

        <div className="relative mt-8 mb-2 w-full max-w-sm">
          {opening ? (
            <GiftOpeningAnimation opened />
          ) : (
            <button
              type="button"
              onClick={openPasswordDialog}
              className="group relative w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-soft-pink focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              aria-label="Open birthday card — password required"
            >
              <motion.div
                className="fur-card plush-border relative overflow-hidden rounded-[1.75rem] px-6 pb-7 pt-10 shadow-md transition group-hover:-translate-y-1 group-hover:shadow-lg"
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <CuteBow className="h-10 w-16" />
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-soft-pink/50 to-transparent"
                />

                <p className="text-center text-xs font-semibold tracking-[0.2em] text-caramel uppercase">
                  Birthday Card
                </p>

                <p className="mt-3 text-center font-display text-2xl text-warm-brown text-balance">
                  To {siteConfig.recipientName}
                </p>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  With love from {siteConfig.senderName}
                </p>

                <div className="mt-5 flex justify-center">
                  <MonchhichiDuo />
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-red/85">
                  <PawPrint className="h-4 w-4" />
                  <span>Tap to open</span>
                  <PawPrint className="h-4 w-4" />
                </div>

                <p className="mt-2 text-center text-xs text-caramel">
                  Password required
                </p>
              </motion.div>
            </button>
          )}
        </div>

        {!opening && <BirthdayCountdown variant="hero" className="mt-6" />}

        {returning && !opening && (
          <p className="mt-3 mb-1 text-sm text-caramel">
            Welcome back — enter your password to open your card again.
          </p>
        )}

        {!opening && (
          <Button
            size="lg"
            onClick={openPasswordDialog}
            className="touch-target mt-4 h-12 rounded-full bg-muted-red px-8 text-base text-paper shadow-md hover:bg-muted-red/90"
          >
            Open Birthday Card
          </Button>
        )}

        {opening && (
          <p className="mt-4 font-display text-xl text-warm-brown">Opening…</p>
        )}
      </motion.div>

      <Dialog open={passwordOpen} onOpenChange={closePasswordDialog}>
        <DialogContent className="max-w-md rounded-3xl border-caramel/30 bg-paper sm:max-w-md">
          <form onSubmit={handleUnlock}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-warm-brown">
                Enter the password
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This birthday card stays sealed until you enter the password
                from Alex.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-2">
              <label className="block text-left text-sm font-semibold text-warm-brown">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError(null);
                  }}
                  className="mt-1.5 w-full rounded-2xl border border-caramel/35 bg-cream px-4 py-3 text-base text-warm-brown outline-none focus:border-muted-red focus:ring-2 focus:ring-soft-pink"
                  placeholder="Enter password"
                />
              </label>
              {error && (
                <p className="text-left text-sm text-muted-red" role="alert">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => closePasswordDialog(false)}
              >
                Not yet
              </Button>
              <Button
                type="submit"
                disabled={!password.trim()}
                className="rounded-full bg-muted-red text-paper hover:bg-muted-red/90"
              >
                Unlock card
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

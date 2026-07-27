"use client";

import { motion } from "motion/react";
import { SecretMessage } from "@/components/birthday/SecretMessage";
import { PettableMascot } from "@/components/decor/PettableMascot";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

type FinalBirthdayMessageProps = {
  secretDiscovered: boolean;
  onDiscoverSecret: () => void;
};

export function FinalBirthdayMessage({
  secretDiscovered,
  onDiscoverSecret,
}: FinalBirthdayMessageProps) {
  const reduced = usePrefersReducedMotion();

  function scrollToCoupons() {
    document.getElementById("coupon-book")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="final-message" className="mx-auto w-full max-w-2xl px-5 py-14">
      <motion.div
        className="fur-card stitch-border rounded-3xl px-6 py-10 text-center sm:px-10"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <PettableMascot size="md" mood="love" className="mb-4" />
        <p className="text-sm font-semibold tracking-wide text-caramel uppercase">
          One last cozy note
        </p>
        <h2 className="mt-3 font-display text-3xl text-warm-brown sm:text-4xl text-balance">
          {siteConfig.finalHeading}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground text-balance">
          {siteConfig.finalMessage}
        </p>
        <p className="mt-6 font-display text-xl text-warm-brown">
          Love, {siteConfig.senderName}
        </p>

        <motion.div
          className="mt-6 text-4xl text-muted-red"
          animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          ♥
        </motion.div>

        <Button
          type="button"
          onClick={scrollToCoupons}
          className="touch-target mt-6 h-11 rounded-full bg-caramel px-6 text-paper hover:bg-caramel/90"
        >
          Back to the Coupon Book
        </Button>

        <SecretMessage
          discovered={secretDiscovered}
          onDiscover={onDiscoverSecret}
        />
      </motion.div>
    </section>
  );
}

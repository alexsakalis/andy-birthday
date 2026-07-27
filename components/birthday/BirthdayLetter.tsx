"use client";

import { motion } from "motion/react";
import { CuteBow, MonchhichiMascot, PawPrint } from "@/components/decor/CuteDecor";
import { siteConfig } from "@/config/site";
import { loveReasons } from "@/data/love-reasons";
import { useRandomIndex, usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";
import { DaysTogetherCounter } from "@/components/birthday/DaysTogetherCounter";

export function BirthdayLetter() {
  const reduced = usePrefersReducedMotion();
  const reasonIndex = useRandomIndex(loveReasons.length);
  const paragraphs = siteConfig.birthdayMessage
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="birthday-letter"
      className="mx-auto w-full max-w-2xl px-5 py-12"
    >
      <motion.article
        className="fur-card stitch-border relative rounded-3xl p-6 sm:p-8"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <CuteBow />
        </div>

        <div className="mb-4 flex justify-center">
          <MonchhichiMascot size="sm" mood="love" />
        </div>

        <p className="mb-4 text-center text-sm font-semibold tracking-wide text-caramel uppercase">
          A letter for you
        </p>

        <div className="space-y-4 text-base leading-relaxed text-warm-brown/90 whitespace-pre-line">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-soft-pink/40 px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-red uppercase">
            <PawPrint className="h-3.5 w-3.5" />
            Reason I love you
            <PawPrint className="h-3.5 w-3.5" />
          </p>
          <p className="mt-1 font-display text-lg text-warm-brown text-balance">
            {loveReasons[reasonIndex]}
          </p>
        </div>

        <DaysTogetherCounter className="mt-6" />
      </motion.article>
    </section>
  );
}

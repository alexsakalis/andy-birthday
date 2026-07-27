"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { photos } from "@/data/photos";
import type { Photo } from "@/types/photo";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-local-preference";

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3", "rotate-1"];

export function PhotoGallery() {
  const [active, setActive] = useState<Photo | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <section id="photo-gallery" className="mx-auto w-full max-w-5xl px-5 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold tracking-wide text-caramel uppercase">
          Our cozy memories
        </p>
        <h2 className="mt-2 font-display text-3xl text-warm-brown sm:text-4xl text-balance">
          A soft scrapbook of us
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Placeholders for now — Alex will add our real photos into{" "}
          <code className="rounded bg-beige px-1.5 py-0.5 text-sm">/public/photos</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <motion.button
            key={photo.id}
            type="button"
            onClick={() => setActive(photo)}
            className={cn(
              "paper-card group mx-auto w-full max-w-xs rounded-md border border-caramel/20 p-3 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg",
              rotations[index % rotations.length],
            )}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-beige">
              {photo.isPlaceholder ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <span className="text-3xl" aria-hidden>
                    📷
                  </span>
                  <p className="text-sm font-semibold text-warm-brown">
                    Add your photo here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    File: {photo.filename}
                  </p>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/photos/${photo.filename}`}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="mt-3 px-1">
              <p className="font-display text-base text-warm-brown">{photo.caption}</p>
              {(photo.date || photo.location) && (
                <p className="mt-1 text-xs text-caramel">
                  {[photo.date, photo.location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </motion.button>
        ))}

        <motion.div
          className="paper-card mx-auto flex w-full max-w-xs rotate-1 flex-col items-center justify-center rounded-md border border-dashed border-caramel/40 p-6 text-center"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="text-3xl" aria-hidden>
            ♥
          </span>
          <p className="mt-3 font-display text-xl text-warm-brown">
            More memories coming soon
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Our story keeps growing.
          </p>
        </motion.div>
      </div>

      <PhotoLightbox
        photo={active}
        open={Boolean(active)}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

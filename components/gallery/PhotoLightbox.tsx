"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/types/photo";

type PhotoLightboxProps = {
  photo: Photo | null;
  open: boolean;
  onClose: () => void;
};

export function PhotoLightbox({ photo, open, onClose }: PhotoLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-warm-brown/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-paper p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 touch-target rounded-full"
          onClick={onClose}
          aria-label="Close photo"
        >
          <X />
        </Button>

        {photo.isPlaceholder ? (
          <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-beige px-6 text-center">
            <div>
              <p className="font-display text-xl text-warm-brown">Photo coming soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add <code className="rounded bg-paper px-1">{photo.filename}</code>{" "}
                to <code className="rounded bg-paper px-1">/public/photos</code>
              </p>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/photos/${photo.filename}`}
            alt={photo.alt}
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-4 px-1 text-center">
          <p className="font-display text-lg text-warm-brown">{photo.caption}</p>
          {(photo.date || photo.location) && (
            <p className="mt-1 text-sm text-caramel">
              {[photo.date, photo.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

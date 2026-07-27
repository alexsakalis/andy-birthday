"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Coupon } from "@/types/coupon";
import { remainingLabel } from "@/lib/coupon-service";

type CustomWishModalProps = {
  coupon: Coupon | null;
  open: boolean;
  remaining: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (wish: string) => void;
};

export function CustomWishModal({
  coupon,
  open,
  remaining,
  onOpenChange,
  onConfirm,
}: CustomWishModalProps) {
  const [wish, setWish] = useState("");
  const trimmed = wish.trim();

  function handleOpenChange(next: boolean) {
    if (!next) setWish("");
    onOpenChange(next);
  }

  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md rounded-3xl border-caramel/30 bg-paper p-0 sm:max-w-md"
        showCloseButton
      >
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-warm-brown">
              Make a wish
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tell Alex what your heart wants. This uses one redemption (
              {remainingLabel(remaining).toLowerCase()}).
            </DialogDescription>
          </DialogHeader>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-warm-brown">
              Your wish
            </span>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              rows={4}
              maxLength={200}
              placeholder="A picnic by the water…"
              className="w-full resize-none rounded-2xl border border-caramel/30 bg-cream px-4 py-3 text-base text-warm-brown outline-none ring-caramel/40 placeholder:text-muted-foreground/70 focus:ring-2"
            />
            <span className="mt-1 block text-right text-xs text-caramel">
              {trimmed.length}/200
            </span>
          </label>
        </div>
        <DialogFooter className="gap-2 border-caramel/20 bg-beige/40 sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="touch-target h-11 flex-1 rounded-full"
            onClick={() => handleOpenChange(false)}
          >
            Not Yet
          </Button>
          <Button
            type="button"
            disabled={!trimmed}
            className="touch-target h-11 flex-1 rounded-full bg-muted-red text-paper hover:bg-muted-red/90"
            onClick={() => {
              onConfirm(trimmed);
              setWish("");
            }}
          >
            Redeem Wish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

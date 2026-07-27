"use client";

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

type UndoRedemptionDialogProps = {
  coupon: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function UndoRedemptionDialog({
  coupon,
  open,
  onOpenChange,
  onConfirm,
}: UndoRedemptionDialogProps) {
  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-3xl border-caramel/30 bg-paper p-0 sm:max-w-md"
        showCloseButton
      >
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-warm-brown">
              Undo latest redemption?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to restore one use of{" "}
              <span className="font-semibold text-warm-brown">
                {coupon.title}
              </span>
              ? This only removes the most recent redemption.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="gap-2 border-caramel/20 bg-beige/40 sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="touch-target h-11 flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Keep It
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="touch-target h-11 flex-1 rounded-full"
            onClick={onConfirm}
          >
            Restore One Use
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

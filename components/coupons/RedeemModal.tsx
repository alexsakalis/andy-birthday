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
import { CouponIcon } from "@/components/coupons/CouponIcon";
import { remainingLabel } from "@/lib/coupon-service";
import type { Coupon } from "@/types/coupon";

type RedeemModalProps = {
  coupon: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  remaining: number;
};

export function RedeemModal({
  coupon,
  open,
  onOpenChange,
  onConfirm,
  remaining,
}: RedeemModalProps) {
  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-3xl border-caramel/30 bg-paper p-0 sm:max-w-md"
        showCloseButton
      >
        <div className="p-5 sm:p-6">
          <DialogHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-soft-pink/50 text-muted-red">
              <CouponIcon name={coupon.icon} className="size-6" />
            </div>
            <DialogTitle className="font-display text-2xl text-warm-brown">
              Redeem this coupon?
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              <span className="mt-2 block font-semibold text-warm-brown">
                {coupon.title}
              </span>
              <span className="mt-2 block">
                You currently have {remainingLabel(remaining).toLowerCase()}.
              </span>
              <span className="mt-2 block">
                Would you like to use one redemption now?
              </span>
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
            Not Yet
          </Button>
          <Button
            type="button"
            className="touch-target h-11 flex-1 rounded-full bg-muted-red text-paper hover:bg-muted-red/90"
            onClick={onConfirm}
          >
            Redeem It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

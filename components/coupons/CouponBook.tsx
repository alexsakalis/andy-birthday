"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryFilter } from "@/components/coupons/CategoryFilter";
import { CouponCard } from "@/components/coupons/CouponCard";
import { CouponProgress } from "@/components/coupons/CouponProgress";
import { CustomWishModal } from "@/components/coupons/CustomWishModal";
import { HeartConfetti } from "@/components/coupons/HeartConfetti";
import { RedeemModal } from "@/components/coupons/RedeemModal";
import { UndoRedemptionDialog } from "@/components/coupons/UndoRedemptionDialog";
import { Button } from "@/components/ui/button";
import {
  getRemainingRedemptions,
  successMessage,
} from "@/lib/coupon-service";
import type { Coupon, CouponProgressSummary } from "@/types/coupon";

type CouponBookProps = {
  coupons: Coupon[];
  progress: CouponProgressSummary;
  onRedeem: (
    couponId: string,
    note?: string,
  ) => { ok: true; coupon: Coupon } | { ok: false; error: string };
  onUndo: (
    couponId: string,
  ) => { ok: true; coupon: Coupon } | { ok: false; error: string };
};

export function CouponBook({
  coupons,
  progress,
  onRedeem,
  onUndo,
}: CouponBookProps) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [undoOpen, setUndoOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  const filtered = useMemo(() => {
    if (category === "All") return coupons;
    return coupons.filter((coupon) => coupon.category === category);
  }, [category, coupons]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, filtered]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function beginRedeem(coupon: Coupon) {
    setSelected(coupon);
    if (coupon.requiresWish) {
      setWishOpen(true);
    } else {
      setRedeemOpen(true);
    }
  }

  function beginUndo(coupon: Coupon) {
    setSelected(coupon);
    setUndoOpen(true);
  }

  function completeRedeem(note?: string) {
    if (!selected) return;
    const result = onRedeem(selected.id, note);
    setRedeemOpen(false);
    setWishOpen(false);

    if (!result.ok) {
      setToast(result.error);
      return;
    }

    const remaining = getRemainingRedemptions(result.coupon);
    setToast(successMessage(remaining));
    setConfetti(true);
    setSelected(null);
  }

  function completeUndo() {
    if (!selected) return;
    const result = onUndo(selected.id);
    setUndoOpen(false);

    if (!result.ok) {
      setToast(result.error);
      return;
    }

    setToast("One use has been restored.");
    setSelected(null);
  }

  const remainingForSelected = selected
    ? getRemainingRedemptions(selected)
    : 0;

  return (
    <section id="coupon-book" className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold tracking-wide text-caramel uppercase">
          Your cozy coupon book
        </p>
        <h2 className="mt-2 font-display text-3xl text-warm-brown sm:text-4xl text-balance">
          Soft little tickets for big love
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Each coupon can be redeemed three times — whenever you want, with no
          expiry dates. Tied up with bows, paws, and plenty of warmth.
        </p>
      </div>

      <CouponProgress progress={progress} className="mb-6" />

      <div className="mb-5">
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <div className="paper-card rounded-3xl p-8 text-center">
          <p className="font-display text-xl text-warm-brown">No coupons here</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another category to find more adventures.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {filtered.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="min-w-0 shrink-0 grow-0 basis-[88%] px-2"
                  >
                    <CouponCard
                      coupon={coupon}
                      onRedeemClick={beginRedeem}
                      onUndoClick={beginUndo}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="touch-target rounded-full"
                onClick={scrollPrev}
                aria-label="Previous coupon"
              >
                <ChevronLeft />
              </Button>
              <p className="text-sm text-caramel">Swipe to browse</p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="touch-target rounded-full"
                onClick={scrollNext}
                aria-label="Next coupon"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onRedeemClick={beginRedeem}
                onUndoClick={beginUndo}
              />
            ))}
          </div>
        </>
      )}

      <RedeemModal
        coupon={selected}
        open={redeemOpen}
        remaining={remainingForSelected}
        onOpenChange={setRedeemOpen}
        onConfirm={() => completeRedeem()}
      />

      <CustomWishModal
        coupon={selected}
        open={wishOpen}
        remaining={remainingForSelected}
        onOpenChange={setWishOpen}
        onConfirm={(wish) => completeRedeem(wish)}
      />

      <UndoRedemptionDialog
        coupon={selected}
        open={undoOpen}
        onOpenChange={setUndoOpen}
        onConfirm={completeUndo}
      />

      <HeartConfetti active={confetti} onDone={() => setConfetti(false)} />

      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-5 z-50 mx-auto max-w-sm rounded-2xl border border-caramel/30 bg-paper px-4 py-3 text-center text-sm font-semibold text-warm-brown shadow-lg"
        >
          {toast}
        </div>
      )}
    </section>
  );
}

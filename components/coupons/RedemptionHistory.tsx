"use client";

import { useState } from "react";
import { ChevronDown, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatRedemptionDate,
  historyRemainingLabel,
} from "@/lib/coupon-service";
import type { Coupon } from "@/types/coupon";
import { cn } from "@/lib/utils";

type RedemptionHistoryProps = {
  coupon: Coupon;
  onRequestUndo: () => void;
};

export function RedemptionHistory({
  coupon,
  onRequestUndo,
}: RedemptionHistoryProps) {
  const [open, setOpen] = useState(false);
  const history = coupon.redemptionHistory;

  return (
    <div className="mt-3 border-t border-dashed border-caramel/30 pt-3">
      <button
        type="button"
        className="touch-target flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-warm-brown"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Redemption History</span>
        <ChevronDown
          className={cn(
            "size-4 text-caramel transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No redemptions yet — this coupon is waiting for its first adventure.
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((record, index) => (
                <li
                  key={record.id}
                  className="rounded-xl bg-beige/60 px-3 py-2 text-sm text-warm-brown"
                >
                  <p className="font-semibold">
                    Use {index + 1} — {formatRedemptionDate(record.redeemedAt)}
                  </p>
                  {record.note && (
                    <p className="mt-1 italic text-muted-foreground">
                      “{record.note}”
                    </p>
                  )}
                  <p className="mt-1 text-xs text-caramel">
                    {historyRemainingLabel(index, coupon.maxRedemptions)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {history.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="touch-target mt-1 text-caramel hover:text-muted-red"
              onClick={onRequestUndo}
            >
              <Undo2 className="size-4" />
              Undo latest redemption
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

import { coupons as couponDefinitions } from "@/data/coupons";
import type { CouponBookState, RedemptionRecord } from "@/types/coupon";

export type RedemptionEvent = {
  id: string;
  couponId: string;
  couponTitle: string;
  note: string | null;
  redeemedAt: string;
};

const titleById = new Map(
  couponDefinitions.map((coupon) => [coupon.id, coupon.title]),
);

export function flattenRedemptions(state: CouponBookState): RedemptionEvent[] {
  const events: RedemptionEvent[] = [];

  for (const [couponId, history] of Object.entries(state.redemptions)) {
    const title = titleById.get(couponId) ?? couponId;
    for (const record of history) {
      events.push(toEvent(couponId, title, record));
    }
  }

  return events.sort(
    (a, b) =>
      new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime(),
  );
}

function toEvent(
  couponId: string,
  couponTitle: string,
  record: RedemptionRecord,
): RedemptionEvent {
  return {
    id: record.id,
    couponId,
    couponTitle,
    note: record.note?.trim() ? record.note.trim() : null,
    redeemedAt: record.redeemedAt,
  };
}

export function diffRedemptionEvents(
  previous: CouponBookState,
  next: CouponBookState,
): { added: RedemptionEvent[]; removedIds: string[] } {
  const prevMap = new Map(
    flattenRedemptions(previous).map((event) => [event.id, event]),
  );
  const nextMap = new Map(
    flattenRedemptions(next).map((event) => [event.id, event]),
  );

  const added: RedemptionEvent[] = [];
  for (const [id, event] of nextMap) {
    if (!prevMap.has(id)) added.push(event);
  }

  const removedIds: string[] = [];
  for (const id of prevMap.keys()) {
    if (!nextMap.has(id)) removedIds.push(id);
  }

  added.sort(
    (a, b) =>
      new Date(a.redeemedAt).getTime() - new Date(b.redeemedAt).getTime(),
  );

  return { added, removedIds };
}

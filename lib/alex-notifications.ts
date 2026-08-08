import {
  getCouponBookId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { sendRedemptionEmail } from "@/lib/email";
import { sendPushForRedemption } from "@/lib/push";
import {
  flattenRedemptions,
  type RedemptionEvent,
} from "@/lib/redemption-events";
import type { CouponBookState } from "@/types/coupon";
import type {
  AlexNotification,
  AlexNotificationRow,
} from "@/types/notification";

function rowToNotification(row: AlexNotificationRow): AlexNotification {
  return {
    id: row.id,
    bookId: row.book_id,
    couponId: row.coupon_id,
    couponTitle: row.coupon_title,
    note: row.note,
    redeemedAt: row.redeemed_at,
    emailSentAt: row.email_sent_at,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function listAlexNotifications(): Promise<AlexNotification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { data, error } = await supabase
    .from("alex_notifications")
    .select("*")
    .eq("book_id", bookId)
    .order("redeemed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as AlexNotificationRow[]).map(rowToNotification);
}

export async function markAlexNotificationsRead(
  ids?: string[],
): Promise<AlexNotification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();
  const readAt = new Date().toISOString();

  let query = supabase
    .from("alex_notifications")
    .update({ read_at: readAt })
    .eq("book_id", bookId)
    .is("read_at", null);

  if (ids && ids.length > 0) {
    query = query.in("id", ids);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);

  return listAlexNotifications();
}

export async function removeAlexNotifications(ids: string[]): Promise<void> {
  if (!isSupabaseConfigured() || ids.length === 0) return;

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { error } = await supabase
    .from("alex_notifications")
    .delete()
    .eq("book_id", bookId)
    .in("id", ids);

  if (error) throw new Error(error.message);
}

export async function clearAlexNotifications(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { error } = await supabase
    .from("alex_notifications")
    .delete()
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
}

async function upsertNotificationRows(events: RedemptionEvent[]) {
  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const rows = events.map((event) => ({
    id: event.id,
    book_id: bookId,
    coupon_id: event.couponId,
    coupon_title: event.couponTitle,
    note: event.note,
    redeemed_at: event.redeemedAt,
  }));

  const { error } = await supabase
    .from("alex_notifications")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });

  if (error) throw new Error(error.message);
}

/** Backfill inbox rows from current coupon-book state (no emails). */
export async function syncNotificationsFromState(
  state: CouponBookState,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const events = flattenRedemptions(state);
  if (events.length === 0) return;

  try {
    await upsertNotificationRows(events);
  } catch (error) {
    console.error("Failed to backfill Alex notifications", error);
  }
}

/** Insert new redemption alerts, then push + email Alex (best-effort). */
export async function ingestRedemptionEvents(
  events: RedemptionEvent[],
): Promise<void> {
  if (!isSupabaseConfigured() || events.length === 0) return;

  try {
    await upsertNotificationRows(events);
  } catch (error) {
    console.error("Failed to store Alex notifications", error);
    return;
  }

  const supabase = getSupabaseAdmin();

  for (const event of events) {
    try {
      const pushResult = await sendPushForRedemption(event);
      if (pushResult.sent > 0) {
        console.info(
          `Push sent for ${event.id} to ${pushResult.sent} device(s)`,
        );
      }
    } catch (error) {
      console.error("Failed to send push notification", error);
    }

    const result = await sendRedemptionEmail(event);
    if (!result.sent) {
      if (result.error) {
        console.warn("Alex notification email skipped:", result.error);
      }
      continue;
    }

    const { error: updateError } = await supabase
      .from("alex_notifications")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", event.id)
      .is("email_sent_at", null);

    if (updateError) {
      console.error("Failed to mark email sent", updateError.message);
    }
  }
}

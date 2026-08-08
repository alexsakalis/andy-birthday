import webpush from "web-push";
import { siteConfig } from "@/config/site";
import type { RedemptionEvent } from "@/lib/redemption-events";
import {
  getCouponBookId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type AlexPushSubscriptionRow = {
  endpoint: string;
  book_id: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export function isPushConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() &&
      process.env.VAPID_PRIVATE_KEY?.trim(),
  );
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }

  const subject =
    process.env.VAPID_SUBJECT?.trim() ||
    process.env.ALEX_NOTIFY_EMAIL?.trim() ||
    "mailto:alex@localhost";

  webpush.setVapidDetails(
    subject.startsWith("mailto:") ? subject : `mailto:${subject}`,
    publicKey,
    privateKey,
  );
}

export function getVapidPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() || null;
}

export async function savePushSubscription(
  subscription: PushSubscriptionPayload,
  userAgent?: string | null,
) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error("Invalid push subscription");
  }

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();
  const now = new Date().toISOString();

  const { error } = await supabase.from("alex_push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      book_id: bookId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      user_agent: userAgent ?? null,
      updated_at: now,
    },
    { onConflict: "endpoint" },
  );

  if (error) throw new Error(error.message);
}

export async function deletePushSubscription(endpoint: string) {
  if (!isSupabaseConfigured() || !endpoint) return;

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { error } = await supabase
    .from("alex_push_subscriptions")
    .delete()
    .eq("book_id", bookId)
    .eq("endpoint", endpoint);

  if (error) throw new Error(error.message);
}

export async function countPushSubscriptions() {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { count, error } = await supabase
    .from("alex_push_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function listPushSubscriptions() {
  const supabase = getSupabaseAdmin();
  const bookId = getCouponBookId();

  const { data, error } = await supabase
    .from("alex_push_subscriptions")
    .select("*")
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
  return (data ?? []) as AlexPushSubscriptionRow[];
}

function buildPushPayload(event: RedemptionEvent) {
  const title = event.note
    ? `${siteConfig.recipientName} made a wish`
    : `${siteConfig.recipientName} used a coupon`;

  const body = event.note
    ? `${event.couponTitle}: “${event.note}”`
    : event.couponTitle;

  return {
    title,
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    url: "/alex",
    tag: `redeem-${event.id}`,
  };
}

/** Send a Web Push to every saved Alex device (best-effort). */
export async function sendPushForRedemption(
  event: RedemptionEvent,
): Promise<{ sent: number; removed: number }> {
  if (!isSupabaseConfigured() || !isPushConfigured()) {
    return { sent: 0, removed: 0 };
  }

  configureWebPush();
  const rows = await listPushSubscriptions();
  if (rows.length === 0) return { sent: 0, removed: 0 };

  const payload = JSON.stringify(buildPushPayload(event));
  let sent = 0;
  let removed = 0;

  await Promise.all(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint,
            keys: {
              p256dh: row.p256dh,
              auth: row.auth,
            },
          },
          payload,
        );
        sent += 1;
      } catch (error) {
        const statusCode =
          typeof error === "object" &&
          error &&
          "statusCode" in error &&
          typeof (error as { statusCode?: unknown }).statusCode === "number"
            ? (error as { statusCode: number }).statusCode
            : null;

        // Gone / expired subscription — drop it.
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(row.endpoint);
          removed += 1;
          return;
        }

        console.error("Failed to send push notification", error);
      }
    }),
  );

  return { sent, removed };
}

export async function sendTestPush(message?: string) {
  if (!isSupabaseConfigured() || !isPushConfigured()) {
    throw new Error("Push notifications are not configured");
  }

  configureWebPush();
  const rows = await listPushSubscriptions();
  if (rows.length === 0) {
    throw new Error("No devices subscribed yet. Enable push on your phone first.");
  }

  const payload = JSON.stringify({
    title: "Alex dashboard",
    body: message?.trim() || "Test push — you’re all set.",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    url: "/alex",
    tag: `test-${Date.now()}`,
  });

  let sent = 0;
  for (const row of rows) {
    await webpush.sendNotification(
      {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      },
      payload,
    );
    sent += 1;
  }

  return { sent };
}

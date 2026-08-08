import { NextResponse } from "next/server";
import { isAlexAuthenticated } from "@/lib/alex-auth";
import {
  countPushSubscriptions,
  deletePushSubscription,
  getVapidPublicKey,
  isPushConfigured,
  savePushSubscription,
  sendTestPush,
  type PushSubscriptionPayload,
} from "@/lib/push";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!(await isAlexAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const deviceCount = isSupabaseConfigured()
      ? await countPushSubscriptions()
      : 0;

    return NextResponse.json({
      configured: isPushConfigured() && isSupabaseConfigured(),
      publicKey: getVapidPublicKey(),
      deviceCount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load push status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAlexAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!isPushConfigured() || !isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Push notifications are not configured on the server." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      subscription?: PushSubscriptionPayload;
      action?: "subscribe" | "unsubscribe" | "test";
      message?: string;
    };

    if (body.action === "test") {
      const result = await sendTestPush(body.message);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === "unsubscribe") {
      const endpoint = body.subscription?.endpoint;
      if (!endpoint) {
        return NextResponse.json(
          { error: "Missing subscription endpoint." },
          { status: 400 },
        );
      }
      await deletePushSubscription(endpoint);
      return NextResponse.json({
        ok: true,
        deviceCount: await countPushSubscriptions(),
      });
    }

    if (!body.subscription) {
      return NextResponse.json(
        { error: "Missing push subscription." },
        { status: 400 },
      );
    }

    await savePushSubscription(
      body.subscription,
      request.headers.get("user-agent"),
    );

    return NextResponse.json({
      ok: true,
      deviceCount: await countPushSubscriptions(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update push subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

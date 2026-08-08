import { NextResponse } from "next/server";
import { isAlexAuthenticated } from "@/lib/alex-auth";
import {
  listAlexNotifications,
  markAlexNotificationsRead,
  syncNotificationsFromState,
} from "@/lib/alex-notifications";
import { loadCouponBookFromDb } from "@/lib/coupon-repository";
import { isEmailConfigured } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!(await isAlexAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        configured: false,
        emailConfigured: isEmailConfigured(),
        notifications: [],
        unreadCount: 0,
      });
    }

    const state = await loadCouponBookFromDb();
    await syncNotificationsFromState(state);

    const notifications = await listAlexNotifications();
    const unreadCount = notifications.filter((n) => !n.readAt).length;

    return NextResponse.json({
      configured: true,
      emailConfigured: isEmailConfigured(),
      notifications,
      unreadCount,
      polledAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAlexAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      ids?: string[];
      markAllRead?: boolean;
    };

    const notifications = body.markAllRead
      ? await markAlexNotificationsRead()
      : await markAlexNotificationsRead(body.ids);

    const unreadCount = notifications.filter((n) => !n.readAt).length;

    return NextResponse.json({
      configured: true,
      emailConfigured: isEmailConfigured(),
      notifications,
      unreadCount,
      polledAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

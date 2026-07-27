import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import {
  hasAnyRedemptions,
  loadCouponBookFromDb,
  resetCouponBookInDb,
  saveCouponBookToDb,
} from "@/lib/coupon-repository";
import { defaultCouponBookState, sanitizeState } from "@/lib/coupon-storage";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { CouponBookState } from "@/types/coupon";

export const runtime = "nodejs";

function getResetPassword() {
  return process.env.RESET_PASSWORD?.trim() || siteConfig.resetPassword;
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        configured: false,
        state: defaultCouponBookState(),
      });
    }

    const state = await loadCouponBookFromDb();
    return NextResponse.json({
      configured: true,
      state,
      empty: !hasAnyRedemptions(state),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load coupon book";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      state?: unknown;
      reset?: boolean;
      password?: string;
    };

    if (body.reset) {
      if (body.password !== getResetPassword()) {
        return NextResponse.json(
          { error: "Incorrect password." },
          { status: 401 },
        );
      }
      const state = await resetCouponBookInDb();
      return NextResponse.json({ configured: true, state });
    }

    const state = sanitizeState(body.state) as CouponBookState;
    const saved = await saveCouponBookToDb(state);
    return NextResponse.json({ configured: true, state: saved });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save coupon book";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

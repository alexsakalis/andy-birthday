import { NextResponse } from "next/server";
import {
  ALEX_SESSION_COOKIE,
  alexSessionCookieOptions,
} from "@/lib/alex-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ALEX_SESSION_COOKIE, "", {
    ...alexSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

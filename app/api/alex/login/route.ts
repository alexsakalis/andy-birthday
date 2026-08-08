import { NextResponse } from "next/server";
import {
  ALEX_SESSION_COOKIE,
  alexSessionCookieOptions,
  createAlexSessionToken,
  passwordMatches,
} from "@/lib/alex-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    if (!passwordMatches(password)) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      ALEX_SESSION_COOKIE,
      createAlexSessionToken(),
      alexSessionCookieOptions(),
    );
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign in";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

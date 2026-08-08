import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ALEX_SESSION_COOKIE,
  verifyAlexSessionToken,
} from "@/lib/alex-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/alex/login") {
    if (verifyAlexSessionToken(request.cookies.get(ALEX_SESSION_COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/alex", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/alex" || pathname.startsWith("/alex/")) {
    if (!verifyAlexSessionToken(request.cookies.get(ALEX_SESSION_COOKIE)?.value)) {
      const loginUrl = new URL("/alex/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/alex", "/alex/:path*"],
};

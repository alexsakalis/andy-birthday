import { createHmac, timingSafeEqual } from "crypto";
import { siteConfig } from "@/config/site";

export const ALEX_SESSION_COOKIE = "alex_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getAlexPassword() {
  return (
    process.env.ALEX_PASSWORD?.trim() ||
    process.env.RESET_PASSWORD?.trim() ||
    siteConfig.resetPassword
  );
}

function getSessionSecret() {
  return (
    process.env.ALEX_SESSION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    getAlexPassword()
  );
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createAlexSessionToken(now = Date.now()) {
  const expiresAt = String(now + SESSION_TTL_SECONDS * 1000);
  const payload = `alex:${expiresAt}`;
  return `${expiresAt}.${sign(payload)}`;
}

export function verifyAlexSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expiresMs = Number(expiresAt);
  if (!Number.isFinite(expiresMs) || expiresMs < Date.now()) return false;

  const expected = sign(`alex:${expiresAt}`);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function alexSessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function passwordMatches(input: string) {
  const expected = getAlexPassword();
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

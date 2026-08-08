import { cookies } from "next/headers";
import {
  ALEX_SESSION_COOKIE,
  verifyAlexSessionToken,
} from "@/lib/alex-session";

export {
  ALEX_SESSION_COOKIE,
  alexSessionCookieOptions,
  createAlexSessionToken,
  getAlexPassword,
  passwordMatches,
  verifyAlexSessionToken,
} from "@/lib/alex-session";

export async function isAlexAuthenticated() {
  const jar = await cookies();
  return verifyAlexSessionToken(jar.get(ALEX_SESSION_COOKIE)?.value);
}

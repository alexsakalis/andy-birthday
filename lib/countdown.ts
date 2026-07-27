import { siteConfig } from "@/config/site";

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
};

/** Midnight at the start of birthdayDate in the configured IANA timezone. */
export function getBirthdayTargetMs(
  birthdayDate = siteConfig.birthdayDate,
  timeZone = siteConfig.birthdayTimezone,
): number {
  // Interpret YYYY-MM-DD as local calendar date in the gift timezone.
  const probe = new Date(`${birthdayDate}T12:00:00Z`);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Find UTC instant where tz local time is birthdayDate 00:00:00
  // by binary-searching around the date.
  const [y, m, d] = birthdayDate.split("-").map(Number);
  let guess = Date.UTC(y, m - 1, d, 4, 0, 0); // rough start near EDT/EST

  for (let i = 0; i < 48; i += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(guess)).map((p) => [p.type, p.value]),
    ) as Record<string, string>;

    const localAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    const desiredLocalAsUtc = Date.UTC(y, m - 1, d, 0, 0, 0);
    const delta = desiredLocalAsUtc - localAsUtc;
    guess += delta;
    if (Math.abs(delta) < 500) break;
  }

  // Validate we landed on the right calendar day at ~00:00
  void probe;
  return guess;
}

export function getCountdownParts(nowMs = Date.now()): CountdownParts {
  const target = getBirthdayTargetMs();
  const totalMs = Math.max(0, target - nowMs);
  const isBirthday = totalMs <= 0;

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalMs, days, hours, minutes, seconds, isBirthday };
}

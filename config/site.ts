/**
 * ============================================================
 * EDIT HERE — Site configuration for Anndrea's birthday gift
 * ============================================================
 * Change names, messages, dates, and secret copy in this file.
 * Coupon wording lives in data/coupons.ts
 * Photo captions live in data/photos.ts
 */

export const siteConfig = {
  // EDIT HERE — Names
  recipientName: "Anndrea",
  senderName: "Alex",
  birthdayAge: 25,

  // EDIT HERE — Birthday countdown (midnight at the start of this date)
  birthdayDate: "2026-07-31",
  birthdayTimezone: "America/Toronto",
  countdownEnabled: true,

  // EDIT HERE — Welcome screen
  welcomeTitle: "Happy 25th Birthday, Anndrea!",
  welcomeSubtitle:
    "A little book of love, surprises, and adventures from Alex.",

  // EDIT HERE — Theme tagline (Monchhichi-inspired cozy vibe)
  themeTagline: "Cozy • Soft • Full of love",
  themeName: "Monchhichi Birthday Club",

  // EDIT HERE — Relationship start date (YYYY-MM-DD). Leave empty to hide days-together counter.
  relationshipDate: "2018-06-13",

  // EDIT HERE — Personal birthday letter (shown after opening the gift)
  birthdayMessage: `Happy 25th birthday, Anndrea!

I wanted to give you something that we could continue enjoying long after your birthday is over. I made this little coupon book for you so we can create more memories, enjoy more dates, and spend more time together.

Every coupon can be used three times, whenever you want. There are no expiry dates, no complicated rules, and plenty of love included.

Love,
Alex`,

  // EDIT HERE — Final message at the end of the site
  finalHeading: "Happy 25th Birthday, My Love",
  finalMessage:
    "This coupon book may have an ending, but our adventures do not. I hope your 25th year is filled with happiness, love, laughter, and even more memories together.",

  // EDIT HERE — Secret message revealed after tapping the heart 5 times
  secretMessage: "One more secret coupon is waiting for you.",
  secretCouponHint:
    "Hint: scroll back up to the coupon book — a Wildcard called “Your Wish” is waiting for you.",

  // Optional music file path (place the file at public/music/birthday.mp3). Never autoplays.
  musicSrc: "/music/birthday.mp3",

  // Local storage key — bump version if you need a clean slate for all visitors
  storageKey: "anndrea-birthday-coupon-book-v1",
  storageVersion: 1,

  // EDIT HERE — Password required to reset all coupon progress (Alex only)
  // Can also be overridden on the server with env RESET_PASSWORD
  resetPassword: "Alexisthebest123",
} as const;

export type SiteConfig = typeof siteConfig;

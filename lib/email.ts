import { siteConfig } from "@/config/site";
import type { RedemptionEvent } from "@/lib/redemption-events";

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.ALEX_NOTIFY_EMAIL?.trim() &&
      process.env.RESEND_FROM_EMAIL?.trim(),
  );
}

export async function sendRedemptionEmail(
  event: RedemptionEvent,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ALEX_NOTIFY_EMAIL?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    return {
      sent: false,
      error: "Email is not configured (RESEND_API_KEY / ALEX_NOTIFY_EMAIL / RESEND_FROM_EMAIL).",
    };
  }

  const wishBlock = event.note
    ? `\n\nWish:\n"${event.note}"`
    : "\n\n(No wish note on this coupon.)";

  const when = new Date(event.redeemedAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: siteConfig.birthdayTimezone,
  });

  const subject = event.note
    ? `${siteConfig.recipientName} made a wish: ${event.couponTitle}`
    : `${siteConfig.recipientName} redeemed: ${event.couponTitle}`;

  const dashboardUrl = getDashboardUrl();

  const text = `${siteConfig.recipientName} just used a coupon.

Coupon: ${event.couponTitle}
When: ${when}${wishBlock}

Open your dashboard: ${dashboardUrl}
`;

  const html = `
    <div style="font-family: Georgia, serif; color: #6b4226; line-height: 1.5;">
      <p><strong>${escapeHtml(siteConfig.recipientName)}</strong> just used a coupon.</p>
      <p>
        <strong>Coupon:</strong> ${escapeHtml(event.couponTitle)}<br/>
        <strong>When:</strong> ${escapeHtml(when)}
      </p>
      ${
        event.note
          ? `<p><strong>Wish:</strong><br/><em>“${escapeHtml(event.note)}”</em></p>`
          : `<p style="color:#8a6a52;">(No wish note on this coupon.)</p>`
      }
      <p><a href="${escapeHtml(dashboardUrl)}">Open your Alex dashboard</a></p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        sent: false,
        error: `Resend error ${response.status}: ${body.slice(0, 300)}`,
      };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

function getDashboardUrl() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (!base) return "/alex";
  const withProtocol = base.startsWith("http") ? base : `https://${base}`;
  return `${withProtocol.replace(/\/$/, "")}/alex`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Mail, RefreshCw, Sparkles } from "lucide-react";
import { AlexPushManager } from "@/components/alex/AlexPushManager";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { AlexNotification } from "@/types/notification";
import { cn } from "@/lib/utils";

type FeedResponse = {
  configured?: boolean;
  emailConfigured?: boolean;
  notifications?: AlexNotification[];
  unreadCount?: number;
  polledAt?: string;
  error?: string;
};

const POLL_MS = 4000;

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: siteConfig.birthdayTimezone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AlexDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AlexNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [lastPolled, setLastPolled] = useState<string | null>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const applyFeed = useCallback((data: FeedResponse) => {
    const next = data.notifications ?? [];
    const prevIds = knownIds.current;
    const incomingFresh = new Set<string>();

    if (prevIds.size > 0) {
      for (const item of next) {
        if (!prevIds.has(item.id)) incomingFresh.add(item.id);
      }
    }

    knownIds.current = new Set(next.map((item) => item.id));
    if (incomingFresh.size > 0) {
      setFreshIds((current) => new Set([...current, ...incomingFresh]));
    }

    setNotifications(next);
    setUnreadCount(data.unreadCount ?? 0);
    setEmailConfigured(Boolean(data.emailConfigured));
    setConfigured(data.configured !== false);
    setLastPolled(data.polledAt ?? new Date().toISOString());
    setError(null);
  }, []);

  const loadFeed = useCallback(async () => {
    try {
      const response = await fetch("/api/alex/notifications", {
        cache: "no-store",
      });
      const data = (await response.json()) as FeedResponse;

      if (response.status === 401) {
        router.replace("/alex/login");
        return;
      }

      if (!response.ok) {
        startTransition(() => {
          setError(data.error ?? "Failed to load notifications.");
          setLoading(false);
        });
        return;
      }

      startTransition(() => {
        applyFeed(data);
        setLoading(false);
      });
    } catch {
      startTransition(() => {
        setError("Could not reach the notification feed.");
        setLoading(false);
      });
    }
  }, [applyFeed, router]);

  const onPoll = useEffectEvent(() => {
    void loadFeed();
  });

  useEffect(() => {
    const boot = window.setTimeout(() => {
      onPoll();
    }, 0);
    return () => window.clearTimeout(boot);
  }, []);

  useEffect(() => {
    function onVisibility() {
      const visible = !document.hidden;
      startTransition(() => setLive(visible));
      if (visible) onPoll();
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!live) return;

    const id = window.setInterval(() => {
      onPoll();
    }, POLL_MS);

    return () => window.clearInterval(id);
  }, [live]);

  async function markAllRead() {
    const response = await fetch("/api/alex/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    const data = (await response.json()) as FeedResponse;
    if (response.ok) {
      applyFeed(data);
      setFreshIds(new Set());
    }
  }

  async function markOneRead(id: string) {
    const response = await fetch("/api/alex/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    const data = (await response.json()) as FeedResponse;
    if (response.ok) {
      applyFeed(data);
      setFreshIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function logout() {
    await fetch("/api/alex/logout", { method: "POST" });
    router.replace("/alex/login");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm tracking-[0.2em] text-caramel uppercase">
            Live inbox
          </p>
          <h1 className="mt-2 font-display text-4xl text-warm-brown sm:text-5xl">
            Alex dashboard
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Watch {siteConfig.recipientName}&apos;s coupon uses in near real
            time — including every wish she types.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              live
                ? "bg-soft-pink/70 text-muted-red"
                : "bg-beige text-caramel",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                live ? "animate-pulse bg-muted-red" : "bg-caramel",
              )}
            />
            {live ? "Live" : "Paused"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-caramel"
            onClick={() => void loadFeed()}
            aria-label="Refresh now"
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-caramel"
            onClick={() => void logout()}
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <AlexPushManager />

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat
          icon={<Bell className="size-4" />}
          label="Unread"
          value={String(unreadCount)}
        />
        <Stat
          icon={<Sparkles className="size-4" />}
          label="Total alerts"
          value={String(notifications.length)}
        />
        <Stat
          icon={<Mail className="size-4" />}
          label="Email"
          value={emailConfigured ? "On" : "Off"}
        />
      </section>

      {!emailConfigured && (
        <p className="mt-4 rounded-2xl bg-beige/70 px-4 py-3 text-sm text-warm-brown">
          Optional email alerts are off until you set Resend env vars. Phone
          push does not need email — enable it in the section above.
        </p>
      )}

      {!configured && (
        <p className="mt-4 rounded-2xl bg-beige/70 px-4 py-3 text-sm text-warm-brown">
          Supabase is not configured, so redemptions stay on this device only.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-caramel">
          {lastPolled
            ? `Last checked ${formatWhen(lastPolled)}`
            : "Waiting for first check…"}
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full border-caramel/40"
          disabled={unreadCount === 0}
          onClick={() => void markAllRead()}
        >
          Mark all read
        </Button>
      </div>

      {error && (
        <p className="mt-4 text-sm font-semibold text-muted-red" role="alert">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {loading && (
          <li className="rounded-3xl bg-paper/80 px-5 py-6 text-muted-foreground">
            Loading redemptions…
          </li>
        )}

        {!loading && notifications.length === 0 && (
          <li className="rounded-3xl bg-paper/80 px-5 py-8 text-center text-muted-foreground">
            No redemptions yet. When she uses a coupon, it will show up here
            within a few seconds.
          </li>
        )}

        {notifications.map((item) => {
          const unread = !item.readAt;
          const isFresh = freshIds.has(item.id);

          return (
            <li
              key={item.id}
              className={cn(
                "rounded-3xl border px-5 py-4 transition",
                unread
                  ? "border-muted-red/30 bg-paper shadow-[0_8px_30px_rgba(107,66,38,0.06)]"
                  : "border-caramel/15 bg-paper/70",
                isFresh && "animate-in fade-in slide-in-from-top-2 duration-500",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {unread && (
                      <span className="rounded-full bg-muted-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-paper uppercase">
                        New
                      </span>
                    )}
                    {item.note && (
                      <span className="rounded-full bg-soft-pink/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted-red uppercase">
                        Wish
                      </span>
                    )}
                    <p className="font-display text-xl text-warm-brown">
                      {item.couponTitle}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-caramel">
                    {formatWhen(item.redeemedAt)}
                  </p>
                </div>
                {unread && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-caramel"
                    onClick={() => void markOneRead(item.id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>

              {item.note ? (
                <p className="mt-3 rounded-2xl bg-cream/90 px-4 py-3 text-base italic text-warm-brown">
                  “{item.note}”
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No wish text — standard coupon redemption.
                </p>
              )}

              {item.emailSentAt && (
                <p className="mt-2 text-xs text-caramel">
                  Email sent {formatWhen(item.emailSentAt)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-caramel/20 bg-paper/80 px-4 py-3">
      <div className="flex items-center gap-2 text-caramel">
        {icon}
        <span className="text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 font-display text-3xl text-warm-brown">{value}</p>
    </div>
  );
}

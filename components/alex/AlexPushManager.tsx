"use client";

import { startTransition, useEffect, useState } from "react";
import { BellOff, BellRing, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isPushSupported,
  registerAlexServiceWorker,
  urlBase64ToUint8Array,
} from "@/lib/push-client";

type PushStatus = {
  configured?: boolean;
  publicKey?: string | null;
  deviceCount?: number;
  error?: string;
};

export function AlexPushManager() {
  const [supported, setSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [configured, setConfigured] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    startTransition(() => {
      setIsIOS(ios);
      setIsStandalone(standalone);
      setSupported(isPushSupported());
    });

    if (!isPushSupported()) return;

    let cancelled = false;

    async function boot() {
      try {
        const statusResponse = await fetch("/api/alex/push", {
          cache: "no-store",
        });
        const status = (await statusResponse.json()) as PushStatus;
        if (cancelled) return;

        startTransition(() => {
          setConfigured(Boolean(status.configured && status.publicKey));
          setPublicKey(status.publicKey ?? null);
          setDeviceCount(status.deviceCount ?? 0);
        });

        await registerAlexServiceWorker();
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (cancelled) return;
        startTransition(() => setSubscription(existing));
      } catch {
        if (!cancelled) {
          startTransition(() =>
            setError("Could not check push notification status."),
          );
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  async function enablePush() {
    if (!publicKey) {
      setError("Push is not configured on the server yet.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notification permission was denied.");
        setBusy(false);
        return;
      }

      await registerAlexServiceWorker();
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/alex/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          subscription: sub.toJSON(),
        }),
      });
      const data = (await response.json()) as PushStatus & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not save this device.");
        setBusy(false);
        return;
      }

      setSubscription(sub);
      setDeviceCount(data.deviceCount ?? 1);
      setMessage("Push enabled on this device. Try a test ping below.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not enable push notifications.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disablePush() {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const endpoint = subscription?.endpoint;
      await subscription?.unsubscribe();
      setSubscription(null);

      if (endpoint) {
        const response = await fetch("/api/alex/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "unsubscribe",
            subscription: { endpoint },
          }),
        });
        const data = (await response.json()) as PushStatus;
        setDeviceCount(data.deviceCount ?? 0);
      }

      setMessage("Push disabled on this device.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not disable push notifications.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/alex/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = (await response.json()) as { error?: string; sent?: number };

      if (!response.ok) {
        setError(data.error ?? "Test push failed.");
        return;
      }

      setMessage(`Test sent to ${data.sent ?? 0} device(s).`);
    } catch {
      setError("Test push failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-caramel/25 bg-paper/90 px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-soft-pink/70 text-muted-red">
          <Smartphone className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl text-warm-brown">
            Phone push alerts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get a real lock-screen notification when she redeems a coupon —
            wish text included.
          </p>
        </div>
      </div>

      {!configured && (
        <p className="mt-4 rounded-2xl bg-beige/70 px-4 py-3 text-sm text-warm-brown">
          Push is waiting on VAPID keys. Add{" "}
          <code className="text-xs">NEXT_PUBLIC_VAPID_PUBLIC_KEY</code> and{" "}
          <code className="text-xs">VAPID_PRIVATE_KEY</code> in Vercel, then
          redeploy.
        </p>
      )}

      {isIOS && !isStandalone && (
        <p className="mt-4 rounded-2xl bg-beige/70 px-4 py-3 text-sm text-warm-brown">
          On iPhone: tap Share → <strong>Add to Home Screen</strong>, open the
          app from your home screen, then enable push here. Safari in a normal
          tab cannot receive Web Push.
        </p>
      )}

      {!supported && (
        <p className="mt-4 text-sm text-muted-red">
          This browser does not support Web Push. Use Chrome/Android, or an
          installed iOS home-screen app (iOS 16.4+).
        </p>
      )}

      {supported && configured && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {subscription ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-full border-caramel/40"
                disabled={busy}
                onClick={() => void disablePush()}
              >
                <BellOff className="size-4" />
                Disable on this phone
              </Button>
              <Button
                type="button"
                className="h-11 flex-1 rounded-full bg-muted-red text-paper hover:bg-muted-red/90"
                disabled={busy}
                onClick={() => void sendTest()}
              >
                <BellRing className="size-4" />
                Send test push
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="h-11 w-full rounded-full bg-muted-red text-paper hover:bg-muted-red/90 sm:w-auto"
              disabled={busy}
              onClick={() => void enablePush()}
            >
              <BellRing className="size-4" />
              Enable push on this phone
            </Button>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-caramel">
        {subscription
          ? `This device is subscribed · ${deviceCount} device(s) total`
          : `${deviceCount} device(s) subscribed`}
      </p>

      {message && (
        <p className="mt-2 text-sm font-semibold text-warm-brown">{message}</p>
      )}
      {error && (
        <p className="mt-2 text-sm font-semibold text-muted-red" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

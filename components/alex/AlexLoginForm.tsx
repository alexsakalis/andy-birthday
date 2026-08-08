"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

type AlexLoginFormProps = {
  nextPath?: string;
};

export function AlexLoginForm({ nextPath = "/alex" }: AlexLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/alex/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not sign in.");
        setBusy(false);
        return;
      }

      router.replace(nextPath.startsWith("/alex") ? nextPath : "/alex");
      router.refresh();
    } catch {
      setError("Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <p className="font-display text-sm tracking-[0.2em] text-caramel uppercase">
          Private
        </p>
        <h1 className="mt-2 font-display text-4xl text-warm-brown">
          Alex login
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track {siteConfig.recipientName}&apos;s coupon redemptions and wishes.
          Same password as the coupon-book reset.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-warm-brown">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="Your password"
          className="touch-target h-12 w-full rounded-full border border-caramel/40 bg-paper px-5 text-base text-warm-brown outline-none ring-caramel/40 focus:ring-2"
        />
      </label>

      {error && (
        <p className="text-sm font-semibold text-muted-red" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={busy || !password}
        className="touch-target h-12 w-full rounded-full bg-muted-red text-paper hover:bg-muted-red/90"
      >
        {busy ? "Opening…" : "Open dashboard"}
      </Button>
    </form>
  );
}

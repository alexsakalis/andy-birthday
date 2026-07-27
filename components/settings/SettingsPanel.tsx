"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { MusicControls } from "@/components/birthday/MusicControls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";

type SettingsPanelProps = {
  musicEnabled: boolean;
  onMusicToggle: (enabled: boolean) => void;
  onReset: (password: string) => void | Promise<void>;
};

export function SettingsPanel({
  musicEnabled,
  onMusicToggle,
  onReset,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function closeAll(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setConfirmReset(false);
      setPassword("");
      setError(null);
      setBusy(false);
    }
  }

  async function handleReset() {
    if (password !== siteConfig.resetPassword) {
      setError("Incorrect password.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await onReset(password);
      closeAll(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <MusicControls enabled={musicEnabled} onToggle={onMusicToggle} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="touch-target rounded-full text-caramel"
          onClick={() => setOpen(true)}
          aria-label="Open settings"
        >
          <Settings2 className="size-5" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={closeAll}>
        <DialogContent className="max-w-md rounded-3xl border-caramel/30 bg-paper sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-warm-brown">
              Little settings
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Music never autoplays. Resetting requires Alex&apos;s password and
              erases all coupon history everywhere.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <MusicControls enabled={musicEnabled} onToggle={onMusicToggle} />

            {!confirmReset ? (
              <Button
                type="button"
                variant="outline"
                className="touch-target h-11 w-full rounded-full border-muted-red/40 text-muted-red"
                onClick={() => setConfirmReset(true)}
              >
                Reset coupon book…
              </Button>
            ) : (
              <div className="rounded-2xl border border-muted-red/30 bg-soft-pink/30 p-4">
                <p className="text-sm font-semibold text-warm-brown">
                  Password required
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This will erase every redemption, wish, and progress. Enter
                  the reset password to continue.
                </p>

                <label className="mt-3 block">
                  <span className="sr-only">Reset password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Reset password"
                    className="touch-target h-11 w-full rounded-full border border-caramel/40 bg-paper px-4 text-sm text-warm-brown outline-none ring-caramel/40 focus:ring-2"
                  />
                </label>

                {error && (
                  <p className="mt-2 text-sm font-semibold text-muted-red">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="touch-target h-11 flex-1 rounded-full"
                    disabled={busy}
                    onClick={() => {
                      setConfirmReset(false);
                      setPassword("");
                      setError(null);
                    }}
                  >
                    Never mind
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="touch-target h-11 flex-1 rounded-full"
                    disabled={busy || !password}
                    onClick={() => void handleReset()}
                  >
                    {busy ? "Erasing…" : "Yes, erase everything"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  );
}

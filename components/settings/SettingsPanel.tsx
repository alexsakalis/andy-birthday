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

type SettingsPanelProps = {
  musicEnabled: boolean;
  onMusicToggle: (enabled: boolean) => void;
  onReset: () => void;
};

export function SettingsPanel({
  musicEnabled,
  onMusicToggle,
  onReset,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    onReset();
    setConfirmReset(false);
    setOpen(false);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl border-caramel/30 bg-paper sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-warm-brown">
              Little settings
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Music never autoplays. Resetting erases all coupon history on this
              device.
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
                  Are you sure?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This will erase every redemption, wish, and progress saved on
                  this device. This cannot be undone.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="touch-target h-11 flex-1 rounded-full"
                    onClick={() => setConfirmReset(false)}
                  >
                    Never mind
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="touch-target h-11 flex-1 rounded-full"
                    onClick={handleReset}
                  >
                    Yes, erase everything
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

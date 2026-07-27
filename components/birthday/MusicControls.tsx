"use client";

import { useEffect, useRef } from "react";
import { Music, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useHasMusicFile } from "@/lib/hooks/use-local-preference";

type MusicControlsProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

/**
 * Music never autoplays. Only plays after Anndrea taps enable,
 * and only if public/music/birthday.mp3 exists.
 */
export function MusicControls({ enabled, onToggle }: MusicControlsProps) {
  const hasFile = useHasMusicFile(siteConfig.musicSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!hasFile) return;

    const audio = new Audio(siteConfig.musicSrc);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [hasFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      void audio.play().catch(() => {
        onToggle(false);
      });
    } else {
      audio.pause();
    }
  }, [enabled, onToggle]);

  if (!hasFile) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="touch-target rounded-full border-caramel/40 bg-paper/80"
      onClick={() => onToggle(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn music off" : "Turn music on"}
    >
      {enabled ? (
        <Music2 className="size-4 text-muted-red" />
      ) : (
        <Music className="size-4 text-caramel" />
      )}
      <span className="ml-1.5">{enabled ? "Music on" : "Music"}</span>
    </Button>
  );
}

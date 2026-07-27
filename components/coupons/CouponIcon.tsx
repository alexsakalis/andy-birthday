"use client";

import {
  Cake,
  CalendarHeart,
  Clapperboard,
  Coffee,
  Compass,
  Gift,
  Handshake,
  Heart,
  Moon,
  ShoppingBag,
  Sparkle,
  Sparkles,
  Utensils,
  WandSparkles,
  Wine,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  coffee: Coffee,
  utensils: Utensils,
  clapperboard: Clapperboard,
  sparkles: Sparkles,
  gift: Gift,
  cake: Cake,
  handshake: Handshake,
  moon: Moon,
  compass: Compass,
  sparkle: Sparkle,
  "shopping-bag": ShoppingBag,
  wine: Wine,
  "calendar-heart": CalendarHeart,
  heart: Heart,
  wand: WandSparkles,
};

export function CouponIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Heart;
  return <Icon className={className} aria-hidden />;
}

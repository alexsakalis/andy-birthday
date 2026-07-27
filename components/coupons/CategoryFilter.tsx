"use client";

import { couponCategories } from "@/data/coupons";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="Filter coupons by category"
    >
      {couponCategories.map((category) => {
        const selected = value === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category)}
            className={cn(
              "touch-target shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected
                ? "border-muted-red bg-muted-red text-paper"
                : "border-caramel/35 bg-paper text-warm-brown hover:bg-beige",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import type { CouponBookState } from "@/types/coupon";
import { defaultCouponBookState, sanitizeState } from "@/lib/coupon-storage";

type ApiResponse = {
  configured?: boolean;
  state?: CouponBookState;
  empty?: boolean;
  error?: string;
};

export async function fetchCouponBookState(): Promise<{
  configured: boolean;
  state: CouponBookState;
  empty: boolean;
}> {
  const response = await fetch("/api/coupon-book", {
    method: "GET",
    cache: "no-store",
  });

  const data = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load coupon book");
  }

  return {
    configured: Boolean(data.configured),
    state: sanitizeState(data.state ?? defaultCouponBookState()),
    empty: Boolean(data.empty),
  };
}

export async function persistCouponBookState(
  state: CouponBookState,
): Promise<CouponBookState> {
  const response = await fetch("/api/coupon-book", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });

  const data = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to save coupon book");
  }

  return sanitizeState(data.state ?? state);
}

export async function resetCouponBookRemote(): Promise<CouponBookState> {
  const response = await fetch("/api/coupon-book", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset: true }),
  });

  const data = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to reset coupon book");
  }

  return sanitizeState(data.state ?? defaultCouponBookState());
}

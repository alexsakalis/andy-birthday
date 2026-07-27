import {
  defaultCouponBookState,
  hasAnyRedemptions,
  rowToState,
  sanitizeState,
  stateToRow,
  type CouponBookRow,
} from "@/lib/coupon-storage";
import {
  getCouponBookId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { CouponBookState } from "@/types/coupon";

export async function loadCouponBookFromDb(): Promise<CouponBookState> {
  if (!isSupabaseConfigured()) {
    return defaultCouponBookState();
  }

  const supabase = getSupabaseAdmin();
  const id = getCouponBookId();

  const { data, error } = await supabase
    .from("coupon_book_state")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    const seed = stateToRow(defaultCouponBookState());
    const { data: inserted, error: insertError } = await supabase
      .from("coupon_book_state")
      .insert({ id, ...seed })
      .select("*")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return rowToState(inserted as CouponBookRow);
  }

  return rowToState(data as CouponBookRow);
}

export async function saveCouponBookToDb(
  state: CouponBookState,
): Promise<CouponBookState> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = getSupabaseAdmin();
  const id = getCouponBookId();
  const payload = stateToRow(sanitizeState(state));

  const { data, error } = await supabase
    .from("coupon_book_state")
    .upsert({ id, ...payload }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToState(data as CouponBookRow);
}

export async function resetCouponBookInDb(): Promise<CouponBookState> {
  return saveCouponBookToDb(defaultCouponBookState());
}

export { hasAnyRedemptions };

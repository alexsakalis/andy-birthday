-- Alex inbox: one row per coupon redemption (keyed by redemption id for idempotency).
create table public.alex_notifications (
  id text primary key,
  book_id text not null default 'anndrea-birthday',
  coupon_id text not null,
  coupon_title text not null,
  note text,
  redeemed_at timestamptz not null,
  email_sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index alex_notifications_book_redeemed_idx
  on public.alex_notifications (book_id, redeemed_at desc);

create index alex_notifications_book_unread_idx
  on public.alex_notifications (book_id)
  where read_at is null;

alter table public.alex_notifications enable row level security;

revoke all on table public.alex_notifications from anon, authenticated;
grant all on table public.alex_notifications to service_role;

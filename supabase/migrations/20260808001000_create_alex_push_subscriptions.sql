-- Web Push subscriptions for Alex phone notifications.
create table public.alex_push_subscriptions (
  endpoint text primary key,
  book_id text not null default 'anndrea-birthday',
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index alex_push_subscriptions_book_idx
  on public.alex_push_subscriptions (book_id);

alter table public.alex_push_subscriptions enable row level security;

revoke all on table public.alex_push_subscriptions from anon, authenticated;
grant all on table public.alex_push_subscriptions to service_role;

create table public.coupon_book_state (
  id text primary key default 'anndrea-birthday',
  version int not null default 1,
  welcome_opened boolean not null default false,
  secret_discovered boolean not null default false,
  music_enabled boolean not null default false,
  redemptions jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.coupon_book_state (id) values ('anndrea-birthday');

alter table public.coupon_book_state enable row level security;

revoke all on table public.coupon_book_state from anon, authenticated;
grant all on table public.coupon_book_state to service_role;

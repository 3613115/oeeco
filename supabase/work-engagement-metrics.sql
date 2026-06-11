alter table public.works
  add column if not exists try_clicks_count integer not null default 0,
  add column if not exists demo_opens_count integer not null default 0,
  add column if not exists share_clicks_count integer not null default 0;

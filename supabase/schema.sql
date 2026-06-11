create extension if not exists "pgcrypto";

create type public.work_status as enum ('draft', 'pending', 'published', 'hidden', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-zA-Z0-9_]{3,24}$'),
  display_name text not null,
  avatar_url text,
  bio text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  summary text not null check (char_length(summary) between 2 and 160),
  description text default '',
  category text not null check (category in ('game', 'tool', 'story', 'visual', 'ai')),
  cover_url text,
  demo_url text,
  tool_stack text default '',
  status public.work_status not null default 'pending',
  review_note text not null default '',
  views_count integer not null default 0,
  likes_count integer not null default 0,
  collections_count integer not null default 0,
  try_clicks_count integer not null default 0,
  demo_opens_count integer not null default 0,
  share_clicks_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_tags (
  id bigint generated always as identity primary key,
  work_id uuid not null references public.works(id) on delete cascade,
  tag text not null check (char_length(tag) between 1 and 32),
  unique (work_id, tag)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);

create table public.likes (
  id bigint generated always as identity primary key,
  work_id uuid not null references public.works(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (work_id, user_id)
);

create table public.collections (
  id bigint generated always as identity primary key,
  work_id uuid not null references public.works(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (work_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.works enable row level security;
alter table public.work_tags enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.collections enable row level security;

create policy "profiles are public" on public.profiles
  for select using (true);

create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "published works are public" on public.works
  for select using (status = 'published' or auth.uid() = creator_id);

create policy "users create own works" on public.works
  for insert with check (auth.uid() = creator_id);

revoke update on public.works from anon, authenticated;
grant update (title, summary, description, category, cover_url, demo_url, tool_stack, status, review_note)
  on public.works to authenticated;

create policy "creators resubmit own editable works" on public.works
  for update
  using (auth.uid() = creator_id and status in ('draft', 'pending', 'rejected'))
  with check (auth.uid() = creator_id and status = 'pending');

create policy "tags are public" on public.work_tags
  for select using (true);

revoke update on public.work_tags from anon, authenticated;

create policy "creators add own display work tags" on public.work_tags
  for insert
  with check (
    tag not like 'oeeco:%'
    and exists (
      select 1 from public.works
      where works.id = work_tags.work_id
        and works.creator_id = auth.uid()
        and works.status in ('draft', 'pending', 'rejected')
    )
  );

create policy "creators delete own display work tags" on public.work_tags
  for delete
  using (
    tag not like 'oeeco:%'
    and exists (
      select 1 from public.works
      where works.id = work_tags.work_id
        and works.creator_id = auth.uid()
        and works.status in ('draft', 'pending', 'rejected')
    )
  );

create policy "comments are public" on public.comments
  for select using (true);

create policy "signed in users comment" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "users delete own comments" on public.comments
  for delete using (auth.uid() = user_id);

create policy "likes are visible" on public.likes
  for select using (true);

create policy "users manage own likes" on public.likes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "collections are private" on public.collections
  for select using (auth.uid() = user_id);

create policy "users manage own collections" on public.collections
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    'user_' || substring(replace(new.id::text, '-', '') from 1 for 18),
    coalesce(new.raw_user_meta_data->>'display_name', 'oeeco creator'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger works_updated_at
  before update on public.works
  for each row execute procedure public.update_updated_at();

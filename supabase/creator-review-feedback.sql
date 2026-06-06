-- Creator review feedback for oeeco.
-- Run this once in the Supabase SQL Editor for the production project.

alter table public.works
  add column if not exists review_note text not null default '';

drop policy if exists "users update own non-hidden works" on public.works;
drop policy if exists "creators resubmit own editable works" on public.works;

revoke update on public.works from anon, authenticated;
grant update (title, summary, description, category, cover_url, demo_url, tool_stack, status, review_note)
  on public.works to authenticated;

create policy "creators resubmit own editable works" on public.works
  for update
  using (auth.uid() = creator_id and status in ('draft', 'pending', 'rejected'))
  with check (auth.uid() = creator_id and status = 'pending');

drop policy if exists "creators manage own work tags" on public.work_tags;
drop policy if exists "creators add own display work tags" on public.work_tags;
drop policy if exists "creators delete own display work tags" on public.work_tags;

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

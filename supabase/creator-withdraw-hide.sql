-- Creator withdraw/hide controls for oeeco.
-- Run this once in the Supabase SQL Editor for the production project.

drop policy if exists "creators resubmit own editable works" on public.works;
drop policy if exists "creators withdraw own pending works" on public.works;
drop policy if exists "creators hide own published works" on public.works;

revoke update on public.works from anon, authenticated;
grant update (title, summary, description, category, cover_url, demo_url, tool_stack, status, review_note)
  on public.works to authenticated;

create policy "creators resubmit own editable works" on public.works
  for update
  using (auth.uid() = creator_id and status in ('draft', 'pending', 'rejected', 'hidden'))
  with check (auth.uid() = creator_id and status = 'pending');

create policy "creators withdraw own pending works" on public.works
  for update
  using (auth.uid() = creator_id and status = 'pending')
  with check (auth.uid() = creator_id and status = 'draft');

create policy "creators hide own published works" on public.works
  for update
  using (auth.uid() = creator_id and status = 'published')
  with check (auth.uid() = creator_id and status = 'hidden');

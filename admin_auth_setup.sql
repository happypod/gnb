create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admin users can read themselves" on public.admin_users;
create policy "Admin users can read themselves"
on public.admin_users
for select
to authenticated
using (auth.uid() = id);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

drop policy if exists "Admin history insert" on public.company_history_events;
create policy "Admin history insert"
on public.company_history_events
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin history update" on public.company_history_events;
create policy "Admin history update"
on public.company_history_events
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin history delete" on public.company_history_events;
create policy "Admin history delete"
on public.company_history_events
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin news insert" on public.company_news;
create policy "Admin news insert"
on public.company_news
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin news update" on public.company_news;
create policy "Admin news update"
on public.company_news
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin news delete" on public.company_news;
create policy "Admin news delete"
on public.company_news
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin projects insert" on public.performance_projects;
create policy "Admin projects insert"
on public.performance_projects
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin projects update" on public.performance_projects;
create policy "Admin projects update"
on public.performance_projects
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin projects delete" on public.performance_projects;
create policy "Admin projects delete"
on public.performance_projects
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin partners insert" on public.performance_partners;
create policy "Admin partners insert"
on public.performance_partners
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin partners update" on public.performance_partners;
create policy "Admin partners update"
on public.performance_partners
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin partners delete" on public.performance_partners;
create policy "Admin partners delete"
on public.performance_partners
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin gallery insert" on public.gallery_items;
create policy "Admin gallery insert"
on public.gallery_items
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin gallery update" on public.gallery_items;
create policy "Admin gallery update"
on public.gallery_items
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin gallery delete" on public.gallery_items;
create policy "Admin gallery delete"
on public.gallery_items
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin recruit insert" on public.recruit_notices;
create policy "Admin recruit insert"
on public.recruit_notices
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin recruit update" on public.recruit_notices;
create policy "Admin recruit update"
on public.recruit_notices
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin recruit delete" on public.recruit_notices;
create policy "Admin recruit delete"
on public.recruit_notices
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin inquiries select" on public.contact_inquiries;
create policy "Admin inquiries select"
on public.contact_inquiries
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin inquiries insert" on public.contact_inquiries;
create policy "Admin inquiries insert"
on public.contact_inquiries
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin inquiries update" on public.contact_inquiries;
create policy "Admin inquiries update"
on public.contact_inquiries
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin inquiries delete" on public.contact_inquiries;
create policy "Admin inquiries delete"
on public.contact_inquiries
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin gallery storage insert" on storage.objects;
create policy "Admin gallery storage insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

drop policy if exists "Admin gallery storage update" on storage.objects;
create policy "Admin gallery storage update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery'
  and public.is_admin_user()
)
with check (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

drop policy if exists "Admin gallery storage delete" on storage.objects;
create policy "Admin gallery storage delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

-- After creating an email/password user in Supabase Auth, run a query like this
-- with the real Auth user UUID and email:
--
-- insert into public.admin_users (id, email)
-- values ('YOUR_AUTH_USER_UUID', 'admin@example.com')
-- on conflict (id) do update
-- set email = excluded.email;

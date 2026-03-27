create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image_url text not null,
  storage_path text not null unique,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

create policy "Public gallery read"
on public.gallery_items
for select
to anon, authenticated
using (true);

create policy "Authenticated gallery insert"
on public.gallery_items
for insert
to authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public gallery image read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

create policy "Authenticated gallery image upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery');

-- Quick demo only. This allows browser uploads with the anon key and is not recommended for production.
-- If you want to use the current frontend upload button without a separate admin backend, uncomment both policies below
-- and set VITE_ENABLE_GALLERY_DIRECT_UPLOAD=true in .env.
--
-- create policy "Anon gallery insert"
-- on public.gallery_items
-- for insert
-- to anon
-- with check (true);
--
-- create policy "Anon gallery image upload"
-- on storage.objects
-- for insert
-- to anon
-- with check (bucket_id = 'gallery');

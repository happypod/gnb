create table if not exists public.company_history_events (
  id bigint generated always as identity primary key,
  year integer not null,
  event_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.company_news (
  id bigint generated always as identity primary key,
  category text not null default '소식',
  title text not null,
  published_at date not null default current_date,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.performance_projects (
  id bigint generated always as identity primary key,
  category text not null default '기타',
  title text not null,
  client text,
  period text,
  content_lines jsonb not null default '[]'::jsonb,
  thumb_image_url text,
  detail_image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.performance_partners (
  id bigint generated always as identity primary key,
  name text not null,
  logo_url text not null,
  website_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.recruit_notices (
  id bigint generated always as identity primary key,
  title text not null,
  status text not null default '채용중',
  close_date text,
  notice_type text not null default '정규직',
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image_url text,
  storage_path text unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint gallery_items_image_required check (image_url is not null or storage_path is not null)
);

create table if not exists public.contact_inquiries (
  id bigint generated always as identity primary key,
  contact_name text not null,
  company_name text not null,
  phone text not null,
  email text not null,
  inquiry_type text not null default '기타 컨설팅 문의',
  message text not null,
  status text not null default '신규',
  response_note text,
  privacy_consented boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.company_history_events enable row level security;
alter table public.company_news enable row level security;
alter table public.performance_projects enable row level security;
alter table public.performance_partners enable row level security;
alter table public.recruit_notices enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_inquiries enable row level security;

create policy "Public history read"
on public.company_history_events
for select
to anon, authenticated
using (true);

create policy "Public news read"
on public.company_news
for select
to anon, authenticated
using (true);

create policy "Public projects read"
on public.performance_projects
for select
to anon, authenticated
using (true);

create policy "Public partners read"
on public.performance_partners
for select
to anon, authenticated
using (true);

create policy "Public recruit read"
on public.recruit_notices
for select
to anon, authenticated
using (true);

create policy "Public gallery read"
on public.gallery_items
for select
to anon, authenticated
using (true);

drop policy if exists "Public inquiry insert" on public.contact_inquiries;
create policy "Public inquiry insert"
on public.contact_inquiries
for insert
to anon
with check (privacy_consented = true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public gallery image read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

-- Production recommendation:
-- Keep writes out of the public browser app.
-- Manage inserts/updates through the Supabase dashboard, a protected admin app,
-- server-side service-role API routes, or authenticated RLS policies for admins only.

# Content Admin Guide

This site is configured for a production-safe content flow:

- Public visitors read content with the Supabase anon key.
- Content writes should happen in the Supabase Dashboard, a protected admin app, or a server-side API.
- The public site is not the admin tool.

## Admin Page Setup

1. Run [admin_auth_setup.sql](/F:/moalab/GNB/gnb-web/admin_auth_setup.sql) in Supabase SQL Editor.
2. In Supabase Auth, create an email/password user for the admin.
3. Insert that user's UUID into `public.admin_users`.
4. Open [admin.html](/F:/moalab/GNB/gnb-web/admin.html) after build or `/gnb/admin.html` in deployment.

## Section to Table Mapping

- `회사소개 > 회사연혁` -> `company_history_events`
- `회사소개 > 지앤비소식` -> `company_news`
- `사업실적 > 주요사업실적` -> `performance_projects`
- `사업실적 > 주요파트너십` -> `performance_partners`
- `갤러리` -> `gallery_items` + Storage bucket `gallery`
- `채용정보 > 채용공고` -> `recruit_notices`
- `프로젝트 문의하기` -> `contact_inquiries`

## Common Fields

- `sort_order`: Lower numbers appear first when used.
- `created_at`: Filled automatically.

## SQL Examples

### 회사연혁

```sql
insert into public.company_history_events (year, event_text, sort_order)
values
  (2026, '03. 신규 사업부 신설', 1),
  (2026, '01. 본사 이전', 2);
```

### 지앤비소식

```sql
insert into public.company_news (category, title, published_at, content, sort_order)
values (
  '소식',
  '2026년 신규 프로젝트 수주',
  '2026-03-27',
  '프로젝트 개요와 주요 성과를 여기에 입력합니다.',
  1
);
```

### 주요사업실적

```sql
insert into public.performance_projects (
  category,
  title,
  client,
  period,
  content_lines,
  thumb_image_url,
  detail_image_url,
  sort_order
) values (
  '기획',
  '도시재생 전략 수립 용역',
  'OO시청',
  '2026.01 ~ 2026.06',
  '["현황 분석", "기본계획 수립", "실행전략 제안"]'::jsonb,
  'https://your-cdn.example/project-thumb.jpg',
  'https://your-cdn.example/project-detail.jpg',
  1
);
```

### 주요파트너십

```sql
insert into public.performance_partners (name, logo_url, website_url, sort_order)
values (
  'Partner Name',
  'https://your-cdn.example/partner-logo.png',
  'https://partner.example.com',
  1
);
```

### 갤러리

1. Upload the image to the `gallery` bucket in Supabase Storage.
2. Insert the metadata row:

```sql
insert into public.gallery_items (title, image_url, storage_path, sort_order)
values (
  '현장 사진 제목',
  'https://your-project.supabase.co/storage/v1/object/public/gallery/example.jpg',
  'example.jpg',
  1
);
```

If you store only `storage_path`, the site can still build the public URL.

### 채용공고

```sql
insert into public.recruit_notices (
  title,
  status,
  close_date,
  notice_type,
  content,
  sort_order
) values (
  '[정규직] 지역개발 컨설턴트 채용',
  '채용중',
  '2026.04.30',
  '정규직',
  '담당업무, 자격요건, 우대사항을 여기에 입력합니다.',
  1
);
```

### 프로젝트 문의

```sql
insert into public.contact_inquiries (
  contact_name,
  company_name,
  phone,
  email,
  inquiry_type,
  message,
  status,
  privacy_consented
) values (
  '홍길동',
  'OO기관',
  '010-0000-0000',
  'hello@example.com',
  '기본계획 수립 컨설팅',
  '문의 내용을 여기에 입력합니다.',
  '신규',
  true
);
```

## Recommended Admin Workflow

1. Add or edit rows in the Supabase Dashboard Table Editor.
2. Upload gallery images to the `gallery` bucket first.
3. Refresh the website to confirm the content changed as expected.
4. Project inquiries are submitted from the public site and reviewed in the admin page under `프로젝트 문의`.
5. Keep `VITE_ENABLE_CONTENT_DEMO_FORMS=false` and `VITE_ENABLE_GALLERY_DIRECT_UPLOAD=false` in production unless you add a protected admin flow.

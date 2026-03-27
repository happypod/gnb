# GNB Web

## Supabase Content Setup

The site can now read the following sections from Supabase:

- `회사소개 > 회사연혁`
- `회사소개 > 지앤비소식`
- `사업실적 > 주요사업실적`
- `사업실적 > 주요파트너십`
- `갤러리`
- `채용정보 > 채용공고`
- `프로젝트 문의하기`

Setup steps:

1. Copy `.env.example` to `.env` and fill in your Supabase project values.
2. Run [site_content_setup.sql](/F:/moalab/GNB/gnb-web/site_content_setup.sql) in the Supabase SQL editor.
3. If you still want gallery uploads directly from the browser for a temporary demo, review [supabase/gallery_setup.sql](/F:/moalab/GNB/gnb-web/supabase/gallery_setup.sql) and only then enable `VITE_ENABLE_GALLERY_DIRECT_UPLOAD=true`.
4. For production, keep writes out of the public browser app and manage inserts/updates from the Supabase dashboard, a protected admin app, or a server-side service-role API.
5. Use [CONTENT_ADMIN_GUIDE.md](/F:/moalab/GNB/gnb-web/CONTENT_ADMIN_GUIDE.md) for table mappings and example insert queries.
6. If you want the separate admin page, run [admin_auth_setup.sql](/F:/moalab/GNB/gnb-web/admin_auth_setup.sql), create an email/password user in Supabase Auth, then register that user in `admin_users`.
7. If you already ran the SQL before this change, rerun both SQL files once so the new `contact_inquiries` table and admin policies are added.

Environment variables used by the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_HISTORY_TABLE`
- `VITE_SUPABASE_NEWS_TABLE`
- `VITE_SUPABASE_PROJECTS_TABLE`
- `VITE_SUPABASE_PARTNERS_TABLE`
- `VITE_SUPABASE_GALLERY_BUCKET`
- `VITE_SUPABASE_GALLERY_TABLE`
- `VITE_SUPABASE_RECRUIT_TABLE`
- `VITE_SUPABASE_INQUIRIES_TABLE`
- `VITE_SUPABASE_ADMIN_USERS_TABLE`
- `VITE_ENABLE_CONTENT_DEMO_FORMS`
- `VITE_ENABLE_GALLERY_DIRECT_UPLOAD`
## Google Maps Setup

The directions page now uses a Google Maps embed iframe for:

- `서울 강남구 논현로36길 31 3층 (지앤비플래닝)`

No additional API key or domain registration is required for the current embed mode.
Map URL settings are managed in [src/App.jsx](/F:/moalab/GNB/gnb-web/src/App.jsx).

Current production recommendation:

- Public users can read content.
- Content writes should happen in Supabase dashboard or a separate protected admin flow.
- The existing in-browser content add buttons are not a production admin system.
- The project inquiry form now stores submissions in Supabase and the admin page can review/update them.
- Keep `VITE_ENABLE_CONTENT_DEMO_FORMS=false` and `VITE_ENABLE_GALLERY_DIRECT_UPLOAD=false` for normal production operation.
- The separate admin page is built as [admin.html](/F:/moalab/GNB/gnb-web/admin.html) and will build to `/gnb/admin.html`.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

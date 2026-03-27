const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const APP_BASE_URL = import.meta.env.BASE_URL || '/';

const TABLES = {
  history: import.meta.env.VITE_SUPABASE_HISTORY_TABLE?.trim() || 'company_history_events',
  news: import.meta.env.VITE_SUPABASE_NEWS_TABLE?.trim() || 'company_news',
  projects: import.meta.env.VITE_SUPABASE_PROJECTS_TABLE?.trim() || 'performance_projects',
  partners: import.meta.env.VITE_SUPABASE_PARTNERS_TABLE?.trim() || 'performance_partners',
  recruit: import.meta.env.VITE_SUPABASE_RECRUIT_TABLE?.trim() || 'recruit_notices',
};

export const isSiteContentConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const buildHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
});

const readErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload.message || payload.error_description || payload.error || response.statusText;
  } catch {
    return response.statusText;
  }
};

const formatDate = (value) => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const buildBaseAssetUrl = (path) => `${APP_BASE_URL}${String(path).replace(/^\/+/, '')}`;

const normalizeMediaUrl = (value, fallback) => {
  if (!value) return fallback;

  const trimmed = String(value).trim();
  if (!trimmed) return fallback;
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  return buildBaseAssetUrl(trimmed.replace(/^\.?\//, ''));
};

const fetchRows = async ({ table, select, order }) => {
  const params = new URLSearchParams({ select, order });
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`,
    { headers: buildHeaders() },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
};

const normalizeHistoryRows = (rows) => {
  const groups = new Map();

  rows.forEach((row) => {
    const year = String(row.year ?? '').trim();
    const eventText = row.event_text?.trim();

    if (!year || !eventText) return;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(eventText);
  });

  return Array.from(groups.entries()).map(([year, events]) => ({ year, events }));
};

const normalizeNewsRows = (rows) => (
  rows
    .filter((row) => row.title && row.content)
    .map((row) => ({
      id: row.id,
      type: row.category || '소식',
      title: row.title,
      date: formatDate(row.published_at || row.created_at),
      content: row.content,
    }))
);

const normalizeProjectRows = (rows) => (
  rows
    .filter((row) => row.title)
    .map((row) => ({
      id: row.id,
      tag: row.category || '기타',
      title: row.title,
      thumbImg: row.thumb_image_url || '/images/projects/project-01.png',
      period: row.period || '',
      client: row.client || '',
      content: Array.isArray(row.content_lines)
        ? row.content_lines.filter(Boolean)
        : typeof row.content_lines === 'string'
          ? row.content_lines.split('\n').map((line) => line.trim()).filter(Boolean)
          : [],
      detailImg: row.detail_image_url || row.thumb_image_url || '/images/projects/project-01.png',
    }))
);

const normalizeProjectMedia = (rows) => (
  rows.map((row) => {
    const fallbackImage = buildBaseAssetUrl('images/projects/project-01.png');
    const thumbImg = normalizeMediaUrl(row.thumbImg, fallbackImage);

    return {
      ...row,
      thumbImg,
      detailImg: normalizeMediaUrl(row.detailImg, thumbImg),
    };
  })
);

const normalizePartnerRows = (rows) => (
  rows
    .map((row, index) => ({
      id: row.id ?? index + 1,
      name: row.name || `Partner ${index + 1}`,
      logoUrl: normalizeMediaUrl(row.logo_url, buildBaseAssetUrl(`images/partners/p${String((index % 18) + 1).padStart(2, '0')}.png`)),
      websiteUrl: row.website_url || '',
    }))
);

const normalizeRecruitRows = (rows) => (
  rows
    .filter((row) => row.title && row.content)
    .map((row) => ({
      id: row.id,
      title: row.title,
      state: row.status || '채용중',
      date: row.close_date || '상시채용',
      type: row.notice_type || '정규직',
      content: row.content,
    }))
);

export async function fetchManagedSiteContent() {
  if (!isSiteContentConfigured) {
    return {
      history: null,
      news: null,
      projects: null,
      partners: null,
      recruit: null,
      errors: [],
    };
  }

  const tasks = {
    history: fetchRows({
      table: TABLES.history,
      select: 'id,year,event_text,sort_order,created_at',
      order: 'year.desc,sort_order.asc,created_at.desc',
    }).then(normalizeHistoryRows),
    news: fetchRows({
      table: TABLES.news,
      select: 'id,category,title,published_at,content,sort_order,created_at',
      order: 'sort_order.asc,published_at.desc,created_at.desc',
    }).then(normalizeNewsRows),
    projects: fetchRows({
      table: TABLES.projects,
      select: 'id,category,title,thumb_image_url,detail_image_url,period,client,content_lines,sort_order,created_at',
      order: 'sort_order.asc,created_at.desc',
    }).then(normalizeProjectRows).then(normalizeProjectMedia),
    partners: fetchRows({
      table: TABLES.partners,
      select: 'id,name,logo_url,website_url,sort_order,created_at',
      order: 'sort_order.asc,created_at.asc',
    }).then(normalizePartnerRows),
    recruit: fetchRows({
      table: TABLES.recruit,
      select: 'id,title,status,close_date,notice_type,content,sort_order,created_at',
      order: 'sort_order.asc,created_at.desc',
    }).then(normalizeRecruitRows),
  };

  const entries = await Promise.all(
    Object.entries(tasks).map(async ([key, promise]) => {
      try {
        return [key, { data: await promise, error: null }];
      } catch (error) {
        return [key, { data: null, error: error.message || `${key} fetch failed` }];
      }
    }),
  );

  const result = {
    history: null,
    news: null,
    projects: null,
    partners: null,
    recruit: null,
    errors: [],
  };

  entries.forEach(([key, value]) => {
    result[key] = value.data;
    if (value.error) {
      result.errors.push(`${key}: ${value.error}`);
    }
  });

  return result;
}

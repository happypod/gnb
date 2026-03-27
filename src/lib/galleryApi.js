const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const GALLERY_BUCKET = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET?.trim() || 'gallery';
const GALLERY_TABLE = import.meta.env.VITE_SUPABASE_GALLERY_TABLE?.trim() || 'gallery_items';
const ENABLE_DIRECT_UPLOAD = import.meta.env.VITE_ENABLE_GALLERY_DIRECT_UPLOAD === 'true';
const APP_BASE_URL = import.meta.env.BASE_URL || '/';

export const isGalleryConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const canUploadGalleryDirectly = isGalleryConfigured && ENABLE_DIRECT_UPLOAD;
export const gallerySetupAlertMessage = '실제 사이트 반영 업로드를 사용하려면 Supabase 환경변수와 업로드 정책 설정이 필요합니다. README와 supabase/gallery_setup.sql을 먼저 적용해 주세요.';

const buildHeaders = (headers = {}) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  ...headers,
});

const readErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload.message || payload.error_description || payload.error || response.statusText;
  } catch {
    return response.statusText;
  }
};

const buildPublicUrl = (storagePath) => (
  `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${storagePath}`
);

const buildBaseAssetUrl = (path) => `${APP_BASE_URL}${String(path).replace(/^\/+/, '')}`;

const normalizeGalleryUrl = (value, storagePath) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (trimmed) {
    if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      return trimmed;
    }

    return buildBaseAssetUrl(trimmed.replace(/^\.?\//, ''));
  }

  if (storagePath) {
    return buildPublicUrl(storagePath);
  }

  return '';
};

const toGalleryItem = (row) => ({
  id: row.id ?? row.storage_path ?? row.image_url,
  title: row.title,
  src: normalizeGalleryUrl(row.image_url, row.storage_path),
  createdAt: row.created_at ?? null,
});

const sanitizeFileName = (value) => (
  value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'gallery'
);

const createObjectName = (title, fileName) => {
  const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : 'jpg';
  const suffix = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

  return `${Date.now()}-${suffix}-${sanitizeFileName(title)}.${ext}`;
};

export async function fetchGalleryItems() {
  if (!isGalleryConfigured) return [];

  const params = new URLSearchParams({
    select: 'id,title,image_url,storage_path,created_at,sort_order',
    order: 'sort_order.desc.nullslast,created_at.desc',
  });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${GALLERY_TABLE}?${params.toString()}`,
    { headers: buildHeaders() },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const rows = await response.json();
  return rows.map(toGalleryItem).filter((item) => item.title && item.src);
}

export async function uploadGalleryItem({ title, file }) {
  if (!canUploadGalleryDirectly) {
    throw new Error(gallerySetupAlertMessage);
  }

  const storagePath = createObjectName(title, file.name || 'gallery.jpg');
  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${GALLERY_BUCKET}/${storagePath}`,
    {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false',
      }),
      body: file,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error(await readErrorMessage(uploadResponse));
  }

  const imageUrl = buildPublicUrl(storagePath);
  const insertResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/${GALLERY_TABLE}`,
    {
      method: 'POST',
      headers: buildHeaders({
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      }),
      body: JSON.stringify({
        title,
        image_url: imageUrl,
        storage_path: storagePath,
      }),
    },
  );

  if (!insertResponse.ok) {
    throw new Error(await readErrorMessage(insertResponse));
  }

  const [row] = await insertResponse.json();
  return toGalleryItem(row);
}

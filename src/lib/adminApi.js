import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const CONTENT_TABLES = {
  history: import.meta.env.VITE_SUPABASE_HISTORY_TABLE?.trim() || 'company_history_events',
  news: import.meta.env.VITE_SUPABASE_NEWS_TABLE?.trim() || 'company_news',
  projects: import.meta.env.VITE_SUPABASE_PROJECTS_TABLE?.trim() || 'performance_projects',
  partners: import.meta.env.VITE_SUPABASE_PARTNERS_TABLE?.trim() || 'performance_partners',
  gallery: import.meta.env.VITE_SUPABASE_GALLERY_TABLE?.trim() || 'gallery_items',
  recruit: import.meta.env.VITE_SUPABASE_RECRUIT_TABLE?.trim() || 'recruit_notices',
  inquiries: import.meta.env.VITE_SUPABASE_INQUIRIES_TABLE?.trim() || 'contact_inquiries',
};

export const GALLERY_BUCKET = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET?.trim() || 'gallery';
export const ADMIN_USERS_TABLE = import.meta.env.VITE_SUPABASE_ADMIN_USERS_TABLE?.trim() || 'admin_users';
export const isAdminConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const adminSupabase = isAdminConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'gnb-admin-auth',
      },
    })
  : null;

const requireClient = () => {
  if (!adminSupabase) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }

  return adminSupabase;
};

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

export async function getAdminSession() {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;
  return data.session;
}

export function subscribeToAdminAuth(listener) {
  const supabase = requireClient();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    listener(session);
  });

  return data.subscription;
}

export async function signInAdmin({ email, password }) {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data.session;
}

export async function signOutAdmin() {
  const supabase = requireClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function fetchAdminProfile(userId) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from(ADMIN_USERS_TABLE)
    .select('id,email,created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchTableRows(table, orders = []) {
  const supabase = requireClient();
  let query = supabase.from(table).select('*');

  orders.forEach(({ column, ascending = true, nullsFirst }) => {
    query = query.order(column, { ascending, nullsFirst });
  });

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}

export async function insertTableRow(table, values) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTableRow(table, id, values) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTableRow(table, id) {
  const supabase = requireClient();
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadGalleryAsset({ file, title }) {
  const supabase = requireClient();
  const storagePath = createObjectName(title, file.name || 'gallery.jpg');
  const { data, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(data.path);

  return {
    storagePath: data.path,
    imageUrl: publicUrl,
  };
}

export async function deleteGalleryAsset(storagePath) {
  if (!storagePath) return;

  const supabase = requireClient();
  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([storagePath]);

  if (error) throw error;
}

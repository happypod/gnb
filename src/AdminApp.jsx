import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Database,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Trophy,
  UploadCloud,
  Users,
} from 'lucide-react';
import {
  adminSupabase,
  CONTENT_TABLES,
  deleteGalleryAsset,
  deleteTableRow,
  fetchAdminProfile,
  fetchTableRows,
  getAdminSession,
  insertTableRow,
  isAdminConfigured,
  signInAdmin,
  signOutAdmin,
  subscribeToAdminAuth,
  updateTableRow,
  uploadGalleryAsset,
} from './lib/adminApi';

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitLines = (value) => (
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
);

const formatDateTime = (value) => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

const SECTION_DEFINITIONS = {
  history: {
    label: '회사연혁',
    description: '회사소개 > 회사연혁',
    icon: Building2,
    table: CONTENT_TABLES.history,
    orders: [
      { column: 'year', ascending: false },
      { column: 'sort_order', ascending: true },
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      year: String(new Date().getFullYear()),
      event_text: '',
      sort_order: '0',
    }),
    toForm: (row) => ({
      year: String(row.year ?? ''),
      event_text: row.event_text ?? '',
      sort_order: String(row.sort_order ?? 0),
    }),
    toPayload: (values) => ({
      year: toInteger(values.year, new Date().getFullYear()),
      event_text: values.event_text.trim(),
      sort_order: toInteger(values.sort_order, 0),
    }),
    getTitle: (row) => `${row.year}년`,
    getSummary: (row) => row.event_text,
    fields: [
      { name: 'year', label: '연도', type: 'number', required: true },
      { name: 'event_text', label: '연혁 내용', type: 'textarea', rows: 5, required: true },
      { name: 'sort_order', label: '정렬순서', type: 'number' },
    ],
  },
  news: {
    label: '지앤비소식',
    description: '회사소개 > 지앤비소식',
    icon: Newspaper,
    table: CONTENT_TABLES.news,
    orders: [
      { column: 'sort_order', ascending: true },
      { column: 'published_at', ascending: false },
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      category: '소식',
      title: '',
      published_at: todayInputValue(),
      content: '',
      sort_order: '0',
    }),
    toForm: (row) => ({
      category: row.category ?? '소식',
      title: row.title ?? '',
      published_at: row.published_at ?? todayInputValue(),
      content: row.content ?? '',
      sort_order: String(row.sort_order ?? 0),
    }),
    toPayload: (values) => ({
      category: values.category.trim() || '소식',
      title: values.title.trim(),
      published_at: values.published_at || todayInputValue(),
      content: values.content.trim(),
      sort_order: toInteger(values.sort_order, 0),
    }),
    getTitle: (row) => row.title,
    getSummary: (row) => `${row.category ?? '소식'} · ${row.published_at ?? ''}`,
    fields: [
      { name: 'category', label: '분류', type: 'select', options: ['소식', '공지', '자료'] },
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'published_at', label: '게시일', type: 'date' },
      { name: 'content', label: '본문', type: 'textarea', rows: 8, required: true },
      { name: 'sort_order', label: '정렬순서', type: 'number' },
    ],
  },
  projects: {
    label: '주요사업실적',
    description: '사업실적 > 주요사업실적',
    icon: Trophy,
    table: CONTENT_TABLES.projects,
    orders: [
      { column: 'sort_order', ascending: true },
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      category: '기획',
      title: '',
      client: '',
      period: '',
      content_lines_text: '',
      thumb_image_url: '',
      detail_image_url: '',
      sort_order: '0',
    }),
    toForm: (row) => ({
      category: row.category ?? '기획',
      title: row.title ?? '',
      client: row.client ?? '',
      period: row.period ?? '',
      content_lines_text: Array.isArray(row.content_lines) ? row.content_lines.join('\n') : '',
      thumb_image_url: row.thumb_image_url ?? '',
      detail_image_url: row.detail_image_url ?? '',
      sort_order: String(row.sort_order ?? 0),
    }),
    toPayload: (values) => ({
      category: values.category.trim() || '기획',
      title: values.title.trim(),
      client: values.client.trim(),
      period: values.period.trim(),
      content_lines: splitLines(values.content_lines_text),
      thumb_image_url: values.thumb_image_url.trim() || null,
      detail_image_url: values.detail_image_url.trim() || null,
      sort_order: toInteger(values.sort_order, 0),
    }),
    getTitle: (row) => row.title,
    getSummary: (row) => [row.category, row.client].filter(Boolean).join(' · '),
    fields: [
      { name: 'category', label: '카테고리', type: 'text', required: true },
      { name: 'title', label: '사업명', type: 'text', required: true },
      { name: 'client', label: '발주처', type: 'text' },
      { name: 'period', label: '사업기간', type: 'text' },
      { name: 'content_lines_text', label: '사업 내용', type: 'textarea', rows: 6, note: '한 줄에 한 항목씩 입력하면 사이트 상세 내용으로 나뉘어 저장됩니다.' },
      { name: 'thumb_image_url', label: '리스트 썸네일 URL', type: 'text' },
      { name: 'detail_image_url', label: '상세 이미지 URL', type: 'text' },
      { name: 'sort_order', label: '정렬순서', type: 'number' },
    ],
  },
  partners: {
    label: '주요파트너십',
    description: '사업실적 > 주요파트너십',
    icon: Users,
    table: CONTENT_TABLES.partners,
    orders: [
      { column: 'sort_order', ascending: true },
      { column: 'created_at', ascending: true },
    ],
    emptyForm: () => ({
      name: '',
      logo_url: '',
      website_url: '',
      sort_order: '0',
    }),
    toForm: (row) => ({
      name: row.name ?? '',
      logo_url: row.logo_url ?? '',
      website_url: row.website_url ?? '',
      sort_order: String(row.sort_order ?? 0),
    }),
    toPayload: (values) => ({
      name: values.name.trim(),
      logo_url: values.logo_url.trim(),
      website_url: values.website_url.trim(),
      sort_order: toInteger(values.sort_order, 0),
    }),
    getTitle: (row) => row.name,
    getSummary: (row) => row.website_url || row.logo_url,
    fields: [
      { name: 'name', label: '파트너명', type: 'text', required: true },
      { name: 'logo_url', label: '로고 이미지 URL', type: 'text', required: true },
      { name: 'website_url', label: '홈페이지 URL', type: 'text' },
      { name: 'sort_order', label: '정렬순서', type: 'number' },
    ],
  },
  gallery: {
    label: '갤러리',
    description: '갤러리',
    icon: ImageIcon,
    table: CONTENT_TABLES.gallery,
    orders: [
      { column: 'sort_order', ascending: true },
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      title: '',
      sort_order: '0',
      image_url: '',
      file: null,
    }),
    toForm: (row) => ({
      title: row.title ?? '',
      sort_order: String(row.sort_order ?? 0),
      image_url: row.image_url ?? '',
      file: null,
    }),
    getTitle: (row) => row.title,
    getSummary: (row) => row.storage_path || row.image_url || '',
  },
  recruit: {
    label: '채용공고',
    description: '채용정보 > 채용공고',
    icon: Briefcase,
    table: CONTENT_TABLES.recruit,
    orders: [
      { column: 'sort_order', ascending: true },
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      title: '',
      status: '채용중',
      close_date: '',
      notice_type: '정규직',
      content: '',
      sort_order: '0',
    }),
    toForm: (row) => ({
      title: row.title ?? '',
      status: row.status ?? '채용중',
      close_date: row.close_date ?? '',
      notice_type: row.notice_type ?? '정규직',
      content: row.content ?? '',
      sort_order: String(row.sort_order ?? 0),
    }),
    toPayload: (values) => ({
      title: values.title.trim(),
      status: values.status.trim() || '채용중',
      close_date: values.close_date.trim(),
      notice_type: values.notice_type.trim() || '정규직',
      content: values.content.trim(),
      sort_order: toInteger(values.sort_order, 0),
    }),
    getTitle: (row) => row.title,
    getSummary: (row) => [row.status, row.notice_type, row.close_date].filter(Boolean).join(' · '),
    fields: [
      { name: 'title', label: '공고 제목', type: 'text', required: true },
      { name: 'status', label: '진행 상태', type: 'select', options: ['채용중', '마감'] },
      { name: 'close_date', label: '마감일', type: 'text', note: '예: 2026.04.30 또는 상시채용' },
      { name: 'notice_type', label: '고용 형태', type: 'text' },
      { name: 'content', label: '상세 내용', type: 'textarea', rows: 10, required: true },
      { name: 'sort_order', label: '정렬순서', type: 'number' },
    ],
  },
  inquiries: {
    label: '프로젝트 문의',
    description: '프로젝트 문의 접수 관리',
    icon: Mail,
    table: CONTENT_TABLES.inquiries,
    orders: [
      { column: 'created_at', ascending: false },
    ],
    emptyForm: () => ({
      contact_name: '',
      company_name: '',
      phone: '',
      email: '',
      inquiry_type: '기본계획 수립 컨설팅',
      message: '',
      status: '신규',
      response_note: '',
      privacy_consented: true,
    }),
    toForm: (row) => ({
      contact_name: row.contact_name ?? '',
      company_name: row.company_name ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      inquiry_type: row.inquiry_type ?? '기본계획 수립 컨설팅',
      message: row.message ?? '',
      status: row.status ?? '신규',
      response_note: row.response_note ?? '',
      privacy_consented: Boolean(row.privacy_consented),
    }),
    toPayload: (values) => ({
      contact_name: values.contact_name.trim(),
      company_name: values.company_name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      inquiry_type: values.inquiry_type.trim() || '기본계획 수립 컨설팅',
      message: values.message.trim(),
      status: values.status.trim() || '신규',
      response_note: values.response_note.trim() || null,
      privacy_consented: Boolean(values.privacy_consented),
    }),
    getTitle: (row) => [row.contact_name, row.company_name].filter(Boolean).join(' / '),
    getSummary: (row) => [row.status, row.inquiry_type, row.email].filter(Boolean).join(' · '),
    fields: [
      { name: 'contact_name', label: '담당자 성함', type: 'text', required: true },
      { name: 'company_name', label: '기관/기업명', type: 'text', required: true },
      { name: 'phone', label: '연락처', type: 'text', required: true },
      { name: 'email', label: '이메일', type: 'email', required: true },
      { name: 'inquiry_type', label: '문의 분야', type: 'select', options: ['기본계획 수립 컨설팅', '지역역량강화 교육/운영', '지역 브랜드 홍보·마케팅', '기타 컨설팅 문의'] },
      { name: 'message', label: '상세 문의내용', type: 'textarea', rows: 8, required: true },
      { name: 'status', label: '처리 상태', type: 'select', options: ['신규', '확인중', '답변완료', '보류'] },
      { name: 'response_note', label: '관리 메모', type: 'textarea', rows: 5, note: '내부 확인 메모나 응대 내용을 기록해 두세요.' },
      { name: 'privacy_consented', label: '개인정보 동의', type: 'checkbox', checkboxLabel: '접수 시 동의함' },
    ],
  },
};

const inputClassName = 'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#0B2053] focus:ring-2 focus:ring-[#0B2053]/10';

function AdminField({ field, value, onChange }) {
  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-[#0B2053] focus:ring-[#0B2053]"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
          required={field.required}
        />
        <span className="text-sm text-slate-700">{field.checkboxLabel ?? '체크됨'}</span>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        rows={field.rows ?? 5}
        className={`${inputClassName} resize-y min-h-[120px]`}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        required={field.required}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
      >
        {field.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type}
      className={inputClassName}
      value={value}
      onChange={(event) => onChange(field.name, event.target.value)}
      required={field.required}
    />
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeSection, setActiveSection] = useState('history');
  const [recordsBySection, setRecordsBySection] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState(SECTION_DEFINITIONS.history.emptyForm());
  const [sectionError, setSectionError] = useState('');
  const [sectionNotice, setSectionNotice] = useState('');
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeConfig = SECTION_DEFINITIONS[activeSection];
  const activeRows = recordsBySection[activeSection] ?? [];
  const selectedRow = activeRows.find((row) => String(row.id) === String(selectedId)) ?? null;
  const sessionUserId = session?.user?.id ?? null;
  const adminProfileId = adminProfile?.id ?? null;

  useEffect(() => {
    if (!isAdminConfigured) {
      setIsAuthLoading(false);
      return undefined;
    }

    let ignore = false;

    getAdminSession()
      .then((nextSession) => {
        if (!ignore) setSession(nextSession);
      })
      .catch((error) => {
        if (!ignore) setAuthError(error.message || '세션을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!ignore) setIsAuthLoading(false);
      });

    const subscription = subscribeToAdminAuth((nextSession) => {
      setSession(nextSession);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionUserId) {
      setAdminProfile(null);
      setRecordsBySection({});
      setSelectedId(null);
      setFormValues(SECTION_DEFINITIONS.history.emptyForm());
      setSectionError('');
      setSectionNotice('');
      setIsAuthLoading(false);
      return undefined;
    }

    let ignore = false;
    setIsAuthLoading(true);
    setAuthError('');

    fetchAdminProfile(sessionUserId)
      .then((profile) => {
        if (ignore) return;

        if (!profile) {
          setAuthError('관리자 권한이 없습니다. admin_auth_setup.sql을 적용하고 admin_users 테이블에 현재 사용자를 등록해주세요.');
          signOutAdmin().catch(() => {});
          return;
        }

        setAdminProfile(profile);
      })
      .catch((error) => {
        if (!ignore) {
          setAuthError(error.message || '관리자 권한을 확인하지 못했습니다.');
        }
      })
      .finally(() => {
        if (!ignore) setIsAuthLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [sessionUserId]);

  useEffect(() => {
    setSelectedId(null);
    setFormValues(SECTION_DEFINITIONS[activeSection].emptyForm());
    setSectionError('');
    setSectionNotice('');
  }, [activeSection]);

  useEffect(() => {
    if (!adminProfileId) return undefined;

    let ignore = false;
    const config = SECTION_DEFINITIONS[activeSection];

    setIsSectionLoading(true);
    setSectionError('');

    fetchTableRows(config.table, config.orders)
      .then((rows) => {
        if (ignore) return;
        setRecordsBySection((prev) => ({ ...prev, [activeSection]: rows }));
      })
      .catch((error) => {
        if (!ignore) {
          setSectionError(error.message || '데이터를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!ignore) setIsSectionLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeSection, adminProfileId]);

  const refreshSection = async (nextSelectedId = null) => {
    const config = SECTION_DEFINITIONS[activeSection];
    setIsSectionLoading(true);
    setSectionError('');

    try {
      const rows = await fetchTableRows(config.table, config.orders);
      setRecordsBySection((prev) => ({ ...prev, [activeSection]: rows }));

      if (nextSelectedId == null) {
        setSelectedId(null);
        setFormValues(config.emptyForm());
        return;
      }

      const nextRow = rows.find((row) => String(row.id) === String(nextSelectedId));
      if (nextRow) {
        setSelectedId(nextRow.id);
        setFormValues(config.toForm(nextRow));
      } else {
        setSelectedId(null);
        setFormValues(config.emptyForm());
      }
    } catch (error) {
      setSectionError(error.message || '데이터를 새로고침하지 못했습니다.');
    } finally {
      setIsSectionLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSigningIn(true);
    setAuthError('');

    try {
      await signInAdmin({ email: loginEmail.trim(), password: loginPassword });
      setLoginPassword('');
    } catch (error) {
      setAuthError(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    setAuthError('');
    setSectionNotice('');

    try {
      await signOutAdmin();
    } catch (error) {
      setAuthError(error.message || '로그아웃에 실패했습니다.');
    }
  };

  const handleNewRecord = () => {
    setSelectedId(null);
    setFormValues(activeConfig.emptyForm());
    setSectionNotice('');
  };

  const handleSelectRecord = (row) => {
    setSelectedId(row.id);
    setFormValues(activeConfig.toForm(row));
    setSectionNotice('');
  };

  const handleFieldChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSectionError('');
    setSectionNotice('');

    try {
      let savedRow = null;

      if (activeSection === 'gallery') {
        const currentRow = selectedRow;
        let nextImageUrl = formValues.image_url.trim() || currentRow?.image_url || null;
        let nextStoragePath = currentRow?.storage_path || null;

        if (formValues.file) {
          const uploadResult = await uploadGalleryAsset({
            file: formValues.file,
            title: formValues.title.trim(),
          });

          nextImageUrl = uploadResult.imageUrl;
          nextStoragePath = uploadResult.storagePath;
        }

        if (!nextImageUrl && !nextStoragePath) {
          throw new Error('갤러리 이미지는 파일 업로드 또는 이미지 URL이 필요합니다.');
        }

        const payload = {
          title: formValues.title.trim(),
          sort_order: toInteger(formValues.sort_order, 0),
          image_url: nextImageUrl,
          storage_path: nextStoragePath,
        };

        if (selectedId) {
          const previousStoragePath = currentRow?.storage_path || null;
          savedRow = await updateTableRow(activeConfig.table, selectedId, payload);

          if (formValues.file && previousStoragePath && previousStoragePath !== nextStoragePath) {
            deleteGalleryAsset(previousStoragePath).catch(() => {});
          }
        } else {
          savedRow = await insertTableRow(activeConfig.table, payload);
        }
      } else {
        const payload = activeConfig.toPayload(formValues);
        if (selectedId) {
          savedRow = await updateTableRow(activeConfig.table, selectedId, payload);
        } else {
          savedRow = await insertTableRow(activeConfig.table, payload);
        }
      }

      setSectionNotice(selectedId ? '항목을 수정했습니다.' : '새 항목을 등록했습니다.');
      await refreshSection(savedRow.id);
    } catch (error) {
      setSectionError(error.message || '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    const confirmed = window.confirm('선택한 항목을 삭제할까요?');
    if (!confirmed) return;

    setIsDeleting(true);
    setSectionError('');
    setSectionNotice('');

    try {
      await deleteTableRow(activeConfig.table, selectedRow.id);

      if (activeSection === 'gallery' && selectedRow.storage_path) {
        try {
          await deleteGalleryAsset(selectedRow.storage_path);
        } catch (error) {
          setSectionNotice(`메타데이터는 삭제했지만 파일 정리는 확인이 필요합니다: ${error.message}`);
        }
      }

      if (!sectionNotice) {
        setSectionNotice('항목을 삭제했습니다.');
      }

      await refreshSection(null);
    } catch (error) {
      setSectionError(error.message || '삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdminConfigured || !adminSupabase) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#85C441]">
            <AlertCircle size={16} />
            Supabase 설정 필요
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight">관리자 페이지를 시작할 수 없습니다.</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            `VITE_SUPABASE_URL` 과 `VITE_SUPABASE_ANON_KEY` 환경변수를 먼저 설정한 뒤 다시 접속해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold">
          <LoaderCircle size={18} className="animate-spin text-[#85C441]" />
          관리자 세션을 확인하는 중입니다.
        </div>
      </div>
    );
  }

  if (!session || !adminProfile) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(133,196,65,0.18),_transparent_32%),linear-gradient(180deg,_#071226_0%,_#0b2053_100%)] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)] md:p-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-[#85C441]">
              <ShieldCheck size={16} />
              GNB Admin
            </div>
            <h1 className="mt-8 text-4xl font-black tracking-tight md:text-5xl">운영용 관리자 페이지</h1>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {Object.entries(SECTION_DEFINITIONS).map(([key, section]) => {
                const Icon = section.icon;

                return (
                  <div key={key} className="rounded-[1.75rem] border border-white/10 bg-slate-900/40 p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/10 p-3 text-[#85C441]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{section.label}</p>
                        <p className="text-sm text-slate-300">{section.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">1. Supabase Auth 사용자 생성</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">2. admin_users 등록</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">3. 관리자 로그인</span>
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-white/10 bg-white p-8 text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.25)] md:p-10">
            <div className="flex items-center gap-3 text-[#0B2053]">
              <div className="rounded-2xl bg-[#0B2053]/10 p-3">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black">관리자 로그인</h2>
                <p className="text-sm text-slate-500">Email/password 방식으로 로그인합니다.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail size={16} />
                  이메일
                </span>
                <input
                  type="email"
                  className={inputClassName}
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Lock size={16} />
                  비밀번호
                </span>
                <input
                  type="password"
                  className={inputClassName}
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </label>

              {authError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B2053] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#08193f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningIn ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {isSigningIn ? '로그인 중...' : '관리자 로그인'}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  const siteHref = import.meta.env.BASE_URL || '/';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0B2053]">
              <ShieldCheck size={14} className="text-[#85C441]" />
              GNB Admin Console
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight">운영 콘텐츠 관리자</h1>
            <p className="mt-1 text-sm text-slate-500">
              로그인 계정: {adminProfile.email || session.user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={siteHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              사이트로 돌아가기
            </a>
            <button
              type="button"
              onClick={() => refreshSection(selectedId)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              새로고침
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[#0B2053] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#08193f]"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#85C441]">
              <Database size={14} />
              관리 섹션
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              인증된 관리자만 이 페이지에서 데이터베이스와 스토리지를 수정할 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            {Object.entries(SECTION_DEFINITIONS).map(([key, section]) => {
              const Icon = section.icon;
              const isActive = activeSection === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className={`flex w-full items-center gap-3 rounded-[1.5rem] px-4 py-3 text-left transition ${isActive ? 'bg-[#0B2053] text-white shadow-lg shadow-[#0B2053]/20' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                >
                  <div className={`rounded-2xl p-2.5 ${isActive ? 'bg-white/10 text-[#85C441]' : 'bg-white text-[#0B2053]'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{section.label}</p>
                    <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{section.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{activeConfig.label}</h2>
                <p className="mt-1 text-sm text-slate-500">{activeConfig.description}</p>
              </div>
              <button
                type="button"
                onClick={handleNewRecord}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0B2053] transition hover:border-slate-300 hover:bg-slate-100"
              >
                <Plus size={16} />
                새 항목
              </button>
            </div>

            <div className="mt-5">
              {isSectionLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <LoaderCircle size={18} className="animate-spin text-[#0B2053]" />
                  데이터를 불러오는 중입니다.
                </div>
              ) : activeRows.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                  아직 등록된 데이터가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRows.map((row) => {
                    const isActive = String(row.id) === String(selectedId);

                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => handleSelectRecord(row)}
                        className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${isActive ? 'border-[#0B2053] bg-[#0B2053] text-white shadow-lg shadow-[#0B2053]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold md:text-base">{activeConfig.getTitle(row)}</p>
                            <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                              {activeConfig.getSummary(row) || '설명 없음'}
                            </p>
                          </div>
                          <div className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${isActive ? 'bg-white/10 text-[#85C441]' : 'bg-slate-100 text-slate-500'}`}>
                            #{row.id}
                          </div>
                        </div>
                        {row.created_at && (
                          <p className={`mt-3 text-[11px] ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                            수정기준: {formatDateTime(row.created_at)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  {selectedRow ? '항목 수정' : '새 항목 등록'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedRow ? `${activeConfig.label} 데이터를 수정하고 저장합니다.` : `${activeConfig.label} 데이터를 새로 추가합니다.`}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <FileText size={14} />
                {selectedRow ? `ID ${selectedRow.id}` : '새 항목'}
              </div>
            </div>

            {sectionError && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {sectionError}
              </div>
            )}

            {sectionNotice && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {sectionNotice}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              {activeSection === 'gallery' ? (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">제목</span>
                    <input
                      type="text"
                      className={inputClassName}
                      value={formValues.title}
                      onChange={(event) => handleFieldChange('title', event.target.value)}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">정렬순서</span>
                    <input
                      type="number"
                      className={inputClassName}
                      value={formValues.sort_order}
                      onChange={(event) => handleFieldChange('sort_order', event.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">이미지 URL</span>
                    <input
                      type="text"
                      className={inputClassName}
                      value={formValues.image_url}
                      onChange={(event) => handleFieldChange('image_url', event.target.value)}
                      placeholder="스토리지 업로드 대신 외부 URL을 직접 쓸 수 있습니다."
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <UploadCloud size={16} />
                      이미지 파일 업로드
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#0B2053] file:px-4 file:py-2 file:text-white"
                      onChange={(event) => handleFieldChange('file', event.target.files?.[0] ?? null)}
                    />
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">갤러리 업로드 안내</p>
                    <p className="mt-2 leading-6">
                      새 파일을 올리면 Supabase Storage에 저장하고, URL과 storage path를 `gallery_items`에 함께 기록합니다.
                    </p>
                    {selectedRow?.storage_path && (
                      <p className="mt-2 text-xs text-slate-500">현재 파일 경로: {selectedRow.storage_path}</p>
                    )}
                  </div>
                </>
              ) : (
                activeConfig.fields.map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </span>
                    <AdminField
                      field={field}
                      value={formValues[field.name] ?? ''}
                      onChange={handleFieldChange}
                    />
                    {field.note && <span className="mt-2 block text-xs text-slate-500">{field.note}</span>}
                  </label>
                ))
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0B2053] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#08193f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? '저장 중...' : selectedRow ? '수정 저장' : '새 항목 저장'}
                </button>

                <button
                  type="button"
                  onClick={handleNewRecord}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Plus size={18} />
                  새 폼으로 초기화
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!selectedRow || isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  삭제
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

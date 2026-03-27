const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const CONTACT_INQUIRIES_TABLE = import.meta.env.VITE_SUPABASE_INQUIRIES_TABLE?.trim() || 'contact_inquiries';

export const isInquiryConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const inquirySetupAlertMessage = '문의 접수를 실제 DB에 저장하려면 Supabase 문의 테이블과 정책을 먼저 적용해야 합니다. 최신 site_content_setup.sql 과 admin_auth_setup.sql 을 Supabase SQL Editor에서 다시 실행해주세요.';

const buildHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
});

const readErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload.message || payload.error_description || payload.error || response.statusText;
  } catch {
    return response.statusText;
  }
};

export async function createContactInquiry(values) {
  if (!isInquiryConfigured) {
    throw new Error(inquirySetupAlertMessage);
  }

  const payload = {
    contact_name: values.contactName.trim(),
    company_name: values.companyName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    inquiry_type: values.inquiryType.trim() || '기타 컨설팅 문의',
    message: values.message.trim(),
    privacy_consented: Boolean(values.privacyConsented),
    status: '신규',
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${CONTACT_INQUIRIES_TABLE}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const [savedRow] = await response.json();
  return savedRow;
}

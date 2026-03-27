import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, MapPin, Phone, Printer, Play, ChevronRight, ArrowRight, 
  Building2, Briefcase, Trophy, Image as ImageIcon, MapPinned,
  Calendar, User, CheckCircle2, MessageSquare, ArrowUp, Send, FileText,
  ChevronLeft, LayoutGrid, Users, Target, Heart, Award, Coffee, Laptop, Clock,
  Lock, Plus, UploadCloud
} from 'lucide-react';
import {
  canUploadGalleryDirectly,
  fetchGalleryItems,
  gallerySetupAlertMessage,
  isGalleryConfigured,
  uploadGalleryItem,
} from './lib/galleryApi';
import { createContactInquiry } from './lib/contactApi';
import { fetchManagedSiteContent, isSiteContentConfigured } from './lib/siteContentApi';

const ENABLE_DEMO_CONTENT_FORMS = import.meta.env.VITE_ENABLE_CONTENT_DEMO_FORMS === 'true';
const ENABLE_MAIN_PAGE_SNAP = false;
const buildAppAssetUrl = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;
const normalizeMergeKey = (value) => String(value ?? '').trim().toLowerCase();
const OFFICE_NAME = '지앤비플래닝';
const OFFICE_ADDRESS = '서울 강남구 논현로36길 31 3층 (지앤비플래닝)';
const OFFICE_MAP_ADDRESS = '서울 강남구 논현로36길 31';
const NAVER_MAP_LINK = `https://map.naver.com/p/search/${encodeURIComponent(OFFICE_ADDRESS)}`;
const GOOGLE_MAP_EMBED_URL = `https://maps.google.com/maps?hl=ko&q=${encodeURIComponent(OFFICE_MAP_ADDRESS)}&t=&z=16&output=embed`;
const CONTACT_INQUIRY_OPTIONS = ['기본계획 수립 컨설팅', '지역역량강화 교육/운영', '지역 브랜드 홍보·마케팅', '기타 컨설팅 문의'];
const EMPTY_CONTACT_FORM = {
  contactName: '',
  companyName: '',
  phone: '',
  email: '',
  inquiryType: CONTACT_INQUIRY_OPTIONS[0],
  message: '',
  privacyConsented: false,
};

// Keep the map page component stable so scroll-driven App rerenders do not remount the iframe.
const DirectionsPage = ({ hero }) => {
  const [isMapLoading, setIsMapLoading] = useState(true);

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
      {hero}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-16 reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">찾아오시는 길</h2>
          <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
        </div>
        <div className="reveal bg-white rounded-2xl md:rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-shadow duration-500">
          <div className="w-full lg:w-1/3 p-8 md:p-14 bg-[#0B2053] text-white flex flex-col justify-center relative overflow-hidden">
            <MapPinned className="absolute -right-10 -bottom-10 text-white/5 w-60 h-60 md:w-72 md:h-72 pointer-events-none transform group-hover:rotate-12 transition-transform duration-700" />
            <h3 className="text-2xl md:text-3xl font-black mb-8 md:mb-10 text-[#85C441] relative z-10 tracking-tight">Location Info</h3>
            <div className="space-y-6 md:space-y-10 relative z-10">
              <div className="flex items-start gap-4 md:gap-5 group">
                <div className="bg-white/10 p-2.5 md:p-3 rounded-xl group-hover:bg-[#85C441] transition-colors duration-300"><MapPin className="text-[#85C441] group-hover:text-white w-5 h-5 md:w-6 md:h-6" /></div>
                <div><p className="font-bold text-base md:text-lg mb-1 md:mb-2 text-white">주소</p><p className="text-gray-300 font-light leading-relaxed text-sm md:text-[15px] break-keep">서울 강남구 논현로36길 31<br/>3층 (지앤비플래닝)</p></div>
              </div>
              <div className="flex items-start gap-4 md:gap-5 group">
                <div className="bg-white/10 p-2.5 md:p-3 rounded-xl group-hover:bg-[#85C441] transition-colors duration-300"><Phone className="text-[#85C441] group-hover:text-white w-5 h-5 md:w-6 md:h-6" /></div>
                <div><p className="font-bold text-base md:text-lg mb-1 md:mb-2 text-white">전화번호</p><p className="text-gray-300 font-light text-sm md:text-[15px]">02-458-3248</p></div>
              </div>
            </div>
            <a
              href={NAVER_MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-10 md:mt-14 bg-white text-[#0B2053] py-3.5 md:py-4 rounded-xl font-bold shadow-lg text-base md:text-lg z-10 inline-flex items-center justify-center gap-2"
            >
              네이버 지도 보기 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-auto min-h-[300px] md:min-h-[500px] relative bg-gray-200">
            <iframe
              title="G&B Planning Google Map"
              src={GOOGLE_MAP_EMBED_URL}
              className="absolute inset-0 block w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoading(false)}
            />
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 p-4">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center border border-white/50 max-w-sm w-full">
                  <MapPin size={40} className="mb-3 text-[#85C441] mx-auto md:w-12 md:h-12 md:mb-4" />
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    구글 지도를 불러오는 중입니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mergeUniqueItems = (baseItems = [], incomingItems = [], getKey) => {
  const merged = [];
  const seen = new Set();

  [baseItems, incomingItems].forEach((items) => {
    items.forEach((item, index) => {
      const rawKey = getKey ? getKey(item, index) : item?.id ?? `${index}`;
      const key = normalizeMergeKey(rawKey);

      if (!key || seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });
  });

  return merged;
};

const mergeHistoryEntries = (baseItems = [], incomingItems = []) => {
  const grouped = new Map();

  [...baseItems, ...incomingItems].forEach((item) => {
    const year = String(item?.year ?? '').trim();
    const events = Array.isArray(item?.events) ? item.events : [];

    if (!year) return;
    if (!grouped.has(year)) grouped.set(year, []);

    const nextEvents = grouped.get(year);
    const seenEvents = new Set(nextEvents.map((event) => normalizeMergeKey(event)));

    events.forEach((event) => {
      const nextEvent = String(event ?? '').trim();
      const eventKey = normalizeMergeKey(nextEvent);

      if (!eventKey || seenEvents.has(eventKey)) return;
      seenEvents.add(eventKey);
      nextEvents.push(nextEvent);
    });
  });

  return Array.from(grouped.entries()).map(([year, events]) => ({ year, events }));
};

const getGalleryItemKey = (item) => `${item?.title}|${item?.src}`;
const getProjectItemKey = (item) => `${item?.title}|${item?.client}|${item?.period}`;
const getNewsItemKey = (item) => `${item?.title}|${item?.date}`;
const getRecruitItemKey = (item) => `${item?.title}|${item?.type}|${item?.date}`;
const getPartnerItemKey = (item) => `${item?.name}|${item?.websiteUrl}|${item?.logoUrl}`;

const DEFAULT_GALLERY_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: `default-gallery-${i + 1}`,
  title: [
    '한산모시 홍보마케팅',
    '태안 파도어촌계',
    '춘천시 사업현장',
    '태안군 지역역량강화',
    '현장 조사 전경',
    '지역 특산물 현장',
    '주민 공청회',
    '선진지 견학',
    '성과 공유회',
    '브랜드 개발 회의',
  ][i],
  src: buildAppAssetUrl(`images/gallery/g${String(i + 1).padStart(2, '0')}.jpg`),
}));

const DEFAULT_PROJECTS_DATA = [
  { id: "default-project-1", tag: "컨설팅", title: "양주시 쌀교육농장 컨설팅", thumbImg: "images/projects/project-01.png", period: "2021년 7월 ~ 2021년 10월", client: "양주시 농업기술센터", content: ["리플렛 제작", "쌀을 활용한 프로그램 개발 컨설팅"], detailImg: "images/projects/project-01.png" },
  { id: "default-project-2", tag: "역량강화", title: "여주시 아로마교육 치유체험", thumbImg: "images/projects/project-02.png", period: "2022년 3월 ~ 2022년 8월", client: "여주시청", content: ["치유농업 프로그램 기획", "주민 역량강화 교육"], detailImg: "images/projects/project-02.png" },
  { id: "default-project-3", tag: "기타", title: "(사)한국농어촌관광학회 자문기관", thumbImg: "images/projects/project-03.png", period: "2020년 ~ 현재", client: "한국농어촌관광학회", content: ["농어촌 관광 트렌드 자문", "학술대회 기획"], detailImg: "images/projects/project-03.png" },
  { id: "default-project-4", tag: "컨설팅", title: "양주시 맹골마을 비대면키트 개발", thumbImg: "images/projects/project-04.png", period: "2021년 11월 ~ 2022년 2월", client: "맹골마을 운영위원회", content: ["비대면 체험키트 상품화", "온라인 홍보 방안 수립"], detailImg: "images/projects/project-04.png" },
  { id: "default-project-5", tag: "역량강화", title: "2024년 충남 어촌공동체 역량강화", thumbImg: "images/projects/project-05.png", period: "2024년 1월 ~ 2024년 12월", client: "충청남도", content: ["어촌계 갈등관리 및 리더십 교육", "선진지 견학 운영"], detailImg: "images/projects/project-05.png" },
  { id: "default-project-6", tag: "홍보·마케팅", title: "학교 교육과정 연계 품질인증 지원", thumbImg: "images/projects/project-06.png", period: "2023년 5월 ~ 2023년 11월", client: "농촌진흥청", content: ["교육농장 품질인증 지표 점검", "교구재 디자인 개선"], detailImg: "images/projects/project-06.png" },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `default-project-${i + 7}`,
    tag: "지역개발",
    title: `지역 활성화 프로젝트 0${i + 7}`,
    thumbImg: `images/projects/project-${String(i + 7).padStart(2, '0')}.png`,
    period: "2024년 진행중",
    client: "지자체 및 유관기관",
    content: ["기본계획 수립", "성과분석 및 모니터링"],
    detailImg: `images/projects/project-${String(i + 7).padStart(2, '0')}.png`
  }))
];

const DEFAULT_NEWS_DATA = [
  { id: 'default-news-1', type: '공지', title: '2025년도 어촌신활력증진사업 예비계획수립 완료', date: '2025.10.15', content: '어촌신활력증진사업 예비계획수립이 성공적으로 완료되었습니다.\n앞으로도 지역 발전과 혁신을 위해 최선을 다하는 지앤비플래닝이 되겠습니다.' },
  { id: 'default-news-2', type: '자료', title: '[연구보고서] 농촌진흥 중장기 지도사업 발전 방안', date: '2025.09.28', content: '지앤비플래닝에서 진행한 농촌진흥 중장기 지도사업 발전 방안 연구보고서가 발간되었습니다.\n관련 기관 및 부서에 배포될 예정입니다.' },
  { id: 'default-news-3', type: '소식', title: '지앤비플래닝, 여성기업 우수 표창 수상', date: '2025.08.11', content: '지앤비플래닝이 지역 사회 발전에 기여한 공로를 인정받아 여성기업 우수 표창을 수상하였습니다.\n성원해주신 모든 분들께 감사드립니다.' }
];

const DEFAULT_RECRUIT_DATA = [
  { id: 'default-recruit-1', title: '[정책연구지원실] 지역개발 및 역량강화 컨설턴트 신입/경력 채용', state: '채용중', date: '상시채용', type: '정규직', content: '지역개발 및 역량강화 컨설턴트를 모집합니다.\n\n[담당업무]\n- 지역개발 기본계획 수립\n- 주민 역량강화 교육 기획 및 운영\n\n[자격요건]\n- 학력: 대졸 이상\n- 관련 분야 경력 2년 이상\n\n[우대사항]\n- 도시계획, 지역개발 관련 전공자\n- 관련 자격증 소지자' },
  { id: 'default-recruit-2', title: '[홍보마케팅팀] 브랜드 기획 및 콘텐츠 제작 담당자 채용', state: '마감', date: '2025.10.31', type: '정규직', content: '브랜드 기획 및 콘텐츠 제작 담당자를 모집합니다.\n\n[담당업무]\n- 지역 브랜드 기획 및 마케팅 전략 수립\n- 온/오프라인 홍보 콘텐츠 제작\n\n[자격요건]\n- 학력: 무관\n- 신입 및 경력(1~3년)\n\n[우대사항]\n- 디자인 툴(포토샵, 일러스트레이터) 능숙자\n- 영상 편집 가능자' }
];

const DEFAULT_HISTORY_DATA = [
  { year: '2024', events: ['07. 상호 변경 : 주식회사 지앤비플래닝'] },
  { year: '2022', events: ['10. 출판업, 소프트웨어 개발 및 공급'] },
  { year: '2021', events: ['10. 교육컨설팅업 / 교육 지원서비스업 등 다수 분야 등록', '09. 건국대학교 산학협력단 산학협력선도대학사업 가족회사 협약체결', '07. 산업디자인전문회사 신고 / 여성기업 등록 / 대표이사 김지영 취임', '02. 전문 / 과학 및 기술서비스업 등록'] },
  { year: '2019', events: ['06. 공공디자인업 / 공간디자인 용역업, 유통업 및 부대사업일체', '05. 주식회사 지앤비농어촌문화연구소 설립'] }
];

const DEFAULT_PARTNERS_DATA = Array.from({ length: 18 }, (_, i) => ({
  id: `default-partner-${i + 1}`,
  name: `Partner ${i + 1}`,
  logoUrl: `${import.meta.env.BASE_URL}images/partners/p${String(i + 1).padStart(2, '0')}.png`,
  websiteUrl: '',
}));

const GalleryPage = ({ hero, galleryData, setGalleryData, activeModal, openModal, closeModal}) => {
  const [password, setPassword] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isGalleryLoading, setIsGalleryLoading] = useState(isGalleryConfigured);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const canManageGalleryInBrowser = canUploadGalleryDirectly && ENABLE_DEMO_CONTENT_FORMS;

  const getGalleryCardRatioClass = (index) => {
    const ratios = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/4]', 'aspect-[16/10]'];
    return ratios[index % ratios.length];
  };

  const getGalleryFallbackImage = (index = 0) => {
    const imageCount = DEFAULT_GALLERY_DATA.length || 1;
    const imageNo = String((index % imageCount) + 1).padStart(2, '0');
    return buildAppAssetUrl(`images/gallery/g${imageNo}.jpg`);
  };

  useEffect(() => {
    let ignore = false;

    if (!isGalleryConfigured) return undefined;

    fetchGalleryItems()
      .then((items) => {
        if (ignore) return;
        setGalleryData(mergeUniqueItems(DEFAULT_GALLERY_DATA, items, getGalleryItemKey));
      })
      .catch((error) => {
        if (ignore) return;
        setGalleryData(DEFAULT_GALLERY_DATA);
        console.warn(error.message || '온라인 갤러리를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!ignore) setIsGalleryLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [setGalleryData]);

  useEffect(() => (
    () => {
      if (uploadPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadPreview);
      }
    }
  ), [uploadPreview]);

  const resetGalleryUploadForm = () => {
    if (uploadPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadPreview);
    }
    setUploadTitle('');
    setUploadFile(null);
    setUploadPreview(null);
  };

  const handleGalleryFileChange = (e) => {
    const nextFile = e.target.files?.[0];
    if (!nextFile) return;

    if (uploadPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadPreview);
    }

    setUploadFile(nextFile);
    setUploadPreview(URL.createObjectURL(nextFile));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (password === '1234') {
      closeModal('authType');
      setPassword('');
      openModal('uploadType', 'gallery');
      return;
    }

    alert('비밀번호가 일치하지 않습니다.');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) return;
    if (!canManageGalleryInBrowser) {
      alert(gallerySetupAlertMessage);
      return;
    }

    setIsGalleryUploading(true);
    uploadGalleryItem({ title: uploadTitle.trim(), file: uploadFile })
      .then((newItem) => {
        setGalleryData((prev) => [newItem, ...prev]);
        closeModal('uploadType');
        resetGalleryUploadForm();
        alert('갤러리 자료가 업로드되었습니다.');
      })
      .catch((error) => {
        alert(error.message || '갤러리 업로드에 실패했습니다.');
      })
      .finally(() => {
        setIsGalleryUploading(false);
      });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {hero}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6">
          <div className="w-full md:w-auto md:flex-1 text-center md:text-left animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">갤러리</h2>
            <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto md:mx-0 rounded-full animate-sweep-right origin-left"></div>
            <p className="mt-4 md:mt-6 text-gray-500 text-sm md:text-lg">지앤비플래닝의 다양한 현장 활동 모습을 확인하세요.</p>
          </div>
          {canManageGalleryInBrowser && (
            <button onClick={() => openModal('authType', 'gallery')} className="bg-[#0B2053] text-white px-6 py-3 rounded-full text-sm md:text-base shadow-md shrink-0 inline-flex items-center justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
              자료 등록하기 <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {galleryData.map((item, index) => (
            <div
              key={getGalleryItemKey(item)}
              className="break-inside-avoid mb-4 md:mb-6 animate-fade-in-up"
              style={{ animationDelay: `${0.08 + Math.min(index, 8) * 0.07}s` }}
            >
              <button
                type="button"
                className="w-full block text-left outline-none focus:ring-2 focus:ring-[#85C441] focus:ring-offset-2 rounded-2xl md:rounded-[1.5rem]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  openModal('image', { ...item, index });
                }}
              >
                <div className="rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm bg-white border border-gray-100 hover:border-[#85C441]/35 hover:shadow-[0_12px_24px_rgba(11,32,83,0.10)] transition-[border-color,box-shadow] duration-200">
                  <div className={`${getGalleryCardRatioClass(index)} bg-gray-100 overflow-hidden relative`}>
                    <img
                      src={item.src || getGalleryFallbackImage(index)}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        if (event.currentTarget.dataset.fallbackApplied === 'true') return;
                        event.currentTarget.dataset.fallbackApplied = 'true';
                        event.currentTarget.src = getGalleryFallbackImage(index);
                      }}
                    />
                  </div>
                  <div className="px-5 py-4 md:px-6 md:py-5 border-t border-gray-100 bg-white min-h-[88px] flex flex-col justify-center">
                    <p className="text-gray-900 font-bold text-base md:text-lg leading-snug">{item.title}</p>
                    <div className="mt-2 inline-flex items-center gap-2 text-[#0B2053] text-xs md:text-sm font-medium opacity-80">
                      <ImageIcon size={16} /> 크게 보기
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {isGalleryConfigured && !isGalleryLoading && galleryData.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500">
            현재 등록된 갤러리 자료가 없습니다.
          </div>
        )}
      </div>

      {activeModal.image && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md shadow-2xl">
          <button
            type="button"
            aria-label="이미지 모달 닫기"
            className="absolute inset-0 cursor-pointer z-0"
            onClick={() => closeModal('image')}
          />
          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">
            <button type="button" onClick={() => closeModal('image')} className="absolute -top-12 right-0 text-white bg-black/50 hover:bg-black/70 border border-white/30 rounded-full p-2.5 transition-colors">
              <X size={28} />
            </button>
            <div className="bg-[#0B2053]/85 p-2 md:p-3 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-sm border border-white/20">
              <img
                src={activeModal.image.src || getGalleryFallbackImage(activeModal.image.index ?? 0)}
                alt={activeModal.image.title}
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                onError={(event) => {
                  if (event.currentTarget.dataset.fallbackApplied === 'true') return;
                  event.currentTarget.dataset.fallbackApplied = 'true';
                  event.currentTarget.src = getGalleryFallbackImage(activeModal.image.index ?? 0);
                }}
              />
            </div>
            <p className="text-white text-lg md:text-xl font-bold mt-6 md:mt-8 bg-black/60 px-8 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl tracking-tight">
              {activeModal.image.title}
            </p>
          </div>
        </div>
      )}

      {canManageGalleryInBrowser && activeModal.authType === 'gallery' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('authType')}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden">
            <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Lock size={18} className="text-[#85C441]" /> 관리자 인증</h3>
              <button onClick={() => closeModal('authType')}><X size={20} /></button>
            </div>
            <form onSubmit={handleAuthSubmit} className="p-6 md:p-8 space-y-6">
              <p className="text-sm text-gray-600 break-keep text-center">갤러리 등록은 관리자만 가능합니다.<br/>고유 패스워드를 입력해주세요. (임시: 1234)</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="패스워드 입력" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] text-center tracking-widest text-lg" />
              <button type="submit" className="w-full bg-[#85C441] text-white py-3.5 rounded-xl font-bold hover:bg-[#75ad39] transition-colors">인증하기</button>
            </form>
          </div>
        </div>
      )}

      {canManageGalleryInBrowser && activeModal.uploadType === 'gallery' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={() => { closeModal('uploadType'); resetGalleryUploadForm(); }}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold flex items-center gap-2"><UploadCloud size={18} className="text-[#85C441]" /> 갤러리 자료 등록</h3>
              <button onClick={() => { closeModal('uploadType'); resetGalleryUploadForm(); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6 md:p-8 space-y-5">
              {!canUploadGalleryDirectly && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 break-keep">
                  실제 사이트 업로드를 쓰려면 Supabase 설정을 먼저 연결해야 합니다. 설정 전에는 업로드가 저장되지 않습니다.
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목 <span className="text-red-500">*</span></label>
                <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="예: 충남 어촌공동체 역량강화 현장" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">이미지 첨부 <span className="text-red-500">*</span></label>
                <input type="file" accept="image/*" onChange={handleGalleryFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#85C441]/10 file:text-[#0B2053] cursor-pointer" />
              </div>
              {uploadPreview && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={uploadPreview} alt="업로드 미리보기" className="w-full h-56 object-cover" />
                </div>
              )}
              <button type="submit" disabled={isGalleryUploading} className="w-full bg-[#85C441] text-white py-4 rounded-xl font-bold hover:bg-[#75ad39] transition-colors mt-4 shadow-md flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <Send size={18} /> {isGalleryUploading ? '업로드 중...' : '업로드 완료'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('main'); 
  const [currentTab, setCurrentTab] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- 임시 DB 상태 ---
  const [galleryData, setGalleryData] = useState(DEFAULT_GALLERY_DATA);
  const [projectsData, setProjectsData] = useState(DEFAULT_PROJECTS_DATA);
  const [newsData, setNewsData] = useState(DEFAULT_NEWS_DATA);
  const [recruitData, setRecruitData] = useState(DEFAULT_RECRUIT_DATA);
  const [historyData, setHistoryData] = useState(DEFAULT_HISTORY_DATA);
  const [partnersData, setPartnersData] = useState(DEFAULT_PARTNERS_DATA);
  const [contentSyncErrors, setContentSyncErrors] = useState([]);
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT_FORM);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  const [activeModal, setActiveModal] = useState({
    project: null, image: null, news: null, recruitDetail: null,
    authType: null, uploadType: null
  });
  const projectModalScrollRef = useRef(null);

  const isAnyModalOpen = isMobileMenuOpen || isContactModalOpen || Object.values(activeModal).some(val => val !== null);

  // [수정] 메인 페이지 입장 시에만 스냅 효과를 활성화하여 출렁거림 방지
  useEffect(() => {
    if (currentPage === 'main' && ENABLE_MAIN_PAGE_SNAP) {
      document.documentElement.classList.add('snap-container');
    } else {
      document.documentElement.classList.remove('snap-container');
    }
    return () => document.documentElement.classList.remove('snap-container');
  }, [currentPage]);

// 1. 스크롤 감지 이벤트 (최초 1회만 등록)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const reveals = document.querySelectorAll('.reveal:not(.active)');
      const windowHeight = window.innerHeight;
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 50) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. 팝업 닫힘 등 화면이 리렌더링 될 때 강제로 현재 위치 요소 나타나게 복구
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      // 현재 화면(viewport)에 걸쳐있는 요소들은 스크롤 없이도 즉시 표시
      if (el.getBoundingClientRect().top < windowHeight - 50) {
        el.classList.add('active');
      }
    });
  });

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isAnyModalOpen]);

  useEffect(() => {
    let ignore = false;

    if (!isSiteContentConfigured) return undefined;

    fetchManagedSiteContent()
      .then((result) => {
        if (ignore) return;
        if (Array.isArray(result.history)) {
          setHistoryData(mergeHistoryEntries(DEFAULT_HISTORY_DATA, result.history));
        }
        if (Array.isArray(result.news)) {
          setNewsData(mergeUniqueItems(DEFAULT_NEWS_DATA, result.news, getNewsItemKey));
        }
        if (Array.isArray(result.projects)) {
          setProjectsData(mergeUniqueItems(DEFAULT_PROJECTS_DATA, result.projects, getProjectItemKey));
        }
        if (Array.isArray(result.partners)) {
          setPartnersData(mergeUniqueItems(DEFAULT_PARTNERS_DATA, result.partners, getPartnerItemKey));
        }
        if (Array.isArray(result.recruit)) {
          setRecruitData(mergeUniqueItems(DEFAULT_RECRUIT_DATA, result.recruit, getRecruitItemKey));
        }
        setContentSyncErrors(result.errors);
      })
      .catch((error) => {
        if (ignore) return;
        setContentSyncErrors([error.message || 'Supabase content sync failed']);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (contentSyncErrors.length > 0) {
      console.warn('Supabase content sync issues:', contentSyncErrors);
    }
  }, [contentSyncErrors]);

  useEffect(() => {
    if (activeModal.project && projectModalScrollRef.current) {
      projectModalScrollRef.current.scrollTop = 0;
    }
  }, [activeModal.project]);

  const closeModal = (type) => setActiveModal(prev => ({ ...prev, [type]: null }));
  const openModal = (type, data) => setActiveModal(prev => ({ ...prev, [type]: data }));
  const resetContactForm = () => {
    setContactForm(EMPTY_CONTACT_FORM);
    setIsContactSubmitting(false);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    resetContactForm();
  };

  const handleContactFieldChange = (name, value) => {
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (isContactSubmitting) return;

    setIsContactSubmitting(true);

    try {
      await createContactInquiry(contactForm);
      alert('문의가 성공적으로 접수되었습니다.\n관리자가 확인 후 연락드리겠습니다.');
      closeContactModal();
    } catch (error) {
      alert(error.message || '문의 접수에 실패했습니다.');
      setIsContactSubmitting(false);
    }
  };

  const navigateTo = (page, tab = '') => {
    setCurrentPage(page);
    setCurrentTab(tab);
    setIsMobileMenuOpen(false); 
    closeContactModal();
    setActiveModal({ project: null, image: null, news: null, recruitDetail: null, authType: null, uploadType: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const adminPageHref = `${import.meta.env.BASE_URL}admin.html`;

  const navItems = [
    { id: 'about', label: '회사소개', icon: Building2, tabs: [{id: 'intro', label: '인사말'}, {id: 'org', label: '조직도'}, {id: 'history', label: '회사연혁'}, {id: 'news', label: '지앤비소식'}] },
    { id: 'business', label: '사업영역', icon: Briefcase, tabs: [{id: 'key', label: '주요사업소개'}] },
    { id: 'performance', label: '사업실적', icon: Trophy, tabs: [{id: 'list', label: '주요사업실적'}, {id: 'partners', label: '주요파트너십'}] },
    { id: 'gallery', label: '갤러리', icon: ImageIcon },
    { id: 'recruit', label: '채용정보', icon: Users, tabs: [{id: 'info', label: '인재상 및 복지'}, {id: 'notice', label: '채용공고'}] },
    { id: 'directions', label: '오시는 길', icon: MapPinned }
  ];

  const SweepButton = ({ onClick, className, children, icon: Icon }) => (
    <button onClick={onClick} className={`relative overflow-hidden group ${className}`}>
      <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children} {Icon && <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
      </span>
    </button>
  );

  const SubpageHero = ({ title, subtitle, bgImage, disableAnimation = false }) => {
    if (disableAnimation) {
      return (
        <div className="relative h-[30vh] md:h-[40vh] min-h-[250px] flex items-center justify-center overflow-hidden bg-[#0B2053]">
          <div className="absolute inset-0 z-0 bg-black">
            <img src={bgImage} alt={title} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover opacity-60" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2053]/90 to-black/30 z-10 pointer-events-none"></div>
          <div className="relative z-20 text-center text-white mt-10 md:mt-12 px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight drop-shadow-lg">{title}</h1>
            <p className="text-base md:text-xl font-light opacity-90 drop-shadow-md">{subtitle}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative h-[30vh] md:h-[40vh] min-h-[250px] flex items-center justify-center overflow-hidden bg-[#0B2053]"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundPosition: 'center', backgroundSize: 'cover' } : undefined}
      >
        <div className="absolute inset-0 z-0 bg-black">
          <img src={bgImage} alt={title} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover opacity-60 animate-subtle-zoom" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2053]/90 to-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white mt-10 md:mt-12 animate-fade-in-up px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight drop-shadow-lg">
            <span className="relative inline-block">
              <span className="relative z-10">{title}</span>
              <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#85C441]/60 -z-10 animate-sweep-right"></span>
            </span>
          </h1>
          <p className="text-base md:text-xl font-light opacity-90 drop-shadow-md">{subtitle}</p>
        </div>
      </div>
    );
  };

  const TabMenu = ({ tabs, activeTab, onTabChange }) => {
    if (!tabs || tabs.length <= 1) return null;
    return (
      <div className="flex justify-center border-b border-gray-200 bg-white/95 backdrop-blur-lg sticky top-[72px] z-[40] shadow-sm transition-all">
        <div className="flex w-full max-w-5xl px-2 md:px-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[100px] md:min-w-[120px] py-4 md:py-5 text-center text-[14px] md:text-[15px] font-medium transition-all duration-300 whitespace-nowrap relative ${
                activeTab === tab.id ? 'text-[#0B2053] font-bold' : 'text-gray-500 hover:text-[#0B2053] hover:bg-gray-50/50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0B2053] animate-sweep-right origin-left"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SiteFooter = () => (
    <footer className={`${currentPage === 'main' && ENABLE_MAIN_PAGE_SNAP ? 'snap-section ' : ''}bg-[#0B2053] text-gray-300 py-12 md:py-16 relative z-[80] isolate border-t-4 border-[#85C441]`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 md:gap-8 mb-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">g<span className="text-[#85C441]">&</span>b</span>
            <span className="text-xs md:text-sm font-bold mt-1 text-gray-400">Planning</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium">
              <button type="button" onClick={() => navigateTo('about')} className="text-gray-300 hover:text-[#85C441]">회사소개</button>
              <button type="button" onClick={() => navigateTo('business')} className="text-gray-300 hover:text-[#85C441]">사업영역</button>
              <button type="button" onClick={() => navigateTo('performance')} className="text-gray-300 hover:text-[#85C441]">사업실적</button>
              <button type="button" onClick={() => navigateTo('gallery')} className="text-gray-300 hover:text-[#85C441]">갤러리</button>
              <button type="button" onClick={() => navigateTo('recruit')} className="text-gray-300 hover:text-[#85C441]">채용정보</button>
              <button type="button" onClick={() => navigateTo('directions')} className="text-gray-300 hover:text-[#85C441]">오시는 길</button>
            </div>
            <a
              href={adminPageHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:border-[#85C441] hover:text-[#85C441]"
            >
              <Lock size={16} className="text-[#85C441]" />
              관리자 페이지
            </a>
          </div>
        </div>
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-2.5 md:gap-3">
            <button
              type="button"
              onClick={() => navigateTo('main')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs md:text-sm font-semibold text-white transition-colors hover:border-[#85C441] hover:text-[#85C441]"
            >
              메인 바로가기 <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('performance', 'list')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs md:text-sm font-semibold text-white transition-colors hover:border-[#85C441] hover:text-[#85C441]"
            >
              사업실적 바로가기 <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('gallery')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs md:text-sm font-semibold text-white transition-colors hover:border-[#85C441] hover:text-[#85C441]"
            >
              갤러리 바로가기 <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-6 md:gap-8 text-xs md:text-sm font-light text-center md:text-left">
          <div className="space-y-1.5 md:space-y-2 leading-relaxed opacity-80 break-keep">
            <p>상호: (주)지앤비플래닝 <span className="mx-2 opacity-50">|</span> 대표: 김지윤</p>
            <p>주소: 서울 강남구 도산대로6길 31, 3층</p>
            <p>Tel: 02-458-3248 <span className="mx-2 opacity-50">|</span> Fax: 02-499-3248</p>
          </div>
          <div className="md:text-right mt-auto">
            <p className="opacity-60">&copy; {new Date().getFullYear()} G&B Planning. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );

  // --- 페이지: 메인 ---
  const PageMain = () => (
    <div>
      <section className="snap-section relative h-[100dvh] flex items-center justify-center bg-[#0B2053] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" alt="Main Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay animate-subtle-zoom" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2053] via-[#0B2053]/80 to-transparent z-10"></div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-white pt-24 md:pt-32">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[#85C441] font-bold tracking-[0.15em] text-xs md:text-sm uppercase mb-6 md:mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#85C441] animate-pulse"></span> G&B Planning
            </p>
          </div>
          <h2 className="text-[2.5rem] md:text-6xl lg:text-[5.5rem] font-light mb-8 md:mb-10 leading-[1.15] tracking-[-0.03em] animate-fade-in-up break-keep text-white drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
            국가정책연구 및 지역개발의<br/>
            <span className="relative inline-block z-10 font-black mt-2 md:mt-3">
              새로운 패러다임.
              <span className="absolute bottom-2 md:bottom-4 left-0 w-full h-3 md:h-6 bg-[#85C441]/90 -z-10 animate-sweep-right" style={{ animationDelay: '0.6s' }}></span>
            </span>
          </h2>
          <p className="text-lg md:text-2xl font-extralight max-w-3xl leading-[1.7] md:leading-[1.8] text-gray-200 animate-fade-in-up break-keep drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
            농어촌에 대한 깊은 연구와 도시재생의 이해를 바탕으로<br className="hidden md:block"/>
            다양한 지역단위 개발사업과 <strong className="font-medium text-white">공동체 역량강화 및 지역활성화 컨설팅</strong>을 수행합니다.
          </p>
          <div className="mt-10 md:mt-14 flex flex-wrap gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <SweepButton onClick={() => navigateTo('about', 'intro')} icon={ArrowRight} className="px-6 md:px-8 py-3.5 md:py-4 bg-[#85C441] text-white rounded-full text-sm md:text-base shadow-lg shadow-[#85C441]/30 font-bold">
              회사소개 보기
            </SweepButton>
            <SweepButton onClick={() => setIsContactModalOpen(true)} className="px-6 md:px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full text-sm md:text-base font-bold">
              프로젝트 문의하기
            </SweepButton>
          </div>
        </div>
      </section>

      <section className="snap-section min-h-screen py-20 md:py-32 bg-white relative overflow-hidden flex items-center">
        <div className="absolute -left-10 md:-left-20 top-1/2 -translate-y-1/2 text-[8rem] md:text-[15rem] font-black text-gray-50 opacity-50 pointer-events-none select-none">VISION</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="w-full sm:w-3/4 lg:w-5/12 relative cursor-pointer group" onClick={() => navigateTo('about', 'intro')}>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_45px_rgba(11,32,83,0.18)]">
                <img src="images/ceo.png" alt="대표이사" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl md:block border border-gray-100 hidden sm:block transition-transform duration-500 group-hover:-translate-y-3">
                <p className="text-[#85C441] font-bold text-xs md:text-sm mb-1 tracking-wider">지앤비플래닝 대표이사</p>
                <p className="text-xl md:text-2xl font-bold text-[#0B2053]">김 지 영</p>
              </div>
            </div>
            <div className="w-full lg:w-7/12">
              <h3 className="text-xs md:text-sm font-bold text-[#85C441] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-[#85C441]"></span> Message from the CEO
              </h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 md:mb-10 leading-[1.3] tracking-[-0.03em] break-keep">
                급변하는 시대 속에서<br/>
                <strong className="font-extrabold">사람과 지역, 미래를 연결</strong>합니다.
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-[1.8] mb-8 md:mb-10 font-light break-keep">
                안녕하십니까. 저희 지앤비플래닝 홈페이지를 방문해 주셔서 진심으로 감사드립니다.<br/><br/>
                지앤비플래닝은 창의적인 기획과 혁신적인 전략으로 고객과 지역사회의 가치를 높이는 전문 파트너입니다. 단순한 계획을 넘어 사람과 지역, 미래를 연결하는 종합적 솔루션을 제공합니다.
              </p>
              <button onClick={() => navigateTo('about', 'intro')} className="text-[#0B2053] font-bold flex items-center gap-2 pb-1 border-b-[2px] border-[#0B2053] w-max text-sm md:text-base group transition-colors hover:text-[#85C441]">
                인사말 전체보기 <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="snap-section min-h-screen py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h3 className="text-xs md:text-sm font-bold text-[#85C441] tracking-[0.2em] uppercase mb-3">Highlights & News</h3>
          </div>

          <div className="space-y-14 md:space-y-20">
            <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm p-6 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">프로젝트 하이라이트</h3>
                  <p className="mt-2 text-sm md:text-base text-gray-500">대표 사업 실적을 먼저 살펴보세요.</p>
                </div>
                <button onClick={() => navigateTo('performance')} className="text-sm text-gray-500 font-bold flex items-center gap-1 group hover:text-[#0B2053] transition-colors">
                  전체보기 <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {projectsData.slice(0, 4).map((item) => (
                  <div key={item.id} className="group cursor-pointer rounded-[1.5rem] overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-[#85C441]/40" onClick={() => openModal('project', item)}>
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img src={item.thumbImg} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-[#0B2053] shadow-sm">
                        {item.tag}
                      </div>
                      <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform scale-90 transition-transform duration-300 group-hover:scale-100">
                          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 border-t border-gray-100 bg-white">
                      <h4 className="font-semibold text-gray-900 line-clamp-1 text-sm md:text-base transition-colors duration-300 group-hover:text-[#0B2053]">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm p-6 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">지앤비플래닝 소식</h3>
                  <p className="mt-2 text-sm md:text-base text-gray-500">최근 공지와 자료, 업데이트를 빠르게 확인할 수 있습니다.</p>
                </div>
                <button onClick={() => navigateTo('about', 'news')} className="text-sm text-gray-500 font-bold flex items-center gap-1 group hover:text-[#0B2053] transition-colors">
                  소식 더보기 <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {newsData.slice(0, 3).map((news) => (
                  <div key={news.id} onClick={() => openModal('news', news)} className="group bg-gray-50 rounded-[1.5rem] p-6 md:p-8 cursor-pointer border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:bg-[#0B2053] hover:border-[#0B2053] hover:shadow-2xl">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-bold transition-colors ${news.type === '공지' ? 'bg-[#85C441]/20 text-[#85C441] group-hover:bg-[#85C441] group-hover:text-white' : 'bg-white text-gray-600 shadow-sm group-hover:bg-white/20 group-hover:text-white group-hover:shadow-none'}`}>
                        {news.type}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 flex items-center gap-1 font-light transition-colors group-hover:text-gray-300"><Calendar size={12} />{news.date}</span>
                    </div>
                    <h4 className="text-base md:text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed mb-6 md:mb-8 tracking-tight transition-colors group-hover:text-white">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[#0B2053] font-bold text-xs md:text-sm transition-colors group-hover:text-[#85C441]">
                      자세히 보기 <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );

  // --- 페이지: 회사소개 ---
  const PageAbout = () => {
    const [password, setPassword] = useState('');
    const [newsUploadType, setNewsUploadType] = useState('소식');
    const [newsUploadTitle, setNewsUploadTitle] = useState('');
    const [newsUploadContent, setNewsUploadContent] = useState('');

    const aboutTab = currentTab || 'intro';

    const handleNewsAuthSubmit = (e) => {
      e.preventDefault();
      if (password === '1234') { closeModal('authType'); setPassword(''); openModal('uploadType', 'news'); }
      else alert('비밀번호가 일치하지 않습니다.');
    };

    const handleNewsUploadSubmit = (e) => {
      e.preventDefault();
      if (!newsUploadTitle || !newsUploadContent) return;
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
      setNewsData([{ id: Date.now(), type: newsUploadType, title: newsUploadTitle, date: formattedDate, content: newsUploadContent }, ...newsData]);
      closeModal('uploadType'); setNewsUploadType('소식'); setNewsUploadTitle(''); setNewsUploadContent('');
      alert('지앤비소식이 성공적으로 등록되었습니다.');
    };

    return (
      <div className="animate-fade-in bg-white min-h-screen pb-20">
        <SubpageHero title="회사소개" subtitle="Introduction" bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" />
        <TabMenu tabs={navItems[0].tabs} activeTab={aboutTab} onTabChange={setCurrentTab} />
        
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div key={aboutTab} className="tab-content-enter">
            {/* 인사말 탭 */}
            {aboutTab === 'intro' && (
              <div>
                <div className="text-center mb-10 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">대표 인사말</h2>
                  <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
                </div>
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-14 border border-gray-100 flex flex-col md:flex-row gap-8 md:gap-20 hover:shadow-2xl transition-shadow duration-500 group">
                  <div className="w-full sm:w-2/3 md:w-2/5 mx-auto shrink-0 relative">
                    <div className="absolute inset-0 bg-[#85C441] rounded-3xl transform translate-x-3 translate-y-3 -z-10 hidden sm:block group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500"></div>
                    <img src="images/ceo.png" alt="대표이사" className="w-full h-full object-cover object-top rounded-3xl shadow-xl relative z-10" />
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col justify-center text-center md:text-left">
                    <h3 className="text-xl md:text-3xl font-bold text-[#0B2053] mb-6 md:mb-8 leading-tight break-keep">
                      "혁신적인 전략으로 고객과<br/>지역사회의 가치를 높이겠습니다."
                    </h3>
                    <div className="space-y-4 md:space-y-5 text-gray-600 font-light leading-relaxed text-sm md:text-lg break-keep text-left">
                      <p>안녕하십니까. 저희 지앤비플래닝 홈페이지를 방문해 주셔서 진심으로 감사드립니다.</p>
                      <p>지앤비플래닝은 창의적인 기획과 혁신적인 전략으로 고객과 지역사회의 가치를 높이는 전문 파트너 입니다.</p>
                      <p>급변하는 시대속에서 우리는 단순한 계획을 넘어, 사람과 지역, 미래를 연결하는 종합적 솔루션을 제공합니다.</p>
                      <p>앞으로도 신뢰를 바탕으로 새로운 기회를 발굴하고 함께 성장하는 동반자가 되겠습니다. 감사합니다.</p>
                    </div>
                    <div className="mt-8 md:mt-12 text-right border-t border-gray-100 pt-6 md:pt-8">
                      <p className="text-gray-500 mb-1 text-xs md:text-sm font-medium tracking-wide">지앤비플래닝 대표이사</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">김 지 영</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 조직도 탭 */}
            {aboutTab === 'org' && (
              <div>
                <div className="text-center mb-10 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">조직도</h2>
                  <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
                </div>
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-[2rem] p-6 md:p-20 flex flex-col items-center border border-gray-100 shadow-sm">
                  <div className="bg-[#0B2053] text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-lg font-bold text-lg md:text-xl mb-6 md:mb-10 relative z-10 w-48 md:w-56 text-center border-b-4 border-[#85C441] transform hover:-translate-y-1 transition-transform">대표이사</div>
                  <div className="w-px h-6 md:h-10 bg-gray-300"></div>
                  <div className="flex w-full max-w-3xl justify-between items-center relative mb-6 md:mb-10 flex-col sm:flex-row gap-4 sm:gap-0">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-0 hidden sm:block"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 -z-0 sm:hidden"></div>
                    
                    <div className="bg-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md font-medium text-gray-700 relative z-10 border border-gray-200 text-sm md:text-base hover:shadow-lg transition-shadow">자문이사</div>
                    <div className="bg-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md font-bold text-[#0B2053] relative z-10 border-2 border-[#85C441] text-sm md:text-base hover:shadow-lg transition-shadow">정책연구지원실(컨설팅)</div>
                  </div>
                  <div className="w-px h-6 md:h-10 bg-gray-300"></div>
                  <div className="relative w-full max-w-4xl mt-6 md:mt-10 pt-8 md:pt-10 border-t-2 border-gray-300 flex flex-wrap justify-center gap-4 md:gap-6">
                    <div className="absolute -top-[5px] md:-top-[7px] left-1/2 w-2 md:w-3 h-2 md:h-3 rounded-full bg-gray-400 -translate-x-1/2"></div>
                    {['기본계획팀', '역량강화팀', '홍보마케팅팀', '경영전략팀'].map((dept, idx) => (
                      <div key={idx} className="bg-white w-[45%] sm:w-40 md:w-44 flex flex-col items-center p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform hover:-translate-y-2 transition-all duration-500 border-t-4 border-[#85C441] group">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-[#0B2053] group-hover:bg-[#85C441] group-hover:text-white transition-colors duration-300">
                          <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="font-bold text-gray-800 text-sm md:text-base text-center group-hover:text-[#0B2053] transition-colors">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 연혁 탭 */}
            {aboutTab === 'history' && (
              <div className="reveal">
                <div className="text-center mb-10 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">회사연혁</h2>
                  <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
                </div>
                <div className="relative border-l-[3px] border-gray-100 ml-2 md:ml-10 space-y-12 md:space-y-20 py-4 md:py-8">
                  {historyData.map((item, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-20 group reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                      <div className="absolute -left-[9px] md:-left-[11px] top-1 w-4 md:w-5 h-4 md:h-5 bg-white border-[3px] md:border-4 border-[#85C441] rounded-full shadow-sm group-hover:scale-150 group-hover:bg-[#85C441] transition-all duration-300"></div>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-16 items-start">
                        <h3 className="text-3xl md:text-4xl font-black text-[#0B2053] w-24 md:w-28 shrink-0 tracking-tighter group-hover:text-[#85C441] transition-colors">{item.year}</h3>
                        <ul className="space-y-3 md:space-y-5 pt-1 md:pt-2">
                          {item.events.map((event, eIdx) => (
                            <li key={eIdx} className="text-gray-600 font-light flex items-start gap-2 md:gap-3 text-sm md:text-lg hover:text-gray-900 transition-colors">
                              <span className="text-[#85C441] mt-[2px] md:mt-1 shrink-0"><CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" /></span>
                              <span className="leading-snug md:leading-tight">{event}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 지앤비소식 탭 */}
            {aboutTab === 'news' && (
              <div className="reveal">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-6">
                  <div className="w-full md:w-auto md:flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">지앤비소식</h2>
                    <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto md:mx-0 rounded-full"></div>
                  </div>
                  {ENABLE_DEMO_CONTENT_FORMS && (
                    <SweepButton onClick={() => openModal('authType', 'news')} icon={Plus} className="bg-[#0B2053] text-white px-6 py-3 rounded-full text-sm md:text-base self-end md:self-auto shadow-md">
                      소식 등록하기
                    </SweepButton>
                  )}
                </div>

                <div className="space-y-4">
                  {newsData.map((news, idx) => (
                    <div key={news.id} onClick={() => openModal('news', news)} className="reveal bg-white p-6 md:p-8 rounded-2xl md:rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-[#0B2053] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group" style={{ transitionDelay: `${idx * 0.1}s` }}>
                      <div className="w-full">
                        <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-bold transition-colors ${news.type === '공지' ? 'bg-[#85C441]/20 text-[#85C441] group-hover:bg-[#85C441] group-hover:text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#0B2053] group-hover:text-white'}`}>
                            {news.type}
                          </span>
                          <span className="text-xs md:text-sm text-gray-400 font-medium flex items-center gap-1 group-hover:text-gray-500">
                            <Calendar size={14} className="md:w-4 md:h-4" /> {news.date}
                          </span>
                        </div>
                        <h3 className="text-base md:text-xl font-bold text-gray-900 group-hover:text-[#0B2053] transition-colors leading-snug break-keep pr-4">{news.title}</h3>
                      </div>
                      <div className="flex items-center justify-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                        <button className="text-[#0B2053] font-bold flex items-center gap-1 group-hover:text-[#85C441] transition-colors text-sm md:text-base whitespace-nowrap overflow-hidden relative">
                          <span className="relative z-10 flex items-center gap-1">내용 보기 <ArrowRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" /></span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {newsData.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      등록된 소식이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- [PageAbout 영역 모달 폼들] --- */}

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.authType === 'news' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('authType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Lock size={18} className="text-[#85C441]" /> 관리자 인증</h3>
                <button onClick={() => closeModal('authType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleNewsAuthSubmit} className="p-6 md:p-8 space-y-6">
                <p className="text-sm text-gray-600 break-keep text-center">소식 등록은 관리자만 가능합니다.<br/>고유 패스워드를 입력해주세요. (임시: 1234)</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="패스워드 입력" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] text-center tracking-widest text-lg" />
                <button type="submit" className="w-full bg-[#85C441] text-white py-3.5 rounded-xl font-bold hover:bg-[#75ad39] transition-colors">인증하기</button>
              </form>
            </div>
          </div>
        )}

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.uploadType === 'news' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('uploadType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade flex flex-col max-h-[90vh]">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center shrink-0">
                <h3 className="font-bold flex items-center gap-2"><Plus size={18} className="text-[#85C441]" /> 지앤비소식 등록</h3>
                <button onClick={() => closeModal('uploadType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleNewsUploadSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">분류 <span className="text-red-500">*</span></label>
                    <select value={newsUploadType} onChange={(e) => setNewsUploadType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]">
                      <option>공지</option><option>소식</option><option>자료</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-700 mb-2">제목 <span className="text-red-500">*</span></label>
                    <input type="text" required value={newsUploadTitle} onChange={(e) => setNewsUploadTitle(e.target.value)} placeholder="제목을 입력하세요" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">상세 내용 <span className="text-red-500">*</span></label>
                  <textarea rows="8" required value={newsUploadContent} onChange={(e) => setNewsUploadContent(e.target.value)} placeholder="소식 내용을 상세히 입력하세요." className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#85C441] text-white py-4 rounded-xl font-bold hover:bg-[#75ad39] transition-colors mt-6 shadow-md flex justify-center items-center gap-2">
                  <Send size={18} /> 소식 등록 완료
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 페이지: 사업영역 ---
  const PageBusiness = () => {
    const businessAreas = [
      { title: "기본계획", desc: "인구감소와 지역소멸 문제에 대응하여 농어촌과 농어업인의 생활 여건 및 정책 환경을 종합적으로 진단하고 정주 환경, 생활 SOC, 복지·교육·문화 인프라를 연계한 중·장기 지역 발전 전략을 수립합니다.", project: "부안군 어촌신활력증진사업(유형1) 예비계획수립 등", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop" },
      { title: "역량강화", desc: "지역의 인적 자원과 운영 구조를 고려하여 교육·훈련, 학습모임, 포럼을 체계적으로 설계·운영합니다. 주민 주도의 지역 운영 역량과 사업 기획·실행 능력을 강화하여 지역의 자생력을 높입니다.", project: "인천 중구 덕교항 어촌뉴딜 300 지역역량강화 사업 등", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" },
      { title: "컨설팅", desc: "중장기 지도 사업과 지역 현장 조사·데이터 분석을 기반으로 지역 여건과 문제를 정밀하게 진단합니다. 정부·지자체 지원사업과 연계하여 실행 중심의 전문 컨설팅을 제공합니다.", project: "가평군 농촌진흥 중장기 지도사업 연구 등", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop" },
      { title: "홍보·마케팅", desc: "지역 특산물과 지역 자원의 경쟁력 및 시장성을 종합적으로 분석하여 브랜드 개발, 콘텐츠 기획·제작, 통합 마케팅을 추진함으로써 지역 브랜드 정체성을 구축합니다.", project: "충남 서천군 한산모시 고유가치 제고 홍보마케팅 등", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" }
    ];

    return (
      <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
        <SubpageHero title="사업영역" subtitle="Business Areas" bgImage="https://images.unsplash.com/photo-1494587416117-f102a2ac0a8d?q=80&w=2070&auto=format&fit=crop" />
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 space-y-20 md:space-y-32">
          <div className="text-center mb-8 md:mb-16 reveal">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">주요사업소개</h2>
            <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
          </div>
          {businessAreas.map((area, idx) => (
            <div key={idx} className={`reveal flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 md:gap-12 lg:gap-24`}>
              <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] shadow-xl md:shadow-2xl group relative">
                <div className="absolute inset-0 bg-[#0B2053]/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                <img src={area.img} alt={area.title} className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <span className="text-4xl md:text-6xl font-black text-gray-200 select-none">0{idx + 1}</span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#0B2053]">{area.title}</h3>
                    <div className="w-8 md:w-10 h-1 bg-[#85C441] mt-2 md:mt-3"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-light break-keep">{area.desc}</p>
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 md:gap-5 hover:shadow-md transition-shadow group cursor-default">
                  <div className="bg-blue-50 p-3 md:p-3.5 rounded-xl md:rounded-2xl text-[#0B2053] shrink-0 group-hover:bg-[#0B2053] group-hover:text-white transition-colors"><FileText size={20} className="md:w-6 md:h-6" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-lg">대표 수행사업</h4>
                    <p className="text-gray-600 text-xs md:text-[15px]">{area.project}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 페이지: 사업실적 ---
  const PagePerformance = () => {
    const [password, setPassword] = useState('');
    const [selectedProjectTag, setSelectedProjectTag] = useState('전체');
    const [uploadTag, setUploadTag] = useState('컨설팅');
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadPeriod, setUploadPeriod] = useState('');
    const [uploadClient, setUploadClient] = useState('');
    const [uploadContent, setUploadContent] = useState('');
    const [uploadThumbPreview, setUploadThumbPreview] = useState(null);
    const [uploadDetailPreview, setUploadDetailPreview] = useState(null);

    const performanceTab = currentTab || 'list';
    const projectCategories = ['전체', ...new Set(projectsData.map((project) => project.tag))];
    const filteredProjectsData = selectedProjectTag === '전체'
      ? projectsData
      : projectsData.filter((project) => project.tag === selectedProjectTag);
    const displayPartnersData = Array.isArray(partnersData) && partnersData.length > 0 ? partnersData : DEFAULT_PARTNERS_DATA;

    const handleAuthSubmit = (e) => {
      e.preventDefault();
      if (password === '1234') { closeModal('authType'); setPassword(''); openModal('uploadType', 'project'); }
      else alert('비밀번호가 일치하지 않습니다.');
    };

    const handleUploadSubmit = (e) => {
      e.preventDefault();
      if (!uploadTitle || !uploadThumbPreview || !uploadDetailPreview) return alert('모든 필수 항목과 이미지를 첨부해주세요.');
      const newItem = {
        id: Date.now(), tag: uploadTag, title: uploadTitle, thumbImg: uploadThumbPreview, period: uploadPeriod, client: uploadClient,
        content: uploadContent.split('\n').filter(line => line.trim() !== ''), detailImg: uploadDetailPreview
      };
      setProjectsData([newItem, ...projectsData]);
      closeModal('uploadType');
      setUploadTitle(''); setUploadPeriod(''); setUploadClient(''); setUploadContent(''); setUploadThumbPreview(null); setUploadDetailPreview(null);
      alert('사업실적이 성공적으로 등록되었습니다.');
    };

    return (
      <div className="animate-fade-in bg-white min-h-screen pb-20">
        <SubpageHero title="사업실적" subtitle="Project Performance" bgImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" />
        <TabMenu tabs={navItems[2].tabs} activeTab={performanceTab} onTabChange={setCurrentTab} />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div key={performanceTab} className="tab-content-enter">
            {performanceTab === 'list' && (
              <div>
                 <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-6">
                  <div className="w-full md:w-auto md:flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">주요사업실적</h2>
                    <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto md:mx-0 rounded-full mb-6 md:mb-8"></div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                      {projectCategories.map((tag) => (
                        <button type="button" key={tag} onClick={() => setSelectedProjectTag(tag)} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-[15px] font-medium transition-colors ${selectedProjectTag === tag ? 'bg-[#0B2053] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm md:text-base text-gray-500 font-medium">
                      {selectedProjectTag === '전체'
                        ? `전체 ${projectsData.length}개 사업을 한 번에 보고 있습니다.`
                        : `${selectedProjectTag} 카테고리 사업 ${filteredProjectsData.length}개를 보고 있습니다.`}
                    </p>
                  </div>
                  {ENABLE_DEMO_CONTENT_FORMS && (
                    <SweepButton onClick={() => openModal('authType', 'project')} icon={Plus} className="bg-[#0B2053] text-white px-6 py-3 rounded-full text-sm md:text-base self-end md:self-auto mt-4 md:mt-0 shadow-md">
                      실적 등록하기
                    </SweepButton>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProjectsData.map((proj) => (
                    <div key={proj.id} onClick={() => openModal('project', proj)} className="bg-white rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer border border-gray-100 hover:border-[#85C441]/50 hover:-translate-y-2">
                      <div className="relative h-56 md:h-64 overflow-hidden">
                        <img src={proj.thumbImg} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold text-[#0B2053] shadow-sm">{proj.tag}</div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white border-[2px] border-white/80 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold tracking-wider backdrop-blur-sm hover:bg-white hover:text-[#0B2053] transition-colors text-sm md:text-base transform scale-95 group-hover:scale-100">자세히 보기</span>
                        </div>
                      </div>
                      <div className="p-5 md:p-7 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#0B2053] transition-colors line-clamp-2 leading-tight relative z-10">
                          {proj.title}
                        </h3>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs md:text-[15px] font-medium text-gray-500 relative z-10">
                          <span>{proj.client}</span>
                          <ArrowRight size={16} className="text-[#85C441] group-hover:translate-x-1 transition-transform md:w-[18px] md:h-[18px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {isSiteContentConfigured && filteredProjectsData.length === 0 && (
                  <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500">
                    현재 등록된 사업실적이 없습니다.
                  </div>
                )}
              </div>
            )}

            {performanceTab === 'partners' && (
              <div className="reveal text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">주요파트너십</h2>
                <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full mb-10 md:mb-12"></div>
                <p className="text-lg md:text-xl text-gray-600 font-light mb-10 md:mb-16">"함께 만들어가는 미래, <strong className="font-bold text-[#0B2053]">견고한 신뢰</strong>로 이어집니다."</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {displayPartnersData.map((partner, idx) => (
                    <div key={partner.id} className="reveal bg-white border border-gray-100 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center h-20 md:h-28 grayscale hover:grayscale-0 cursor-pointer overflow-hidden" style={{ transitionDelay: `${(idx % 5) * 0.1}s` }}>
                      <img src={partner.logoUrl} alt={partner.name} className="max-h-full" onError={(e) => { e.currentTarget.src = DEFAULT_PARTNERS_DATA[idx % DEFAULT_PARTNERS_DATA.length].logoUrl; }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.authType === 'project' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('authType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Lock size={18} className="text-[#85C441]" /> 관리자 인증</h3>
                <button onClick={() => closeModal('authType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleAuthSubmit} className="p-6 md:p-8 space-y-6">
                <p className="text-sm text-gray-600 break-keep text-center">실적 등록은 관리자만 가능합니다.<br/>고유 패스워드를 입력해주세요. (임시: 1234)</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="패스워드 입력" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] text-center tracking-widest text-lg" />
                <button type="submit" className="w-full bg-[#85C441] text-white py-3.5 rounded-xl font-bold hover:bg-[#75ad39] transition-colors">인증하기</button>
              </form>
            </div>
          </div>
        )}

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.uploadType === 'project' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('uploadType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade flex flex-col max-h-[90vh]">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center shrink-0">
                <h3 className="font-bold flex items-center gap-2"><UploadCloud size={18} className="text-[#85C441]" /> 사업실적 등록</h3>
                <button onClick={() => closeModal('uploadType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleUploadSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">분류 태그 <span className="text-red-500">*</span></label>
                    <select value={uploadTag} onChange={(e) => setUploadTag(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]">
                      <option>컨설팅</option><option>기본계획</option><option>역량강화</option><option>홍보·마케팅</option><option>기타사업</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">사업명 (제목) <span className="text-red-500">*</span></label>
                    <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="예: 양주시 쌀교육농장 컨설팅" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">사업기간</label>
                    <input type="text" value={uploadPeriod} onChange={(e) => setUploadPeriod(e.target.value)} placeholder="예: 2024년 3월 ~ 2024년 10월" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">발주기관</label>
                    <input type="text" value={uploadClient} onChange={(e) => setUploadClient(e.target.value)} placeholder="예: 양주시 농업기술센터" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">사업내용 <span className="text-gray-400 text-xs font-normal ml-2">(줄바꿈으로 항목 구분)</span></label>
                  <textarea rows="3" value={uploadContent} onChange={(e) => setUploadContent(e.target.value)} placeholder="예:&#10;치유농업 프로그램 기획&#10;주민 역량강화 교육" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">리스트 썸네일 <span className="text-red-500">*</span></label>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && setUploadThumbPreview(URL.createObjectURL(e.target.files[0]))} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#85C441]/10 file:text-[#0B2053] cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">상세 페이지 이미지 <span className="text-red-500">*</span></label>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && setUploadDetailPreview(URL.createObjectURL(e.target.files[0]))} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#85C441]/10 file:text-[#0B2053] cursor-pointer" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#85C441] text-white py-4 rounded-xl font-bold hover:bg-[#75ad39] transition-colors mt-6 shadow-md flex justify-center items-center gap-2">
                  <Send size={18} /> 실적 등록 완료
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 페이지: 채용정보 ---
  const PageRecruit = () => {
    const [password, setPassword] = useState('');
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadState, setUploadState] = useState('채용중');
    const [uploadDate, setUploadDate] = useState('');
    const [uploadType, setUploadType] = useState('정규직');
    const [uploadContent, setUploadContent] = useState('');

    const recruitTab = currentTab === 'notice' ? 'notice' : 'info';

    const handleAuthSubmit = (e) => {
      e.preventDefault();
      if (password === '1234') { closeModal('authType'); setPassword(''); openModal('uploadType', 'recruit'); }
      else alert('비밀번호가 일치하지 않습니다.');
    };

    const handleUploadSubmit = (e) => {
      e.preventDefault();
      if (!uploadTitle || !uploadContent) return alert('필수 항목을 모두 입력해주세요.');
      const newItem = {
        id: Date.now(), title: uploadTitle, state: uploadState, date: uploadDate || '상시채용', type: uploadType, content: uploadContent
      };
      setRecruitData([newItem, ...recruitData]);
      closeModal('uploadType');
      setUploadTitle(''); setUploadDate(''); setUploadContent(''); setUploadState('채용중'); setUploadType('정규직');
      alert('채용공고가 성공적으로 등록되었습니다.');
    };

    return (
      <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
        <SubpageHero title="채용정보" subtitle="Recruit" bgImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop" />
        <TabMenu tabs={navItems.find(item => item.id === 'recruit').tabs} activeTab={recruitTab} onTabChange={setCurrentTab} />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div key={recruitTab} className="tab-content-enter">
            {/* 인재상 및 복지제도 통합 탭 */}
            {recruitTab === 'info' && (
              <div className="reveal space-y-24 md:space-y-32">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">지앤비플래닝이 원하는 인재</h2>
                  <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full mb-12 md:mb-16"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {[{icon: Target, title: '도전적 인재', desc: '변화를 두려워하지 않고 새로운 가치를 창출하기 위해 끊임없이 도전하는 인재'},
                      {icon: Heart, title: '협력적 인재', desc: '상호 존중과 소통을 바탕으로 팀워크를 발휘하며 함께 성장하는 인재'},
                      {icon: Award, title: '전문적 인재', desc: '해당 분야의 최고가 되기 위해 지속적으로 학습하고 전문성을 갖춘 인재'}].map((item, idx) => (
                      <div key={idx} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group border border-gray-100">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50/50 text-[#0B2053] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0B2053] group-hover:text-white transition-colors duration-300 shadow-sm">
                          <item.icon size={36} className="md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">{item.title}</h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed break-keep">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">임직원을 위한 복지제도</h2>
                  <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full mb-12 md:mb-16"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {[{ icon: Clock, title: '유연근무제', desc: '자율적인 출퇴근 시간' }, { icon: Laptop, title: '최신 장비 지원', desc: '업무 효율 향상' }, { icon: Coffee, title: '간식/음료 제공', desc: '휴게 공간 운영' }, { icon: Award, title: '자기계발 지원', desc: '교육 및 도서비' }, { icon: Heart, title: '건강검진 지원', desc: '종합 검진 지원' }, { icon: CheckCircle2, title: '리프레시 휴가', desc: '장기 근속 포상' }, { icon: Users, title: '동호회 지원', desc: '사내 소통 활성화' }, { icon: Building2, title: '경조사 지원', desc: '경조금 및 휴가' }].map((item, idx) => (
                      <div key={idx} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:border-[#85C441] hover:-translate-y-1 transition-all duration-300">
                        <item.icon size={28} className="text-[#85C441] mb-3 md:mb-4 md:w-8 md:h-8" />
                        <h4 className="font-bold text-gray-900 mb-1.5 md:mb-2 text-sm md:text-base">{item.title}</h4>
                        <p className="text-xs md:text-sm text-gray-500 break-keep">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 채용공고 탭 */}
            {recruitTab === 'notice' && (
              <div className="reveal max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-6">
                  <div className="w-full md:w-auto md:flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">채용공고</h2>
                    <div className="w-10 md:w-12 h-1.5 bg-[#85C441] mx-auto rounded-full"></div>
                  </div>
                  {ENABLE_DEMO_CONTENT_FORMS && (
                    <SweepButton onClick={() => openModal('authType', 'recruit')} icon={Plus} className="bg-[#0B2053] text-white px-6 py-3 rounded-full text-sm md:text-base self-end md:self-auto shadow-md">
                      공고 등록하기
                    </SweepButton>
                  )}
                </div>

                <div className="space-y-4 md:space-y-6">
                  {recruitData.map((job) => (
                    <div key={job.id} onClick={() => openModal('recruitDetail', job)} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#0B2053] hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group">
                      <div className="w-full">
                        <div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                          <span className={`px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[11px] md:text-xs font-bold ${job.state === '채용중' ? 'bg-[#85C441] text-white' : 'bg-gray-200 text-gray-500'}`}>{job.state}</span>
                          <span className="text-xs md:text-sm text-gray-500 font-medium">{job.type}</span>
                        </div>
                        <h3 className="text-base md:text-xl font-bold text-gray-900 group-hover:text-[#0B2053] transition-colors leading-snug break-keep pr-4">{job.title}</h3>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 shrink-0">
                        <div className="text-gray-500 text-xs md:text-sm flex items-center gap-1.5"><Calendar size={14} className="md:w-4 md:h-4" /> 마감일: {job.date}</div>
                        <button className="text-[#0B2053] font-medium flex items-center gap-1 group-hover:text-[#85C441] transition-colors text-xs md:text-sm whitespace-nowrap">상세보기 <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" /></button>
                      </div>
                    </div>
                  ))}
                  {recruitData.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      현재 등록된 채용공고가 없습니다.
                    </div>
                  )}
                </div>
                
                <div className="mt-12 md:mt-16 bg-[#0B2053] p-8 md:p-12 rounded-2xl md:rounded-[2rem] text-center text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">인재풀 등록</h3>
                    <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base break-keep leading-relaxed">
                      원하시는 포지션이 당장 없으시더라도 이력서를 등록해주시면,<br className="hidden md:block" />
                      적합한 포지션이 열릴 때 가장 먼저 연락드리겠습니다.
                    </p>
                    <button onClick={() => setIsContactModalOpen(true)} className="bg-[#85C441] text-white px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold hover:bg-[#75ad39] transition-colors shadow-lg shadow-[#85C441]/30 text-sm md:text-base inline-flex items-center gap-2">
                      이력서 간편 등록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- [PageRecruit 영역 모달 폼들] --- */}
        {activeModal.recruitDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-[#0B2053]/90 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer z-0" onClick={() => closeModal('recruitDetail')}></div>
            <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl max-w-3xl relative z-10 shadow-2xl flex flex-col animate-modal-spring">
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center z-50 md:hidden shadow-sm">
                <span className="font-bold text-[#0B2053] truncate pr-4">채용공고 상세</span>
                <button onClick={() => closeModal('recruitDetail')} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
              </div>
              <button onClick={() => closeModal('recruitDetail')} className="hidden md:flex absolute top-6 right-6 w-12 h-12 bg-white border border-gray-100 shadow-md rounded-full items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-all z-50"><X size={24} /></button>
              
              <div className="overflow-y-auto px-6 py-8 md:px-12 md:py-12 flex-1 scroll-smooth">
                <div className="text-left mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-8">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeModal.recruitDetail.state === '채용중' ? 'bg-[#85C441] text-white' : 'bg-gray-200 text-gray-600'}`}>{activeModal.recruitDetail.state}</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0B2053] border border-blue-100">{activeModal.recruitDetail.type}</span>
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1 md:ml-2"><Calendar size={14} /> 마감일: {activeModal.recruitDetail.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight break-keep">{activeModal.recruitDetail.title}</h2>
                </div>
                
                <div className="text-gray-700 leading-relaxed text-base md:text-lg break-keep whitespace-pre-wrap min-h-[200px]">
                  {activeModal.recruitDetail.content}
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-100 text-center flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => { closeModal('recruitDetail'); setIsContactModalOpen(true); }} className="bg-[#85C441] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#75ad39] transition-colors shadow-md text-sm md:text-base flex items-center justify-center gap-2">
                    <Send size={18} /> 지원하기 (이력서 제출)
                  </button>
                  <button onClick={() => closeModal('recruitDetail')} className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm text-sm md:text-base">
                    목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.authType === 'recruit' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('authType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Lock size={18} className="text-[#85C441]" /> 관리자 인증</h3>
                <button onClick={() => closeModal('authType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleAuthSubmit} className="p-6 md:p-8 space-y-6">
                <p className="text-sm text-gray-600 break-keep text-center">공고 등록은 관리자만 가능합니다.<br/>고유 패스워드를 입력해주세요. (임시: 1234)</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="패스워드 입력" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] text-center tracking-widest text-lg" />
                <button type="submit" className="w-full bg-[#85C441] text-white py-3.5 rounded-xl font-bold hover:bg-[#75ad39] transition-colors">인증하기</button>
              </form>
            </div>
          </div>
        )}

        {ENABLE_DEMO_CONTENT_FORMS && activeModal.uploadType === 'recruit' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={() => closeModal('uploadType')}></div>
            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-slide-up-fade flex flex-col max-h-[90vh]">
              <div className="bg-[#0B2053] p-5 text-white flex justify-between items-center shrink-0">
                <h3 className="font-bold flex items-center gap-2"><Plus size={18} className="text-[#85C441]" /> 채용공고 등록</h3>
                <button onClick={() => closeModal('uploadType')} className="hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleUploadSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">진행 상태 <span className="text-red-500">*</span></label>
                    <select value={uploadState} onChange={(e) => setUploadState(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]">
                      <option>채용중</option>
                      <option>마감</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">고용 형태 <span className="text-red-500">*</span></label>
                    <input type="text" required value={uploadType} onChange={(e) => setUploadType(e.target.value)} placeholder="예: 정규직, 계약직" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">공고명 (제목) <span className="text-red-500">*</span></label>
                    <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="예: [정책연구실] 연구원 모집" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">마감일 <span className="text-gray-400 text-xs font-normal ml-2">(미입력시 '상시채용')</span></label>
                    <input type="text" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} placeholder="예: 2025.12.31" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">상세 모집요강 <span className="text-red-500">*</span></label>
                  <textarea rows="6" required value={uploadContent} onChange={(e) => setUploadContent(e.target.value)} placeholder="담당업무, 자격요건, 우대사항 등을 상세히 적어주세요." className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#85C441] resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#85C441] text-white py-4 rounded-xl font-bold hover:bg-[#75ad39] transition-colors mt-6 shadow-md flex justify-center items-center gap-2">
                  <Send size={18} /> 채용공고 등록 완료
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-800 break-keep selection:bg-[#85C441] selection:text-white bg-gray-50" style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: "-0.02em" }}>
      
      {/* 동적 CSS 애니메이션 및 눈누 폰트(Pretendard) 로드 */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }

        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        
        @keyframes slide-up-fade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slide-up-fade { animation: slide-up-fade 0.5s ease-out forwards; }

        @keyframes sweep-right { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        .animate-sweep-right { transform-origin: left; animation: sweep-right 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        @keyframes modal-spring { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modal-spring { animation: modal-spring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        
        @keyframes subtle-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-subtle-zoom { animation: subtle-zoom 20s infinite alternate ease-in-out; }
        
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); will-change: transform, opacity; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        .tab-content-enter { animation: fade-in-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        /* 메인 페이지 스냅은 부드럽게만 보조하고, 강제 고정은 피합니다. */
        .snap-container {
            scroll-snap-type: y proximity;
            overflow-y: auto;
            overscroll-behavior-y: contain;
        }
        .snap-section {
            scroll-snap-align: start;
            scroll-snap-stop: normal;
            overflow: hidden;
        }

        @media (max-width: 1023px) {
          .snap-container {
            scroll-snap-type: none;
          }

          .snap-section {
            scroll-snap-align: none;
          }
        }
      `}} />

      {/* [중요 수정] 헤더 높이를 고정(72px)하고 배경/그림자만 애니메이션하여 레이아웃 흔들림 방지 */}
      <header className={`fixed w-full top-0 z-[90] h-[72px] flex items-center transition-all duration-500 ${scrolled || currentPage !== 'main' ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex justify-between items-center relative z-20">
          <div className="cursor-pointer flex items-center gap-1.5 md:gap-2 group" onClick={() => navigateTo('main')}>
            <span className={`font-black tracking-tighter transition-all duration-500 ${scrolled || currentPage !== 'main' ? 'text-[#0B2053] text-xl md:text-2xl' : 'text-white drop-shadow-md text-2xl md:text-3xl'}`}>
              g<span className="text-[#85C441] group-hover:text-white transition-colors">&</span>b
            </span>
            <span className={`font-bold transition-all duration-500 mt-1 md:mt-1.5 ${scrolled || currentPage !== 'main' ? 'text-gray-500 text-xs md:text-sm' : 'text-white/80 drop-shadow-md text-sm md:text-base'}`}>Planning</span>
          </div>

          <nav className="hidden lg:flex gap-10 items-center">
            {navItems.map((item) => (
              <div key={item.id} className="relative group py-2">
                <button onClick={() => navigateTo(item.id, item.tabs ? item.tabs[0].id : '')} className={`font-semibold text-[16px] transition-colors relative ${currentPage === item.id ? 'text-[#85C441]' : (scrolled || currentPage !== 'main' ? 'text-gray-800 hover:text-[#85C441]' : 'text-white hover:text-[#85C441] drop-shadow-sm')}`}>
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#85C441] transition-all duration-300 ${currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              </div>
            ))}
            <SweepButton onClick={() => setIsContactModalOpen(true)} className={`ml-4 px-5 py-2.5 rounded-full text-sm font-bold border ${scrolled || currentPage !== 'main' ? 'bg-[#0B2053] border-transparent text-white' : 'bg-white/10 border-white/30 text-white backdrop-blur-sm'}`}>
              프로젝트 문의
            </SweepButton>
          </nav>
          <button className="lg:hidden p-2 -mr-2 relative z-20" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className={scrolled || currentPage !== 'main' ? 'text-[#0B2053]' : 'text-white drop-shadow-md'} size={26} />
          </button>
        </div>
      </header>

      {/* 모바일 팝업 드로어 메뉴 */}
      <div className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-[75%] max-w-[320px] h-[100dvh] bg-gray-50 shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tighter text-[#0B2053]">g<span className="text-[#85C441]">&</span>b</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500 p-1 -mr-1 transition-colors">
              <X size={26} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-1 gap-3">
              {navItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-row items-center gap-4 active:scale-[0.98] transition-all hover:border-[#85C441] hover:shadow-md cursor-pointer group" onClick={() => navigateTo(item.id, item.tabs ? item.tabs[0].id : '')}>
                  <div className="bg-blue-50 p-3 rounded-xl text-[#0B2053] group-hover:bg-[#0B2053] group-hover:text-white transition-colors">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-gray-900 text-[15px]">{item.label}</span>
                  <ChevronRight size={18} className="ml-auto text-gray-300 group-hover:text-[#85C441] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-white border-t border-gray-100 shrink-0">
            <button onClick={() => {setIsMobileMenuOpen(false); setIsContactModalOpen(true);}} className="w-full bg-[#85C441] text-white py-3.5 rounded-xl font-bold text-sm mb-3 flex justify-center items-center gap-2 shadow-md hover:bg-[#75ad39] transition-colors">
              <MessageSquare size={18} /> 프로젝트 문의
            </button>
            <div className="bg-[#0B2053] rounded-xl p-4 text-white text-center shadow-lg">
               <Phone size={18} className="mx-auto text-[#85C441] mb-1.5" />
               <p className="text-lg font-black tracking-wider">02-458-3248</p>
            </div>
          </div>
        </div>
      </div>

      <main className="pt-0 relative z-0 bg-white">
        {currentPage === 'main' && <PageMain />}
        {currentPage === 'about' && <PageAbout />}
        {currentPage === 'business' && <PageBusiness />}
        {currentPage === 'performance' && <PagePerformance />}
        {currentPage === 'gallery' && (
          <GalleryPage
            hero={<SubpageHero title="갤러리" subtitle="Gallery" bgImage={buildAppAssetUrl('images/gallery/g01.jpg')} />}
            galleryData={galleryData}
            setGalleryData={setGalleryData}
            activeModal={activeModal}
            openModal={openModal}
            closeModal={closeModal}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'recruit' && <PageRecruit />}
        {currentPage === 'directions' && (
          <DirectionsPage
            hero={<SubpageHero title="오시는 길" subtitle="Directions" bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" />}
          />
        )}
      </main>

      <SiteFooter />

      <div className={`fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[70] flex flex-col gap-2 md:gap-3 transition-all duration-700 ${currentPage === 'gallery' ? 'hidden' : ''} ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <button onClick={() => setIsContactModalOpen(true)} className="w-12 h-12 md:w-14 md:h-14 bg-[#85C441] text-white rounded-full shadow-lg shadow-[#85C441]/30 flex items-center justify-center hover:scale-110 hover:bg-[#75ad39] transition-all duration-300 group relative">
          <MessageSquare size={20} className="md:w-6 md:h-6" />
        </button>
        <button onClick={scrollToTop} className="w-12 h-12 md:w-14 md:h-14 bg-white border border-gray-100 text-[#0B2053] rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-gray-50 transition-all duration-300 group relative">
          <ArrowUp size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* 1. 지앤비플래닝 소식 상세 모달 (공통) */}
      {activeModal.news && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-[#0B2053]/90 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 cursor-pointer z-0" onClick={() => closeModal('news')}></div>
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl max-w-3xl relative z-10 shadow-2xl flex flex-col animate-slide-up-fade">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center z-50 md:hidden">
              <span className="font-bold text-[#0B2053] truncate pr-4">소식 상세보기</span>
              <button onClick={() => closeModal('news')} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <button onClick={() => closeModal('news')} className="hidden md:flex absolute top-6 right-6 w-12 h-12 bg-white border border-gray-100 shadow-md rounded-full items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-all z-50"><X size={24} /></button>
            <div className="overflow-y-auto px-6 py-8 md:px-12 md:py-12 flex-1 scroll-smooth">
              <div className="text-left mb-8 md:mb-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeModal.news.type === '공지' ? 'bg-[#85C441] text-white' : 'bg-gray-200 text-gray-600'}`}>{activeModal.news.type}</span>
                  <span className="text-sm text-gray-400 font-medium flex items-center gap-1"><Calendar size={14} /> {activeModal.news.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 pb-4 md:pb-6 border-b-2 border-gray-100 leading-tight break-keep">{activeModal.news.title}</h2>
              </div>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg break-keep whitespace-pre-wrap min-h-[150px]">{activeModal.news.content}</div>
              <div className="mt-12 pt-6 border-t border-gray-100 text-center">
                <button onClick={() => closeModal('news')} className="bg-[#0B2053] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3673] transition-colors shadow-md text-sm md:text-base">닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 주요사업실적 상세 모달 (공통) */}
      {activeModal.project && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-[#0B2053]/90 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 cursor-pointer z-0" onClick={() => closeModal('project')}></div>
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl max-w-4xl relative z-10 shadow-2xl flex flex-col animate-modal-spring">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center z-50">
              <span className="font-bold text-[#0B2053] truncate pr-4">{activeModal.project.title}</span>
              <button onClick={() => closeModal('project')} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="overflow-y-auto p-6 md:p-10 flex-1 scroll-smooth" ref={projectModalScrollRef}>
              <div className="mb-6 md:mb-8">
                <span className="inline-block px-3 py-1 bg-[#85C441] text-white rounded-full text-xs font-bold mb-4">{activeModal.project.tag}</span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 break-keep">{activeModal.project.title}</h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-600">
                  <p><strong className="text-gray-900">발주처:</strong> {activeModal.project.client}</p>
                  <p><strong className="text-gray-900">사업기간:</strong> {activeModal.project.period}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">주요 사업내용</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  {activeModal.project.content.map((txt, i) => <li key={i}>{txt}</li>)}
                </ul>
              </div>
              <div className="w-full">
                <img src={activeModal.project.detailImg} alt="상세 이미지" className="w-full h-auto rounded-xl shadow-sm object-cover bg-gray-100 min-h-[200px]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 최상단 공통 프로젝트 문의하기 모달 --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 cursor-pointer hidden md:block" onClick={closeContactModal}></div>
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl max-w-2xl relative z-10 shadow-2xl animate-slide-up-fade flex flex-col">
            <div className="bg-[#0B2053] p-5 md:p-6 text-white flex justify-between items-center shrink-0 md:rounded-t-3xl">
              <div>
                <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                  <MessageSquare size={20} className="md:w-6 md:h-6 text-[#85C441]" /> 프로젝트 문의하기
                </h3>
                <p className="text-gray-300 text-xs md:text-sm mt-1">지앤비플래닝 전문가가 신속하게 답변해 드립니다.</p>
              </div>
              <button onClick={closeContactModal} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <form className="space-y-5 md:space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">담당자 성함 <span className="text-red-500">*</span></label>
                    <input type="text" value={contactForm.contactName} onChange={(event) => handleContactFieldChange('contactName', event.target.value)} required className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all text-sm md:text-base" placeholder="홍길동" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">기관/기업명 <span className="text-red-500">*</span></label>
                    <input type="text" value={contactForm.companyName} onChange={(event) => handleContactFieldChange('companyName', event.target.value)} required className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all text-sm md:text-base" placeholder="(주)지앤비플래닝" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">연락처 <span className="text-red-500">*</span></label>
                    <input type="tel" value={contactForm.phone} onChange={(event) => handleContactFieldChange('phone', event.target.value)} required className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all text-sm md:text-base" placeholder="010-0000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">이메일 <span className="text-red-500">*</span></label>
                    <input type="email" value={contactForm.email} onChange={(event) => handleContactFieldChange('email', event.target.value)} required className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all text-sm md:text-base" placeholder="example@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">문의 분야</label>
                  <select value={contactForm.inquiryType} onChange={(event) => handleContactFieldChange('inquiryType', event.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all text-gray-600 appearance-none text-sm md:text-base">
                    {CONTACT_INQUIRY_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 md:mb-2">상세 문의내용 <span className="text-red-500">*</span></label>
                  <textarea value={contactForm.message} onChange={(event) => handleContactFieldChange('message', event.target.value)} required rows="4" className="w-full bg-gray-50 border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-[#85C441] focus:ring-1 focus:ring-[#85C441] transition-all resize-none text-sm md:text-base" placeholder="문의하실 내용을 상세히 적어주세요."></textarea>
                </div>
                <div className="flex items-start gap-2 pt-1 md:pt-2">
                  <input type="checkbox" id="privacy" checked={contactForm.privacyConsented} onChange={(event) => handleContactFieldChange('privacyConsented', event.target.checked)} required className="mt-0.5 md:mt-1 w-4 h-4 text-[#85C441] border-gray-300 rounded focus:ring-[#85C441]" />
                  <label htmlFor="privacy" className="text-xs md:text-sm text-gray-500 cursor-pointer break-keep">
                    개인정보 수집 및 이용에 동의합니다. (수집목적: 문의응대, 보존기간: 1년)
                  </label>
                </div>
                <button type="submit" disabled={isContactSubmitting} className="w-full bg-[#85C441] text-white py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-[#75ad39] transition-colors flex items-center justify-center gap-2 mt-2 md:mt-4 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  <Send size={18} className="md:w-5 md:h-5" /> {isContactSubmitting ? '문의 접수 중...' : '문의 접수하기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

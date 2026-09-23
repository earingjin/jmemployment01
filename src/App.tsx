import React, { useState, useEffect } from 'react';
import {
  Building2, Phone, Clock, MapPin, Search, ChevronLeft, ChevronRight,
  ExternalLink, ArrowRight, X, User, FileText,
  Award, ShieldCheck, Compass, Check
} from 'lucide-react';

// Import image assets directly so Vite bundles and deploys them correctly in production
import HERO_STUDIO_IMG from './assets/images/hero_scandinavian_studio_1790127679019.jpg';
import CONSULTING_IMG from './assets/images/consulting.png';
import ARMCHAIR_IMG from './assets/images/scandinavian_armchair_1790127692491.jpg';
import JOB_REGISTRATION_VIDEO from './assets/images/구직등록 신청 영상.mp4';
import ZEN_STONES_IMG from './assets/images/scandinavian_zen_stones_1790127704212.jpg';
import NATIONAL_EMPLOYMENT_VIDEO from './assets/images/국취신청.mp4';
import LOUNGE_BANNER_IMG from './assets/images/scandinavian_lounge_banner_1790127714603.jpg';
import JMCAREER_LOGO from './assets/images/제이엠커리어 로고.png';

// Data definitions
interface SeekerInfo {
  kind: string;
  target: string;
  card: string;
  big: string;
  sub: string;
  desc: string;
  draft: boolean;
}

interface EmployerInfo {
  target: string;
  amount: string;
  desc: string;
}

interface ProgramItem {
  id: string;
  label: string;
  seeker: SeekerInfo;
  employer: EmployerInfo | null;
}

interface BranchInfo {
  slug: string;
  phone: string;
  address: string;
  hours: string;
  region: string;
  mapUrl: string;
  contactManagerName: string;
  contactManagerEmail: string;
  heroHeadline: string;
  introTitle: string;
  introImage: string;
  brandImage: string;
  reportTitle: string;
  reportImage: string;
  published: boolean;
  stats: { value: string; label: string }[];
  contactEnabled: boolean;
  contactIntro: string;
  programIds: string[];
}

interface ReviewItem {
  name: string;
  date: string;
  badge: string;
  title: string;
  excerpt: string;
  full: string;
}

interface PressItem {
  image: string;
  category: string;
  date: string;
  title: string;
  detail: string;
  link?: string;
}

interface CourseItem {
  image: string;
  category: string;
  campus: string;
  title: string;
  info: string;
  costBadge: string;
  statusBadge: string;
  detail: string;
}

interface PartnerItem {
  name: string;
  logo: string;
}

const ADMIN_BRANCHES = [
  "본사", "남부", "동부", "서부", "북부", "의정부", "용인", "인천", "분당",
  "거제", "광주", "진주", "창원", "대구", "대전", "천안", "원주", "마산", "부산", "홍성"
];

const BRANCH_REGIONS = ["수도권", "충청권", "호남권", "영남권", "강원·제주권"];

const DEFAULT_REGION_MAP: Record<string, string> = {
  "본사": "수도권", "남부": "수도권", "동부": "수도권", "서부": "수도권", "북부": "수도권", "의정부": "수도권",
  "용인": "수도권", "인천": "수도권", "분당": "수도권", "대전": "충청권", "천안": "충청권", "홍성": "충청권",
  "광주": "호남권", "거제": "영남권", "진주": "영남권", "창원": "영남권", "대구": "영남권", "마산": "영남권",
  "부산": "영남권", "원주": "강원·제주권"
};

function branchSuffix(name: string) {
  return name === "본사" ? "" : "지사";
}

const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: "employment-support",
    label: "국민취업지원제도",
    seeker: {
      kind: "구직촉진수당",
      target: "15~69세 구직자",
      card: "15~69세 · 총 최대 510만원",
      big: "월 60만원",
      sub: "총 최대 510만원",
      desc: "구직촉진수당 월 60만원 × 최대 6개월(360만원)에 취업하면 취업성공수당 최대 150만원을 더 받습니다. 부양가족 추가 지원은 별도입니다.",
      draft: false
    },
    employer: null
  },
  {
    id: "job-leap",
    label: "청년 일자리도약장려금",
    seeker: {
      kind: "근속 인센티브",
      target: "비수도권 기업 취업 청년",
      card: "비수도권 취업 청년 · 2년간",
      big: "최대 720만원",
      sub: "2년간 · 6개월 근속부터",
      desc: "비수도권 기업에 정규직으로 취업해 계속 재직 시 근속 기간에 따라 청년 본인에게 인센티브를 나누어 지급합니다.",
      draft: true
    },
    employer: {
      target: "취업애로청년을 정규직으로 채용한 중소기업",
      amount: "최대 720만원",
      desc: "만 15~34세 취업애로청년을 정규직으로 신규 채용하고 6개월 이상 고용을 유지하면 인건비를 지원합니다."
    }
  },
  {
    id: "future-experience",
    label: "미래내일 일경험",
    seeker: {
      kind: "참여수당",
      target: "만 15~34세 미취업 청년",
      card: "만 15~34세 청년 · 인턴형",
      big: "월 150만원",
      sub: "인턴형 · 인턴 기간 동안",
      desc: "기업에서 인턴으로 실무를 경험하며 참여수당을 받고, 직무 경험을 공식 포트폴리오로 활용할 수 있습니다.",
      draft: true
    },
    employer: {
      target: "청년에게 일경험을 제공하는 기업·기관",
      amount: "최대 3,700만원",
      desc: "청년 일경험 프로그램을 운영하는 기업 및 기관에 프로그램 운영비와 청년 참여수당을 지원합니다."
    }
  },
  {
    id: "field-training",
    label: "시니어인턴십",
    seeker: {
      kind: "인턴 급여",
      target: "만 60세 이상",
      card: "만 60세 이상 · 인턴 급여",
      big: "월 215만원+",
      sub: "인턴 급여 · 계속고용 연계",
      desc: "기업 인턴으로 일하며 급여를 받고(2026년 최저임금 기준), 수습 후 정규 계속고용으로 연계 지원합니다. 정부 수당이 아닌 기업 지급 급여입니다.",
      draft: true
    },
    employer: {
      target: "만 60세 이상을 인턴으로 채용하는 기업",
      amount: "최대 550만원",
      desc: "인턴지원금 120만원 + 채용지원금 150만원 + 장기취업유지지원금 280만원을 단계별로 지원합니다."
    }
  }
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    name: "김ㅇㅇ (26세)",
    date: "2026-01-14",
    badge: "국민취업지원제도",
    title: "방향만 바꿨을 뿐인데 서류 통과율이 달라졌습니다",
    excerpt: "혼자 자소서 붙잡고 있었는데, 상담사님이랑 방향부터 다시 잡으니까 서류 통과율이 확 달라졌어요.",
    full: "혼자 자소서 붙잡고 있었는데, 상담사님이랑 방향부터 다시 잡으니까 서류 통과율이 확 달라졌어요. 무작정 여기저기 넣던 걸 멈추고, 제 강점에 맞는 회사만 골라 지원하니 면접 연락이 오기 시작했습니다."
  },
  {
    name: "이ㅇㅇ (29세)",
    date: "2026-02-03",
    badge: "미래내일 일경험",
    title: "이력서에 쓸 말이 생겼다는 것만으로도 큰 위안이었습니다",
    excerpt: "일 경험이 없어서 늘 서류에서 걸렸는데, 인턴형으로 6개월 채우고 나니 이력서에 쓸 말이 생겼어요.",
    full: "일 경험이 없어서 늘 서류에서 걸렸는데, 인턴형으로 6개월 채우고 나니 이력서에 쓸 말이 생겼어요. 담당 상담사님이 기업 연결부터 서류까지 같이 챙겨주셔서 혼자였으면 못 했을 것 같아요."
  },
  {
    name: "박ㅇㅇ (24세)",
    date: "2026-02-20",
    badge: "청년일자리도약장려금",
    title: "중소기업 취업, 이렇게 든든할 줄 몰랐습니다",
    excerpt: "중소기업이라 망설였는데 장려금 설명 듣고 나서 회사도 저도 부담이 훨씬 줄었어요.",
    full: "중소기업이라 망설였는데 장려금 설명 듣고 나서 회사도 저도 부담이 훨씬 줄었어요. 지원 조건이 복잡해서 혼자 알아볼 땐 막막했는데, 상담 한 번으로 명쾌하게 정리가 됐습니다."
  },
  {
    name: "최ㅇㅇ (31세)",
    date: "2026-03-05",
    badge: "재취업 컨설팅",
    title: "막막했던 마음이 구체적인 계획으로 바뀌었습니다",
    excerpt: "퇴사하고 6개월 넘게 방황했는데, 여기서 버크만 진단받고 방향을 다시 잡았어요.",
    full: "퇴사하고 6개월 넘게 방황했는데, 여기서 버크만 진단받고 방향을 다시 잡았어요. 막연히 불안하기만 했던 마음이, 구체적인 계획으로 바뀌니까 훨씬 편해졌습니다."
  },
  {
    name: "정ㅇㅇ (27세)",
    date: "2026-03-18",
    badge: "면접전략 상담",
    title: "면접에서 말하는 방식이 완전히 달라졌습니다",
    excerpt: "면접에서 자꾸 떨어져서 자신감이 바닥이었는데, 모의면접 몇 번 하고 나니 말하는 게 달라졌어요.",
    full: "면접에서 자꾸 떨어져서 자신감이 바닥이었는데, 모의면접 몇 번 하고 나니 말하는 게 달라졌어요. 제가 뭘 놓치고 있었는지 객관적으로 짚어주셔서 다음 면접에서 바로 합격했습니다."
  }
];

const INITIAL_NEWS = [
  { date: "2026.09.01", title: "2026 하반기 청년 일자리도약장려금 신청 및 기업지원 안내" },
  { date: "2026.08.20", title: "미래내일 일경험 프로젝트형·인턴형 참여기업 모집 공고" },
  { date: "2026.08.05", title: "JMCAREER 전국 지사 채용설명회 및 취업컨설팅 특강 개최" }
];

const INITIAL_PRESS: PressItem[] = [
  {
    image: ARMCHAIR_IMG,
    category: "보도자료",
    date: "2026.03.15",
    title: "JMCAREER, 2026년 고용노동부 청년 취업지원 우수기관 선정",
    detail: "JMCAREER가 고용노동부 주관 2026년 청년 취업지원 우수기관으로 선정되었습니다. 전국 19개 지사의 상담 데이터와 재취업 연계 성과를 바탕으로 우수성을 공인받았습니다."
  },
  {
    image: ZEN_STONES_IMG,
    category: "MOU체결",
    date: "2026.05.02",
    title: "JMCAREER, 수도권 및 영남권 대학들과 취업지원 산학협력 체결",
    detail: "JMCAREER는 주요 대학교와 재학생 및 졸업생을 위한 취업지원 업무협약(MOU)을 체결했습니다. 진로상담, 일경험 인턴십, 모의면접을 연계 운영합니다."
  },
  {
    image: LOUNGE_BANNER_IMG,
    category: "보도자료",
    date: "2026.06.20",
    title: "JMCAREER, 전국 19개 거점 지사 원스톱 취업지원망 완비",
    detail: "JMCAREER가 전국 19개 지사 체계를 완비하여 청년, 중장년, 재취업 구직자에게 동일한 수준의 고품질 취업 서비스를 원스톱으로 지원합니다."
  }
];

const INITIAL_COURSES: CourseItem[] = [
  {
    image: ARMCHAIR_IMG,
    category: "소상공인 특화취업",
    campus: "서울 영등포 본사",
    title: "소상공인 특화취업 실무 마스터 프로그램",
    info: "무료 국비지원 · 2026년 상시모집",
    costBadge: "교육비 최대 180만원 지원",
    statusBadge: "신청가능",
    detail: "소상공인 사업장 취업을 준비하는 구직자를 위한 특화 지원 프로그램입니다. 교육비 국비지원과 1:1 전담 취업상담을 병행합니다."
  },
  {
    image: ZEN_STONES_IMG,
    category: "UI/UX엔지니어링",
    campus: "광주동구캠퍼스",
    title: "UI/UX웹디자인 웹퍼블리셔 프론트엔드 전문가 과정",
    info: "전액국비 국가기간전략 · 2026년 상시모집",
    costBadge: "전액무료",
    statusBadge: "신청가능",
    detail: "실무 포트폴리오를 기반으로 디자인부터 퍼블리싱까지 완벽히 마스터하는 국가기간전략 직업훈련 과정입니다."
  },
  {
    image: LOUNGE_BANNER_IMG,
    category: "인공지능플랫폼",
    campus: "광주북구캠퍼스",
    title: "AI 챗봇 풀스택 서비스 개발과정",
    info: "전액국비 산대특 · 2026년 상시모집",
    costBadge: "전액무료",
    statusBadge: "신청가능",
    detail: "실제 생성형 AI API와 풀스택 웹 프레임워크를 연동해 기업형 챗봇 플랫폼을 직접 구축하는 실무 개발 과정입니다."
  }
];

const INITIAL_PARTNERS: PartnerItem[] = [
  { name: "성신여대", logo: "" },
  { name: "경동대", logo: "" },
  { name: "경복대", logo: "" },
  { name: "수원대", logo: "" },
  { name: "한국외대", logo: "" },
  { name: "사립학교교직원연금공단", logo: "" },
  { name: "한국에너지공단", logo: "" },
  { name: "광주교통공사", logo: "" },
  { name: "와이즈브이에프엑스", logo: "" },
  { name: "OASYS", logo: "" },
  { name: "XON", logo: "" }
];

export default function App() {
  // Navigation View State: 'home' | 'branch' | 'employer'
  const [currentView, setCurrentView] = useState<'home' | 'branch' | 'employer'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'branch' | 'common'>('branch');
  const [selectedBranch, setSelectedBranch] = useState("본사");
  const [mapBranch, setMapBranch] = useState("본사");
  const [branchSearch, setBranchSearch] = useState("");
  const [bdRegion, setBdRegion] = useState("전체");

  // Common site data
  const [benefitYear, setBenefitYear] = useState("2026");
  const [benefitNotice, setBenefitNotice] = useState("");
  const [programs, setPrograms] = useState<ProgramItem[]>(INITIAL_PROGRAMS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [news, setNews] = useState(INITIAL_NEWS);
  const [pressNews, setPressNews] = useState<PressItem[]>(INITIAL_PRESS);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);

  // Sliders and Tabs state
  const [newsTab, setNewsTab] = useState<'press' | 'notice'>('press');
  const [reviewIdx, setReviewIdx] = useState(0);

  // Modals state
  const [activeModal, setActiveModal] = useState<{
    type: 'review' | 'course' | 'press' | 'program' | 'aiFeature' | 'map' | 'gallery';
    data?: any;
    audience?: 'seeker' | 'employer';
  } | null>(null);

  // Contact form submission state
  const [contactForm, setContactForm] = useState({
    branch: "본사",
    name: "",
    phone: "",
    content: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Branch data state dictionary
  const [branches, setBranches] = useState<Record<string, BranchInfo>>(() => {
    const map: Record<string, BranchInfo> = {};
    ADMIN_BRANCHES.forEach(name => {
      map[name] = {
        slug: name,
        phone: name === "본사" ? "02-2284-0077" : "1588-0000",
        address: name === "본사"
          ? "서울시 성동구 왕십리로 58 서울지식산업센터 포휴 808호(성수동1가)"
          : `대한민국 ${name}${branchSuffix(name)} 상담센터`,
        hours: "평일 09:00~18:00 (점심시간 12:00~13:00 / 주말·공휴일 휴무)",
        region: DEFAULT_REGION_MAP[name] || "수도권",
        mapUrl: "",
        contactManagerName: "책임상담관",
        contactManagerEmail: "help@jmcareer.co.kr",
        heroHeadline: "받을 수 있는 취업 수당부터\n품격 있게 확인하세요",
        introTitle: name === "본사" ? "서울 영등포 본사를 소개합니다." : `${name}${branchSuffix(name)} 상담센터`,
        introImage: "",
        brandImage: "",
        reportTitle: "취업지원 전문서비스\n위치 및 대표 문의",
        reportImage: "",
        published: true,
        stats: [
          { value: "64,000+", label: "누적 취업상담" },
          { value: "78.4%", label: "취업 매칭 연계율" },
          { value: "126개사", label: "산학 협약기업" },
          { value: "98.2%", label: "상담자 종합만족도" }
        ],
        contactEnabled: true,
        contactIntro: "상담 신청서를 남겨주시면 담당 전문 상담관이 1~2일 내로 상세히 안내해 드립니다.",
        programIds: ["employment-support", "job-leap", "future-experience", "field-training"]
      };
    });
    return map;
  });

  // Carousel autoplay for reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIdx(prev => (prev + 1) % Math.max(1, reviews.length - 2));
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const currentBranch = branches[selectedBranch] || branches["본사"];
  const displayedMapBranch = branches[mapBranch] || branches["본사"];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert("성함과 연락처를 입력해 주세요.");
      return;
    }
    setIsSubmitted(true);
  };

  const showSaveNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const getBenefitNotice = () => {
    return benefitNotice || `※ 지원 금액은 ${benefitYear}년 고용노동부 지침에 따른 수당 및 인센티브이며, 개별 자격 심사 결과에 따라 차등 적용될 수 있습니다.`;
  };

  return (
    <div className="min-h-screen bg-[#FAFBFB] text-[#192A32] font-sans-kr antialiased flex flex-col selection:bg-[#7296A1] selection:text-white">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#12242D] text-white px-5 py-3 rounded-full shadow-lg font-medium text-xs tracking-wide">
          <Check size={16} className="text-[#88AAB3]" />
          변경사항이 안전하게 저장되었습니다.
        </div>
      )}

      {/* =========================================================================
          SLIM TOPBAR (Matching image.png dark slate navy top header)
      ========================================================================= */}
      <div className="bg-[#11212B] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">JMCAREER 고용서비스 본부 · 1588-0000</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">평일 09:00 - 18:00 (전국 19개 지사)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={() => {
                setCurrentView('branch');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors"
            >
              지사 찾기
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              관리자 모드
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GLOBAL MAIN HEADER (Clean White Scandinavian Aesthetic from image.png)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3EBEE] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo (Refined, architectural editorial styling) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="JMCAREER 홈으로 이동"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <img
                src={JMCAREER_LOGO}
                alt="JMCAREER Employment Service"
                className="h-10 sm:h-11 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>

          {/* Navigation Links (Spacious, elegant, with subtle active states) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all ${
                currentView === 'home'
                  ? 'bg-[#12242D] text-white shadow-xs'
                  : 'text-[#4A5D66] hover:text-[#12242D] hover:bg-slate-100/80'
              }`}
            >
              홈
            </button>
            {programs.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveModal({ type: 'program', data: p, audience: 'seeker' });
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-[#4A5D66] hover:text-[#12242D] hover:bg-slate-100/80 rounded-full transition-all whitespace-nowrap"
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => {
                setCurrentView('employer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all ${
                currentView === 'employer'
                  ? 'bg-[#12242D] text-white shadow-xs'
                  : 'text-[#4A5D66] hover:text-[#12242D] hover:bg-slate-100/80'
              }`}
            >
              기업 지원금
            </button>
            <button
              onClick={() => {
                setCurrentView('branch');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all ${
                currentView === 'branch'
                  ? 'bg-[#12242D] text-white shadow-xs'
                  : 'text-[#4A5D66] hover:text-[#12242D] hover:bg-slate-100/80'
              }`}
            >
              전국지사 안내
            </button>
          </nav>

          {/* Right Action: Dark Pill Button matching image.png */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-[#12242D] hover:bg-[#0E1A20] text-white rounded-full px-5 py-2 text-xs font-medium tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>상담 예약</span>
              <ArrowRight size={13} className="text-[#88AAB3]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {/* =========================================================================
            VIEW 1: HOME PAGE
        ========================================================================= */}
        {currentView === 'home' && (
          <div>
            {/* HERO SECTION (Atmospheric dusty-blue studio aesthetic directly from top of image.png) */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#8AAEB7] via-[#7B9FA8] to-[#6E929B] text-white py-14 sm:py-24">
              {/* Background Studio Photography from batch generation */}
              <div className="absolute inset-0 z-0">
                <img
                  src={CONSULTING_IMG}
                  alt="취업 상담사가 구직자와 마주 앉아 상담하는 모습"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/assets/images/consulting.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#6E929B]/90 via-[#7B9FA8]/65 to-transparent" />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="max-w-2xl ml-auto w-full text-right flex flex-col items-end">
                  {/* Editorial Serif Heading matching image.png */}
                  <h1 className="w-full font-serif-kr text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.25] mb-5 text-balance drop-shadow-xs">
                    취업이 막막할 때,<br />
                    <span className="font-serif">국민취업지원제도 상담부터</span>
                  </h1>

                  <p className="w-full max-w-xl text-white/90 text-sm sm:text-base leading-relaxed mb-8 font-light drop-shadow-xs">
                    국민취업지원제도 최대 360만원 혜택받기<br></br>
                    취업지원금, 받을 수 있는지 지금 확인하세요
                  </p>

                  {/* Dark Pill CTA Button matching image.png */}
                  <div className="w-full flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#12242D] hover:bg-[#09151B] text-white rounded-full px-7 py-3 text-xs sm:text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                    >
                      <span>국민취업지원제도 상담 신청</span>
                      <ArrowRight size={14} className="text-[#96B8C0] group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('branch');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white/25 hover:bg-white/35 backdrop-blur-sm text-white rounded-full px-6 py-3 text-xs sm:text-sm font-medium tracking-wide border border-white/40 transition-all flex items-center gap-2"
                    >
                      <Building2 size={14} />
                      <span>전국 19개 지사 안내</span>
                    </button>
                  </div>
                </div>

                {/* HERO CARDS BENTO (Clean white minimalist cards on soft studio floor) */}
                <div className="mt-14 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {programs.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveModal({ type: 'program', data: p, audience: 'seeker' })}
                        className="bg-white/95 hover:bg-white text-left p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-white/60"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#556972] font-semibold mb-2">
                            <span>{p.label}</span>
                            {p.seeker.draft && (
                              <span className="text-[10px] bg-[#EBF2F4] text-[#42616A] px-2 py-0.5 rounded-full font-bold">
                                가안
                              </span>
                            )}
                          </div>
                          <div className="font-serif-kr text-2xl sm:text-3xl font-semibold text-[#12242D] tracking-tight group-hover:text-[#7296A1] transition-colors mb-1">
                            {p.seeker.big}
                          </div>
                          <div className="text-[11px] text-[#697E88]">
                            {p.seeker.card}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#3D5C65]">
                          <span>상세 요건 보기</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-white/80 mt-4 leading-relaxed font-light">
                    {getBenefitNotice()}
                  </p>
                </div>
              </div>
            </section>

            {/* SERVICE OVERVIEW: program guide placed directly below the hero */}
            <section className="bg-white border-b border-[#E3EBEE] py-16 sm:py-20 lg:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="mb-9 sm:mb-11 text-center">
                  <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block mb-3">
                    Services
                  </span>
                  <h2 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D] mb-3">
                    운영 사업 한눈에 보기
                  </h2>
                  <p className="text-sm text-[#4E626B] leading-relaxed font-light">
                    클릭하면 지원내용부터 신청방법까지 바로 확인할 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    {
                      tag: '구직자 · 저소득층',
                      title: '국민취업지원제도',
                      desc: '취업지원과 생계비를 함께 지원하는 한국형 실업부조',
                      benefit: '구직촉진수당 월 최대 60만원'
                    },
                    {
                      tag: '청년 · 기업',
                      title: '청년일자리도약장려금',
                      desc: '청년 정규직 채용 기업엔 인건비, 비수도권 근속장려금',
                      benefit: '청년 개인 최대 720만원'
                    },
                    {
                      tag: '미취업 청년',
                      title: '미래내일 일경험',
                      desc: '직무교육과 우수기업 인턴십으로 취업역량 강화',
                      benefit: '8주 참여수당 최대 450만원'
                    },
                    {
                      tag: '만 60세 이상',
                      title: '시니어인턴십',
                      desc: '고령자 채용 기업에 인건비 지원, 시니어 일자리 촉진',
                      benefit: '기업 지원 최대 550만원'
                    }
                  ].map((service, index) => {
                    const program = programs[index];

                    return (
                      <button
                        key={service.title}
                        onClick={() => program && setActiveModal({ type: 'program', data: program, audience: 'seeker' })}
                        className="min-h-56 bg-[#FAFBFB] hover:bg-white text-left p-6 rounded-2xl border border-[#E3EBEE] hover:border-[#94B5BE] shadow-[0_4px_20px_rgba(0,0,0,0.025)] hover:shadow-[0_10px_28px_rgba(18,36,45,0.08)] transition-all duration-300 group flex flex-col"
                      >
                        <span className="self-start text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF2F4] text-[#3D5C65]">
                          {service.tag}
                        </span>
                        <h3 className="mt-5 text-lg font-bold text-[#12242D] group-hover:text-[#557A84] transition-colors">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#687C85] font-light">
                          {service.desc}
                        </p>
                        <p className="mt-auto pt-5 text-sm font-bold text-[#3D5C65]">
                          {service.benefit}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* VIDEO GUIDE: quick start videos placed directly below the hero */}
            <section className="bg-[#FAFBFB] border-b border-[#E3EBEE] py-16 sm:py-20 lg:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="text-center mb-9 sm:mb-11">
                  <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#7296A1] uppercase">
                    Video guide
                  </span>
                  <h2 className="mt-3 font-serif-kr text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#12242D]">
                    구직수당 신청, 영상으로 쉽게 시작하세요
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
                  <article className="overflow-hidden rounded-3xl bg-white border border-[#E3EBEE] shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
                    <div className="aspect-video bg-[#EBF2F4] p-3 sm:p-4">
                      <div className="h-full overflow-hidden rounded-2xl bg-black">
                        <video
                          src={JOB_REGISTRATION_VIDEO}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          aria-label="구직등록 신청 안내 영상"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 sm:px-6 py-5 border-t border-[#E3EBEE]">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-[#EBF2F4] text-[#3D5C65] flex items-center justify-center text-[11px] font-extrabold">01</span>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-[#12242D] whitespace-nowrap">구직등록 신청</h3>
                        <p className="text-xs text-[#687C85] truncate">먼저 구직등록부터 해요</p>
                      </div>
                    </div>
                  </article>

                  <article className="overflow-hidden rounded-3xl bg-white border border-[#E3EBEE] shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
                    <div className="aspect-video bg-[#EBF2F4] p-3 sm:p-4">
                      <div className="h-full overflow-hidden rounded-2xl bg-black">
                        <video
                          src={NATIONAL_EMPLOYMENT_VIDEO}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          aria-label="국민취업지원제도 신청 안내 영상"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 sm:px-6 py-5 border-t border-[#E3EBEE]">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-[#EBF2F4] text-[#3D5C65] flex items-center justify-center text-[11px] font-extrabold">02</span>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-[#12242D] whitespace-nowrap">국민취업지원 신청</h3>
                        <p className="text-xs text-[#687C85] truncate">구직수당 신청 방법을 알아봐요</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* =========================================================================
                SECTION 1: ASYMMETRIC EDITORIAL BLOCK 1 (Matching 2nd block in image.png)
                Left: Editorial Serif Headline, refined body, dark pill button.
                Right: Designer Armchair in Studio (image.png style).
            ========================================================================= */}
            <section className="py-20 sm:py-28 bg-white border-b border-[#E3EBEE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* Left Column: Editorial Headline & Copy */}
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block">
                      맞춤형 취업지원 프로세스
                    </span>
                    <h2 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-normal text-[#12242D] leading-[1.3] text-balance">
                      혼자가 아닌 전문가와 함께<br />
                      완성하는 나만의 커리어 로드맵
                    </h2>
                    <p className="text-sm text-[#4E626B] leading-relaxed max-w-lg font-light">
                      취업 준비의 첫 단계는 내가 서 있는 위치와 방향을 명확히 아는 것에서 시작됩니다. 
                      JMCAREER 전담 직업상담사가 심층 진단부터 구직촉진수당 연계, 실전 직무 포트폴리오까지 
                      차분하고 체계적으로 동행합니다.
                    </p>

                    {/* Dark Pill CTA & Secondary Link */}
                    <div className="pt-2 flex flex-wrap items-center gap-5">
                      <button
                        onClick={() => {
                          document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#12242D] hover:bg-[#0E1A20] text-white rounded-full px-7 py-3 text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
                      >
                        <span>상담 예약하기</span>
                        <ArrowRight size={14} className="text-[#88AAB3]" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('branch');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-semibold text-[#3A535C] hover:text-[#12242D] underline underline-offset-4 transition-colors"
                      >
                        전국 19개 지사 둘러보기
                      </button>
                    </div>

                    {/* Quick Process Bullet Points */}
                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-[#12242D] mb-1">01. 진단 및 계획수립</div>
                        <div className="text-[11px] text-[#637780]">버크만 검사 및 직무역량 분석</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#12242D] mb-1">02. 수당 및 훈련연계</div>
                        <div className="text-[11px] text-[#637780]">최대 510만원 수당 지급 심사</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#12242D] mb-1">03. 실무 일경험</div>
                        <div className="text-[11px] text-[#637780]">우수 협약기업 인턴십 매칭</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#12242D] mb-1">04. 사후 안심관리</div>
                        <div className="text-[11px] text-[#637780]">정규직 안착 및 성공수당 지급</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Studio Showcase (Designer Armchair from image.png) */}
                  <div className="lg:col-span-6">
                    <div className="relative rounded-3xl overflow-hidden bg-[#EBF2F4] shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-[#DCE8EB]">
                      <div className="aspect-video">
                        <img
                          src={ARMCHAIR_IMG}
                          alt="편안한 취업 상담 공간"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="hidden">
                        <div>
                          <div className="text-xs font-bold text-[#12242D]">구직등록 하는 방법</div>
                          <div className="text-[11px] text-[#627780]">편안하고 프라이빗한 전문 컨설팅 공간</div>
                        </div>
                        <span className="text-[11px] px-3 py-1 bg-white rounded-full text-[#38565F] font-semibold border border-slate-200">
                          100% 예약제
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================================
                SECTION 2: ASYMMETRIC EDITORIAL BLOCK 2 (Matching 3rd block in image.png - Alternating)
                Left: Zen Still Life (Stones, plant, lamp in soft studio light).
                Right: Editorial Serif Headline & AI/Birkman Solutions.
            ========================================================================= */}
            <section className="py-20 sm:py-28 bg-[#FAFBFB] border-b border-[#E3EBEE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* Left Column: Zen Still Life Image */}
                  <div className="lg:col-span-6 order-2 lg:order-1">
                    <div className="relative rounded-3xl overflow-hidden bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-[#E3EBEE]">
                      <div className="aspect-video">
                        <img
                          src={ZEN_STONES_IMG}
                          alt="차분한 상담 환경"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="hidden">
                        <div>
                          <div className="text-xs font-bold text-[#12242D]">균형과 강점의 발견</div>
                          <div className="text-[11px] text-[#627780]">나에게 꼭 맞는 진로와 직무 적합도 진단</div>
                        </div>
                        <button
                          onClick={() => setActiveModal({ type: 'aiFeature', data: 'burkman' })}
                          className="text-[11px] px-3 py-1 bg-[#12242D] text-white rounded-full font-medium hover:bg-black transition-colors"
                        >
                          버크만 보기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editorial Text & 4 Interactive AI Cards */}
                  <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                    <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block">
                      데이터 기반 스마트 솔루션
                    </span>
                    <h2 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-normal text-[#12242D] leading-[1.3] text-balance">
                      진단부터 실전 대비까지,<br />
                      체계적인 AI 원스톱 케어
                    </h2>
                    <p className="text-sm text-[#4E626B] leading-relaxed max-w-lg font-light">
                      10만 건 이상의 실제 취업 성공 데이터를 학습한 AI 솔루션이 자기소개서 작성, 
                      모의면접 피드백, 인적성 클리닉까지 완벽한 실전 준비를 지원합니다.
                    </p>

                    {/* Interactive Solution Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div
                        onClick={() => setActiveModal({ type: 'aiFeature', data: 'coverletter' })}
                        className="bg-white p-5 rounded-2xl border border-[#E3EBEE] hover:border-[#7296A1] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full">
                            서류 완성
                          </span>
                          <FileText size={16} className="text-[#88AAB3] group-hover:text-[#12242D] transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold text-[#12242D] mb-1 group-hover:text-[#7296A1] transition-colors">
                          AI 자기소개서 첨삭
                        </h4>
                        <p className="text-[11px] text-[#687C85] leading-relaxed">
                          합격 빅데이터로 문항별 강점 키워드를 자동 도출합니다.
                        </p>
                      </div>

                      <div
                        onClick={() => setActiveModal({ type: 'aiFeature', data: 'interview' })}
                        className="bg-white p-5 rounded-2xl border border-[#E3EBEE] hover:border-[#7296A1] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full">
                            실전 시뮬레이션
                          </span>
                          <User size={16} className="text-[#88AAB3] group-hover:text-[#12242D] transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold text-[#12242D] mb-1 group-hover:text-[#7296A1] transition-colors">
                          AI 실전 모의면접
                        </h4>
                        <p className="text-[11px] text-[#687C85] leading-relaxed">
                          1분 자기소개와 직무 예상 질문을 실전처럼 연습합니다.
                        </p>
                      </div>

                      <div
                        onClick={() => setActiveModal({ type: 'aiFeature', data: 'aptitude' })}
                        className="bg-white p-5 rounded-2xl border border-[#E3EBEE] hover:border-[#7296A1] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full">
                            NCS 적성
                          </span>
                          <Award size={16} className="text-[#88AAB3] group-hover:text-[#12242D] transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold text-[#12242D] mb-1 group-hover:text-[#7296A1] transition-colors">
                          AI NCS 인적성 모의고사
                        </h4>
                        <p className="text-[11px] text-[#687C85] leading-relaxed">
                          3,000개 기출 문항으로 취약 영역을 정밀 클리닉합니다.
                        </p>
                      </div>

                      <div
                        onClick={() => setActiveModal({ type: 'aiFeature', data: 'burkman' })}
                        className="bg-white p-5 rounded-2xl border border-[#E3EBEE] hover:border-[#7296A1] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full">
                            성향 진단
                          </span>
                          <Compass size={16} className="text-amber-600" />
                        </div>
                        <h4 className="text-sm font-bold text-[#12242D] mb-1 group-hover:text-amber-800 transition-colors">
                          버크만 성격검사
                        </h4>
                        <p className="text-[11px] text-[#687C85] leading-relaxed">
                          행동 패턴과 강점을 파악해 어울리는 커리어를 제안합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================================
                SECTION 3: WIDE ATMOSPHERIC BANNER (Matching 4th block in image.png)
                Full-width dusty teal-blue studio lounge with centered serif quote & pill.
            ========================================================================= */}
            <section className="relative overflow-hidden bg-[#7C9FA8] text-white py-20 sm:py-28">
              {/* Studio Lounge Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={LOUNGE_BANNER_IMG}
                  alt="Atmospheric Scandinavian lounge"
                  className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/assets/images/scandinavian_lounge_banner_1790127714603.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6E929B]/90 via-[#7C9FA8]/80 to-[#6E929B]/90" />
              </div>

              <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <h2 className="font-serif-kr text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.35] text-balance mb-6">
                  취업의 막막함과 방황의 시간,<br />
                  <span className="italic font-serif">JMCAREER가 든든한 디딤돌이 되어드립니다</span>
                </h2>
                <p className="text-sm text-white/90 max-w-xl mx-auto mb-8 font-light leading-relaxed">
                  25년 전통의 커리어 전문 역량과 전국 19개 지사 네트워크로 
                  모든 구직자와 기업에게 가장 신뢰받는 길을 제시합니다.
                </p>
                <button
                  onClick={() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white text-[#12242D] hover:bg-[#F2F6F7] rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  <span>수당 및 지원금 모의 진단</span>
                  <ArrowRight size={14} className="text-[#5E838D]" />
                </button>
              </div>
            </section>

            {/* =========================================================================
                SECTION 4: REVIEWS & PROOF (Clean Minimalist Editorial Grid)
            ========================================================================= */}
            <section className="py-20 sm:py-28 bg-white border-b border-[#E3EBEE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block mb-1">
                      생생한 참여 후기
                    </span>
                    <h2 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D]">
                      취업의 막막함, 함께하면 확신이 됩니다
                    </h2>
                  </div>

                  {/* Minimalist Slider Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewIdx(prev => (prev > 0 ? prev - 1 : reviews.length - 3))}
                      className="w-10 h-10 rounded-full border border-[#DCE8EB] bg-white text-[#12242D] flex items-center justify-center hover:bg-[#F4F7F8] transition-colors shadow-xs"
                      aria-label="이전 후기"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setReviewIdx(prev => (prev < reviews.length - 3 ? prev + 1 : 0))}
                      className="w-10 h-10 rounded-full border border-[#DCE8EB] bg-white text-[#12242D] flex items-center justify-center hover:bg-[#F4F7F8] transition-colors shadow-xs"
                      aria-label="다음 후기"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Review Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.slice(reviewIdx, reviewIdx + 3).map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveModal({ type: 'review', data: r })}
                      className="bg-[#FAFBFB] p-7 rounded-3xl border border-[#E3EBEE] hover:border-[#88AAB3] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                          <span className="font-semibold text-[#3D5C65] bg-[#EBF2F4] px-2.5 py-0.5 rounded-full text-[10px]">
                            {r.badge}
                          </span>
                          <span className="font-mono text-[11px]">{r.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#12242D] mb-3 leading-snug">
                          {r.title}
                        </h3>
                        <p className="text-xs text-[#526670] leading-relaxed line-clamp-3 font-light">
                          {r.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#192A32]">{r.name}</span>
                        <span className="text-[#3D5C65] font-semibold text-[11px] flex items-center gap-1">
                          후기 전문 읽기
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stat Strip (Proof Data in Scandinavian Clean Minimalist Layout) */}
                <div className="mt-16 pt-10 border-t border-[#E3EBEE] grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  {currentBranch.stats.map((s, idx) => (
                    <div key={idx} className="p-6 bg-[#FAFBFB] rounded-2xl border border-[#E8EFF1]">
                      <div className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D] tracking-tight mb-1">
                        {s.value}
                      </div>
                      <div className="text-xs text-[#6B8089] font-medium">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* =========================================================================
                SECTION 5: NEWS, PRESS & COURSES
            ========================================================================= */}
            <section className="py-20 sm:py-28 bg-[#FAFBFB] border-b border-[#E3EBEE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block mb-1">
                      소식 및 소양 교육
                    </span>
                    <h2 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D]">
                      JMCAREER 최신 소식 & 교육
                    </h2>
                  </div>

                  {/* Segmented Tab Controls matching image.png */}
                  <div className="flex items-center p-1 bg-white rounded-full border border-[#DCE8EB]">
                    <button
                      onClick={() => setNewsTab('press')}
                      className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                        newsTab === 'press'
                          ? 'bg-[#12242D] text-white shadow-xs'
                          : 'text-[#586E78] hover:text-[#12242D]'
                      }`}
                    >
                      보도자료·소식
                    </button>
                    <button
                      onClick={() => setNewsTab('notice')}
                      className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                        newsTab === 'notice'
                          ? 'bg-[#12242D] text-white shadow-xs'
                          : 'text-[#586E78] hover:text-[#12242D]'
                      }`}
                    >
                      공지사항
                    </button>
                  </div>
                </div>

                {/* News Panels */}
                {newsTab === 'press' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pressNews.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveModal({ type: 'press', data: item })}
                        className="bg-white rounded-3xl overflow-hidden border border-[#E3EBEE] hover:border-[#88AAB3] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="h-44 bg-slate-100 overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between text-[11px] text-[#6F828A] mb-2 font-mono">
                            <span className="text-[#3D5C65] font-bold">{item.category}</span>
                            <span>{item.date}</span>
                          </div>
                          <h3 className="text-base font-bold text-[#12242D] mb-2 leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#526670] leading-relaxed line-clamp-2 font-light">
                            {item.detail}
                          </p>
                          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#3D5C65] flex items-center justify-between">
                            <span>자세히 보기</span>
                            <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {newsTab === 'notice' && (
                  <div className="bg-white rounded-3xl p-6 border border-[#E3EBEE] shadow-xs divide-y divide-[#E3EBEE]">
                    {news.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFBFB] px-3 rounded-xl transition-colors cursor-pointer"
                        onClick={() => alert(`[공지 상세]\n\n제목: ${item.title}\n등록일: ${item.date}`)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7296A1] shrink-0" />
                          <span className="text-sm font-medium text-[#12242D] hover:text-[#7296A1] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-xs text-[#6F828A] font-mono shrink-0 pl-4 sm:pl-0">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* =========================================================================
                SECTION 6: CONSULTATION RESERVATION FORM (Clean Minimalist Form)
            ========================================================================= */}
            <section id="contact-section" className="py-20 sm:py-28 bg-white border-b border-[#E3EBEE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="bg-[#EBF2F4] rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#DCE8EB]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="text-xs font-bold text-[#557A84] tracking-widest uppercase block">
                        간편 상담 접수
                      </span>
                      <h2 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D] leading-[1.3] text-balance">
                        취업의 다음 단계,<br />
                        지금 전문 상담관과 시작하세요
                      </h2>
                      <p className="text-xs sm:text-sm text-[#465E68] leading-relaxed font-light">
                        {currentBranch.contactIntro}
                      </p>
                      <div className="pt-4 border-t border-[#D5E3E7] space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#2A434C]">
                          <Phone size={14} className="text-[#7296A1]" />
                          <span>대표 전화: <strong>{currentBranch.phone}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#2A434C]">
                          <Clock size={14} className="text-[#7296A1]" />
                          <span>{currentBranch.hours}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-white p-7 sm:p-9 rounded-2xl shadow-sm border border-[#DCE8EB]">
                        {isSubmitted ? (
                          <div className="py-12 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#EBF2F4] text-[#3D5C65] mx-auto flex items-center justify-center">
                              <Check size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-[#12242D]">상담 신청이 정상 접수되었습니다</h4>
                            <p className="text-xs text-[#526670] max-w-sm mx-auto leading-relaxed">
                              남겨주신 연락처로 담당 전문 상담관이 1~2일 내로 친절히 연락드리겠습니다.
                            </p>
                            <button
                              onClick={() => {
                                setIsSubmitted(false);
                                setContactForm({ branch: "본사", name: "", phone: "", content: "" });
                              }}
                              className="mt-4 px-5 py-2 text-xs font-semibold text-[#12242D] bg-[#EBF2F4] hover:bg-[#DCE8EB] rounded-full transition-colors"
                            >
                              추가 신청하기
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-[#29424B] mb-1.5">
                                희망 상담 지사
                              </label>
                              <select
                                value={contactForm.branch}
                                onChange={e => setContactForm({ ...contactForm, branch: e.target.value })}
                                className="w-full bg-[#FAFBFB] border border-[#DCE8EB] rounded-xl px-4 py-2.5 text-xs text-[#12242D] focus:outline-none focus:border-[#7296A1]"
                              >
                                {ADMIN_BRANCHES.map(b => (
                                  <option key={b} value={b}>
                                    {b}{branchSuffix(b)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-[#29424B] mb-1.5">
                                  성함 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="홍길동"
                                  value={contactForm.name}
                                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                  className="w-full bg-[#FAFBFB] border border-[#DCE8EB] rounded-xl px-4 py-2.5 text-xs text-[#12242D] focus:outline-none focus:border-[#7296A1]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#29424B] mb-1.5">
                                  연락처 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  placeholder="010-0000-0000"
                                  value={contactForm.phone}
                                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                  className="w-full bg-[#FAFBFB] border border-[#DCE8EB] rounded-xl px-4 py-2.5 text-xs text-[#12242D] focus:outline-none focus:border-[#7296A1]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#29424B] mb-1.5">
                                문의 및 상담 희망 내용
                              </label>
                              <textarea
                                rows={3}
                                placeholder="궁금하신 지원제도(국민취업지원제도, 일자리도약장려금 등)나 현재 구직 상황을 간단히 적어주세요."
                                value={contactForm.content}
                                onChange={e => setContactForm({ ...contactForm, content: e.target.value })}
                                className="w-full bg-[#FAFBFB] border border-[#DCE8EB] rounded-xl px-4 py-2.5 text-xs text-[#12242D] focus:outline-none focus:border-[#7296A1]"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#12242D] hover:bg-[#081318] text-white py-3.5 rounded-full font-medium text-xs tracking-wider shadow-sm hover:shadow transition-all"
                            >
                              상담 신청서 제출하기
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: BRANCH DIRECTORY (전국 19개 지사 안내)
        ========================================================================= */}
        {currentView === 'branch' && (
          <section className="py-14 sm:py-20 bg-[#FAFBFB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="max-w-2xl mb-10">
                <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block mb-1">
                  전국 서비스망
                </span>
                <h1 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D] mb-3">
                  전국 19개 지사 안내
                </h1>
                <p className="text-xs sm:text-sm text-[#506670] leading-relaxed font-light">
                  전국 주요 거점 지사에서 동일한 수준의 전문 1:1 진로 상담과 수당 신청을 지원합니다.
                </p>
              </div>

              {/* Selected branch map */}
              <div id="branch-map" className="mb-10 overflow-hidden rounded-3xl border border-[#DCE8EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-[#E3EBEE]">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#7296A1] uppercase block mb-1">Selected branch</span>
                    <h2 className="text-xl font-bold text-[#12242D]">{mapBranch}{branchSuffix(mapBranch)} 찾아오는 길</h2>
                  </div>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(displayedMapBranch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D5C65] hover:text-[#12242D] underline underline-offset-4"
                  >
                    지도에서 크게 보기
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="relative h-72 sm:h-96 bg-[#EBF2F4]">
                  <iframe
                    key={mapBranch}
                    title={`${mapBranch}${branchSuffix(mapBranch)} 위치 지도`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(displayedMapBranch.address)}&z=15&output=embed`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute left-4 bottom-4 max-w-[calc(100%-2rem)] sm:left-6 sm:bottom-6 sm:max-w-sm rounded-2xl bg-white/95 backdrop-blur-sm border border-[#DCE8EB] px-4 py-3 shadow-[0_8px_24px_rgba(18,36,45,0.14)]">
                    <p className="text-xs font-bold text-[#12242D] mb-1">{mapBranch}{branchSuffix(mapBranch)}</p>
                    <p className="text-[11px] leading-relaxed text-[#526670]">{displayedMapBranch.address}</p>
                    <p className="mt-1 text-[11px] text-[#7296A1]">{displayedMapBranch.phone}</p>
                  </div>
                </div>
                <div className="px-6 py-4 text-xs text-[#526670] font-light">
                  {displayedMapBranch.address}
                </div>
              </div>

              {/* Region Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#E3EBEE]">
                {["전체", ...BRANCH_REGIONS].map(r => (
                  <button
                    key={r}
                    onClick={() => setBdRegion(r)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      bdRegion === r
                        ? 'bg-[#12242D] text-white shadow-xs'
                        : 'bg-white text-[#4A5E66] border border-[#E3EBEE] hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Branch Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ADMIN_BRANCHES.filter(name => {
                  const b = branches[name];
                  if (!b.published) return false;
                  return bdRegion === "전체" || b.region === bdRegion;
                }).map(name => {
                  const b = branches[name];
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => {
                        setMapBranch(name);
                        document.getElementById('branch-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      aria-pressed={mapBranch === name}
                      className={`bg-white p-7 rounded-3xl border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left ${
                        mapBranch === name
                          ? 'border-[#7296A1] ring-1 ring-[#7296A1]/30'
                          : 'border-[#E3EBEE] hover:border-[#88AAB3]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full">
                            {b.region}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{b.phone}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#12242D] mb-2">
                          {name}{branchSuffix(name)}
                        </h3>
                        <p className="text-xs text-[#526670] leading-relaxed mb-3 font-light">
                          {b.address}
                        </p>
                        <p className="text-[11px] text-[#788E98] leading-tight">
                          {b.hours}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#3D5C65]">
                        <span>약도 및 지도보기</span>
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VIEW 3: EMPLOYER GRANTS (기업 지원금 안내)
        ========================================================================= */}
        {currentView === 'employer' && (
          <section className="py-14 sm:py-20 bg-[#FAFBFB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="max-w-2xl mb-12">
                <span className="text-xs font-bold text-[#7296A1] tracking-widest uppercase block mb-1">
                  기업 전용 혜택
                </span>
                <h1 className="font-serif-kr text-3xl sm:text-4xl font-normal text-[#12242D] mb-3">
                  기업 지원금 & 고용장려금 안내
                </h1>
                <p className="text-xs sm:text-sm text-[#506670] leading-relaxed font-light">
                  청년 및 중장년 인재를 채용하는 기업을 위해 정부가 인건비와 운영비를 지원하는 제도입니다.
                </p>
              </div>

              {/* Employer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.filter(p => p.employer).map(p => (
                  <div
                    key={p.id}
                    onClick={() => setActiveModal({ type: 'program', data: p, audience: 'employer' })}
                    className="bg-white p-7 rounded-3xl border border-[#E3EBEE] hover:border-[#88AAB3] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full mb-3 inline-block">
                        {p.label}
                      </span>
                      <div className="font-serif-kr text-3xl font-semibold text-[#12242D] mb-1">
                        {p.employer?.amount}
                      </div>
                      <div className="text-xs text-[#6F848D] mb-3">
                        {p.employer?.target}
                      </div>
                      <p className="text-xs text-[#4F636C] leading-relaxed font-light">
                        {p.employer?.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#3D5C65]">
                      <span>기업 지원요건 상세</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =========================================================================
          GLOBAL FOOTER (Clean White Scandinavian Aesthetic matching bottom of image.png)
      ========================================================================= */}
      <footer className="bg-white border-t border-[#E3EBEE] py-14 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="font-serif-kr text-base font-bold text-[#12242D]">
                JMCAREER
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                신뢰받는 민간 공공고용서비스 및 전문 커리어 컨설팅 선도기관
              </p>
              <div className="text-slate-400 font-mono text-[11px]">
                대표전화: 1588-0000 / 본사: 02-2284-0077
              </div>
            </div>

            {/* Col 2: 주요 지원제도 */}
            <div>
              <div className="font-bold text-[#12242D] mb-3">주요 지원제도</div>
              <ul className="space-y-2 text-slate-500">
                {programs.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveModal({ type: 'program', data: p, audience: 'seeker' })}
                      className="hover:text-[#12242D] transition-colors"
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: 빠른 서비스 */}
            <div>
              <div className="font-bold text-[#12242D] mb-3">빠른 서비스</div>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <button onClick={() => setCurrentView('branch')} className="hover:text-[#12242D] transition-colors">
                    전국 19개 지사 안내
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('employer')} className="hover:text-[#12242D] transition-colors">
                    기업 채용장려금 안내
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal({ type: 'aiFeature', data: 'burkman' })} className="hover:text-[#12242D] transition-colors">
                    버크만 성격검사 안내
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: 관리자 및 문의 */}
            <div className="space-y-3">
              <div className="font-bold text-[#12242D]">운영 문의</div>
              <p className="text-slate-500 font-light">
                본사 : 서울시 성동구 왕십리로 58 서울지식산업센터 포휴 808호
              </p>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFBFB] hover:bg-slate-100 text-slate-700 rounded-md border border-[#E3EBEE] text-[11px] font-medium transition-colors"
              >
                <span>통합 관리자 대시보드</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © {new Date().getFullYear()} JMCAREER CO., LTD. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>이용약관</span>
              <span>개인정보처리방침</span>
              <span>이메일무단수집거부</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALS CONTAINER
      ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl relative border border-[#E3EBEE]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            {/* Program Detail Modal */}
            {activeModal.type === 'program' && activeModal.data && (
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full inline-block mb-2">
                  {activeModal.data.label}
                </span>
                <h3 className="font-serif-kr text-2xl font-bold text-[#12242D] mb-4">
                  {activeModal.data.label} 상세 안내
                </h3>

                <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-[#E3EBEE] mb-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {activeModal.audience === 'employer' ? '기업 지원금' : activeModal.data.seeker.kind}
                    </span>
                    <span className="text-2xl font-bold text-[#12242D]">
                      {activeModal.audience === 'employer' ? activeModal.data.employer?.amount : activeModal.data.seeker.big}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>지원 대상:</strong> {activeModal.audience === 'employer' ? activeModal.data.employer?.target : activeModal.data.seeker.target}
                  </div>
                  <p className="text-xs text-[#4F636C] leading-relaxed pt-2 border-t border-slate-200/80 font-light">
                    {activeModal.audience === 'employer' ? activeModal.data.employer?.desc : activeModal.data.seeker.desc}
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-600 mb-6">
                  <div className="font-bold text-[#12242D]">주요 지원 혜택 및 절차</div>
                  <ul className="list-disc pl-4 space-y-1 font-light">
                    <li>1:1 심층 상담 및 개인별 취업활동계획(IAP) 수립</li>
                    <li>고용노동부 승인 정식 지원제도에 따른 수당 전액 지원</li>
                    <li>맞춤형 직무 훈련 및 산학 연계 인턴십 우선 추천</li>
                    <li>취업 후 정착 지원금 및 장기 근속 인센티브 연계</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 bg-[#12242D] hover:bg-[#081318] text-white py-3 rounded-full text-xs font-semibold"
                  >
                    1:1 상담 신청하기
                  </button>
                </div>
              </div>
            )}

            {/* AI Feature Modal */}
            {activeModal.type === 'aiFeature' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full inline-block">
                  전문 진단 솔루션
                </span>
                <h3 className="font-serif-kr text-2xl font-bold text-[#12242D]">
                  {activeModal.data === 'burkman' ? '버크만 성격검사' : 'AI 커리어 솔루션'}
                </h3>
                <p className="text-xs text-[#4E626B] leading-relaxed font-light">
                  {activeModal.data === 'burkman'
                    ? '국제 공인 버크만 진단으로 평소 행동 양식과 스트레스 유발 요인을 정밀 분석하여 적합한 직무와 기업 문화를 매칭합니다.'
                    : '실제 합격 데이터 10만 건을 바탕으로 입사서류부터 면접까지 AI 기반의 심층 피드백을 제공합니다.'}
                </p>
                <div className="bg-[#FAFBFB] p-4 rounded-2xl border border-[#E3EBEE] space-y-2 text-xs">
                  <div className="font-bold text-[#12242D]">진단 세부 프로세스</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 font-light">
                    <li>개인 맞춤형 온라인 진단 링크 발송</li>
                    <li>전문 상담관의 1:1 결과 리포트 심층 해석</li>
                    <li>직무 역량 강화 및 이력서 스토리라인 반영</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-[#12242D] hover:bg-black text-white py-3 rounded-full text-xs font-semibold"
                >
                  진단 신청하기
                </button>
              </div>
            )}

            {/* Review Modal */}
            {activeModal.type === 'review' && activeModal.data && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full inline-block">
                  {activeModal.data.badge}
                </span>
                <h3 className="font-serif-kr text-xl font-bold text-[#12242D] leading-snug">
                  {activeModal.data.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {activeModal.data.name} · {activeModal.data.date}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-3 border-t border-slate-100 font-light whitespace-pre-line">
                  {activeModal.data.full}
                </p>
              </div>
            )}

            {/* Press Modal */}
            {activeModal.type === 'press' && activeModal.data && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full inline-block">
                  {activeModal.data.category}
                </span>
                <h3 className="font-serif-kr text-xl font-bold text-[#12242D] leading-snug">
                  {activeModal.data.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  등록일: {activeModal.data.date}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-3 border-t border-slate-100 font-light">
                  {activeModal.data.detail}
                </p>
              </div>
            )}

            {/* Map Modal */}
            {activeModal.type === 'map' && activeModal.data && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#EBF2F4] text-[#3D5C65] rounded-full inline-block">
                  {activeModal.data.region}
                </span>
                <h3 className="font-serif-kr text-xl font-bold text-[#12242D]">
                  {activeModal.data.slug}{branchSuffix(activeModal.data.slug)} 찾아오시는 길
                </h3>
                <div className="space-y-2 text-xs text-slate-600 bg-[#FAFBFB] p-4 rounded-2xl border border-[#E3EBEE]">
                  <div><strong>주소:</strong> {activeModal.data.address}</div>
                  <div><strong>전화:</strong> {activeModal.data.phone}</div>
                  <div><strong>운영시간:</strong> {activeModal.data.hours}</div>
                </div>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(activeModal.data.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#12242D] hover:bg-black text-white py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>네이버 지도에서 보기</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}

            {/* Gallery Modal */}
            {activeModal.type === 'gallery' && (
              <div className="space-y-4">
                <h3 className="font-serif-kr text-xl font-bold text-[#12242D]">
                  서울 본사 상담 공간 둘러보기
                </h3>
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden bg-slate-100 h-48">
                    <img
                      src={HERO_STUDIO_IMG}
                      alt="본사 메인 상담실"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/assets/images/hero_scandinavian_studio_1790127679019.jpg';
                      }}
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-slate-100 h-48">
                    <img
                      src={ARMCHAIR_IMG}
                      alt="1:1 컨설팅 데스크"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/assets/images/scandinavian_armchair_1790127692491.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN DASHBOARD MODAL
      ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative border border-slate-300">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#12242D] text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#12242D]">JMCAREER 통합 관리자</h3>
                <p className="text-xs text-slate-500">본사 및 전국 19개 지사 콘텐츠 통합 관리</p>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveAdminTab('branch')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'branch'
                    ? 'bg-[#12242D] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                지사별 관리 (19개소)
              </button>
              <button
                onClick={() => setActiveAdminTab('common')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeAdminTab === 'common'
                    ? 'bg-[#12242D] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                공통 콘텐츠 관리
              </button>
            </div>

            {/* Tab 1: Branch Editor */}
            {activeAdminTab === 'branch' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    {ADMIN_BRANCHES.map(b => (
                      <option key={b} value={b}>{b}{branchSuffix(b)}</option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-500">선택한 지사의 기본 정보와 상담관 정보를 편집합니다.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">대표 전화</label>
                    <input
                      type="text"
                      value={currentBranch.phone}
                      onChange={e => {
                        setBranches({
                          ...branches,
                          [selectedBranch]: { ...currentBranch, phone: e.target.value }
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">소속 권역</label>
                    <select
                      value={currentBranch.region}
                      onChange={e => {
                        setBranches({
                          ...branches,
                          [selectedBranch]: { ...currentBranch, region: e.target.value }
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      {BRANCH_REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">지사 상세 주소</label>
                    <input
                      type="text"
                      value={currentBranch.address}
                      onChange={e => {
                        setBranches({
                          ...branches,
                          [selectedBranch]: { ...currentBranch, address: e.target.value }
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={showSaveNotification}
                    className="bg-[#12242D] hover:bg-black text-white px-5 py-2 rounded-lg text-xs font-bold"
                  >
                    변경사항 저장하기
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Common Editor */}
            {activeAdminTab === 'common' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">수당 기준 연도</label>
                  <input
                    type="text"
                    value={benefitYear}
                    onChange={e => setBenefitYear(e.target.value)}
                    className="w-32 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">수당 안내 유의사항 문구</label>
                  <textarea
                    rows={2}
                    value={benefitNotice}
                    placeholder="비워두시면 고용노동부 기준 기본 문구가 자동으로 적용됩니다."
                    onChange={e => setBenefitNotice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={showSaveNotification}
                    className="bg-[#12242D] hover:bg-black text-white px-5 py-2 rounded-lg text-xs font-bold"
                  >
                    전체 지사에 일괄 반영
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

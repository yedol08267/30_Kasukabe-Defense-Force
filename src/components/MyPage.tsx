import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Check,
  AlertTriangle,
  Trash2,
  LogOut,
  Building,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Heart,
  TrendingDown,
  ShoppingBag,
  Save,
  RefreshCw,
  FileText,
  X,
  CreditCard,
  Sliders,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, WishlistItem, CartItem } from '../types';

interface MyPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onWithdrawAccount: () => void;
  wishlist: WishlistItem[];
  cartItems: CartItem[];
  onShowToast: (msg: string) => void;
  onNavigateTab: (tab: string) => void;
}

const PRESET_EMOJIS = ['🥑', '🥦', '🥕', '🥚', '🥩', '🍱', '🍜', '🍙', '🥗', '🥐', '🍋', '🛒'];
const AVATAR_BG_COLORS = ['#a3f69c', '#ffdbd1', '#cfe6ff', '#fde68a', '#e9d5ff', '#fed7aa'];
const UNIVERSITIES = [
  '광운대학교',
  '인덕대학교',
  '서울과학기술대학교',
  '삼육대학교',
  '서울여자대학교',
  '기타 대학교 / 일반 주민',
];
const HOUSING_TYPES = [
  '1인 원룸',
  '기숙사 (광운/인덕/행복)',
  '투룸 (룸메이트 거주)',
  '오피스텔',
  '고시원 / 쉐어하우스',
  '일반 주택 / 빌라',
];
const COOKING_FREQUENCIES = [
  '주 1~2회 (가벼운 집밥)',
  '주 3~4회 (알뜰 자취러)',
  '거의 매일 (요리 매니아)',
  '주말 집중 요리',
  '배달 위주 (가끔 요리)',
];
const ALL_DIETARY_TAGS = [
  '1인 소포장 선호',
  '신선 채소 파',
  '가성비 마트 탐방',
  '단백질 필수',
  '밀키트/간편식 애용',
  '저염/다이어트 식단',
  '타임세일 사냥꾼',
  '냉동 보관 마스터',
];

export const MyPage: React.FC<MyPageProps> = ({
  userProfile,
  onUpdateProfile,
  onWithdrawAccount,
  wishlist,
  cartItems,
  onShowToast,
  onNavigateTab,
}) => {
  // Form State
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'account' | 'lifestyle' | 'danger'>('profile');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('다른 지역으로 이사');
  const [withdrawConfirmText, setWithdrawConfirmText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryTags.includes(tag);
      const nextTags = exists
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag];
      return { ...prev, dietaryTags: nextTags };
    });
  };

  // Avatar Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      onShowToast('사진 용량은 2MB 이하만 지원됩니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
        onShowToast('프로필 사진이 임시 적용되었습니다. 하단 [변경사항 저장]을 눌러주세요.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSave = () => {
    if (!formData.name.trim() || !formData.nickname.trim()) {
      onShowToast('이름과 닉네임은 필수 입력 항목입니다.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      onShowToast('회원정보 및 프로필 변경사항이 안전하게 저장되었습니다!');
    }, 400);
  };

  // Final Withdraw Action
  const handleConfirmWithdraw = () => {
    if (withdrawConfirmText.trim() !== '탈퇴합니다') {
      onShowToast('확인 문구 "탈퇴합니다"를 정확히 입력해주세요.');
      return;
    }

    setIsWithdrawModalOpen(false);
    onWithdrawAccount();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Top Profile Header Hero */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3e3de] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#a3f69c]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#ffdbd1]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with Customization Trigger */}
          <div className="relative group shrink-0">
            <div
              style={{ backgroundColor: formData.avatarBgColor || '#a3f69c' }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center text-4xl shadow-md ring-4 ring-white border border-[#e3e3de]"
            >
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{formData.avatarEmoji || '🥑'}</span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-[#0d631b] hover:bg-[#084813] text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="프로필 사진 업로드"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* User Primary Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#1a1c19]">
                {formData.nickname}
              </span>
              <span className="text-xs text-[#707a6c] font-medium">({formData.name})</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#a3f69c] text-[#002204] px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#0d631b]" />
                월계1동 자취 인증
              </span>
              <span className="text-[11px] font-semibold bg-[#f4f4ef] text-[#40493d] px-2.5 py-0.5 rounded-full border border-[#e3e3de]">
                {formData.university}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#40493d] max-w-xl italic">
              "{formData.bio || '배달을 줄이고 집밥으로 자취 식비를 아껴요!'}"
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-[#707a6c] pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0d631b]" />
                {formData.district}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#707a6c]" />
                {formData.housingType}
              </span>
              <span>•</span>
              <span>가입일: {formData.joinedDate}</span>
            </div>
          </div>

          {/* Quick Stats Bento Box */}
          <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5 shrink-0 bg-[#fafaf4] p-3 rounded-2xl border border-[#e3e3de]">
            <button
              onClick={() => onNavigateTab('wishlist')}
              className="text-center p-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              <div className="text-[10px] text-[#707a6c] flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-[#fe5825]" />
                <span>찜 식재료</span>
              </div>
              <div className="text-base font-black text-[#1a1c19] mt-0.5">
                {wishlist.length}개
              </div>
            </button>

            <div className="text-center p-2 rounded-xl bg-white/70">
              <div className="text-[10px] text-[#707a6c] flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3 text-[#0d631b]" />
                <span>누적 절약</span>
              </div>
              <div className="text-base font-black text-[#0d631b] mt-0.5">
                {formData.savingsTotal.toLocaleString()}원
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('price-comparison')}
              className="text-center p-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              <div className="text-[10px] text-[#707a6c] flex items-center justify-center gap-1">
                <ShoppingBag className="w-3 h-3 text-[#2e7d32]" />
                <span>장바구니</span>
              </div>
              <div className="text-base font-black text-[#1a1c19] mt-0.5">
                {cartItems.length}품목
              </div>
            </button>

            <div className="text-center p-2 rounded-xl bg-white/70">
              <div className="text-[10px] text-[#707a6c] flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#fe5825]" />
                <span>가격 제보</span>
              </div>
              <div className="text-base font-black text-[#1a1c19] mt-0.5">
                {formData.reportsCount}건
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub Navigation Bar for MyPage */}
      <div className="flex items-center gap-2 border-b border-[#e3e3de] pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'profile'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#eeeee9]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>프로필 변경</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'account'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#eeeee9]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>회원정보 수정</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lifestyle')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'lifestyle'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#eeeee9]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>자취 식비 & 취향 설정</span>
        </button>

        <button
          onClick={() => setActiveSubTab('danger')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ml-auto ${
            activeSubTab === 'danger'
              ? 'bg-[#b02e00] text-white shadow-xs'
              : 'text-[#ba1a1a] hover:bg-[#ffdad6]/50'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>회원 탈퇴</span>
        </button>
      </div>

      {/* Main Form Content Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3e3de] shadow-xs">
        {/* SUBTAB 1: Profile Customization */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a1c19]">프로필 꾸미기 & 캐릭터 설정</h2>
              <p className="text-xs text-[#707a6c]">
                웰계장터 커뮤니티와 공유 링크에서 보여지는 내 프로필을 변경할 수 있습니다.
              </p>
            </div>

            {/* Avatar Emoji Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a1c19]">
                캐릭터 아이콘 선택 (아바타 사진 미등록 시 사용)
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, avatarEmoji: emoji, avatarUrl: '' }));
                    }}
                    className={`w-11 h-11 text-xl rounded-2xl flex items-center justify-center transition-all ${
                      formData.avatarEmoji === emoji && !formData.avatarUrl
                        ? 'bg-[#0d631b]/15 ring-2 ring-[#0d631b] scale-105 shadow-xs'
                        : 'bg-[#fafaf4] hover:bg-[#eeeee9] border border-[#e3e3de]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar BG Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a1c19]">아바타 배경 색상</label>
              <div className="flex items-center gap-2">
                {AVATAR_BG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((p) => ({ ...p, avatarBgColor: color }))}
                    className={`w-8 h-8 rounded-full border border-black/10 transition-transform ${
                      formData.avatarBgColor === color ? 'scale-125 ring-2 ring-[#0d631b]' : 'hover:scale-110'
                    }`}
                  />
                ))}
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, avatarUrl: '' }));
                      onShowToast('사진이 제거되고 기본 캐릭터 아이콘으로 복원되었습니다.');
                    }}
                    className="ml-4 text-xs text-[#b02e00] hover:underline"
                  >
                    등록된 사진 지우기
                  </button>
                )}
              </div>
            </div>

            {/* Nickname & Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">닉네임</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="예: 알뜰한 민지"
                  maxLength={16}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">실명 (비공개, 관리용)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="예: 김민지"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1c19]">한 줄 소개 / 자취 각오</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none resize-none"
                placeholder="자취 식비 절약 목표나 좋아하는 요리를 적어보세요."
                maxLength={80}
              />
              <span className="text-[10px] text-[#707a6c] text-right block">
                {formData.bio.length} / 80자
              </span>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Account & Personal Info */}
        {activeSubTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a1c19]">회원 정보 & 생활권 설정</h2>
              <p className="text-xs text-[#707a6c]">
                월계동 인근 학교 인증 정보와 알림 수신용 연락처를 관리합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">소속 대학 / 캠퍼스</label>
                <select
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none bg-white"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major / Grade */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">학과 및 학번 (선택)</label>
                <input
                  type="text"
                  value={formData.major || ''}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="예: 소프트웨어학부 22학번"
                />
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">거주 지역 생활권</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="예: 서울 노원구 월계1동"
                />
              </div>

              {/* Detailed Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">상세 생활 반경 (도보 기준)</label>
                <input
                  type="text"
                  value={formData.detailedAddress || ''}
                  onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="예: 광운대역 1번출구 인근 원룸가"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#0d631b]" />
                  <span>이메일 (식재료 시세 브리핑 수신)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="minji@kw.ac.kr"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#0d631b]" />
                  <span>휴대폰 번호 (긴급 반짝특가 알림)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* Linked Social Account Info */}
            <div className="bg-[#fafaf4] p-4 rounded-2xl border border-[#e3e3de] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#1a1c19]">연동된 간편 로그인 계정</div>
                <div className="text-xs text-[#707a6c]">Google Workspace 연동 계정: minji.kwangwoon@gmail.com</div>
              </div>
              <span className="text-[11px] font-bold text-[#0d631b] bg-[#a3f69c]/40 px-3 py-1 rounded-full shrink-0">
                인증 연동 완료
              </span>
            </div>
          </div>
        )}

        {/* SUBTAB 3: Lifestyle & Budget */}
        {activeSubTab === 'lifestyle' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#1a1c19]">자취 식비 목표 & 맞춤 식습관</h2>
              <p className="text-xs text-[#707a6c]">
                자취 형태와 주간 요리 빈도에 맞춰 최적화된 마트 추천과 1인분 장보기 코스를 제공합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Housing Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">주거 형태</label>
                <select
                  value={formData.housingType}
                  onChange={(e) => handleInputChange('housingType', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none bg-white"
                >
                  {HOUSING_TYPES.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cooking Frequency */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c19]">요리 / 식사 빈도</label>
                <select
                  value={formData.cookingFrequency}
                  onChange={(e) => handleInputChange('cookingFrequency', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e3e3de] focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none bg-white"
                >
                  {COOKING_FREQUENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monthly Budget Slider */}
            <div className="bg-[#fafaf4] p-5 rounded-2xl border border-[#e3e3de] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1a1c19]">월 목표 식비 예산</div>
                  <div className="text-[11px] text-[#707a6c]">
                    예산 초과 위험 시 오늘의 식재료에서 초절약 대체 레시피를 우선 알림합니다.
                  </div>
                </div>
                <div className="text-lg font-black text-[#0d631b]">
                  {Number(formData.monthlyBudget).toLocaleString()}원
                </div>
              </div>

              <input
                type="range"
                min="100000"
                max="500000"
                step="10000"
                value={formData.monthlyBudget}
                onChange={(e) => handleInputChange('monthlyBudget', Number(e.target.value))}
                className="w-full accent-[#0d631b] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-[#707a6c]">
                <span>10만원 (절약 고수)</span>
                <span>25만원 (평균 자취)</span>
                <span>50만원</span>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a1c19]">
                관심 식재료 취향 태그 (중복 선택)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_DIETARY_TAGS.map((tag) => {
                  const selected = formData.dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selected
                          ? 'bg-[#0d631b] text-white shadow-xs'
                          : 'bg-[#fafaf4] text-[#40493d] border border-[#e3e3de] hover:bg-[#eeeee9]'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: Danger Zone (회원 탈퇴) */}
        {activeSubTab === 'danger' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#ffdad6]/40 rounded-2xl border border-[#ba1a1a]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#ba1a1a] font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>회원 탈퇴 시 주의사항 안내</span>
              </div>
              <ul className="text-xs text-[#40493d] space-y-1 list-disc list-inside">
                <li>관심 등록하신 찜 식재료 {wishlist.length}개 및 최저가 변동 추적 내역이 영구 삭제됩니다.</li>
                <li>일일 아침 식재료 브리핑 및 카카오/이메일 알림이 즉시 중단됩니다.</li>
                <li>누적 절약 금액({formData.savingsTotal.toLocaleString()}원) 및 장바구니 품목이 모두 초기화됩니다.</li>
                <li>탈퇴 후 동일 정보로 재가입 시 기존 기록은 복구되지 않습니다.</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>웰계장터 회원 탈퇴 신청하기</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Global Save / Reset Action Bar (Hidden in Danger Tab) */}
        {activeSubTab !== 'danger' && (
          <div className="mt-8 pt-6 border-t border-[#e3e3de] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...userProfile });
                onShowToast('원래 저장된 정보로 되돌렸습니다.');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#e3e3de] text-[#40493d] hover:bg-[#fafaf4] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>원래대로 초기화</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#084813] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>변경사항 저장하기</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Withdrawal Confirmation Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e3e3de] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#fafaf4] flex items-center justify-center text-[#707a6c]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#1a1c19]">정말 탈퇴하시겠어요?</h3>
              <p className="text-xs text-[#707a6c]">
                탈퇴 시 월계동 최저가 찜 목록과 알림 설정이 즉시 소멸됩니다.
              </p>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a1c19]">탈퇴 사유를 알려주세요</label>
              <div className="space-y-1.5 text-xs text-[#40493d]">
                {[
                  '다른 지역으로 이사 (월계동 외 거주)',
                  '원하는 식재료 가격 정보가 부족함',
                  '자취가 끝나고 본가로 귀가',
                  '개인정보 완전 삭제 희망',
                  '기타 이유',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 p-2 rounded-xl border border-[#e3e3de] hover:bg-[#fafaf4] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="withdrawReason"
                      checked={withdrawReason === reason}
                      onChange={() => setWithdrawReason(reason)}
                      className="accent-[#ba1a1a]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security confirmation text input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#ba1a1a]">
                확인을 위해 아래 입력창에 <span className="underline">탈퇴합니다</span>를 적어주세요.
              </label>
              <input
                type="text"
                value={withdrawConfirmText}
                onChange={(e) => setWithdrawConfirmText(e.target.value)}
                placeholder="탈퇴합니다"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ba1a1a]/40 focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e3e3de] text-xs font-bold text-[#40493d] hover:bg-[#fafaf4] transition-colors"
              >
                취소 (계속 이용하기)
              </button>

              <button
                type="button"
                onClick={handleConfirmWithdraw}
                disabled={withdrawConfirmText.trim() !== '탈퇴합니다'}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                  withdrawConfirmText.trim() === '탈퇴합니다'
                    ? 'bg-[#ba1a1a] hover:bg-[#93000a] shadow-sm cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                최종 탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

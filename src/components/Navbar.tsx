import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Bell,
  MapPin,
  ChevronDown,
  Check,
  User,
  Menu,
  X,
  Sparkles,
  Heart,
  Scale,
  Settings,
  Info,
  Store,
  ChevronRight,
} from 'lucide-react';
import welgyeLogo from '../assets/images/welgye_mascot_logo_1790923061344.jpg';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  userProfile: UserProfile;
  onOpenMartMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  wishlistCount,
  selectedDistrict,
  onSelectDistrict,
  userProfile,
  onOpenMartMap,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showNoticeToast, setShowNoticeToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const districts = [
    { id: 'wolgye1', name: '월계1동', note: '광운대·석계역 골목상권 (기본)' },
    { id: 'wolgye2', name: '월계2동', note: '인덕대·월계역 상권' },
    { id: 'wolgye3', name: '월계3동', note: '이마트타운·트레이더스 상권' },
  ];

  // Prevent background scroll when mobile drawer is open & handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowLocationDropdown(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (tabKey: string) => {
    onSelectTab(tabKey);
    setIsMobileMenuOpen(false);
  };

  const handleMartMapClick = () => {
    if (onOpenMartMap) {
      onOpenMartMap();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#fafaf4]/95 backdrop-blur-md border-b border-[#e3e3de] shadow-xs">
        <div className="h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Location Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('service-story')}
              className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
              title="웰계장터 홈으로 이동"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#e3e3de] overflow-hidden flex items-center justify-center shadow-xs group-hover:border-[#0d631b] group-hover:scale-105 transition-all p-0.5 shrink-0">
                <img
                  src={welgyeLogo}
                  alt="웰계장터 대표 마스코트"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col shrink-0">
                <span className="font-bold text-base sm:text-lg text-[#0d631b] tracking-tight leading-none whitespace-nowrap">
                  웰계장터
                </span>
                <span className="text-[10px] text-[#707a6c] font-medium leading-tight whitespace-nowrap hidden min-[360px]:block">
                  월계1동 1인 최저가
                </span>
              </div>
            </button>

            {/* Location Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1 bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#1a1c19] px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                type="button"
                title="생활권 동네 변경"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0d631b] shrink-0" />
                <span className="whitespace-nowrap">{selectedDistrict}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#707a6c] shrink-0" />
              </button>

              {showLocationDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e3e3de] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-[#707a6c] px-3 py-1.5 border-b border-[#eeeee9]">
                    생활권 동네 선택 (도보 반경)
                  </div>
                  {districts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDistrict(d.name);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        selectedDistrict === d.name
                          ? 'bg-[#a3f69c]/30 text-[#0d631b] font-bold'
                          : 'hover:bg-[#f4f4ef] text-[#1a1c19]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{d.name}</div>
                        <div className="text-[11px] text-[#707a6c]">{d.note}</div>
                      </div>
                      {selectedDistrict === d.name && (
                        <Check className="w-4 h-4 text-[#0d631b]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Desktop Navigation (Visible on lg and up, zero line breaks, full whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f4f4ef] p-1 rounded-2xl border border-[#e3e3de] shrink-0">
            <button
              onClick={() => onSelectTab('today-digest')}
              className={`px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 leading-normal cursor-pointer ${
                currentTab === 'today-digest'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#e8e8e3]'
              }`}
            >
              오늘의 식재료
            </button>
            <button
              onClick={() => onSelectTab('wishlist')}
              className={`px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-normal cursor-pointer ${
                currentTab === 'wishlist'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#e8e8e3]'
              }`}
            >
              <span className="whitespace-nowrap">식재료 찜 대시보드</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 leading-none ${
                  currentTab === 'wishlist'
                    ? 'bg-white text-[#2e7d32]'
                    : 'bg-[#e3e3de] text-[#40493d]'
                }`}
              >
                {wishlistCount}
              </span>
            </button>
            <button
              onClick={() => onSelectTab('price-comparison')}
              className={`px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 leading-normal cursor-pointer ${
                currentTab === 'price-comparison'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#e8e8e3]'
              }`}
            >
              마트별 가격비교
            </button>
            <button
              onClick={onOpenMartMap}
              className="px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl text-[#0d631b] hover:bg-[#e8f5e9] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 leading-normal"
              title="내 근처 마트(지도) - 월계1동 골목마트 위치 및 오늘 영업시간"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0d631b] shrink-0" />
              <span className="whitespace-nowrap">내 근처 마트</span>
            </button>
            <button
              onClick={() => onSelectTab('alert-settings')}
              className={`px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 leading-normal cursor-pointer ${
                currentTab === 'alert-settings'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#e8e8e3]'
              }`}
            >
              알림 설정
            </button>
            <button
              onClick={() => onSelectTab('service-story')}
              className={`px-3 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 leading-normal cursor-pointer ${
                currentTab === 'service-story'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-[#40493d] hover:text-[#1a1c19] hover:bg-[#e8e8e3]'
              }`}
            >
              서비스 소개
            </button>
          </nav>

          {/* Right Controls: Notice, Cart, User Badge, Hamburger Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Button */}
            <button
              onClick={() => {
                setShowNoticeToast(true);
                setTimeout(() => setShowNoticeToast(false), 3500);
              }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[#40493d] hover:bg-[#eeeee9] transition-colors cursor-pointer shrink-0"
              title="오늘의 알림 상태"
              aria-label="알림"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fe5825] ring-2 ring-white animate-pulse" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[#40493d] hover:bg-[#eeeee9] transition-colors cursor-pointer shrink-0"
              title="장바구니 보기"
              aria-label="장바구니"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b02e00] text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Button with School Badge (Strict white-space: nowrap) */}
            <button
              onClick={() => handleNavClick('mypage')}
              className={`flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                currentTab === 'mypage'
                  ? 'bg-[#e8f5e9] border-[#0d631b] ring-2 ring-[#0d631b]/30 shadow-xs'
                  : 'border-[#e3e3de] hover:border-[#a3f69c] hover:bg-[#eeeee9]/80'
              }`}
              title="마이페이지 열기"
            >
              <div
                style={{ backgroundColor: userProfile.avatarBgColor || '#a3f69c' }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden text-[#002204] font-bold text-xs flex items-center justify-center ring-1 ring-[#0d631b]/30 shrink-0"
              >
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userProfile.avatarEmoji || userProfile.nickname.slice(0, 2)}</span>
                )}
              </div>
              <div className="text-left hidden sm:flex flex-col shrink-0 min-w-0">
                <div className="text-xs font-bold text-[#1a1c19] leading-tight flex items-center gap-1.5 whitespace-nowrap">
                  <span className="truncate max-w-[68px] xl:max-w-[85px] whitespace-nowrap">
                    {userProfile.nickname}
                  </span>
                  {userProfile.university && (
                    <span
                      className="text-[10px] text-[#0d631b] font-bold bg-[#a3f69c]/40 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 inline-flex items-center justify-center min-w-[28px] leading-none"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {userProfile.university.replace('대학교', '')}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#707a6c] block whitespace-nowrap">마이페이지</span>
              </div>
            </button>

            {/* Responsive Hamburger Menu Button (Visible on screens < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl text-[#1a1c19] hover:bg-[#eeeee9] active:bg-[#e3e3de] transition-colors shrink-0 cursor-pointer border border-[#e3e3de]"
              aria-label={isMobileMenuOpen ? '전체 메뉴 닫기' : '전체 메뉴 열기'}
              aria-expanded={isMobileMenuOpen}
              title="전체 메뉴"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#1a1c19]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1a1c19]" />
              )}
            </button>
          </div>
        </div>

        {/* Bell Quick Notice Dropdown */}
        {showNoticeToast && (
          <div className="absolute right-4 top-18 bg-white border border-[#e3e3de] p-3 rounded-2xl shadow-xl z-50 text-xs w-72 sm:w-80 animate-in fade-in duration-200">
            <div className="font-bold text-[#0d631b] flex items-center gap-1 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0d631b]" />
              오늘 아침 08:30 식재료 시세 업데이트 완료
            </div>
            <p className="text-[#40493d] leading-relaxed">
              찜하신 대파(석계 알뜰청과 1,400원)와 계란 10구(월계 화랑마트 2,790원)가 현장 확인 최저가로 등록되었습니다.
            </p>
          </div>
        )}
      </header>

      {/* Responsive Hamburger Drawer Menu for Narrow Screens (< lg) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Menu Panel */}
          <aside className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-[#fafaf4] shadow-2xl border-l border-[#e3e3de] flex flex-col z-50 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e3e3de] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#e3e3de] overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                  <img
                    src={welgyeLogo}
                    alt="웰계장터"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-base text-[#0d631b] leading-tight">
                    웰계장터
                  </div>
                  <div className="text-[11px] text-[#707a6c]">
                    월계1동 1인 식재료 최저가
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#40493d] hover:bg-[#eeeee9] transition-colors cursor-pointer"
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card inside Drawer */}
            <div className="p-4 bg-[#f4f4ef] border-b border-[#e3e3de] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: userProfile.avatarBgColor || '#a3f69c' }}
                  className="w-11 h-11 rounded-full overflow-hidden text-[#002204] font-bold text-sm flex items-center justify-center ring-2 ring-[#0d631b]/30 shrink-0"
                >
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userProfile.avatarEmoji || userProfile.nickname.slice(0, 2)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold text-sm text-[#1a1c19] truncate">
                      {userProfile.nickname}
                    </span>
                    {userProfile.university && (
                      <span
                        className="text-[11px] text-[#0d631b] font-bold bg-[#a3f69c]/50 px-2 py-0.5 rounded whitespace-nowrap shrink-0 inline-flex items-center justify-center min-w-[28px] leading-none"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {userProfile.university.replace('대학교', '')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#707a6c] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#0d631b]" />
                    <span>{selectedDistrict} 생활권</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('mypage')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#e3e3de] hover:border-[#0d631b] text-[#0d631b] transition-colors shrink-0 cursor-pointer"
                >
                  마이페이지
                </button>
              </div>
            </div>

            {/* District Quick Selector in Drawer */}
            <div className="px-4 py-3 border-b border-[#e3e3de] bg-white shrink-0">
              <div className="text-[11px] font-bold text-[#707a6c] mb-2 flex items-center justify-between">
                <span>📍 생활권 동네 선택</span>
                <span className="text-[10px] text-[#0d631b] font-semibold">
                  {selectedDistrict} 적용 중
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(d.name)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                      selectedDistrict === d.name
                        ? 'bg-[#0d631b] text-white shadow-xs'
                        : 'bg-[#f4f4ef] text-[#40493d] hover:bg-[#eeeee9]'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Links List */}
            <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
              {/* 1. 오늘의 식재료 */}
              <button
                onClick={() => handleNavClick('today-digest')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentTab === 'today-digest'
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#f4f4ef] text-[#1a1c19] border border-[#eeeee9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentTab === 'today-digest'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e8f5e9] text-[#0d631b]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold whitespace-nowrap">오늘의 식재료</div>
                    <div
                      className={`text-xs ${
                        currentTab === 'today-digest' ? 'text-white/80' : 'text-[#707a6c]'
                      }`}
                    >
                      오전 8:30 당일 신선 특가
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* 2. 식재료 찜 대시보드 */}
              <button
                onClick={() => handleNavClick('wishlist')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentTab === 'wishlist'
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#f4f4ef] text-[#1a1c19] border border-[#eeeee9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentTab === 'wishlist'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#ffebed] text-[#e53935]'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1.5 whitespace-nowrap">
                      <span>식재료 찜 대시보드</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold whitespace-nowrap ${
                          currentTab === 'wishlist'
                            ? 'bg-white text-[#0d631b]'
                            : 'bg-[#fe5825] text-white'
                        }`}
                      >
                        {wishlistCount}
                      </span>
                    </div>
                    <div
                      className={`text-xs ${
                        currentTab === 'wishlist' ? 'text-white/80' : 'text-[#707a6c]'
                      }`}
                    >
                      찜 품목 최저가 추적 & 최적 동선
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* 3. 마트별 가격비교 */}
              <button
                onClick={() => handleNavClick('price-comparison')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentTab === 'price-comparison'
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#f4f4ef] text-[#1a1c19] border border-[#eeeee9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentTab === 'price-comparison'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e3f2fd] text-[#1976d2]'
                    }`}
                  >
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold whitespace-nowrap">마트별 가격비교</div>
                    <div
                      className={`text-xs ${
                        currentTab === 'price-comparison' ? 'text-white/80' : 'text-[#707a6c]'
                      }`}
                    >
                      골목마트 3곳 품목별 전수 대조
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* 4. 내 근처 마트 (지도) */}
              <button
                onClick={handleMartMapClick}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer bg-white hover:bg-[#e8f5e9]/50 text-[#1a1c19] border border-[#eeeee9]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#e8f5e9] text-[#0d631b] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0d631b] whitespace-nowrap">
                      내 근처 마트 (지도)
                    </div>
                    <div className="text-xs text-[#707a6c]">
                      화랑마트·알뜰청과·골목식자재 위치
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#0d631b]" />
              </button>

              {/* 5. 알림 설정 */}
              <button
                onClick={() => handleNavClick('alert-settings')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentTab === 'alert-settings'
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#f4f4ef] text-[#1a1c19] border border-[#eeeee9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentTab === 'alert-settings'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#fff3e0] text-[#e65100]'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold whitespace-nowrap">알림 설정</div>
                    <div
                      className={`text-xs ${
                        currentTab === 'alert-settings' ? 'text-white/80' : 'text-[#707a6c]'
                      }`}
                    >
                      가격 급락 푸시 & 알림 시간대
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* 6. 서비스 소개 */}
              <button
                onClick={() => handleNavClick('service-story')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentTab === 'service-story'
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#f4f4ef] text-[#1a1c19] border border-[#eeeee9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      currentTab === 'service-story'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f3e5f5] text-[#7b1fa2]'
                    }`}
                  >
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold whitespace-nowrap">서비스 소개</div>
                    <div
                      className={`text-xs ${
                        currentTab === 'service-story' ? 'text-white/80' : 'text-[#707a6c]'
                      }`}
                    >
                      월계1동 1인 가구 알뜰 장보기 이야기
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </nav>

            {/* Drawer Bottom Action: Cart Button */}
            <div className="p-4 border-t border-[#e3e3de] bg-white mt-auto shrink-0">
              <button
                onClick={() => {
                  onOpenCart();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between bg-[#0d631b] hover:bg-[#094c14] text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>장바구니 확인하기</span>
                </div>
                {cartCount > 0 ? (
                  <span className="bg-white text-[#0d631b] text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}개 품목
                  </span>
                ) : (
                  <span className="text-white/70 text-xs">비어있음</span>
                )}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import {
  Inbox,
  Clock,
  SlidersHorizontal,
  CloudRain,
  Flame,
  ArrowRight,
  ShoppingCart,
  Check,
  UtensilsCrossed,
  MapPin,
  Share2,
  CheckSquare,
  HelpCircle,
  TrendingDown,
  Layers,
  Mail,
  Table as TableIcon,
  Store,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { PriceRecord, WishlistItem, MartStatus } from '../types';
import { TODAYS_RECIPE, MARTS_INFO, APP_STATS } from '../data/mockData';
import { SourceBadge } from './SourceBadge';

interface TodayDigestProps {
  wishlist: WishlistItem[];
  priceRecords: PriceRecord[];
  onAddToCart: (record: PriceRecord) => void;
  onOpenWishlist: () => void;
  onOpenAlertSettings: () => void;
  onOpenPriceComparison: () => void;
  onOpenRouteModal: () => void;
  onOpenReportModal: () => void;
  onOpenAddWishModal: () => void;
  onShowToast: (msg: string) => void;
  onOpenMartMap?: (martId?: string) => void;
}

export const TodayDigest: React.FC<TodayDigestProps> = ({
  wishlist,
  priceRecords,
  onAddToCart,
  onOpenWishlist,
  onOpenAlertSettings,
  onOpenPriceComparison,
  onOpenRouteModal,
  onOpenReportModal,
  onOpenAddWishModal,
  onShowToast,
  onOpenMartMap,
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'mail' | 'table'>('card');
  const [portionFilter, setPortionFilter] = useState<'all' | 'single' | 'urgent'>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Super Deals TOP 3
  const topDeals = priceRecords.filter((r) => r.isSpecialDeal).slice(0, 3);

  // Filtered price items
  const filteredItems = priceRecords.filter((item) => {
    if (portionFilter === 'single') return item.soloPortionUnit.includes('1인') || item.soloPortionUnit.includes('자취');
    if (portionFilter === 'urgent') return item.specialDealLabel?.includes('마감') || item.specialDealLabel?.includes('타임세일');
    return true;
  });

  const handleAddToCartWithFeedback = (item: PriceRecord) => {
    onAddToCart(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
    onShowToast(`'${item.ingredientName}' 장바구니에 담겼습니다!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '웰계장터 오늘의 식재료',
          text: '월계1동 1인 가구 자취생 식재료 최저가 브리핑! 오늘 대파, 계란 10구 특가 떴어요.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `[웰계장터 오늘의 식재료 브리핑]\n월계1동 자취생 필수 식재료 어제보다 ${APP_STATS.dailyDiscountTrend} 저렴!\n• 대파 반단: 1,400원 (석계 알뜰청과)\n• 두부 1모: 990원 (월계 화랑마트)\n• 계란 10구: 2,790원 (월계 화랑마트)\n\n링크: ${window.location.href}`
      );
      onShowToast('식재료 요약본이 클립보드에 복사되었습니다! 친구나 룸메이트에게 공유하세요.');
    }
  };

  const handleCopyChecklist = () => {
    const lines = wishlist
      .map((w) => `[ ] ${w.name} (${w.unit}) - ${w.currentLowestPrice.toLocaleString()}원 @ ${w.lowestStore}`)
      .join('\n');
    const text = `📋 [웰계장터] 오늘 월계1동 장보기 체크리스트\n\n${lines}\n\n* 추천 출발: 광운대역 1번출구 (도보 12분 코스)`;
    navigator.clipboard.writeText(text);
    onShowToast('오늘 장보기 체크리스트가 복사되었습니다!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Top Scheduled Notification Announcement Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f4f4ef] px-5 py-3 rounded-2xl border border-[#e3e3de] shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#fe5825] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Inbox className="w-4 h-4" />
          </span>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            <span className="font-bold text-[#1a1c19] shrink-0">
              오늘 {APP_STATS.briefingTime} 정기 브리핑 발행 완료
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#40493d] bg-white border border-[#e3e3de] px-2.5 py-0.5 rounded-full shadow-2xs">
                <span>공공데이터 기준 시세는 <strong className="text-[#1976d2] font-bold">오전 06:00</strong>, 현장 확인 가격은 <strong className="text-[#0d631b] font-bold">오전 07:15</strong> 업데이트</span>
              </span>
              <div className="flex items-center gap-1">
                <SourceBadge source="공공데이터 기준" detail="KAMIS 공식 시세 오전 06:00" />
                <SourceBadge source="현장 확인" detail="골목마트 매장 확인 오전 07:15" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={onOpenAlertSettings}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[#40493d] hover:bg-[#e8e8e3] transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#0d631b]" />
            <span>발송 시간: 매일 아침 08:30</span>
          </button>
          <button
            onClick={onOpenAlertSettings}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#e3e3de] hover:bg-[#0d631b] hover:text-white text-[#1a1c19] font-medium transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>알림 주기 변경</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid Architecture (Main 70% : Sidebar 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (lg:col-span-8) */}
        <section className="lg:col-span-8 space-y-6">
          {/* Hero Greeting & Price Index */}
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#e3e3de]">
            <div className="relative z-10 space-y-4">
              {/* Badges & Timestamp */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="inline-flex items-center gap-1.5 bg-[#a3f69c]/50 text-[#002204] px-3 py-1 rounded-full font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#0d631b]"></span>
                  <span>월계1동 1인 가구 물가 인덱스</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <SourceBadge source="공공데이터 기준" detail="KAMIS 농산물유통정보 (오전 06:00 연계)" />
                  <SourceBadge source="현장 확인" detail="월계1동 3대 마트 실측 (오전 07:15 수집)" />
                  <span className="text-[#707a6c] text-[11px]">
                    공공데이터 오전 06:00 | 현장 확인 오전 07:15
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c19] tracking-tight">
                  좋은 아침이에요 민지님! <span className="inline-block hover:scale-110 transition-transform">🌞</span>
                </h1>
                <p className="text-base sm:text-lg text-[#0d631b] font-bold">
                  월계1동 장바구니 필수템, 어제보다 <span className="text-[#b02e00] font-black">-8.4%</span> 저렴해요!
                </p>
              </div>

              {/* Buying Tip Card */}
              <div className="flex items-start sm:items-center gap-3 p-3.5 bg-[#f4f4ef] rounded-2xl border border-[#e3e3de]">
                <div className="w-10 h-10 rounded-xl bg-[#ffdbd1] text-[#b02e00] flex items-center justify-center shrink-0">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#1a1c19]">주말 비 소식 전 산지 직송 물량 방출</div>
                  <p className="text-xs text-[#40493d] mt-0.5 leading-relaxed">
                    석계·광운대 상권에서 대파와 애호박 가격이 급락했어요. 오늘 저녁 찌개 재료로 알뜰하게 챙겨보세요!
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#0d631b] shrink-0 bg-white px-2.5 py-1 rounded-full shadow-2xs">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>절약 지수 A+</span>
                </div>
              </div>
            </div>

            {/* Organic Background Blobs */}
            <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-[#a3f69c]/20 blur-3xl pointer-events-none" />
            <div className="absolute right-28 -bottom-12 w-52 h-52 rounded-full bg-[#ffdbd1]/30 blur-2xl pointer-events-none" />
          </div>

          {/* View Mode Switcher & Quick Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* View Toggle */}
            <div className="inline-flex p-1 bg-[#eeeee9] rounded-2xl">
              <button
                onClick={() => setViewMode('card')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'card'
                    ? 'bg-white text-[#0d631b] shadow-xs'
                    : 'text-[#40493d] hover:text-[#1a1c19]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>카드뉴스 뷰</span>
              </button>
              <button
                onClick={() => setViewMode('mail')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'mail'
                    ? 'bg-white text-[#0d631b] shadow-xs'
                    : 'text-[#40493d] hover:text-[#1a1c19]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>메일 본문 형태</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-[#0d631b] shadow-xs'
                    : 'text-[#40493d] hover:text-[#1a1c19]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>테이블 시세 비교</span>
              </button>
            </div>

            {/* Quick Portion Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
              <span className="text-[#707a6c] shrink-0 text-[11px]">소분 단위:</span>
              <button
                onClick={() => setPortionFilter('all')}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  portionFilter === 'all'
                    ? 'bg-[#0d631b] text-white'
                    : 'bg-white text-[#40493d] hover:bg-[#eeeee9] border border-[#e3e3de]'
                }`}
              >
                전체 보기
              </button>
              <button
                onClick={() => setPortionFilter('single')}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  portionFilter === 'single'
                    ? 'bg-[#0d631b] text-white'
                    : 'bg-white text-[#40493d] hover:bg-[#eeeee9] border border-[#e3e3de]'
                }`}
              >
                1인 소분(1~2인)
              </button>
              <button
                onClick={() => setPortionFilter('urgent')}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  portionFilter === 'urgent'
                    ? 'bg-[#0d631b] text-white'
                    : 'bg-white text-[#40493d] hover:bg-[#eeeee9] border border-[#e3e3de]'
                }`}
              >
                마감임박만
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: CARD NEWS VIEW */}
          {viewMode === 'card' && (
            <div className="space-y-6">
              {/* Section: TOP 3 Super Deals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#fe5825] flex items-center justify-center text-white shadow-xs">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-lg text-[#1a1c19] tracking-tight">
                          오늘의 자취생 추천 특가 TOP 3
                        </h2>
                        <SourceBadge source="현장 확인" detail="오전 07:15 매장 방문 확인" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenPriceComparison}
                    className="text-xs text-[#0d631b] font-bold hover:underline flex items-center gap-1"
                  >
                    전체 14개 특가 보기 <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3-Column Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topDeals.map((deal, idx) => {
                    const discount = deal.originalPrice
                      ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
                      : 30;
                    return (
                      <article
                        key={deal.id}
                        className="flex flex-col bg-white rounded-3xl p-4 shadow-xs hover:shadow-md transition-all border border-[#e3e3de] relative group"
                      >
                        {/* Rank Badge */}
                        <div
                          className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm ${
                            idx === 0 ? 'bg-[#fe5825]' : 'bg-[#1a1c19]'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* Image Holder */}
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#eeeee9] mb-3">
                          <img
                            src={deal.imageUrl}
                            alt={deal.ingredientName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback for broken images
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#0d631b] text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {deal.soloPortionUnit}
                          </div>
                          {deal.stockCount && deal.stockCount <= 15 && (
                            <div className="absolute bottom-2 right-2 bg-[#fe5825] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              남은 {deal.stockCount}개 마감임박
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 gap-1">
                          <div className="flex items-center justify-between text-[#707a6c] text-[11px] gap-1">
                            <span className="truncate font-semibold">{deal.storeName}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <SourceBadge source={deal.dataSource} detail={deal.sourceDetail} />
                              <span className="text-[#0d631b] font-bold">{deal.storeDistance}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-sm text-[#1a1c19] line-clamp-1">
                            {deal.ingredientName}
                          </h3>

                          <div className="flex items-baseline gap-1 mt-auto pt-2">
                            <span className="text-base font-black text-[#0d631b]">-{discount}%</span>
                            <span className="text-lg font-black text-[#1a1c19] tabular-nums">
                              {deal.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#1a1c19]">원</span>
                            {deal.originalPrice && (
                              <span className="text-[11px] text-[#707a6c] line-through ml-auto tabular-nums">
                                {deal.originalPrice.toLocaleString()}원
                              </span>
                            )}
                          </div>

                          <div className="bg-[#f4f4ef] px-2.5 py-1.5 rounded-xl text-[10px] text-[#40493d] flex items-center justify-between mt-1.5">
                            <span>{deal.unitPriceDesc}</span>
                            <span className="text-[#0d631b] font-bold">평균 이하</span>
                          </div>

                          <button
                            onClick={() => handleAddToCartWithFeedback(deal)}
                            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                              addedIds[deal.id]
                                ? 'bg-[#0d631b] text-white'
                                : 'bg-[#2e7d32] hover:bg-[#0d631b] text-white active:scale-98'
                            }`}
                          >
                            {addedIds[deal.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                담김 완료!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                장바구니 담기
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Section: Today's 10-Minute Solo Meal & Smart Market Route */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#a3f69c] text-[#002204] flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-[#1a1c19]">
                        오늘의 10분 자취밥상 & 스마트 장보기 코스
                      </h2>
                      <p className="text-xs text-[#707a6c]">{TODAYS_RECIPE.subtitle}</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto bg-[#a3f69c]/40 text-[#0d631b] font-bold text-xs px-3 py-1 rounded-full">
                    한 끼 예상 조리비 {TODAYS_RECIPE.estimatedCost.toLocaleString()}원
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-[#f4f4ef] p-4 sm:p-5 rounded-2xl border border-[#e3e3de]">
                  {/* Meal Photo */}
                  <div className="md:col-span-4 relative rounded-2xl overflow-hidden h-48 bg-[#eeeee9]">
                    <img
                      src={TODAYS_RECIPE.imageUrl}
                      alt={TODAYS_RECIPE.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-lg">
                      ⏱ 조리 시간 {TODAYS_RECIPE.cookingTime}
                    </div>
                  </div>

                  {/* Recipe & Workflow */}
                  <div className="md:col-span-8 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1a1c19]">
                        {TODAYS_RECIPE.title}
                      </h3>
                      <span className="text-[11px] bg-white border border-[#e3e3de] text-[#707a6c] px-2 py-0.5 rounded-md font-medium">
                        {TODAYS_RECIPE.difficulty}
                      </span>
                    </div>

                    {/* Ingredient Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {TODAYS_RECIPE.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#e3e3de] text-[#1a1c19] text-xs shadow-2xs"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ing.isFromHome ? 'bg-[#707a6c]' : i === 0 ? 'bg-[#0d631b]' : 'bg-[#fe5825]'
                            }`}
                          />
                          <span>
                            {ing.name} {ing.price > 0 && `(${ing.store} ${ing.price.toLocaleString()}원)`}
                          </span>
                        </span>
                      ))}
                    </div>

                    {/* Quick Step Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#40493d] mt-1">
                      {TODAYS_RECIPE.steps.map((st, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-[#e3e3de] flex flex-col gap-0.5">
                          <span className="text-[10px] font-extrabold text-[#0d631b]">{st.step}</span>
                          <span className="text-[11px] leading-snug">{st.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Route Suggestion Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#e3e3de]">
                      <div className="flex items-center gap-1.5 text-xs text-[#1a1c19]">
                        <MapPin className="w-3.5 h-3.5 text-[#0d631b]" />
                        <span>
                          추천 픽업 동선: <strong>광운대역 1번 출구 → 월계 화랑마트(두부 990원) → 석계 알뜰청과(대파 1,400원) → 귀가길(총 12분)</strong>
                        </span>
                      </div>
                      <button
                        onClick={onOpenRouteModal}
                        className="text-xs text-[#0d631b] font-bold hover:underline self-end sm:self-auto shrink-0 flex items-center gap-1"
                      >
                        동선 지도 보기 <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: EMAIL FORMAT PREVIEW */}
          {viewMode === 'mail' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#e3e3de] space-y-6">
              {/* Mock Email Header */}
              <div className="p-4 bg-[#f4f4ef] rounded-2xl border border-[#e3e3de] space-y-1.5 text-xs text-[#40493d]">
                <div className="flex justify-between">
                  <span className="font-bold text-[#1a1c19]">발신: 웰계장터 아침 알림팀 &lt;digest@welgye.market&gt;</span>
                  <span className="text-[#707a6c]">2026. 10. 05. 오전 08:30:00</span>
                </div>
                <div>
                  <span className="font-bold text-[#1a1c19]">수신: </span>
                  <span>minji.kwangwoon@gmail.com (김민지님)</span>
                </div>
                <div className="pt-1 font-bold text-sm text-[#0d631b]">
                  [웰계장터 브리핑] 🌞 민지님, 오늘 월계1동 장바구니 필수 식재료 -8.4% 할인 시작!
                </div>
              </div>

              {/* Newsletter Body */}
              <div className="prose prose-sm max-w-none text-[#1a1c19] space-y-4">
                <p className="text-sm leading-relaxed">
                  안녕하세요 민지님! <strong>웰계장터</strong>가 조사한 월계1동 골목마트 당일 시세 요약본입니다. (공공데이터 기준 시세는 오전 06:00, 현장 확인 가격은 오전 07:15 업데이트)
                  오늘 아침 광운대·석계역 상권에서 찜해두신 신선란 10구와 두부 1모가 큰 폭으로 할인 중입니다.
                </p>

                <div className="border-l-4 border-[#0d631b] pl-3 py-1 bg-[#fafaf4] rounded-r-xl">
                  <h4 className="font-bold text-sm text-[#0d631b] mb-1">오늘의 핵심 브리핑 3줄 요약</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside text-[#40493d]">
                    <li><strong>무항생제 대란 10구</strong>: 월계 화랑마트에서 2,790원 (-28% 슈퍼특가)</li>
                    <li><strong>친환경 팽이버섯 3봉</strong>: 광운대 골목식자재마트에서 1,000원 (봉당 333원)</li>
                    <li><strong>칼칼 두부조림</strong>: 오늘 특가 2가지로 2,390원에 10분 자취밥상 완성 가능</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-sm text-[#1a1c19]">민지님의 찜 식재료 현재 시세</h4>
                  <div className="space-y-1.5">
                    {wishlist.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f4ef] text-xs"
                      >
                        <span className="font-medium text-[#1a1c19]">
                          {w.name} ({w.unit})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#707a6c]">{w.lowestStore}</span>
                          <span className="font-bold text-[#0d631b]">
                            {w.currentLowestPrice.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#f4f4ef] rounded-2xl text-center space-y-2">
                  <p className="text-xs text-[#707a6c]">
                    본 메일은 회원님이 설정하신 '매일 아침 08:30 정기 브리핑' 주기에 따라 자동 발송되는 시뮬레이션입니다.
                  </p>
                  <button
                    onClick={onOpenAlertSettings}
                    className="text-xs text-[#0d631b] font-bold hover:underline"
                  >
                    알림 설정 또는 수신 주기 변경하기 →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: COMPACT TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#1a1c19]">월계1동 식재료 일일 시세 테이블</h3>
                  <p className="text-[11px] text-[#707a6c]">
                    공공데이터 기준 시세는 오전 06:00, 현장 확인 가격은 오전 07:15 업데이트
                  </p>
                </div>
                <span className="text-xs text-[#707a6c]">총 {filteredItems.length}개 품목</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#eeeee9] text-[#707a6c]">
                      <th className="py-2.5 px-3">품목명</th>
                      <th className="py-2.5 px-3">출처</th>
                      <th className="py-2.5 px-3">소분 규격</th>
                      <th className="py-2.5 px-3">최저가 상점</th>
                      <th className="py-2.5 px-3 text-right">가격</th>
                      <th className="py-2.5 px-3 text-right">특가 여부</th>
                      <th className="py-2.5 px-3 text-center">담기</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eeeee9]">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#fafaf4] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#1a1c19]">{item.ingredientName}</td>
                        <td className="py-3 px-3">
                          <SourceBadge source={item.dataSource} detail={item.sourceDetail} />
                        </td>
                        <td className="py-3 px-3 text-[#707a6c]">{item.unit}</td>
                        <td className="py-3 px-3 text-[#40493d]">
                          <div>{item.storeName}</div>
                          <div className="text-[10px] text-[#0d631b]">{item.storeDistance}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#0d631b] tabular-nums">
                          {item.price.toLocaleString()}원
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.isSpecialDeal ? (
                            <span className="inline-block bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c]/70 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              {item.specialDealLabel || '특가'}
                            </span>
                          ) : (
                            <span className="text-[#707a6c] text-[11px]">일반</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleAddToCartWithFeedback(item)}
                            className="p-1.5 rounded-lg bg-[#eeeee9] hover:bg-[#0d631b] hover:text-white transition-colors"
                            title="장바구니 담기"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR (lg:col-span-4) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Widget 1: Minji's Wishlist Realtime Price Radar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fe5825] animate-ping" />
                <h3 className="font-bold text-sm text-[#1a1c19]">민지님의 찜 식재료 레이더</h3>
              </div>
              <button
                onClick={onOpenWishlist}
                className="text-xs text-[#707a6c] hover:text-[#0d631b] transition-colors"
              >
                관리 ({wishlist.length}/10)
              </button>
            </div>
            <p className="text-xs text-[#707a6c] -mt-2">
              등록해두신 관심 식재료의 월계1동 최저점 변동 현황입니다.
            </p>

            {/* Wishlist Items List */}
            <div className="space-y-2.5">
              {wishlist.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#f4f4ef] hover:bg-[#eeeee9] transition-colors border border-transparent hover:border-[#e3e3de]"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-[#1a1c19] truncate">{item.name}</div>
                    <div className="text-[11px] text-[#707a6c]">{item.lowestStore}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-xs text-[#0d631b] tabular-nums">
                      {item.currentLowestPrice.toLocaleString()}원
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c]/70 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b]" />
                      {item.specialBadge || '구매적기!'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenAddWishModal}
              className="w-full py-2.5 rounded-xl bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#1a1c19] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#0d631b]" />
              <span>새 식재료 찜 추가하기</span>
            </button>
          </div>

          {/* Widget 2: Local Mart Open Status */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#0d631b]" />
                <h3 className="font-bold text-sm text-[#1a1c19]">동네 마트 운영 상황</h3>
                <SourceBadge source="현장 확인" size="xs" detail="영업시간 현장 및 공지 확인" />
              </div>
              <button
                onClick={() => onOpenMartMap ? onOpenMartMap() : onOpenRouteModal()}
                className="text-[11px] font-bold text-[#0d631b] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>지도 전체보기</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mini Map Visual Card */}
            <div
              onClick={() => onOpenMartMap ? onOpenMartMap() : onOpenRouteModal()}
              className="relative w-full h-32 rounded-2xl overflow-hidden bg-cover bg-center cursor-pointer group border border-[#e3e3de] hover:border-[#0d631b] transition-all"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#a3f69c]" />
                  월계동 마트 지도 & 오늘 영업시간
                </span>
                <span className="text-[10px] text-white/90 flex items-center gap-1 mt-0.5">
                  <span>클릭 시 지도에서 영업시간·휴무일·특가 확인</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Store Status Rows */}
            <div className="space-y-1 text-xs">
              {MARTS_INFO.map((mart) => (
                <button
                  key={mart.id}
                  onClick={() => onOpenMartMap ? onOpenMartMap(mart.id) : onOpenRouteModal()}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[#fafaf4] transition-colors border border-transparent hover:border-[#e3e3de] cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        mart.isOpen ? 'bg-[#0d631b]' : 'bg-[#ba1a1a]'
                      }`}
                    />
                    <span className="font-bold text-[#1a1c19] group-hover:text-[#0d631b] transition-colors">
                      {mart.name}
                    </span>
                    <span className="text-[#707a6c] text-[10px]">{mart.distance.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-[#0d631b]">{mart.openTime}~{mart.closingTime}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#707a6c] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 3: Quick Action Utility Card */}
          <div className="bg-[#f4f4ef] rounded-3xl p-5 sm:p-6 border border-[#e3e3de] space-y-3">
            <span className="font-bold text-xs text-[#1a1c19] block">오늘의 식재료 바로 활용하기</span>
            <div className="space-y-2">
              <button
                onClick={handleShare}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white text-[#1a1c19] text-xs font-semibold flex items-center justify-between hover:bg-[#eeeee9] transition-colors border border-[#e3e3de] shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0d631b]" />
                  <span>룸메이트·친구에게 공유하기</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#707a6c]" />
              </button>

              <button
                onClick={handleCopyChecklist}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white text-[#1a1c19] text-xs font-semibold flex items-center justify-between hover:bg-[#eeeee9] transition-colors border border-[#e3e3de] shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#fe5825]" />
                  <span>오늘 장보기 체크리스트 복사</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#707a6c]" />
              </button>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-[#e3e3de] text-center">
              <p className="text-[11px] text-[#707a6c]">
                물가 정보에 오차가 있나요?{' '}
                <button
                  onClick={onOpenReportModal}
                  className="text-[#0d631b] underline font-bold"
                >
                  가게 가격 제보하기
                </button>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

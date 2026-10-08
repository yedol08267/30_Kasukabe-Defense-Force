import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Check,
  CheckCircle,
  PiggyBank,
  BellRing,
  RotateCcw,
  Sparkles,
  Heart,
  ShoppingCart,
  Store,
  ArrowDown,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Scale,
  Flame,
  Soup,
  ShoppingBag,
  Footprints,
  Trash2,
} from 'lucide-react';
import { WishlistItem, PriceRecord } from '../types';
import { POPULAR_KEYWORDS, THREE_MART_MATRIX, MASTER_PRODUCTS, APP_STATS } from '../data/mockData';
import { SourceBadge } from './SourceBadge';

/**
 * 찜 식재료 레이더 가격 변동 뱃지 통일 색상 체계:
 * - 지금 사면 좋은 상태 / 가격 하락: 초록/파랑 계열 (구매적기, 전일대비 하락, 역대최저 등)
 * - 가격 상승 / 주의 필요: 빨간색/주황색 계열 (가격 상승 주의)
 * - 보합 / 안정세: 차분한 그레이/세이지 계열
 */
const getFluctuationBadge = (trend: 'down' | 'steady' | 'up', trendNote: string) => {
  if (trend === 'down' || trendNote.includes('구매적기') || trendNote.includes('-') || trendNote.includes('최저') || trendNote.includes('세일')) {
    const isDailyDrop = trendNote.includes('전일 대비');
    return {
      type: 'positive' as const,
      colorClass: isDailyDrop
        ? 'bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]' // 파랑 계열: 전일 대비 인하 / 최저가 갱신
        : 'bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c]', // 초록 계열: 구매적기 / 특가 하락
      dotColor: isDailyDrop ? 'bg-[#0284c7]' : 'bg-[#0d631b]',
      icon: TrendingDown,
      label: trendNote,
    };
  }
  if (trend === 'up' || trendNote.includes('상승') || trendNote.includes('+')) {
    return {
      type: 'caution' as const,
      colorClass: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]', // 빨간색 계열: 주의 필요
      dotColor: 'bg-[#dc2626]',
      icon: TrendingUp,
      label: trendNote,
    };
  }
  return {
    type: 'neutral' as const,
    colorClass: 'bg-[#f4f4ef] text-[#40493d] border border-[#e3e3de]', // 보합
    dotColor: 'bg-[#71717a]',
    icon: Scale,
    label: trendNote,
  };
};

const getDealBadgeColor = (trend: 'down' | 'steady' | 'up', savingsPercent: number) => {
  if (trend === 'up') {
    return 'bg-[#dc2626] text-white'; // 가격 상승 시 빨강
  }
  // 가격 하락 / 지금 사면 좋은 상태는 초록 및 파랑 계열로 통일
  if (savingsPercent >= 35) {
    return 'bg-[#0284c7] text-white'; // 파랑: 파격 할인 (35% 이상)
  }
  return 'bg-[#0d631b] text-white'; // 초록: 슈퍼특가
};

interface WishlistDashboardProps {
  wishlist: WishlistItem[];
  onToggleWishKeyword: (keyword: string) => void;
  onRemoveWish: (id: string) => void;
  onToggleAlert: (id: string) => void;
  onAddToCart: (item: PriceRecord) => void;
  onBatchAddToCart: () => void;
  onOpenAddModal: () => void;
  onOpenRouteModal: () => void;
  onShowToast: (msg: string) => void;
}

export const WishlistDashboard: React.FC<WishlistDashboardProps> = ({
  wishlist,
  onToggleWishKeyword,
  onRemoveWish,
  onToggleAlert,
  onAddToCart,
  onBatchAddToCart,
  onOpenAddModal,
  onOpenRouteModal,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // 5 Featured Radar Items derived directly from MASTER_PRODUCTS (1:1 with 당일 시세 테이블 5종)
  const [radarCards, setRadarCards] = useState(() =>
    MASTER_PRODUCTS.slice(0, 5).map((p, idx) => ({
      id: p.id,
      indexNumber: idx + 1,
      name: p.name,
      category: p.category === 'egg_tofu' ? '계란 / 신선란' : p.category === 'meat' ? '정육 / 한돈' : '채소 / 신선식품',
      dealBadge: p.specialDealLabel,
      dealBadgeColor: getDealBadgeColor(p.trend, p.savingsPercent),
      trend: p.trend,
      trendNote: p.trendNote,
      savingsPercent: p.savingsPercent,
      portionTag: p.soloPortionUnit,
      storeName: p.lowestStore,
      distance: p.lowestStore === '광운대 골목식자재마트' ? '도보 3분' : p.lowestStore === '월계 화랑마트' ? '도보 4분' : '도보 8분',
      currentPrice: p.lowestPrice,
      comparePrice: p.benchmarkPrice,
      compareNote: `이마트 월계점 대비 ${p.savingsAmount.toLocaleString()}원 더 저렴 (${p.unitPriceDesc})`,
      alertText: `${p.targetPrice.toLocaleString()}원 이하 알림`,
      alertOn: true,
      isFavorite: true,
      imageUrl: p.imageUrl,
      dataSource: p.dataSource,
      sourceDetail: p.sourceDetail,
    }))
  );

  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  const scrollToCard = (productId: string, productName: string) => {
    if (searchTerm) {
      setSearchTerm('');
    }
    setHighlightedCardId(productId);
    setTimeout(() => {
      const el = document.getElementById(`radar-card-${productId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
    onShowToast(`'${productName}' 상단 상품 카드로 이동했습니다.`);
    setTimeout(() => {
      setHighlightedCardId((prev) => (prev === productId ? null : prev));
    }, 3200);
  };

  const toggleRadarAlert = (id: string) => {
    setRadarCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, alertOn: !c.alertOn } : c))
    );
    const item = radarCards.find((c) => c.id === id);
    onShowToast(`'${item?.name}' 가격 알림 상태가 변경되었습니다.`);
  };

  const toggleFavorite = (id: string) => {
    setRadarCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleCardAddToCart = (card: typeof radarCards[0]) => {
    onAddToCart({
      id: card.id,
      ingredientName: card.name,
      category: 'vegetable',
      storeName: card.storeName,
      storeDistance: card.distance,
      storeLocation: '',
      price: card.currentPrice,
      originalPrice: card.comparePrice,
      unit: card.portionTag,
      soloPortionUnit: card.portionTag,
      unitPriceDesc: '',
      savingsNote: card.compareNote,
      isSpecialDeal: true,
      date: '2026-10-05',
      imageUrl: card.imageUrl,
      inStock: true,
      dataSource: card.dataSource,
      sourceDetail: card.sourceDetail,
    });
    setAddedItemIds((prev) => ({ ...prev, [card.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [card.id]: false }));
    }, 2000);
    onShowToast(`'${card.name}' 장바구니에 담겼습니다!`);
  };

  // Filter radar cards based on search input
  const filteredRadar = radarCards.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Top Banner / User Persona & Live Saving Widget */}
      <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#e3e3de] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#a3f69c]/20 blur-3xl pointer-events-none" />
        <div className="absolute right-36 bottom-[-30px] w-64 h-64 rounded-full bg-[#ffdbd1]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#a3f69c] text-[#002204] px-3 py-1 rounded-full font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0d631b]" />
              <span>광운대 원룸촌 생활권 • 맞춤 장보기 레이더</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c19] tracking-tight">
              <span className="text-[#0d631b]">김민지</span>님의 이번 주 식재료 찜 대시보드
            </h1>
            <p className="text-xs sm:text-sm text-[#40493d]">
              관심 등록한 <span className="font-bold text-[#1a1c19]">{wishlist.length}개 필수 식재료</span>의 {APP_STATS.dataSourceNotice}를 바탕으로 최저가를 추적하고 있어요.
            </p>
          </div>

          {/* Saving Metric Box */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 bg-[#f4f4ef] rounded-2xl p-4 border border-[#e3e3de]">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shadow-xs">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-[#707a6c]">월계동 마트 평균 대비 절약액</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-[#0d631b]">12,400원</span>
                  <span className="text-xs text-[#0d631b] font-bold">(-31.4% 절약)</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-[#e3e3de]" />

            <div className="flex items-center justify-between sm:justify-start gap-4 px-2">
              <div>
                <div className="text-[11px] text-[#707a6c]">목표가 도달 알림</div>
                <div className="text-sm font-bold text-[#1a1c19]">3건 발송 대기</div>
              </div>
              <BellRing className="w-6 h-6 text-[#fe5825] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Quick Search & Custom Register Bar */}
        <div className="mt-6 pt-4 flex flex-col md:flex-row items-center gap-3 border-t border-[#eeeee9]">
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707a6c] w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="자주 사는 식재료 검색... (예: 대파 반단, 계란 10구, 찌개두부, 팽이버섯)"
              className="w-full bg-[#f4f4ef] pl-11 pr-20 py-3 rounded-full text-xs sm:text-sm text-[#1a1c19] placeholder:text-[#707a6c] border border-[#e3e3de] focus:outline-none focus:bg-white focus:border-[#0d631b] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#40493d] px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
              >
                초기화
              </button>
            )}
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full md:w-auto h-11 px-5 bg-[#2e7d32] hover:bg-[#0d631b] text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>직접 찜 키워드 추가</span>
          </button>
        </div>

        {/* Popular Keyword Chips */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap scrollbar-none">
          <span className="text-[11px] text-[#707a6c] px-1 shrink-0">인기 자취 키워드:</span>
          {POPULAR_KEYWORDS.map((kw) => {
            const isWishlisted = wishlist.some((w) => w.name.includes(kw) || kw.includes(w.name));
            return (
              <button
                key={kw}
                onClick={() => onToggleWishKeyword(kw)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                  isWishlisted
                    ? 'bg-[#0d631b] text-white shadow-2xs'
                    : 'bg-[#f4f4ef] hover:bg-[#eeeee9] text-[#40493d] border border-[#e3e3de]'
                }`}
              >
                {isWishlisted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-[#707a6c]" />
                )}
                <span>{kw}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Wishlist Radar Cards (8 Cols) */}
        <main className="lg:col-span-8 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#1a1c19]">
                  오늘의 찜 식재료 레이더
                </h2>
                <span className="bg-[#a3f69c] text-[#002204] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {filteredRadar.length}개 즉시 구매권장 (당일 시세 매칭)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#707a6c] text-xs">
                <RotateCcw className="w-3.5 h-3.5 text-[#0d631b]" />
                <span>{APP_STATS.collectionTimeDesc} 확인</span>
              </div>
            </div>

            {/* 가격 변동 신호 통일 체계 가이드 바 */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] bg-[#f4f4ef] px-3 py-1.5 rounded-xl border border-[#e3e3de]">
              <span className="font-bold text-[#40493d]">가격 변동 신호:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#0d631b]">
                <span className="w-2 h-2 rounded-full bg-[#0d631b]" />
                구매적기 · 하락세 (초록)
              </span>
              <span className="text-[#c4c4be]">|</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#0284c7]">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                전일 대비 인하 · 최저가 (파랑)
              </span>
              <span className="text-[#c4c4be]">|</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#71717a]">
                <span className="w-2 h-2 rounded-full bg-[#a1a1aa]" />
                안정세 유지 (회색)
              </span>
              <span className="text-[#c4c4be]">|</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#dc2626]">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                가격 상승 주의 (빨강)
              </span>
            </div>
          </div>

          {/* Wishlist 2-Column Subgrid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRadar.map((card) => {
              const isHighlighted = highlightedCardId === card.id;
              const fluctuationInfo = getFluctuationBadge(card.trend, card.trendNote);
              const FluctuationIcon = fluctuationInfo.icon;

              return (
                <article
                  key={card.id}
                  id={`radar-card-${card.id}`}
                  className={`bg-white rounded-2xl p-4 shadow-xs transition-all border flex flex-col justify-between scroll-mt-24 ${
                    isHighlighted
                      ? 'ring-4 ring-[#0d631b] border-[#0d631b] bg-[#f5faf5] scale-[1.015] shadow-lg duration-300'
                      : 'border-[#e3e3de] hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Photo with Inset Badges */}
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-[#eeeee9]">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-bold text-[10px] px-2 py-1 rounded-lg shadow-xs ${card.dealBadgeColor}`}
                        >
                          {card.dealBadge}
                        </span>
                        <span className="bg-[#1a1c19]/85 backdrop-blur-xs text-white font-extrabold text-[10px] px-2 py-1 rounded-lg shadow-xs">
                          시세표 #{card.indexNumber}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        {isHighlighted && (
                          <span className="bg-[#0d631b] text-white font-black text-[10px] px-2 py-1 rounded-lg shadow-xs animate-pulse">
                            선택됨 ✓
                          </span>
                        )}
                        <span className="bg-white/95 backdrop-blur-xs text-[#0d631b] font-bold text-[10px] px-2 py-1 rounded-lg shadow-xs">
                          {card.portionTag}
                        </span>
                      </div>
                    </div>

                    {/* Header & Heart */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-[#707a6c]">{card.category}</span>
                          <SourceBadge source={card.dataSource} detail={card.sourceDetail} />
                        </div>
                        <h3 className="font-extrabold text-sm text-[#1a1c19] mt-0.5">{card.name}</h3>
                      </div>
                      <button
                        onClick={() => toggleFavorite(card.id)}
                        className="text-[#fe5825] hover:opacity-80 p-1"
                        title="찜 해제"
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={card.isFavorite ? '#fe5825' : 'none'}
                        />
                      </button>
                    </div>

                    {/* Unified Price Fluctuation Badge (가격 변동 신호 뱃지: 구매적기/전일대비인하 등) */}
                    <div className="mt-2.5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${fluctuationInfo.colorClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${fluctuationInfo.dotColor}`} />
                        <FluctuationIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{fluctuationInfo.label}</span>
                      </div>
                    </div>

                  {/* Price Comparison Badge */}
                  <div className="mt-3 bg-[#f4f4ef] rounded-xl p-3 space-y-1 border border-[#e3e3de]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[#1a1c19] font-bold">
                        <Store className="w-3.5 h-3.5 text-[#0d631b]" />
                        <span>{card.storeName}</span>
                      </div>
                      <span className="text-[11px] text-[#707a6c]">{card.distance}</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="text-lg font-black text-[#0d631b] tabular-nums">
                        {card.currentPrice.toLocaleString()}원
                      </div>
                      <div className="text-xs text-[#707a6c] line-through tabular-nums">
                        이마트 {card.comparePrice.toLocaleString()}원
                      </div>
                    </div>

                    <div className="text-[10px] text-[#0d631b] font-medium flex items-center gap-1 pt-0.5">
                      <ArrowDown className="w-3 h-3 text-[#0d631b]" />
                      <span>{card.compareNote}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Switch & Add Button */}
                <div className="mt-4 pt-2 border-t border-[#eeeee9] flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={card.alertOn}
                      onChange={() => toggleRadarAlert(card.id)}
                      className="peer sr-only"
                    />
                    <div className="w-8 h-4 bg-[#e3e3de] peer-checked:bg-[#0d631b] rounded-full transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-3 after:h-3 after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
                    <span className="text-[11px] text-[#40493d]">
                      {card.alertText} {card.alertOn ? 'ON' : 'OFF'}
                    </span>
                  </label>

                  <button
                    onClick={() => handleCardAddToCart(card)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                      addedItemIds[card.id]
                        ? 'bg-[#0d631b] text-white'
                        : 'bg-[#eeeee9] hover:bg-[#0d631b] hover:text-white text-[#1a1c19]'
                    }`}
                  >
                    {addedItemIds[card.id] ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>담김</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        <span>담기</span>
                      </>
                    )}
                  </button>
                </div>
                </article>
              );
            })}
          </div>

          {/* Add New Custom Wishlist Banner */}
          <div className="w-full bg-[#f4f4ef] rounded-2xl p-4 sm:p-5 border border-[#e3e3de] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#a3f69c] text-[#002204] flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1a1c19]">원하는 식재료 가격이 아직 없나요?</div>
                <p className="text-xs text-[#707a6c]">
                  자주 먹는 식재료를 등록해두시면 월계동 상권 입고 및 할인 시 즉시 알려드려요.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-white hover:bg-[#2e7d32] hover:text-white text-[#1a1c19] border border-[#e3e3de] rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-2xs"
            >
              희망 목표가 알림 등록
            </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR (4 Cols) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Widget 1: Wolgye 1-dong Solo Top Picks (Hot Realtime) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e3e3de] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#fe5825]" />
                <h3 className="font-bold text-sm text-[#1a1c19]">월계1동 자취생 인기 픽</h3>
              </div>
              <span className="text-[11px] font-bold text-[#fe5825]">오늘의 인기 HOT</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f4ef] border border-[#eeeee9]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0d631b] shrink-0 border border-[#e3e3de]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1a1c19]">깐마늘 소포장 (100g)</div>
                    <div className="text-[10px] text-[#707a6c]">석계 알뜰청과</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-[#0d631b]">990원</div>
                  <span className="text-[10px] bg-[#a3f69c] text-[#002204] font-bold px-1.5 py-0.2 rounded">
                    찜 +142
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f4ef] border border-[#eeeee9]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0d631b] shrink-0 border border-[#e3e3de]">
                    <Soup className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1a1c19]">국산 찌개용 부침두부 1모</div>
                    <div className="text-[10px] text-[#707a6c]">월계 화랑마트</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-[#0d631b]">990원</div>
                  <span className="text-[10px] bg-[#a3f69c] text-[#002204] font-bold px-1.5 py-0.2 rounded">
                    찜 +89
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onShowToast('인기 찜 목록이 최신순으로 정렬되었습니다.')}
              className="w-full py-2 rounded-xl bg-[#f4f4ef] hover:bg-[#eeeee9] text-[#0d631b] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>인기 찜 목록 전체보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Widget 2: Local 3-Way Store Price Comparison Matrix */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e3e3de] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#1a1c19]">광운대역 3대 마트 당일 시세</h3>
                  <SourceBadge source="현장 확인" size="xs" detail="운영진 매장 방문 실측" />
                </div>
                <p className="text-[11px] text-[#707a6c]">
                  {APP_STATS.collectionTimeDesc} 현장 확인 • 상단 5대 찜 카드와 1:1 연동
                </p>
              </div>
              <Scale className="w-4 h-4 text-[#707a6c]" />
            </div>

            {/* Click-to-scroll guidance note */}
            <div className="p-2.5 rounded-xl bg-[#eef8ed] border border-[#a3f69c]/60 text-xs text-[#0d631b] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#0d631b]" />
                <span className="font-semibold truncate text-[11px]">
                  품목 행 클릭 시 상단 상품 상세 카드로 자동 이동
                </span>
              </div>
              <span className="text-[10px] bg-[#0d631b] text-white font-bold px-1.5 py-0.5 rounded shrink-0">
                1:1 매칭
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {/* Header */}
              <div className="grid grid-cols-12 pb-1 text-[10px] text-[#707a6c] text-center border-b border-[#eeeee9] font-bold">
                <span className="col-span-4 text-left pl-1">품목 (클릭 시 이동)</span>
                <span className="col-span-2 text-[#0d631b]">화랑마트</span>
                <span className="col-span-2 text-[#0d631b]">석계청과</span>
                <span className="col-span-2 text-[#0d631b]">골목식자재</span>
                <span className="col-span-2 text-[#707a6c]">이마트월계</span>
              </div>

              {THREE_MART_MATRIX.map((row, idx) => {
                const isSelected = highlightedCardId === row.id;
                return (
                  <button
                    key={row.id || idx}
                    type="button"
                    onClick={() => scrollToCard(row.id, row.item)}
                    className={`w-full grid grid-cols-12 py-2 px-1 rounded-xl items-center text-center text-xs transition-all cursor-pointer group text-left ${
                      isSelected
                        ? 'bg-[#a3f69c]/40 ring-2 ring-[#0d631b] shadow-xs'
                        : idx % 2 === 0
                        ? 'bg-[#fafaf4] hover:bg-[#eef8ed]'
                        : 'bg-white hover:bg-[#eef8ed]'
                    }`}
                    title={`클릭 시 상단 '${row.item}' 카드로 스크롤 이동합니다.`}
                  >
                    {/* 품목 column with badge and clear ingredient name */}
                    <div className="col-span-4 text-left pl-1 pr-1 flex items-center gap-1 min-w-0">
                      <span className="shrink-0 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#e3e3de] text-[#1a1c19] group-hover:bg-[#0d631b] group-hover:text-white transition-colors">
                        {row.badgeLabel}
                      </span>
                      <span className="font-bold text-[#1a1c19] text-[11px] truncate group-hover:text-[#0d631b] transition-colors">
                        {row.displayName}
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#707a6c] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>

                    <span
                      className={`col-span-2 ${
                        row.hwarang.isLowest
                          ? 'font-bold text-[#0d631b] bg-[#a3f69c]/40 py-0.5 rounded'
                          : 'text-[#40493d]'
                      }`}
                    >
                      {row.hwarang.price.toLocaleString()}원
                    </span>
                    <span
                      className={`col-span-2 ${
                        row.seokgye.isLowest
                          ? 'font-bold text-[#0d631b] bg-[#a3f69c]/40 py-0.5 rounded'
                          : 'text-[#40493d]'
                      }`}
                    >
                      {row.seokgye.price.toLocaleString()}원
                    </span>
                    <span
                      className={`col-span-2 ${
                        row.golmok.isLowest
                          ? 'font-bold text-[#0d631b] bg-[#a3f69c]/40 py-0.5 rounded'
                          : 'text-[#40493d]'
                      }`}
                    >
                      {row.golmok.price.toLocaleString()}원
                    </span>
                    <span className="col-span-2 text-[#707a6c] text-[11px]">
                      {row.emart.price.toLocaleString()}원
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-[#f4f4ef] text-xs text-[#40493d] border border-[#e3e3de] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#0d631b] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                현재 필수 식재료 5종(계란, 두부, 대파, 양파, 팽이버섯) 기준 <strong className="text-[#0d631b]">3대 골목마트</strong> 코스로 장보시면 이마트 월계점 단독 구매 대비 <strong className="text-[#1a1c19]">{APP_STATS.basketSavings.toLocaleString()}원 ({APP_STATS.basketSavingsRate}%) 절약</strong>됩니다.
              </p>
            </div>
          </div>

          {/* Widget 3: 1-Click Smart Basket Banner */}
          <div className="bg-gradient-to-br from-[#2e7d32] to-[#0d631b] rounded-2xl p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                1-Click 스마트 장바구니
              </span>
              <ShoppingBag className="w-4 h-4" />
            </div>

            <h4 className="font-extrabold text-base leading-snug">
              최저가 찜 식재료 4종 일괄 담기
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              월계 화랑마트 + 석계 알뜰청과 최적의 도보 동선 지도(총 12분)와 함께 4종 장바구니를 즉시 생성합니다.
            </p>

            <button
              onClick={() => {
                onBatchAddToCart();
                onShowToast(`최저가 4종 세트(${APP_STATS.basketCostLocal.toLocaleString()}원)가 장바구니에 일괄 담겼습니다!`);
              }}
              className="w-full py-3 rounded-xl bg-white text-[#0d631b] font-extrabold text-xs hover:bg-[#fafaf4] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
            >
              <Footprints className="w-4 h-4" />
              <span>{APP_STATS.basketCostLocal.toLocaleString()}원 • 최저가 동선 바구니 생성</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

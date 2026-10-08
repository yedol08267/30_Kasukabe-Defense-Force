import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Check,
  Store,
  Sparkles,
  ArrowUpDown,
  Filter,
  TrendingDown,
  Info,
  MapPin,
} from 'lucide-react';
import { PriceRecord } from '../types';
import { SourceBadge } from './SourceBadge';

interface PriceComparisonProps {
  priceRecords: PriceRecord[];
  onAddToCart: (record: PriceRecord) => void;
  onOpenRouteModal: () => void;
  onShowToast: (msg: string) => void;
  onOpenMartMap?: () => void;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  priceRecords,
  onAddToCart,
  onOpenRouteModal,
  onShowToast,
  onOpenMartMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlySolo, setOnlySolo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: '전체 식재료' },
    { id: 'vegetable', label: '채소 / 쌈채소' },
    { id: 'egg_tofu', label: '계란 / 두부' },
    { id: 'meat', label: '정육 / 한돈' },
  ];

  const filteredRecords = priceRecords.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (onlySolo && !item.soloPortionUnit.includes('1인') && !item.soloPortionUnit.includes('소분')) return false;
    if (searchQuery && !item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()) && !item.storeName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAdd = (item: PriceRecord) => {
    onAddToCart(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
    onShowToast(`'${item.ingredientName}' 장바구니에 추가되었습니다.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#e3e3de] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#a3f69c] text-[#002204] px-3 py-1 rounded-full font-bold text-xs">
              <Store className="w-3.5 h-3.5 text-[#0d631b]" />
              <span>월계1동 3대 골목마트 + 이마트 월계점(비교 기준) 당일 가격비교</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c19] tracking-tight">
              동네 마트별 식재료 당일 가격비교
            </h1>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <SourceBadge source="공공데이터 기준" detail="KAMIS 공식 시세 오전 06:00" />
              <SourceBadge source="현장 확인" detail="골목마트 매장 가격 오전 07:15" />
              <span className="text-[11px] text-[#707a6c]">
                공공데이터 기준 시세는 오전 06:00, 현장 확인 가격은 오전 07:15 업데이트
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#40493d]">
              공식 공공데이터(KAMIS) 시세와 동네 마트 매장 현장 확인 가격을 각각 분리하여 제공합니다. 월계 화랑마트, 석계 알뜰청과, 광운대 골목식자재마트의 동일 품목 가격과 이마트 월계점(비교 기준용 대형마트) 가격을 한눈에 비교하세요. 각 상품 카드에서 적용된 출처 뱃지를 개별적으로 확인하실 수 있습니다.
            </p>
          </div>

          {onOpenMartMap && (
            <button
              onClick={onOpenMartMap}
              className="px-5 py-3 rounded-2xl bg-[#0d631b] hover:bg-[#084813] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102 shrink-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#a3f69c]" />
              <span>내 근처 마트 보기 (지도)</span>
            </button>
          )}
        </div>

        {/* Quick Search & Filters */}
        <div className="mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#eeeee9]">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#0d631b] text-white shadow-2xs'
                    : 'bg-[#f4f4ef] hover:bg-[#eeeee9] text-[#40493d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Solo Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707a6c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="품목명 또는 상점 검색..."
                className="w-full bg-[#f4f4ef] pl-9 pr-3 py-2 rounded-xl text-xs text-[#1a1c19] border border-[#e3e3de] outline-none focus:bg-white"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1c19] shrink-0 bg-[#fafaf4] px-3 py-2 rounded-xl border border-[#e3e3de]">
              <input
                type="checkbox"
                checked={onlySolo}
                onChange={(e) => setOnlySolo(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0d631b] cursor-pointer"
              />
              <span>1인 소포장만</span>
            </label>
          </div>
        </div>
      </section>

      {/* Comparison Grid & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((item) => {
          const discount = item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

          return (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all border border-[#e3e3de] flex flex-col justify-between group"
            >
              <div>
                {/* Store Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f4f4ef] text-xs gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1a1c19] truncate">
                    <Store className="w-3.5 h-3.5 text-[#0d631b] shrink-0" />
                    <span className="truncate">{item.storeName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <SourceBadge source={item.dataSource} detail={item.sourceDetail} />
                    <span className="text-[11px] text-[#0d631b] font-semibold">{item.storeDistance}</span>
                  </div>
                </div>

                {/* Photo & Badge */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#eeeee9]">
                  <img
                    src={item.imageUrl}
                    alt={item.ingredientName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {item.isSpecialDeal && (
                    <span className="absolute top-2 left-2 bg-[#0d631b] text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                      {item.specialDealLabel || '특가'}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#0d631b] font-bold text-[10px] px-2 py-0.5 rounded-md">
                    {item.soloPortionUnit}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-extrabold text-sm text-[#1a1c19]">{item.ingredientName}</h3>
                <div className="text-[11px] text-[#707a6c] mt-0.5">규격: {item.unit}</div>

                {/* Pricing Block */}
                <div className="mt-3 p-2.5 bg-[#f4f4ef] rounded-xl space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      {discount > 0 && (
                        <span className="text-sm font-black text-[#0d631b]">-{discount}%</span>
                      )}
                      <span className="text-base font-black text-[#0d631b] tabular-nums">
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                    {item.originalPrice && (
                      <span className="text-xs text-[#707a6c] line-through tabular-nums">
                        {item.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-[#40493d] flex items-center justify-between">
                    <span>{item.unitPriceDesc}</span>
                    <span className="text-[#0d631b] font-semibold">{item.savingsNote}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-2 border-t border-[#eeeee9] flex items-center gap-2">
                <button
                  onClick={() => handleAdd(item)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    addedIds[item.id]
                      ? 'bg-[#0d631b] text-white'
                      : 'bg-[#2e7d32] hover:bg-[#0d631b] text-white active:scale-98'
                  }`}
                >
                  {addedIds[item.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      장바구니 담김
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

      {/* Route & Map Guidance Banner */}
      <div className="bg-[#fafaf4] rounded-2xl p-5 border border-[#e3e3de] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#a3f69c] text-[#002204] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#0d631b]" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#1a1c19]">
              가장 저렴한 마트들을 연결하는 도보 최단 코스 안내
            </div>
            <p className="text-xs text-[#707a6c]">
              광운대역 1번출구에서 시작해 월계 화랑마트, 석계 알뜰청과를 거쳐 원룸촌까지 도보 12분만에 알뜰 장보기를 끝낼 수 있어요.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenRouteModal}
          className="px-4 py-2 bg-white hover:bg-[#2e7d32] hover:text-white text-[#0d631b] font-bold text-xs rounded-xl border border-[#e3e3de] transition-colors whitespace-nowrap shadow-2xs"
        >
          도보 동선 지도 보기
        </button>
      </div>
    </div>
  );
};

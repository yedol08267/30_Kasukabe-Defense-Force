import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  Navigation,
  Compass,
  Store,
  ChevronRight,
  Info,
  Footprints,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';
import { MartStatus, PriceRecord } from '../types';
import { SourceBadge } from './SourceBadge';

interface NearbyMartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  marts: MartStatus[];
  initialMartId?: string;
  onAddToCart?: (deal: PriceRecord) => void;
  onShowToast: (msg: string) => void;
}

const getDealImageUrl = (name: string): string => {
  if (name.includes('두부')) return '/src/assets/images/fresh_white_tofu_1790926599560.jpg';
  if (name.includes('란') || name.includes('계란')) return '/src/assets/images/fresh_eggs_carton_1790922262608.jpg';
  if (name.includes('대파') || name.includes('파')) return '/src/assets/images/fresh_scallions_bundle_1790922275638.jpg';
  if (name.includes('양파')) return '/src/assets/images/fresh_yellow_onions_1790926567544.jpg';
  if (name.includes('삼겹살') || name.includes('한돈') || name.includes('고기')) return '/src/assets/images/pork_belly_single_1790922292074.jpg';
  if (name.includes('팽이버섯') || name.includes('버섯')) return '/src/assets/images/white_enoki_mushrooms_1790926583763.jpg';
  if (name.includes('마늘')) return '/src/assets/images/peeled_garlic_cloves_1790926619613.jpg';
  return '/src/assets/images/fresh_white_tofu_1790926599560.jpg';
};

// Home location coordinates (SSOT for distance calculations)
const USER_HOME = {
  name: '내 원룸 (출발점)',
  x: 34,
  y: 50,
  desc: '광운대역 앞 원룸촌',
};

export const NearbyMartsModal: React.FC<NearbyMartsModalProps> = ({
  isOpen,
  onClose,
  marts,
  initialMartId,
  onAddToCart,
  onShowToast,
}) => {
  const [selectedMartId, setSelectedMartId] = useState<string>(
    initialMartId || marts[0]?.id || 'mart-1'
  );
  const [filterMode, setFilterMode] = useState<'all' | 'local' | 'open' | 'benchmark'>('all');
  const [zoomLevel, setZoomLevel] = useState<1 | 1.4 | 1.8>(1);
  const [showNearbyClusterList, setShowNearbyClusterList] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!isOpen) return null;

  const selectedMart = marts.find((m) => m.id === selectedMartId) || marts[0];

  // Close marts within 4 minutes (광운대 골목식자재마트 3분, 월계 화랑마트 4분)
  const closeMarts = marts.filter((m) => !m.isBenchmark && m.walkMinutes <= 4);

  // Filtering
  const filteredMarts = marts.filter((m) => {
    if (filterMode === 'local') return !m.isBenchmark;
    if (filterMode === 'open') return m.isOpen;
    if (filterMode === 'benchmark') return m.isBenchmark;
    return true;
  });

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    onShowToast('마트 주소가 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleOpenKakaoMap = (mart: MartStatus) => {
    const query = encodeURIComponent(`월계동 ${mart.name}`);
    window.open(`https://map.kakao.com/?q=${query}`, '_blank');
  };

  const handleOpenNaverMap = (mart: MartStatus) => {
    const query = encodeURIComponent(`월계동 ${mart.name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  };

  // Label anchor styles to avoid collisions
  const getMarkerAnchorStyle = (martId: string) => {
    switch (martId) {
      case 'mart-3': // 광운대 골목식자재마트 (3분, Northwest) -> Anchor Top-Left
        return {
          wrapper: '-translate-x-[85%] -translate-y-[100%]',
          arrow: 'left-[85%] -bottom-1 rotate-45',
        };
      case 'mart-1': // 월계 화랑마트 (4분, North-Northeast) -> Anchor Top-Right
        return {
          wrapper: 'translate-x-[5%] -translate-y-[100%]',
          arrow: 'left-[15%] -bottom-1 rotate-45',
        };
      case 'mart-2': // 석계 알뜰청과 (8분, South) -> Anchor Bottom
        return {
          wrapper: '-translate-x-1/2 translate-y-2',
          arrow: 'left-1/2 -top-1 -translate-x-1/2 rotate-45',
        };
      case 'mart-4': // 이마트 월계점 (18분, Far Northeast) -> Anchor Top-Left
        return {
          wrapper: '-translate-x-[90%] -translate-y-1/2',
          arrow: 'right-1 top-1/2 -translate-y-1/2 rotate-45',
        };
      default:
        return {
          wrapper: '-translate-x-1/2 -translate-y-full',
          arrow: 'left-1/2 -bottom-1 -translate-x-1/2 rotate-45',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fafaf4] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#e3e3de] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#e3e3de] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#1a1c19]">
                  내 근처 마트 보기 (월계동 도보 비례 지도)
                </h2>
                <span className="text-[11px] font-bold bg-[#e8f5e9] text-[#0d631b] border border-[#a3f69c] px-2 py-0.5 rounded-full">
                  도보 시간 비례 배치 • 충돌 방지 뷰
                </span>
              </div>
              <p className="text-xs text-[#707a6c]">
                <strong>도보 5분 생활권</strong>(화랑마트·골목식자재마트)과 <strong>원거리 대형마트</strong>(이마트 18분)의 실제 이동시간 격차를 지도에서 한눈에 확인하세요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f4f4ef] hover:bg-[#e8e8e3] text-[#707a6c] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & View Control Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-white/80 border-b border-[#eeeee9] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : 'bg-[#fafaf4] text-[#40493d] border border-[#e3e3de] hover:bg-[#eeeee9]'
              }`}
            >
              전체 마트 ({marts.length})
            </button>
            <button
              onClick={() => setFilterMode('local')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterMode === 'local'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : 'bg-[#fafaf4] text-[#40493d] border border-[#e3e3de] hover:bg-[#eeeee9]'
              }`}
            >
              월계1동 3대 골목마트 (초근접)
            </button>
            <button
              onClick={() => setFilterMode('open')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterMode === 'open'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : 'bg-[#fafaf4] text-[#40493d] border border-[#e3e3de] hover:bg-[#eeeee9]'
              }`}
            >
              🟢 지금 영업 중 ({marts.filter((m) => m.isOpen).length})
            </button>
            <button
              onClick={() => setFilterMode('benchmark')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterMode === 'benchmark'
                  ? 'bg-[#40493d] text-white shadow-xs'
                  : 'bg-[#fafaf4] text-[#40493d] border border-[#e3e3de] hover:bg-[#eeeee9]'
              }`}
            >
              비교 기준 (이마트 월계점 18분)
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNearbyClusterList(!showNearbyClusterList)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                showNearbyClusterList
                  ? 'bg-[#e8f5e9] text-[#0d631b] border-[#a3f69c]'
                  : 'bg-white text-[#707a6c] border-[#e3e3de] hover:bg-[#fafaf4]'
              }`}
              title="근접 마트 리스트 펼치기/접기"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>근접 2곳 리스트</span>
              {showNearbyClusterList ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Modal Main Body (2 Columns on Desktop: Map Canvas on Left, Details on Right) */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column: Interactive Map Canvas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-[#e3e3de] space-y-3 overflow-y-auto">
            {/* Interactive SVG / Canvas Map Container */}
            <div className="relative w-full h-80 sm:h-96 lg:h-[380px] rounded-2xl overflow-hidden bg-[#e6eae3] border border-[#d2d7cf] shadow-inner select-none">
              {/* Map Zoom Controls Overlay (Top-Right) */}
              <div className="absolute top-3 right-3 z-40 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl shadow-md border border-[#e3e3de] flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1.8 ? 1.4 : prev === 1.4 ? 1 : 1))}
                  disabled={zoomLevel === 1}
                  className="w-7 h-7 rounded-lg bg-[#f4f4ef] hover:bg-[#e8e8e3] disabled:opacity-40 text-[#40493d] flex items-center justify-center transition-colors cursor-pointer"
                  title="축소"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1 px-1">
                  <button
                    onClick={() => setZoomLevel(1)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      zoomLevel === 1 ? 'bg-[#0d631b] text-white' : 'text-[#707a6c] hover:bg-[#f4f4ef]'
                    }`}
                  >
                    1x (전체)
                  </button>
                  <button
                    onClick={() => setZoomLevel(1.4)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      zoomLevel === 1.4 ? 'bg-[#0d631b] text-white' : 'text-[#707a6c] hover:bg-[#f4f4ef]'
                    }`}
                  >
                    1.4x (골목)
                  </button>
                  <button
                    onClick={() => setZoomLevel(1.8)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      zoomLevel === 1.8 ? 'bg-[#0d631b] text-white' : 'text-[#707a6c] hover:bg-[#f4f4ef]'
                    }`}
                  >
                    1.8x (상세)
                  </button>
                </div>
                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.4 : prev === 1.4 ? 1.8 : 1.8))}
                  disabled={zoomLevel === 1.8}
                  className="w-7 h-7 rounded-lg bg-[#f4f4ef] hover:bg-[#e8e8e3] disabled:opacity-40 text-[#40493d] flex items-center justify-center transition-colors cursor-pointer"
                  title="확대"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Map Zoomable Scaled Canvas */}
              <div
                className="absolute inset-0 transition-transform duration-300 origin-[34%_45%]"
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
              >
                {/* Map Background Grid / Roads Pattern */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#5d665a_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

                {/* Major Roads & Waterways Graphic */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Concentric Walking Distance Isochrones from Home (34%, 50%) */}
                  {/* 5-minute walk boundary circle (radius ~ 22%) */}
                  <ellipse
                    cx="34%"
                    cy="50%"
                    rx="22%"
                    ry="24%"
                    fill="#0d631b"
                    fillOpacity="0.05"
                    stroke="#0d631b"
                    strokeWidth="1.8"
                    strokeDasharray="5,4"
                    className="opacity-70"
                  />
                  {/* 10-minute walk boundary circle (radius ~ 42%) */}
                  <ellipse
                    cx="34%"
                    cy="50%"
                    rx="42%"
                    ry="44%"
                    fill="#f59e0b"
                    fillOpacity="0.03"
                    stroke="#f59e0b"
                    strokeWidth="1.4"
                    strokeDasharray="6,5"
                    className="opacity-60"
                  />

                  {/* Uicheon Stream curve */}
                  <path
                    d="M 0 170 Q 180 200 280 270 T 520 360"
                    fill="none"
                    stroke="#99c9eb"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  {/* Jungnangcheon River (Separates Emart in East) */}
                  <path
                    d="M 460 0 Q 430 150 490 280 T 550 420"
                    fill="none"
                    stroke="#99c9eb"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  {/* Subway Line 1 (Track line) */}
                  <path
                    d="M 180 0 L 220 200 L 290 380"
                    fill="none"
                    stroke="#0052A4"
                    strokeWidth="5"
                    strokeDasharray="8,5"
                    className="opacity-60"
                  />
                  {/* Kwangwoon-ro Main Street */}
                  <path
                    d="M 60 90 Q 200 130 340 180 T 450 250"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="opacity-90 shadow-sm"
                  />
                  {/* Seokgye-ro Connection */}
                  <path
                    d="M 220 200 Q 280 270 330 350"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-90"
                  />

                  {/* Distance Path Connector to Selected Mart */}
                  {selectedMart && (
                    <line
                      x1={`${USER_HOME.x}%`}
                      y1={`${USER_HOME.y}%`}
                      x2={`${selectedMart.mapX}%`}
                      y2={`${selectedMart.mapY}%`}
                      stroke={selectedMart.isBenchmark ? '#ba1a1a' : '#0d631b'}
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* Distance Boundary Area Badges */}
                <div className="absolute top-[28%] left-[14%] text-[9px] font-bold text-[#0d631b] bg-[#e8f5e9]/90 border border-[#a3f69c] px-1.5 py-0.5 rounded-md pointer-events-none z-10">
                  도보 5분 생활권
                </div>
                <div className="absolute top-[68%] left-[18%] text-[9px] font-bold text-[#b45309] bg-[#fef3c7]/90 border border-[#fde68a] px-1.5 py-0.5 rounded-md pointer-events-none z-10">
                  도보 10분 생활권
                </div>
                <div className="absolute top-[6%] right-[8%] text-[9px] font-bold text-[#991b1b] bg-[#fee2e2]/90 border border-[#fca5a5] px-1.5 py-0.5 rounded-md pointer-events-none z-10">
                  도보 18분 (1.6km 대형마트 권역)
                </div>

                {/* Area Landmark Labels */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[9px] font-extrabold text-[#1a1c19] shadow-xs flex items-center gap-1 border border-[#e3e3de] pointer-events-none z-10">
                  <span>🎓 광운대학교</span>
                </div>

                <div className="absolute top-24 left-[24%] bg-[#0052A4] text-white px-2 py-0.5 rounded-md text-[9px] font-bold shadow-xs flex items-center gap-1 pointer-events-none z-10">
                  <span>🚇 광운대역</span>
                </div>

                <div className="absolute bottom-6 left-[44%] bg-[#0052A4] text-white px-2 py-0.5 rounded-md text-[9px] font-bold shadow-xs flex items-center gap-1 pointer-events-none z-10">
                  <span>🚇 석계역</span>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* CRITICAL: "내 위치(출발점)" Marker ALWAYS on top (z-index 60) */}
                {/* Collision clearance guaranteed via radial spacing           */}
                {/* ----------------------------------------------------------- */}
                <div
                  style={{
                    left: `${USER_HOME.x}%`,
                    top: `${USER_HOME.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none select-none flex flex-col items-center"
                >
                  {/* Glowing Pulse Aura */}
                  <div className="absolute -inset-2 rounded-full bg-[#fe5825]/25 animate-ping" />
                  
                  {/* Departure Pin Badge */}
                  <div className="relative bg-[#fe5825] text-white px-2.5 py-1 rounded-full text-[11px] font-black shadow-xl flex items-center gap-1.5 border-2 border-white ring-2 ring-[#fe5825]/40 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>🏠 내 원룸 (출발점)</span>
                  </div>
                  {/* Pin Point */}
                  <div className="w-2 h-2 bg-[#fe5825] rotate-45 -mt-1 border-r border-b border-white" />
                </div>

                {/* Mart Pin Markers with Collision-Free Directional Anchors */}
                {filteredMarts.map((mart) => {
                  const isSelected = mart.id === selectedMartId;
                  const anchor = getMarkerAnchorStyle(mart.id);
                  const isClosePair = mart.id === 'mart-1' || mart.id === 'mart-3';

                  return (
                    <button
                      key={mart.id}
                      onClick={() => setSelectedMartId(mart.id)}
                      style={{
                        left: `${mart.mapX}%`,
                        top: `${mart.mapY}%`,
                      }}
                      className={`absolute z-30 group cursor-pointer transition-all duration-200 ${
                        isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                      }`}
                    >
                      {/* Collision-avoiding offset card */}
                      <div className={`relative ${anchor.wrapper}`}>
                        <div
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                            isSelected
                              ? mart.isBenchmark
                                ? 'bg-[#40493d] text-white border-white ring-4 ring-[#40493d]/30'
                                : 'bg-[#0d631b] text-white border-white ring-4 ring-[#0d631b]/30'
                              : mart.isBenchmark
                              ? 'bg-[#f4f4ef] text-[#40493d] border-[#c2c9bd] hover:border-[#40493d]'
                              : 'bg-white text-[#1a1c19] border-[#e3e3de] hover:border-[#0d631b]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              mart.isBenchmark
                                ? 'bg-[#707a6c]'
                                : mart.isOpen
                                ? 'bg-[#a3f69c] animate-pulse'
                                : 'bg-[#ba1a1a]'
                            }`}
                          />
                          <div className="flex flex-col items-start leading-tight">
                            <div className="flex items-center gap-1">
                              <span>{mart.name}</span>
                              {mart.isBenchmark && (
                                <span className="text-[9px] bg-[#e3e3de] text-[#40493d] px-1 rounded font-normal">
                                  기준점
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-normal ${
                                isSelected
                                  ? 'text-white/90'
                                  : mart.isBenchmark
                                  ? 'text-[#ba1a1a] font-bold'
                                  : 'text-[#0d631b] font-bold'
                              }`}
                            >
                              도보 {mart.walkMinutes}분 ({mart.distance.split(' ')[1] || mart.distance})
                            </span>
                          </div>
                        </div>

                        {/* Anchor arrow pointing directly to coordinates */}
                        <div
                          className={`w-2.5 h-2.5 absolute ${anchor.arrow} ${
                            isSelected
                              ? mart.isBenchmark
                                ? 'bg-[#40493d]'
                                : 'bg-[#0d631b]'
                              : mart.isBenchmark
                              ? 'bg-[#f4f4ef]'
                              : 'bg-white'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Footer Distance Scale & Walk Proportionality Guide */}
              <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-[#40493d] shadow-sm border border-[#e3e3de] flex items-center gap-2 z-20">
                <Footprints className="w-3.5 h-3.5 text-[#0d631b]" />
                <span>
                  도보 비례 지도: <strong>골목마트(3~4분)</strong> ↔ <strong>이마트(18분, 4.5배 거리)</strong>
                </span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-[#707a6c]">
                  <span>📏 도보 5분 반경 (약 400m)</span>
                </div>
              </div>
            </div>

            {/* Sub-point 3: Expandable List for Nearby Close Marts (3 & 4 mins) */}
            {showNearbyClusterList && (
              <div className="bg-white rounded-2xl p-3 border border-[#a3f69c] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0d631b]" />
                    <span className="text-xs font-black text-[#1a1c19]">
                      🏠 내 원룸 반경 4분 초근접 골목마트 (2곳)
                    </span>
                    <span className="text-[10px] text-[#707a6c]">
                      (라벨 겹침 방지 전용 리스트 뷰)
                    </span>
                  </div>
                  <button
                    onClick={() => setZoomLevel(1.4)}
                    className="text-[11px] font-bold text-[#0d631b] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>지도에서 확대보기</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {closeMarts.map((mart) => {
                    const isSelected = mart.id === selectedMartId;
                    return (
                      <div
                        key={mart.id}
                        onClick={() => setSelectedMartId(mart.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#e8f5e9] border-[#0d631b] ring-2 ring-[#0d631b]/20'
                            : 'bg-[#fafaf4] border-[#e3e3de] hover:border-[#a3f69c]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-[#1a1c19]">{mart.name}</span>
                              <span className="text-[10px] font-extrabold bg-[#a3f69c] text-[#002204] px-1.5 py-0.2 rounded">
                                {mart.walkMinutes}분
                              </span>
                            </div>
                            <p className="text-[11px] text-[#707a6c] mt-0.5">{mart.distance}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              mart.isOpen ? 'bg-white text-[#0d631b]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {mart.isOpen ? '영업중' : '휴무'}
                          </span>
                        </div>

                        {/* Quick Deals Preview */}
                        <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                          <span className="text-[#40493d] truncate max-w-[150px]">
                            {mart.specialDeals?.[0]?.name}
                          </span>
                          <span className="font-extrabold text-[#0d631b]">
                            {mart.specialDeals?.[0]?.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Mart Selector Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filteredMarts.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMartId(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 text-left border flex items-center gap-2 cursor-pointer ${
                    m.id === selectedMartId
                      ? 'bg-white border-[#0d631b] text-[#0d631b] shadow-xs ring-1 ring-[#0d631b]'
                      : 'bg-white/80 border-[#e3e3de] text-[#40493d] hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.isBenchmark ? 'bg-gray-500' : m.isOpen ? 'bg-[#0d631b]' : 'bg-gray-400'
                    }`}
                  />
                  <span>{m.name.length > 9 ? `${m.name.slice(0, 9)}...` : m.name}</span>
                  <span className={`text-[10px] ${m.isBenchmark ? 'text-[#ba1a1a] font-bold' : 'text-[#707a6c]'}`}>
                    {m.walkMinutes}분
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Mart Information & Hours Card (5 Cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 overflow-y-auto space-y-5 bg-white">
            {/* Mart Title & Live Badge */}
            <div className="space-y-2 pb-4 border-b border-[#eeeee9]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    {selectedMart.isBenchmark ? (
                      <span className="text-[10px] font-bold bg-[#eeeee9] text-[#40493d] px-2 py-0.5 rounded-full border border-[#d2d7cf]">
                        비교 기준 대형마트 (외곽 18분)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-[#a3f69c] text-[#002204] px-2 py-0.5 rounded-full">
                        월계1동 3대 골목마트
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#707a6c]">{selectedMart.branch}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#1a1c19] mt-1">
                    {selectedMart.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                      selectedMart.isOpen
                        ? 'bg-[#a3f69c] text-[#002204]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedMart.isOpen ? 'bg-[#0d631b] animate-ping' : 'bg-[#ba1a1a]'
                      }`}
                    />
                    {selectedMart.isOpen ? '현재 영업 중' : '영업 종료'}
                  </span>
                  <div className="text-[11px] text-[#707a6c] mt-1 flex items-center justify-end gap-1">
                    <Footprints className="w-3 h-3 text-[#0d631b]" />
                    <span>{selectedMart.distance}</span>
                  </div>
                </div>
              </div>

              {/* Benchmark Distance Warning Notice */}
              {selectedMart.isBenchmark && (
                <div className="p-2.5 rounded-xl bg-[#fff8e1] border border-[#ffe082] text-[#856404] text-xs leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-[#f59e0b] mt-0.5" />
                  <div>
                    <strong>비교 기준 대형마트 안내:</strong> 이마트 월계점은 도보 편도 18분(왕복 36분 / 1.6km) 거리로, 3~4분 거리인 골목마트(화랑마트·골목식자재마트)에 비해 도보 장보기가 번거로울 수 있습니다. 가격 비교용 기준으로 표시됩니다.
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedMart.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f4f4ef] text-[#40493d] border border-[#e3e3de]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Business Hours & Operating Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#707a6c] uppercase tracking-wider">
                매장 상세 운영 정보
              </h4>

              <div className="space-y-2 text-xs">
                {/* Hours */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafaf4] border border-[#eeeee9]">
                  <div className="flex items-center gap-2 text-[#40493d]">
                    <Clock className="w-4 h-4 text-[#0d631b]" />
                    <span className="font-semibold">영업 시간</span>
                  </div>
                  <span className="font-bold text-[#1a1c19]">
                    {selectedMart.openTime} ~ {selectedMart.closingTime}
                  </span>
                </div>

                {/* Holidays */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafaf4] border border-[#eeeee9]">
                  <div className="flex items-center gap-2 text-[#40493d]">
                    <Calendar className="w-4 h-4 text-[#ba1a1a]" />
                    <span className="font-semibold">정기 휴무</span>
                  </div>
                  <span className="font-bold text-[#1a1c19]">
                    {selectedMart.holidayInfo}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafaf4] border border-[#eeeee9]">
                  <div className="flex items-center gap-2 text-[#40493d]">
                    <Phone className="w-4 h-4 text-[#0d631b]" />
                    <span className="font-semibold">전화번호</span>
                  </div>
                  <a
                    href={`tel:${selectedMart.phone}`}
                    className="font-bold text-[#0d631b] hover:underline"
                  >
                    {selectedMart.phone}
                  </a>
                </div>

                {/* Address */}
                <div className="p-2.5 rounded-xl bg-[#fafaf4] border border-[#eeeee9] space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#40493d]">
                      <MapPin className="w-4 h-4 text-[#0d631b]" />
                      <span className="font-semibold">매장 주소</span>
                    </div>
                    <button
                      onClick={() => handleCopyAddress(selectedMart.address)}
                      className="text-[11px] text-[#0d631b] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>복사됨!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>주소 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#707a6c] pl-6 font-mono">
                    {selectedMart.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Local Tips & Shopping Advice */}
            <div className="p-3 rounded-2xl bg-[#f4f7f2] border border-[#d8e3d5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d631b]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>월계동 주민 & 자취생 장보기 꿀팁</span>
              </div>
              <p className="text-xs text-[#40493d] leading-relaxed">
                {selectedMart.tips}
              </p>
            </div>

            {/* Special Deals from this Store */}
            {selectedMart.specialDeals && selectedMart.specialDeals.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#0d631b]" />
                    <h4 className="text-xs font-bold text-[#1a1c19]">
                      오늘의 매장 단독 특가 ({selectedMart.specialDeals.length}건)
                    </h4>
                  </div>
                  <SourceBadge
                    source={selectedMart.isBenchmark ? '공공데이터 기준' : '현장 확인'}
                    detail={selectedMart.isBenchmark ? '공식 대형마트 기준 시세 (오전 06:00)' : '매장 방문 실측 가격 (오전 07:15)'}
                  />
                </div>

                <div className="space-y-1.5">
                  {selectedMart.specialDeals.map((deal, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#fafaf4] border border-[#e3e3de] flex items-center justify-between gap-2 hover:border-[#a3f69c] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={getDealImageUrl(deal.name)}
                          alt={deal.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#e3e3de] shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1a1c19] truncate">
                            {deal.name}
                          </p>
                          <span className="text-[10px] text-[#707a6c]">{deal.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-[#0d631b]">
                            {deal.price.toLocaleString()}원
                          </span>
                          {deal.discountRate && (
                            <span className="text-[10px] font-bold text-[#fe5825] ml-1">
                              {deal.discountRate}
                            </span>
                          )}
                        </div>

                        {onAddToCart && (
                          <button
                            onClick={() => {
                              onAddToCart({
                                id: `deal-${selectedMart.id}-${idx}`,
                                ingredientName: deal.name,
                                category: 'vegetable',
                                storeName: selectedMart.name,
                                storeDistance: selectedMart.distance,
                                storeLocation: selectedMart.address,
                                price: deal.price,
                                unit: deal.unit,
                                soloPortionUnit: deal.unit,
                                unitPriceDesc: `${deal.price.toLocaleString()}원`,
                                savingsNote: `${selectedMart.name} 당일 특가`,
                                isSpecialDeal: true,
                                date: '2026-10-05',
                                imageUrl: getDealImageUrl(deal.name),
                                inStock: true,
                                dataSource: selectedMart.isBenchmark ? '시연용 예시' : '현장 확인',
                                sourceDetail: `${selectedMart.name} 매장 실측`,
                              });
                              onShowToast(`[${selectedMart.name}] ${deal.name} 장바구니 담기 완료!`);
                            }}
                            className="p-1.5 bg-white hover:bg-[#0d631b] hover:text-white rounded-lg border border-[#e3e3de] text-[#40493d] transition-colors cursor-pointer"
                            title="장바구니 담기"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Navigation Link Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleOpenKakaoMap(selectedMart)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#fee500] hover:bg-[#ffd900] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>카카오맵 길찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleOpenNaverMap(selectedMart)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#03c75a] hover:bg-[#02b351] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>네이버 지도 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

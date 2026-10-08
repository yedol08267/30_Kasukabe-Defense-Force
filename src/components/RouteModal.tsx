import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  Footprints,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeTitle?: string;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  recipeTitle = '칼칼 자작 두부조림 1인분 장보기 코스',
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.3>(1);

  if (!isOpen) return null;

  const routeSteps = [
    {
      spot: '광운대역 1번 출구',
      tag: '출발점',
      time: '0분 (출발)',
      walkMinutes: 0,
      desc: '등·하교 또는 퇴근 후 장보기 시작 지점',
      isStore: false,
      mapX: 10,
      mapY: 38,
      anchor: 'top-left',
    },
    {
      spot: '월계 화랑마트',
      tag: '1차 픽업 (두부)',
      time: '도보 4분 (320m)',
      walkMinutes: 4,
      desc: '찌개·부침용 두부 1모 (990원) 픽업',
      isStore: true,
      price: '990원',
      originalPrice: '1,450원',
      mapX: 36,
      mapY: 66,
      anchor: 'bottom',
    },
    {
      spot: '석계 알뜰청과',
      tag: '2차 픽업 (대파)',
      time: '도보 3분 (210m)',
      walkMinutes: 3,
      desc: '친환경 흙대파 반단 (1,400원) 픽업',
      isStore: true,
      price: '1,400원',
      originalPrice: '2,100원',
      mapX: 62,
      mapY: 32,
      anchor: 'top',
    },
    {
      spot: '광운대 원룸촌 / 기숙사 귀가',
      tag: '도착 (요리 시작)',
      time: '도보 5분 (380m)',
      walkMinutes: 5,
      desc: '총 도보 12분 소요 완료 • 따뜻한 밥 짓기 시작!',
      isStore: false,
      mapX: 88,
      mapY: 66,
      anchor: 'bottom-right',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative border border-[#e3e3de] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eeeee9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0d631b] text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-[#1a1c19]">
                  추천 스마트 픽업 동선 지도
                </h3>
                <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#0d631b] px-2 py-0.5 rounded-full border border-[#a3f69c]">
                  도보 시간 비례 배치
                </span>
              </div>
              <p className="text-xs text-[#707a6c]">{recipeTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4f4ef] hover:bg-[#e8e8e3] text-[#707a6c] flex items-center justify-center transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pt-4 min-h-0 flex-1">
          {/* Visual Route Map Canvas */}
          <div className="relative rounded-2xl overflow-hidden bg-[#e6eae3] border border-[#d2d7cf] shadow-inner select-none h-60 sm:h-68">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#5d665a_1.2px,transparent_1.2px)] [background-size:20px_20px]" />

            {/* Zoom Controls Overlay */}
            <div className="absolute top-2.5 right-2.5 z-40 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-xs border border-[#e3e3de] flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setZoomLevel((prev) => (prev === 1.3 ? 1 : 1))}
                disabled={zoomLevel === 1}
                className="w-6 h-6 rounded-md bg-[#f4f4ef] disabled:opacity-40 text-[#40493d] flex items-center justify-center cursor-pointer"
                title="기본 크기"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="font-bold text-[10px] text-[#40493d] px-1">
                {zoomLevel === 1 ? '1x (전체 코스)' : '1.3x (확대)'}
              </span>
              <button
                onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.3 : 1.3))}
                disabled={zoomLevel === 1.3}
                className="w-6 h-6 rounded-md bg-[#f4f4ef] disabled:opacity-40 text-[#40493d] flex items-center justify-center cursor-pointer"
                title="동선 확대"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Scaled Canvas Container */}
            <div
              className="absolute inset-0 transition-transform duration-300 origin-[50%_50%]"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Styled Route Line Canvas */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Connecting Path */}
                <path
                  d="M 60 90 Q 150 160 220 160 T 380 75 T 540 160"
                  fill="none"
                  stroke="#a3f69c"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="opacity-70"
                />
                {/* Animated Dash Path */}
                <path
                  d="M 60 90 Q 150 160 220 160 T 380 75 T 540 160"
                  fill="none"
                  stroke="#0d631b"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              </svg>

              {/* Distant Benchmark Mart Comparison Badge (Top Center/Right) */}
              <div className="absolute top-2.5 left-2.5 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#ffe082] text-[10px] text-[#856404] shadow-xs flex items-center gap-1.5 pointer-events-none">
                <Info className="w-3 h-3 text-[#f59e0b] shrink-0" />
                <span>
                  <strong>비교:</strong> 이마트 월계점은 <strong>도보 편도 18분 (왕복 36분)</strong>으로 골목 동선(12분) 대비 3배 소요
                </span>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Step Markers with Non-Colliding Alternating Anchors           */}
              {/* ------------------------------------------------------------- */}

              {/* Node 1: 광운대역 1번출구 (출발점) - ALWAYS HIGHEST Z-INDEX (z-50) */}
              <div
                onClick={() => setActiveStepIndex(0)}
                style={{ left: `${routeSteps[0].mapX}%`, top: `${routeSteps[0].mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer group"
              >
                {/* Glowing Aura Ring */}
                <div className="absolute -inset-2 rounded-full bg-[#fe5825]/30 animate-ping pointer-events-none" />
                
                {/* Marker Badge with Top-Left Anchor */}
                <div className="relative -translate-x-2 -translate-y-9">
                  <div className="bg-[#fe5825] text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xl flex items-center gap-1.5 border-2 border-white ring-2 ring-[#fe5825]/40 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>🚇 광운대역 1번출구 (출발)</span>
                  </div>
                  <div className="w-2 h-2 bg-[#fe5825] rotate-45 mx-auto -mt-1 border-r border-b border-white" />
                </div>
              </div>

              {/* Node 2: 월계 화랑마트 (4분) - Anchor Bottom */}
              <div
                onClick={() => setActiveStepIndex(1)}
                style={{ left: `${routeSteps[1].mapX}%`, top: `${routeSteps[1].mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              >
                {/* Pin Point */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0d631b] border-2 border-white shadow-md mx-auto" />
                {/* Label Anchored to Bottom */}
                <div className="mt-1 -translate-x-1/2 left-1/2 relative">
                  <div
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                      activeStepIndex === 1
                        ? 'bg-[#0d631b] text-white border-white ring-2 ring-[#0d631b]/30'
                        : 'bg-white text-[#1a1c19] border-[#a3f69c]'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-[#a3f69c]" />
                    <span>월계 화랑마트 (두부 990원)</span>
                    <span className="text-[10px] font-normal opacity-90">• 4분</span>
                  </div>
                </div>
              </div>

              {/* Node 3: 석계 알뜰청과 (3분) - Anchor Top */}
              <div
                onClick={() => setActiveStepIndex(2)}
                style={{ left: `${routeSteps[2].mapX}%`, top: `${routeSteps[2].mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              >
                {/* Label Anchored to Top */}
                <div className="-translate-y-10 -translate-x-1/2 left-1/2 relative">
                  <div
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                      activeStepIndex === 2
                        ? 'bg-[#0d631b] text-white border-white ring-2 ring-[#0d631b]/30'
                        : 'bg-white text-[#1a1c19] border-[#a3f69c]'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-[#0d631b]" />
                    <span>석계 알뜰청과 (대파 1,400원)</span>
                    <span className="text-[10px] font-normal opacity-90">• 3분</span>
                  </div>
                  <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 border-r border-b border-[#a3f69c]" />
                </div>
                {/* Pin Point */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0d631b] border-2 border-white shadow-md mx-auto -mt-6" />
              </div>

              {/* Node 4: 원룸/기숙사 도착 (5분) - Anchor Bottom-Right */}
              <div
                onClick={() => setActiveStepIndex(3)}
                style={{ left: `${routeSteps[3].mapX}%`, top: `${routeSteps[3].mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer group"
              >
                {/* Pin Point */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#2e7d32] border-2 border-white shadow-md mx-auto" />
                {/* Label Anchored to Bottom */}
                <div className="mt-1 -translate-x-1/2 left-1/2 relative">
                  <div
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                      activeStepIndex === 3
                        ? 'bg-[#2e7d32] text-white border-white ring-2 ring-[#2e7d32]/30'
                        : 'bg-white text-[#1a1c19] border-[#e3e3de]'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#0d631b]" />
                    <span>원룸 도착 (귀가)</span>
                    <span className="text-[10px] font-normal opacity-90">• 5분</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Walking Metric Badge */}
            <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm z-30">
              <Clock className="w-3.5 h-3.5 text-[#a3f69c]" />
              <span className="font-bold">총 도보 12분 (약 910m)</span>
              <span className="text-gray-400">|</span>
              <span className="text-[#a3f69c] font-bold">대형마트 대비 1,160원 절약!</span>
            </div>
          </div>

          {/* Interactive Steps List */}
          <div className="space-y-2 text-xs">
            {routeSteps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3 rounded-2xl flex items-start justify-between gap-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#e8f5e9] border-[#0d631b] ring-1 ring-[#0d631b]'
                      : step.isStore
                      ? 'bg-[#fafaf4] border-[#e3e3de] hover:border-[#a3f69c]'
                      : 'bg-[#f4f4ef] border-[#e3e3de]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        idx === 0
                          ? 'bg-[#fe5825] text-white'
                          : idx === routeSteps.length - 1
                          ? 'bg-[#2e7d32] text-white'
                          : 'bg-[#0d631b] text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-black text-[#1a1c19] flex items-center gap-2 flex-wrap">
                        <span>{step.spot}</span>
                        <span className="text-[11px] font-semibold text-[#0d631b]">
                          {step.time}
                        </span>
                        <span className="text-[10px] font-normal text-[#707a6c] bg-white px-1.5 py-0.2 rounded border border-[#e3e3de]">
                          {step.tag}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#40493d] mt-1">
                        {step.desc}
                      </div>
                    </div>
                  </div>

                  {step.price && (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#0d631b] bg-white px-2 py-0.5 rounded-lg border border-[#a3f69c] shadow-2xs">
                        {step.price}
                      </div>
                      <div className="text-[10px] text-[#707a6c] line-through mt-0.5">
                        {step.originalPrice}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Route Summary Card */}
          <div className="p-3 rounded-2xl bg-[#fafaf4] border border-[#e3e3de] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#40493d]">
              <Footprints className="w-4 h-4 text-[#0d631b]" />
              <span>
                <strong>자취 1인 가구 최적 동선:</strong> 환승 없이 걸어서 12분 만에 두부와 대파 픽업 완료!
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-[#0d631b] shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>총 2,390원 결제</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-[#eeeee9] flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              window.open(
                'https://map.kakao.com/?sName=광운대역1번출구&eName=월계화랑마트',
                '_blank'
              );
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>카카오맵으로 코스 길찾기</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#40493d] font-semibold text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

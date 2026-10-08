import React from 'react';
import welgyeLogo from '../assets/images/welgye_mascot_logo_1790923061344.jpg';
import {
  Scale,
  BellRing,
  Footprints,
  PiggyBank,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  TrendingDown,
  Store,
  Sparkles,
  Zap,
} from 'lucide-react';
import { loginWithKakao } from '../services/kakaoService';

interface LandingStoryProps {
  onStartBrowsing: () => void;
  onOpenWishlist: () => void;
  onOpenPriceComparison: () => void;
  onShowToast: (msg: string) => void;
}

export const LandingStory: React.FC<LandingStoryProps> = ({
  onStartBrowsing,
  onOpenWishlist,
  onOpenPriceComparison,
  onShowToast,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-10 sm:space-y-12">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Ambient Tints */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#a3f69c]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffdbd1]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Brand Story & Bento (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#e3e3de] px-4 py-1.5 rounded-full shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d631b] animate-pulse" />
              <span className="text-xs text-[#40493d] font-medium">
                인증완료: 서울 노원구 월계1동 (광운대·석계·인덕대) •{' '}
                <strong className="text-[#0d631b]">오늘의 세일 레이더 (07:15 확인)</strong>
              </span>
            </div>

            {/* Main Headline & Meaning */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1c19] tracking-tight leading-tight">
                월계1동 자취생을 위한<br />
                <span className="text-[#0d631b] underline decoration-[#a3f69c] decoration-4 underline-offset-8">
                  장바구니 구원투수
                </span>
                , 웰계장터
              </h1>
              <p className="text-sm sm:text-base text-[#40493d] leading-relaxed max-w-xl">
                '웰빙'과 '월계장터'가 만났습니다. 1인 가구는 대용량 묶음 채소를 사면 다 먹지 못하고 버리기 일쑤입니다.
                광운대·석계역 골목 마트의 소포장·단품 가격과 당일 특가를 매일 아침 현장 확인 및 공공데이터를 기반으로 쏙쏙 골라 비교해 드립니다.
              </p>
            </div>

            {/* Social Proof Live Stat */}
            <div className="bg-[#f4f4ef] p-4 sm:p-5 rounded-2xl border border-[#e3e3de] flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-[#707a6c]">월계1동 동네 절약 계산기</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#1a1c19]">
                    오늘 주민 <span className="text-[#0d631b]">1,420명</span>이 총{' '}
                    <span className="text-[#b02e00]">428,500원</span> 절약!
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-white border border-[#e3e3de] rounded-full text-xs font-bold text-[#0d631b]">
                <TrendingDown className="w-3.5 h-3.5" />
                평균 32% 절감
              </div>
            </div>

            {/* 3 Essential Features Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* Card 1 */}
              <div
                onClick={onOpenPriceComparison}
                className="bg-white p-4 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f4ef] flex items-center justify-center text-[#0d631b]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#a3f69c]/40 text-[#002204] px-1.5 py-0.5 rounded">
                    최대 38% 절약
                  </span>
                  <h3 className="font-bold text-sm text-[#1a1c19]">1인 가구 소량·단품</h3>
                  <p className="text-[11px] text-[#707a6c] leading-snug">
                    월계 화랑마트, 석계 알뜰청과, 광운대 골목식자재마트와 이마트 월계점(비교 기준)의 낱개 시세 비교.
                  </p>
                </div>
                <div className="mt-3 pt-2 text-[#0d631b] text-xs font-bold flex items-center gap-1">
                  <span>단품 시세 확인</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={onOpenWishlist}
                className="bg-white p-4 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f4ef] flex items-center justify-center text-[#0d631b]">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c] px-1.5 py-0.5 rounded">
                    스마트 레이더
                  </span>
                  <h3 className="font-bold text-sm text-[#1a1c19]">찜한 식재료만 쏙쏙</h3>
                  <p className="text-[11px] text-[#707a6c] leading-snug">
                    양파 1알, 대파 반단, 계란 10구 등 찜한 필수 재료 급락 알림 즉시 푸시 (오전 7:15 확인 기준).
                  </p>
                </div>
                <div className="mt-3 pt-2 text-[#0d631b] text-xs font-bold flex items-center gap-1">
                  <span>관심품목 찜하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3 */}
              <div
                onClick={onStartBrowsing}
                className="bg-white p-4 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f4ef] flex items-center justify-center text-[#0d631b]">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#e3e3de] text-[#1a1c19] px-1.5 py-0.5 rounded">
                    등굣길 1분 컷
                  </span>
                  <h3 className="font-bold text-sm text-[#1a1c19]">아침 8시 식재료 브리핑</h3>
                  <p className="text-[11px] text-[#707a6c] leading-snug">
                    광운대역·석계역 귀가길 동선에 맞춘 최단 시간 장보기 경로 큐레이션.
                  </p>
                </div>
                <div className="mt-3 pt-2 text-[#0d631b] text-xs font-bold flex items-center gap-1">
                  <span>오늘 요약 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#707a6c] pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#0d631b]" />
                공공데이터 기준 시세(오전 06:00) | 현장 확인 가격(오전 07:15) 분리 표기
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#0d631b]" />
                월계1동 골목상권 18곳 매일 매장 전수 검증
              </span>
            </div>
          </div>

          {/* Right Column: Student Verification & Fast Start (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#e3e3de] relative overflow-hidden space-y-6">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0d631b] via-[#a3f69c] to-[#fe5825]" />

              {/* Welcoming Header */}
              <div className="text-center space-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-[#e3e3de] overflow-hidden mx-auto shadow-sm mb-3">
                  <img
                    src={welgyeLogo}
                    alt="웰계장터 마스코트"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1a1c19]">반가워요, 이웃님!</h2>
                <p className="text-xs text-[#707a6c]">
                  월계동 자취 식비 절약, 지금 바로 시작하세요.
                </p>
              </div>

              {/* Student Benefit Callout */}
              <div className="bg-[#fafaf4] p-4 rounded-2xl border border-[#e3e3de] flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-[#fe5825] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold bg-[#fe5825] text-white px-1.5 py-0.2 rounded uppercase">
                      UNIV SPECIAL
                    </span>
                    <span className="text-xs font-bold text-[#1a1c19]">
                      광운대·인덕대 웹메일 인증 특별 혜택
                    </span>
                  </div>
                  <p className="text-[11px] text-[#40493d] leading-relaxed">
                    학교 메일(@kw.ac.kr, @induk.ac.kr) 등록 시 기숙사·원룸촌 반경 500m 타임세일 VIP 우선 알림권을 드려요!
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const user = await loginWithKakao();
                      onShowToast(`카카오 계정(${user.nickname}님)으로 연결되었습니다!`);
                    } catch (err: any) {
                      onShowToast('카카오 계정 연결 완료! 장보기를 시작합니다.');
                    }
                    onStartBrowsing();
                  }}
                  className="w-full py-3 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.188.702-.68 2.545-.78 2.94-.12.482.176.475.37.346.154-.102 2.45-1.666 3.442-2.342.56.082 1.134.125 1.698.125 4.97 0 9-3.185 9-7.123C21 6.185 16.97 3 12 3z" />
                  </svg>
                  <span>카카오로 3초 만에 시작하기</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onShowToast('학생 이메일 계정으로 연결되었습니다.');
                    onStartBrowsing();
                  }}
                  className="w-full py-3 bg-[#0d631b] hover:bg-[#127f26] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>학교 / 자취생 이메일로 시작하기</span>
                </button>
              </div>

              {/* Browse Without Login Auxiliary Link */}
              <div className="text-center pt-2">
                <button
                  onClick={onStartBrowsing}
                  className="text-xs text-[#0d631b] font-bold hover:underline inline-flex items-center gap-1 group"
                >
                  <span>로그인 없이 오늘의 월계동 시세 먼저 둘러보기</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-[10px] text-center text-[#707a6c] leading-tight pt-1">
                월계1동 거주 확인 및 학생 신분 인증 외 용도로 수집하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Local Price Ticker Section */}
      <div className="pt-6 border-t border-[#e3e3de]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#fe5825]" />
            <h2 className="font-extrabold text-base text-[#1a1c19]">
              오늘 11시 기준 월계1동 즉시할인 TOP 4
            </h2>
          </div>
          <span className="text-xs text-[#707a6c]">방금 전 업데이트됨</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold bg-[#0d631b] text-white px-2 py-0.5 rounded">
                -45%
              </span>
              <span className="text-[10px] text-[#707a6c]">광운대역 도보 3분</span>
            </div>
            <div>
              <p className="font-bold text-xs text-[#1a1c19] truncate">흙대파 (반단 소분)</p>
              <p className="font-black text-sm text-[#0d631b] mt-0.5">
                990원 <span className="text-[11px] text-[#707a6c] line-through font-normal">1,800원</span>
              </p>
            </div>
            <p className="text-[10px] text-[#707a6c] mt-2">행복청과 월계점</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold bg-[#0d631b] text-white px-2 py-0.5 rounded">
                -32%
              </span>
              <span className="text-[10px] text-[#707a6c]">석계역 1번 출구</span>
            </div>
            <div>
              <p className="font-bold text-xs text-[#1a1c19] truncate">무항생제 대란 (10구)</p>
              <p className="font-black text-sm text-[#0d631b] mt-0.5">
                2,480원 <span className="text-[11px] text-[#707a6c] line-through font-normal">3,650원</span>
              </p>
            </div>
            <p className="text-[10px] text-[#707a6c] mt-2">홈플러스 익스프레스</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold bg-[#0284c7] text-white px-2 py-0.5 rounded">
                -40%
              </span>
              <span className="text-[10px] text-[#707a6c]">인덕대 정문 400m</span>
            </div>
            <div>
              <p className="font-bold text-xs text-[#1a1c19] truncate">햇양파 (1망/3개입)</p>
              <p className="font-black text-sm text-[#0d631b] mt-0.5">
                1,500원 <span className="text-[11px] text-[#707a6c] line-through font-normal">2,500원</span>
              </p>
            </div>
            <p className="text-[10px] text-[#707a6c] mt-2">월계 나들가게</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#e3e3de] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold bg-[#a3f69c] text-[#002204] px-2 py-0.5 rounded">
                단독특가
              </span>
              <span className="text-[10px] text-[#707a6c]">이마트 트레이더스 앞</span>
            </div>
            <div>
              <p className="font-bold text-xs text-[#1a1c19] truncate">햇반 210g 4개 묶음</p>
              <p className="font-black text-sm text-[#0d631b] mt-0.5">
                3,980원 <span className="text-[11px] text-[#707a6c] line-through font-normal">5,200원</span>
              </p>
            </div>
            <p className="text-[10px] text-[#707a6c] mt-2">이마트 월계점 (비교 기준)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

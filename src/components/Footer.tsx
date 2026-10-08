import React from 'react';
import { Store, ShieldCheck, MapPin } from 'lucide-react';
import welgyeLogo from '../assets/images/welgye_mascot_logo_1790923061344.jpg';

interface FooterProps {
  onOpenReportModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReportModal }) => {
  return (
    <footer className="w-full bg-[#f4f4ef] border-t border-[#e3e3de] mt-16 text-[#40493d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        {/* Brand & Purpose */}
        <div className="flex flex-col gap-2 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e3e3de] overflow-hidden p-0.5 shadow-2xs shrink-0">
              <img src={welgyeLogo} alt="웰계장터 로고" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-[#0d631b] tracking-tight">월계장터</span>
            <span className="text-[11px] font-bold bg-[#a3f69c] text-[#002204] px-2 py-0.5 rounded-full">
              로컬 장보기 인텔리전스
            </span>
          </div>
          <p className="text-xs text-[#40493d] leading-relaxed">
            광운대역 및 월계동 1인 가구, 대학생을 위한 스마트 로컬 식재료 최저가 비교 및 소분 장보기 플랫폼입니다. 대용량 묶음 포장 대신 혼자 사는 자취생에 최적화된 소포장 시세와 아침 브리핑을 제공합니다.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#707a6c] mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0d631b]" />
            <span>데이터 출처: 공공데이터 기준 시세(KAMIS 오전 06:00) | 동네 마트 현장 확인 가격(오전 07:15) 분리 표기</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#707a6c]">
            <Store className="w-3.5 h-3.5 text-[#0d631b]" />
            <span>현장 검증: 월계1동 골목상점 18곳 매일 현장 시세 전수 모니터링</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-8 sm:gap-12 text-xs">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1a1c19] text-sm">지역 정보</span>
            <span className="hover:text-[#0d631b] cursor-pointer">노원구 월계1·2·3동 상권</span>
            <span className="hover:text-[#0d631b] cursor-pointer">이마트 월계점(비교 기준) 연계</span>
            <span className="hover:text-[#0d631b] cursor-pointer">광운대역 석계 골목마켓</span>
            <span className="hover:text-[#0d631b] cursor-pointer">인덕대 정문 생활상권</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1a1c19] text-sm">고객 지원 & 참여</span>
            <button
              onClick={onOpenReportModal}
              className="text-left text-[#0d631b] font-semibold hover:underline"
            >
              골목 가게 가격 제보하기
            </button>
            <span className="hover:text-[#0d631b] cursor-pointer">월계동 마트 점주 등록 문의</span>
            <span className="hover:text-[#0d631b] cursor-pointer">1:1 실시간 자취 고민 상담실</span>
            <span className="hover:text-[#0d631b] cursor-pointer">이용약관 및 개인정보처리방침</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1a1c19] text-sm">대학생 지원</span>
            <span className="hover:text-[#0d631b] cursor-pointer">광운대학교 총학생회 제휴</span>
            <span className="hover:text-[#0d631b] cursor-pointer">인덕대학교 기숙사 특가존</span>
            <span className="hover:text-[#0d631b] cursor-pointer">원룸가 룸메이트 장보기 팁</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-[#e3e3de] flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-[#707a6c]">
        <p>© 2026 웰계장터 (Wolgye Market). All rights reserved.</p>
        <p className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>서울특별시 노원구 광운로 20 (월계동)</span>
        </p>
      </div>
    </footer>
  );
};

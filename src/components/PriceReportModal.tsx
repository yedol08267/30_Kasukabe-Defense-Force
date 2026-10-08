import React, { useState } from 'react';
import { X, Send, Store, AlertCircle } from 'lucide-react';

interface PriceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSuccess: (msg: string) => void;
}

export const PriceReportModal: React.FC<PriceReportModalProps> = ({
  isOpen,
  onClose,
  onReportSuccess,
}) => {
  const [store, setStore] = useState('월계 화랑마트');
  const [ingredient, setIngredient] = useState('대파');
  const [reportedPrice, setReportedPrice] = useState('');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedPrice) return;
    onReportSuccess(`${store}의 ${ingredient} 가격 제보가 접수되었습니다! 검증 후 시세에 반영됩니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#e3e3de]">
        <div className="flex items-center justify-between pb-3 border-b border-[#eeeee9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1a1c19]">가게 가격 제보하기</h3>
              <p className="text-[11px] text-[#707a6c]">월계1동 이웃들의 알뜰 장보기를 도와주세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4f4ef] hover:bg-[#e8e8e3] text-[#707a6c] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#1a1c19] mb-1">방문 마트 / 상점</label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
            >
              <option value="월계 화랑마트">월계 화랑마트</option>
              <option value="석계 알뜰청과">석계 알뜰청과</option>
              <option value="광운대 골목식자재마트">광운대 골목식자재마트</option>
              <option value="이마트 월계점 (비교 기준)">이마트 월계점 (비교 기준)</option>
              <option value="기타 골목 상점">기타 골목 상점 (직접입력)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1a1c19] mb-1">식재료명</label>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="예: 흙대파 반단, 애호박 1개, 신선계란 10구"
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#1a1c19] mb-1">현장 확인 가격 (원)</label>
            <input
              type="number"
              value={reportedPrice}
              onChange={(e) => setReportedPrice(e.target.value)}
              placeholder="예: 1200"
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#1a1c19] mb-1">특이사항 (선택)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 오늘 저녁 8시 마감세일 20% 추가할인 중이었음"
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
            />
          </div>

          <div className="bg-[#fafaf4] p-3 rounded-xl border border-[#e3e3de] text-[11px] text-[#707a6c] flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#0d631b] shrink-0 mt-0.5" />
            <span>제보해주신 가격은 자동 이상치 필터링 및 관리자 검증을 거쳐 30분 내 시세 리포트에 업데이트됩니다.</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#2e7d32] hover:bg-[#0d631b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              가격 제보 완료
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#40493d] font-semibold text-xs transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

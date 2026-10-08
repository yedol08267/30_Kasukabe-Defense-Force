import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { WishlistItem } from '../types';

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (item: WishlistItem) => void;
}

export const AddWishlistModal: React.FC<AddWishlistModalProps> = ({
  isOpen,
  onClose,
  onAddWish,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('채소');
  const [targetPrice, setTargetPrice] = useState('2000');
  const [unit, setUnit] = useState('1인 소포장');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseInt(targetPrice, 10) || 2000;
    const newItem: WishlistItem = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      category,
      targetPrice: parsedPrice,
      currentLowestPrice: Math.round(parsedPrice * 0.88),
      lowestStore: '월계 화랑마트',
      priceTrend: 'down',
      trendNote: '신규 등록 완료 · 최저가 탐색 중',
      alertEnabled: true,
      unit: unit.trim() || '1인 소포장',
      isSpecial: true,
      specialBadge: '목표가 감지 중',
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    onAddWish(newItem);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#e3e3de]">
        <div className="flex items-center justify-between pb-3 border-b border-[#eeeee9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1a1c19]">새 식재료 찜 추가하기</h3>
              <p className="text-[11px] text-[#707a6c]">희망 목표가를 설정하면 특가 발생 시 알림을 보내드려요</p>
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
            <label className="block font-bold text-[#1a1c19] mb-1">식재료 명칭</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 청양고추 소포장, 스팸 200g, 햇반 3개입"
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1a1c19] mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
              >
                <option value="채소">채소 / 과일</option>
                <option value="계란/두부">계란 / 두부 / 유제품</option>
                <option value="정육">정육 / 육가공</option>
                <option value="가공식품">가공 / 인스턴트</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#1a1c19] mb-1">희망 목표가 (원 이하)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="2000"
                className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1a1c19] mb-1">1인 가구 규격 / 소분 단위</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="예: 1인 소분(약 150g), 1개입, 2입 묶음"
              className="w-full bg-[#f4f4ef] text-[#1a1c19] px-3 py-2.5 rounded-xl border border-[#e3e3de] outline-none font-medium"
            />
          </div>

          <div className="bg-[#fafaf4] p-3 rounded-xl border border-[#e3e3de] text-[11px] text-[#40493d] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fe5825] shrink-0" />
            <span>등록 즉시 월계 화랑마트, 석계 알뜰청과, 광운대 골목식자재마트 3대 로컬 마트 및 이마트 월계점 시세를 추적합니다.</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#2e7d32] hover:bg-[#0d631b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              찜 목록에 추가
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

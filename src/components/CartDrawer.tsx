import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenRouteModal: () => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenRouteModal,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price * 1.35) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, Math.round(totalOriginal - totalCost));

  const handleCheckoutCopy = () => {
    const listText = cartItems
      .map((it) => `• [${it.storeName}] ${it.name} (${it.unit}) x${it.quantity}개 - ${(it.price * it.quantity).toLocaleString()}원`)
      .join('\n');
    const fullText = `🛒 [월계장터] 오늘의 1인 가구 알뜰 장보기 목록\n\n${listText}\n\n💰 총 결제금액: ${totalCost.toLocaleString()}원 (대형마트 대비 ${totalSavings.toLocaleString()}원 절약!)\n📍 추천 동선: 광운대역 1번출구 → 월계 화랑마트 → 석계 알뜰청과`;

    navigator.clipboard.writeText(fullText);
    onShowToast('장보기 체크리스트가 클립보드에 복사되었습니다! 카톡이나 메모장에 붙여넣으세요.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#e3e3de]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#eeeee9] flex items-center justify-between bg-[#fafaf4]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0d631b] text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#1a1c19]">오늘의 장보기 바구니</h2>
                <p className="text-[11px] text-[#707a6c]">월계1동 도보 최적화 품목 모음 ({cartItems.length}종)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f4f4ef] hover:bg-[#e8e8e3] text-[#707a6c] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-[#707a6c] space-y-2">
                <ShoppingBag className="w-12 h-12 text-[#e3e3de]" />
                <p className="font-bold text-sm text-[#1a1c19]">장바구니가 비어 있어요</p>
                <p className="text-xs max-w-xs">
                  오늘의 식재료나 찜 목록에서 특가 품목을 담아보세요!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#fafaf4] rounded-2xl border border-[#e3e3de] flex items-center justify-between gap-3 hover:border-[#a3f69c] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#0d631b] font-bold flex items-center gap-1">
                      <span>{item.storeName}</span>
                      <span className="text-[#707a6c] font-normal">• {item.unit}</span>
                    </div>
                    <div className="font-bold text-xs text-[#1a1c19] truncate">{item.name}</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-extrabold text-sm text-[#0d631b]">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                      {item.originalPrice && (
                        <span className="text-[10px] text-[#707a6c] line-through">
                          {(item.originalPrice * item.quantity).toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-[#e3e3de] rounded-xl px-1.5 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:text-[#0d631b]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:text-[#0d631b]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-[#707a6c] hover:text-[#b02e00] transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#eeeee9] bg-[#fafaf4] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#707a6c]">
                  <span>대형마트 단독 구매 예상가</span>
                  <span className="line-through">{totalOriginal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-[#0d631b] font-bold">
                  <span>월계1동 골목 최저가 합산</span>
                  <span className="text-base">{totalCost.toLocaleString()}원</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#a3f69c]/30 text-[#002204] text-[11px] font-bold flex items-center justify-between">
                  <span>총 절약 예상액</span>
                  <span className="text-xs text-[#0d631b] font-extrabold">
                    +{totalSavings.toLocaleString()}원 절약 (-{Math.round((totalSavings / (totalOriginal || 1)) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onOpenRouteModal}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#e3e3de] hover:bg-[#eeeee9] text-[#1a1c19] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#0d631b]" />
                  도보 동선 보기
                </button>
                <button
                  onClick={onClearCart}
                  className="py-2.5 px-3 rounded-xl bg-[#eeeee9] hover:bg-[#e8e8e3] text-[#707a6c] text-xs font-semibold transition-colors"
                >
                  장바구니 비우기
                </button>
              </div>

              <button
                onClick={handleCheckoutCopy}
                className="w-full py-3 rounded-xl bg-[#0d631b] hover:bg-[#127f26] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                장보기 체크리스트 복사 (카톡 공유용)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

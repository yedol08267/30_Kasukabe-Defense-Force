/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TodayDigest } from './components/TodayDigest';
import { WishlistDashboard } from './components/WishlistDashboard';
import { PriceComparison } from './components/PriceComparison';
import { AlertSettings } from './components/AlertSettings';
import { LandingStory } from './components/LandingStory';
import { MyPage } from './components/MyPage';
import { CartDrawer } from './components/CartDrawer';
import { RouteModal } from './components/RouteModal';
import { PriceReportModal } from './components/PriceReportModal';
import { AddWishlistModal } from './components/AddWishlistModal';
import { NearbyMartsModal } from './components/NearbyMartsModal';
import { Toast } from './components/Toast';
import {
  INITIAL_WISHLIST,
  PRICE_RECORDS,
  INITIAL_ALERT_CONFIG,
  INITIAL_USER_PROFILE,
  MARTS_INFO,
} from './data/mockData';
import { WishlistItem, PriceRecord, CartItem, AlertConfig, UserProfile } from './types';

export default function App() {
  // Navigation State: 'today-digest' | 'wishlist' | 'price-comparison' | 'alert-settings' | 'service-story'
  const [currentTab, setCurrentTab] = useState<string>('today-digest');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('월계1동');

  // Core Data States
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('welgye_wishlist');
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('welgye_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [alertConfig, setAlertConfig] = useState<AlertConfig>(() => {
    const saved = localStorage.getItem('welgye_alert_config');
    return saved ? JSON.parse(saved) : INITIAL_ALERT_CONFIG;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('welgye_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddWishModalOpen, setIsAddWishModalOpen] = useState(false);
  const [isMartMapOpen, setIsMartMapOpen] = useState(false);
  const [selectedMartIdForMap, setSelectedMartIdForMap] = useState<string | undefined>(undefined);

  const handleOpenMartMap = (martId?: string) => {
    setSelectedMartIdForMap(martId);
    setIsMartMapOpen(true);
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('welgye_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('welgye_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('welgye_alert_config', JSON.stringify(alertConfig));
  }, [alertConfig]);

  useEffect(() => {
    localStorage.setItem('welgye_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleWithdrawAccount = () => {
    localStorage.removeItem('welgye_user_profile');
    localStorage.removeItem('welgye_wishlist');
    localStorage.removeItem('welgye_cart');
    const guestProfile: UserProfile = {
      id: `guest-${Date.now()}`,
      name: '새 이웃님',
      nickname: '새싹 자취러',
      avatarUrl: '',
      avatarEmoji: '🌱',
      avatarBgColor: '#a3f69c',
      university: '광운대학교',
      major: '',
      district: '서울 노원구 월계1동',
      detailedAddress: '',
      email: '',
      phone: '',
      bio: '월계1동 1인 가구 장바구니 구원투수',
      housingType: '1인 원룸',
      cookingFrequency: '주 1~2회 (가벼운 집밥)',
      monthlyBudget: 200000,
      dietaryTags: ['1인 소포장 선호'],
      joinedDate: '오늘 가입',
      savingsTotal: 0,
      reportsCount: 0,
    };
    setUserProfile(guestProfile);
    setWishlist([]);
    setCartItems([]);
    setCurrentTab('today-digest');
    showToast('회원 탈퇴 처리가 완료되었습니다. 이용해 주셔서 감사합니다.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Cart Handlers
  const handleAddToCart = (record: PriceRecord) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === record.ingredientName && item.storeName === record.storeName);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${record.id}`,
          name: record.ingredientName,
          storeName: record.storeName,
          price: record.price,
          originalPrice: record.originalPrice,
          unit: record.unit,
          quantity: 1,
          imageUrl: record.imageUrl,
        },
      ];
    });
  };

  const handleBatchAddToCart = () => {
    const batchItems: PriceRecord[] = PRICE_RECORDS.slice(0, 4);
    batchItems.forEach((item) => handleAddToCart(item));
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('장바구니를 비웠습니다.');
  };

  // Wishlist Handlers
  const handleToggleWishKeyword = (keyword: string) => {
    const existingIndex = wishlist.findIndex((w) => w.name.includes(keyword) || keyword.includes(w.name));
    if (existingIndex >= 0) {
      const removed = wishlist[existingIndex];
      setWishlist((prev) => prev.filter((_, i) => i !== existingIndex));
      showToast(`'${removed.name}' 찜 목록에서 삭제되었습니다.`);
    } else {
      const newItem: WishlistItem = {
        id: `wish-${Date.now()}`,
        name: keyword,
        category: '채소',
        targetPrice: 2000,
        currentLowestPrice: 1500,
        lowestStore: '월계 화랑마트',
        priceTrend: 'down',
        trendNote: '신규 등록 · 일일 시세 및 현장가 추적 중',
        alertEnabled: true,
        unit: '1인 소포장',
        isSpecial: true,
        specialBadge: '관심 등록',
        dateAdded: new Date().toISOString().slice(0, 10),
      };
      setWishlist((prev) => [newItem, ...prev]);
      showToast(`'${keyword}' 찜 목록에 추가되었습니다!`);
    }
  };

  const handleAddWish = (item: WishlistItem) => {
    setWishlist((prev) => [item, ...prev]);
    showToast(`'${item.name}' 찜 목록에 추가되었습니다!`);
  };

  const handleRemoveWish = (id: string) => {
    const item = wishlist.find((w) => w.id === id);
    setWishlist((prev) => prev.filter((w) => w.id !== id));
    if (item) {
      showToast(`'${item.name}' 찜 목록에서 삭제되었습니다.`);
    }
  };

  const handleToggleWishAlert = (id: string) => {
    setWishlist((prev) =>
      prev.map((w) => (w.id === id ? { ...w, alertEnabled: !w.alertEnabled } : w))
    );
  };

  // Alert Config Handlers
  const handleSaveAlertConfig = (newConfig: AlertConfig) => {
    setAlertConfig(newConfig);
  };

  const handleResetAlertConfig = () => {
    setAlertConfig(INITIAL_ALERT_CONFIG);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf4] text-[#1a1c19] selection:bg-[#a3f69c] selection:text-[#002204]">
      {/* Top Fixed Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        userProfile={userProfile}
        onOpenMartMap={() => handleOpenMartMap()}
      />

      {/* Main Content Body */}
      <main className="flex-1 pt-20 lg:pt-24 pb-12">
        {currentTab === 'today-digest' && (
          <TodayDigest
            wishlist={wishlist}
            priceRecords={PRICE_RECORDS}
            onAddToCart={handleAddToCart}
            onOpenWishlist={() => setCurrentTab('wishlist')}
            onOpenAlertSettings={() => setCurrentTab('alert-settings')}
            onOpenPriceComparison={() => setCurrentTab('price-comparison')}
            onOpenRouteModal={() => setIsRouteModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenAddWishModal={() => setIsAddWishModalOpen(true)}
            onShowToast={showToast}
            onOpenMartMap={handleOpenMartMap}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistDashboard
            wishlist={wishlist}
            onToggleWishKeyword={handleToggleWishKeyword}
            onRemoveWish={handleRemoveWish}
            onToggleAlert={handleToggleWishAlert}
            onAddToCart={handleAddToCart}
            onBatchAddToCart={handleBatchAddToCart}
            onOpenAddModal={() => setIsAddWishModalOpen(true)}
            onOpenRouteModal={() => setIsRouteModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'price-comparison' && (
          <PriceComparison
            priceRecords={PRICE_RECORDS}
            onAddToCart={handleAddToCart}
            onOpenRouteModal={() => setIsRouteModalOpen(true)}
            onShowToast={showToast}
            onOpenMartMap={() => handleOpenMartMap()}
          />
        )}

        {currentTab === 'alert-settings' && (
          <AlertSettings
            config={alertConfig}
            onSaveConfig={handleSaveAlertConfig}
            onResetConfig={handleResetAlertConfig}
            wishlist={wishlist}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'service-story' && (
          <LandingStory
            onStartBrowsing={() => setCurrentTab('today-digest')}
            onOpenWishlist={() => setCurrentTab('wishlist')}
            onOpenPriceComparison={() => setCurrentTab('price-comparison')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'mypage' && (
          <MyPage
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onWithdrawAccount={handleWithdrawAccount}
            wishlist={wishlist}
            cartItems={cartItems}
            onShowToast={showToast}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenReportModal={() => setIsReportModalOpen(true)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenRouteModal={() => {
          setIsCartOpen(false);
          setIsRouteModalOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* Walking Route Modal */}
      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
      />

      {/* Price Report Modal */}
      <PriceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSuccess={showToast}
      />

      {/* Add Custom Wishlist Item Modal */}
      <AddWishlistModal
        isOpen={isAddWishModalOpen}
        onClose={() => setIsAddWishModalOpen(false)}
        onAddWish={handleAddWish}
      />

      {/* Nearby Marts Interactive Map & Hours Modal */}
      <NearbyMartsModal
        isOpen={isMartMapOpen}
        onClose={() => setIsMartMapOpen(false)}
        marts={MARTS_INFO}
        initialMartId={selectedMartIdForMap}
        onAddToCart={handleAddToCart}
        onShowToast={showToast}
      />

      {/* Global Interactive Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

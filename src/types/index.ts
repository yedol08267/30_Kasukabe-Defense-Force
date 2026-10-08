export type DataSourceType =
  | '공공데이터 기준'
  | '공공데이터'
  | '현장 확인'
  | '현장 확인·이웃 제보'
  | '이웃 제보'
  | '시연용 예시';

export interface PriceRecord {
  id: string;
  ingredientName: string;
  category: 'vegetable' | 'egg_tofu' | 'meat' | 'processed' | 'fruit';
  storeName: string;
  storeDistance: string; // e.g. "도보 4분"
  storeLocation: string; // e.g. "월계2교 부근"
  price: number;
  originalPrice?: number;
  unit: string; // e.g. "10구", "반단 (약 250g)", "소포장 2입", "300g"
  soloPortionUnit: string; // e.g. "1인분 소분", "1인 가구 추천"
  unitPriceDesc: string; // e.g. "10구당 279원", "1개당 600원"
  savingsNote: string; // e.g. "이마트 대비 910원 더 저렴"
  isSpecialDeal: boolean;
  specialDealLabel?: string; // e.g. "35% 특가", "마감임박"
  date: string; // e.g. "2026-10-05"
  imageUrl: string;
  inStock: boolean;
  stockCount?: number;
  dataSource: DataSourceType;
  sourceDetail?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  targetPrice: number;
  currentLowestPrice: number;
  lowestStore: string;
  priceTrend: 'down' | 'steady' | 'up';
  trendNote: string;
  alertEnabled: boolean;
  unit: string;
  isSpecial: boolean;
  specialBadge?: string;
  dateAdded: string;
  dataSource?: DataSourceType;
}

export interface AlertConfig {
  masterActive: boolean;
  emailEnabled: boolean;
  emailAddress: string;
  kakaoEnabled: boolean;
  kakaoLinked?: boolean;
  telegramEnabled: boolean;
  telegramBotLinked: boolean;
  includeMapLink: boolean;
  webPushEnabled: boolean;
  frequency: 'daily' | 'weekdays' | 'instant';
  timeSlot: string;
  onlySinglePortion: boolean;
  minDiscountOnly: boolean; // e.g. 25%+ only
  radiusMeters: number; // 300 to 2000
}

export interface MealRecipe {
  title: string;
  subtitle: string;
  cookingTime: string;
  difficulty: string;
  estimatedCost: number;
  imageUrl: string;
  ingredients: {
    name: string;
    store: string;
    price: number;
    isFromHome?: boolean;
  }[];
  steps: {
    step: string;
    text: string;
  }[];
  pickupRoute: string;
  routeTotalMinutes: number;
}

export interface MartStatus {
  id: string;
  name: string;
  branch: string;
  isBenchmark?: boolean;
  distance: string;
  walkMinutes: number;
  statusText: string;
  isOpen: boolean;
  openTime: string;
  closingTime: string;
  holidayInfo: string;
  breakTime?: string;
  address: string;
  phone: string;
  dealCount: number;
  mapX: number; // percentage X position on map canvas (0-100)
  mapY: number; // percentage Y position on map canvas (0-100)
  tags: string[];
  tips: string;
  specialDeals?: {
    name: string;
    price: number;
    unit: string;
    discountRate?: string;
  }[];
}

export interface CartItem {
  id: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  avatarUrl?: string;
  avatarEmoji?: string;
  avatarBgColor?: string;
  university: string;
  major?: string;
  district: string;
  detailedAddress?: string;
  email: string;
  phone: string;
  bio: string;
  housingType: string;
  cookingFrequency: string;
  monthlyBudget: number;
  dietaryTags: string[];
  joinedDate: string;
  savingsTotal: number;
  reportsCount: number;
}

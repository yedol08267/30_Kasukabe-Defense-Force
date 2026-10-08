import { PriceRecord, WishlistItem, AlertConfig, MealRecipe, MartStatus, UserProfile, DataSourceType } from '../types';

/**
 * -------------------------------------------------------------
 * [SSOT] 월계장터 공통 마트 명칭 표준 (Standard Mart Names)
 * -------------------------------------------------------------
 * 1. 월계 화랑마트 (로컬 마트)
 * 2. 석계 알뜰청과 (로컬 마트)
 * 3. 광운대 골목식자재마트 (로컬 마트)
 * 4. 이마트 월계점 (비교 기준용 대형마트)
 */
export const LOCAL_MARTS = [
  '월계 화랑마트',
  '석계 알뜰청과',
  '광운대 골목식자재마트',
] as const;

export const BENCHMARK_MART = '이마트 월계점' as const;

export type LocalMartName = (typeof LOCAL_MARTS)[number];

/**
 * -------------------------------------------------------------
 * [SSOT] 전체 화면 통합 통계 지표 (App-wide Unified Statistics)
 * -------------------------------------------------------------
 * 바구니 4종: 계란(2,790) + 두부(990) + 대파(1,400) + 양파(1,200) = 6,380원
 * 이마트 동일품목: 계란(3,890) + 두부(1,450) + 대파(2,100) + 양파(1,980) = 9,420원
 * 절약액: 9,420 - 6,380 = 3,040원 (-32.3% 절약)
 */
export const APP_STATS = {
  activeMartsCount: 3,
  benchmarkMartName: BENCHMARK_MART,
  totalTrackedItems: 7,
  basketCostLocal: 6380,
  basketCostEmart: 9420,
  basketSavings: 3040,
  basketSavingsRate: 32.3, // %
  recipeCost: 2390, // 두부 990원 + 대파 1,400원
  monthlyAverageSaved: 38400, // 월 평균 누적 절약액
  dailyDiscountTrend: '-8.4%', // 전일 대비 전체 시세 하락세
  kamisUpdateTime: '오전 06:00',
  onSiteUpdateTime: '오전 07:15',
  briefingTime: '오전 08:30',
  briefingDate: '2026. 10. 05.',
  collectionTimeDesc: '공공데이터 기준 시세는 오전 06:00, 현장 확인 가격은 오전 07:15 업데이트',
  dataSourceNotice: '공공데이터 기준(KAMIS 공식 시세)과 현장 확인(마트 방문 실측) 분리 안내',
};

/**
 * -------------------------------------------------------------
 * [SSOT] 마스터 식재료 데이터 (Canonical Master Products)
 * 모든 화면의 품목명, 단위, 마트별 가격, 최저가, 절약액은 이 데이터를 기준으로 계산됩니다.
 * -------------------------------------------------------------
 */
export interface MasterProduct {
  id: string;
  name: string;
  category: 'vegetable' | 'egg_tofu' | 'meat' | 'processed' | 'fruit';
  unit: string;
  soloPortionUnit: string;
  imageUrl: string;
  targetPrice: number;
  prices: {
    '월계 화랑마트': number;
    '석계 알뜰청과': number;
    '광운대 골목식자재마트': number;
    '이마트 월계점': number;
  };
  lowestStore: LocalMartName;
  lowestPrice: number;
  benchmarkPrice: number;
  savingsAmount: number;
  savingsPercent: number;
  unitPriceDesc: string;
  savingsNote: string;
  isSpecialDeal: boolean;
  specialDealLabel: string;
  trend: 'down' | 'steady' | 'up';
  trendNote: string;
  stockCount: number;
  dataSource: DataSourceType;
  sourceDetail: string;
}

export const MASTER_PRODUCTS: MasterProduct[] = [
  {
    id: 'p-1',
    name: '무항생제 신선 대란 10구',
    category: 'egg_tofu',
    unit: '10구',
    soloPortionUnit: '1인분 소분팩',
    imageUrl: '/src/assets/images/fresh_eggs_carton_1790922262608.jpg',
    targetPrice: 3000,
    prices: {
      '월계 화랑마트': 2790,
      '석계 알뜰청과': 3400,
      '광운대 골목식자재마트': 3200,
      '이마트 월계점': 3890,
    },
    lowestStore: '월계 화랑마트',
    lowestPrice: 2790,
    benchmarkPrice: 3890,
    savingsAmount: 1100,
    savingsPercent: 28,
    unitPriceDesc: '1알당 279원',
    savingsNote: '이마트 월계점 대비 1,100원 더 저렴 (1알당 279원)',
    isSpecialDeal: true,
    specialDealLabel: '-28% 슈퍼특가',
    trend: 'down',
    trendNote: '이마트 대비 -1,100원 할인 (역대 최저)',
    stockCount: 15,
    dataSource: '현장 확인',
    sourceDetail: '월계 화랑마트 매장 방문 실측 (오전 07:15)',
  },
  {
    id: 'p-2',
    name: '국산 찌개용 부침두부 1모',
    category: 'egg_tofu',
    unit: '1모 (300g)',
    soloPortionUnit: '한 끼 1모',
    imageUrl: '/src/assets/images/fresh_white_tofu_1790926599560.jpg',
    targetPrice: 1200,
    prices: {
      '월계 화랑마트': 990,
      '석계 알뜰청과': 1300,
      '광운대 골목식자재마트': 1200,
      '이마트 월계점': 1450,
    },
    lowestStore: '월계 화랑마트',
    lowestPrice: 990,
    benchmarkPrice: 1450,
    savingsAmount: 460,
    savingsPercent: 32,
    unitPriceDesc: '100g당 330원',
    savingsNote: '이마트 월계점 대비 460원 더 저렴 (단독 990원)',
    isSpecialDeal: true,
    specialDealLabel: '-32% 초특가',
    trend: 'steady',
    trendNote: '초특가 990원 안정세 유지 중',
    stockCount: 22,
    dataSource: '현장 확인',
    sourceDetail: '월계 화랑마트 매장 방문 실측 (오전 07:15)',
  },
  {
    id: 'p-3',
    name: '친환경 흙대파 반단 (약 250g)',
    category: 'vegetable',
    unit: '반단 (약 250g)',
    soloPortionUnit: '반단 소분',
    imageUrl: '/src/assets/images/fresh_scallions_bundle_1790922275638.jpg',
    targetPrice: 1600,
    prices: {
      '월계 화랑마트': 1600,
      '석계 알뜰청과': 1400,
      '광운대 골목식자재마트': 1800,
      '이마트 월계점': 2100,
    },
    lowestStore: '석계 알뜰청과',
    lowestPrice: 1400,
    benchmarkPrice: 2100,
    savingsAmount: 700,
    savingsPercent: 33,
    unitPriceDesc: '100g당 560원',
    savingsNote: '이마트 월계점 대비 700원 더 저렴 (음식물 쓰레기 제로)',
    isSpecialDeal: true,
    specialDealLabel: '-33% 알뜰특가',
    trend: 'down',
    trendNote: '구매적기! (전일 대비 -200원)',
    stockCount: 12,
    dataSource: '현장 확인',
    sourceDetail: '석계 알뜰청과 매장 방문 실측 (오전 07:30)',
  },
  {
    id: 'p-4',
    name: '손질 햇양파 (소포장 2입)',
    category: 'vegetable',
    unit: '소포장 2개입',
    soloPortionUnit: '1인 가구 추천',
    imageUrl: '/src/assets/images/fresh_yellow_onions_1790926567544.jpg',
    targetPrice: 1400,
    prices: {
      '월계 화랑마트': 1400,
      '석계 알뜰청과': 1200,
      '광운대 골목식자재마트': 1350,
      '이마트 월계점': 1980,
    },
    lowestStore: '석계 알뜰청과',
    lowestPrice: 1200,
    benchmarkPrice: 1980,
    savingsAmount: 780,
    savingsPercent: 39,
    unitPriceDesc: '1개당 600원',
    savingsNote: '이마트 월계점 대비 780원 더 저렴 (1개당 600원)',
    isSpecialDeal: true,
    specialDealLabel: '-39% 반짝세일',
    trend: 'down',
    trendNote: '전일 대비 -100원 최저가 갱신',
    stockCount: 18,
    dataSource: '현장 확인',
    sourceDetail: '석계 알뜰청과 매장 방문 실측 (오전 07:30)',
  },
  {
    id: 'p-5',
    name: '친환경 팽이버섯 3봉',
    category: 'vegetable',
    unit: '3봉 묶음',
    soloPortionUnit: '자취 필수',
    imageUrl: '/src/assets/images/white_enoki_mushrooms_1790926583763.jpg',
    targetPrice: 1300,
    prices: {
      '월계 화랑마트': 1200,
      '석계 알뜰청과': 1300,
      '광운대 골목식자재마트': 1000,
      '이마트 월계점': 1980,
    },
    lowestStore: '광운대 골목식자재마트',
    lowestPrice: 1000,
    benchmarkPrice: 1980,
    savingsAmount: 980,
    savingsPercent: 49,
    unitPriceDesc: '봉당 333원',
    savingsNote: '이마트 월계점 대비 980원 더 저렴 (봉당 333원 파격가)',
    isSpecialDeal: true,
    specialDealLabel: '-49% 반값특가',
    trend: 'down',
    trendNote: '봉당 333원 역대 최저가',
    stockCount: 28,
    dataSource: '현장 확인',
    sourceDetail: '광운대 골목식자재마트 매장 방문 실측 (오전 07:45)',
  },
  {
    id: 'p-6',
    name: '냉장 삼겹살 1인 소포장 250g',
    category: 'meat',
    unit: '1인 소포장 250g',
    soloPortionUnit: '1인 전용 규격',
    imageUrl: '/src/assets/images/pork_belly_single_1790922292074.jpg',
    targetPrice: 5500,
    prices: {
      '월계 화랑마트': 5400,
      '석계 알뜰청과': 0, // 정육 미판매
      '광운대 골목식자재마트': 4900,
      '이마트 월계점': 6800,
    },
    lowestStore: '광운대 골목식자재마트',
    lowestPrice: 4900,
    benchmarkPrice: 6800,
    savingsAmount: 1900,
    savingsPercent: 28,
    unitPriceDesc: '100g당 1,960원',
    savingsNote: '이마트 월계점 대비 1,900원 더 저렴 (한돈 규격팩)',
    isSpecialDeal: true,
    specialDealLabel: '-28% 한돈특가',
    trend: 'down',
    trendNote: '오늘 저녁 18시 타임세일',
    stockCount: 8,
    dataSource: '현장 확인',
    sourceDetail: '광운대 골목식자재마트 정육코너 실측',
  },
  {
    id: 'p-7',
    name: '깐마늘 소포장 (100g)',
    category: 'vegetable',
    unit: '100g 소포장',
    soloPortionUnit: '1인 소분',
    imageUrl: '/src/assets/images/peeled_garlic_cloves_1790926619613.jpg',
    targetPrice: 1200,
    prices: {
      '월계 화랑마트': 1300,
      '석계 알뜰청과': 990,
      '광운대 골목식자재마트': 1200,
      '이마트 월계점': 1800,
    },
    lowestStore: '석계 알뜰청과',
    lowestPrice: 990,
    benchmarkPrice: 1800,
    savingsAmount: 810,
    savingsPercent: 45,
    unitPriceDesc: '10g당 99원',
    savingsNote: '이마트 월계점 대비 810원 더 저렴 (곰팡이 피기 전 완식 분량)',
    isSpecialDeal: true,
    specialDealLabel: '-45% 알뜰소분',
    trend: 'down',
    trendNote: '100g 소분 990원',
    stockCount: 16,
    dataSource: '공공데이터 기준',
    sourceDetail: 'KAMIS 농산물유통정보 서울 기준가 (오전 06:00)',
  },
];

// Helper to retrieve store distance and location
const getStoreMeta = (storeName: LocalMartName | typeof BENCHMARK_MART) => {
  switch (storeName) {
    case '월계 화랑마트':
      return { distance: '도보 4분', location: '광운대역 1번출구 도보 4분 (월계2교 방면)' };
    case '석계 알뜰청과':
      return { distance: '도보 8분', location: '석계역 1번출구 골목' };
    case '광운대 골목식자재마트':
      return { distance: '도보 3분', location: '광운대 정문 250m 앞' };
    case '이마트 월계점':
      return { distance: '차량 5분 / 버스 10분', location: '월계3동 이마트타운' };
  }
};

/**
 * -------------------------------------------------------------
 * [SSOT] 전체 화면 제공 PRICE_RECORDS
 * -------------------------------------------------------------
 */
export const PRICE_RECORDS: PriceRecord[] = MASTER_PRODUCTS.map((p) => {
  const meta = getStoreMeta(p.lowestStore);
  return {
    id: p.id,
    ingredientName: p.name,
    category: p.category,
    storeName: p.lowestStore,
    storeDistance: meta.distance,
    storeLocation: meta.location,
    price: p.lowestPrice,
    originalPrice: p.benchmarkPrice,
    unit: p.unit,
    soloPortionUnit: p.soloPortionUnit,
    unitPriceDesc: p.unitPriceDesc,
    savingsNote: p.savingsNote,
    isSpecialDeal: p.isSpecialDeal,
    specialDealLabel: p.specialDealLabel,
    date: '2026-10-05',
    imageUrl: p.imageUrl,
    inStock: true,
    stockCount: p.stockCount,
    dataSource: p.dataSource,
    sourceDetail: p.sourceDetail,
  };
});

/**
 * -------------------------------------------------------------
 * [SSOT] 초기 찜 목록 (INITIAL_WISHLIST)
 * -------------------------------------------------------------
 */
export const INITIAL_WISHLIST: WishlistItem[] = MASTER_PRODUCTS.slice(0, 5).map((p, idx) => ({
  id: `wish-${idx + 1}`,
  name: p.name,
  category: p.category === 'egg_tofu' ? '계란/두부' : p.category === 'meat' ? '정육' : '채소',
  targetPrice: p.targetPrice,
  currentLowestPrice: p.lowestPrice,
  lowestStore: p.lowestStore,
  priceTrend: p.trend,
  trendNote: p.trendNote,
  alertEnabled: true,
  unit: p.unit,
  isSpecial: p.isSpecialDeal,
  specialBadge: p.specialDealLabel,
  dateAdded: '2026-10-01',
  dataSource: p.dataSource,
}));

export interface MartMatrixRow {
  id: string;
  item: string;
  badgeLabel: string;
  displayName: string;
  unit: string;
  lowestStore: string;
  lowestPrice: number;
  hwarang: {
    price: number;
    isLowest: boolean;
  };
  seokgye: {
    price: number;
    isLowest: boolean;
  };
  golmok: {
    price: number;
    isLowest: boolean;
  };
  emart: {
    price: number;
    isLowest: boolean;
  };
}

/**
 * -------------------------------------------------------------
 * [SSOT] 3대 로컬 마트 + 이마트 월계점 가격 비교 매트릭스 (5대 품목 1:1 매칭)
 * -------------------------------------------------------------
 */
export const THREE_MART_MATRIX: MartMatrixRow[] = MASTER_PRODUCTS.slice(0, 5).map((p) => {
  const match = p.name.match(/^([^\s]+)\s+(.+)$/);
  const badgeLabel = match ? match[1] : '';
  const displayName = match ? match[2] : p.name;
  return {
    id: p.id,
    item: p.name,
    badgeLabel,
    displayName,
    unit: p.unit,
    lowestStore: p.lowestStore,
    lowestPrice: p.lowestPrice,
    hwarang: {
      price: p.prices['월계 화랑마트'],
      isLowest: p.lowestStore === '월계 화랑마트',
    },
    seokgye: {
      price: p.prices['석계 알뜰청과'],
      isLowest: p.lowestStore === '석계 알뜰청과',
    },
    golmok: {
      price: p.prices['광운대 골목식자재마트'],
      isLowest: p.lowestStore === '광운대 골목식자재마트',
    },
    emart: {
      price: p.prices['이마트 월계점'],
      isLowest: false,
    },
  };
});

/**
 * -------------------------------------------------------------
 * [SSOT] 오늘의 추천 자취 식단 & 코스
 * -------------------------------------------------------------
 */
export const TODAYS_RECIPE: MealRecipe = {
  title: '칼칼 자작 두부조림 (밥도둑 1인분)',
  subtitle: '오늘 특가 재료 2가지와 냉장고 기본양념으로 완성하는 가성비 식단',
  cookingTime: '10분 내외',
  difficulty: '난이도: 하',
  estimatedCost: 2390, // 990원 + 1,400원
  imageUrl: '/src/assets/images/tofu_stew_dish_1790922303422.jpg',
  ingredients: [
    { name: '국산 찌개용 부침두부 1모', store: '월계 화랑마트', price: 990 },
    { name: '친환경 흙대파 반단 (약 250g)', store: '석계 알뜰청과', price: 1400 },
    { name: '진간장 2T + 고춧가루 1T + 들기름/참기름', store: '집에 있는 기본 양념', price: 0, isFromHome: true },
  ],
  steps: [
    { step: 'STEP 01', text: '두부를 도톰한 한입 크기로 썰어 키친타월로 가볍게 물기 제거' },
    { step: 'STEP 02', text: '달군 팬에 들기름을 두르고 중불에서 두부 앞뒤를 노릇노릇하게 굽기' },
    { step: 'STEP 03', text: '진간장, 고춧가루, 물 3T, 송송 썬 대파를 붓고 3분간 자작하게 조림' },
  ],
  pickupRoute: '광운대역 1번 출구 → 월계 화랑마트(두부 990원) → 석계 알뜰청과(대파 1,400원) → 귀가길',
  routeTotalMinutes: 12,
};

/**
 * -------------------------------------------------------------
 * [SSOT] 마트 정보 (MARTS_INFO)
 * 3대 로컬 마트 + 비교 기준용 대형마트 (이마트 월계점)
 * -------------------------------------------------------------
 */
export const MARTS_INFO: MartStatus[] = [
  {
    id: 'mart-1',
    name: '월계 화랑마트',
    branch: '월계1동 골목마트',
    isBenchmark: false,
    distance: '도보 4분 (320m)',
    walkMinutes: 4,
    statusText: '영업중 (08:30~22:30)',
    isOpen: true,
    openTime: '08:30',
    closingTime: '22:30',
    holidayInfo: '연중무휴 (명절 당일 단축영업)',
    breakTime: '브레이크타임 없음',
    address: '서울특별시 노원구 광운로 15길 8 (월계동)',
    phone: '02-911-3421',
    dealCount: 2,
    mapX: 42,
    mapY: 30,
    tags: ['1인 채소 소포장', '두부/계란 최저가', '노원사랑상품권', '온누리상품권'],
    tips: '오후 7시 이후 채소 코너 깜짝 타임세일! 사장님이 자취생에게 파·양파 덤을 자주 주십니다.',
    specialDeals: [
      { name: '국산 찌개용 부침두부 1모', price: 990, unit: '1모 (300g)', discountRate: '-32%' },
      { name: '무항생제 신선 대란 10구', price: 2790, unit: '10구', discountRate: '-28%' },
    ],
  },
  {
    id: 'mart-2',
    name: '석계 알뜰청과',
    branch: '석계역 1번출구점',
    isBenchmark: false,
    distance: '도보 8분 (600m)',
    walkMinutes: 8,
    statusText: '영업중 (07:30~21:30)',
    isOpen: true,
    openTime: '07:30',
    closingTime: '21:30',
    holidayInfo: '매주 일요일 정기휴무',
    breakTime: '브레이크타임 없음',
    address: '서울특별시 노원구 화랑로 337 (월계동)',
    phone: '02-978-5520',
    dealCount: 3,
    mapX: 52,
    mapY: 86,
    tags: ['대파/양파 최저가', '과일 낱개 판매', '산지직송 야채', '현금/온누리 우대'],
    tips: '대파 반단 1,400원, 양파 2입 1,200원으로 노원구 최저가 수준! 낱개 과일도 알뜰하게 구매 가능합니다.',
    specialDeals: [
      { name: '친환경 흙대파 반단 (약 250g)', price: 1400, unit: '반단', discountRate: '-33%' },
      { name: '손질 햇양파 (소포장 2입)', price: 1200, unit: '2개입', discountRate: '-39%' },
      { name: '깐마늘 소포장 (100g)', price: 990, unit: '100g', discountRate: '-45%' },
    ],
  },
  {
    id: 'mart-3',
    name: '광운대 골목식자재마트',
    branch: '광운대 정문점',
    isBenchmark: false,
    distance: '도보 3분 (250m)',
    walkMinutes: 3,
    statusText: '영업중 (08:00~23:00)',
    isOpen: true,
    openTime: '08:00',
    closingTime: '23:00',
    holidayInfo: '연중무휴 365일 영업',
    breakTime: '브레이크타임 없음',
    address: '서울특별시 노원구 석계로 18길 12 (월계동)',
    phone: '02-942-8871',
    dealCount: 2,
    mapX: 22,
    mapY: 38,
    tags: ['광운대 정문 3분', '정육 소분팩', '야간 23시 영업', '자취생 양념류'],
    tips: '정육 코너에서 삼겹살을 1인분(250g) 단위로 깔끔하게 소분 판매하며 팽이버섯 3봉 1,000원 특가입니다.',
    specialDeals: [
      { name: '친환경 팽이버섯 3봉', price: 1000, unit: '3봉 묶음', discountRate: '-49%' },
      { name: '냉장 삼겹살 1인 소포장 250g', price: 4900, unit: '250g', discountRate: '-28%' },
    ],
  },
  {
    id: 'mart-4',
    name: '이마트 월계점',
    branch: '비교 기준용 대형마트',
    isBenchmark: true,
    distance: '차로 5분 / 버스 10분 (1.6km)',
    walkMinutes: 18,
    statusText: '정상영업 (10:00~23:00)',
    isOpen: true,
    openTime: '10:00',
    closingTime: '23:00',
    holidayInfo: '매월 둘째·넷째 일요일 의무휴무',
    breakTime: '브레이크타임 없음',
    address: '서울특별시 노원구 마들로3길 15 (월계동)',
    phone: '02-2092-1234',
    dealCount: 3,
    mapX: 88,
    mapY: 14,
    tags: ['비교 기준 대형마트', '노브랜드관', '트레이더스', '주차 1,400대'],
    tips: '대용량 묶음 포장 및 공산품 구매에 적합한 대형마트 기준점입니다.',
    specialDeals: [
      { name: '대형마트 신선란 10구 (기준가)', price: 3890, unit: '10구', discountRate: '기준가' },
      { name: '대형마트 찌개두부 1모 (기준가)', price: 1450, unit: '1모', discountRate: '기준가' },
      { name: '대형마트 흙대파 1단 (기준가)', price: 2100, unit: '1단', discountRate: '기준가' },
    ],
  },
];

export const POPULAR_KEYWORDS = [
  '대파',
  '계란 10구',
  '찌개용 두부',
  '삼겹살',
  '양파 (소포장)',
  '팽이버섯',
  '깐마늘',
  '콩나물',
  '애호박',
  '스팸',
  '햇반',
];

export const INITIAL_ALERT_CONFIG: AlertConfig = {
  masterActive: true,
  emailEnabled: true,
  emailAddress: 'yedol08267@gmail.com',
  kakaoEnabled: true,
  kakaoLinked: false,
  telegramEnabled: true,
  telegramBotLinked: true,
  includeMapLink: true,
  webPushEnabled: false,
  frequency: 'daily',
  timeSlot: '08:30',
  onlySinglePortion: true,
  minDiscountOnly: true,
  radiusMeters: 800,
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user_wolgye_minji_01',
  name: '김민지',
  nickname: '알뜰한 민지',
  avatarUrl: '',
  avatarEmoji: '🥑',
  avatarBgColor: '#a3f69c',
  university: '광운대학교',
  major: '소프트웨어학부 22학번',
  district: '서울 노원구 월계1동',
  detailedAddress: '광운로 12길 원룸가 (광운대역 1번 출구 도보 5분)',
  email: 'minji.kim@kw.ac.kr',
  phone: '010-8267-3400',
  bio: '배달음식 줄이고 월 식비 25만원 방어 도전 중인 2년차 자취생입니다! 🥬',
  housingType: '1인 원룸',
  cookingFrequency: '주 3~4회 (알뜰 자취러)',
  monthlyBudget: 250000,
  dietaryTags: ['1인 소포장 선호', '신선 채소 파', '가성비 마트 탐방', '단백질 필수'],
  joinedDate: '2026.03.12',
  savingsTotal: APP_STATS.monthlyAverageSaved,
  reportsCount: 3,
};

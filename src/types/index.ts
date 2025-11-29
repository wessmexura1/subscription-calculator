// Категории подписок
export type SubscriptionCategory = 
  | 'video'      // Видео: Netflix, YouTube Premium, Disney+
  | 'music'      // Музыка: Spotify, Apple Music
  | 'games'      // Игры: Game Pass, PS Plus
  | 'software'   // Софт: Adobe, Copilot, Notion
  | 'cloud'      // Облака: iCloud, Google One, Dropbox
  | 'vpn'        // VPN сервисы
  | 'education'  // Обучение: Coursera, Skillbox
  | 'fitness'    // Фитнес: тренажерные залы
  | 'other';     // Прочее

// Периоды оплаты
export type BillingPeriod = 
  | 'monthly'    // Месяц
  | 'quarterly'  // Квартал (3 месяца)
  | 'yearly'     // Год
  | 'lifetime';  // Пожизненная (единоразовая)

// Тип плана
export type PlanType = 
  | 'individual' // Индивидуальный
  | 'family'     // Семейный
  | 'student'    // Студенческий
  | 'business';  // Бизнес

// Валюта
export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'KZT' | 'BYN' | 'UAH';

// Интерфейс подписки
export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  price: number;
  currency: Currency;
  billingPeriod: BillingPeriod;
  planType: PlanType;
  hoursPerWeek: number;          // Часы использования в неделю
  importance: number;            // Важность 1-10
  startDate?: string;            // Дата начала подписки
  nextPaymentDate?: string;      // Дата следующего платежа
  logoUrl?: string;              // URL логотипа
  isCustom: boolean;             // Кастомная или из пресетов
  createdAt: string;
  updatedAt: string;
}

// Расчетные метрики подписки
export interface SubscriptionMetrics {
  monthlyСost: number;           // Стоимость в месяц
  yearlyCost: number;            // Стоимость в год
  hoursPerMonth: number;         // Часы использования в месяц
  costPerHour: number;           // Стоимость часа
  valueScore: number;            // Оценка ценности (важность * часы / стоимость)
  recommendation: 'keep' | 'review' | 'cancel'; // Рекомендация
}

// Пресет популярного сервиса
export interface ServicePreset {
  name: string;
  category: SubscriptionCategory;
  defaultPrice: number;
  defaultCurrency: Currency;
  defaultBillingPeriod: BillingPeriod;
  logoUrl: string;
  availablePlans: PlanType[];
  planPrices?: Partial<Record<PlanType, number>>;
}

// Статистика по категориям
export interface CategoryStats {
  category: SubscriptionCategory;
  totalMonthlyCost: number;
  totalYearlyCost: number;
  count: number;
  percentage: number;
}

// Общая статистика
export interface OverallStats {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  totalSubscriptions: number;
  averageCostPerHour: number;
  categoryBreakdown: CategoryStats[];
  topValueSubscriptions: Subscription[];
  lowUsageSubscriptions: Subscription[];
  candidatesForCancellation: Subscription[];
}

// Фильтры для таблицы
export interface SubscriptionFilters {
  category?: SubscriptionCategory;
  priceRange?: { min: number; max: number };
  recommendation?: 'keep' | 'review' | 'cancel';
  search?: string;
}

// Сортировка
export type SortField = 'name' | 'price' | 'costPerHour' | 'importance' | 'valueScore';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Состояние приложения
export interface AppState {
  subscriptions: Subscription[];
  currency: Currency;
  filters: SubscriptionFilters;
  sort: SortConfig;
}

// Названия категорий на русском
export const CATEGORY_NAMES: Record<SubscriptionCategory, string> = {
  video: 'Видео',
  music: 'Музыка',
  games: 'Игры',
  software: 'Софт',
  cloud: 'Облака',
  vpn: 'VPN',
  education: 'Обучение',
  fitness: 'Фитнес',
  other: 'Прочее'
};

// Цвета категорий
export const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  video: '#E53935',
  music: '#1DB954',
  games: '#6441A5',
  software: '#0078D4',
  cloud: '#4285F4',
  vpn: '#FF9500',
  education: '#00BCD4',
  fitness: '#FF5722',
  other: '#9E9E9E'
};

// Названия периодов на русском
export const BILLING_PERIOD_NAMES: Record<BillingPeriod, string> = {
  monthly: 'Месяц',
  quarterly: 'Квартал',
  yearly: 'Год',
  lifetime: 'Навсегда'
};

// Множитель для приведения к месячной стоимости
export const BILLING_PERIOD_MONTHS: Record<BillingPeriod, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
  lifetime: 120 // Условно 10 лет
};

// Названия типов планов
export const PLAN_TYPE_NAMES: Record<PlanType, string> = {
  individual: 'Индивидуальный',
  family: 'Семейный',
  student: 'Студенческий',
  business: 'Бизнес'
};

// Символы валют
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
  KZT: '₸',
  BYN: 'Br',
  UAH: '₴'
};


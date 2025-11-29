import {
  Subscription,
  SubscriptionMetrics,
  CategoryStats,
  OverallStats,
  BILLING_PERIOD_MONTHS,
  SubscriptionCategory,
  Currency
} from '../types';

// Курсы валют (относительно RUB как базы)
export const EXCHANGE_RATES: Record<Currency, number> = {
  RUB: 1,
  USD: 97,
  EUR: 105,
  GBP: 122,
  CNY: 13.5,
  KZT: 0.20,
  BYN: 29,
  UAH: 2.35
};

// Конвертировать из одной валюты в другую
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Сначала конвертируем в рубли, потом в целевую валюту
  const inRub = amount * EXCHANGE_RATES[fromCurrency];
  return inRub / EXCHANGE_RATES[toCurrency];
};

// Конвертировать в рубли (для совместимости)
export const convertToRub = (amount: number, currency: string): number => {
  const rate = EXCHANGE_RATES[currency as Currency] || 1;
  return amount * rate;
};

// Конвертировать из рублей в целевую валюту
export const convertFromRub = (amount: number, toCurrency: Currency): number => {
  return amount / EXCHANGE_RATES[toCurrency];
};

// Рассчитать месячную стоимость
export const calculateMonthlyCost = (price: number, billingPeriod: string): number => {
  const months = BILLING_PERIOD_MONTHS[billingPeriod as keyof typeof BILLING_PERIOD_MONTHS] || 1;
  return price / months;
};

// Рассчитать годовую стоимость
export const calculateYearlyCost = (monthlyCost: number): number => {
  return monthlyCost * 12;
};

// Рассчитать часы использования в месяц
export const calculateHoursPerMonth = (hoursPerWeek: number): number => {
  return hoursPerWeek * 4.33; // Среднее кол-во недель в месяце
};

// Рассчитать стоимость часа
export const calculateCostPerHour = (monthlyCost: number, hoursPerMonth: number): number => {
  if (hoursPerMonth <= 0) return Infinity;
  return monthlyCost / hoursPerMonth;
};

// Рассчитать оценку ценности (value score)
export const calculateValueScore = (
  importance: number,
  hoursPerMonth: number,
  monthlyCost: number
): number => {
  if (monthlyCost <= 0) return Infinity;
  // Формула: (важность * часы) / стоимость * 100
  return (importance * hoursPerMonth) / monthlyCost * 100;
};

// Определить рекомендацию
export const getRecommendation = (
  costPerHour: number,
  hoursPerMonth: number,
  importance: number,
  monthlyCost: number
): 'keep' | 'review' | 'cancel' => {
  // Кандидат на отключение: низкая важность + высокая стоимость
  if (importance <= 3 && monthlyCost > 500) {
    return 'cancel';
  }
  
  // Низкое использование + дорого
  if (hoursPerMonth < 5 && monthlyCost > 300) {
    return 'review';
  }
  
  // Очень дорогой час
  if (costPerHour > 200) {
    return 'review';
  }
  
  // Низкая важность при любом использовании
  if (importance <= 4 && costPerHour > 100) {
    return 'review';
  }
  
  return 'keep';
};

// Рассчитать все метрики для подписки
export const calculateSubscriptionMetrics = (subscription: Subscription): SubscriptionMetrics => {
  const priceInRub = convertToRub(subscription.price, subscription.currency);
  const monthlyCost = calculateMonthlyCost(priceInRub, subscription.billingPeriod);
  const yearlyCost = calculateYearlyCost(monthlyCost);
  const hoursPerMonth = calculateHoursPerMonth(subscription.hoursPerWeek);
  const costPerHour = calculateCostPerHour(monthlyCost, hoursPerMonth);
  const valueScore = calculateValueScore(subscription.importance, hoursPerMonth, monthlyCost);
  const recommendation = getRecommendation(
    costPerHour,
    hoursPerMonth,
    subscription.importance,
    monthlyCost
  );

  return {
    monthlyСost: monthlyCost,
    yearlyCost,
    hoursPerMonth,
    costPerHour,
    valueScore,
    recommendation
  };
};

// Рассчитать статистику по категориям
export const calculateCategoryStats = (subscriptions: Subscription[]): CategoryStats[] => {
  const categoryMap = new Map<SubscriptionCategory, { totalMonthly: number; count: number }>();
  let totalMonthly = 0;

  subscriptions.forEach(sub => {
    const metrics = calculateSubscriptionMetrics(sub);
    const current = categoryMap.get(sub.category) || { totalMonthly: 0, count: 0 };
    categoryMap.set(sub.category, {
      totalMonthly: current.totalMonthly + metrics.monthlyСost,
      count: current.count + 1
    });
    totalMonthly += metrics.monthlyСost;
  });

  const stats: CategoryStats[] = [];
  categoryMap.forEach((value, category) => {
    stats.push({
      category,
      totalMonthlyCost: value.totalMonthly,
      totalYearlyCost: value.totalMonthly * 12,
      count: value.count,
      percentage: totalMonthly > 0 ? (value.totalMonthly / totalMonthly) * 100 : 0
    });
  });

  return stats.sort((a, b) => b.totalMonthlyCost - a.totalMonthlyCost);
};

// Рассчитать общую статистику
export const calculateOverallStats = (subscriptions: Subscription[]): OverallStats => {
  if (subscriptions.length === 0) {
    return {
      totalMonthlyCost: 0,
      totalYearlyCost: 0,
      totalSubscriptions: 0,
      averageCostPerHour: 0,
      categoryBreakdown: [],
      topValueSubscriptions: [],
      lowUsageSubscriptions: [],
      candidatesForCancellation: []
    };
  }

  let totalMonthlyCost = 0;
  let totalHoursPerMonth = 0;
  const subsWithMetrics: { subscription: Subscription; metrics: SubscriptionMetrics }[] = [];

  subscriptions.forEach(sub => {
    const metrics = calculateSubscriptionMetrics(sub);
    totalMonthlyCost += metrics.monthlyСost;
    totalHoursPerMonth += metrics.hoursPerMonth;
    subsWithMetrics.push({ subscription: sub, metrics });
  });

  // Сортируем по valueScore для топа
  const sortedByValue = [...subsWithMetrics].sort(
    (a, b) => (b.metrics.valueScore || 0) - (a.metrics.valueScore || 0)
  );

  // Находим подписки с низким использованием
  const lowUsage = subsWithMetrics
    .filter(s => s.metrics.hoursPerMonth < 5 && s.metrics.monthlyСost > 200)
    .map(s => s.subscription);

  // Кандидаты на отключение
  const candidates = subsWithMetrics
    .filter(s => s.metrics.recommendation === 'cancel' || s.metrics.recommendation === 'review')
    .sort((a, b) => b.metrics.monthlyСost - a.metrics.monthlyСost)
    .map(s => s.subscription);

  return {
    totalMonthlyCost,
    totalYearlyCost: totalMonthlyCost * 12,
    totalSubscriptions: subscriptions.length,
    averageCostPerHour: totalHoursPerMonth > 0 ? totalMonthlyCost / totalHoursPerMonth : 0,
    categoryBreakdown: calculateCategoryStats(subscriptions),
    topValueSubscriptions: sortedByValue.slice(0, 5).map(s => s.subscription),
    lowUsageSubscriptions: lowUsage,
    candidatesForCancellation: candidates
  };
};

// Форматирование цены
export const formatPrice = (
  price: number,
  currency: Currency = 'RUB',
  options?: { compact?: boolean }
): string => {
  const symbols: Record<Currency, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CNY: '¥',
    KZT: '₸',
    BYN: 'Br',
    UAH: '₴'
  };
  const symbol = symbols[currency] || currency;
  
  if (price === Infinity) return '∞';
  if (price === 0) return `0 ${symbol}`;
  
  let formatted: string;
  
  if (options?.compact && price >= 1000) {
    // Компактный формат для больших чисел
    if (price >= 1000000) {
      formatted = (price / 1000000).toFixed(1) + 'M';
    } else if (price >= 1000) {
      formatted = (price / 1000).toFixed(price >= 10000 ? 0 : 1) + 'K';
    } else {
      formatted = price.toFixed(0);
    }
  } else {
    formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: price < 10 ? 2 : 0
    }).format(price);
  }
  
  // Символ перед числом для западных валют, после — для остальных
  switch (currency) {
    case 'USD':
    case 'EUR':
    case 'GBP':
      return `${symbol}${formatted}`;
    case 'CNY':
      return `${symbol}${formatted}`;
    case 'RUB':
    case 'KZT':
    case 'BYN':
    case 'UAH':
    default:
      return `${formatted} ${symbol}`;
  }
};

// Форматирование цены с конвертацией
export const formatPriceConverted = (
  priceInRub: number,
  displayCurrency: Currency,
  options?: { compact?: boolean }
): string => {
  const converted = convertFromRub(priceInRub, displayCurrency);
  return formatPrice(converted, displayCurrency, options);
};

// Форматирование процентов
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Форматирование часов
export const formatHours = (hours: number): string => {
  if (hours === Infinity) return '—';
  if (hours < 1) return `${Math.round(hours * 60)} мин`;
  return `${hours.toFixed(1)} ч`;
};

// Генерация уникального ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Получить дату следующего платежа
export const getNextPaymentDate = (startDate: string, billingPeriod: string): string => {
  const start = new Date(startDate);
  const now = new Date();
  const months = BILLING_PERIOD_MONTHS[billingPeriod as keyof typeof BILLING_PERIOD_MONTHS] || 1;
  
  let next = new Date(start);
  while (next <= now) {
    next.setMonth(next.getMonth() + months);
  }
  
  return next.toISOString().split('T')[0];
};

// Проверить, скоро ли платёж (в ближайшие 7 дней)
export const isPaymentSoon = (nextPaymentDate: string): boolean => {
  const payment = new Date(nextPaymentDate);
  const now = new Date();
  const diff = payment.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 7;
};


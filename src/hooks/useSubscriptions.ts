import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Subscription,
  SubscriptionFilters,
  SortConfig,
  SortField,
  Currency
} from '../types';
import { calculateSubscriptionMetrics, generateId } from '../utils/calculations';

const STORAGE_KEY = 'subscription-calculator-data';

interface StoredData {
  subscriptions: Subscription[];
  currency: Currency;
  version: number;
}

const DEFAULT_DATA: StoredData = {
  subscriptions: [],
  currency: 'RUB',
  version: 1
};

// Загрузка данных из localStorage
const loadFromStorage = (): StoredData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_DATA, ...parsed };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return DEFAULT_DATA;
};

// Сохранение данных в localStorage
const saveToStorage = (data: StoredData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currency, setCurrency] = useState<Currency>('RUB');
  const [filters, setFilters] = useState<SubscriptionFilters>({});
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    const data = loadFromStorage();
    setSubscriptions(data.subscriptions);
    setCurrency(data.currency);
    setIsLoaded(true);
  }, []);

  // Сохранение при изменении данных
  useEffect(() => {
    if (isLoaded) {
      saveToStorage({ subscriptions, currency, version: 1 });
    }
  }, [subscriptions, currency, isLoaded]);

  // Добавить подписку
  const addSubscription = useCallback((
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newSub: Subscription = {
      ...subscription,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    setSubscriptions(prev => [...prev, newSub]);
    return newSub;
  }, []);

  // Обновить подписку
  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === id
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      )
    );
  }, []);

  // Удалить подписку
  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  }, []);

  // Фильтрованные и отсортированные подписки
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Фильтрация по категории
    if (filters.category) {
      result = result.filter(sub => sub.category === filters.category);
    }

    // Фильтрация по диапазону цен
    if (filters.priceRange) {
      result = result.filter(sub => {
        const metrics = calculateSubscriptionMetrics(sub);
        return (
          metrics.monthlyСost >= filters.priceRange!.min &&
          metrics.monthlyСost <= filters.priceRange!.max
        );
      });
    }

    // Фильтрация по рекомендации
    if (filters.recommendation) {
      result = result.filter(sub => {
        const metrics = calculateSubscriptionMetrics(sub);
        return metrics.recommendation === filters.recommendation;
      });
    }

    // Поиск по имени
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sub =>
        sub.name.toLowerCase().includes(searchLower)
      );
    }

    // Сортировка
    result.sort((a, b) => {
      const metricsA = calculateSubscriptionMetrics(a);
      const metricsB = calculateSubscriptionMetrics(b);

      let comparison = 0;
      const field = sort.field as SortField;

      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = metricsA.monthlyСost - metricsB.monthlyСost;
          break;
        case 'costPerHour':
          const costA = metricsA.costPerHour === Infinity ? 999999 : metricsA.costPerHour;
          const costB = metricsB.costPerHour === Infinity ? 999999 : metricsB.costPerHour;
          comparison = costA - costB;
          break;
        case 'importance':
          comparison = a.importance - b.importance;
          break;
        case 'valueScore':
          const scoreA = metricsA.valueScore === Infinity ? 999999 : metricsA.valueScore;
          const scoreB = metricsB.valueScore === Infinity ? 999999 : metricsB.valueScore;
          comparison = scoreA - scoreB;
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [subscriptions, filters, sort]);

  // Экспорт данных в JSON
  const exportData = useCallback(() => {
    const data = {
      subscriptions,
      currency,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [subscriptions, currency]);

  // Импорт данных из JSON
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.subscriptions && Array.isArray(data.subscriptions)) {
            setSubscriptions(data.subscriptions);
            if (data.currency) {
              setCurrency(data.currency);
            }
            resolve();
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }, []);

  // Очистить все данные
  const clearAllData = useCallback(() => {
    setSubscriptions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    subscriptions,
    filteredSubscriptions,
    currency,
    filters,
    sort,
    isLoaded,
    setCurrency,
    setFilters,
    setSort,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    exportData,
    importData,
    clearAllData
  };
};


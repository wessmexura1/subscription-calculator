import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Button, Input, CategoryBadge, RecommendationBadge } from '../ui';
import { CategoryFilter } from '../CategoryFilter';
import {
  Subscription,
  SubscriptionFilters,
  SortConfig,
  SortField,
  SubscriptionCategory,
  Currency,
  CURRENCY_SYMBOLS
} from '../../types';
import { 
  calculateSubscriptionMetrics, 
  formatPriceConverted, 
  formatHours 
} from '../../utils/calculations';
import styles from './SubscriptionTable.module.css';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  allSubscriptions: Subscription[];
  filters: SubscriptionFilters;
  sort: SortConfig;
  displayCurrency: Currency;
  onFiltersChange: (filters: SubscriptionFilters) => void;
  onSortChange: (sort: SortConfig) => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  allSubscriptions,
  filters,
  sort,
  displayCurrency,
  onFiltersChange,
  onSortChange,
  onEdit,
  onDelete
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Count subscriptions by category
  const categoryCounts = useMemo(() => {
    const counts: Record<SubscriptionCategory, number> = {
      video: 0, music: 0, games: 0, software: 0,
      cloud: 0, vpn: 0, education: 0, fitness: 0, other: 0
    };
    allSubscriptions.forEach(sub => {
      counts[sub.category]++;
    });
    return counts;
  }, [allSubscriptions]);

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) {
      return <ArrowUpDown size={14} className={styles.sortIconInactive} />;
    }
    return sort.direction === 'asc' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const handleCategoryFilter = (category: SubscriptionCategory | null) => {
    onFiltersChange({
      ...filters,
      category: category || undefined
    });
  };

  const handleSearch = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту подписку?')) {
      onDelete(id);
    }
    setActiveMenu(null);
  };

  const currencySymbol = CURRENCY_SYMBOLS[displayCurrency];

  if (allSubscriptions.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📭</div>
        <h3>Нет подписок</h3>
        <p>Добавьте свою первую подписку, чтобы начать отслеживать расходы</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={filters.category || null}
        onSelect={handleCategoryFilter}
        counts={categoryCounts}
      />

      {/* Search */}
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Input
            placeholder="Поиск по названию..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <button
                  className={styles.sortButton}
                  onClick={() => handleSort('name')}
                >
                  Сервис {getSortIcon('name')}
                </button>
              </th>
              <th>Категория</th>
              <th>
                <button
                  className={styles.sortButton}
                  onClick={() => handleSort('price')}
                >
                  В месяц {getSortIcon('price')}
                </button>
              </th>
              <th>
                <button
                  className={styles.sortButton}
                  onClick={() => handleSort('costPerHour')}
                >
                  {currencySymbol}/час {getSortIcon('costPerHour')}
                </button>
              </th>
              <th>
                <button
                  className={styles.sortButton}
                  onClick={() => handleSort('importance')}
                >
                  Важность {getSortIcon('importance')}
                </button>
              </th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {subscriptions.map((sub, index) => {
                const metrics = calculateSubscriptionMetrics(sub);
                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      <div className={styles.serviceName}>
                        <div className={styles.serviceIcon}>
                          {sub.name.charAt(0)}
                        </div>
                        <div className={styles.serviceInfo}>
                          <span className={styles.name}>{sub.name}</span>
                          <span className={styles.usage}>
                            {formatHours(metrics.hoursPerMonth)}/мес
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <CategoryBadge category={sub.category} size="sm" />
                    </td>
                    <td className={styles.price}>
                      {formatPriceConverted(metrics.monthlyСost, displayCurrency)}
                    </td>
                    <td className={`${styles.costPerHour} ${metrics.costPerHour > 200 ? styles.high : ''}`}>
                      {metrics.costPerHour === Infinity
                        ? '—'
                        : formatPriceConverted(metrics.costPerHour, displayCurrency)}
                    </td>
                    <td>
                      <div className={styles.importance}>
                        <div className={styles.importanceTrack}>
                          <div
                            className={styles.importanceBar}
                            style={{ 
                              width: `${sub.importance * 10}%`,
                              background: sub.importance >= 8 
                                ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                                : sub.importance >= 5 
                                ? 'linear-gradient(90deg, #f5f5f5, #d4d4d8)'
                                : 'linear-gradient(90deg, #ef4444, #f87171)'
                            }}
                          />
                        </div>
                        <span>{sub.importance}/10</span>
                      </div>
                    </td>
                    <td>
                      <RecommendationBadge
                        recommendation={metrics.recommendation}
                        size="sm"
                      />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.menuButton}
                          onClick={() => setActiveMenu(activeMenu === sub.id ? null : sub.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        <AnimatePresence>
                          {activeMenu === sub.id && (
                            <motion.div
                              className={styles.menu}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                            >
                              <button onClick={() => { onEdit(sub); setActiveMenu(null); }}>
                                <Edit2 size={14} /> Редактировать
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(sub.id)}
                              >
                                <Trash2 size={14} /> Удалить
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {subscriptions.length === 0 && (filters.search || filters.category) && (
        <div className={styles.noResults}>
          <p>Ничего не найдено</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({})}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

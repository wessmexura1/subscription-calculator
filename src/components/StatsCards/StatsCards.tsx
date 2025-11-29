import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Calendar, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { OverallStats, Currency } from '../../types';
import { formatPriceConverted } from '../../utils/calculations';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
  stats: OverallStats;
  currency?: Currency;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, currency = 'RUB' }) => {
  const cards = [
    {
      id: 'monthly',
      icon: <Wallet size={22} />,
      label: 'В месяц',
      value: formatPriceConverted(stats.totalMonthlyCost, currency),
      color: '#ffffff'
    },
    {
      id: 'yearly',
      icon: <Calendar size={22} />,
      label: 'В год',
      value: formatPriceConverted(stats.totalYearlyCost, currency),
      color: '#a1a1aa'
    },
    {
      id: 'hourly',
      icon: <Clock size={22} />,
      label: 'Стоимость часа',
      value: formatPriceConverted(stats.averageCostPerHour, currency),
      subtitle: 'в среднем',
      color: '#71717a'
    },
    {
      id: 'count',
      icon: <TrendingUp size={22} />,
      label: 'Подписок',
      value: stats.totalSubscriptions.toString(),
      color: '#52525b'
    }
  ];

  const recommendationCards = [
    {
      id: 'keep',
      icon: <CheckCircle size={18} />,
      label: 'Оставить',
      value: stats.topValueSubscriptions.length,
      color: 'var(--color-success)'
    },
    {
      id: 'review',
      icon: <AlertTriangle size={18} />,
      label: 'Пересмотреть',
      value: stats.candidatesForCancellation.filter(s => 
        stats.lowUsageSubscriptions.includes(s)
      ).length,
      color: 'var(--color-warning)'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainStats}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.statIcon} style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statValue}>{card.value}</span>
              {card.subtitle && (
                <span className={styles.statSubtitle}>{card.subtitle}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {stats.totalSubscriptions > 0 && (
        <div className={styles.recommendations}>
          {recommendationCards.map((card) => (
            <div
              key={card.id}
              className={styles.recommendationCard}
              style={{ '--accent-color': card.color } as React.CSSProperties}
            >
              <span className={styles.recIcon}>{card.icon}</span>
              <span className={styles.recValue}>{card.value}</span>
              <span className={styles.recLabel}>{card.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


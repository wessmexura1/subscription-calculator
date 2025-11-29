import React from 'react';
import { SubscriptionCategory, CATEGORY_NAMES, CATEGORY_COLORS } from '../../types';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
};

// Category Badge с автоматическим цветом
interface CategoryBadgeProps {
  category: SubscriptionCategory;
  size?: 'sm' | 'md';
  onClick?: () => void;
  active?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  onClick,
  active = false
}) => {
  const color = CATEGORY_COLORS[category];
  const name = CATEGORY_NAMES[category];

  return (
    <span
      className={`${styles.categoryBadge} ${styles[size]} ${onClick ? styles.clickable : ''} ${active ? styles.active : ''}`}
      style={{
        '--category-color': color,
        '--category-bg': `${color}20`
      } as React.CSSProperties}
      onClick={onClick}
    >
      <span className={styles.dot} style={{ backgroundColor: color }} />
      {name}
    </span>
  );
};

// Recommendation Badge
interface RecommendationBadgeProps {
  recommendation: 'keep' | 'review' | 'cancel';
  size?: 'sm' | 'md';
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({
  recommendation,
  size = 'md'
}) => {
  const config = {
    keep: { label: 'Оставить', variant: 'success' as const },
    review: { label: 'Пересмотреть', variant: 'warning' as const },
    cancel: { label: 'Отключить', variant: 'danger' as const }
  };

  const { label, variant } = config[recommendation];

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
};


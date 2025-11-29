import React from 'react';
import { motion } from 'framer-motion';
import {
  Tv,
  Music,
  Gamepad2,
  Code,
  Cloud,
  Shield,
  GraduationCap,
  Dumbbell,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { SubscriptionCategory, CATEGORY_NAMES, CATEGORY_COLORS } from '../../types';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  selectedCategory: SubscriptionCategory | null;
  onSelect: (category: SubscriptionCategory | null) => void;
  counts?: Record<SubscriptionCategory, number>;
}

// Иконки для каждой категории
const CATEGORY_ICONS: Record<SubscriptionCategory, React.ReactNode> = {
  video: <Tv size={16} />,
  music: <Music size={16} />,
  games: <Gamepad2 size={16} />,
  software: <Code size={16} />,
  cloud: <Cloud size={16} />,
  vpn: <Shield size={16} />,
  education: <GraduationCap size={16} />,
  fitness: <Dumbbell size={16} />,
  other: <MoreHorizontal size={16} />
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelect,
  counts = {} as Record<SubscriptionCategory, number>
}) => {
  const categories = Object.keys(CATEGORY_NAMES) as SubscriptionCategory[];

  return (
    <div className={styles.container}>
      {/* All button */}
      <motion.button
        className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
        onClick={() => onSelect(null)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          '--glow-color': '#ffffff'
        } as React.CSSProperties}
      >
        <span className={styles.iconWrapper}>
          <Sparkles size={16} />
        </span>
        <span className={styles.label}>Все</span>
        {!selectedCategory && (
          <motion.div
            className={styles.activeIndicator}
            layoutId="categoryIndicator"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Category buttons */}
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        const color = CATEGORY_COLORS[category];
        const count = counts[category] || 0;

        return (
          <motion.button
            key={category}
            className={`${styles.categoryButton} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(isActive ? null : category)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              '--category-color': color,
              '--glow-color': color
            } as React.CSSProperties}
          >
            <span className={styles.iconWrapper} style={{ color }}>
              {CATEGORY_ICONS[category]}
            </span>
            <span className={styles.label}>{CATEGORY_NAMES[category]}</span>
            {count > 0 && (
              <span className={styles.count}>{count}</span>
            )}
            {isActive && (
              <motion.div
                className={styles.activeIndicator}
                layoutId="categoryIndicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ background: color }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};


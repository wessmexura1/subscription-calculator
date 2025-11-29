import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  animate = false
}) => {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  if (animate) {
    return (
      <motion.div
        className={classNames}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={onClick ? { scale: 1.02 } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
  <div className={styles.header}>
    <div className={styles.headerText}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

// Card Content
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => (
  <div className={`${styles.content} ${className}`}>{children}</div>
);

// Card Footer
export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.footer}>{children}</div>
);


import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Currency } from '../../types';
import styles from './CurrencySelector.module.css';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

interface CurrencyOption {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'RUB', symbol: '₽', name: 'Рубль', flag: '🇷🇺' },
  { code: 'USD', symbol: '$', name: 'Доллар', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Евро', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'Фунт', flag: '🇬🇧' },
  { code: 'CNY', symbol: '¥', name: 'Юань', flag: '🇨🇳' },
  { code: 'KZT', symbol: '₸', name: 'Тенге', flag: '🇰🇿' },
  { code: 'BYN', symbol: 'Br', name: 'Бел. рубль', flag: '🇧🇾' },
  { code: 'UAH', symbol: '₴', name: 'Гривна', flag: '🇺🇦' }
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.flag}>{currentCurrency.flag}</span>
        <span className={styles.code}>{currentCurrency.code}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                className={`${styles.option} ${currency.code === value ? styles.selected : ''}`}
                onClick={() => handleSelect(currency.code)}
              >
                <span className={styles.optionFlag}>{currency.flag}</span>
                <div className={styles.optionInfo}>
                  <span className={styles.optionCode}>{currency.code}</span>
                  <span className={styles.optionName}>{currency.name}</span>
                </div>
                <span className={styles.optionSymbol}>{currency.symbol}</span>
                {currency.code === value && (
                  <span className={styles.checkIcon}>
                    <Check size={16} />
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

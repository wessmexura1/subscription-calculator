import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  error?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  onChange,
  className = '',
  id,
  value,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.selectWrapper} ${error ? styles.hasError : ''}`}>
        <select
          id={selectId}
          className={styles.select}
          value={value}
          onChange={handleChange}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} size={18} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};


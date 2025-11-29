import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  showMarks?: boolean;
  valueLabel?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label,
  showValue = true,
  showMarks = false,
  valueLabel
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.container}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {valueLabel ? valueLabel(value) : value}
            </span>
          )}
        </div>
      )}
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, var(--color-text-primary) 0%, var(--color-text-primary) ${percentage}%, var(--color-border-default) ${percentage}%, var(--color-border-default) 100%)`
          }}
        />
        {showMarks && (
          <div className={styles.marks}>
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(mark => (
              <span
                key={mark}
                className={`${styles.mark} ${mark === value ? styles.activeMark : ''}`}
              >
                {mark}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


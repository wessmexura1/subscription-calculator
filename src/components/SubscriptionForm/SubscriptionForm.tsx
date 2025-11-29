import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Select, Modal, Slider } from '../ui';
import {
  Subscription,
  SubscriptionCategory,
  BillingPeriod,
  Currency,
  CATEGORY_NAMES,
  CATEGORY_COLORS,
  BILLING_PERIOD_NAMES,
  CURRENCY_SYMBOLS
} from '../../types';
import { SERVICE_PRESETS } from '../../data/presets';
import { convertCurrency, formatPrice } from '../../utils/calculations';
import styles from './SubscriptionForm.module.css';

interface SubscriptionFormProps {
  onAdd: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingSubscription?: Subscription | null;
  onUpdate?: (id: string, updates: Partial<Subscription>) => void;
  onClose?: () => void;
  displayCurrency?: Currency;
}

const categoryOptions = Object.entries(CATEGORY_NAMES).map(([value, label]) => ({
  value,
  label
}));

const billingOptions = Object.entries(BILLING_PERIOD_NAMES).map(([value, label]) => ({
  value,
  label
}));

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onAdd,
  editingSubscription,
  onUpdate,
  onClose,
  displayCurrency = 'RUB'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | null>(null);
  const [scrollActiveCategory, setScrollActiveCategory] = useState<string | null>(null);
  
  const presetsListRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Form state - simplified
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('other');
  const [price, setPrice] = useState('');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [importance, setImportance] = useState(5);
  const [isCustom, setIsCustom] = useState(false);

  // Open modal when editing
  useEffect(() => {
    if (editingSubscription) {
      setIsOpen(true);
      setStep('form');
      setName(editingSubscription.name);
      setCategory(editingSubscription.category);
      // Convert price to display currency if needed
      const convertedPrice = editingSubscription.currency !== displayCurrency
        ? convertCurrency(editingSubscription.price, editingSubscription.currency, displayCurrency)
        : editingSubscription.price;
      setPrice(Math.round(convertedPrice).toString());
      setBillingPeriod(editingSubscription.billingPeriod);
      setHoursPerWeek(editingSubscription.hoursPerWeek);
      setImportance(editingSubscription.importance);
      setIsCustom(editingSubscription.isCustom);
    }
  }, [editingSubscription, displayCurrency]);

  const resetForm = () => {
    setName('');
    setCategory('other');
    setPrice('');
    setBillingPeriod('monthly');
    setHoursPerWeek(5);
    setImportance(5);
    setIsCustom(false);
    setStep('select');
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
    onClose?.();
  };

  const handleSelectPreset = (preset: typeof SERVICE_PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    // Convert to display currency
    const convertedPrice = convertCurrency(
      preset.defaultPrice,
      preset.defaultCurrency,
      displayCurrency
    );
    setPrice(Math.round(convertedPrice).toString());
    setBillingPeriod(preset.defaultBillingPeriod);
    setIsCustom(false);
    setStep('form');
  };

  const handleCustom = () => {
    setIsCustom(true);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subscriptionData = {
      name,
      category,
      price: parseFloat(price),
      currency: displayCurrency, // Use selected display currency
      billingPeriod,
      planType: 'individual' as const, // Default to individual
      hoursPerWeek,
      importance,
      isCustom
    };

    if (editingSubscription && onUpdate) {
      onUpdate(editingSubscription.id, subscriptionData);
    } else {
      onAdd(subscriptionData);
    }

    handleClose();
  };

  // Filter presets
  const filteredPresets = SERVICE_PRESETS.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const presetsByCategory = filteredPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, typeof SERVICE_PRESETS>);

  const categories = Object.keys(CATEGORY_NAMES) as SubscriptionCategory[];

  // Scroll spy handler
  const handleScroll = useCallback(() => {
    if (!presetsListRef.current) return;
    
    const container = presetsListRef.current;
    const containerTop = container.getBoundingClientRect().top;
    
    let activeCategory: string | null = null;
    
    categoryRefs.current.forEach((element, category) => {
      const rect = element.getBoundingClientRect();
      const relativeTop = rect.top - containerTop;
      
      if (relativeTop <= 50) {
        activeCategory = category;
      }
    });
    
    setScrollActiveCategory(activeCategory);
  }, []);

  // Scroll to category on click
  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current.get(category);
    if (element && presetsListRef.current) {
      const container = presetsListRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop - 10,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Button
        variant="primary"
        icon={<Plus size={18} />}
        onClick={() => setIsOpen(true)}
      >
        Добавить подписку
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          editingSubscription
            ? 'Редактировать подписку'
            : step === 'select'
            ? 'Выберите сервис'
            : 'Настройка подписки'
        }
        size="lg"
      >
        <AnimatePresence mode="wait">
          {step === 'select' && !editingSubscription && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.selectStep}
            >
              {/* Search */}
              <Input
                placeholder="Поиск сервиса..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />

              {/* Category filters - minimalist tabs */}
              <div className={styles.categoryFilters}>
                <button
                  className={`${styles.categoryTab} ${!selectedCategory ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Все
                </button>
                {categories.slice(0, -1).map(cat => (
                  <button
                    key={cat}
                    className={`${styles.categoryTab} ${selectedCategory === cat ? styles.active : ''} ${scrollActiveCategory === cat && !selectedCategory ? styles.scrollHighlight : ''}`}
                    onClick={() => {
                      if (selectedCategory) {
                        setSelectedCategory(cat === selectedCategory ? null : cat);
                      } else {
                        scrollToCategory(cat);
                      }
                    }}
                  >
                    <span 
                      className={styles.categoryDot} 
                      style={{ background: CATEGORY_COLORS[cat] }}
                    />
                    {CATEGORY_NAMES[cat]}
                  </button>
                ))}
              </div>

              {/* Presets list */}
              <div 
                className={styles.presetsList}
                ref={presetsListRef}
                onScroll={handleScroll}
              >
                {Object.entries(presetsByCategory).map(([cat, presets]) => (
                  <div 
                    key={cat} 
                    className={styles.presetCategory}
                    ref={(el) => {
                      if (el) categoryRefs.current.set(cat, el);
                    }}
                  >
                    <h4 className={styles.presetCategoryTitle}>
                      {CATEGORY_NAMES[cat as SubscriptionCategory]}
                    </h4>
                    <div className={styles.presetsGrid}>
                      {presets.map(preset => {
                        const convertedPrice = convertCurrency(
                          preset.defaultPrice,
                          preset.defaultCurrency,
                          displayCurrency
                        );
                        return (
                          <button
                            key={preset.name}
                            className={styles.presetCard}
                            onClick={() => handleSelectPreset(preset)}
                          >
                            <div className={styles.presetIcon}>
                              {preset.name.charAt(0)}
                            </div>
                            <div className={styles.presetInfo}>
                              <span className={styles.presetName}>{preset.name}</span>
                              <span className={styles.presetPrice}>
                                от {formatPrice(convertedPrice, displayCurrency)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom option */}
              <div className={styles.customOption}>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<Plus size={18} />}
                  onClick={handleCustom}
                >
                  Добавить свой сервис
                </Button>
              </div>
            </motion.div>
          )}

          {(step === 'form' || editingSubscription) && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.form}
              onSubmit={handleSubmit}
            >
              {!editingSubscription && (
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => {
                    setStep('select');
                    resetForm();
                  }}
                >
                  ← Назад к выбору
                </button>
              )}

              <div className={styles.formGrid}>
                {/* Row 1: Name + Category */}
                <div className={styles.row}>
                  <Input
                    label="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Netflix, Spotify..."
                    required
                  />
                  <Select
                    label="Категория"
                    options={categoryOptions}
                    value={category}
                    onChange={(v) => setCategory(v as SubscriptionCategory)}
                  />
                </div>

                {/* Row 2: Price + Period */}
                <div className={styles.row}>
                  <Input
                    label={`Стоимость (${CURRENCY_SYMBOLS[displayCurrency]})`}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                  />
                  <Select
                    label="Период"
                    options={billingOptions}
                    value={billingPeriod}
                    onChange={(v) => setBillingPeriod(v as BillingPeriod)}
                  />
                </div>

                {/* Row 3: Compact sliders */}
                <div className={styles.slidersRow}>
                  <Slider
                    label="Использование"
                    value={hoursPerWeek}
                    onChange={setHoursPerWeek}
                    min={0}
                    max={40}
                    step={1}
                    valueLabel={(v) => `${v} ч/нед`}
                  />
                  <Slider
                    label="Важность"
                    value={importance}
                    onChange={setImportance}
                    min={1}
                    max={10}
                    valueLabel={(v) => `${v}/10`}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingSubscription ? 'Сохранить' : 'Добавить'}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
};


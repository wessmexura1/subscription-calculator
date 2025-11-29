import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, BarChart3, Lightbulb } from 'lucide-react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionTable } from './components/SubscriptionTable';
import { Charts } from './components/Charts';
import { Recommendations } from './components/Recommendations';
import { CurrencySelector } from './components/CurrencySelector';
import { useSubscriptions } from './hooks/useSubscriptions';
import { calculateOverallStats } from './utils/calculations';
import { Subscription } from './types';
import styles from './App.module.css';

type TabType = 'dashboard' | 'analytics' | 'recommendations';

function App() {
  const {
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
  } = useSubscriptions();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Calculate overall stats
  const stats = useMemo(() => calculateOverallStats(subscriptions), [subscriptions]);

  // Handle edit
  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  // Handle update
  const handleUpdate = (id: string, updates: Partial<Subscription>) => {
    updateSubscription(id, updates);
    setEditingSubscription(null);
  };

  // Handle close form
  const handleCloseForm = () => {
    setEditingSubscription(null);
  };

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Загрузка данных...</p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Обзор', icon: <LayoutGrid size={18} /> },
    { id: 'analytics', label: 'Аналитика', icon: <BarChart3 size={18} /> },
    { id: 'recommendations', label: 'Рекомендации', icon: <Lightbulb size={18} /> }
  ];

  return (
    <div className={styles.app}>
      <Header
        onExport={exportData}
        onImport={importData}
        onClear={clearAllData}
        hasData={subscriptions.length > 0}
      />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Hero Section */}
          <motion.section
            className={styles.hero}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatsCards stats={stats} currency={currency} />
          </motion.section>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.actionBarRight}>
              <CurrencySelector
                value={currency}
                onChange={setCurrency}
              />
              <SubscriptionForm
                onAdd={addSubscription}
                editingSubscription={editingSubscription}
                onUpdate={handleUpdate}
                onClose={handleCloseForm}
                displayCurrency={currency}
              />
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.section
                key="dashboard"
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SubscriptionTable
                  subscriptions={filteredSubscriptions}
                  allSubscriptions={subscriptions}
                  filters={filters}
                  sort={sort}
                  displayCurrency={currency}
                  onFiltersChange={setFilters}
                  onSortChange={setSort}
                  onEdit={handleEdit}
                  onDelete={deleteSubscription}
                />
              </motion.section>
            )}

            {activeTab === 'analytics' && (
              <motion.section
                key="analytics"
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {subscriptions.length > 0 ? (
                  <Charts
                    categoryStats={stats.categoryBreakdown}
                    subscriptions={subscriptions}
                    currency={currency}
                  />
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📊</div>
                    <h3>Нет данных для анализа</h3>
                    <p>Добавьте подписки, чтобы увидеть аналитику</p>
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'recommendations' && (
              <motion.section
                key="recommendations"
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {subscriptions.length > 0 ? (
                  <Recommendations
                    subscriptions={subscriptions}
                    currency={currency}
                    onEdit={handleEdit}
                    onDelete={deleteSubscription}
                  />
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>💡</div>
                    <h3>Нет рекомендаций</h3>
                    <p>Добавьте подписки, чтобы получить персональные рекомендации</p>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Конструктор подписок • Все данные хранятся локально в вашем браузере
        </p>
      </footer>
    </div>
  );
}

export default App;


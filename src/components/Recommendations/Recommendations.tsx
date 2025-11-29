import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardContent, CategoryBadge, Button } from '../ui';
import { Subscription, Currency } from '../../types';
import { calculateSubscriptionMetrics, formatPriceConverted } from '../../utils/calculations';
import styles from './Recommendations.module.css';

interface RecommendationsProps {
  subscriptions: Subscription[];
  currency?: Currency;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  subscriptions,
  currency = 'RUB',
  onEdit,
  onDelete
}) => {
  // Calculate metrics for all subscriptions
  const subsWithMetrics = subscriptions.map(sub => ({
    subscription: sub,
    metrics: calculateSubscriptionMetrics(sub)
  }));

  // Group by recommendation
  const keepList = subsWithMetrics.filter(s => s.metrics.recommendation === 'keep');
  const reviewList = subsWithMetrics.filter(s => s.metrics.recommendation === 'review');
  const cancelList = subsWithMetrics.filter(s => s.metrics.recommendation === 'cancel');

  // Calculate potential savings
  const potentialSavings = [...reviewList, ...cancelList].reduce(
    (sum, s) => sum + s.metrics.monthlyСost,
    0
  );

  if (subscriptions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💡</div>
        <h3>Нет рекомендаций</h3>
        <p>Добавьте подписки, чтобы получить персональные рекомендации</p>
      </div>
    );
  }


  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту подписку?')) {
      onDelete(id);
    }
  };

  return (
    <div className={styles.container}>
      {/* All good message */}
      {potentialSavings === 0 && keepList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.allGoodCard}
        >
          <div className={styles.allGoodIcon}>
            <CheckCircle size={32} />
          </div>
          <div className={styles.allGoodContent}>
            <h3>Отличная работа! 🎉</h3>
            <p>Все ваши подписки оптимизированы. Нет подписок, которые стоит отключить.</p>
          </div>
        </motion.div>
      )}

      {/* Summary Card */}
      {potentialSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.summaryCard}
        >
          <div className={styles.summaryIcon}>
            <Sparkles size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>Возможная экономия</h3>
            <p className={styles.savingsAmount}>
              до {formatPriceConverted(potentialSavings, currency)} <span>в месяц</span>
            </p>
            <p className={styles.savingsSubtext}>
              {formatPriceConverted(potentialSavings * 12, currency)} в год при отключении {reviewList.length + cancelList.length} подписок
            </p>
          </div>
        </motion.div>
      )}

      {/* Candidates for cancellation */}
      {cancelList.length > 0 && (
        <Card padding="lg">
          <CardHeader
            title="Кандидаты на отключение"
            subtitle="Низкая ценность при высокой стоимости"
            action={
              <div className={styles.headerBadge}>
                <XCircle size={16} />
                {cancelList.length}
              </div>
            }
          />
          <CardContent>
            <div className={styles.subscriptionList}>
              {cancelList.map(({ subscription, metrics }, index) => (
                <motion.div
                  key={subscription.id}
                  className={styles.subscriptionItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.itemIcon}>
                    <XCircle size={18} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{subscription.name}</span>
                      <CategoryBadge category={subscription.category} size="sm" />
                    </div>
                    <div className={styles.itemMeta}>
                      <span>
                        <Clock size={12} />
                        {subscription.hoursPerWeek} ч/нед
                      </span>
                      <span>Важность: {subscription.importance}/10</span>
                    </div>
                  </div>
                  <div className={styles.itemCost}>
                    <span className={styles.monthlyCost}>
                      {formatPriceConverted(metrics.monthlyСost, currency)}
                    </span>
                    <span className={styles.costPerHour}>
                      {metrics.costPerHour === Infinity
                        ? '—'
                        : `${formatPriceConverted(metrics.costPerHour, currency)}/час`}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(subscription)}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(subscription.id)}
                    >
                      Отключить
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review list */}
      {reviewList.length > 0 && (
        <Card padding="lg">
          <CardHeader
            title="Стоит пересмотреть"
            subtitle="Возможно, вы переплачиваете"
            action={
              <div className={`${styles.headerBadge} ${styles.warning}`}>
                <AlertTriangle size={16} />
                {reviewList.length}
              </div>
            }
          />
          <CardContent>
            <div className={styles.subscriptionList}>
              {reviewList.map(({ subscription, metrics }, index) => (
                <motion.div
                  key={subscription.id}
                  className={styles.subscriptionItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`${styles.itemIcon} ${styles.warning}`}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{subscription.name}</span>
                      <CategoryBadge category={subscription.category} size="sm" />
                    </div>
                    <div className={styles.itemMeta}>
                      <span>
                        <Clock size={12} />
                        {subscription.hoursPerWeek} ч/нед
                      </span>
                      <span>Важность: {subscription.importance}/10</span>
                    </div>
                  </div>
                  <div className={styles.itemCost}>
                    <span className={styles.monthlyCost}>
                      {formatPriceConverted(metrics.monthlyСost, currency)}
                    </span>
                    <span className={styles.costPerHour}>
                      {metrics.costPerHour === Infinity
                        ? '—'
                        : `${formatPriceConverted(metrics.costPerHour, currency)}/час`}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(subscription)}
                    >
                      Изменить
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top value subscriptions */}
      {keepList.length > 0 && (
        <Card padding="lg">
          <CardHeader
            title="Топ ценности"
            subtitle="Отличное соотношение цена/качество"
            action={
              <div className={`${styles.headerBadge} ${styles.success}`}>
                <CheckCircle size={16} />
                {keepList.length}
              </div>
            }
          />
          <CardContent>
            <div className={styles.subscriptionList}>
              {keepList
                .sort((a, b) => (b.metrics.valueScore || 0) - (a.metrics.valueScore || 0))
                .slice(0, 5)
                .map(({ subscription, metrics }, index) => (
                  <motion.div
                    key={subscription.id}
                    className={styles.subscriptionItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`${styles.itemIcon} ${styles.success}`}>
                      <CheckCircle size={18} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemName}>{subscription.name}</span>
                        <CategoryBadge category={subscription.category} size="sm" />
                      </div>
                      <div className={styles.itemMeta}>
                        <span>
                          <Clock size={12} />
                          {subscription.hoursPerWeek} ч/нед
                        </span>
                        <span>Важность: {subscription.importance}/10</span>
                      </div>
                    </div>
                    <div className={styles.itemCost}>
                      <span className={styles.monthlyCost}>
                        {formatPriceConverted(metrics.monthlyСost, currency)}
                      </span>
                      <span className={`${styles.costPerHour} ${styles.good}`}>
                        {metrics.costPerHour === Infinity
                          ? '—'
                          : `${formatPriceConverted(metrics.costPerHour, currency)}/час`}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


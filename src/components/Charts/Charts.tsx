import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardHeader, CardContent } from '../ui';
import {
  CategoryStats,
  Subscription,
  CATEGORY_NAMES,
  CATEGORY_COLORS,
  SubscriptionCategory,
  Currency,
  CURRENCY_SYMBOLS
} from '../../types';
import { calculateSubscriptionMetrics, formatPriceConverted } from '../../utils/calculations';
import styles from './Charts.module.css';

interface ChartsProps {
  categoryStats: CategoryStats[];
  subscriptions: Subscription[];
  currency?: Currency;
}

export const Charts: React.FC<ChartsProps> = ({
  categoryStats,
  subscriptions,
  currency = 'RUB'
}) => {
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  // Data for pie chart
  const pieData = categoryStats.map(stat => ({
    name: CATEGORY_NAMES[stat.category],
    value: stat.totalMonthlyCost,
    color: CATEGORY_COLORS[stat.category],
    percentage: stat.percentage
  }));

  // Data for bar chart - top subscriptions by cost per hour
  const barData = subscriptions
    .map(sub => {
      const metrics = calculateSubscriptionMetrics(sub);
      return {
        name: sub.name.length > 15 ? sub.name.substring(0, 15) + '...' : sub.name,
        fullName: sub.name,
        costPerHour: metrics.costPerHour === Infinity ? 0 : metrics.costPerHour,
        monthlyCost: metrics.monthlyСost,
        category: sub.category
      };
    })
    .filter(d => d.costPerHour > 0)
    .sort((a, b) => b.costPerHour - a.costPerHour)
    .slice(0, 8);

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof pieData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: data.color }}
            />
            <span className={styles.tooltipTitle}>{data.name}</span>
          </div>
          <div className={styles.tooltipValue}>
            {formatPriceConverted(data.value, currency)}
          </div>
          <div className={styles.tooltipPercent}>
            {data.percentage.toFixed(1)}% от бюджета
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof barData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>{data.fullName}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Стоимость часа:</span>
            <span className={styles.tooltipValue}>{formatPriceConverted(data.costPerHour, currency)}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>В месяц:</span>
            <span>{formatPriceConverted(data.monthlyCost, currency)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend for pie chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <ul className={styles.legend}>
        {payload.map((entry: { value: string; color?: string }, index: number) => (
          <li key={`legend-${index}`} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: entry.color || '#999' }}
            />
            <span className={styles.legendLabel}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (subscriptions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Нет данных для анализа</h3>
        <p>Добавьте подписки, чтобы увидеть аналитику</p>
      </div>
    );
  }

  // Если нет данных для pie chart
  if (pieData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Недостаточно данных</h3>
        <p>Добавьте больше подписок для построения графиков</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Category Pie Chart */}
      <Card padding="lg">
        <CardHeader
          title="Расходы по категориям"
          subtitle="Распределение месячного бюджета"
        />
        <CardContent>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Per Hour Bar Chart */}
      {barData.length > 0 && (
        <Card padding="lg">
          <CardHeader
            title="Стоимость часа использования"
            subtitle="Топ подписок по цене за час"
          />
          <CardContent>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    tickFormatter={(value) => `${value}${currencySymbol}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar
                    dataKey="costPerHour"
                    radius={[0, 4, 4, 0]}
                    fill="#fafafa"
                  >
                    {barData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={CATEGORY_COLORS[entry.category as SubscriptionCategory]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


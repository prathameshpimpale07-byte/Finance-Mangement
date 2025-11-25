import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { formatCurrency } from '../../utils/format.js';
import { Utensils, Hotel, ShoppingBag, Plane, MoreHorizontal } from 'lucide-react';

const CATEGORY_CONFIG = {
  Travel: { color: '#2563eb', icon: Plane },
  Food: { color: '#22c55e', icon: Utensils },
  Stay: { color: '#f59e0b', icon: Hotel },
  Shopping: { color: '#ec4899', icon: ShoppingBag },
  Misc: { color: '#8b5cf6', icon: MoreHorizontal },
};

const CategoryBreakdown = ({ expenses = [] }) => {
  const data = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  const chartData = Object.keys(data)
    .map((key) => ({
      name: key,
      value: data[key],
      percentage: total > 0 ? ((data[key] / total) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (!chartData.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <MoreHorizontal className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No expenses yet
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Add your first expense to see category breakdown
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="mt-1">{formatCurrency(data.value)}</p>
          <p className="text-slate-400">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Expenses by Category
        </h3>
        <span className="text-xs text-slate-500">
          Total: {formatCurrency(total)}
        </span>
      </div>

      {/* Bar Chart */}
      <div className="mb-6 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => {
                const config = CATEGORY_CONFIG[entry.name] || CATEGORY_CONFIG.Misc;
                return <Cell key={`cell-${index}`} fill={config.color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category List with Icons */}
      <div className="space-y-3">
        {chartData.map((entry) => {
          const config = CATEGORY_CONFIG[entry.name] || CATEGORY_CONFIG.Misc;
          const Icon = config.icon;
          const barWidth = total > 0 ? (entry.value / total) * 100 : 0;
          
          return (
            <div key={entry.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {entry.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(entry.value)}
                  </span>
                  <span className="ml-2 text-xs text-slate-500">
                    {entry.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;


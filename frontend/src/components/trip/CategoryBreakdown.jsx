import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format.js';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];

const CategoryBreakdown = ({ expenses = [] }) => {
  const data = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  if (!chartData.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No expense data yet. Add your first expense to see insights.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Category split
      </h3>
      <div className="mt-4 h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {chartData.map((entry, index) => (
          <li
            key={entry.name}
            className="flex items-center justify-between text-slate-600 dark:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              {entry.name}
            </span>
            <span>{formatCurrency(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBreakdown;


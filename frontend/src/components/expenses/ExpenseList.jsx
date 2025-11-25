import { formatCurrency, formatDate } from '../../utils/format.js';

const ExpenseList = ({ expenses = [] }) => {
  if (!expenses.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No expenses logged yet. Tap “Add” to start splitting.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {expense.description}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {expense.category} • {formatDate(expense.date)}
              </p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Paid by {expense.paidBy?.name || 'Someone'} · Split{' '}
            {expense.splitType}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;


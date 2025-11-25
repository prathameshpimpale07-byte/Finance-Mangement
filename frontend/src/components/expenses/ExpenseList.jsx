import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format.js';

const ExpenseList = ({ expenses = [], onDelete, onToggleSettled }) => {
  if (!expenses.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No expenses logged yet. Tap "Add" to start splitting.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className={`group relative rounded-3xl border p-4 pr-12 shadow-sm transition hover:shadow-md ${
            expense.settled
              ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/10'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
          }`}
        >
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {expense.description}
                </p>
                {expense.settled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Settled
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {expense.category} • {formatDate(expense.date)}
              </p>
            </div>
            <p className={`ml-3 text-lg font-bold ${
              expense.settled 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-900 dark:text-white'
            }`}>
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            {expense.splitType === 'eachPaysOwn' ? (
              <>
                Each person paid {formatCurrency(expense.amountPerPerson || expense.amount / (expense.splits?.length || 1))} · 
                <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  No settlement needed
                </span>
              </>
            ) : (
              <>
                Paid by {expense.paidBy?.name || 'Someone'} · Split{' '}
                {expense.splitType}
              </>
            )}
          </p>
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            {onToggleSettled && expense.splitType !== 'eachPaysOwn' && (
              <button
                onClick={() => onToggleSettled(expense._id)}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition ${
                  expense.settled
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                }`}
                aria-label={expense.settled ? 'Mark as unsettled' : 'Mark as settled'}
                title={expense.settled ? 'Mark as unsettled' : 'Mark as settled'}
              >
                {expense.settled ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense._id, expense.description)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                aria-label={`Delete expense: ${expense.description}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;


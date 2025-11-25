import { useState } from 'react';
import { Trash2, CheckCircle2, Circle, CheckSquare, Square } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format.js';

const ExpenseList = ({ expenses = [], onDelete, onToggleSettled, onBulkSettle }) => {
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  const expensesNeedingSettlement = expenses.filter(
    (e) => e.splitType !== 'eachPaysOwn'
  );

  const toggleSelect = (expenseId) => {
    setSelectedExpenses((prev) => {
      const next = new Set(prev);
      if (next.has(expenseId)) {
        next.delete(expenseId);
      } else {
        next.add(expenseId);
      }
      return next;
    });
  };

  const handleBulkSettle = (settle) => {
    if (selectedExpenses.size === 0) return;
    onBulkSettle?.(Array.from(selectedExpenses), settle);
    setSelectedExpenses(new Set());
    setIsSelectMode(false);
  };

  if (!expenses.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No expenses logged yet. Tap "Add" to start splitting.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Bulk Actions Bar */}
      {isSelectMode && expensesNeedingSettlement.length > 0 && (
        <div className="sticky top-16 z-20 rounded-2xl border border-brand bg-brand/10 p-3 backdrop-blur-sm dark:bg-brand/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedExpenses.size} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkSettle(true)}
                disabled={selectedExpenses.size === 0}
                className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:flex-none"
              >
                Mark as Settled
              </button>
              <button
                onClick={() => handleBulkSettle(false)}
                disabled={selectedExpenses.size === 0}
                className="flex-1 rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 sm:flex-none"
              >
                Mark as Unsettled
              </button>
              <button
                onClick={() => {
                  setSelectedExpenses(new Set());
                  setIsSelectMode(false);
                }}
                className="flex-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 sm:flex-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Mode Toggle */}
      {!isSelectMode && expensesNeedingSettlement.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsSelectMode(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <CheckSquare className="h-4 w-4" />
            Select Multiple
          </button>
        </div>
      )}

      {expenses.map((expense) => {
        const canSettle = expense.splitType !== 'eachPaysOwn';
        const isSelected = selectedExpenses.has(expense._id);

        return (
          <div
            key={expense._id}
            className={`group relative rounded-3xl border p-4 shadow-sm transition hover:shadow-md ${
              isSelected
                ? 'border-brand bg-brand/5 dark:bg-brand/10'
                : expense.settled
                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/10'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
            } ${isSelectMode && canSettle ? 'pr-16 sm:pr-20' : 'pr-12 sm:pr-16'}`}
          >
            {/* Checkbox for select mode */}
            {isSelectMode && canSettle && (
              <button
                onClick={() => toggleSelect(expense._id)}
                className={`absolute left-3 top-3 z-10 inline-flex h-6 w-6 items-center justify-center rounded-lg border-2 transition ${
                  isSelected
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'
                }`}
                aria-label="Select expense"
              >
                {isSelected && <CheckSquare className="h-4 w-4" />}
              </button>
            )}

            <div className={`flex justify-between ${isSelectMode && canSettle ? 'pl-10' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-slate-900 dark:text-white break-words">
                    {expense.description}
                  </p>
                  {expense.settled && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Settled
                    </span>
                  )}
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mt-1">
                  {expense.category} • {formatDate(expense.date)}
                </p>
              </div>
              <p className={`ml-3 text-lg font-bold flex-shrink-0 ${
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
            
            {/* Action buttons - visible on hover or always in select mode */}
            <div className={`absolute right-2 top-2 z-10 flex flex-col items-end gap-1 sm:flex-row sm:right-3 sm:top-3 ${
              isSelectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } transition`}>
              {!isSelectMode && onToggleSettled && canSettle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSettled(expense._id);
                  }}
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
              {!isSelectMode && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(expense._id, expense.description);
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                  aria-label={`Delete expense: ${expense.description}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;


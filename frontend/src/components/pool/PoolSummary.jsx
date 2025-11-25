import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format.js';

const PoolSummary = ({ poolSummary, onAddContribution }) => {
  if (!poolSummary || poolSummary.totalContributions === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
        <Wallet className="mx-auto mb-3 h-12 w-12 text-slate-400" />
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          No trip pool yet
        </p>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-500">
          Members can contribute money to a shared fund for trip expenses
        </p>
        {onAddContribution && (
          <button
            onClick={onAddContribution}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            Add First Contribution
          </button>
        )}
      </div>
    );
  }

  const { totalContributions, totalSpentFromPool, remainingBalance, returns } = poolSummary;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Total contributed
            </p>
            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalContributions)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Spent from pool
            </p>
            <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-xl font-semibold text-amber-700 dark:text-amber-400">
            {formatCurrency(totalSpentFromPool)}
          </p>
        </div>

        <div className={`rounded-2xl border p-4 ${
          remainingBalance > 0
            ? 'border-teal-200 bg-teal-50/50 dark:border-teal-900/40 dark:bg-teal-900/10'
            : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs uppercase tracking-wide ${
              remainingBalance > 0
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-400'
            }`}>
              Remaining balance
            </p>
            <TrendingUp className={`h-5 w-5 ${
              remainingBalance > 0
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-400'
            }`} />
          </div>
          <p className={`mt-2 text-xl font-semibold ${
            remainingBalance > 0
              ? 'text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}>
            {formatCurrency(remainingBalance)}
          </p>
        </div>
      </div>

      {/* Returns per member */}
      {remainingBalance > 0 && returns && returns.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Return per member (proportional)
            </p>
          </div>
          <div className="space-y-2">
            {returns.map((returnEntry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {returnEntry.member.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Contributed: {formatCurrency(returnEntry.contributed)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(returnEntry.returnAmount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolSummary;


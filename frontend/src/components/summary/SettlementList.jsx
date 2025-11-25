import { formatCurrency } from '../../utils/format.js';
import { ArrowRight, CheckCircle2, AlertCircle, Wallet, TrendingUp } from 'lucide-react';

const SettlementList = ({ settlement, members = [], expenses = [] }) => {
  if (!settlement || !settlement.ledger || settlement.ledger.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <Wallet className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No settlement data
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {members.length === 0 
            ? 'Add members to your trip first'
            : expenses.length === 0
            ? 'Add expenses to calculate settlement'
            : 'Calculating settlement...'}
        </p>
      </div>
    );
  }

  const totalExpense = settlement.totals?.totalExpense || expenses.reduce((sum, e) => sum + e.amount, 0);
  const hasTransactions = settlement.transactions && settlement.transactions.length > 0;
  const allSettled = !hasTransactions;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Expenses
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          {allSettled ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          )}
        </div>
        {allSettled && (
          <p className="mt-3 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            ✓ All balances are settled!
          </p>
        )}
      </div>

      {/* Balances */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Wallet className="h-4 w-4" />
          Individual Balances
        </h3>
        <div className="space-y-3">
          {settlement.ledger.map((entry) => {
            const isPositive = entry.balance > 0.01;
            const isNegative = entry.balance < -0.01;
            const isNeutral = !isPositive && !isNegative;

            return (
              <div
                key={entry.member?._id || entry.member}
                className={`rounded-2xl border p-3 ${
                  isPositive
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/10'
                    : isNegative
                    ? 'border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {entry.member?.name || 'Unknown'}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span>Paid: {formatCurrency(entry.paid || 0)}</span>
                      <span>•</span>
                      <span>Share: {formatCurrency(entry.share || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {isNeutral ? (
                      <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                        <CheckCircle2 className="h-4 w-4" />
                        Settled
                      </span>
                    ) : (
                      <span
                        className={`text-lg font-bold ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {formatCurrency(Math.abs(entry.balance))}
                      </span>
                    )}
                    <p
                      className={`mt-1 text-xs font-medium ${
                        isPositive
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : isNegative
                          ? 'text-rose-700 dark:text-rose-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {isPositive
                        ? 'Will receive'
                        : isNegative
                        ? 'Owes'
                        : 'Settled'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      {hasTransactions && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <ArrowRight className="h-4 w-4" />
            Payment Instructions
          </h3>
          <div className="space-y-2">
            {settlement.transactions.map((tx, index) => (
              <div
                key={`${tx.from}-${tx.to}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {tx.from}
                    </p>
                    <p className="text-xs text-slate-500">should pay</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {tx.to}
                    </p>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allSettled && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            All expenses are settled!
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-500">
            No payments needed. Everyone has paid their fair share.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettlementList;


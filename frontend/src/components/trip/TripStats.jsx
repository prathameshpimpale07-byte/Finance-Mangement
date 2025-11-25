import { Wallet, Users, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

const statCards = [
  { key: 'totalExpense', label: 'Total spent', icon: Wallet },
  { key: 'perHead', label: 'Per person', icon: Users },
  { key: 'settled', label: 'Settled', icon: PiggyBank },
];

const TripStats = ({ expenses = [], members = [], settlement }) => {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perHead = members.length ? totalExpense / members.length : 0;
  
  // Count settled expenses (excluding eachPaysOwn which don't need settlement)
  const expensesNeedingSettlement = expenses.filter(
    (e) => e.splitType !== 'eachPaysOwn'
  );
  const settledExpenses = expensesNeedingSettlement.filter((e) => e.settled).length;
  const totalNeedingSettlement = expensesNeedingSettlement.length;
  
  // Check if all expenses needing settlement are settled
  const allSettled = totalNeedingSettlement > 0 && settledExpenses === totalNeedingSettlement;
  const hasTransactions = settlement?.transactions?.length > 0;

  const settledStatus = allSettled
    ? 'All settled'
    : hasTransactions
    ? `${settledExpenses}/${totalNeedingSettlement} settled`
    : totalNeedingSettlement > 0
    ? 'Pending'
    : 'No expenses';

  const values = {
    totalExpense: formatCurrency(totalExpense),
    perHead: formatCurrency(perHead),
    settled: settledStatus,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {card.label}
              </p>
              <Icon size={18} className="text-brand" />
            </div>
            <p className={`mt-3 text-xl font-semibold ${
              card.key === 'settled' && allSettled
                ? 'text-emerald-600 dark:text-emerald-400'
                : card.key === 'settled' && hasTransactions
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}>
              {values[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TripStats;


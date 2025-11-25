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
  const settled = settlement?.transactions?.length
    ? settlement.transactions.filter((tx) => tx.amount === 0).length
    : 0;

  const values = {
    totalExpense: formatCurrency(totalExpense),
    perHead: formatCurrency(perHead),
    settled: settled ? `${settled} cleared` : 'Pending',
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
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
              {values[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TripStats;


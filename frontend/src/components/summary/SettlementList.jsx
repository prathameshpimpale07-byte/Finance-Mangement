import { formatCurrency } from '../../utils/format.js';

const SettlementList = ({ settlement }) => {
  if (!settlement) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Tap “Generate summary” to calculate who owes whom.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-sm font-semibold text-slate-500">Balances</h3>
        <div className="mt-3 space-y-2 text-sm">
          {settlement.ledger.map((entry) => (
            <div
              key={entry.member._id}
              className="flex items-center justify-between"
            >
              <span>{entry.member.name}</span>
              <span
                className={`font-semibold ${
                  entry.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {entry.balance >= 0 ? 'Gets' : 'Owes'}{' '}
                {formatCurrency(Math.abs(entry.balance))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-sm font-semibold text-slate-500">Transactions</h3>
        <div className="mt-3 space-y-2">
          {settlement.transactions.length === 0 && (
            <p className="text-sm text-slate-500">All settled 🎉</p>
          )}
          {settlement.transactions.map((tx, index) => (
            <div
              key={`${tx.from}-${tx.to}-${index}`}
              className="rounded-2xl bg-slate-100/70 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
            >
              <span className="font-semibold">{tx.from}</span> pays{' '}
              <span className="font-semibold">{tx.to}</span>{' '}
              {formatCurrency(tx.amount)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettlementList;


import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format.js';

const TripCard = ({ trip }) => {
  const totalExpense = (trip.expenses || []).reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Link
      to={`/trips/${trip._id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {trip.name}
        </h3>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          {trip.members?.length || 0} people
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Started {new Date(trip.startDate).toLocaleDateString()}
      </p>
      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        {formatCurrency(totalExpense)}
      </p>
      <p className="text-xs uppercase tracking-wider text-slate-400">
        Total spent
      </p>
    </Link>
  );
};

export default TripCard;


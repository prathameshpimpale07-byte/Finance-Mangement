import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import useTripStore from '../../context/tripStore.js';

const TripCard = ({ trip }) => {
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const fetchTrips = useTripStore((state) => state.fetchTrips);
  
  const totalExpense = (trip.expenses || []).reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${trip.name}"? This will delete all expenses and members.`)) {
      try {
        await deleteTrip(trip._id);
        await fetchTrips();
      } catch (error) {
        alert('Failed to delete trip: ' + error.message);
      }
    }
  };

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <Link to={`/trips/${trip._id}`} className="block">
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
      <button
        onClick={handleDelete}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 opacity-0 transition hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-900/20"
        aria-label="Delete trip"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TripCard;


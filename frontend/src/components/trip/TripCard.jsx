import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
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
        toast.success('Trip deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete trip. Please try again.');
      }
    }
  };

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <Link to={`/trips/${trip._id}`} className="block pr-10">
        <div className="flex items-center justify-between">
          <h3 className="flex-1 text-lg font-semibold text-slate-900 dark:text-white">
            {trip.name}
          </h3>
          <span className="ml-2 rounded-full bg-brand/10 px-2 py-1 text-xs font-semibold text-brand sm:px-3">
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
        className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-red-500 opacity-0 shadow-sm transition hover:bg-red-50 group-hover:opacity-100 dark:bg-slate-800 dark:hover:bg-red-900/20"
        aria-label="Delete trip"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default TripCard;


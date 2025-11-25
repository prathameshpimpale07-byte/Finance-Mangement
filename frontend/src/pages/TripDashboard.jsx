import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useTripStore from '../context/tripStore.js';
import TripStats from '../components/trip/TripStats.jsx';
import CategoryBreakdown from '../components/trip/CategoryBreakdown.jsx';
import ExpenseList from '../components/expenses/ExpenseList.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';
import Fab from '../components/layout/Fab.jsx';

const TripDashboard = () => {
  const { tripId } = useParams();
  const currentTrip = useTripStore((state) => state.currentTrip);
  const members = useTripStore((state) => state.members);
  const expenses = useTripStore((state) => state.expenses);
  const settlement = useTripStore((state) => state.settlement);
  const loading = useTripStore((state) => state.loading);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const loadSettlement = useTripStore((state) => state.loadSettlement);
  const deleteExpense = useTripStore((state) => state.deleteExpense);

  useEffect(() => {
    const loadData = async () => {
      await selectTrip(tripId);
    };
    loadData();
  }, [tripId, selectTrip]);

  // Load settlement after trip data is loaded
  useEffect(() => {
    if (currentTrip && (expenses.length > 0 || members.length > 0)) {
      loadSettlement(tripId);
    }
  }, [currentTrip?._id, tripId, loadSettlement]);

  const handleDeleteExpense = async (expenseId, expenseDescription) => {
    if (
      window.confirm(
        `Delete expense "${expenseDescription}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteExpense(tripId, expenseId);
        // Refresh settlement after deletion
        if (expenses.length > 0 || members.length > 0) {
          await loadSettlement(tripId);
        }
        toast.success('Expense deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete expense. Please try again.');
      }
    }
  };

  if (loading && !currentTrip) {
    return <p className="p-6 text-sm text-slate-500">Loading trip...</p>;
  }

  if (!currentTrip) {
    return (
      <section className="p-6 text-center text-sm text-slate-500">
        Trip not found. <Link to="/">Go back</Link>
      </section>
    );
  }

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-4xl space-y-5 px-4 pt-4">
        {/* Back Button and Trip Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Back to all trips"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Current trip
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {currentTrip.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {members.length} members • Started{' '}
              {new Date(currentTrip.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <TripStats
          expenses={expenses}
          members={members}
          settlement={settlement}
        />
        <CategoryBreakdown expenses={expenses} />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent expenses
            </h3>
            <Link
              to={`/trips/${tripId}/expenses/new`}
              className="text-sm font-semibold text-brand"
            >
              Add expense
            </Link>
          </div>
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </div>
      </div>

      <Fab to={`/trips/${tripId}/expenses/new`} />
      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default TripDashboard;


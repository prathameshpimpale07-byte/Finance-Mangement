import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  useEffect(() => {
    selectTrip(tripId);
  }, [tripId, selectTrip]);

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
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Current trip
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {currentTrip.name}
          </h2>
          <p className="text-sm text-slate-500">
            {members.length} members • Started{' '}
            {new Date(currentTrip.startDate).toLocaleDateString()}
          </p>
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
          <ExpenseList expenses={expenses} />
        </div>
      </div>

      <Fab to={`/trips/${tripId}/expenses/new`} />
      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default TripDashboard;


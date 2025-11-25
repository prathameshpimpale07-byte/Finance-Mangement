import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users, Wallet, Sparkles } from 'lucide-react';
import TripCard from '../components/trip/TripCard.jsx';
import useTripStore from '../context/tripStore.js';
import { formatCurrency } from '../utils/format.js';

const Home = () => {
  const trips = useTripStore((state) => state.trips);
  const loading = useTripStore((state) => state.loading);
  const fetchTrips = useTripStore((state) => state.fetchTrips);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const totalTrips = trips.length;
  const totalExpenses = trips.reduce((sum, trip) => {
    return sum + (trip.expenses || []).reduce((s, e) => s + e.amount, 0);
  }, 0);

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 pb-24 pt-4">
      {/* Enhanced Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <Plane className="h-6 w-6" />
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            TripSplit
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Split expenses smartly. Travel worry-free.
          </p>
          <p className="mt-1 text-sm text-white/70">
            Manage group trip expenses with ease and transparency
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-xs text-white/80">Total Spent</span>
              </div>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-xs text-white/80">Active Trips</span>
              </div>
              <p className="mt-1 text-xl font-bold">{totalTrips}</p>
            </div>
          </div>

          <Link
            to="/trips/new"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            <Plane className="h-4 w-4" />
            Create New Trip
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading trips...</p>}

      <div className="grid gap-4">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>

      {!trips.length && !loading && (
        <p className="text-center text-sm text-slate-500">
          No trips yet. Tap “Create new trip” to get started.
        </p>
      )}
    </section>
  );
};

export default Home;


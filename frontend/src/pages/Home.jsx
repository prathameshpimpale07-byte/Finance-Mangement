import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../components/trip/TripCard.jsx';
import useTripStore from '../context/tripStore.js';

const Home = () => {
  const trips = useTripStore((state) => state.trips);
  const loading = useTripStore((state) => state.loading);
  const fetchTrips = useTripStore((state) => state.fetchTrips);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 pb-24 pt-4">
      <div className="rounded-3xl bg-gradient-to-r from-brand to-brand-dark p-6 text-white">
        <p className="text-sm uppercase tracking-wide text-white/80">Trips</p>
        <h2 className="mt-2 text-2xl font-semibold">Plan. Split. Relax.</h2>
        <p className="mt-2 text-sm text-white/80">
          Keep every rupee transparent during your adventures.
        </p>
        <Link
          to="/trips/new"
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-white"
        >
          Create new trip
        </Link>
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


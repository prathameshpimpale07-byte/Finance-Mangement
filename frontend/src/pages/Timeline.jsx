import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ActivityTimeline from '../components/summary/ActivityTimeline.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';
import useTripStore from '../context/tripStore.js';

const Timeline = () => {
  const { tripId } = useParams();
  const activity = useTripStore((state) => state.activity);
  const selectTrip = useTripStore((state) => state.selectTrip);

  useEffect(() => {
    selectTrip(tripId);
  }, [tripId, selectTrip]);

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <ActivityTimeline activity={activity} />
      </div>
      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default Timeline;


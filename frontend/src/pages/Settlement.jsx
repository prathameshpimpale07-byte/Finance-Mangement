import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTripStore from '../context/tripStore.js';
import SettlementList from '../components/summary/SettlementList.jsx';
import PdfExportButton from '../components/summary/PdfExportButton.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';
import { buildWhatsappMessage } from '../utils/format.js';

const Settlement = () => {
  const { tripId } = useParams();
  const currentTrip = useTripStore((state) => state.currentTrip);
  const settlement = useTripStore((state) => state.settlement);
  const expenses = useTripStore((state) => state.expenses);
  const loadSettlement = useTripStore((state) => state.loadSettlement);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    selectTrip(tripId);
  }, [tripId, selectTrip]);

  const handleGenerate = async () => {
    setLoading(true);
    await loadSettlement(tripId);
    setLoading(false);
  };

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-brand py-3 text-sm font-semibold text-white shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Generate summary'}
        </button>

        <SettlementList settlement={settlement} />

        {settlement && (
          <div className="space-y-3">
            <PdfExportButton
              trip={currentTrip}
              expenses={expenses}
              settlement={settlement}
            />
            <a
              href={`https://wa.me/?text=${buildWhatsappMessage({
                trip: currentTrip,
                settlement,
              })}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              Share via WhatsApp
            </a>
          </div>
        )}
      </div>
      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default Settlement;


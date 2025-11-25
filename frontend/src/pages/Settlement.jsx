import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useTripStore from '../context/tripStore.js';
import SettlementList from '../components/summary/SettlementList.jsx';
import AISummary from '../components/summary/AISummary.jsx';
import PdfExportButton from '../components/summary/PdfExportButton.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';
import { buildWhatsappMessage } from '../utils/format.js';

const Settlement = () => {
  const { tripId } = useParams();
  const currentTrip = useTripStore((state) => state.currentTrip);
  const settlement = useTripStore((state) => state.settlement);
  const expenses = useTripStore((state) => state.expenses);
  const members = useTripStore((state) => state.members);
  const loadSettlement = useTripStore((state) => state.loadSettlement);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await selectTrip(tripId);
      await loadSettlement(tripId);
      setLoading(false);
    };
    loadData();
  }, [tripId, selectTrip, loadSettlement]);

  // Auto-refresh settlement when expenses or members change
  useEffect(() => {
    if (expenses.length > 0 || members.length > 0) {
      loadSettlement(tripId);
    }
  }, [expenses.length, members.length, tripId, loadSettlement]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await selectTrip(tripId);
      await loadSettlement(tripId);
      toast.success('Settlement refreshed!');
    } catch (error) {
      toast.error(error.message || 'Failed to refresh settlement');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <section className="relative pb-32">
        <div className="mx-auto max-w-3xl px-4 pt-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand" />
              <p className="mt-3 text-sm text-slate-500">Loading settlement...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Back to trip"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Settlement Summary
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {currentTrip?.name || 'Trip'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Settlement Data */}
        <SettlementList settlement={settlement} members={members} expenses={expenses} />

        {/* AI Summary Section */}
        <AISummary tripId={tripId} />

        {/* Actions */}
        {settlement && settlement.ledger && settlement.ledger.length > 0 && (
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
            >
              <Share2 className="h-4 w-4" />
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


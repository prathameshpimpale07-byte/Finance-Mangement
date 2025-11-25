import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useTripStore from '../context/tripStore.js';
import PoolSummary from '../components/pool/PoolSummary.jsx';
import ContributionForm from '../components/pool/ContributionForm.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';
import BottomNav from '../components/layout/BottomNav.jsx';

const PoolManagement = () => {
  const { tripId } = useParams();
  const members = useTripStore((state) => state.members);
  const contributions = useTripStore((state) => state.contributions);
  const poolSummary = useTripStore((state) => state.poolSummary);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const getContributions = useTripStore((state) => state.getContributions);
  const addContribution = useTripStore((state) => state.addContribution);
  const deleteContribution = useTripStore((state) => state.deleteContribution);
  const loadPoolSummary = useTripStore((state) => state.loadPoolSummary);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    selectTrip(tripId);
    getContributions(tripId);
    loadPoolSummary(tripId);
  }, [tripId, selectTrip, getContributions, loadPoolSummary]);

  const handleAddContribution = async (payload) => {
    try {
      await addContribution(tripId, payload);
      toast.success('Contribution added successfully!');
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to add contribution. Please try again.');
    }
  };

  const handleDeleteContribution = async (contributionId, amount) => {
    if (
      window.confirm(
        `Delete contribution of ₹${amount}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteContribution(tripId, contributionId);
        toast.success('Contribution deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete contribution. Please try again.');
      }
    }
  };

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-4xl space-y-5 px-4 pt-4">
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
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Trip Pool Management
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage shared contributions and pool expenses
            </p>
          </div>
        </div>

        {/* Pool Summary */}
        <PoolSummary
          poolSummary={poolSummary}
          onAddContribution={() => setShowForm(true)}
        />

        {/* Contributions List */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              All Contributions
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" />
              Add Contribution
            </button>
          </div>

          {contributions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              No contributions yet. Add the first one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {contributions.map((contribution) => (
                <div
                  key={contribution._id}
                  className="group relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {contribution.member?.name || 'Unknown'}
                        </p>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {formatDate(contribution.date)}
                        {contribution.notes && ` • ${contribution.notes}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(contribution.amount)}
                      </p>
                      <button
                        onClick={() =>
                          handleDeleteContribution(
                            contribution._id,
                            contribution.amount
                          )
                        }
                        className="opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ContributionForm
          members={members}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddContribution}
        />
      )}

      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default PoolManagement;


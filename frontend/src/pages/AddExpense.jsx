import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseForm from '../components/expenses/ExpenseForm.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';
import useTripStore from '../context/tripStore.js';

const AddExpense = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const members = useTripStore((state) => state.members);
  const poolSummary = useTripStore((state) => state.poolSummary);
  const addExpense = useTripStore((state) => state.addExpense);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const loadPoolSummary = useTripStore((state) => state.loadPoolSummary);

  useEffect(() => {
    selectTrip(tripId);
    loadPoolSummary(tripId);
  }, [tripId, selectTrip, loadPoolSummary]);

  const handleSubmit = async (payload) => {
    try {
      await addExpense(tripId, payload);
      toast.success('Expense added successfully!');
      navigate(`/trips/${tripId}`);
    } catch (error) {
      toast.error(error.message || 'Failed to add expense. Please try again.');
    }
  };

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link
          to={`/trips/${tripId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to trip
        </Link>
        <ExpenseForm 
          members={members} 
          onSubmit={handleSubmit}
          poolBalance={poolSummary?.remainingBalance || 0}
        />
      </div>
      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default AddExpense;


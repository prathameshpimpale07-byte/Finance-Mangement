import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm.jsx';
import useTripStore from '../context/tripStore.js';

const AddExpense = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const members = useTripStore((state) => state.members);
  const addExpense = useTripStore((state) => state.addExpense);
  const selectTrip = useTripStore((state) => state.selectTrip);

  useEffect(() => {
    selectTrip(tripId);
  }, [tripId, selectTrip]);

  const handleSubmit = async (payload) => {
    await addExpense(tripId, payload);
    navigate(`/trips/${tripId}`);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-4">
      <ExpenseForm members={members} onSubmit={handleSubmit} />
    </section>
  );
};

export default AddExpense;


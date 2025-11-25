import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTripStore from '../context/tripStore.js';
import MemberList from '../components/members/MemberList.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';

const Members = () => {
  const { tripId } = useParams();
  const members = useTripStore((state) => state.members);
  const addMember = useTripStore((state) => state.addMember);
  const removeMember = useTripStore((state) => state.removeMember);
  const selectTrip = useTripStore((state) => state.selectTrip);
  const [form, setForm] = useState({ name: '', contact: '' });

  useEffect(() => {
    selectTrip(tripId);
  }, [tripId, selectTrip]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a member name');
      return;
    }
    try {
      await addMember(tripId, form);
      toast.success(`${form.name} added successfully!`);
      setForm({ name: '', contact: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to add member. Please try again.');
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeMember(tripId, memberId);
      toast.success('Member removed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove member. Please try again.');
    }
  };

  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-3xl space-y-5 px-4 pt-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-3xl bg-white p-5 shadow-lg dark:bg-slate-800"
        >
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Add member
          </h2>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            placeholder="Name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            placeholder="Phone or email"
            value={form.contact}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contact: event.target.value }))
            }
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand py-2 text-sm font-semibold text-white"
          >
            Add member
          </button>
        </form>

        <MemberList members={members} onRemove={handleRemove} />
      </div>

      <BottomNav basePath={`trips/${tripId}`} />
    </section>
  );
};

export default Members;


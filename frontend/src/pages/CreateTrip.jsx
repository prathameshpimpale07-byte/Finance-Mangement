import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTripStore from '../context/tripStore.js';

const CreateTrip = () => {
  const navigate = useNavigate();
  const createTrip = useTripStore((state) => state.createTrip);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [members, setMembers] = useState([{ name: '', contact: '' }]);
  const [loading, setLoading] = useState(false);

  const updateMember = (index, field, value) => {
    setMembers((prev) =>
      prev.map((member, idx) =>
        idx === index ? { ...member, [field]: value } : member
      )
    );
  };

  const addMemberField = () => {
    setMembers((prev) => [...prev, { name: '', contact: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a trip name');
      return;
    }
    setLoading(true);
    try {
      const filteredMembers = members.filter((member) => member.name.trim());
      const trip = await createTrip({
        name,
        startDate,
        members: filteredMembers,
      });
      toast.success('Trip created successfully!');
      navigate(`/trips/${trip._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create trip. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-800"
      >
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-white">
            Trip name
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            placeholder="Goa weekend"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-white">
            Start date
          </label>
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600 dark:text-white">
              Members
            </p>
            <button
              type="button"
              className="text-sm font-semibold text-brand"
              onClick={addMemberField}
            >
              + Add member
            </button>
          </div>
          {members.map((member, index) => (
            <div
              key={`member-${index}`}
              className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2 dark:border-slate-700 dark:bg-slate-900/40"
            >
              <input
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-600 dark:bg-slate-900"
                placeholder="Name"
                value={member.name}
                onChange={(event) =>
                  updateMember(index, 'name', event.target.value)
                }
              />
              <input
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-600 dark:bg-slate-900"
                placeholder="Phone or email"
                value={member.contact}
                onChange={(event) =>
                  updateMember(index, 'contact', event.target.value)
                }
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand py-3 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating trip...' : 'Create trip'}
        </button>
      </form>
    </section>
  );
};

export default CreateTrip;


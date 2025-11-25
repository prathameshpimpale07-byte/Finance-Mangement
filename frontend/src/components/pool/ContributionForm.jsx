import { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const ContributionForm = ({ members = [], onClose, onSubmit }) => {
  const defaultDate = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    memberId: members[0]?._id || '',
    amount: '',
    date: defaultDate,
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.memberId || !form.amount || Number(form.amount) <= 0) {
      return;
    }
    onSubmit({
      memberId: form.memberId,
      amount: Number(form.amount),
      date: form.date,
      notes: form.notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Add Contribution
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Member
            </label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              value={form.memberId}
              onChange={(e) => setForm((prev) => ({ ...prev, memberId: e.target.value }))}
              required
            >
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="E.g. 1000"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Date
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Notes (optional)
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="E.g. Initial contribution"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionForm;


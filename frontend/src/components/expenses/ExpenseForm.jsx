import { useMemo, useState } from 'react';
import { format } from 'date-fns';

const categories = ['Travel', 'Food', 'Stay', 'Shopping', 'Misc'];
const splitTypes = [
  { value: 'equal', label: 'Split equally' },
  { value: 'selected', label: 'Split among selected' },
  { value: 'percentage', label: 'Split by percentage' },
  { value: 'custom', label: 'Manual split' },
  { value: 'eachPaysOwn', label: 'Each person pays their own' },
];

const ExpenseForm = ({ members = [], initialValues = {}, onSubmit, poolBalance = 0 }) => {
  const defaultDate = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    description: initialValues.description || '',
    amount: initialValues.amount || '',
    amountPerPerson: initialValues.amountPerPerson || '',
    category: initialValues.category || 'Travel',
    date: initialValues.date
      ? format(new Date(initialValues.date), 'yyyy-MM-dd')
      : defaultDate,
    paidBy: initialValues.paidBy?._id || members[0]?._id || '',
    paymentSource: initialValues.paymentSource || 'member',
    splitType: initialValues.splitType || 'equal',
    selectedMembers:
      initialValues.splits?.map((split) => split.member?._id || split.member) ||
      members.map((member) => member._id),
    percentages:
      initialValues.splits?.map((split) => ({
        member: split.member?._id || split.member,
        percentage: split.percentage || 0,
      })) || [],
    customSplits:
      initialValues.splits?.map((split) => ({
        member: split.member?._id || split.member,
        amount: split.amount || 0,
      })) || [],
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleMemberToggle = (memberId) => {
    setForm((prev) => {
      const exists = prev.selectedMembers.includes(memberId);
      return {
        ...prev,
        selectedMembers: exists
          ? prev.selectedMembers.filter((id) => id !== memberId)
          : [...prev.selectedMembers, memberId],
      };
    });
  };

  const handlePercentageChange = (memberId, value) => {
    setForm((prev) => {
      const percentages = [...prev.percentages];
      const index = percentages.findIndex((entry) => entry.member === memberId);
      if (index >= 0) {
        percentages[index] = { member: memberId, percentage: Number(value) };
      } else {
        percentages.push({ member: memberId, percentage: Number(value) });
      }
      return { ...prev, percentages };
    });
  };

  const handleCustomSplitChange = (memberId, value) => {
    setForm((prev) => {
      const customSplits = [...prev.customSplits];
      const index = customSplits.findIndex((entry) => entry.member === memberId);
      if (index >= 0) {
        customSplits[index] = { member: memberId, amount: Number(value) };
      } else {
        customSplits.push({ member: memberId, amount: Number(value) });
      }
      return { ...prev, customSplits };
    });
  };

  const selectedMemberObjects = useMemo(
    () => members.filter((member) => form.selectedMembers.includes(member._id)),
    [members, form.selectedMembers]
  );

  const submitHandler = (event) => {
    event.preventDefault();
    if (!form.description?.trim()) {
      return;
    }
    if (form.splitType === 'eachPaysOwn') {
      if (!form.amountPerPerson || Number(form.amountPerPerson) <= 0) {
        return;
      }
    } else {
      if (!form.amount || Number(form.amount) <= 0) {
        return;
      }
    }
    if (form.paymentSource === 'member' && !form.paidBy) {
      return;
    }
    if (form.paymentSource === 'tripPool' && form.splitType === 'eachPaysOwn') {
      return; // Can't use pool for eachPaysOwn
    }

    const payload = {
      description: form.description,
      amount: form.splitType === 'eachPaysOwn' 
        ? Number(form.amountPerPerson) * members.length 
        : Number(form.amount),
      category: form.category,
      date: form.date,
      paidBy: form.paymentSource === 'tripPool' ? null : form.paidBy,
      paymentSource: form.paymentSource,
      splitType: form.splitType,
      amountPerPerson: form.splitType === 'eachPaysOwn' ? Number(form.amountPerPerson) : undefined,
      selectedMembers: form.splitType === 'selected' ? form.selectedMembers : [],
      percentages:
        form.splitType === 'percentage' ? form.percentages : undefined,
      customSplits:
        form.splitType === 'custom' ? form.customSplits : undefined,
    };

    onSubmit?.(payload);
  };

  return (
    <form
      className="space-y-4 rounded-3xl bg-white p-5 shadow-lg dark:bg-slate-800"
      onSubmit={submitHandler}
    >
      <div>
        <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
          Description
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="E.g. Bus ticket"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
            {form.splitType === 'eachPaysOwn' ? 'Amount per person (₹)' : 'Amount (₹)'}
          </label>
          <input
            type="number"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={form.splitType === 'eachPaysOwn' ? form.amountPerPerson : form.amount}
            onChange={(e) => {
              if (form.splitType === 'eachPaysOwn') {
                setForm((prev) => ({ ...prev, amountPerPerson: e.target.value }));
              } else {
                setForm((prev) => ({ ...prev, amount: e.target.value }));
              }
            }}
            placeholder={form.splitType === 'eachPaysOwn' ? 'E.g. 120' : ''}
          />
          {form.splitType === 'eachPaysOwn' && form.amountPerPerson && members.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              Total: ₹{Number(form.amountPerPerson) * members.length} ({members.length} members)
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
            When
          </label>
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={form.date}
            onChange={handleChange('date')}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Category
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={form.category}
            onChange={handleChange('category')}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Payment source
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={form.paymentSource}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, paymentSource: e.target.value }));
            }}
          >
            <option value="member">Paid by member</option>
            {poolBalance > 0 && (
              <option value="tripPool">From trip pool (₹{poolBalance.toFixed(2)} available)</option>
            )}
          </select>
        </div>
      </div>
      {form.paymentSource === 'member' && (
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Paid by
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            value={form.paidBy}
            onChange={handleChange('paidBy')}
          >
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {form.paymentSource === 'tripPool' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400">
          This expense will be paid from the shared trip pool. It won't affect individual member balances.
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
          Split method
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {splitTypes.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, splitType: option.value }))}
              className={`rounded-2xl border px-3 py-2 text-sm ${
                form.splitType === option.value
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-slate-200 text-slate-500 dark:border-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {form.splitType === 'selected' && (
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Choose members
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {members.map((member) => {
              const active = form.selectedMembers.includes(member._id);
              return (
                <button
                  type="button"
                  key={member._id}
                  onClick={() => handleMemberToggle(member._id)}
                  className={`rounded-2xl border px-3 py-2 text-sm ${
                    active
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200'
                  }`}
                >
                  {member.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {form.splitType === 'percentage' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Percentage per member
          </p>
          {members.map((member) => (
            <div key={member._id} className="flex items-center gap-3">
              <span className="w-28 text-sm text-slate-500 dark:text-slate-300">
                {member.name}
              </span>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                value={
                  form.percentages.find((entry) => entry.member === member._id)
                    ?.percentage || ''
                }
                onChange={(event) =>
                  handlePercentageChange(member._id, event.target.value)
                }
                placeholder="0"
              />
              <span className="text-sm text-slate-500 dark:text-slate-300">
                %
              </span>
            </div>
          ))}
        </div>
      )}

      {form.splitType === 'custom' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
            Amount per member
          </p>
          {members.map((member) => (
            <div key={member._id} className="flex items-center gap-3">
              <span className="w-28 text-sm text-slate-500 dark:text-slate-300">
                {member.name}
              </span>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                value={
                  form.customSplits.find((entry) => entry.member === member._id)
                    ?.amount || ''
                }
                onChange={(event) =>
                  handleCustomSplitChange(member._id, event.target.value)
                }
                placeholder="0"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-2xl bg-brand py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
      >
        Save expense
      </button>
    </form>
  );
};

export default ExpenseForm;


import { Trash2, Phone } from 'lucide-react';

const MemberList = ({ members = [], onRemove }) => (
  <div className="space-y-3">
    {members.map((member) => (
      <div
        key={member._id}
        className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {member.name}
          </p>
          {member.contact && (
            <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-300">
              <Phone size={14} /> {member.contact}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove?.(member._id)}
          className="rounded-full border border-red-200 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 dark:border-red-400/30 dark:bg-red-400/10"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ))}
  </div>
);

export default MemberList;


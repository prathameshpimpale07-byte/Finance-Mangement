import { Clock } from 'lucide-react';
import { formatDate } from '../../utils/format.js';

const ActivityTimeline = ({ activity = [] }) => {
  if (!activity.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No activity yet. Once you start adding expenses, updates will show up
        here.
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {activity.map((item, index) => (
        <li
          key={`${item.timestamp}-${index}`}
          className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={14} />
            {formatDate(item.timestamp)}
          </div>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            {item.message}
          </p>
        </li>
      ))}
    </ol>
  );
};

export default ActivityTimeline;


import { Link } from 'react-router-dom';
import { Sun, Moon, MapPin } from 'lucide-react';
import useDarkMode from '../../hooks/useDarkMode.js';

const TopBar = ({ title }) => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-50/80 px-4 py-3 backdrop-blur dark:bg-slate-900/80">
      <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
        <MapPin className="text-brand h-5 w-5" />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            TripSplit
          </p>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            {title || 'Smart trip expenses'}
          </h1>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setIsDark((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
};

export default TopBar;


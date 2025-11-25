import { NavLink } from 'react-router-dom';
import { Home, Users, Receipt, ListChecks } from 'lucide-react';

const navItems = [
  { to: '', label: 'Home', icon: Home },
  { to: 'expenses/new', label: 'Add', icon: Receipt },
  { to: 'members', label: 'Members', icon: Users },
  { to: 'settlement', label: 'Summary', icon: ListChecks },
];

const BottomNav = ({ basePath }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-md items-center justify-around rounded-t-3xl bg-white/90 px-4 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur dark:bg-slate-800/90">
    {navItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={`/${basePath}/${item.to}`.replace(/\/+/g, '/')}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium ${
              isActive
                ? 'text-brand'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <Icon size={20} className="mb-1" />
          {item.label}
        </NavLink>
      );
    })}
  </nav>
);

export default BottomNav;


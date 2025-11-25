import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Fab = ({ to }) => (
  <Link
    to={to}
    className="fixed bottom-20 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl transition hover:bg-brand-dark"
  >
    <Plus size={28} />
  </Link>
);

export default Fab;


import { Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/layout/TopBar.jsx';
import Home from './pages/Home.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import TripDashboard from './pages/TripDashboard.jsx';
import Members from './pages/Members.jsx';
import AddExpense from './pages/AddExpense.jsx';
import Settlement from './pages/Settlement.jsx';
import Timeline from './pages/Timeline.jsx';

const App = () => (
  <div className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-900">
    <TopBar title="TripSplit – Trip Expense Manager" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trips/new" element={<CreateTrip />} />
      <Route path="/trips/:tripId" element={<TripDashboard />} />
      <Route path="/trips/:tripId/members" element={<Members />} />
      <Route path="/trips/:tripId/expenses/new" element={<AddExpense />} />
      <Route path="/trips/:tripId/settlement" element={<Settlement />} />
      <Route path="/trips/:tripId/timeline" element={<Timeline />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

export default App;

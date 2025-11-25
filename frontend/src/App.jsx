import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TopBar from './components/layout/TopBar.jsx';
import Home from './pages/Home.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import TripDashboard from './pages/TripDashboard.jsx';
import Members from './pages/Members.jsx';
import AddExpense from './pages/AddExpense.jsx';
import Settlement from './pages/Settlement.jsx';
import Timeline from './pages/Timeline.jsx';
import PoolManagement from './pages/PoolManagement.jsx';

const App = () => (
  <div className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-900">
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1e293b',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
    <TopBar title="TripSplit – Trip Expense Manager" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trips/new" element={<CreateTrip />} />
      <Route path="/trips/:tripId" element={<TripDashboard />} />
      <Route path="/trips/:tripId/members" element={<Members />} />
      <Route path="/trips/:tripId/expenses/new" element={<AddExpense />} />
      <Route path="/trips/:tripId/settlement" element={<Settlement />} />
      <Route path="/trips/:tripId/timeline" element={<Timeline />} />
      <Route path="/trips/:tripId/pool" element={<PoolManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

export default App;

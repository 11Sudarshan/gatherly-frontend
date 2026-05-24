import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/reduxHooks';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // <-- Import the Navbar

// Real components
import Login from './features/auth/Login';
import Events from './features/events/events';
import BookingPage from './features/booking/BookingPage';
import PaymentPage from './features/payments/PaymentPage';
import ProfilePage from './features/profile/ProfilePage';
import FeedbackPage from './features/feedback/FeedbackPage';
import AdminDashboard from './features/admin/AdminDashbord';



const App: React.FC = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-on-background transition-colors duration-300 flex flex-col">
      <BrowserRouter>
        
        {/* The Navbar sits at the top of the entire app */}
        <Navbar />

        {/* The main content area takes up the remaining height */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes (Standard Users) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/events" element={<Events />} />
              <Route path="/book/:eventId" element={<BookingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/profile" element={<ProfilePage />} />            
              <Route path="/feedback/:ticketId" element={<FeedbackPage />} />
              {/* Add /venues, /bookings, etc. here later */}
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        
      </BrowserRouter>
    </div>
  );
};

export default App;
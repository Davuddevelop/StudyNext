import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddHomework from './pages/AddHomework';
import HomeworkList from './pages/HomeworkList';
import CalendarView from './pages/CalendarView';
import Settings from './pages/Settings';
import PricingPage from './pages/PricingPage';
import Reports from './pages/Reports';
import PasswordReset from './pages/PasswordReset';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Leaderboard from './pages/Leaderboard';
import { useReminders } from './hooks/useReminders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  // Activate Smart Reminders (Premium Only)
  useReminders();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<PasswordReset />} />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddHomework />} />
        <Route path="/list" element={<HomeworkList />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<PricingPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-cancel" element={<CheckoutCancel />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

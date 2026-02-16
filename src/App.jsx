import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing.jsx';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddHomework from './pages/AddHomework.jsx';
import HomeworkList from './pages/HomeworkList.jsx';
import CalendarView from './pages/CalendarView.jsx';
import Settings from './pages/Settings.jsx';
import PricingPage from './pages/PricingPage.jsx';
import Reports from './pages/Reports.jsx';
import PasswordReset from './pages/PasswordReset.jsx';
import CheckoutSuccess from './pages/CheckoutSuccess.jsx';
import CheckoutCancel from './pages/CheckoutCancel.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
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
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<PasswordReset />} />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddHomework />} />
        <Route path="/list" element={<HomeworkList />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<PricingPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-cancel" element={<CheckoutCancel />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

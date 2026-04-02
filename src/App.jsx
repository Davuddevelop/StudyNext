import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import WelcomeSplash from './components/WelcomeSplash.jsx';
import { useReminders } from './hooks/useReminders';

// Initialize crash reporting
import './services/crashReportingService';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AddHomework = lazy(() => import('./pages/AddHomework.jsx'));
const HomeworkList = lazy(() => import('./pages/HomeworkList.jsx'));
const CalendarView = lazy(() => import('./pages/CalendarView.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx'));
const Reports = lazy(() => import('./pages/Reports.jsx'));
const PasswordReset = lazy(() => import('./pages/PasswordReset.jsx'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess.jsx'));
const CheckoutCancel = lazy(() => import('./pages/CheckoutCancel.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const AddExam = lazy(() => import('./pages/AddExam.jsx'));
const ExamList = lazy(() => import('./pages/ExamList.jsx'));


// Loading fallback component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <AppContent />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  // Activate Smart Reminders (Premium Only)
  useReminders();
  const { currentUser } = useAuth();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash once per session when user is logged in
    if (currentUser && !sessionStorage.getItem('splashShown')) {
      setShowSplash(true);
    }
  }, [currentUser]);

  function handleSplashComplete() {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  }

  return (
    <>
      {showSplash && (
        <WelcomeSplash
          onComplete={handleSplashComplete}
          userName={currentUser?.displayName?.split(' ')[0]}
        />
      )}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

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
            <Route path="/exams" element={<ExamList />} />
            <Route path="/add-exam" element={<AddExam />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

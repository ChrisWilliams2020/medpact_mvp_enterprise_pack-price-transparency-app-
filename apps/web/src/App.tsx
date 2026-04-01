import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PracticeLanding from './pages/PracticeLanding';
import MedTechLanding from './pages/MedTechLanding';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeeSchedule from './pages/FeeSchedule';
import Metrics from './pages/Metrics';
import Settings from './pages/Settings';

// Auth check
const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Home - Product Selection */}
        <Route path="/" element={<Home />} />
        
        {/* Practice Intelligence (v3.4) */}
        <Route path="/practice" element={<PracticeLanding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fee-schedule" element={<FeeSchedule />} />
        
        {/* Medical Tech (v3.5) */}
        <Route path="/medtech" element={<MedTechLanding />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/metrics" element={
          <ProtectedRoute>
            <Metrics />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
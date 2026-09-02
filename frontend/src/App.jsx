import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AccessibilityBar from './components/AccessibilityBar';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Assessment from './pages/Assessment';
import AIAnalysis from './pages/AIAnalysis';
import CognitivePathPage from './pages/CognitivePathPage';
import ProgressPage from './pages/ProgressPage';
import MemoryGardenPage from './pages/MemoryGardenPage';
import CaregiverDashboard from './pages/CaregiverDashboard';
import CaregiverUserDetails from './pages/CaregiverUserDetails';

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      <AccessibilityBar />
      <Navbar />

      {isAuthPage ? (
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      ) : (
        <div className="main-content-layout">
          <Sidebar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/analysis" element={<AIAnalysis />} />
              <Route path="/path" element={<CognitivePathPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/garden" element={<MemoryGardenPage />} />
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/caregiver/user/:userId" element={<CaregiverUserDetails />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;

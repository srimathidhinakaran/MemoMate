import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AccessibilityBar from './components/AccessibilityBar';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VoiceAssistantModal from './components/VoiceAssistantModal';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import MyDayPage from './pages/MyDayPage';
import MyPeoplePage from './pages/MyPeoplePage';
import LeaderboardPage from './pages/LeaderboardPage';
import Assessment from './pages/Assessment';
import NERCulturalGame from './games/NERCulturalGame';
import AIAnalysis from './pages/AIAnalysis';
import CognitivePathPage from './pages/CognitivePathPage';
import ProgressPage from './pages/ProgressPage';
import MemoryGardenPage from './pages/MemoryGardenPage';
import CaregiverDashboard from './pages/CaregiverDashboard';
import CaregiverUserDetails from './pages/CaregiverUserDetails';

const App = () => {
  const { user, isVoiceModalOpen, setVoiceModalOpen } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Enforce auth requirement: if user is not logged in, force navigation to /login
  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <AccessibilityBar />
      <Navbar />

      {/* Global Voice Assistant Modal Overlay */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

      {isAuthPage || !user ? (
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          width: '100%',
          minHeight: 'calc(100vh - 100px)',
          padding: '2rem 1rem'
        }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </main>
      ) : (
        <div className="main-content-layout">
          <Sidebar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/my-day" element={<MyDayPage />} />
              <Route path="/my-people" element={<MyPeoplePage />} />
              <Route path="/cultural-game" element={<NERCulturalGame />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
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

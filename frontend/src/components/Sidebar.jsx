import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { LayoutDashboard, Gamepad2, Trophy, Sparkles, GitCommit, LineChart, Cpu, HeartHandshake, Brain, ExternalLink, Globe } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText, t, externalGamificationUrl } = useAuth();

  const handleNav = (label) => {
    soundFx.playClick();
    if (voiceAssistance) {
      speakText(`Opening ${label}`);
    }
  };

  const handleExternalLaunch = () => {
    soundFx.playLevelUp();
    if (voiceAssistance) {
      speakText("Launching External Gamification App");
    }
    window.open(externalGamificationUrl, '_blank', 'noopener,noreferrer');
  };

  const navItems = [
    { path: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { path: '/leaderboard', label: t('navLeaderboard'), icon: Trophy },
    { path: '/assessment', label: t('navExercises'), icon: Gamepad2 },
    { path: '/analysis', label: t('navTelemetry'), icon: Sparkles },
    { path: '/path', label: t('navPath'), icon: GitCommit },
    { path: '/progress', label: t('navMetrics'), icon: LineChart },
    { path: '/garden', label: t('navGarden'), icon: Cpu },
    { path: '/caregiver', label: t('navCaregiver'), icon: HeartHandshake }
  ];

  return (
    <aside style={{
      width: 270,
      backgroundColor: '#121721',
      borderRadius: '16px',
      padding: '1.25rem 0.85rem',
      border: '1px solid #263142',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      height: 'fit-content'
    }}>
      <div style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {t('navMenu') || 'NAVIGATION MENU'}
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => handleNav(item.label)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-heading)',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <Icon size={20} color="#38BDF8" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* External Gamification Web App Launcher */}
      <button
        onClick={handleExternalLaunch}
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '0.85rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-heading)',
          color: '#38BDF8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          cursor: 'pointer',
          marginTop: '0.5rem',
          transition: 'all 0.15s ease'
        }}
        title="Open External Gamification Web App"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Globe size={20} color="#38BDF8" />
          <span>{t('navExternalGamification') || 'Gamification Hub'}</span>
        </div>
        <ExternalLink size={16} color="#38BDF8" />
      </button>

      <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '12px', border: '1px solid #263142' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)' }}>
          <Brain size={16} color="#38BDF8" />
          <span>{t('cognitiveCare') || 'COGNITIVE CARE'}</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.3rem', lineHeight: 1.4 }}>
          {t('sidebarTip') || 'Complete daily exercises to maintain your streak & unlock Mind Matrix rewards.'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { LayoutDashboard, Gamepad2, Calendar, Users, Flower2, Mic, HeartHandshake, Trophy, Sparkles, LineChart, Brain, ExternalLink, Globe } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText, t, externalGamificationUrl, setVoiceModalOpen } = useAuth();

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
    { path: '/dashboard', label: t('navHome') || 'Home', icon: LayoutDashboard },
    { path: '/assessment', label: t('navPlay') || 'Play', icon: Gamepad2 },
    { path: '/my-day', label: t('navMyDay') || 'My Day', icon: Calendar },
    { path: '/my-people', label: t('navMyMemories') || 'My Memories', icon: Users },
    { path: '/garden', label: t('navGarden') || 'Memory Garden', icon: Flower2 },
    { path: '/caregiver', label: t('navCaregiver') || 'Caregiver Portal', icon: HeartHandshake },
    { path: '/leaderboard', label: t('navLeaderboard') || 'Leaderboard', icon: Trophy },
    { path: '/progress', label: t('navMetrics') || 'Metrics & Trends', icon: LineChart }
  ];

  return (
    <aside style={{
      width: 270,
      flexShrink: 0,
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

      {/* Talk to MemoMate Voice Assistant Trigger */}
      <button
        onClick={() => {
          soundFx.playClick();
          setVoiceModalOpen(true);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-heading)',
          color: '#34D399',
          backgroundColor: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          cursor: 'pointer',
          marginTop: '0.3rem',
          transition: 'all 0.15s ease'
        }}
      >
        <Mic size={20} color="#34D399" />
        <span>{t('talkToMemoMate') || 'Talk to MemoMate'}</span>
      </button>

      {/* Gamification Hub Route Launcher */}
      <NavLink
        to="/gamification-hub"
        onClick={() => handleNav(t('navExternalGamification') || 'Gamification Hub')}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '0.85rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-heading)',
          color: isActive ? '#FFFFFF' : '#38BDF8',
          backgroundColor: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          marginTop: '0.5rem',
          transition: 'all 0.15s ease'
        })}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Globe size={20} color="#F59E0B" />
          <span>{t('navExternalGamification') || 'Gamification Hub'}</span>
        </div>
        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid #F59E0B', fontWeight: 800 }}>SOON</span>
      </NavLink>

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

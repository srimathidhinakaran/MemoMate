import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { LayoutDashboard, Gamepad2, Trophy, Sparkles, GitCommit, LineChart, Cpu, HeartHandshake, Brain } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText, t } = useAuth();

  const handleNav = (label) => {
    soundFx.playClick();
    if (voiceAssistance) {
      speakText(`Opening ${label}`);
    }
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
        NAVIGATION MENU
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

      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '12px', border: '1px solid #263142' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)' }}>
          <Brain size={16} color="#38BDF8" />
          <span>COGNITIVE CARE</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.3rem', lineHeight: 1.4 }}>
          Complete daily exercises to maintain your streak & unlock Mind Matrix rewards.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

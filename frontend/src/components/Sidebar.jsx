import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { LayoutDashboard, Gamepad2, Trophy, Sparkles, GitCommit, LineChart, Trees, HeartHandshake, Brain } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText } = useAuth();

  const handleNav = (label) => {
    soundFx.playClick();
    if (voiceAssistance) {
      speakText(`Opening ${label}`);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/assessment', label: 'Cognitive Exercises', icon: Gamepad2 },
    { path: '/analysis', label: 'AI Health Telemetry', icon: Sparkles },
    { path: '/path', label: 'Cognitive Path', icon: GitCommit },
    { path: '/progress', label: 'Metrics & Trends', icon: LineChart },
    { path: '/garden', label: '3D Memory Garden', icon: Trees },
    { path: '/caregiver', label: 'Caregiver Portal', icon: HeartHandshake }
  ];

  return (
    <aside style={{
      width: 270,
      backgroundColor: '#161B22',
      borderRadius: '16px',
      padding: '1.25rem 0.85rem',
      border: '1px solid #30363D',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
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
              color: isActive ? '#FFFFFF' : '#9198A1',
              backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={20} color="#38BDF8" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#0D1117', borderRadius: '12px', border: '1px solid #30363D' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)' }}>
          <Brain size={16} color="#38BDF8" />
          <span>COGNITIVE CARE</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#9198A1', marginTop: '0.3rem', lineHeight: 1.4 }}>
          Complete daily exercises to maintain your streak & unlock 3D memory garden rewards.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

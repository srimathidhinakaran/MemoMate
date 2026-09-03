import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { LayoutDashboard, Gamepad2, Trophy, Sparkles, GitCommit, LineChart, Trees, HeartHandshake, Swords } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText } = useAuth();

  const handleNav = (label) => {
    soundFx.playClick();
    if (voiceAssistance) {
      speakText(`Opening ${label}`);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Arena Dashboard', icon: LayoutDashboard },
    { path: '/leaderboard', label: 'League Podium 🏆', icon: Trophy },
    { path: '/assessment', label: 'Cognitive Missions', icon: Gamepad2 },
    { path: '/analysis', label: 'Groq AI Analysis', icon: Sparkles },
    { path: '/path', label: 'Battle Roadmap', icon: GitCommit },
    { path: '/progress', label: 'Metrics & Trends', icon: LineChart },
    { path: '/garden', label: '3D Memory Garden', icon: Trees },
    { path: '/caregiver', label: 'Caregiver Portal', icon: HeartHandshake }
  ];

  return (
    <aside style={{
      width: 270,
      backgroundColor: 'rgba(15, 20, 36, 0.92)',
      backdropFilter: 'blur(16px)',
      borderRadius: '20px',
      padding: '1.25rem 0.85rem',
      border: '1px solid rgba(0, 242, 254, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      height: 'fit-content'
    }}>
      <div style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#00F2FE', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        NAVIGATION HUD
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
              borderRadius: '14px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-heading)',
              color: isActive ? '#050B14' : '#94A3B8',
              background: isActive ? 'linear-gradient(135deg, #00F2FE 0%, #00A3C4 100%)' : 'transparent',
              border: isActive ? 'none' : '1px solid transparent',
              boxShadow: isActive ? '0 0 20px rgba(0, 242, 254, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0, 242, 254, 0.06)', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-esports)' }}>
          <Swords size={16} color="#FFD700" />
          <span>COGNITIVE ARENA</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.3rem', lineHeight: 1.4 }}>
          Complete daily missions to maintain your streak & unlock Battle Pass rewards.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

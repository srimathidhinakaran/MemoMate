import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Gamepad2, Sparkles, GitCommit, LineChart, Trees, HeartHandshake, Sprout } from 'lucide-react';

const Sidebar = () => {
  const { voiceAssistance, speakText } = useAuth();

  const handleNav = (label) => {
    if (voiceAssistance) {
      speakText(`Opening ${label}`);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { path: '/assessment', label: 'Cognitive Activities', icon: Gamepad2 },
    { path: '/analysis', label: 'AI Performance Analysis', icon: Sparkles },
    { path: '/path', label: 'Personalized Path', icon: GitCommit },
    { path: '/progress', label: 'Progress & Trends', icon: LineChart },
    { path: '/garden', label: 'Memory Garden', icon: Trees },
    { path: '/caregiver', label: 'Caregiver Dashboard', icon: HeartHandshake }
  ];

  return (
    <aside style={{
      width: 260,
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: '1.25rem 0.85rem',
      border: '1px solid #E6E0D4',
      boxShadow: '0 10px 30px rgba(28, 59, 43, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, color: '#7E9687', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Navigation
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
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.98rem',
              color: isActive ? '#FFFFFF' : '#1C3B2B',
              backgroundColor: isActive ? '#58755E' : 'transparent',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 12px rgba(88, 117, 94, 0.3)' : 'none'
            })}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#F7F4EE', borderRadius: '16px', border: '1px solid #E6E0D4' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C3B2B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sprout size={16} color="#58755E" />
          <span>Memory Garden</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#536B5C', marginTop: '0.2rem' }}>
          Completed sessions support your cognitive path and garden progress.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

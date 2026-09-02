import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, UserCheck, LogOut, ShieldCheck, Award, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout, speakText, voiceAssistance, xpPoints, level, levelTitle, recentScoreToast } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (text) => {
    if (voiceAssistance) {
      speakText(text);
    }
  };

  const toggleRole = () => {
    if (user?.role === 'caregiver') {
      navigate('/dashboard');
    } else {
      navigate('/caregiver');
    }
  };

  return (
    <>
      <nav style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E6E0D4',
        padding: '0.9rem 2rem',
        boxShadow: '0 4px 20px rgba(28, 59, 43, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          {/* Brand Logo & Tagline */}
          <Link to={user?.role === 'caregiver' ? '/caregiver' : '/dashboard'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#EBF2EC',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <Sprout size={26} color="#58755E" />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C3B2B', letterSpacing: '-0.5px' }}>
                MemoMate
              </div>
              <div style={{ fontSize: '0.8rem', color: '#536B5C', fontWeight: 500 }}>
                Cognitive Gaming & Memory Assistance Platform
              </div>
            </div>
          </Link>

          {/* User Info & Gamification Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user && user.role === 'elderly' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FDF3F0',
                padding: '0.4rem 0.85rem',
                borderRadius: 9999,
                border: '1px solid #F4C3B2',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#C87862'
              }}>
                <Award size={16} />
                <span>Level {level}: {levelTitle} ({xpPoints} XP)</span>
              </div>
            )}

            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#F7F4EE',
                padding: '0.45rem 1rem',
                borderRadius: 9999,
                border: '1px solid #E6E0D4'
              }}>
                <UserCheck size={18} color="#58755E" />
                <span style={{ fontWeight: 600, color: '#1C3B2B' }}>
                  {user.name} ({user.age} yrs)
                </span>
                <span className={`badge ${user.role === 'caregiver' ? 'badge-lavender' : 'badge-sage'}`}>
                  {user.role === 'caregiver' ? 'Caregiver' : 'Patient'}
                </span>
              </div>
            )}

            {/* Quick Role Switch for Hackathon Demonstration */}
            <button
              onClick={() => {
                toggleRole();
                handleNavClick('Switching view');
              }}
              className="btn-secondary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <ShieldCheck size={16} />
              <span>{user?.role === 'caregiver' ? 'Patient View' : 'Caregiver View'}</span>
            </button>

            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#C87862',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  padding: '0.5rem'
                }}
                title="Log out"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Dynamic Score Toast Alert */}
      {recentScoreToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#FFFFFF',
          border: '2px solid #7C9A82',
          borderRadius: '20px',
          padding: '1.1rem 1.4rem',
          boxShadow: '0 15px 35px rgba(28, 59, 43, 0.2)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#EBF2EC',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={24} color="#58755E" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#1C3B2B', fontSize: '1.05rem' }}>
              Cognitive Profile Updated
            </div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>
              {recentScoreToast.activity}: <strong>+{recentScoreToast.score} pts</strong> | <strong>+{recentScoreToast.xp} XP</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

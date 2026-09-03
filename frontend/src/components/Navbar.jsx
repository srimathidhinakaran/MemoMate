import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Brain, UserCheck, LogOut, ShieldCheck, Award, Sparkles, Flame, Gem, Trophy, Volume2, VolumeX } from 'lucide-react';

const Navbar = () => {
  const { user, logout, speakText, voiceAssistance, xpPoints, level, streak, gems, recentScoreToast } = useAuth();
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  const handleNavClick = (text) => {
    soundFx.playClick();
    if (voiceAssistance) {
      speakText(text);
    }
  };

  const toggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
    if (newState) soundFx.playClick();
  };

  const toggleRole = () => {
    soundFx.playClick();
    if (user?.role === 'caregiver') {
      navigate('/dashboard');
    } else {
      navigate('/caregiver');
    }
  };

  return (
    <>
      <nav style={{
        backgroundColor: '#161B22',
        borderBottom: '1px solid #30363D',
        padding: '0.8rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          {/* Professional Brand Logo & Tagline */}
          <Link 
            to={user?.role === 'caregiver' ? '/caregiver' : '/dashboard'} 
            onClick={() => handleNavClick('Home')}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <div className="icon-box" style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)'
            }}>
              <Brain size={26} color="#38BDF8" />
            </div>
            <div>
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: 900, 
                fontFamily: 'var(--font-heading)', 
                color: '#FFFFFF', 
                letterSpacing: '-0.01em'
              }}>
                MemoMate
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9198A1', fontWeight: 600 }}>
                Cognitive Health & Memory Platform
              </div>
            </div>
          </Link>

          {/* User Info & Currency Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user && user.role === 'elderly' && (
              <>
                {/* Streak Flame */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(251, 146, 60, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 146, 60, 0.35)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#FB923C'
                }}>
                  <Flame size={18} fill="#FB923C" />
                  <span>{streak || 1} DAYS</span>
                </div>

                {/* Gems */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#38BDF8'
                }}>
                  <Gem size={18} fill="#38BDF8" />
                  <span>{gems || 100} PTS</span>
                </div>

                {/* Level & XP */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#FBBF24'
                }}>
                  <Award size={18} color="#FBBF24" />
                  <span>LVL {level} ({xpPoints} XP)</span>
                </div>

                {/* Quick Leaderboard Link */}
                <Link
                  to="/leaderboard"
                  onClick={() => handleNavClick('Leaderboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(52, 211, 153, 0.12)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-esports)',
                    color: '#34D399',
                    textDecoration: 'none'
                  }}
                >
                  <Trophy size={18} />
                  <span>RANK #3</span>
                </Link>
              </>
            )}

            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleSound}
              style={{
                background: soundEnabled ? 'rgba(56, 189, 248, 0.15)' : '#21262D',
                border: soundEnabled ? '1px solid #38BDF8' : '1px solid #30363D',
                color: soundEnabled ? '#38BDF8' : '#9198A1',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
              title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#21262D',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #30363D'
              }}>
                <UserCheck size={18} color="#38BDF8" />
                <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                  {user.name} ({user.age} yrs)
                </span>
                <span className={`badge ${user.role === 'caregiver' ? 'badge-purple' : 'badge-cyan'}`}>
                  {user.role === 'caregiver' ? 'Caregiver' : 'Patient'}
                </span>
              </div>
            )}

            {/* Quick Role Switch Button */}
            <button
              onClick={toggleRole}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={16} />
              <span>{user?.role === 'caregiver' ? 'Patient View' : 'Caregiver View'}</span>
            </button>

            {user && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  logout();
                  navigate('/login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FB923C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
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
          backgroundColor: '#161B22',
          border: '1px solid #38BDF8',
          borderRadius: '14px',
          padding: '1.1rem 1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={24} color="#38BDF8" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>
              EXERCISE COMPLETED!
            </div>
            <div style={{ fontSize: '0.88rem', color: '#9198A1', fontWeight: 600 }}>
              {recentScoreToast.activity}: <strong style={{ color: '#38BDF8' }}>+{recentScoreToast.score} PTS</strong> | <strong style={{ color: '#FBBF24' }}>+{recentScoreToast.xp} XP</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

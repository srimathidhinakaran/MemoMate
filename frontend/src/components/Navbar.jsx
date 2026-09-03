import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Sprout, UserCheck, LogOut, ShieldCheck, Award, Sparkles, Flame, Gem, Trophy, Volume2, VolumeX, Swords } from 'lucide-react';

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
        backgroundColor: 'rgba(9, 12, 21, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
        padding: '0.8rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Esports Brand Logo & Tagline */}
          <Link 
            to={user?.role === 'caregiver' ? '/caregiver' : '/dashboard'} 
            onClick={() => handleNavClick('Home')}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.5)',
              transform: 'rotate(-5deg)'
            }}>
              <Swords size={26} color="#050B14" />
            </div>
            <div>
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: 900, 
                fontFamily: 'var(--font-esports)', 
                color: '#F8FAFC', 
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #00F2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                MemoMate
              </div>
              <div style={{ fontSize: '0.75rem', color: '#00F2FE', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cognitive Arena • Season 1
              </div>
            </div>
          </Link>

          {/* User Info & Battle Pass Currency Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user && user.role === 'elderly' && (
              <>
                {/* Streak Flame */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(255, 78, 80, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 78, 80, 0.4)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#FF4E50',
                  boxShadow: '0 0 12px rgba(255, 78, 80, 0.3)'
                }}>
                  <Flame size={18} fill="#FF4E50" />
                  <span>{streak || 5} DAYS</span>
                </div>

                {/* Gems */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(0, 242, 254, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#00F2FE',
                  boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)'
                }}>
                  <Gem size={18} fill="#00F2FE" />
                  <span>{gems || 140}</span>
                </div>

                {/* Level & XP */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(255, 215, 0, 0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  color: '#FFD700',
                  boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)'
                }}>
                  <Award size={18} color="#FFD700" />
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
                    backgroundColor: 'rgba(0, 230, 118, 0.12)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 230, 118, 0.4)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-esports)',
                    color: '#00E676',
                    textDecoration: 'none',
                    boxShadow: '0 0 12px rgba(0, 230, 118, 0.3)'
                  }}
                >
                  <Trophy size={18} />
                  <span>EMERALD #3</span>
                </Link>
              </>
            )}

            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleSound}
              style={{
                background: soundEnabled ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: soundEnabled ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.2)',
                color: soundEnabled ? '#00F2FE' : '#64748B',
                borderRadius: '10px',
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
              <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <UserCheck size={18} color="#00F2FE" />
                <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.9rem' }}>
                  {user.name} ({user.age} yrs)
                </span>
                <span className={`badge ${user.role === 'caregiver' ? 'badge-purple' : 'badge-cyan'}`}>
                  {user.role === 'caregiver' ? 'Caregiver' : 'Hero Player'}
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
                  color: '#FF4E50',
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

      {/* Dynamic Gaming Score Toast Alert */}
      {recentScoreToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#0F1424',
          border: '2px solid #00F2FE',
          borderRadius: '16px',
          padding: '1.2rem 1.6rem',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.4)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #FFD700 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={26} color="#050B14" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '1.05rem', fontFamily: 'var(--font-esports)' }}>
              MISSION VICTORY!
            </div>
            <div style={{ fontSize: '0.9rem', color: '#00F2FE', fontWeight: 600 }}>
              {recentScoreToast.activity}: <strong style={{ color: '#FFD700' }}>+{recentScoreToast.score} PTS</strong> | <strong style={{ color: '#FF4E50' }}>+{recentScoreToast.xp} XP</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

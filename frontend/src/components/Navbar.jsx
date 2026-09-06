import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Brain, UserCheck, LogOut, ShieldCheck, Award, Sparkles, Flame, Gem, Trophy, Volume2, VolumeX, Mic, Wifi, WifiOff } from 'lucide-react';

const Navbar = () => {
  const { user, logout, speakText, voiceAssistance, xpPoints, level, streak, gems, recentScoreToast, t, networkStatus, setVoiceModalOpen } = useAuth();
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
        backgroundColor: '#121721',
        borderBottom: '1px solid #263142',
        padding: '0.75rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand Logo Container Fitted Perfectly */}
          <Link 
            to={user?.role === 'caregiver' ? '/caregiver' : '/dashboard'} 
            onClick={() => handleNavClick('Home')}
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <div className="icon-box" style={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={24} color="#38BDF8" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                fontSize: '1.35rem', 
                fontWeight: 900, 
                fontFamily: 'var(--font-heading)', 
                color: '#FFFFFF', 
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                MemoMate
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                {t('dementiaSubtitle')}
              </div>
            </div>
          </Link>

          {/* User Info & Dynamic Currency Status */}
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
                  fontFamily: 'var(--font-heading)',
                  color: '#FB923C'
                }}>
                  <Flame size={18} fill="#FB923C" />
                  <span>{streak || 0} {t('streak').toUpperCase()}</span>
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
                  fontFamily: 'var(--font-heading)',
                  color: '#38BDF8'
                }}>
                  <Gem size={18} fill="#38BDF8" />
                  <span>{gems || 10} PTS</span>
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
                  fontFamily: 'var(--font-heading)',
                  color: '#FBBF24'
                }}>
                  <Award size={18} color="#FBBF24" />
                  <span>{t('level').toUpperCase()} {level} ({xpPoints} XP)</span>
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
                    fontFamily: 'var(--font-heading)',
                    color: '#34D399',
                    textDecoration: 'none'
                  }}
                >
                  <Trophy size={18} />
                  <span>{t('rank').toUpperCase()} #1</span>
                </Link>
              </>
            )}

            {/* Talk to MemoMate Prominent Voice Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setVoiceModalOpen(true);
              }}
              className="btn-primary"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38BDF8',
                color: '#38BDF8'
              }}
            >
              <Mic size={16} color="#38BDF8" />
              <span>{t('talkToMemoMate') || 'Talk to MemoMate'}</span>
            </button>

            {/* Offline / Online Network Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: networkStatus === 'ONLINE' ? 'rgba(52, 211, 153, 0.12)' : (networkStatus === 'SYNCING' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(251, 191, 36, 0.12)'),
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: networkStatus === 'ONLINE' ? '1px solid rgba(52, 211, 153, 0.35)' : (networkStatus === 'SYNCING' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(251, 191, 36, 0.35)'),
              fontSize: '0.8rem',
              fontWeight: 800,
              color: networkStatus === 'ONLINE' ? '#34D399' : (networkStatus === 'SYNCING' ? '#38BDF8' : '#FBBF24')
            }}>
              {networkStatus === 'ONLINE' ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{t(`offlineStatus${networkStatus.charAt(0) + networkStatus.slice(1).toLowerCase()}`) || networkStatus}</span>
            </div>

            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleSound}
              style={{
                background: soundEnabled ? 'rgba(56, 189, 248, 0.15)' : '#161C26',
                border: soundEnabled ? '1px solid #38BDF8' : '1px solid #263142',
                color: soundEnabled ? '#38BDF8' : '#94A3B8',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
              title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>{soundEnabled ? t('audioOn') : t('audioOff')}</span>
            </button>

            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#161C26',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #263142'
              }}>
                <UserCheck size={18} color="#38BDF8" />
                <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                  {user.name} ({user.age} {t('ageSuffix') || 'yrs'})
                </span>
                <span className={`badge ${user.role === 'caregiver' ? 'badge-purple' : 'badge-cyan'}`}>
                  {user.role === 'caregiver' ? 'Caregiver' : (t('patientRole') || 'Patient')}
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
              <span>{user?.role === 'caregiver' ? t('patientView') : t('caregiverView')}</span>
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.5rem'
                }}
                title="Log out"
              >
                <LogOut size={18} />
                <span>{t('logout')}</span>
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
          backgroundColor: '#161C26',
          border: '1px solid #38BDF8',
          borderRadius: '14px',
          padding: '1.1rem 1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div className="icon-box" style={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={24} color="#38BDF8" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
              EXERCISE COMPLETED!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
              {recentScoreToast.activity}: <strong style={{ color: '#38BDF8' }}>+{recentScoreToast.score} PTS</strong> | <strong style={{ color: '#FBBF24' }}>+{recentScoreToast.xp} XP</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

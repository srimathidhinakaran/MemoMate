import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { ExternalLink, Gamepad2, Globe, Settings, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

const ExternalGamificationCard = () => {
  const { externalGamificationUrl, updateExternalGamificationUrl, t, voiceAssistance, speakText } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(externalGamificationUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLaunch = () => {
    soundFx.playLevelUp();
    if (voiceAssistance) {
      speakText("Launching External Gamification App");
    }
    window.open(externalGamificationUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    soundFx.playClick();
    if (tempUrl.trim()) {
      updateExternalGamificationUrl(tempUrl.trim());
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="garden-card animate-fade-in" style={{
      background: 'linear-gradient(135deg, #131B2E 0%, #1A243B 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(56, 189, 248, 0.4)',
      padding: '1.75rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)'
    }}>
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="icon-box" style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gamepad2 size={26} color="#38BDF8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('externalGamificationTag') || 'DEDICATED GAMIFICATION HUB 🌐'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Zap size={14} fill="#34D399" /> LIVE SYNC
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0 0' }}>
                {t('externalGamificationTitle') || 'External Cognitive Gamification Portal'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setIsEditing(!isEditing);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94A3B8',
              borderRadius: '10px',
              padding: '0.5rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <Settings size={15} />
            <span>{isEditing ? 'Cancel' : (t('configurePortal') || 'Configure Link')}</span>
          </button>
        </div>

        {/* Subtitle & Description */}
        <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem', maxWidth: '780px' }}>
          {t('externalGamificationDesc') || 'Seamlessly launch our external Gamification web application for multiplayer brain battles, extended Duolingo-style quests, and interactive 3D challenges linked directly to your MemoMate profile.'}
        </p>

        {/* Saved Success Notification */}
        {savedSuccess && (
          <div style={{
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: '#6EE7B7',
            padding: '0.7rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>External Gamification URL updated successfully!</span>
          </div>
        )}

        {/* Editable URL Form */}
        {isEditing ? (
          <form onSubmit={handleSaveUrl} style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <label style={{ fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe size={16} color="#38BDF8" />
              <span>External Gamification Web App URL</span>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://memomate-gamification.vercel.app"
                required
                style={{
                  flex: 1,
                  minWidth: 260,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
              >
                Save URL
              </button>
            </div>
          </form>
        ) : null}

        {/* Launch Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1rem 1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#34D399',
              boxShadow: '0 0 10px #34D399'
            }} />
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
              Destination: <span style={{ color: '#38BDF8', fontWeight: 700, fontFamily: 'monospace' }}>{externalGamificationUrl}</span>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            className="btn-primary"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <Sparkles size={18} />
            <span>{t('launchGamificationBtn') || 'OPEN EXTERNAL GAMIFICATION APP 🚀'}</span>
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalGamificationCard;

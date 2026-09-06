import React from 'react';
import { Sparkles, Gem, X, Trophy } from 'lucide-react';

const RewardUnlockModal = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 99999,
      padding: '1.5rem'
    }}>
      <div className="animate-scale-up" style={{
        backgroundColor: 'var(--bg-card, #161C26)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        maxWidth: '460px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 50px rgba(251, 191, 36, 0.3), 0 25px 60px rgba(0, 0, 0, 0.95)',
        border: '2px solid var(--battle-gold, #FBBF24)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Top Radial Glow */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(56, 189, 248, 0) 70%)',
          pointerEvents: 'none',
          borderRadius: '50%'
        }} />

        <button
          onClick={onClose}
          aria-label="Close Level Up Notification"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Level Up Animated Icon */}
        <div style={{
          width: 88,
          height: 88,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(56, 189, 248, 0.25))',
          border: '2px solid #FBBF24',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0.5rem auto 1.25rem',
          fontSize: '3rem',
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)',
          position: 'relative'
        }}>
          {reward.icon || '⚡'}
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: '#FBBF24',
          color: '#0B0E14',
          fontWeight: 900,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.4rem 1rem',
          borderRadius: '30px',
          marginBottom: '0.8rem',
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
        }}>
          <Trophy size={14} /> LEVEL UP CELEBRATION
        </div>

        <h2 style={{
          fontSize: '2rem',
          color: '#FFFFFF',
          fontWeight: 900,
          margin: '0.4rem 0 0.6rem',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {reward.title || 'Level Up!'}
        </h2>

        <p style={{
          color: '#E2E8F0',
          fontSize: '0.98rem',
          lineHeight: 1.6,
          marginBottom: '1.75rem',
          fontWeight: 500
        }}>
          {reward.desc || 'Fantastic work! You have maintained your consistency and boosted your cognitive skills.'}
        </p>

        {/* Rewards Payout Pills */}
        <div style={{
          display: 'flex',
          justify: 'center',
          gap: '0.85rem',
          marginBottom: '2rem'
        }}>
          {reward.xp > 0 && (
            <div style={{
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1.5px solid #FBBF24',
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 900,
              color: '#FBBF24',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)'
            }}>
              <Sparkles size={18} /> +{reward.xp} XP
            </div>
          )}

          {reward.gems > 0 && (
            <div style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1.5px solid #38BDF8',
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 900,
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.2)'
            }}>
              <Gem size={18} /> +{reward.gems} Gems
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.05rem',
            fontWeight: 900,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
            color: '#0B0E14',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4)',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '0.5rem'
          }}
        >
          <span>CLAIM REWARD & CONTINUE</span>
          <span>🔥</span>
        </button>
      </div>
    </div>
  );
};

export default RewardUnlockModal;

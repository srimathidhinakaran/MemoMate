import React from 'react';
import { Sparkles, Gem, X } from 'lucide-react';

const RewardUnlockModal = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(13, 17, 23, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div className="animate-scale-up" style={{
        backgroundColor: '#161B22',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        border: '1px solid #30363D',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9198A1'
          }}
        >
          <X size={22} />
        </button>

        <div style={{
          width: 76,
          height: 76,
          borderRadius: '20px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2.4rem'
        }}>
          {reward.icon || '🏆'}
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
          Achievement Unlocked!
        </span>

        <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', fontWeight: 800, margin: '0.4rem 0', fontFamily: 'var(--font-heading)' }}>
          {reward.title || 'Level Up!'}
        </h2>

        <p style={{ color: '#9198A1', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {reward.desc || 'Fantastic work! You have maintained your consistency and boosted your cognitive skills.'}
        </p>

        {/* Rewards Payout */}
        <div style={{
          display: 'flex',
          justify: 'center',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          {reward.xp > 0 && (
            <div style={{
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 800,
              color: '#FBBF24',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-heading)'
            }}>
              <Sparkles size={16} /> +{reward.xp} XP
            </div>
          )}

          {reward.gems > 0 && (
            <div style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 800,
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-heading)'
            }}>
              <Gem size={16} /> +{reward.gems} Gems
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}
        >
          Continue Workout 🔥
        </button>
      </div>
    </div>
  );
};

export default RewardUnlockModal;

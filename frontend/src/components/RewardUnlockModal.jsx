import React from 'react';
import { Sparkles, Trophy, Flame, Gem, X } from 'lucide-react';

const RewardUnlockModal = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(28, 59, 43, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 2000,
      padding: '1rem',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        padding: '2.2rem 2rem',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        border: '2px solid #A7F3D0',
        position: 'relative',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748B'
          }}
        >
          <X size={22} />
        </button>

        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          border: '3px solid #059669',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2.5rem',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)'
        }}>
          {reward.icon || '🏆'}
        </div>

        <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
          Achievement Unlocked!
        </span>

        <h2 style={{ fontSize: '1.8rem', color: '#1C3B2B', fontWeight: 800, margin: '0.4rem 0' }}>
          {reward.title || 'Level Up!'}
        </h2>

        <p style={{ color: '#536B5C', fontSize: '1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {reward.desc || 'Fantastic work! You have maintained your consistency and boosted your cognitive skills.'}
        </p>

        {/* Rewards Payout */}
        <div style={{
          display: 'flex',
          justify: 'center',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontWeight: 800,
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Sparkles size={16} /> +{reward.xp || 100} XP
          </div>

          <div style={{
            backgroundColor: '#DBEAFE',
            border: '1.5px solid #3B82F6',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontWeight: 800,
            color: '#1E40AF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Gem size={16} fill="#1E40AF" /> +{reward.gems || 25} Gems
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '1.05rem', fontWeight: 800 }}
        >
          Continue Workout 🔥
        </button>
      </div>
    </div>
  );
};

export default RewardUnlockModal;

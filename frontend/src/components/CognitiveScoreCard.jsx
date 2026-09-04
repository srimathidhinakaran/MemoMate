import React from 'react';
import { Brain, Target, RotateCcw, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CognitiveScoreCard = ({ memory, attention, recall, reaction }) => {
  const { profile, t } = useAuth();

  const memVal = memory !== undefined ? memory : (profile?.memoryScore || 70);
  const attVal = attention !== undefined ? attention : (profile?.attentionScore || 70);
  const recVal = recall !== undefined ? recall : (profile?.recallScore || 70);
  const reaVal = reaction !== undefined ? reaction : (profile?.reactionScore || 70);

  const scores = [
    { key: 'memory', label: t('memoryScore'), score: Number(memVal), icon: Brain, color: '#38BDF8' },
    { key: 'attention', label: t('attentionScore'), score: Number(attVal), icon: Target, color: '#FB923C' },
    { key: 'recall', label: t('recallScore'), score: Number(recVal), icon: RotateCcw, color: '#C084FC' },
    { key: 'reaction', label: t('reactionScore'), score: Number(reaVal), icon: Zap, color: '#34D399' }
  ];

  const minScoreVal = Math.min(...scores.map(s => s.score));

  const getStatusBadge = (score) => {
    if (score >= 85) {
      return { text: 'Master Tier 👑', badgeClass: 'badge-cyan' };
    } else if (score >= 75) {
      return { text: 'Optimal ↑', badgeClass: 'badge-purple' };
    } else if (score >= 65) {
      return { text: 'Consistent', badgeClass: 'badge-green' };
    } else {
      return { text: 'Focus Area 🎯', badgeClass: 'badge-flame' };
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      width: '100%'
    }}>
      {scores.map((c) => {
        const Icon = c.icon;
        const status = getStatusBadge(c.score);
        const isLowest = c.score === minScoreVal && c.score < 75;

        return (
          <div
            key={c.key}
            className="garden-card animate-fade-in"
            style={{
              padding: '1.3rem 1.4rem',
              borderColor: isLowest ? '#FB923C' : '#263142',
              backgroundColor: isLowest ? 'rgba(251, 146, 60, 0.08)' : '#161C26',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              borderRadius: '16px'
            }}
          >
            {/* Top Row: Icon + Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div className="icon-box" style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                backgroundColor: `${c.color}15`,
                border: `1px solid ${c.color}40`,
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Icon size={20} color={c.color} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {c.label}
              </span>
            </div>

            {/* Score Numerical Display */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: c.color, fontFamily: 'var(--font-heading)' }}>
                {c.score}
              </span>
              <span style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 700 }}>
                /100
              </span>
            </div>

            {/* Status Pill Badge */}
            <div>
              <span className={`badge ${status.badgeClass}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', fontWeight: 800 }}>
                {status.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CognitiveScoreCard;

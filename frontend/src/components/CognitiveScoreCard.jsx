import React from 'react';
import { Brain, Target, RotateCcw, Zap } from 'lucide-react';

const CognitiveScoreCard = ({ memory = 88, attention = 64, recall = 76, reaction = 71 }) => {
  const scores = [
    { key: 'memory', label: 'Memory', score: Number(memory) || 88, icon: Brain, color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.3)' },
    { key: 'attention', label: 'Attention', score: Number(attention) || 64, icon: Target, color: '#FF4E50', glow: 'rgba(255, 78, 80, 0.4)' },
    { key: 'recall', label: 'Recall', score: Number(recall) || 76, icon: RotateCcw, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.3)' },
    { key: 'reaction', label: 'Reaction', score: Number(reaction) || 71, icon: Zap, color: '#34D399', glow: 'rgba(52, 211, 153, 0.3)' }
  ];

  const minScoreVal = Math.min(...scores.map(s => s.score));

  const getStatusBadge = (score) => {
    if (score >= 80) {
      return { text: 'Stable & Strong', badgeClass: 'badge-cyan' };
    } else if (score >= 75) {
      return { text: 'Improving ↑', badgeClass: 'badge-purple' };
    } else if (score >= 70) {
      return { text: 'Consistent', badgeClass: 'badge-green' };
    } else {
      return { text: 'Needs More Practice 🎯', badgeClass: 'badge-flame' };
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
        const isLowest = c.score === minScoreVal && c.score < 80;

        return (
          <div
            key={c.key}
            className="garden-card animate-fade-in"
            style={{
              padding: '1.4rem 1.5rem',
              borderColor: isLowest ? '#FF4E50' : '#30363D',
              backgroundColor: isLowest ? 'rgba(255, 78, 80, 0.06)' : '#161B22',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: isLowest ? '0 0 25px rgba(255, 78, 80, 0.25)' : 'none',
              transition: 'all 0.3s ease',
              borderRadius: '16px'
            }}
          >
            {/* Top Row: Icon + Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                backgroundColor: `${c.color}15`,
                border: `1px solid ${c.color}40`,
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} color={c.color} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {c.label}
              </span>
            </div>

            {/* Score Numerical Display */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 900, color: c.color, fontFamily: 'var(--font-heading)' }}>
                {c.score}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#9198A1', fontWeight: 700 }}>
                /100
              </span>
            </div>

            {/* Status Pill Badge */}
            <div>
              <span className={`badge ${status.badgeClass}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', fontWeight: 700 }}>
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

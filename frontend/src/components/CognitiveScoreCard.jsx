import React from 'react';
import { Brain, Target, RotateCcw, Zap } from 'lucide-react';

const CognitiveScoreCard = ({ memory = 82, attention = 64, recall = 76, reaction = 71 }) => {
  const cards = [
    { label: 'Memory', score: memory, key: 'memory', icon: Brain, color: '#00F2FE', glow: 'rgba(0, 242, 254, 0.4)' },
    { label: 'Attention', score: attention, key: 'attention', icon: Target, color: '#FF4E50', glow: 'rgba(255, 78, 80, 0.4)', highlight: true },
    { label: 'Recall', score: recall, key: 'recall', icon: RotateCcw, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)' },
    { label: 'Reaction', score: reaction, key: 'reaction', icon: Zap, color: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      width: '100%'
    }}>
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className="garden-card animate-fade-in"
            style={{
              padding: '1.5rem',
              borderColor: c.color,
              backgroundColor: 'rgba(15, 20, 36, 0.85)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 0 20px ${c.glow}`
            }}
          >
            {c.highlight && (
              <span className="badge badge-flame" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.7rem' }}>
                FOCUS AREA
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${c.color}25 0%, rgba(15, 20, 36, 0.9) 100%)`,
                border: `1px solid ${c.color}`,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Icon size={22} color={c.color} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'var(--font-heading)' }}>
                {c.label.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: c.color, fontFamily: 'var(--font-esports)' }}>
                {c.score}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>/ 100 PTS</span>
            </div>

            {/* Glowing Score Progress Bar */}
            <div style={{
              width: '100%',
              height: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 9999,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${c.score}%`,
                height: '100%',
                backgroundColor: c.color,
                boxShadow: `0 0 10px ${c.color}`,
                borderRadius: 9999,
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CognitiveScoreCard;

import React from 'react';
import { Brain, Target, RotateCcw, Zap } from 'lucide-react';

const CognitiveScoreCard = ({ memory = 82, attention = 64, recall = 76, reaction = 71 }) => {
  const cards = [
    { label: 'Memory', score: memory, key: 'memory', icon: Brain, color: '#58755E', bg: '#EBF2EC', border: '#7C9A82' },
    { label: 'Attention', score: attention, key: 'attention', icon: Target, color: '#C87862', bg: '#FDF3F0', border: '#F4C3B2', highlight: true },
    { label: 'Recall', score: recall, key: 'recall', icon: RotateCcw, color: '#7A66A3', bg: '#F2EFF9', border: '#B8A7D9' },
    { label: 'Reaction', score: reaction, key: 'reaction', icon: Zap, color: '#3B7A8C', bg: '#EBF6F8', border: '#8EC5D2' }
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
              padding: '1.4rem',
              borderColor: c.border,
              backgroundColor: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {c.highlight && (
              <span className="badge badge-peach" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.75rem' }}>
                Focus Area
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                backgroundColor: c.bg,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Icon size={22} color={c.color} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C3B2B' }}>
                {c.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: c.color, fontFamily: 'var(--font-heading)' }}>
                {c.score}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#536B5C', fontWeight: 600 }}>/ 100</span>
            </div>

            {/* Score Progress Bar */}
            <div style={{
              width: '100%',
              height: 8,
              backgroundColor: c.bg,
              borderRadius: 9999,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${c.score}%`,
                height: '100%',
                backgroundColor: c.color,
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

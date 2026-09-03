import React from 'react';
import { Brain, Target, RotateCcw, Zap, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

const CognitiveScoreCard = ({ memory = 82, attention = 64, recall = 76, reaction = 71 }) => {
  const scores = [
    { key: 'memory', label: 'Memory', score: Number(memory) || 82, icon: Brain, color: '#00F2FE', glow: 'rgba(0, 242, 254, 0.4)' },
    { key: 'attention', label: 'Attention', score: Number(attention) || 64, icon: Target, color: '#FF4E50', glow: 'rgba(255, 78, 80, 0.4)' },
    { key: 'recall', label: 'Recall', score: Number(recall) || 76, icon: RotateCcw, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)' },
    { key: 'reaction', label: 'Reaction', score: Number(reaction) || 71, icon: Zap, color: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' }
  ];

  // Find lowest metric to dynamically highlight Focus Area
  const minScoreVal = Math.min(...scores.map(s => s.score));

  const getStatusBadge = (score) => {
    if (score >= 80) {
      return { text: 'Stable & Strong 💪', badgeClass: 'badge-cyan', color: '#00F2FE' };
    } else if (score >= 70) {
      return { text: 'Improving ↑', badgeClass: 'badge-purple', color: '#A855F7' };
    } else {
      return { text: 'Needs More Practice 🎯', badgeClass: 'badge-flame', color: '#FF4E50' };
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      width: '100%'
    }}>
      {scores.map((c) => {
        const Icon = c.icon;
        const status = getStatusBadge(c.score);
        const isLowest = c.score === minScoreVal;

        return (
          <div
            key={c.key}
            className="garden-card animate-fade-in"
            style={{
              padding: '1.5rem',
              borderColor: isLowest ? '#FF4E50' : c.color,
              backgroundColor: 'rgba(15, 20, 36, 0.88)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isLowest ? '0 0 25px rgba(255, 78, 80, 0.4)' : `0 0 18px ${c.glow}`,
              transition: 'all 0.3s ease'
            }}
          >
            {isLowest && (
              <span className="badge badge-flame" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                FOCUS AREA
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${c.color}25 0%, rgba(15, 20, 36, 0.9) 100%)`,
                border: `1px solid ${c.color}`,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Icon size={22} color={c.color} />
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'var(--font-heading)' }}>
                  {c.label.toUpperCase()}
                </span>
                <div style={{ fontSize: '0.75rem', marginTop: '0.1rem' }}>
                  <span className={`badge ${status.badgeClass}`} style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}>
                    {status.text}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.75rem 0' }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 900, color: c.color, fontFamily: 'var(--font-esports)' }}>
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
                width: `${Math.min(100, Math.max(5, c.score))}%`,
                height: '100%',
                backgroundColor: c.color,
                boxShadow: `0 0 12px ${c.color}`,
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

import React from 'react';
import { Brain, Target, RotateCcw, Zap, TrendingUp, TrendingDown, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CognitiveScoreCard = ({ memory, attention, recall, reaction, onStartBaseline }) => {
  const { profile, t } = useAuth();

  const isAssessed = profile?.assessed !== false && profile?.memoryScore !== null && profile?.memoryScore !== undefined;

  const memVal = memory !== undefined ? memory : profile?.memoryScore;
  const attVal = attention !== undefined ? attention : profile?.attentionScore;
  const recVal = recall !== undefined ? recall : profile?.recallScore;
  const reaVal = reaction !== undefined ? reaction : profile?.reactionScore;

  const memTrend = profile?.memoryTrend || 0;
  const attTrend = profile?.attentionTrend || 0;
  const recTrend = profile?.recallTrend || 0;
  const reaTrend = profile?.reactionTrend || 0;

  const scores = [
    { key: 'memory', label: t('memoryScore') || 'Memory Index', score: memVal, trend: memTrend, icon: Brain, color: '#38BDF8' },
    { key: 'attention', label: t('attentionScore') || 'Focus & Attention', score: attVal, trend: attTrend, icon: Target, color: '#FB923C' },
    { key: 'recall', label: t('recallScore') || 'Recall Speed', score: recVal, trend: recTrend, icon: RotateCcw, color: '#C084FC' },
    { key: 'reaction', label: t('reactionScore') || 'Reaction Time', score: reaVal, trend: reaTrend, icon: Zap, color: '#34D399' }
  ];

  const getStatusBadge = (score) => {
    if (score === null || score === undefined) {
      return { text: t('notAssessed') || 'Not assessed', badgeClass: 'badge-cyan' };
    }
    if (score >= 85) {
      return { text: `${t('masterTier') || 'Master Tier'} 👑`, badgeClass: 'badge-cyan' };
    } else if (score >= 75) {
      return { text: `${t('optimal') || 'Optimal'} ↑`, badgeClass: 'badge-purple' };
    } else if (score >= 65) {
      return { text: t('consistent') || 'Consistent', badgeClass: 'badge-green' };
    } else {
      return { text: `${t('focusArea') || 'Focus Area'} 🎯`, badgeClass: 'badge-flame' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {!isAssessed && (
        <div className="garden-card" style={{
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          borderColor: '#38BDF8',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-box" style={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38BDF8' }}>
              <Sparkles size={22} color="#38BDF8" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                {t('letsBuildProfile') || "Let's build your cognitive profile"}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                {t('baselinePromptSub') || 'Complete a 2-minute baseline assessment to measure your starting point.'}
              </div>
            </div>
          </div>
          {onStartBaseline && (
            <button onClick={onStartBaseline} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              <span>{t('startBaseline') || 'Start Baseline Assessment'}</span>
            </button>
          )}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        width: '100%'
      }}>
        {scores.map((c) => {
          const Icon = c.icon;
          const status = getStatusBadge(c.score);
          const hasScore = c.score !== null && c.score !== undefined;

          return (
            <div
              key={c.key}
              className="garden-card animate-fade-in"
              style={{
                padding: '1.3rem 1.4rem',
                borderColor: '#263142',
                backgroundColor: '#161C26',
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

              {/* Score Numerical Display or Not Assessed */}
              {hasScore ? (
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: c.color, fontFamily: 'var(--font-heading)' }}>
                      {c.score}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 700 }}>
                      /100
                    </span>
                  </div>

                  {c.trend !== 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: c.trend > 0 ? '#34D399' : '#FB923C',
                      backgroundColor: c.trend > 0 ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 146, 60, 0.12)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      {c.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{c.trend > 0 ? `+${c.trend}` : c.trend}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ margin: '0.6rem 0 1rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94A3B8', fontFamily: 'var(--font-heading)' }}>
                    {t('notAssessed') || 'Not assessed'}
                  </span>
                </div>
              )}

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
    </div>
  );
};

export default CognitiveScoreCard;
